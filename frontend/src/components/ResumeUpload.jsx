import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResumeUpload = () => {
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState("");
  const [parsedResumes, setParsedResumes] = useState([]);

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleUpload = async () => {
    if (!files.length) {
      toast.error("Please select at least one file."); // for errors
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      console.log(files[i].name); 
      formData.append("resumes", files[i]);
    }

     // add recruiter_id
    const recruiterId = localStorage.getItem("recruiter_ID"); 
    formData.append("recruiter_ID", recruiterId);

    try {
      const response = await axios.post(
        "http://localhost:5000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setParsedResumes(response.data.parsed_resumes);
      toast.success("Resumes uploaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Error uploading resumes.");
    }
  };

  const handleReset = () => {
    setFiles([]);
    setParsedResumes([]);
    setMessage("");
  };

  return (
    <div className="upload-container">
      <h2 className="upload-title">Upload Resumes</h2>

      <div className="upload-input">
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="upload-file"
          accept=".pdf,.txt"
        />
      </div>

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

      <div className="upload-buttons">
        <button className="upload-btn upload-primary" onClick={handleUpload}>
          Upload
        </button>
        <button className="upload-btn upload-secondary" onClick={handleReset}>
          Reset
        </button>
      </div>

      {parsedResumes.length > 0 && (
        <div className="parsed-container">
          <h4 className="parsed-title">Parsed Resumes:</h4>
          <ul className="parsed-list">
            {parsedResumes.map((res, idx) => (
              <li key={idx} className="parsed-item">
                <strong className="parsed-filename">{res.filename}</strong>

                {/* Education */}
                <div className="parsed-section">
                  <strong>Education:</strong>
                  <ul>
                    {res.parsed_data.education.length > 0 ? (
                      res.parsed_data.education.map((edu, i) => (
                        <li key={i}>{edu}</li>
                      ))
                    ) : (
                      <li>N/A</li>
                    )}
                  </ul>
                </div>

                {/* Experience */}
                <div className="parsed-section">
                  <strong>Experience:</strong>
                  <ul>
                    {res.parsed_data.experience.length > 0 ? (
                      res.parsed_data.experience.map((exp, i) => (
                        <li key={i}>{exp}</li>
                      ))
                    ) : (
                      <li>N/A</li>
                    )}
                  </ul>
                </div>

                {/* Skills */}
                <div className="parsed-section">
                  <strong>Skills:</strong>
                  <ul>
                    {res.parsed_data.skills.length > 0 ? (
                      res.parsed_data.skills.map((skill, i) => (
                        <li key={i}>{skill}</li>
                      ))
                    ) : (
                      <li>N/A</li>
                    )}
                  </ul>
                </div>
                {/* Emails */}
          <div className="parsed-section">
            <strong>Email(s):</strong>
            <ul>
              {res.parsed_data.emails && res.parsed_data.emails.length > 0 ? (
                res.parsed_data.emails.map((email, i) => (
                  <li key={i}>{email}</li>
                ))
              ) : (
                <li>N/A</li>
              )}
            </ul>
          </div>
          {/* Phone Numbers */}
          <div className="parsed-section">
            <strong>Phone Number(s):</strong>
            <ul>
              {res.parsed_data.phone_numbers && res.parsed_data.phone_numbers.length > 0 ? (
                res.parsed_data.phone_numbers.map((phone, i) => (
                  <li key={i}>{phone}</li>
                ))
              ) : (
                <li>N/A</li>
              )}
            </ul>
          </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;