import React, { useState, useEffect } from "react";
import DashboardContent from "./DashboardContent";
import VideoPage from "./VideoPage";
import RankingGender from "./RankingGender";
import RankingPage from "./RankingPage";

const Dashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");
  const [genderIdentificationUnlocked, setGenderIdentificationUnlocked] = useState(
    localStorage.getItem("genderIdentificationUnlocked") === "true"
  );
  const [rankingUnlocked, setRankingUnlocked] = useState(
    localStorage.getItem("rankingUnlocked") === "true"
  );
  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    if (!userEmail) {
      window.location.href = "http://localhost:3000/login";
    }
  }, [userEmail]);

  useEffect(() => {
    setGenderIdentificationUnlocked(localStorage.getItem("genderIdentificationUnlocked") === "true");
    setRankingUnlocked(localStorage.getItem("rankingUnlocked") === "true");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("genderIdentificationUnlocked");
    localStorage.removeItem("rankingUnlocked");
    window.location.href = "http://localhost:3000";
  };

  const unlockGenderIdentification = () => {
    localStorage.setItem("genderIdentificationUnlocked", "true");
    setGenderIdentificationUnlocked(true);
  };

  const unlockRanking = () => {
    localStorage.setItem("rankingUnlocked", "true");
    setRankingUnlocked(true);
    localStorage.removeItem("genderIdentificationUnlocked"); // Ensure gender page is locked after ranking is unlocked
    setGenderIdentificationUnlocked(false); // Update state
  };

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardContent />;
      case "videos":
        return <VideoPage unlockGenderIdentification={unlockGenderIdentification} />;
      case "ranking":
        return genderIdentificationUnlocked ? <RankingGender unlockRanking={unlockRanking} /> : <h2>Access Denied</h2>;
      case "rankingPage":
        return rankingUnlocked ? <RankingPage /> : <h2>Access Denied</h2>;
      default:
        return <h2>Page Not Found</h2>;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="w-full bg-blue-900 text-white p-4 text-center"></div>

      <div className="flex flex-1">
        <div className="w-1/4 bg-blue-900 text-white p-5">
          <h1 className="text-2xl font-bold mb-4">Main Dashboard</h1>
          {userEmail && <p className="text-sm mb-6">Logged in as: {userEmail}</p>}
          <ul>
            <li className="p-3 cursor-pointer rounded hover:bg-blue-800" onClick={() => setActivePage("dashboard")}>
              🏠 Home
            </li>
            <li className="p-3 cursor-pointer rounded hover:bg-blue-800" onClick={() => setActivePage("videos")}>
              🎥 Watch Videos
            </li>
            <li
              className={`p-3 ${genderIdentificationUnlocked ? "cursor-pointer hover:bg-blue-800" : "opacity-50 cursor-not-allowed"}`}
              onClick={() => genderIdentificationUnlocked && setActivePage("ranking")}
            >
              📊 Gender Identification
            </li>
            <li
              className={`p-3 ${rankingUnlocked ? "cursor-pointer hover:bg-blue-800" : "opacity-50 cursor-not-allowed"}`}
              onClick={() => rankingUnlocked && setActivePage("rankingPage")}
            >
              🏆 Ranking Page
            </li>
            <li className="p-3 cursor-pointer rounded hover:bg-blue-800" onClick={handleLogout}>🚪 Logout</li>
          </ul>
        </div>

        <div className="flex-1 p-10 bg-white shadow-lg">{renderPage()}</div>
      </div>
    </div>
  );
};

export default Dashboard;
