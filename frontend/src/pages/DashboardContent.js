import React, { useEffect } from "react";
import "../App.css"; // Make sure to import the App.css

const DashboardContent = () => {
  const userEmail = localStorage.getItem("userEmail"); // ✅ Retrieve stored email

  // Redirect to login if not logged in
  useEffect(() => {
    if (!userEmail) {
      window.location.href = "http://localhost:3000/login"; // Redirect to login page if not logged in
    }
  }, [userEmail]);

  return (
    <div className="p-5">
      {/* Red Blinking Alert */}
      <div className="alert">
        <p>
          Please note that immediately you click on "Watch Videos" from the left menu, the three agents' videos will start playing one after the other. Then, you will have the link to rate the agents. You can only watch the three videos once, even if you log out and log in again. Please click on "Watch Videos" when you are ready to begin the experiment. Thank you.
        </p>
      </div>

      <h2 className="text-3xl font-bold">Welcome to the Dashboard</h2>
      <p className="mt-3 text-gray-600">
        Use the left menu to navigate through the pages.
      </p>
    </div>
  );
};

export default DashboardContent;
