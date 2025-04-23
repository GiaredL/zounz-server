import express from "express";
import { User } from "../models/user.js";
const router = express.Router();

router.post("/signin", async (req, res) => {
  try {
    const { userName, password } = req.body;
    console.log(`Login attempt for user: ${userName}`);

    const user = await User.findOne({ username: userName });

    if (!user) {
      console.log(`Login failed: user ${userName} not found`);
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      console.log(`Login failed: invalid password for user ${userName}`);
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Clear any existing session data first
    req.session.regenerate((regErr) => {
      if (regErr) {
        console.error("Session regeneration error:", regErr);
        return res.status(500).json({ message: "Session error" });
      }

      // Set the user ID in session
      req.session.userId = user._id;
      req.session.username = user.username; // Add username for easier debugging

      console.log(
        `Login successful: setting session for user ${userName}, ID: ${user._id}, session ID: ${req.session.id}`
      );

      // Save the session explicitly
      req.session.save((saveErr) => {
        if (saveErr) {
          console.error("Session save error:", saveErr);
          return res.status(500).json({ message: "Error saving session" });
        }

        console.log("Session saved successfully");

        // Set a simple session cookie as a backup
        res.cookie("loggedIn", "true", {
          maxAge: 86400000, // 1 day
          httpOnly: true,
          path: "/",
        });

        // Send the response with user data
        res.json({
          user: {
            id: user._id,
            username: user.username,
            name: user.username,
            email: user.email,
          },
        });
      });
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/signout", (req, res) => {
  console.log(
    `Signout request. Session ID: ${req.session.id}, User ID: ${req.session.userId}`
  );

  req.session.destroy((err) => {
    if (err) {
      console.error("Signout error:", err);
      return res.status(500).json({ message: "Could not sign out" });
    }
    console.log("Session destroyed successfully");
    res.clearCookie(process.env.SESS_NAME);
    res.json({ message: "Signed out successfully" });
  });
});

router.get("/check", async (req, res) => {
  try {
    console.log(`Session check. Session ID: ${req.session.id}`);
    console.log("Session data:", req.session);
    console.log("Cookies received:", req.headers.cookie);

    // Check for session
    if (req.session.userId) {
      console.log(`Finding user with ID: ${req.session.userId}`);
      const user = await User.findById(req.session.userId);

      if (user) {
        console.log(`User authenticated: ${user.username}`);
        return res.json({
          authenticated: true,
          user: {
            id: user._id,
            username: user.username,
            name: user.username,
            email: user.email,
          },
        });
      } else {
        console.log(`User not found for session ID: ${req.session.id}`);
        return res.json({ authenticated: false, reason: "user_not_found" });
      }
    }

    // Check for backup cookie as fallback
    if (req.cookies && req.cookies.loggedIn === "true") {
      console.log(
        "No session but 'loggedIn' cookie found - try to restore session"
      );
      return res.json({
        authenticated: true,
        fromCookie: true,
        message: "Using backup cookie authentication",
      });
    }

    console.log("No user ID in session or backup cookie");
    return res.json({ authenticated: false, reason: "no_session" });
  } catch (err) {
    console.error("Session check error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
