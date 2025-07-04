import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register/register';
import ExpertDetailsForm from './pages/Register/expertDetailsForm';
import Login from './pages/Login/login';
import HomePage from './pages/HomePage/homePage.jsx'
import CalendarPage from './pages/Calendar/calendar.jsx'
import ServicePage from './pages/Service/service.jsx'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/ExpertDetailsForm" element={<ExpertDetailsForm />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Home" element={<HomePage />} />        
        <Route path="/Calendar" element={<CalendarPage />} />   
        <Route path="/Service" element={<ServicePage />} />   
      </Routes>
    </Router>
  );
}

export default App;
