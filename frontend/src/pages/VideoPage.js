import React, { useState, useEffect } from "react";

const videoSources = [
  "/videos/Male_Agent.mp4",
  "/videos/Female_Agent.mp4",
  "/videos/Androgynous_Agent.mp4",
];

const VideoPage = ({ unlockGenderIdentification }) => {
  const userEmail = localStorage.getItem("userEmail");
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [videosWatched, setVideosWatched] = useState(0);
  const [genderUnlocked, setGenderUnlocked] = useState(
    localStorage.getItem("genderIdentificationUnlocked") === "true"
  );

  useEffect(() => {
    if (!userEmail) {
      window.location.href = "http://localhost:3000/login";
      return;
    }
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        window.location.href = "http://localhost:3000/login";
        return;
      }

      const response = await fetch(`http://localhost:8080/api/users/check-progress/${userEmail}`, {
        method: "GET",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch progress");

      const data = await response.json();
      setCurrentVideoIndex(data.lastWatchedVideo || 0);
      setVideosWatched(data.watchedTheVideos || 0);
    } catch (error) {
      console.error("Error fetching progress:", error);
    }
  };

  const handleVideoEnd = async () => {
    setCurrentVideoIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      saveProgress(nextIndex);
      return nextIndex;
    });

    if (currentVideoIndex + 1 >= videoSources.length) {
      setVideosWatched(1);
      localStorage.setItem("genderIdentificationUnlocked", "true");
      setGenderUnlocked(true);
      unlockGenderIdentification();
    }
  };

  const saveProgress = async (index) => {
    try {
      const token = localStorage.getItem("authToken");
      await fetch("http://localhost:8080/api/users/update-video-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          email: userEmail,
          lastWatchedVideo: index,
          watchedTheVideos: index >= videoSources.length ? 1 : 0,
        }),
      });
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

  const resetProgress = async () => {
    try {
      const token = localStorage.getItem("authToken");
      await fetch("http://localhost:8080/api/users/restart-videos", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ email: userEmail }),
      });

      setCurrentVideoIndex(0);
      setVideosWatched(0);
      localStorage.removeItem("genderIdentificationUnlocked");
      setGenderUnlocked(false);
    } catch (error) {
      console.error("Error resetting progress:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-white px-4">
      <div className="w-full max-w-2xl">
        <video
          key={currentVideoIndex}
          src={videoSources[currentVideoIndex]}
          controls
          autoPlay
          onEnded={handleVideoEnd}
          className="w-full h-[350px] object-contain rounded-lg shadow-lg"
        />
      </div>

      {videosWatched === 0 ? (
        <button
          onClick={resetProgress}
          className="mt-3 bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600"
        >
          Restart Videos
        </button>
      ) : genderUnlocked ? (
        <p className="mt-5 text-sm font-semibold text-gray-700">
          Proceed to <b>Gender Identification</b> by clicking <b>"Gender Identification"</b> in the left menu.
        </p>
      ) : (
        <p className="mt-5 text-sm font-semibold text-gray-700">
          Thank you for participating in our study. The videos are no longer available, as you have already completed the study. Additionally, the ranking pages are inaccessible since each participant can only take the study once.
        </p>

      )}
    </div>
  );
};

export default VideoPage;