import React, { useState } from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../pages/style/HomePage.css'; 
import Navbar from '../pages/Navbar';
import './style/SignUp.css'; 
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    organization: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message || "Signup successful!", {
          position: "top-right",
          autoClose: 3000
        });
      } else {
        toast.error(data.message || "Signup failed!", {
          position: "top-right",
          autoClose: 3000
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong!", {
        position: "top-right",
        autoClose: 3000
      });
    }
  };

  return (
    <div> 
    {/* NAVBAR */}
      <Navbar />
  <div className="signup-container">
  <h2 className="signup-title">Signup Form</h2>
  <form onSubmit={handleSubmit} className="signup-form">
    
    <div className="input-group">
      <i className="fa-solid fa-user"></i>
      <input
        type="text"
        name="name"
        placeholder="Name"
        onChange={handleChange}
        required
        className="signup-input"
      />
    </div>

    <div className="input-group">
      <i className="fa-solid fa-envelope"></i>
      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
        required
        className="signup-input"
      />
    </div>

    <div className="input-group">
      <i className="fa-solid fa-lock"></i>
      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
        required
        className="signup-input"
      />
    </div>

    <div className="input-group">
      <i className="fa-solid fa-building"></i>
      <input
        type="text"
        name="organization"
        placeholder="Organization"
        onChange={handleChange}
        className="signup-input"
      />
    </div>

    <button type="submit" className="btn-signup">Signup</button>
  </form>
  <p className="signup-message">{message}</p>
  <div className="login-text">
    Already have an account?{" "}
    <Link to="/login" className="login-link">
      Login
    </Link>
  </div>
</div>
{/* Toast Container */}
      <ToastContainer />
</div>
  );
}

export default Signup;
