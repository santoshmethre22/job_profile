import { asyncHandler } from "../utils/asyncHandler.js";
import { Application } from "../models/Application.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Job } from "../models/Job.model.js";

// Apply for Job
const applyForJob = asyncHandler(async (req, res) => {
    const { sop } = req.body;
    const userId = req.user._id;
    const jobId = req.params.id;

    // Validate applicant type
    if (req.user.type !== "applicant") {
        throw new ApiError(403, "Only applicants can apply for jobs");
    }

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
        throw new ApiError(404, "Job not found");
    }

    // Check if already applied=----------
    const existingApplication = await Application.findOne({
        userId,
        jobId,
        status: { $nin: ["rejected", "cancelled", "deleted"] }
    });
    if (existingApplication) {
        throw new ApiError(400, "You have already applied for this job");
    }

    // Validate SOP word count
    const wordCount = sop.split(/\s+/).length;
    if (wordCount > 250) {
        throw new ApiError(400, "Statement of purpose cannot exceed 250 words");
    }

    // Create application
    const application = await Application.create({
        userId,
        recruiterId: job.userId,
        jobId,
        sop,
        status: "applied"
    });

    return res.status(201).json(
        new ApiResponse(201, application, "Application submitted successfully")
    );
});

// Get Applications for a Job (Recruiter Only)
const getJobApplications = asyncHandler(async (req, res) => {
    const jobId = req.params.id;
    const userId = req.user._id;

    // Verify job exists and belongs to recruiter
    const job = await Job.findOne({ _id: jobId, userId });
    if (!job) {
        throw new ApiError(404, "Job not found or unauthorized access");
    }

    // Get applications with pagination
    const { status, page = 1, limit = 10 } = req.query;
    const filter = { jobId };
    if (status) filter.status = status;

    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { createdAt: -1 },
        populate: {
            path: "userId",
            select: "fullName email"
        }
    };

    const applications = await Application.paginate(filter, options);

    return res.status(200).json(
        new ApiResponse(200, applications, "Applications retrieved successfully")
    );
});

// Get User's Applications
const getUserApplications = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { status, page = 1, limit = 10 } = req.query;

    const filter = { userId };
    if (status) filter.status = status;

    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { createdAt: -1 },
        populate: {
            path: "jobId",
            select: "title description location salary"
        }
    };

    const applications = await Application.paginate(filter, options);

    return res.status(200).json(
        new ApiResponse(200, applications, "Applications retrieved successfully")
    );
});

// Update Application Status
const updateApplication = asyncHandler(async (req, res) => {
    const applicationId = req.params.id;
    const { status } = req.body;
    const userId = req.user._id;

    // Validate status update
    const validStatusUpdates = {
        recruiter: ["shortlisted", "accepted", "rejected"],
        applicant: ["cancelled"]
    };

    if (!validStatusUpdates[req.user.type].includes(status)) {
        throw new ApiError(400, "Invalid status update for your role");
    }

    // Find and update application
    const application = await Application.findOneAndUpdate(
        {
            _id: applicationId,
            [req.user.type === "recruiter" ? "recruiterId" : "userId"]: userId
        },
        { status },
        { new: true, runValidators: true }
    );

    console.log(application)

    if (!application) {
        throw new ApiError(404, "Application not found or unauthorized");
    }

    // If application is accepted, reject all others for this job
    if (status === "accepted") {
        await Application.updateMany(
            {
                jobId: application.jobId,
                _id: { $ne: applicationId },
                status: { $in: ["applied", "shortlisted"] }
            },
            { status: "rejected" }
        );
    }

    return res.status(200).json(
        new ApiResponse(200, application, "Application status updated successfully")
    );
});

export {
    applyForJob,
    getJobApplications,
    getUserApplications,
    updateApplication
};