import React, { useState, useEffect } from "react";  // Import React and necessary hooks
import { useNavigate } from "react-router-dom";  // Import useNavigate hook for navigation
import Modal from "../components/Modal";  // Import the Modal component for showing messages

// 🎥 Agent video sources
const videoSources = [
  { src: "/videos/Male_Agent.mp4", id: 1 },  // Male agent video source
  { src: "/videos/Female_Agent.mp4", id: 2 },  // Female agent video source
  { src: "/videos/Androgynous_Agent.mp4", id: 3 },  // Androgynous agent video source
];

// 🧠 Available gender options
const genders = ["Male", "Female", "Androgynous"];  // Gender options for selection

const RankingGender = ({ unlockRanking }) => {  // Main component for gender ranking
  const [randomizedVideos, setRandomizedVideos] = useState([]);  // State to store randomized video sources
  const [genderSelections, setGenderSelections] = useState({});  // State to store user gender selections
  const [loading, setLoading] = useState(false);  // State to manage loading state during submission
  const [modalOpen, setModalOpen] = useState(false);  // State to manage modal visibility
  const [modalMessage, setModalMessage] = useState("");  // State to store the message for the modal
  const [redirectToDashboard, setRedirectToDashboard] = useState(false);  // State to manage redirection after modal
  const navigate = useNavigate();  // Hook for navigation


  // ✅ On mount: check login and shuffle videos
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setModalMessage("You must be logged in to access this page.");
      setModalOpen(true);
      setRedirectToDashboard(true); // Redirects after modal
    } else {
      setRandomizedVideos([...videoSources].sort(() => Math.random() - 0.5));
    }
  }, [navigate]);

  // ✅ Handles modal close + redirect
  const handleModalClose = () => {
    setModalOpen(false);
    if (redirectToDashboard) {
      setRedirectToDashboard(false);
      navigate("/login");
    }
  };

  // ✅ Track gender selection per video
  const handleGenderSelection = (videoId, gender, agentName) => {
    setGenderSelections({ ...genderSelections, [videoId]: { agentName, gender } });
  };

  // ✅ Extract readable name from video filename
  const extractAgentName = (videoSrc) => {
    return videoSrc.split("/").pop().replace(".mp4", "").replace(/_/g, " ");
  };

  // ✅ Ensure each gender is selected only once
  const isSelectionValid = () => {
    const selectedGenders = Object.values(genderSelections).map((entry) => entry.gender);
    return new Set(selectedGenders).size === genders.length;
  };

  // ✅ Submit gender selections to the server
  const submitGenders = async () => {
    if (!isSelectionValid()) {
      setModalMessage("Each agent must have a unique gender selection. Please adjust your choices.");
      setModalOpen(true);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const userEmail = localStorage.getItem("userEmail");

      // 🔄 Send selections for each agent
      for (const videoId of Object.keys(genderSelections)) {
        const payload = {
          userEmail,
          agentName: genderSelections[videoId].agentName,
          selectedGender: genderSelections[videoId].gender,
        };

        const response = await fetch("http://localhost:8080/api/survey/save-gender", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error(`Failed for ${payload.agentName}`);
      }

      // 🎉 Unlock ranking step and lock this one
      localStorage.setItem("rankingUnlocked", "true");
      localStorage.removeItem("genderIdentificationUnlocked");
      unlockRanking();

      // ✅ Success modal
      setModalMessage("Gender identification submitted successfully!");
      setRedirectToDashboard(true);
      setModalOpen(true);
    } catch (error) {
      console.error("Error saving gender responses:", error);
      setModalMessage("An error occurred while submitting. Please try again.");
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      {/* ✅ Modal for alerts or redirection */}
      <Modal
        isOpen={modalOpen}
        title="Notice"
        message={modalMessage}
        onConfirm={handleModalClose}
        onCancel={handleModalClose}
        confirmText="OK"
        cancelText=""
      />

      {/* 🧩 Gender Identification UI */}
      <div className="w-full max-w-4xl text-center">
        <h2 className="text-2xl font-bold mb-4">Identify Agent Genders</h2>
        <div className="flex justify-center gap-6 flex-wrap">
          {randomizedVideos.map((video) => {
            const agentName = extractAgentName(video.src);
            return (
              <div key={video.id} className="text-center">
                {/* 🎥 Video Display */}
                <video src={video.src} controls className="w-64 h-40 rounded-lg shadow-md" />
                {/* 👤 Gender Buttons */}
                <div className="mt-3">
                  {genders.map((gender) => (
                    <button
                      key={gender}
                      onClick={() => handleGenderSelection(video.id, gender, agentName)}
                      className={`px-4 py-2 m-1 rounded-md transition ${
                        genderSelections[video.id]?.gender === gender
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    >
                      {gender}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* ✅ Submit Button */}
        <button
          onClick={submitGenders}
          disabled={Object.keys(genderSelections).length < 3 || loading}
          className={`mt-5 px-6 py-3 rounded-lg shadow-md ${
            loading
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-green-500 text-white hover:bg-green-600"
          }`}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default RankingGender;
