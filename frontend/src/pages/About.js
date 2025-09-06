import React from "react";
import './style/HomePage.css'; 
import Navbar from './Navbar';
import FAQ from "./FAQ";

const About = () => {
  return (
    <div className="about-container">
      {/* NAVBAR */}
      <Navbar />
      {/* Why Choose Us Section */}
        <div class="container-why-choose-us">        
        <h1 class="WhyChoose">Why Choose HireWise?</h1>
        
        <div class="why-grid">
          <div class="why-box">
            <i class="fas fa-robot"></i>
            <h2>AI-Powered Matching</h2>
            <p>Smartly matches resumes with job descriptions for accuracy.</p>
          </div>
          
          <div class="why-box">
            <i class="fas fa-clock"></i>
            <h2>Faster Hiring</h2>
            <p>Save time by instantly shortlisting the best candidates.</p>
          </div>
          
          <div class="why-box">
            <i class="fas fa-lock"></i>
            <h2>Private & Secure</h2>
            <p>Your data is protected with enterprise-grade security.</p>
          </div>
          
          <div class="why-box">
            <i class="fas fa-users"></i>
            <h2>User-Friendly</h2>
            <p>Simple and intuitive interface for both recruiters and candidates.</p>
          </div>
          </div>
          <div class="why-box-mid">
            <i class="fas fa-chart-line"></i>
            <h2>Scalable</h2>
            <p>Works for small startups or large enterprises seamlessly.</p>
          </div>
      
        </div>
      
        <section class="how-it-works" id="HowItWorks">
        <h1>How the System Works</h1>
        <div class="steps">
          <div class="step">
            <span class="number">1</span>
            <h2>Upload Resume</h2>
            <p>Recruiters upload Job seekers resumes in PDF format.</p>
          </div>
          <div class="step">
            <span class="number">2</span>
            <h2>Resume Parsing</h2>
            <p>The system extracts key details like skills, education, and experience using NLP.</p>
          </div>
          <div class="step">
            <span class="number">3</span>
            <h2>Job Description Matching</h2>
            <p>The resume is compared with job descriptions for semantic similarity.</p>
          </div>
          <div class="step">
            <span class="number">4</span>
            <h2>Score & Results</h2>
            <p>The system generates a Match Score and Highlights Strengths & Weaknesses.</p>
          </div>
        </div>
      </section>
      {/* NAVBAR */}
      <FAQ />
          
     
    </div>
  );
};

export default About;
