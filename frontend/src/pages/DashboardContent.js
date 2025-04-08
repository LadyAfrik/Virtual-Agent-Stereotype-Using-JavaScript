// 📦 Importing React and hooks
import React, { useEffect, useState } from "react";

// 🎨 Import global styles
import "../App.css";

// 🧠 Main functional component for the Dashboard page
const DashboardContent = () => {
  // 📧 Retrieve the user's email from local storage
  const userEmail = localStorage.getItem("userEmail");

  // 🕒 State to manage the live clock
  const [time, setTime] = useState(new Date());

  // 🖱️ State to track the current mouse position on screen
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // ⚠️ State to control visibility of the dismissible alert
  const [showAlert, setShowAlert] = useState(true);

  // 🔁 Effect to update clock every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval); // Clean up timer on unmount
  }, []);

  // 🔐 Redirect user to login if not authenticated
  useEffect(() => {
    if (!userEmail) {
      window.location.href = "http://localhost:3000/login";
    }
  }, [userEmail]);

  // 🖱️ Mouse move handler to update blob position
  const handleMouseMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <div className="p-5 space-y-6" onMouseMove={handleMouseMove}>

      {/* ⚠️ Dismissible Warning Alert Box */}
      {showAlert && (
        <div className="relative bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md">
          {/* ❌ Close button */}
          <button
            onClick={() => setShowAlert(false)}
            className="absolute top-2 right-3 text-red-700 hover:text-red-900 font-bold"
          >
            ×
          </button>
          {/* ⚠️ Alert message */}
          <p className="font-semibold">
            ⚠️ Important: Once you click "Watch Videos", the 3 agent videos will autoplay one time only.
            You must complete the gender and ranking steps right after. Don't start until you're ready.
          </p>
        </div>
      )}

      {/* 👋 Welcome Heading */}
      <h2 className="text-4xl font-bold text-blue-800">Welcome to the Dashboard</h2>
      <p className="text-lg text-gray-600">
        Use the left menu to navigate through the pages. Your progress will be saved automatically.
      </p>

      {/* 👤 User Information Card */}
      <div className="mt-6 p-6 bg-gray-100 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold text-blue-800">User Information</h3>
        <p className="text-gray-700 mt-2"><strong>Email:</strong> {userEmail}</p>
      </div>

      {/* 🕒 Live Clock + 🌐 Interactive Blob */}
      <div className="fixed bottom-5 left-0 w-full text-center pointer-events-none">
        {/* ⏰ Clock display */}
        <div className="text-blue-600 text-5xl font-bold">
          {time.toLocaleTimeString()}
        </div>

        {/* 🟢 Blob following the mouse */}
        <div
          className="w-20 h-20 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 opacity-60"
          style={{
            position: "absolute",
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
            transition: "transform 0.05s linear",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
};

// 🚀 Export component to use in the app
export default DashboardContent;
