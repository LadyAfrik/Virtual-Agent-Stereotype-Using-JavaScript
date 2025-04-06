import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal"; // ✅ Make sure this path is correct

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userEmail", email);
        setModalMessage("Login Successful!");
        setModalOpen(true);
      } else {
        setModalMessage("Login Failed: " + (data.error || "Invalid email or password"));
        setModalOpen(true);
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setModalMessage("An error occurred. Please try again.");
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleModalConfirm = () => {
    setModalOpen(false);
    if (modalMessage === "Login Successful!") {
      navigate("/dashboard");
    }
  };

  return (
    <div className="bg-animated-gradient flex justify-center items-center min-h-screen">
      <Modal
        isOpen={modalOpen}
        title="Notice"
        message={modalMessage}
        onConfirm={handleModalConfirm}
        onCancel={() => setModalOpen(false)}
        confirmText="OK"
        cancelText="Close"
      />

      <div className="bg-white p-8 rounded-xl shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded-md mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded-md mb-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            className={`w-full p-2 rounded-md ${
              loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
            } text-white`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm">
            Don't have an account yet?{" "}
            <span
              className="text-blue-500 cursor-pointer hover:underline"
              onClick={() => navigate("/register")}
            >
              Click here to register
            </span>
          </p>
          <p className="text-sm">
            Return to{" "}
            <span
              className="text-blue-500 cursor-pointer hover:underline"
              onClick={() => navigate("/")}
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
