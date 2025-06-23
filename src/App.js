import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register/register';
import ExpertDetailsForm from './pages/Register/expertDetailsForm';
import Login from './pages/Login/login';
import HomePage from './pages/HomePage/homePage.jsx'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/ExpertDetailsForm" element={<ExpertDetailsForm />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/HomePage" element={<HomePage />} />        
      </Routes>
    </Router>
  );
}

export default App;
