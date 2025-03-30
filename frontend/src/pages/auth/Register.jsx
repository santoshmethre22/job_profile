import { useState } from 'react';
import { useAuth } from "../../context/User.context.jsx";
import { useNavigate, Link } from 'react-router-dom';
import './Register.css'; // Import CSS file

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    role: 'applicant'
  });

  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, setter) => {
    if (e.target.files && e.target.files[0]) {
      setter(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = new FormData();
      
      
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      if (avatar) data.append('avatar', avatar);
      if (coverImage) data.append('coverImage', coverImage);

      await register(data);
      navigate('/dashboard');



    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">

        <h2>Create Your Account</h2>

        {error && <p className="error">{error}</p>}
        
        <form onSubmit={handleSubmit} className="register-form">
          <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required />
          
          <select name="role" value={formData.role} onChange={handleChange} required>
            <option value="applicant">Job Applicant</option>
            <option value="recruiter">Recruiter</option>
          </select>

          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />

          <label className="file-upload">
            Upload Avatar:
            <input type="file" onChange={(e) => handleFileChange(e, setAvatar)} accept="image/*" required />
          </label>

          <label className="file-upload">
            Upload Cover Image:
            <input type="file" onChange={(e) => handleFileChange(e, setCoverImage)} accept="image/*" />
          </label>

          <button type="submit" className="register-btn" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p>Already have an account? <Link to="/login" className="login-link">Login</Link></p>
      </div>
    </div>
  );
};

export default Register;
