import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const JobDescription = () => {
  const [jd, setJd] = useState("");
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    try {
      const res = await axios.post("http://localhost:5000/upload_jd", {
        job_description: jd,
      });

      toast.success(res.data.message); // ✅ success toast
    } catch (error) {
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message); // ✅ backend error toast
      } else {
        toast.error("Error uploading Job Description"); // fallback
      }
      console.error(error);
    }
  };

  return (
    <div className="jd-container">
  <h4>Upload Job Description</h4>
  <textarea
    value={jd}
    onChange={(e) => setJd(e.target.value)}
    rows={6}
    cols={50}
    placeholder="Paste the job description here"
  ></textarea>
  <br />
  <button onClick={handleUpload}>Submit Job Description</button>
  {message && <p>{message}</p>}

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

export default JobDescription;
