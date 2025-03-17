import React, { useEffect, useState, useCallback } from "react";
import "../App.css"; // Make sure to import the App.css

const DashboardContent = () => {
  const userEmail = localStorage.getItem("userEmail"); // ✅ Retrieve stored email
  const [affiliation, setAffiliation] = useState(""); // Store affiliation

  // Memoize the fetchAffiliation function
  const fetchAffiliation = useCallback(async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve the correct token
      console.log("JWT Token:", token);

      // Check if token is available
      if (!token) {
        console.error("No token found!");
        return; // Don't proceed with the fetch request if no token
      }

      const response = await fetch("http://localhost:8080/api/users/get-affiliation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Include the token
        },
        body: JSON.stringify({ email: userEmail }), // Send email in the body
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Affiliation Data:", data); // Log data for debugging
      setAffiliation(data.affiliation);
    } catch (error) {
      console.error("Error fetching affiliation:", error);
    }
  }, [userEmail]);


  // Redirect to login if not logged in
  useEffect(() => {
    if (!userEmail) {
      window.location.href = "http://localhost:3000/login"; // Redirect to login page if not logged in
    } else {
      fetchAffiliation(); // Fetch affiliation when userEmail is available
    }
  }, [userEmail, fetchAffiliation]); // Add fetchAffiliation here

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

      {/* Display User Affiliation */}
      <div className="mt-5 p-3 bg-gray-100 rounded-md">
        <h3 className="text-xl font-semibold">User Information</h3>
        <p><strong>Email:</strong> {userEmail}</p>
        <p><strong>Affiliation:</strong> {affiliation || "Loading..."}</p>
      </div>
    </div>
  );
};

export default DashboardContent;
