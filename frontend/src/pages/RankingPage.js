import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const videoSources = [
  { src: "/videos/Male_Agent.mp4", id: 1 },
  { src: "/videos/Female_Agent.mp4", id: 2 },
  { src: "/videos/Androgynous_Agent.mp4", id: 3 },
];

const attributes = [
  { name: "affectionate", category: "Communion trait" },
  { name: "compassionate", category: "Communion trait" },
  { name: "sensitive", category: "Communion trait" },
  { name: "emotional", category: "Communion trait" },
  { name: "ambitious", category: "Agency trait" },
  { name: "aggressive", category: "Agency trait" },
  { name: "courageous", category: "Agency trait" },
  { name: "decisive", category: "Agency trait" },
  { name: "creative", category: "Competence trait" },
  { name: "intelligent", category: "Competence trait" },
  { name: "innovative", category: "Competence trait" },
  { name: "organized", category: "Competence trait" },
];

const RankingPage = () => {
  const [randomizedVideos, setRandomizedVideos] = useState([]);
  const [randomizedAttributes, setRandomizedAttributes] = useState([]);
  const [currentAttributeIndex, setCurrentAttributeIndex] = useState(0);
  const [rankings, setRankings] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("You must be logged in to access this page.");
      navigate("/login");
    } else {
      setRandomizedVideos([...videoSources].sort(() => Math.random() - 0.5));
      setRandomizedAttributes([...attributes].sort(() => Math.random() - 0.5));
    }
  }, [navigate]);

  const extractAgentName = (videoSrc) => {
    return videoSrc.split("/").pop().replace(".mp4", "").replace(/_/g, " ");
  };

  const isRankingValid = () => {
    const ranks = Object.values(rankings);
    if (ranks.length < randomizedVideos.length || ranks.includes(NaN) || ranks.includes("")) {
      alert("Please provide a unique ranking (1, 2, or 3) for each agent before submitting.");
      return false;
    }

    const uniqueRanks = new Set(ranks);
    if (ranks.length !== uniqueRanks.size || !ranks.every((rank) => rank >= 1 && rank <= 3)) {
      alert("Each agent must receive a unique rank (1, 2, or 3). Please review your rankings.");
      return false;
    }

    return true;
  };

  const handleRankingChange = (agentId, ranking) => {
    const newRankings = { ...rankings, [agentId]: parseInt(ranking) };
    setRankings(newRankings);
  };

  const submitRanking = async () => {
    if (!isRankingValid()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const userEmail = localStorage.getItem("userEmail");
      const currentAttribute = randomizedAttributes[currentAttributeIndex];

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
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error(`Failed to save ranking for ${payload.agentName}`);
      }

      if (currentAttributeIndex < randomizedAttributes.length - 1) {
        setCurrentAttributeIndex(currentAttributeIndex + 1);
        setRankings({});
      } else {
        alert("Ranking completed!");
        localStorage.removeItem("rankingUnlocked"); // Lock the page again
        window.location.reload(); // Reload the page to enforce the lock
      }
    } catch (error) {
      console.error("Error saving ranking:", error);
      alert("An error occurred while submitting. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <h2 className="text-2xl font-bold mb-4">Step 2: Rank Agents on Attributes</h2>
      <h3 className="text-lg font-semibold mb-2">Attribute: {randomizedAttributes[currentAttributeIndex]?.name}</h3>
      <p className="mb-4">Category: {randomizedAttributes[currentAttributeIndex]?.category}</p>

      <div className="flex justify-center gap-6">
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
      <button
        onClick={submitRanking}
        className={`mt-5 px-6 py-3 rounded-lg shadow-md ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 text-white hover:bg-green-600"}`}
      >
        {loading ? "Submitting..." : currentAttributeIndex < randomizedAttributes.length - 1 ? "Next Attribute" : "Finish"}
      </button>
    </div>
  );
};

export default RankingPage;
