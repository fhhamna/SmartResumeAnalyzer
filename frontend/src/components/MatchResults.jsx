import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './style/Style.css'; 

const API = "http://127.0.0.1:5000";

const STATUSES = ["Accept", "Waitlist", "Reject"];

const MatchResults = () => {
  const [results, setResults] = useState([]);       
  const [topResults, setTopResults] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [topN, setTopN] = useState(5); // default Top 5
  const [editing, setEditing] = useState(null); 
  

  const token = localStorage.getItem("token");

  const getMatches = async (limit = null) => {
    setLoading(true);
    setMessage("");
    try {
      const url = limit ? `${API}/match_score?limit=${limit}` : `${API}/match_score`;
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (res.status === 401) {
        toast.error("Unauthorized. Please log in.");
        localStorage.removeItem("token");
        setLoading(false);
        return;
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to fetch matches");
      }

      const data = await res.json();

      if (limit) {
        setTopResults(data);
        
      } else {
        setResults(data);
        setTopResults(data.slice(0, topN));
      }
      toast.success("Matches loaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Error fetching matches");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (filename, newStatus) => {
    setMessage("");
    if (!token) {
       toast.error("Unauthorized! Please log in.");
      return;
    }

    try {
      const res = await fetch(`${API}/update_status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ filename, status: newStatus })
      });

      if (res.status === 401) {
        toast.error("Unauthorized! Please log in again.");
        localStorage.removeItem("token");
        return;
      }

      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload.error || "Error updating status");
      }

      setResults(prev =>
        prev.map(item => (item.filename === filename ? { ...item, status: newStatus } : item))
      );
      setTopResults(prev =>
        prev.map(item => (item.filename === filename ? { ...item, status: newStatus } : item))
      );

      toast.success(payload.message || `Status updated to ${newStatus}`);
      setEditing(null);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Error updating status");
    }
  };

  const toggleEdit = (filename) => {
    setEditing(prev => (prev === filename ? null : filename));
  };

  useEffect(() => {
    getMatches(); 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTopN = async (n) => {
    setTopN(n);
    setLoading(true);
    try {
      await getMatches(n);
    } finally {
      setLoading(false);
    }
  };

  const deleteResume = async (filename) => {
  if (!token) {
    toast.error("Unauthorized! Please log in.");
    return;
  }

  if (!window.confirm(`Are you sure you want to delete ${filename}?`)) return;

  try {
    const res = await fetch(`${API}/delete_resume/${filename}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to delete resume");

    toast.success(`${filename} deleted successfully!`);

    // Remove the deleted resume from state
    setResults(prev => prev.filter(r => r.filename !== filename));
    setTopResults(prev => prev.filter(r => r.filename !== filename));

  } catch (err) {
    console.error(err);
    toast.error(err.message || "Error deleting resume");
  }
};


  return (
    <div className="match-container" style={{ padding: 16 }}>
      <h2>Match Results</h2>

      <div style={{ marginBottom: 12 }}>
  <button className="white-button" onClick={() => getMatches()} disabled={loading}>
    Refresh All
  </button>
  <button className="white-button" onClick={() => fetchTopN(5)} disabled={loading}>
    Top 5
  </button>
  <button className="white-button" onClick={() => fetchTopN(10)} disabled={loading}>
    Top 10
  </button>
  <span style={{ marginLeft: 12 }}>{loading ? "Loading..." : ""}</span>
</div>


      {message && <p style={{ color: "crimson" }}>{message}</p>}

      <h3>Top {topN} Matches</h3>
      <table style={{ width: "100%", marginBottom: 20 }}>
        <thead>
          <tr>
            <th>Filename</th>
            <th>Score</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {topResults.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>No top matches found</td>
            </tr>
          ) : (
            topResults.map(r => (
              <tr key={r.filename}>
                <td>{r.filename}</td>
                <td>{r.score}</td>
                <td>{r.status || "—"}</td>
                <td>
  <button
    className="button accept"
    onClick={() => updateStatus(r.filename, "Accept")}
  >
    Accept
  </button>
  <button
    className="button waitlist"
    onClick={() => updateStatus(r.filename, "Waitlist")}
  >
    Waitlist
  </button>
  <button
    className="button reject"
    onClick={() => updateStatus(r.filename, "Reject")}
  >
    Reject
  </button>
</td>

              </tr>
            ))
          )}
        </tbody>
      </table>

      <h3>All Matches</h3>
      <table style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Filename</th>
            <th>Score</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {results.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>No results found</td>
            </tr>
          ) : (
            results.map(r => (
              <tr key={r.filename}>
                <td>{r.filename}</td>
                <td>{r.score}</td>
                <td>
                  {editing === r.filename ? (
                    <select
                      value={r.status || "Waitlist"}
                      onChange={(e) => updateStatus(r.filename, e.target.value)}
                    >
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  ) : (
                    r.status || "—"
                  )}
                </td>
                <td>
  <button className="button accept" onClick={() => updateStatus(r.filename, "Accept")}>Accept</button>
  <button className="button waitlist" onClick={() => updateStatus(r.filename, "Waitlist")}>Waitlist</button>
  <button className="button reject" onClick={() => updateStatus(r.filename, "Reject")}>Reject</button>
  <button className="button delete" onClick={() => deleteResume(r.filename)}>Delete</button> {/* NEW */}
</td>

              </tr>
            ))
          )}
        </tbody>
      </table>
       {/* Toast container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default MatchResults;
