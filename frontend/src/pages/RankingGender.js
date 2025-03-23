import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const videoSources = [
  { src: "/videos/Male_Agent.mp4", id: 1 },
  { src: "/videos/Female_Agent.mp4", id: 2 },
  { src: "/videos/Androgynous_Agent.mp4", id: 3 },
];

const genders = ["Male", "Female", "Androgynous"];

const RankingGender = ({ unlockRanking }) => {
  const [randomizedVideos, setRandomizedVideos] = useState([]);
  const [genderSelections, setGenderSelections] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("You must be logged in to access this page.");
      navigate("/login");
    } else {
      setRandomizedVideos([...videoSources].sort(() => Math.random() - 0.5));
    }
  }, [navigate]);

  const handleGenderSelection = (videoId, gender, agentName) => {
    setGenderSelections({ ...genderSelections, [videoId]: { agentName, gender } });
  };

  const extractAgentName = (videoSrc) => {
    return videoSrc.split("/").pop().replace(".mp4", "").replace(/_/g, " ");
  };

  const isSelectionValid = () => {
    const selectedGenders = Object.values(genderSelections).map((entry) => entry.gender);
    return new Set(selectedGenders).size === genders.length;
  };

  const submitGenders = async () => {
    if (!isSelectionValid()) {
      alert("Each agent must have a unique gender selection. Please adjust your choices.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const userEmail = localStorage.getItem("userEmail");

      for (const videoId of Object.keys(genderSelections)) {
        const payload = {
          userEmail,
          agentName: genderSelections[videoId].agentName,
          selectedGender: genderSelections[videoId].gender,
        };

        const response = await fetch("http://localhost:8080/api/survey/save-gender", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error(`Failed for ${payload.agentName}`);
      }

      // Unlock ranking and remove access to gender identification
      localStorage.setItem("rankingUnlocked", "true");
      localStorage.removeItem("genderIdentificationUnlocked"); // Disable access to this page
      unlockRanking(); // Update state in Dashboard

      alert("Gender identification submitted successfully!");
      navigate("/dashboard"); // Redirect to dashboard after submission
    } catch (error) {
      console.error("Error saving gender responses:", error);
      alert("An error occurred while submitting. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="w-full max-w-4xl text-center">
        <h2 className="text-2xl font-bold mb-4">Identify Agent Genders</h2>
        <div className="flex justify-center gap-6">
          {randomizedVideos.map((video) => {
            const agentName = extractAgentName(video.src);
            return (
              <div key={video.id} className="text-center">
                <video src={video.src} controls className="w-64 h-40 rounded-lg shadow-md" />
                <div className="mt-3">
                  {genders.map((gender) => (
                    <button
                      key={gender}
                      onClick={() => handleGenderSelection(video.id, gender, agentName)}
                      className={`px-4 py-2 m-1 rounded-md ${
                        genderSelections[video.id]?.gender === gender ? "bg-blue-500 text-white" : "bg-gray-200"
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
        <button
          onClick={submitGenders}
          disabled={Object.keys(genderSelections).length < 3 || loading}
          className={`mt-5 px-6 py-3 rounded-lg shadow-md ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 text-white hover:bg-green-600"
          }`}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default RankingGender;
