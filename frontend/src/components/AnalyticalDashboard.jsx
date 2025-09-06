import React, { useState, useEffect } from "react";
import './style/Style.css'; 
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const AnalyticalDashboard = () => {
  const [dashboardData, setDashboardData] = useState({});

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem("token"); 
      if (!token) return; 

      try {
        const response = await fetch("http://localhost:5000/dashboard", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error('Unauthorized');

        const data = await response.json();
        setDashboardData(data); 
      } catch (err) {
        console.error(err);
      }
    };

    fetchDashboard();
  }, []); // empty deps = run only once

  // Define chart data based on API response
  const data = {
    labels: ["Accepted", "Waitlisted", "Rejected"],
    datasets: [
      {
        data: [
          dashboardData.status_counts?.Accept || 0,
          dashboardData.status_counts?.Waitlist || 0,
          dashboardData.status_counts?.Reject || 0,
        ],
        backgroundColor: ["#348d37", "#e0c36c", "#a0443e"], // green, yellow, red
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Dashboard</h2>

      {/* Total Resumes Bar */}
      <div className="total-bar">
        <span>TOTAL RESUMES: </span>
        <strong>{dashboardData.total_resumes}</strong>
      </div>

      {/* Status Cards */}
      <div className="status-cards">
        <div className="status-card accepted">
          <h3>Accepted</h3>
          <p>{dashboardData.status_counts?.Accept || 0}</p>
        </div>
        <div className="status-card waitlisted">
          <h3>Waitlisted</h3>
          <p>{dashboardData.status_counts?.Waitlist || 0}</p>
        </div>
        <div className="status-card rejected">
          <h3>Rejected</h3>
          <p>{dashboardData.status_counts?.Reject || 0}</p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="chart-container">
        <h3>Status Distribution</h3>
        <Pie data={data} />
      </div>

      {/* Recent Uploads */}
      <div className="recent-uploads">
        <h3>Recent Uploads</h3>
        <ul>
          {dashboardData.recent_uploads?.map((r) => (
            <li key={r.file_name}>
              <span className="file">{r.file_name}</span>
              <span className="date">{r.upload_date}</span>
              <span className={`status ${r.status.toLowerCase()}`}>
                {r.status}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AnalyticalDashboard;
