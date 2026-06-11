import { useEffect, useState } from "react";
import VideoRecorder from "../components/VideoRecorder.jsx";

function Attendance() {

    const [present, setPresent] = useState([]);
    const [absent, setAbsent] = useState([]);
    const [date, setDate] = useState("");

    const loadAttendance = async () => {

        try {

            const response = await fetch(
                "http://localhost:5000/attendance/today"
            );

            const data = await response.json();

            setDate(data.date || "");
            setPresent(data.present || []);
            setAbsent(data.absent || []);

        }
        catch (err) {

            console.error(err);
        }
    };

    useEffect(() => {
        loadAttendance();
    }, []);

    return (
        <div>

            <h1>Attendance Recording</h1>

            <VideoRecorder />

            <button onClick={loadAttendance}>
                Refresh Attendance
            </button>

            <h2>{date}</h2>

            <h2>Present Students</h2>

            <table border="1">
                <thead>
                    <tr>
                        <th>USN</th>
                        <th>Name</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        present.map(student => (
                            <tr key={student._id}>
                                <td>{student._id}</td>
                                <td>{student.name}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>

            <h2>Absent Students</h2>

            <table border="1">
                <thead>
                    <tr>
                        <th>USN</th>
                        <th>Name</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        absent.map(student => (
                            <tr key={student._id}>
                                <td>{student._id}</td>
                                <td>{student.name}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>

        </div>
    );
}

export default Attendance;