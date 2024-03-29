const mongoose = require("../bin/mongoose.util");
const {Schema} = require("mongoose");

const sessionSchema = new mongoose.Schema({
    courseId: {
        type: Schema.Types.ObjectId, ref: "Course", required: true,
    }, instructor: {
        type: Schema.Types.ObjectId, ref: "User", required: true,
    }, date: {
        type: Date, required: true,
    }, attendees: {
        type: [Schema.Types.ObjectId], ref: 'User', required: false
    }
}, {timestamps: true});

module.exports = mongoose.model("Session", sessionSchema);
