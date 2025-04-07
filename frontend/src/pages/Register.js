import React, { useState } from "react";  // Importing React and the useState hook to manage local state within the component
import { useNavigate } from "react-router-dom";  // Importing useNavigate hook to programmatically navigate to different routes
import Modal from "../components/Modal";  // ✅ Importing reusable Modal component for displaying modal dialogs in the UI

// Register component
const Register = () => {
  // State to handle form fields
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    age: "",
    levelOfStudy: "",
    affiliation: "",
  });

  // State for loading spinner, modal message, modal visibility, and post-modal redirection
  const [loading, setLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [redirectAfterClose, setRedirectAfterClose] = useState(false);

  // React Router hook for navigation
  const navigate = useNavigate();

  // Handle input changes and update corresponding form field
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission for registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate password length
    if (formData.password.length < 6) {
      setModalMessage("Password must be at least 6 characters.");
      setModalOpen(true);
      setLoading(false);
      return;
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setModalMessage("Passwords do not match.");
      setModalOpen(true);
      setLoading(false);
      return;
    }

    // Validate age as a 1-2 digit number
    if (!/^[0-9]{1,2}$/.test(formData.age)) {
      setModalMessage("Age must be a whole number with at most 2 digits.");
      setModalOpen(true);
      setLoading(false);
      return;
    }

    // Construct request payload
    const payload = {
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      gender: formData.gender,
      age: parseInt(formData.age),
      levelOfStudy: formData.levelOfStudy,
      affiliation: formData.affiliation,
    };

    try {
      // Send registration request to backend
      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Parse response safely, even if not JSON
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }

      // Handle success/failure message
      if (response.ok) {
        setModalMessage("Registration Successful! You can now log in.");
        setRedirectAfterClose(true); // Set flag to redirect after modal closes
      } else {
        setModalMessage("Registration Failed: " + (data.message || text));
      }
    } catch (error) {
      // Handle fetch error
      console.error("Error registering:", error);
      setModalMessage("An error occurred. Please try again.");
    } finally {
      setModalOpen(true);
      setLoading(false);
    }
  };

  // Handle modal close and redirect if necessary
  const handleModalClose = () => {
    setModalOpen(false);
    if (redirectAfterClose) {
      setRedirectAfterClose(false);
      navigate("/login"); // Redirect to login after successful registration
    }
  };

  return (
    <div className="bg-animated-gradient flex justify-center items-center min-h-screen">
      {/* Modal for feedback messages */}
      <Modal
        isOpen={modalOpen}
        title="Notice"
        message={modalMessage}
        onConfirm={handleModalClose}
        onCancel={handleModalClose}
        confirmText="OK"
        cancelText=""
      />

      {/* Registration form container */}
      <div className="bg-white p-8 rounded-xl shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

        {/* Registration form */}
        <form onSubmit={handleRegister}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-2 border rounded-md mb-3"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-2 border rounded-md mb-3"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="w-full p-2 border rounded-md mb-3"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <select
            name="gender"
            className="w-full p-2 border rounded-md mb-3"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <input
            type="text"
            name="age"
            placeholder="Age"
            className="w-full p-2 border rounded-md mb-3"
            value={formData.age}
            onChange={handleChange}
            required
          />
          <select
            name="levelOfStudy"
            className="w-full p-2 border rounded-md mb-3"
            value={formData.levelOfStudy}
            onChange={handleChange}
            required
          >
            <option value="">Select Level of Study</option>
            <option value="Bachelor">Bachelor</option>
            <option value="Master">Master</option>
            <option value="PhD">PhD</option>
            <option value="PostDoc">PostDoc</option>
          </select>
          <input
            type="text"
            name="affiliation"
            placeholder="Current Affiliation"
            className="w-full p-2 border rounded-md mb-3"
            value={formData.affiliation}
            onChange={handleChange}
            required
          />

          {/* Submit button */}
          <button
            type="submit"
            className={`w-full p-2 rounded-md ${
              loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
            } text-white`}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {/* Navigation links */}
        <div className="mt-4 text-center">
          <p className="text-sm">
            Already have an account?{" "}
            <span
              className="text-blue-500 cursor-pointer hover:underline"
              onClick={() => navigate("/login")} // Navigate to login
            >
              Click here to log in
            </span>
          </p>
          <p className="text-sm">
            Want to explore more?{" "}
            <span
              className="text-blue-500 cursor-pointer hover:underline"
              onClick={() => navigate("/")} // Navigate to home
            >
              Go to the home page
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
