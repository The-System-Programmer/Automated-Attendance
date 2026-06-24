import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            setLoading(true);

            const response = await fetch(
                "https://10.91.135.233:5000/dashboard"
            );
            const data = await response.json();
            setStudents(data);
        } catch (err) {
            console.error(
                "Dashboard Error:",
                err
            );
        } finally {
            setLoading(false);
        }
    };

    const totalStudents = students.length;

    const totalClasses =
        students.length > 0
            ? students[0].totalClasses
            : 0;

    const classAverage =
        totalStudents > 0
            ? (students.reduce((sum, student) =>sum +Number(student.percentage),0) / totalStudents
              ).toFixed(1): 0;

    const highestAttendance =
        students.length > 0
            ? Math.max(...students.map((student) =>Number(student.percentage))): 0;

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">

                <h1 className="dashboard-title">
                    Attendance Dashboard
                </h1>

                <div className="dashboard-nav">
                    <Link
                        to="/"
                        className="dashboard-btn"
                    >
                        Home
                    </Link>

                    <Link
                        to="/attendance"
                        className="dashboard-btn"
                    >
                        Take Attendance
                    </Link>

                    <button
                        className="dashboard-btn"
                        onClick={loadDashboard}
                    >
                        Refresh
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="loading">
                    Loading dashboard...
                </div>
            ) : (
                <>
                    <div className="dashboard-cards">

                        <div className="stat-card">
                            <h3>
                                Total Students
                            </h3>
                            <p>
                                {totalStudents}
                            </p>
                        </div>

                        <div className="stat-card">
                            <h3>
                                Classes Conducted
                            </h3>
                            <p>
                                {totalClasses}
                            </p>
                        </div>

                        <div className="stat-card">
                            <h3>
                                Class Average
                            </h3>
                            <p>
                                {classAverage}%
                            </p>
                        </div>

                        <div className="stat-card">
                            <h3>
                                Highest Attendance
                            </h3>
                            <p>
                                {
                                    highestAttendance
                                }
                                %
                            </p>
                        </div>

                    </div>

                    <div className="table-wrapper">
                        <table className="stats-table">
                            <thead>
                                <tr>
                                    <th>USN</th>
                                    <th>Name</th>
                                    <th>
                                        Classes
                                    </th>
                                    <th>
                                        Present
                                    </th>
                                    <th>
                                        Absent
                                    </th>
                                    <th>
                                        Attendance %
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {students.map(
                                    (
                                        student
                                    ) => (
                                        <tr
                                            key={
                                                student.usn
                                            }
                                        >
                                            <td>
                                                {
                                                    student.usn
                                                }
                                            </td>

                                            <td>
                                                {
                                                    student.name
                                                }
                                            </td>

                                            <td>
                                                {
                                                    student.totalClasses
                                                }
                                            </td>

                                            <td>
                                                {
                                                    student.present
                                                }
                                            </td>

                                            <td>
                                                {
                                                    student.absent
                                                }
                                            </td>

                                            <td>
                                                {
                                                    student.percentage
                                                }
                                                %
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}

export default Dashboard;