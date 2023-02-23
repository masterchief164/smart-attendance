const mongoose = require("../bin/mongoose.util");
const {Schema} = require("mongoose");

const courseSchema = new mongoose.Schema({
    name: {
        type: String, required: true,
    }, instructor: {
        type: Schema.Types.ObjectId, ref: "User", required: true,
    }, students: {
        type: [Schema.Types.ObjectId], ref: "User", required: true,
    }, sessions: {
        type: [Schema.Types.ObjectId], ref: "Session", required: true,
    },
}, {timestamps: true});

module.exports = mongoose.model("Course", courseSchema);
