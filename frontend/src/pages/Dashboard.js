import React, { useState, useEffect } from "react";
import DashboardContent from "./DashboardContent";
import VideoPage from "./VideoPage";
import RankingGender from "./RankingGender";
import RankingPage from "./RankingPage";
import Modal from "../components/Modal";

const Dashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");
  const [genderIdentificationUnlocked, setGenderIdentificationUnlocked] = useState(
    localStorage.getItem("genderIdentificationUnlocked") === "true"
  );
  const [rankingUnlocked, setRankingUnlocked] = useState(
    localStorage.getItem("rankingUnlocked") === "true"
  );
  const [reportsUnlocked, setReportsUnlocked] = useState(
    localStorage.getItem("reportsUnlocked") === "true"
  );
  const [rankingAnalysisUnlocked, setRankingAnalysisUnlocked] = useState(
    localStorage.getItem("rankingAnalysisUnlocked") === "true"
  );
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    if (!userEmail) {
      window.location.href = "http://localhost:3000/login";
    }
  }, [userEmail]);

  useEffect(() => {
    setGenderIdentificationUnlocked(localStorage.getItem("genderIdentificationUnlocked") === "true");
    setRankingUnlocked(localStorage.getItem("rankingUnlocked") === "true");
    setReportsUnlocked(localStorage.getItem("reportsUnlocked") === "true");
    setRankingAnalysisUnlocked(localStorage.getItem("rankingAnalysisUnlocked") === "true");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("genderIdentificationUnlocked");
    localStorage.removeItem("rankingUnlocked");
    localStorage.removeItem("reportsUnlocked");
    window.location.href = "http://localhost:3000";
  };

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
  };

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardContent />;
      case "reports":
        return (
          <iframe
            src="http://127.0.0.1:8000/dashboard/dashboard/"
            style={{ width: "100%", height: "100%", border: "none", overflow: "auto" }}
            title="Reports"
          ></iframe>
        );
      case "rankingAnalysis":
        return (
          <iframe
            src="http://127.0.0.1:8000/dashboard/ranking-analysis/"
            style={{ width: "100%", height: "100%", border: "none", overflow: "auto" }}
            title="Ranking Analysis"
          ></iframe>
        );
      case "videos":
        return <VideoPage unlockGenderIdentification={unlockGenderIdentification} />;
      case "ranking":
        return genderIdentificationUnlocked ? <RankingGender unlockRanking={unlockRanking} /> : <h2>Please Proceed To Ranking Page</h2>;
      case "rankingPage":
        return rankingUnlocked ? <RankingPage unlockReports={unlockReports} /> : <h2>Access Denied</h2>;
      default:
        return <h2>Page Not Found</h2>;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-blue-100 to-blue-200">
      <div className="w-full bg-blue-800 text-white p-4 text-center shadow-md"></div>

      <div className="flex flex-1">
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
            <li className={`p-3 ${reportsUnlocked ? "cursor-pointer hover:bg-blue-600" : "opacity-50 cursor-not-allowed"}`} onClick={() => reportsUnlocked && setActivePage("reports")}>
              📊 Reports
            </li>
            <li className={`p-3 ${reportsUnlocked ? "cursor-pointer hover:bg-blue-600" : "opacity-50 cursor-not-allowed"}`} onClick={() => reportsUnlocked && setActivePage("rankingAnalysis")}>
              📊 Ranking Analysis
            </li>
            <li className="p-3 cursor-pointer rounded hover:bg-red-600 transition-transform transform hover:scale-105" onClick={() => setShowLogoutModal(true)}>
              🚪 Logout
            </li>
          </ul>
        </div>

        <div className="flex-1 p-10 bg-white shadow-lg rounded-lg">
          {renderPage()}
        </div>
      </div>

      {/* ✅ Reusable Logout Confirmation Modal */}
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
