// Application Routes:
// POST /jobs/:id/applications - Apply for a job (Applicant only)

// GET /jobs/:id/applications - Get applications for a specific job (Recruiter only)

// GET /applications - Get all applications for current user (both Recruiter and Applicant)

// PUT /applications/:id - Update application status




// Applicant Routes (for Recruiters):
// GET /applicants - Get final applicants for jobs (Recruiter only)
import express from "express"
import { verifyJWT } from "../middleware/auth.middleware.js";

const router=express.Router();

router.post("/jobs/:id/applications", verifyJWT, applyForJob); // Apply for job (Applicant)
router.get("/jobs/:id/applications", verifyJWT, getJobApplications); // Get apps for a job (Recruiter)
router.get("/applications", verifyJWT, getUserApplications); // Get user's apps (Both)
router.put("/applications/:id", verifyJWT, updateApplication); // Update app status

router.get("/applicants", verifyJWT, getApplicants); // Get applicants for jobs