import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RankingPage = () => {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail");
  const [accessMessage, setAccessMessage] = useState("");
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    if (!userEmail) {
      navigate("/login");
      return;
    }

    const checkAccess = async () => {
      try {
        const response = await fetch("http://localhost:8080/check-access", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: userEmail }),
        });

        if (!response.ok) {
          throw new Error(`Server returned ${response.status}`);
        }

        const data = await response.json();
        console.log("Access Check Response:", data); // Debugging line

        if (!data.success) {
          setAccessMessage("Access Denied, please contact the administrator on christianah_oyewale@sfu.ca");
          return;
        }

        if (data.watched_the_videos !== 1) {
          setAccessMessage("Access Denied. You must watch the videos first.");
        } else if (data.watched_the_videos === 1 && data.taken_the_survey !== 1) {
          setHasAccess(true);
        } else if (data.watched_the_videos === 1 && data.taken_the_survey === 1) {
          setAccessMessage("You have already taken this survey.");
        } else {
          setAccessMessage("Access Denied, please contact the administrator on christianah_oyewale@sfu.ca");
        }
      } catch (error) {
        console.error("Error fetching access data:", error);
        setAccessMessage(`Error checking access: ${error.message}`);
      }
    };


    checkAccess();
  }, [userEmail, navigate]);

  if (accessMessage) {
    return <div className="text-center text-red-500 font-bold mt-10">{accessMessage}</div>;
  }

  if (!hasAccess) {
    return null;
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Ranking Page</h1>
      {/* Ranking logic goes here */}
    </div>
  );
};

export default RankingPage;
