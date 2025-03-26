// User Controllers:

import { User } from "../models/User.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Recruiter } from "../models/Recuiter.model.js";
import { JobApplicant } from "../models/JobApplicant.model.js";

import {uploadOnCloudinary} from "../utils/cloudinary.js"

const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId); // Fixed: userId instead of user
    if (!user) throw new ApiError(404, "User not found");

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

// Register User
const register = asyncHandler(async (req, res) => {
  // 1. Destructure all required fields including role
  const { fullName, email, username, password, role } = req.body; 
  
  // 2. Validate all required fields including role
  if ([fullName, email, username, password, role].some((field) => !field?.trim())) {
    throw new ApiError(400, "All fields are required");
  }

  // 3. Validate role is either 'recruiter' or 'applicant'
  if (!['recruiter', 'applicant'].includes(role.toLowerCase())) {
    throw new ApiError(400, "Role must be either 'recruiter' or 'applicant'");
  }

  // 4. Check for existing user
  const existedUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existedUser) {
    throw new ApiError(409, "User already exists. Please login.");
  }

  // 5. Handle file uploads
  const avatarLocalPath = req.files?.avatar[0]?.path;
  let coverImageLocalPath;
  if (req.files?.coverImage && req.files.coverImage.length > 0) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  // 6. Upload to Cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null;

  if (!avatar) {
    throw new ApiError(400, "Avatar upload failed");
  }

  // 7. Create user with all required fields including role
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
    role: role.toLowerCase() // Add role here
  });

  // 8. Return response without sensitive data
  const createdUser = await User.findById(user._id).select("-password -refreshToken");
  if (!createdUser) {
    throw new ApiError(500, "Failed to create user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});
// Login User
const login = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  // 2. Validate input (more thorough validation)
  if (!username && !email) {
    throw new ApiError(400, "Username or email is required");
  }
  if (!password) {
    throw new ApiError(400, "Password is required");
  }

  // 3. Find user (case-insensitive search)
  const user = await User.findOne({
    $or: [
      { username: username?.toLowerCase() }, 
      { email: email?.toLowerCase() }
    ]
  });

  if (!user) {
    throw new ApiError(404, "Invalid credentials"); // Generic message for security
  }

  // 4. Verify password
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  // 5. Generate tokens
  const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);

  // 6. Get user without sensitive data
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "Login successful")
    );
});




//------------------------------------------------------------------>
// Logout User
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});

// Refresh Access Token (Placeholder)
const refreshAccessToken = asyncHandler(async (req, res) => {
  // Implementation pending
});

// Get Current User Profile
const getUserProfile = asyncHandler(async (req, res) => {
  try {
    const user =
      req.user.type === "recruiter"
        ? await Recruiter.findOne({ userId: req.user._id })
        : await JobApplicant.findOne({ userId: req.user._id });
    res.status(200).json(new ApiResponse(200, user, "User profile fetched"));
  } catch (err) {
    throw new ApiError(400, "Error fetching user profile");
  }
});

// Get User by ID
const getUserById = asyncHandler(async (req, res) => {
  const userId = req.params.id; // Fixed: req.params._id → req.params.id
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const userDetails =
    user.type === "recruiter"
      ? await Recruiter.findOne({ userId: user._id })
      : await JobApplicant.findOne({ userId: user._id });

  return res
    .status(200)
    .json(new ApiResponse(200, userDetails, "User data fetched successfully"));
});

// Update User Profile
const updateUserProfile = asyncHandler(async (req, res) => {
  const model = req.user.type === "recruiter" ? Recruiter : JobApplicant;
  const updatedUser = await model.findByIdAndUpdate(
    req.user._id,
    req.body,
    { new: true }
  );

  if (!updatedUser) {
    throw new ApiError(400, "Failed to update user");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Profile updated successfully"));
});

export {
  register,
  login,
  logoutUser,
  getUserProfile,
  getUserById,
  updateUserProfile,
  refreshAccessToken,
};