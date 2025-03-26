// Application Routes:
// POST /jobs/:id/applications - Apply for a job (Applicant only)

// GET /jobs/:id/applications - Get applications for a specific job (Recruiter only)

// GET /applications - Get all applications for current user (both Recruiter and Applicant)

// PUT /applications/:id - Update application status




// Applicant Routes (for Recruiters):
// GET /applicants - Get final applicants for jobs (Recruiter only)


router.post("/jobs/:id/applications", jwtAuth, applyForJob); // Apply for job (Applicant)
router.get("/jobs/:id/applications", jwtAuth, getJobApplications); // Get apps for a job (Recruiter)
router.get("/applications", jwtAuth, getUserApplications); // Get user's apps (Both)
router.put("/applications/:id", jwtAuth, updateApplication); // Update app status

router.get("/applicants", jwtAuth, getApplicants); // Get applicants for jobs