// Job Routes:
// POST /jobs - Add a new job (Recruiter only)

// GET /jobs - Get all jobs (with filtering and sorting options)

// GET /jobs/:id - Get info about a specific job

// PUT /jobs/:id - Update a job (Recruiter only)

// DELETE /jobs/:id - Delete a job (Recruiter only)


import express from "express"
import {
    addJob, 
    getAllJobs, 
    getJobById, 
    updateJob, 
    deleteJob ,
    addedjobs
}
from "../controllers/Job.controller.js"

import {verifyJWT} from "../middleware/auth.middleware.js"


const router=express.Router();

router.post("/add-job", verifyJWT, addJob); // Add a new job (Recruiter)


router.get("/get-all-job", getAllJobs); // Get all jobs (filtered)


router.get("/get-jojb/:id", verifyJWT, getJobById); // Get a single job

router.put("/update/:id", verifyJWT, updateJob); // Update job (Recruiter)

router.delete("/delete/:id", verifyJWT, deleteJob); // Delete job (Recruiter)


router.get("/added-jobs",verifyJWT,addedjobs)// added job of the user 

export default router;