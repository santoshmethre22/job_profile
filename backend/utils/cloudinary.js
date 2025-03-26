import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { ApiError } from '../utils/ApiError.js'; // Assuming you have an error handler

// Configure with timeout and retry settings
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
  timeout: 30000, // 30 seconds timeout
});

const uploadOnCloudinary = async (localFilePath) => {
  if (!localFilePath) {
    throw new ApiError(400, "No file path provided");
  }

  // Verify file exists before uploading
  if (!fs.existsSync(localFilePath)) {
    throw new ApiError(400, "File does not exist");
  }

  try {
    // Upload with chunked transfer and retry logic
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      chunk_size: 6000000, // 6MB chunks
      timeout: 30000, // 30 seconds per chunk
    });

    // Clean up local file
    fs.unlinkSync(localFilePath);
    return response;

  } catch (error) {
    // Clean up local file if it exists
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    // Handle specific Cloudinary errors
    if (error.message.includes('ECONNRESET')) {
      throw new ApiError(500, "Connection reset during upload. Please try again.");
    }

    throw new ApiError(500, `Upload failed: ${error.message}`);
  }
};

export { uploadOnCloudinary };