import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Profile.css';
import { useAuth } from '../../context/User.context.jsx';

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const api = axios.create({
    withCredentials: true,
  });

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await api.get("/api/user/present/user");
        setUser(response.data?.user);
      } catch (error) {
        console.error("Error fetching user:", error);
        setError(error.response?.data?.message || "Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [api]); // Add api to dependency array

  if (loading) {
    return <p>Loading user data...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (!user) {
    return <p>No user data available</p>;
  }

  return (
    <div className="profile-container">
      <img src={user.avatar} alt="User Avatar" className="profile-avatar" />
      <h2>{user.fullName}</h2>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>

      {user.coverImage && (
        <img src={user.coverImage} alt="Cover" className="profile-cover" />
      )}

      <div className="profile-details">
        {Object.keys(user)
          .filter(key => !["avatar", "coverImage", "password", "refreshToken", "_id", "__v"].includes(key))
          .map(key => (
            <p key={key} className="profile-detail">
              <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {user[key]}
            </p>
          ))}
      </div>
    </div>
  );
}

export default Profile;