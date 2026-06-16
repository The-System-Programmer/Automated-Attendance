import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-container">
      <div className="home-card">
        <span className="badge">Attendance Management System</span>

        <h1>Automated Attendance</h1>

        <p>
          Simple, accurate attendance tracking powered by facial recognition.
        </p>

        <div className="button-group">
          <Link to="/Attendance" className="primary-btn">
            Take Attendance
          </Link>

          <Link to="/Dashboard" className="secondary-btn">
            View Attendance
          </Link>
        </div>
      </div>
    </div>
  );
}