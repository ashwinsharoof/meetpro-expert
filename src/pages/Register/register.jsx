import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style/register.css';

export default function GetStarted() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/ExpertDetailsForm', { state: formData });
  };

  return (
    <div className="form-wrapper">
      <form onSubmit={handleSubmit}>
        <h2>Create Account</h2>
        <div className="form-group">
          <label>Username</label>
          <input name="username" type="text" required value={formData.username} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input name="email" type="email" required value={formData.email} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input name="password" type="password" required value={formData.password} onChange={handleChange} />
        </div>
        <button type="submit">Get Started</button>
      </form>
    </div>
  );
}
