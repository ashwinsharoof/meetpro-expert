import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './style/register.css';

export default function DetailsPage() {
  const location = useLocation();
  const userData = location.state || {};
  const navigate = useNavigate();
  const [details, setDetails] = useState({
    mobileNumber: '',
    category: '',
    availability: '',
    service: '',
    startDate: '',
    endDate: '',
  });

  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const payload = {
      email: userData.email,
      password: userData.password,
      username: userData.username,
      mobileNumber: details.mobileNumber,
      category: details.category,
      // availability: details.availability,
      calendar: {
        start: new Date(details.startDate).toISOString(),
        end: new Date(details.endDate).toISOString()
      },      
      services: [details.service], // wrap in array
    };
    console.log('Submitting payload:', payload);
    try {
      const response = await fetch('http://localhost:8080/api/v1/expert/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
  
      const data = await response.json();

      if (response.ok) {
        navigate('/Login');
        alert('Successfully registered!');
        console.log('Server response:', data);
      } else {
        alert(`Error: ${data.message || 'Registration failed'}`);
        console.error(data);
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      alert('Something went wrong. Check console.');
    }
  };
  

  return (
    <div className="form-wrapper">
      <form onSubmit={handleSubmit}>
        <h2>User Details</h2>
        <div className="form-group">
          <label>Mobile Number</label>
          <input name="mobileNumber" type="text" required value={details.mobileNumber} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Category</label>
          <input name="category" type="text" required value={details.category} onChange={handleChange} />
        </div>
        {/* <div className="form-group">
          <label>Availability Time</label>
          <input name="availability" type="text" placeholder='Ex: 10Am - 11Am' required value={details.availability} onChange={handleChange} />
        </div> */}
        <div className="form-group">
  <label>Availability Date</label>
  <div className="date-range-container">
    <input
      name="startDate"
      type="date"
      required
      value={details.startDate}
      onChange={handleChange}
      className="date-input"
    />
    <span className="to-label">to</span>
    <input
      name="endDate"
      type="date"
      required
      value={details.endDate}
      onChange={handleChange}
      className="date-input"
    />
  </div>
</div>

        <div className="form-group">
          <label>Service</label>
          <select name="service" value={details.service} onChange={handleChange} required>
            <option value="">Select a service</option>
            <option value="1:1 Call">1:1 Call</option>
            <option value="Webinar">Webinar</option>
            <option value="Doubt Session">Doubt Session</option>
          </select>
        </div>

        <button type="submit">Submit All</button>
      </form>
    </div>
  );
}
