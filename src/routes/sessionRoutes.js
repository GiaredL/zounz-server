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

    req.session.userId = user._id;
    console.log(
      `Login successful: setting session for user ${userName}, ID: ${user._id}, session ID: ${req.session.id}`
    );

    res.json({
      user: {
        id: user._id,
        username: user.username,
        name: user.username,
        email: user.email,
      },
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
    if (!req.session || !req.session.userId) {
      return res.json({ authenticated: false });
    }

    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.json({ authenticated: false });
    }

    res.json({
      authenticated: true,
      user: {
        id: user._id,
        username: user.username,
        name: user.username,
        email: user.email,
        state: user.state || "",
        city: user.city || "",
        streams: user.streams || 0,
        bio: user.bio || "",
        image: user.image || "",
      },
    });
  } catch (err) {
    console.error("Session check error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
