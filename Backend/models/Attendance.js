const mongoose = require("mongoose");

const attendanceSchema =new mongoose.Schema({date: String,present: [String],absent: [String]});
module.exports =mongoose.model("Attendance",attendanceSchema);