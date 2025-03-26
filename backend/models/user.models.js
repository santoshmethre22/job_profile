import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.+\@.+\..+/, "Please enter a valid email"], // Basic email validation
    },
    password: {
      type: String,
      required: true,
  
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    role: {
      type: String,
      enum: ["recruiter", "applicant"],
      required: true,
    },
    refreshToken: {
      type: String,
     // Sensitive field
    },
    avatar: {
      type: String, // Cloudinary URL
      required: true,
    },
    coverImage: {
      type: String, // Cloudinary URL (optional)
    },
  },
  {
    timestamps: true,
    collation: { locale: "en", strength: 2 }, // Case-insensitive sorting
  }
);

// --- Middleware ---
// Convert email to lowercase before saving

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10); // Salt rounds = 10
  next();
});

// --- Methods ---
// Compare entered password with hashed password
userSchema.methods.isPasswordCorrect = async function(enteredPassword) {
  if (!enteredPassword) {
    throw new Error("No password provided for comparison");
  }
  if (!this.password) {
    throw new Error("User has no password set");
  }
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT access token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      role: this.role, // Include role for authorization
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m" } // Default 15 minutes
  );
};

// Generate JWT refresh token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id }, // Minimal payload
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d" } // Default 7 days
  );
};

export const User = mongoose.model("User", userSchema);