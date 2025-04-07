import React, { useState, useEffect } from "react";  // Import React and necessary hooks
import { useNavigate } from "react-router-dom";  // Import useNavigate hook for navigation
import Modal from "../components/Modal";  // Import the Modal component for showing messages

// 🎥 Agent video sources
const videoSources = [
  { src: "/videos/Male_Agent.mp4", id: 1 },  // Male agent video source
  { src: "/videos/Female_Agent.mp4", id: 2 },  // Female agent video source
  { src: "/videos/Androgynous_Agent.mp4", id: 3 },  // Androgynous agent video source
];

// 🧠 List of personality traits to be ranked
const attributes = [
  { name: "affectionate", category: "Communion trait" },  // Trait under the category of "Communion"
  { name: "compassionate", category: "Communion trait" },  // Trait under the category of "Communion"
  { name: "sensitive", category: "Communion trait" },  // Trait under the category of "Communion"
  { name: "emotional", category: "Communion trait" },  // Trait under the category of "Communion"
  { name: "ambitious", category: "Agency trait" },  // Trait under the category of "Agency"
  { name: "aggressive", category: "Agency trait" },  // Trait under the category of "Agency"
  { name: "courageous", category: "Agency trait" },  // Trait under the category of "Agency"
  { name: "decisive", category: "Agency trait" },  // Trait under the category of "Agency"
  { name: "creative", category: "Competence trait" },  // Trait under the category of "Competence"
  { name: "intelligent", category: "Competence trait" },  // Trait under the category of "Competence"
  { name: "innovative", category: "Competence trait" },  // Trait under the category of "Competence"
  { name: "organized", category: "Competence trait" },  // Trait under the category of "Competence"
];

const RankingPage = ({ unlockReports }) => {  // Main component for ranking agents based on attributes
  const [randomizedVideos, setRandomizedVideos] = useState([]);  // State to store randomized video sources
  const [randomizedAttributes, setRandomizedAttributes] = useState([]);  // State to store randomized attributes
  const [currentAttributeIndex, setCurrentAttributeIndex] = useState(0);  // Index to track the current attribute being ranked
  const [rankings, setRankings] = useState({});  // State to store rankings for each agent
  const [loading, setLoading] = useState(false);  // State to manage loading state during submission
  const [modalOpen, setModalOpen] = useState(false);  // State to manage modal visibility
  const [modalMessage, setModalMessage] = useState("");  // State to store the message for the modal
  const [redirectAfterModal, setRedirectAfterModal] = useState(null);  // State to manage redirection after modal
  const navigate = useNavigate();  // Hook for navigation

  // 🔐 On mount: check authentication and initialize data
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setModalMessage("You must be logged in to access this page.");
      setModalOpen(true);
      setRedirectAfterModal(() => () => navigate("/login"));
    } else {
      setRandomizedVideos([...videoSources].sort(() => Math.random() - 0.5));
      setRandomizedAttributes([...attributes].sort(() => Math.random() - 0.5));
    }
  }, [navigate]);

  // 🧼 Format agent name from video file
  const extractAgentName = (videoSrc) =>
    videoSrc.split("/").pop().replace(".mp4", "").replace(/_/g, " ");

  // ✅ Validate rankings before submission
  const isRankingValid = () => {
    const ranks = Object.values(rankings);
    if (ranks.length < randomizedVideos.length || ranks.includes(NaN) || ranks.includes("")) {
      setModalMessage("Please provide a unique ranking (1, 2, or 3) for each agent before submitting.");
      setModalOpen(true);
      return false;
    }

    const uniqueRanks = new Set(ranks);
    if (ranks.length !== uniqueRanks.size || !ranks.every((rank) => rank >= 1 && rank <= 3)) {
      setModalMessage("Each agent must receive a unique rank (1, 2, or 3). Please review your rankings.");
      setModalOpen(true);
      return false;
    }

    return true;
  };

  // 🔄 Handle rank change
  const handleRankingChange = (agentId, ranking) => {
    const newRankings = { ...rankings, [agentId]: parseInt(ranking) };
    setRankings(newRankings);
  };

  // 🧹 Handle modal close and optional redirect
  const handleModalClose = () => {
    setModalOpen(false);
    if (redirectAfterModal) {
      redirectAfterModal();
      setRedirectAfterModal(null);
    }
  };

  // 📤 Submit ranking to backend
  const submitRanking = async () => {
    if (!isRankingValid()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const userEmail = localStorage.getItem("userEmail");
      const currentAttribute = randomizedAttributes[currentAttributeIndex];

      // 🔁 Submit ranking for each agent
      for (const video of randomizedVideos) {
        const payload = {
          userEmail,
          agentName: extractAgentName(video.src),
          attribute: currentAttribute.name,
          category: currentAttribute.category,
          ranking: rankings[video.id] || 0,
        };

        const response = await fetch("http://localhost:8080/api/survey/save-ranking", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error(`Failed to save ranking for ${payload.agentName}`);
      }

      // ➡️ Move to next attribute or complete survey
      if (currentAttributeIndex < randomizedAttributes.length - 1) {
        setCurrentAttributeIndex(currentAttributeIndex + 1);
        setRankings({});
      } else {
        localStorage.setItem("reportsUnlocked", "true");
        localStorage.removeItem("rankingUnlocked");

        if (typeof unlockReports === "function") {
          unlockReports();
        }

        setModalMessage("Ranking completed!");
        setRedirectAfterModal(() => () => window.location.reload());
        setModalOpen(true);
      }
    } catch (error) {
      console.error("Error saving ranking:", error);
      setModalMessage("An error occurred while submitting. Please try again.");
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      {/* 🧾 Modal for feedback */}
      <Modal
        isOpen={modalOpen}
        title="Notice"
        message={modalMessage}
        onConfirm={handleModalClose}
        onCancel={handleModalClose}
        confirmText="OK"
        cancelText=""
      />

      {/* 🧠 Trait name + category */}
      <h2 className="text-2xl font-bold mb-4">Step 2: Rank Agents on Attributes</h2>
      <h3 className="text-lg font-semibold">
        Attribute: {randomizedAttributes[currentAttributeIndex]?.name}
      </h3>
      <p className="mb-4 text-gray-600">
        Category: {randomizedAttributes[currentAttributeIndex]?.category}
      </p>

      {/* 🎥 Videos + Rank Inputs */}
      <div className="flex justify-center gap-6 flex-wrap">
        {randomizedVideos.map((video) => (
          <div key={video.id} className="text-center">
            <video src={video.src} controls className="w-64 h-40 rounded-lg shadow-md" />
            <div className="mt-3">
              <input
                type="number"
                min="1"
                max="3"
                value={rankings[video.id] || ""}
                onChange={(e) => handleRankingChange(video.id, e.target.value)}
                className="border p-2 rounded w-16 text-center"
                placeholder="Rank"
              />
            </div>
          </div>
        ))}
      </div>

      {/* 📩 Submit / Next */}
      <button
        onClick={submitRanking}
        className={`mt-5 px-6 py-3 rounded-lg shadow-md ${
          loading
            ? "bg-gray-400 cursor-not-allowed text-white"
            : "bg-green-500 text-white hover:bg-green-600"
        }`}
      >
        {loading
          ? "Submitting..."
          : currentAttributeIndex < randomizedAttributes.length - 1
          ? "Next Attribute"
          : "Finish"}
      </button>
    </div>
  );
};

export default RankingPage;
