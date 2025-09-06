import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import HireWiseLogo from "../img/HireWiseLogo.png";
import HRimage from "../img/HRimage.png";
import './style/HomePage.css'; 
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';
import FAQ from "./FAQ";

function HomePage() {
  return (
    <div className='bg'>
      {/* NAVBAR */}
      <Navbar />
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-white">
    <div className="containCr mt-5">
  {/* Left - Text */}
  <div className="textBox">
    <p className="mb-4">
      Automatically match resumes with job descriptions and identify top candidates through AI-powered analysis.
    </p>
    <p className="lead">AI-Powered Resume Analyzer for Smarter Hiring</p>
    <div className="buttons">
              <Link to="/login" className="btn-logindb">Login</Link>
              <Link to="/signup" className="btn-signupdb">Signup</Link>
    </div>
  </div>

  {/* Right - Image */}
  <img 
    src={HRimage} 
    alt="HR Image" 
    className="HRimage" 
  />
</div>
</div>

  <footer className="footer text-black py-4">
  <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
    {/* Logo */}
    <div className="footer-logo mb-3 mb-md-0">
      <img src={HireWiseLogo} alt="HireWise Logo" style={{height: '80px'}}/>
    </div>

    {/* Social Icons */}
    <div className="footer-social">
      <i className="fab fa-linkedin mx-2"></i>
      <i className="fab fa-twitter mx-2"></i>
      <i className="fab fa-github mx-2"></i>
    </div>
  </div>

  <div className='text-center mt-3'>
    <a href="/privacy-policy" className="text-black mx-2">Privacy Policy</a>
    <a href="/terms-of-use" className="text-black mx-2">Terms of Use</a>
    <a href="/about" className="text-black mx-2">About</a>
    
  </div>
  <div className="text-center mt-3">
    © 2025 HireWise. All rights reserved.
  </div>
</footer>
    </div>
    
    
    
  );
}

export default HomePage;
