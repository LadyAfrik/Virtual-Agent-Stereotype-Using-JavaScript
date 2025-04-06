import React, { useEffect, useState } from "react";
import "../App.css"; // Ensure your styles are loaded

const DashboardContent = () => {
  const userEmail = localStorage.getItem("userEmail");
  const [time, setTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!userEmail) {
      window.location.href = "http://localhost:3000/login";
    }
  }, [userEmail]);

  // Mouse tracking state
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <div className="p-5 space-y-6" onMouseMove={handleMouseMove}>
      {/* Alert Box */}
      <div className="alert bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md animate-pulse">
        <p className="font-semibold">
          ⚠️ Important:
          Once you click "Watch Videos", the 3 agent videos will autoplay one time only.
          You must complete the gender and ranking steps right after.
          Don't start until you're ready.
        </p>
      </div>

      {/* Welcome Section */}
      <h2 className="text-4xl font-bold text-blue-800">Welcome to the Dashboard</h2>
      <p className="text-lg text-gray-600">
        Use the left menu to navigate through the pages. Your progress will be saved automatically.
      </p>

      {/* User Information */}
      <div className="mt-6 p-6 bg-gray-100 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold text-blue-800">User Information</h3>
        <p className="text-gray-700 mt-2"><strong>Email:</strong> {userEmail}</p>
      </div>

      {/* Digital Clock with Animation */}
      <div className="fixed bottom-5 left-0 w-full text-center">
        <div className="text-blue-600 text-5xl font-bold animate-bounce">
          {time.toLocaleTimeString()}
        </div>
        <div
          className="w-20 h-20 rounded-full bg-gradient-to-r from-teal-500 to-blue-500"
          style={{
            position: "absolute",
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          }}
        ></div>
      </div>
    </div>
  );
};

export default DashboardContent;
