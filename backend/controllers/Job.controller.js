import { Job } from "../models/Job.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Add new job (Recruiter only)
const addJob = asyncHandler(async (req, res) => {
    if (req.user.type !== "recruiter") {
        throw new ApiError(403, "Only recruiters can add jobs");
    }

    const { 
        title, 
        description, 
        requirements, 
        location, 
        salary,
        maxApplicants,
        maxPositions,
        deadline,
        skillsets,
        jobType,
        duration
    } = req.body;
    
    // Validate required fields
    const requiredFields = ['title', 'description', 'location', 'salary', 'deadline', 'jobType'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
        throw new ApiError(400, `Missing required fields: ${missingFields.join(', ')}`);
    }

    // Create job with all fields
    const job = await Job.create({
        userId: req.user._id,
        title,
        description,
        requirements: requirements || [],
        location,
        salary,
        maxApplicants: maxApplicants || 1,
        maxPositions: maxPositions || 1,
        deadline,
        skillsets: skillsets || [],
        jobType,
        duration: duration || 0
    });

    return res.status(201).json(
        new ApiResponse(201, job, "Job created successfully")
    );
});

// Get all jobs with filters and pagination
const getAllJobs = asyncHandler(async (req, res) => {
    const { 
        location, 
        minSalary, 
        title, 
        jobType,
        page = 1,
        limit = 10
        
    } = req.query;
    
    const filter = {};
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (minSalary) filter.salary = { $gte: Number(minSalary) };
    if (title) filter.title = { $regex: title, $options: 'i' };
    if (jobType) filter.jobType = jobType;

    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { createdAt: -1 }
    };

    const jobs = await Job.paginate(filter, options);

    return res.status(200).json(
        new ApiResponse(200, jobs, "Jobs retrieved successfully")
    );
});

// Get single job by ID with applications populated
const getJobById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const job = await Job.findById(id).populate({
        path: 'applications',
        select: '-__v -createdAt -updatedAt'
    });

    if (!job) {
        throw new ApiError(404, "Job not found");
    }

    return res.status(200).json(
        new ApiResponse(200, job, "Job retrieved successfully")
    );
});

// Update job (Recruiter only)
const updateJob = asyncHandler(async (req, res) => {
    if (req.user.type !== "recruiter") {
        throw new ApiError(403, "Only recruiters can update jobs");
    }

    const { id } = req.params;
    const updateData = req.body;

    // Prevent updating certain fields
    const restrictedFields = ['userId', '_id', 'createdAt', 'updatedAt'];
    restrictedFields.forEach(field => delete updateData[field]);

    const job = await Job.findOneAndUpdate(
        { _id: id, userId: req.user._id },
        updateData,
        { 
            new: true, 
            runValidators: true,
            context: 'query' // Ensures validators run with updated data
        }
    );

    if (!job) {
        throw new ApiError(404, "Job not found or you don't have permission");
    }

    return res.status(200).json(
        new ApiResponse(200, job, "Job updated successfully")
    );
});

// Delete job (Recruiter only)
const deleteJob = asyncHandler(async (req, res) => {
    if (req.user.type !== "recruiter") {
        throw new ApiError(403, "Only recruiters can delete jobs");
    }

    const { id } = req.params;

    const job = await Job.findOneAndDelete({ 
        _id: id, 
        userId: req.user._id 
    });

    if (!job) {
        throw new ApiError(404, "Job not found or you don't have permission");
    }

    return res.status(200).json(
        new ApiResponse(200, null, "Job deleted successfully")
    );
});

export { 
    addJob, 
    getAllJobs, 
    getJobById, 
    updateJob, 
    deleteJob 
};