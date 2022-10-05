const mongoose = require("../bin/mongoose.util");
const { Schema } = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    instructor: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const sessionModel = mongoose.model("Session", sessionSchema);
module.exports = { sessionModel, sessionSchema };
