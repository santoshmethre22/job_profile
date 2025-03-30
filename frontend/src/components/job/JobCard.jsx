import React, { useEffect } from 'react';
import { useJob } from '../../context/Job.context.jsx';
import './JobCard.css'; // Import the CSS file

function JobCard() {
  const { added, addedjobs } = useJob();

  useEffect(() => {
    if (!Array.isArray(added) || added.length === 0) {
      addedjobs();  // Fetch jobs when the component loads
    }
  }, []); // Empty dependency array to call only on mount

  return (
    <div className="job-list">
      <h2 className="job-list-title">Job Listings</h2>
      {Array.isArray(added) && added.length === 0 ? (
        <p className="no-jobs-message">No jobs available</p>
      ) : (
        (Array.isArray(added) ? added : []).map((job, index) => (
          <div key={index} className="job-card">
            {Object.keys(job).map((key) => (
              <p key={key} className="job-detail">
                <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {job[key]}
              </p>
            ))}
          </div>
        ))
      )}
    </div>
  );
}

export default JobCard;
