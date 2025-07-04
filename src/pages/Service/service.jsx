import React, { useState } from 'react';
import './style/service.css';

export default function ServiceForm() {
  const [formData, setFormData] = useState({
    ServiceType: '',
    Title: '',
    Description: '',
    Amount: '',
    UploadCoverPhoto: '',
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
  
    if (name === 'UploadCoverPhoto') {
      const file = files[0];
      const reader = new FileReader();
  
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          UploadCoverPhoto: reader.readAsDataURL(file), // base64 string
        }));
      };
  
      if (file) {
        reader.readAsDataURL(file); // Convert to base64
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const expertId = localStorage.getItem('expertId');
      if (!expertId) {
        alert("Expert ID not found in localStorage.");
        return;
      }
  
      const payload = {
        expertId,
        ServiceType: formData.ServiceType,
        Title: formData.Title,
        Description: formData.Description,
        Amount: formData.Amount,
        UploadCoverPhoto: formData.UploadCoverPhoto, // base64 string
      };
  
      const res = await fetch('http://localhost:8080/api/v1/service/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
  
      const result = await res.json();
  
      if (res.ok) {
        alert('Service saved successfully!');
        setFormData({
          ServiceType: '',
          Title: '',
          Description: '',
          Amount: '',
          UploadCoverPhoto: '',
        });
      } else {
        alert(`Error: ${result.message || 'Something went wrong'}`);
        console.error(result);
      }
    } catch (err) {
      console.error('Submission error:', err);
      alert('Failed to submit form');
    }
  };
  
  

  return (
    <div className="form-wrapper">
      <form onSubmit={handleSubmit}>
        <h2>Service</h2>

        {/* Service Type */}
        <div className="form-group">
          <label className="label-with-icon">
            <i className="fas fa-headset"></i> Service Type
          </label>
          <select
            name="ServiceType"
            value={formData.ServiceType}
            onChange={handleChange}
            required
          >
            <option value="">Select a service</option>
            <option value="1:1 Call">1:1 Call</option>
            <option value="Webinar">Webinar</option>
            <option value="Doubt Session">Doubt Session</option>
          </select>
        </div>

        {/* Title */}
        <div className="form-group">
          <label className="label-with-icon">
            <i className="fas fa-tag"></i> Title
          </label>
          <input
            type="text"
            name="Title"
            placeholder="Enter service title"
            value={formData.Title}
            onChange={handleChange}
            required
          />
        </div>

        {/* Description */}
        <div className="form-group">
          <label className="label-with-icon">
            <i className="fas fa-align-left"></i> Description
          </label>
          <textarea
            name="Description"
            placeholder="Enter service description"
            value={formData.Description}
            onChange={handleChange}
            required
          />
        </div>

        {/* Amount */}
        <div className="form-group">
          <label className="label-with-icon">
            <i className="fas fa-dollar-sign"></i> Amount (₹)
          </label>
          <input
            type="number"
            name="Amount"
            placeholder="Enter amount in INR"
            value={formData.Amount}
            onChange={handleChange}
            required
          />
        </div>

        {/* Upload Cover Photo */}
        <div className="form-group">
  <label className="label-with-icon">
    <i className="fas fa-image"></i> Upload Cover Photo
  </label>

  {/* Hidden native input */}
  <input
    type="file"
    id="coverPhoto"
    name="UploadCoverPhoto"
    onChange={handleChange}
    style={{ display: 'none' }}
  />

  {/* Custom styled button */}
  <label htmlFor="coverPhoto" className="custom-file-label">
    Choose File
  </label>

  <span className="file-name-preview">{formData.UploadCoverPhoto?.name || "No file chosen"}</span>
</div>

        <button type="submit">Save Service</button>
      </form>
    </div>
  );
}
