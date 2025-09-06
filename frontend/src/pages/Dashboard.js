import React, { useState } from "react";
import ResumeUpload from "../components/ResumeUpload";
import JobDescription from "../components/JobDescription";
import MatchResults from "../components/MatchResults";
import AnalyticalDashboard from "../components/AnalyticalDashboard";
import ChatBot from "../components/ChatBot";
import "./style/Dashboard.css";
import { FaChartBar, FaUpload, FaCheckCircle, FaRobot, FaBars } from "react-icons/fa";


function Dashboard() {
  
  const [activeTab, setActiveTab] = useState("analytics");
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

const renderContent = () => {
  switch (activeTab) {
    case "upload":
      return (
        
        <>
          <JobDescription />
          <ResumeUpload />
        </>
      );
    case "match":
      return <MatchResults />;
    case "analytics":
      return <AnalyticalDashboard/>;
    case "chatbot":
      return <ChatBot/>;
    default:
      return <h2>Welcome to Smart Resume Analyzer</h2>;
  }
};

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <h2>{isOpen ? "MENU" : ""}</h2>
          <button className="toggle-btn" onClick={toggleSidebar}>
            <FaBars />
          </button>
        </div>
        <ul className="menu-list">
          <li
            className={activeTab === "analytics" ? "active" : ""}
            onClick={() => setActiveTab("analytics")}
          >
            <FaChartBar className="icon" /> {isOpen && "Analytical Dashboard"}
          </li>
          <li
            className={activeTab === "upload" ? "active" : ""}
            onClick={() => setActiveTab("upload")}
          >
            <FaUpload className="icon" /> {isOpen && "Upload Resume"}
          </li>
          <li
            className={activeTab === "match" ? "active" : ""}
            onClick={() => setActiveTab("match")}
          >
            <FaCheckCircle className="icon" /> {isOpen && "Match Score"}
          </li>
          <li
            className={activeTab === "chatbot" ? "active" : ""}
            onClick={() => setActiveTab("chatbot")}
          >
            <FaRobot className="icon" /> {isOpen && "Chatbot"}
          </li>
        </ul>
  <button
    className="logout-btn"
    onClick={() => {
      localStorage.removeItem("token");
      window.location.href = "/"; // Redirect after logout
    }}
  >
    Logout
  </button>
      </div>
      {/* Main Content */}
      <div className="content-area">
        {renderContent()}
      </div>
    </div>
  );
}

export default Dashboard;
