import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: true, // Fix: "require" → "required"
      trim: true,
    },
    password: {
      type: String,
      required: true, // Fix: "require" → "required"
    },
    role: {
      type: String,
      enum: ["recruiter", "applicant"],
      required: true,
    },
  },
  {
    timestamps: true, // Fix: Typo corrected
    collation: { locale: "en" }, // Enables case-insensitive sorting
  }
);

// Ensure email is stored in lowercase
userSchema.pre("save", function (next) {
  if (this.email) {
    this.email = this.email.toLowerCase();
  }
  next();
});

export const User = mongoose.model("User", userSchema);
