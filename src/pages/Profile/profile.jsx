import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style/profile.css';
import Navbar from '../../components/Navbar';


export default function EditProfile() {
  const navigate = useNavigate();
  const expertId = localStorage.getItem('expertId'); // Ensure this is set after login
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    mobileNumber: '',
    profilePhoto: '', // assuming you'll use base64 or a file later
    holderName: '',
    accountNumber: '',
    ifscNumber: '', // 
  });

  // Fetch expert data on mount
  useEffect(() => {
    if (!expertId) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/v1/expert/${expertId}`);
        const data = await res.json();

        if (res.ok) {
          setFormData({
            email: data.email || '',
            password: '', // Don't pre-fill password
            mobileNumber: data.mobileNumber || '',
            profilePhoto: data.profilePhoto || '',
            holderName: data.holderName || '', // Don't pre-fill password
            accountNumber: data.accountNumber || '',
            ifscNumber: data.ifscNumber || '',
          });
        } else {
          alert('Expert not found');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        alert('Error fetching expert data');
      }
    };

    fetchData();
  }, [expertId]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit updates
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:8080/api/v1/expert/${expertId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Profile updated successfully');
        console.log('Updated expert:', data);
        navigate('/Home'); // or wherever appropriate
      } else {
        alert(`Update failed: ${data.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Update error:', err);
      alert('Failed to update profile');
    }
  };

  return (
    <div>
      <Navbar />
    <div className="form-wrapper">
      <form onSubmit={handleSubmit}>
        <h2>Edit Profile</h2>

        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={formData.email} required onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Password (leave blank to keep current)</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Mobile Number</label>
          <input type="text" name="mobileNumber" value={formData.mobileNumber} required onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Account Holder Name</label>
          <input type="text" name="holderName" value={formData.holderName} required onChange={handleChange} />
        </div>


        <div className="form-group">
          <label>Account Number</label>
          <input type="text" name="accountNumber" value={formData.accountNumber} required onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>IFSC Number</label>
          <input type="text" name="ifscNumber" value={formData.ifscNumber} required onChange={handleChange} />
        </div>

        {/* Profile pic - optional */}
        {/* <div className="form-group">
          <label>Profile Picture</label>
          <input type="file" name="profilePhoto" onChange={handleFileChange} />
        </div> */}

        <button type="submit">Update Profile</button>
      </form>
    </div>
</div>
  );
}
