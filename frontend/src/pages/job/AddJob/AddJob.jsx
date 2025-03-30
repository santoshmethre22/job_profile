import React, { useState } from "react";
import { useJob } from "../../../context/Job.context";
import "./AddJob.css"; // Import the CSS file

function AddJob() {
  const { addJob } = useJob();

  const [jobDetails, setJobDetails] = useState({
    title: "",
    description: "",
    requirements: [],
    location: "",
    salary: 0,
    maxApplicants: 1,
    maxPositions: 1,
    deadline: "",
    skillsets: [],
    jobType: "",
    duration: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;
    if (["salary", "maxApplicants", "maxPositions", "duration"].includes(name)) {
      newValue = value === "" ? "" : Number(value);
    } else if (["skillsets", "requirements"].includes(name)) {
      newValue = value.split(",").map((item) => item.trim()); // Convert comma-separated strings to array
    }

    setJobDetails({ ...jobDetails, [name]: newValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedJobDetails = {
      ...jobDetails,
      salary: Number(jobDetails.salary) || 0,
      maxApplicants: Number(jobDetails.maxApplicants) || 1,
      maxPositions: Number(jobDetails.maxPositions) || 1,
      deadline: jobDetails.deadline ? new Date(jobDetails.deadline).toISOString() : "",
    };

    try {
      await addJob(formattedJobDetails);
      alert("Job added successfully!");
      setJobDetails({
        title: "",
        description: "",
        requirements: [],
        location: "",
        salary: 0,
        maxApplicants: 1,
        maxPositions: 1,
        deadline: "",
        skillsets: [],
        jobType: "",
        duration: 0,
      });
    } catch (error) {
      alert("Failed to add job: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="add-job-container">
      <div className="add-job-card">
        <h1 className="add-job-title">Add Job</h1>
        <form onSubmit={handleSubmit} className="add-job-form">
          {Object.keys(jobDetails).map((key) => (
            <div key={key} className="add-job-field">
              <label className="add-job-label">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>

              {key === "jobType" ? (
                <select name={key} value={jobDetails[key]} onChange={handleChange} required>
                  <option value="">Select Job Type</option>
                  <option value="full-time">Full-Time</option>
                  <option value="part-time">Part-Time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                  <option value="remote">Remote</option>
                </select>
              ) : key === "deadline" ? (
                <input
                  type="date"
                  name={key}
                  value={jobDetails[key]}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]} // Restrict past dates
                  required
                />
              ) : (
                <input
                  type={
                    ["salary", "maxApplicants", "maxPositions", "duration"].includes(key)
                      ? "number"
                      : "text"
                  }
                  name={key}
                  value={
                    Array.isArray(jobDetails[key])
                      ? jobDetails[key].join(", ")
                      : jobDetails[key]
                  }
                  onChange={handleChange}
                  className="add-job-input"
                  required
                  placeholder={`Enter ${key}`}
                />
              )}
            </div>
          ))}
          <button type="submit" className="add-job-button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddJob;
