// Job Routes:
// POST /jobs - Add a new job (Recruiter only)

// GET /jobs - Get all jobs (with filtering and sorting options)

// GET /jobs/:id - Get info about a specific job

// PUT /jobs/:id - Update a job (Recruiter only)

// DELETE /jobs/:id - Delete a job (Recruiter only)

// Application Routes:
// POST /jobs/:id/applications - Apply for a job (Applicant only)

// GET /jobs/:id/applications - Get applications for a specific job (Recruiter only)

// GET /applications - Get all applications for current user (both Recruiter and Applicant)

// PUT /applications/:id - Update application status

// User Routes:
// GET /user - Get current user's personal details

// GET /user/:id - Get user details by ID

// PUT /user - Update user details

// Applicant Routes (for Recruiters):
// GET /applicants - Get final applicants for jobs (Recruiter only)

// Rating Routes:
// PUT /rating - Add or update a rating (both Recruiter and Applicant)

// GET /rating - Get personal rating given to a job or applicant

// All routes are protected by JWT authentication middleware (jwtAuth), and 
// many have additional authorization checks based on user type (recruiter/applicant).
//  The routes support various query parameters for filtering, sorting, and pagination
//   (though pagination is currently commented out).