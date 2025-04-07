import React, { useState, useEffect } from "react";  // Import React and necessary hooks
import DashboardContent from "./DashboardContent";  // Component for the main dashboard content
import VideoPage from "./VideoPage";  // Component to display the video page
import RankingGender from "./RankingGender";  // Component for ranking gender identification
import RankingPage from "./RankingPage";  // Component for ranking agents based on attributes
import Modal from "../components/Modal";  // Modal component for displaying alerts or messages

const Dashboard = () => {
  // State to track the currently active page
  const [activePage, setActivePage] = useState("dashboard");

  // States to track whether specific features are unlocked, based on localStorage values
  const [genderIdentificationUnlocked, setGenderIdentificationUnlocked] = useState(
    localStorage.getItem("genderIdentificationUnlocked") === "true"  // Check if gender identification is unlocked
  );
  const [rankingUnlocked, setRankingUnlocked] = useState(
    localStorage.getItem("rankingUnlocked") === "true"  // Check if ranking is unlocked
  );
  const [reportsUnlocked, setReportsUnlocked] = useState(
    localStorage.getItem("reportsUnlocked") === "true"  // Check if reports are unlocked
  );
  const [rankingAnalysisUnlocked, setRankingAnalysisUnlocked] = useState(
    localStorage.getItem("rankingAnalysisUnlocked") === "true"  // Check if ranking analysis is unlocked
  );

  // State to control the visibility of the logout modal
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Retrieving the user's email from localStorage (if available)
  const userEmail = localStorage.getItem("userEmail");

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!userEmail) {
      window.location.href = "http://localhost:3000/login";
    }
  }, [userEmail]);

  // Refresh localStorage-based unlock flags on first load
  useEffect(() => {
    setGenderIdentificationUnlocked(localStorage.getItem("genderIdentificationUnlocked") === "true");
    setRankingUnlocked(localStorage.getItem("rankingUnlocked") === "true");
    setReportsUnlocked(localStorage.getItem("reportsUnlocked") === "true");
    setRankingAnalysisUnlocked(localStorage.getItem("rankingAnalysisUnlocked") === "true");
  }, []);

  // Logout: clear session and redirect
  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("genderIdentificationUnlocked");
    localStorage.removeItem("rankingUnlocked");
    localStorage.removeItem("reportsUnlocked");
    localStorage.removeItem("rankingAnalysisUnlocked");
    window.location.href = "http://localhost:3000";
  };

  // Unlock steps for gated content
  const unlockGenderIdentification = () => {
    localStorage.setItem("genderIdentificationUnlocked", "true");
    setGenderIdentificationUnlocked(true);
  };

  const unlockRanking = () => {
    localStorage.setItem("rankingUnlocked", "true");
    setRankingUnlocked(true);
    localStorage.removeItem("genderIdentificationUnlocked");
    setGenderIdentificationUnlocked(false);
  };

  const unlockReports = () => {
    localStorage.setItem("reportsUnlocked", "true");
    localStorage.setItem("rankingAnalysisUnlocked", "true");
    setReportsUnlocked(true);
    setRankingAnalysisUnlocked(true);
  };

  // Conditional page rendering
  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardContent />;
      case "videos":
        return <VideoPage unlockGenderIdentification={unlockGenderIdentification} />;
      case "ranking":
        return genderIdentificationUnlocked
          ? <RankingGender unlockRanking={unlockRanking} />
          : <h2>Please Proceed To Ranking Page</h2>;
      case "rankingPage":
        return rankingUnlocked
          ? <RankingPage unlockReports={unlockReports} />
          : <h2>Access Denied</h2>;
      case "reports":
        return (
          <iframe
            src="http://127.0.0.1:8000/dashboard/dashboard/"
            title="Reports"
            style={{ width: "100%", height: "100%", border: "none" }}
          />
        );
      case "rankingAnalysis":
        return (
          <iframe
            src="http://127.0.0.1:8000/dashboard/ranking-analysis/"
            title="Ranking Analysis"
            style={{ width: "100%", height: "100%", border: "none" }}
          />
        );
      default:
        return <h2>Page Not Found</h2>;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-blue-100 to-blue-200">
      {/* Header */}
      <div className="w-full bg-blue-800 text-white p-4 text-center shadow-md"></div>

      {/* Body */}
      <div className="flex flex-1">
        {/* Sidebar Navigation */}
        <div className="w-1/4 bg-blue-800 text-white p-5 shadow-lg">
          <h1 className="text-2xl font-bold mb-4">Main Menu</h1>
          {userEmail && <p className="text-sm mb-6">Logged in as: {userEmail}</p>}
          <ul>
            <li className="p-3 cursor-pointer rounded hover:bg-blue-600 transition-transform transform hover:scale-105" onClick={() => setActivePage("dashboard")}>
              🏠 Home
            </li>
            <li className="p-3 cursor-pointer rounded hover:bg-blue-600 transition-transform transform hover:scale-105" onClick={() => setActivePage("videos")}>
              🎥 Watch Videos
            </li>
            <li
              className={`p-3 ${genderIdentificationUnlocked ? "cursor-pointer hover:bg-blue-600 transition-transform transform hover:scale-105" : "opacity-50 cursor-not-allowed"}`}
              onClick={() => genderIdentificationUnlocked && setActivePage("ranking")}
            >
              📊 Gender Identification
            </li>
            <li
              className={`p-3 ${rankingUnlocked ? "cursor-pointer hover:bg-blue-600 transition-transform transform hover:scale-105" : "opacity-50 cursor-not-allowed"}`}
              onClick={() => rankingUnlocked && setActivePage("rankingPage")}
            >
              🏆 Ranking Page
            </li>
            <li
              className={`p-3 ${reportsUnlocked ? "cursor-pointer hover:bg-blue-600 transition-transform transform hover:scale-105" : "opacity-50 cursor-not-allowed"}`}
              onClick={() => reportsUnlocked && setActivePage("reports")}
            >
              📊 Reports
            </li>
            <li
              className={`p-3 ${reportsUnlocked ? "cursor-pointer hover:bg-blue-600 transition-transform transform hover:scale-105" : "opacity-50 cursor-not-allowed"}`}
              onClick={() => reportsUnlocked && setActivePage("rankingAnalysis")}
            >
              📊 Ranking Analysis
            </li>
            <li className="p-3 cursor-pointer rounded hover:bg-red-600 transition-transform transform hover:scale-105" onClick={() => setShowLogoutModal(true)}>
              🚪 Logout
            </li>
          </ul>
        </div>

        {/* Main content area */}
        <div className="flex-1 p-10 bg-white shadow-lg rounded-lg">
          {renderPage()}
        </div>
      </div>

      {/* Logout confirmation modal */}
      <Modal
        isOpen={showLogoutModal}
        title="Confirm Logout"
        message="Are you sure you want to logout?"
        confirmText="Logout"
        cancelText="Cancel"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
    </div>
  );
};

export default Dashboard;
