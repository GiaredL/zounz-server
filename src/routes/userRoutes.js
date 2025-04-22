import express from "express";
import multer from "multer";
import { UserService } from "../services/UserService.js";
import { UserRepository } from "../repositories/UserRepository.js";

const upload = multer({ dest: "uploads/" });
const router = express.Router();

// Initialize repository and service
const userRepository = new UserRepository();
const userService = new UserService(userRepository);

router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await userService.signup({ username, email, password });

    req.session.userId = user._id;

    res.status(201).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(400).json({ message: err.message || "Error creating user" });
  }
});

router.get("/user", async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await userService.getUserProfile(userId);
    res.json({ user });
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: err.message || "Error fetching user" });
  }
});

router.post("/image", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    res.status(200).json({
      message: "Image uploaded successfully",
      file: {
        filename: req.file.filename,
        path: req.file.path,
      },
    });
  } catch (err) {
    console.error("Error uploading image:", err);
    res.status(500).json({ message: "Error uploading image" });
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json({ users });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: err.message || "Error fetching users" });
  }
});

router.get("/users/search", async (req, res) => {
  try {
    const searchTerm = req.query.term;
    const users = await userService.searchUsers(searchTerm);
    res.json({ users });
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ message: error.message || "Error searching users" });
  }
});

export default router;
