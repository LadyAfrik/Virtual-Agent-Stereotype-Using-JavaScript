import React, { useState, useEffect } from "react";
import DashboardContent from "./DashboardContent"; // ✅ The old Dashboard Page
import VideoPage from "./VideoPage"; // ✅ The Video Display Page

const Dashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");
  const userEmail = localStorage.getItem("userEmail"); // ✅ Retrieve stored email

  // Redirect to login if not logged in
  useEffect(() => {
    if (!userEmail) {
      window.location.href = "http://localhost:3000/login"; // Redirect to login page if not logged in
    }
  }, [userEmail]);

  const handleLogout = () => {
    localStorage.removeItem("userEmail"); // Clear user session
    window.location.href = "http://localhost:3000"; // Redirect to Home page
  };

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardContent />;
      case "videos":
        return <VideoPage />;
      default:
        return <h2 className="text-center">Page Not Found</h2>;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Top Blue Bar (Kept as requested) */}
      <div className="w-full bg-blue-900 text-white p-4 text-center"></div>

      {/* Sidebar + Main Content Wrapper */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-1/4 bg-blue-900 text-white p-5">
          <h1 className="text-2xl font-bold mb-4">Main Dashboard</h1>
          {userEmail && <p className="text-sm mb-6">Logged in as: {userEmail}</p>}
          <ul>
            <li
              className={`p-3 cursor-pointer rounded ${
                activePage === "dashboard" ? "bg-blue-700" : "hover:bg-blue-800"
              }`}
              onClick={() => setActivePage("dashboard")}
            >
              🏠 Home
            </li>
            <li
              className={`p-3 cursor-pointer rounded ${
                activePage === "videos" ? "bg-blue-700" : "hover:bg-blue-800"
              }`}
              onClick={() => setActivePage("videos")}
            >
              🎥 Watch Videos
            </li>
            <li
              className="p-3 cursor-pointer rounded hover:bg-blue-800"
              onClick={handleLogout} // Call handleLogout on click
            >
              🚪 Logout
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-10 bg-white shadow-lg">{renderPage()}</div>
      </div>
    </div>
  );
};

export default Dashboard;
