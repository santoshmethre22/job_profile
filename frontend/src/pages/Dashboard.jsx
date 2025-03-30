import React, { useEffect, useState } from 'react';
import JobCard from '../components/job/JobCard.jsx';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'; // Import the CSS file


function Dashboard() {
 

  const navigate=useNavigate();


  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Hello, Welcome!</h1>

      <JobCard />

      <button className="add-job-button" onClick={() => navigate('/add-job')}>
        Add Job
      </button>
    </div>
  );
}

export default Dashboard;
