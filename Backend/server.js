const express = require("express");
const cors = require("cors");
const multer = require("multer");
const mongoose = require("mongoose");
const { spawn } = require("child_process");
const https = require("https");
const fs = require("fs");
const Student = require("./models/Student");
const Attendance = require("./models/Attendance");

const app = express();
const path = require("path");
app.use(cors());
app.use(express.json());

app.use(
    express.static(
        path.join(__dirname, "../Frontend/dist")
    )
);
mongoose
    .connect("mongodb://localhost:27017/attendance_system")
    .then(() => {
        console.log("MongoDB Connected");
    })
    .catch((err) => {
        console.error(err);
    });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {
        const date = new Date()
            .toISOString()
            .split("T")[0];

        cb(
            null,
            `attendance-${date}.webm`
        );
    }
});

const upload = multer({ storage });

app.post(
    "/attendance",
    upload.single("video"),
    async (req, res) => {

        try {

            if (!req.file) {
                return res.status(400).json({success: false,error: "No video uploaded"});
            }
            const videoPath = req.file.path;
            console.log("Video Saved:");
            console.log(videoPath);
            const python = spawn("python3",["../Python/verify.py",videoPath]);

            let output = "";
            let errorOutput = "";
            python.stdout.on("data", (data) => {output += data.toString();});
            python.stderr.on("data", (data) => {errorOutput += data.toString();});

            python.on("close", async (code) => {
                console.log("Python exited with code:",code);
                if (errorOutput) {console.warn("Python Warnings:");
                    console.warn(errorOutput);
                }
                try {
                    const lines =output.trim().split("\n");
                    const jsonLine =lines[lines.length - 1];
                    const result =JSON.parse(jsonLine);
                    console.log("Detected USNs:");
                    console.log(result.present);
                    const allStudents =await Student.find();
                    const presentStudents =
                        allStudents.filter(student => result.present.includes(student._id));
                    const absentStudents =
                        allStudents.filter(student =>!result.present.includes(student._id));
                    const today = new Date().toISOString().split("T")[0];
                    const presentUSNs =presentStudents.map(student =>student._id);
                    const absentUSNs =absentStudents.map(student =>student._id);
                    await Attendance.findOneAndUpdate(
                        {
                            date: today
                        },
                        {
                            date: today,
                            present:presentUSNs,
                            absent:absentUSNs
                        },
                        {
                            upsert: true,
                            new: true
                        }
                    );
                    console.log("Attendance Saved");
                    res.json({success: true,date: today,present:presentStudents,absent:absentStudents});
                }
                catch (err) {

                    console.error("Failed to parse Python output");
                    console.error(output);

                    res.status(500).json({success: false,
                        error:
                            "Invalid Python response"
                    });
                }
            });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({success: false,error: err.message});
        }
    }
);

app.get(
    "/students",
    async (req, res) => {
        try {
            const students =await Student.find();
            res.json(students);
        }
        catch (err) {
            res.status(500).json({error: err.message});
        }
    }
);

app.get(
    "/attendance/today",
    async (req, res) => {

        try {

            const today =
                new Date()
                    .toISOString()
                    .split("T")[0];

            console.log("Today:", today);

            const attendance =
                await Attendance.findOne({
                    date: today
                });

            console.log("Attendance:");
            console.log(attendance);

            if (!attendance) {

                return res.json({
                    date: today,
                    present: [],
                    absent: []
                });
            }

            const presentStudents =
                await Student.find({
                    _id: {
                        $in: attendance.present
                    }
                });

            const absentStudents =
                await Student.find({
                    _id: {
                        $in: attendance.absent
                    }
                });

            console.log("Present:");
            console.log(presentStudents);

            console.log("Absent:");
            console.log(absentStudents);

            res.json({
                date: today,
                present: presentStudents,
                absent: absentStudents
            });

        }
        catch (err) {

            console.error(err);

            res.status(500).json({
                error: err.message
            });
        }
    }
);


app.get(
    "/attendance/:date",
    async (req, res) => {

        try {
            const attendance = await Attendance.findOne({
                date: req.params.date
            });

            res.json(attendance);
        }
        catch (err) {
            res.status(500).json({
                error: err.message
            });
        }
    }
);

app.get(/.*/, (req, res) => {
    res.sendFile(
        path.join(__dirname, "../Frontend/dist/index.html")
    );
});

https.createServer(
    {
        key: fs.readFileSync("key.pem"),
        cert: fs.readFileSync("cert.pem"),
    },
    app
).listen(5000, "0.0.0.0", () => {
    console.log("HTTPS server running on port 5000");
});