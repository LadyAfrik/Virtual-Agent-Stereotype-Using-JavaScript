import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    age: "",
    levelOfStudy: "",
    affiliation: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (!/^[0-9]{1,2}$/.test(formData.age)) {
      setError("Age must be a whole number with at most 2 digits.");
      setLoading(false);
      return;
    }

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
      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const text = await response.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch (parseError) {
        data = { message: text };
      }

      if (response.ok) {
        alert("Registration Successful! You can now log in.");
        navigate("/login");
      } else {
        setError("Registration Failed: " + (data.message || text));
      }
    } catch (error) {
      console.error("Error registering:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-animated-gradient flex justify-center items-center min-h-screen">
      <div className="bg-white p-8 rounded-xl shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
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
        {/* Links for navigation */}
        <div className="mt-4 text-center">
          <p className="text-sm">
            Already have an account?{" "}
            <span
              className="text-blue-500 cursor-pointer hover:underline"
              onClick={() => navigate("/login")}
            >
              Click here to log in
            </span>
          </p>
          <p className="text-sm">
            Want to explore more?{" "}
            <span
              className="text-blue-500 cursor-pointer hover:underline"
              onClick={() => navigate("/")}
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
