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
                "https://10.91.135.233:5000"
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
            <div className="attendance-card">
                <h2 className="attendance-title">
                    Video Attendance Recorder
                </h2>

                <div className="video-container">
                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        className="attendance-video"
                    />
                </div>

                <div className="button-container">
                    {!recording ? (
                        <button
                            onClick={startRecording}
                            className="record-btn"
                        >
                            Start Recording
                        </button>
                    ) : (
                        <button
                            onClick={stopRecording}
                            className="stop-btn"
                        >
                            Stop Recording
                        </button>
                    )}
                </div>
            </div>
        </div>
           );
}

export default Attendance;