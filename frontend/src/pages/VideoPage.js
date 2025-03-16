import React, { useState, useEffect } from "react";

const videoSources = [
  "/videos/Male_Agent.mp4",
  "/videos/Female_Agent.mp4",
  "/videos/Androgynous_Agent.mp4",
];

const VideoPage = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [videosWatched, setVideosWatched] = useState(0);
  const userEmail = localStorage.getItem("userEmail"); // Retrieve stored email

  // Redirect to login if not logged in
  useEffect(() => {
    if (!userEmail) {
      window.location.href = "http://localhost:3000/login"; // Redirect to login page if not logged in
    }
  }, [userEmail]);

  const handleVideoEnd = () => {
    if (currentVideoIndex < videoSources.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    } else {
      setVideosWatched(3);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-white px-4">
      {/* Video Container with Controlled Height */}
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

      {/* Show Proceed Button After All Videos */}
      {videosWatched === 3 && (
        <button className="mt-5 bg-green-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-600">
          Proceed to Ranking
        </button>
      )}
    </div>
  );
};

export default VideoPage;
