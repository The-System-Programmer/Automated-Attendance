import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import VideoRecorder from "../components/VideoRecorder.jsx";
import "./Attendance.css";

function Attendance() {
    const [present, setPresent] = useState([]);
    const [absent, setAbsent] = useState([]);
    const [date, setDate] = useState("");

    const loadAttendance = async () => {
        try {
            console.log("Fetching attendance...");

            const response = await fetch(
                "https://172.1.27.35:5000/attendance/today"
            );

            const data = await response.json();

            console.log("Attendance Data:", data);

            setDate(data.date || "");
            setPresent(data.present || []);
            setAbsent(data.absent || []);
        } catch (err) {
            console.error(
                "Failed to load attendance:",
                err
            );
        }
    };

    useEffect(() => {
        loadAttendance();
    }, []);

    return (
        <div className="attendance-container">
            <div className="attendance-card">

                <div className="attendance-header">
                    <div>
                        <h1 className="attendance-title">
                            Smart Attendance System
                        </h1>
                    </div>

                    <div className="attendance-navbar">
                        <Link
                            to="/"
                            className="nav-btn"
                        >
                            Home
                        </Link>

                        <Link
                            to="/dashboard"
                            className="nav-btn"
                        >
                            Dashboard
                        </Link>

                        <button
                            className="nav-btn refresh-btn"
                            onClick={loadAttendance}
                        >
                            Refresh
                        </button>
                    </div>
                </div>

                <div className="attendance-content">

                    <div className="video-section">
                        <VideoRecorder />
                    </div>

                    <div className="attendance-results">

                        <h2>
                            Today's Attendance
                        </h2>

                        <p className="attendance-date">
                            {date ||
                                "No attendance recorded"}
                        </p>

                        <div className="attendance-group">
                            <h3>
                                Present ({present.length})
                            </h3>

                            {present.length === 0 ? (
                                <p>
                                    No students present
                                </p>
                            ) : (
                                <ul>
                                    {present.map(
                                        (student) => (
                                            <li
                                                key={
                                                    student._id
                                                }
                                            >
                                                <strong>
                                                    {
                                                        student._id
                                                    }
                                                </strong>
                                                <br />
                                                {
                                                    student.name
                                                }
                                            </li>
                                        )
                                    )}
                                </ul>
                            )}
                        </div>

                        <div className="attendance-group">
                            <h3>
                                Absent ({absent.length})
                            </h3>

                            {absent.length === 0 ? (
                                <p>
                                    No absent
                                    students
                                </p>
                            ) : (
                                <ul>
                                    {absent.map(
                                        (student) => (
                                            <li
                                                key={
                                                    student._id
                                                }
                                            >
                                                <strong>
                                                    {
                                                        student._id
                                                    }
                                                </strong>
                                                <br />
                                                {
                                                    student.name
                                                }
                                            </li>
                                        )
                                    )}
                                </ul>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Attendance;