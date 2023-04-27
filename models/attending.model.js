const mongoose = require("../bin/mongoose.util");
const {Schema} = require("mongoose");

const attendingSchema = new mongoose.Schema({
    courseId: {
        type: Schema.Types.ObjectId, ref: "Course", required: true,
    }, instructor: {
        type: Schema.Types.ObjectId, ref: "User", required: true,
    }, date: {
        type: Date, required: true,
    }, attendee: {
        type: Schema.Types.ObjectId, ref: 'User', required: true
    }, time: {
        type: String, required: true,
    }
}, {timestamps: true});

module.exports = mongoose.model("Attending", attendingSchema);
