
// Rating Routes:
// PUT /rating - Add or update a rating (both Recruiter and Applicant)

// GET /rating - Get personal rating given to a job or applicant

router.put("/rating", jwtAuth, addOrUpdateRating); // Add/update rating (Both)
router.get("/rating", jwtAuth, getRating); // Get user's rating (Both)