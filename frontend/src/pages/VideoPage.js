import React, { useState, useEffect } from "react";

const videoSources = [
  "/videos/Male_Agent.mp4",
  "/videos/Female_Agent.mp4",
  "/videos/Androgynous_Agent.mp4",
];

const VideoPage = () => {
  const userEmail = localStorage.getItem("userEmail");
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [videosWatched, setVideosWatched] = useState(0);

  // ✅ Redirect if not logged in & Fetch progress
  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (!storedEmail) {
      window.location.href = "http://localhost:3000/login";
      return;
    }
    fetchProgress(storedEmail);
  }, []);

  // ✅ Fetch user's video progress from backend
  const fetchProgress = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No auth token found. Redirecting to login...");
        window.location.href = "http://localhost:3000/login";
        return;
      }

      const response = await fetch(`http://localhost:8080/api/users/check-progress/${userEmail}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch progress");
      const data = await response.json();
      setCurrentVideoIndex(data.lastWatchedVideo || 0);
      setVideosWatched(data.watchedTheVideos || 0);
    } catch (error) {
      console.error("Error fetching progress:", error);
    }
  };

  // ✅ Save progress when a video ends
  const handleVideoEnd = async () => {
    setCurrentVideoIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      saveProgress(nextIndex);
      return nextIndex;
    });

    if (currentVideoIndex + 1 >= videoSources.length) {
      setVideosWatched(1);
    }
  };

  // ✅ API call to update progress
  const saveProgress = async (index) => {
    try {
      const token = localStorage.getItem("authToken");
      await fetch("http://localhost:8080/api/users/update-video-progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ email: userEmail, lastWatchedVideo: index, watchedTheVideos: index >= videoSources.length ? 1 : 0 }),
      });
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

  // ✅ Reset progress in backend
  const resetProgress = async () => {
    try {
      const token = localStorage.getItem("authToken");
      await fetch("http://localhost:8080/api/users/restart-videos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ email: userEmail }),
      });
      setCurrentVideoIndex(0);
      setVideosWatched(0);
    } catch (error) {
      console.error("Error resetting progress:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-white px-4">
      {/* Video Player */}
      <div className="w-full max-w-2xl">
        <video
          key={currentVideoIndex}
          src={videoSources[currentVideoIndex]}
          controls
          autoPlay
          onEnded={handleVideoEnd}
          className="w-full h-[350px] object-contain rounded-lg shadow-lg"
        ></video>
      </div>

      {/* Reset Progress Button - Hidden if all videos are watched */}
      {videosWatched === 0 && (
        <button
          onClick={resetProgress}
          className="mt-3 bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600"
        >
          Restart Videos
        </button>
      )}
    </div>
  );
};

export default VideoPage;
