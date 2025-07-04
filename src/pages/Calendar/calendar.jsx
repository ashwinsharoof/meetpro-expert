import React, { useState } from 'react';
import './style/calendar.css';

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function AvailabilityForm() {
  const [formData, setFormData] = useState({
    timezone: '',
    calendar: '',
    bookingperiod: '',
    meetinglocation: '',
    startDate: '',
    endDate: '',
    availability: {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: [],
    },
  });

  const [showTimeModal, setShowTimeModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState('');
  const [timeRange, setTimeRange] = useState({ start: '', end: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openTimeModal = (day) => {
    setSelectedDay(day);
    setTimeRange({ start: '', end: '' });
    setShowTimeModal(true);
  };

  const addTimeSlot = () => {
    if (timeRange.start && timeRange.end) {
      setFormData(prev => ({
        ...prev,
        availability: {
          ...prev.availability,
          [selectedDay]: [...prev.availability[selectedDay], timeRange]
        }
      }));
      setShowTimeModal(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const expertId = localStorage.getItem('expertId'); // Make sure it's saved with this key
  
    if (!expertId) {
      alert('Expert ID not found in local storage');
      return;
    }
  
    const payload = {
      timeZone: formData.timezone,
      preBooking: formData.bookingperiod,
      meetingLocation: formData.meetinglocation,
      availability: formData.availability,
      monday: formData.availability.Monday,
      tuesday: formData.availability.Tuesday,
      wednesday: formData.availability.Wednesday,
      thursday: formData.availability.Thursday,
      friday: formData.availability.Friday,
      saturday: formData.availability.Saturday,
      sunday: formData.availability.Sunday,
    };
  
    try {
      const res = await fetch(`http://localhost:8080/api/v1/expert/${expertId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (!res.ok) {
        throw new Error('Failed to update expert');
      }
  
      const data = await res.json();
      console.log('Update successful:', data);
      alert('Availability updated successfully!');
    } catch (err) {
      console.error('Error updating expert:', err);
      alert('Failed to update expert');
    }
  };
  

  return (
    <div className="form-wrapper">
      <form onSubmit={handleSubmit}>
        <h2>Availability</h2>

        {/* Timezone */}
        <div className="form-group">
          <label className="label-with-icon">
            <i className="fas fa-clock"></i> Timezone
          </label>
          <select name="timezone" value={formData.timezone} onChange={handleChange} required>
            <option value="">Select timezone</option>
            <option value="GMT+5:30">GMT+5:30 Chennai, Kolkata, Mumbai, New Delhi</option>
            <option value="UTC+0:00">UTC+0:00 GMT</option>
            <option value="UTC+1:00">UTC+1:00 CET</option>
            <option value="UTC-5:00">UTC-5:00 EST</option>
            <option value="UTC-8:00">UTC-8:00 PST</option>
          </select>
        </div>

        {/* Booking Period */}
        <div className="form-group">
          <label className="label-with-icon">
            <i className="fas fa-calendar-alt"></i> Pre Booking Period
          </label>
          <input
            name="bookingperiod"
            placeholder="1 day, 1 week or 1 month"
            value={formData.bookingperiod}
            onChange={handleChange}
            required
          />
        </div>

        {/* Meeting Location */}
        <div className="form-group">
          <label className="label-with-icon">
            <i className="fas fa-video"></i> Meeting Location
          </label>
          <select name="meetinglocation" value={formData.meetinglocation} onChange={handleChange} required>
            <option value="">Select meeting tool</option>
            <option value="Google Meet">Google Meet</option>
            <option value="Personal Link">Personal Meeting Link</option>
          </select>
        </div>

        {/* Calendar Date Range */}
        <div className="form-group">
          <label className="label-with-icon">
            <i className="fas fa-link"></i> Calendar Account
          </label>
          <div className="date-range-container">
            <input
              name="startDate"
              type="date"
              required
              value={formData.startDate}
              onChange={handleChange}
              className="date-input"
            />
            <span className="to-label">to</span>
            <input
              name="endDate"
              type="date"
              required
              value={formData.endDate}
              onChange={handleChange}
              className="date-input"
            />
          </div>
        </div>

        {/* Weekly Availability */}
        <div className="form-group">
          <label className="label-with-icon">
            <i className="fas fa-calendar-day"></i> Weekly Availability
          </label>
          <div className="weekday-buttons">
            {weekdays.map((day) => (
              <button
                type="button"
                key={day}
                className={`weekday-btn ${formData.availability[day].length > 0 ? 'selected' : ''}`}
                onClick={() => openTimeModal(day)}
              >
                {day}
              </button>
            ))}
          </div>
          <ul className="time-range-list">
  {Object.entries(formData.availability).map(([day, slots]) =>
    slots.length > 0 ? (
      <li key={day}>
        <strong>{day}:</strong>
        <ul className="slot-sublist">
          {slots.map((slot, i) => (
            <li key={i} className="slot-item">
              {slot.start} - {slot.end}
              <button
                type="button"
                className="remove-slot-btn"
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    availability: {
                      ...prev.availability,
                      [day]: prev.availability[day].filter((_, idx) => idx !== i),
                    }
                  }));
                }}
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
      </li>
    ) : null
  )}
</ul>
        </div>

        <button type="submit">Save Availability</button>
      </form>

      {/* Time selection modal */}
      {showTimeModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{selectedDay} - Select Time Range</h3>
            <div className="time-inputs">
              <input
                type="time"
                value={timeRange.start}
                onChange={(e) => setTimeRange({ ...timeRange, start: e.target.value })}
              />
              <span className="to-label">to</span>
              <input
                type="time"
                value={timeRange.end}
                onChange={(e) => setTimeRange({ ...timeRange, end: e.target.value })}
              />
            </div>
            <div className="modal-buttons">
              <button type="button" onClick={addTimeSlot}>Add</button>
              <button type="button" onClick={() => setShowTimeModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
