import React from "react";

const RESUME_CHECKER_URL = "https://jobviewapp.streamlit.app/";

const ResumeCheckerButton = () => (
  <div style={{ display: "flex", justifyContent: "center", margin: "2rem 0" }}>
    <a
      href={RESUME_CHECKER_URL}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        textDecoration: "none",
      }}
    >
      <button
        style={{
          background: "#7C3AED",
          color: "#fff",
          padding: "0.75rem 1.5rem",
          border: "none",
          borderRadius: "0.5rem",
          fontSize: "1rem",
          fontWeight: "bold",
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
        }}
      >
        📄 Click this to access the Resume Checker feature
      </button>
    </a>
  </div>
);

export default ResumeCheckerButton;
