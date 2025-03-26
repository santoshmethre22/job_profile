// Job Routes:
// POST /jobs - Add a new job (Recruiter only)

// GET /jobs - Get all jobs (with filtering and sorting options)

// GET /jobs/:id - Get info about a specific job

// PUT /jobs/:id - Update a job (Recruiter only)

// DELETE /jobs/:id - Delete a job (Recruiter only)


router.post("/jobs", jwtAuth, addJob); // Add a new job (Recruiter)
router.get("/jobs", jwtAuth, getAllJobs); // Get all jobs (filtered)
router.get("/jobs/:id", jwtAuth, getJobById); // Get a single job
router.put("/jobs/:id", jwtAuth, updateJob); // Update job (Recruiter)
router.delete("/jobs/:id", jwtAuth, deleteJob); // Delete job (Recruiter)
