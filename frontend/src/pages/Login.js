import React, { useState } from "react";  // Importing React and useState hook for managing state
import { useNavigate } from "react-router-dom";  // Importing useNavigate hook for navigation between pages
import Modal from "../components/Modal";  // ✅ Importing a reusable modal component for showing messages and alerts

// Login component
const Login = () => {
  // State variables for email, password, loading indicator, modal message, and modal visibility
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  // Hook for navigating between routes
  const navigate = useNavigate();

  // Function to handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form default behavior
    setLoading(true); // Show loading state

    try {
      // Send login request to backend
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }), // Send user credentials
      });

      const data = await response.json(); // Parse response JSON

      if (response.ok) {
        // If login is successful, store token and email
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userEmail", email);
        setModalMessage("Login Successful!"); // Show success message
        setModalOpen(true); // Open modal
      } else {
        // If login fails, show error message
        setModalMessage("Login Failed: " + (data.error || "Invalid email or password"));
        setModalOpen(true);
      }
    } catch (error) {
      // Catch and display error if the request fails
      console.error("Error logging in:", error);
      setModalMessage("An error occurred. Please try again.");
      setModalOpen(true);
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  // Handle modal confirmation action
  const handleModalConfirm = () => {
    setModalOpen(false); // Close modal
    if (modalMessage === "Login Successful!") {
      navigate("/dashboard"); // Redirect to dashboard if login was successful
    }
  };

  return (
    <div className="bg-animated-gradient flex justify-center items-center min-h-screen">
      {/* Modal for displaying login feedback */}
      <Modal
        isOpen={modalOpen}
        title="Notice"
        message={modalMessage}
        onConfirm={handleModalConfirm}
        onCancel={() => setModalOpen(false)}
        confirmText="OK"
        cancelText="Close"
      />

      {/* Login form container */}
      <div className="bg-white p-8 rounded-xl shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        {/* Login form */}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded-md mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Update email state
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded-md mb-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Update password state
            required
          />
          <button
            className={`w-full p-2 rounded-md ${
              loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
            } text-white`}
            disabled={loading} // Disable button while loading
          >
            {loading ? "Logging in..." : "Login"} {/* Show loading text or "Login" */}
          </button>
        </form>

        {/* Navigation links */}
        <div className="mt-4 text-center">
          <p className="text-sm">
            Don't have an account yet?{" "}
            <span
              className="text-blue-500 cursor-pointer hover:underline"
              onClick={() => navigate("/register")} // Navigate to register page
            >
              Click here to register
            </span>
          </p>
          <p className="text-sm">
            Return to{" "}
            <span
              className="text-blue-500 cursor-pointer hover:underline"
              onClick={() => navigate("/")} // Navigate to home page
            >
              the Home page
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
