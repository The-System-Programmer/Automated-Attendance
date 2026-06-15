import { useEffect, useState } from "react";
import VideoRecorder from "../components/VideoRecorder.jsx";
import "./Attendance.css";

function Attendance() {
    const [present, setPresent] = useState([]);
    const [absent, setAbsent] = useState([]);
    const [date, setDate] = useState("");

    const loadAttendance = async () => {
        try {
            const response = await fetch(
                "https://10.91.135.233:5000/attendance/today"
            );

            const data = await response.json();

            setDate(data.date || "");
            setPresent(data.present || []);
            setAbsent(data.absent || []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadAttendance();
    }, []);

    return (
        <div className="attendance-container">
            <h1 className="title">Face Recognition Attendance System</h1>

            <div className="recorder-card">
                <VideoRecorder />
            </div>

            <button
                className="refresh-btn"
                onClick={loadAttendance}
            >
                Refresh Attendance
            </button>

            <div className="date-card">
                <h2>{date}</h2>
            </div>

            <div className="tables-container">
                <div className="table-card">
                    <h2>✅ Present Students ({present.length})</h2>

                    <table>
                        <thead>
                            <tr>
                                <th>USN</th>
                                <th>Name</th>
                            </tr>
                        </thead>

                        <tbody>
                            {present.map(student => (
                                <tr key={student._id}>
                                    <td>{student._id}</td>
                                    <td>{student.name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="table-card">
                    <h2>❌ Absent Students ({absent.length})</h2>

                    <table>
                        <thead>
                            <tr>
                                <th>USN</th>
                                <th>Name</th>
                            </tr>
                        </thead>

                        <tbody>
                            {absent.map(student => (
                                <tr key={student._id}>
                                    <td>{student._id}</td>
                                    <td>{student.name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Attendance;