import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  register,
  login,
  logoutUser,
  getUserProfile,
  getUserById,
  updateUserProfile,
} from "../controllers/User.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const router = express.Router();

// ======================
// ** Public Routes **
// ======================

// Register a new user (with avatar & cover image upload)
router.post(
  "/register",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  register
);

// Login user
router.post("/login", login);

// ======================
// ** Protected Routes (JWT Auth Required) **
// ======================

// Logout user (clears cookies)
router.post("/logout", verifyJWT, logoutUser);

// Get current user's profile (Both Recruiter & Applicant)
router.get("/get-user", verifyJWT, getUserProfile);

// Get user by ID (Both Recruiter & Applicant)
router.get("/:id", verifyJWT, getUserById);

// Update user profile (Both Recruiter & Applicant)
router.put("/update-user", verifyJWT, updateUserProfile);

export default router;