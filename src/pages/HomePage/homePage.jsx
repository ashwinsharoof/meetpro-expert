import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer,
} from 'recharts';
import './style/homePage.css';
import { FaChartBar, FaRupeeSign } from 'react-icons/fa';

const chartData = [
  { date: '2025-07-01', booking: 2, Payment: 500 },
  { date: '2025-07-02', booking: 3, Payment: 800 },
  { date: '2025-07-03', booking: 1, Payment: 300 },
  { date: '2025-07-04', booking: 4, Payment: 1000 },
  { date: '2025-07-05', booking: 2, Payment: 700 },
];

export default function HomePage() {
  const [serviceData, setServiceData] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const expertId = localStorage.getItem('expertId');

  useEffect(() => {
    if(expertId){
        fetchServices();
    }
  }, [expertId]);

  const fetchServices = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/v1/service/expert/${expertId}`);
      const data = await res.json();
      if (res.ok) {
        setServiceData(data);
      } else {
        console.error('Failed to fetch services');
      }
    } catch (err) {
      console.error('Error fetching services:', err);
    }
  };

  const handleEditClick = (service) => {
    setSelectedService({ ...service }); // clone it so we can edit freely
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedService(null);
  };

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setSelectedService((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/v1/service/${selectedService._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedService),
      });

      const updated = await res.json();

      if (res.ok) {
        alert('Service updated successfully');
        closeModal();
        fetchServices(); // refresh list
      } else {
        alert(`Update failed: ${updated.message}`);
      }
    } catch (err) {
      console.error('Update error:', err);
      alert('Error updating service');
    }
  };

  return (
    <div>
      <Navbar />

      {/* Dashboard Overview */}
      <div className="graph-section">
        <h2 className="section-title">Dashboard Overview</h2>
        <div className="dashboard-container">
          <div className="graph-card">
            <div className="card-header">
              <FaChartBar className="card-icon" />
              <h3>Booking</h3>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="booking" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="graph-card">
            <div className="card-header">
              <FaRupeeSign className="card-icon" />
              <h3>Payment (₹)</h3>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Payment" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Service Section */}
      <div className="graph-section">
        <h2 className="section-title">Service</h2>
        <div className="service-grid">
          {serviceData.map((service) => (
            <div key={service._id} className="service-card">
              <h3 className="service-title">{service.Title}</h3>
              <p className="service-description">{service.Description}</p>
              <div className="service-footer">
                <span className="service-price">₹ {service.Amount}</span>
                <button className="edit-button" onClick={() => handleEditClick(service)}>
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedService && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <h3>Edit Service</h3>

            <label>Title</label>
            <input name="Title" value={selectedService.Title} onChange={handleModalChange} />

            <label>Description</label>
            <textarea
              name="Description"
              value={selectedService.Description}
              onChange={handleModalChange}
            />

            <label>Amount (₹)</label>
            <input
              type="number"
              name="Amount"
              value={selectedService.Amount}
              onChange={handleModalChange}
            />

            <div className="modal-actions">
              <button onClick={closeModal} className="cancel-btn">Cancel</button>
              <button onClick={handleSave} className="save-btn">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
