import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './style/Login.css'; 
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../pages/style/HomePage.css'; 
import Navbar from '../pages/Navbar';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // Save token and recruiter info to localStorage
        localStorage.setItem("token", data.token);

        localStorage.setItem("recruiter_ID", data.recruiter_ID); // match backend casing
        localStorage.removeItem("recruiter_id"); // remove old/case-mismatched keys
        localStorage.setItem("name", data.name); 

        toast.success("Login successful!");
        setTimeout(() => navigate("/dashboard"), 1500); 
      } else {
        toast.error(data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div> 
      <Navbar />

      <div className="login-container">
        <h2 className="login-title">Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
          
          <div className="input-group">
            <i className="fa-solid fa-envelope"></i>
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
              className="login-input"
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
              className="login-input"
            />
          </div>

          <button type="submit" className="btn-login">Login</button>
        </form>

        <div className="signup-text">
          Do not have an account?{" "}
          <Link to="/signup" className="signup-link">
            Sign Up
          </Link>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default Login;
