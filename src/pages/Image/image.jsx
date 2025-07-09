import React, { useEffect, useState } from 'react';

export default function ServiceList() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/v1/service') // Adjust route if needed
      .then((res) => res.json())
      .then((data) => setServices(data))
      .catch((err) => console.error('Fetch error:', err));
  }, []);

  return (
    <div className="service-list">
      <h2>Saved Services</h2>
      {services.map((service) => (
        <div key={service._id} className="service-card">
          <h3>{service.Title}</h3>
          <p><strong>Type:</strong> {service.ServiceType}</p>
          <p><strong>Description:</strong> {service.Description}</p>
          <p><strong>Amount:</strong> ₹{service.Amount}</p>
          {service.UploadCoverPhoto && (
            <img
              src={service.UploadCoverPhoto}
              alt="Cover"
              style={{ width: '200px', height: 'auto', marginTop: '10px' }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
