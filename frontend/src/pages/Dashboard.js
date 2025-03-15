import React, { useState } from "react";

const videoSources = [
  "/videos/Male_Agent.mp4",
  "/videos/Female_Agent.mp4",
  "/videos/Androgynous_Agent.mp4",
];

const Dashboard = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [videosWatched, setVideosWatched] = useState(0);

  const handleVideoEnd = () => {
    if (currentVideoIndex < videoSources.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    } else {
      setVideosWatched(3);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-4">
      <h1 className="text-2xl font-bold text-center">Welcome to Your Dashboard</h1>
      <p className="mt-2 text-center">Watch the videos to proceed.</p>

      {/* Video Container with Controlled Height */}
      <div className="mt-5 w-full max-w-2xl">
        <video
          key={currentVideoIndex}
          src={videoSources[currentVideoIndex]}
          controls
          autoPlay
          onEnded={handleVideoEnd}
          className="w-full h-[400px] object-contain rounded-lg shadow-lg"
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

export default Dashboard;
