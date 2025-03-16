import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DashboardContent from "./pages/DashboardContent";
import VideoPage from "./pages/VideoPage";
import AuthService from "./AuthService";
import './App.css'; // Import your CSS here

const ProtectedRoute = ({ children }) => {
  return AuthService.isAuthenticated() ? children : <Navigate to="/login" />;
};

function Navbar() {
  const location = useLocation(); // Get the current route path

  // Only show navbar on these routes
  const showNavbar = location.pathname !== "/dashboard" && location.pathname !== "/dashboardcontent" && location.pathname !== "/videopage";

  if (!showNavbar) return null; // Don't render navbar on the above routes

  return (
    <nav className="navbar">
      <Link to="/" className={`nav-link ${location.pathname === "/" ? "active-link" : ""}`}>Home</Link>
      <Link to="/login" className={`nav-link ${location.pathname === "/login" ? "active-link" : ""}`}>Login</Link>
      <Link to="/register" className={`nav-link ${location.pathname === "/register" ? "active-link" : ""}`}>Register</Link>
    </nav>
  );
}

function App() {
  return (
    <Router> {/* Ensure this Router component wraps your entire app */}
      <div className="app-container">
        <Navbar /> {/* Navbar is now inside Router */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboardcontent" element={<DashboardContent />} />
          <Route path="/videopage" element={<VideoPage />} />
        </Routes>
      </div>
    </Router>
  );
}

const HomePage = () => (
  <div className="landing-container">
    <h1>Welcome to SFU's Interactive Arts and Technology IAT 806 G100: Interdisciplinary Design Approaches to Computing Course Information Portal</h1>
    <p className="intro-text">
      Explore one of the most unique and engaging courses offered at Simon Fraser University in Vancouver, Canada.
      The <b>Processing Course</b> offered by the <b>School of Interactive Arts and Technology (SIAT)</b> is designed
      for postgraduate students who want to explore creative coding, media arts, and design.
    </p>

    <div className="agent-intro">
      <h2>Want To Know More About IAT 806 Course?</h2>
      <div className="cta-button">
        <p>This website is designed to briefly introduce you to the IAT 806 course, guided by three virtual agents. Here's what you need to do:</p>
        <ol>
          <li>
            <img src="/right-arrow.png" alt="Right Arrow" className="pointer-icon" />
            Click on the <Link to="/register" className="nav-link">Register</Link> button to provide a brief demographic about yourself.
          </li>
          <li>
            <img src="/right-arrow.png" alt="Right Arrow" className="pointer-icon" />
            Click on the <Link to="/login" className="nav-link">Login</Link> button to log into the system.
          </li>
          <li>
            <img src="/right-arrow.png" alt="Right Arrow" className="pointer-icon" />
            Watch the course introduction presented by the three agents.
          </li>
          <li>
            <img src="/right-arrow.png" alt="Right Arrow" className="pointer-icon" />
            Rank the agents based on your preference.
          </li>
        </ol>
      </div>

      {/* Scrolling text section */}
      <div className="scrolling-text">
        <p>This project was done by Oyewale Christianah Titilope (christianah_oyewale@sfu.ca) under the supervision of Dr. Philippe Pasquier and Tiffany Wun.</p>
      </div>
    </div>
  </div>
);

export default App;
