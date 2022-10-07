const mongoose = require("../bin/mongoose.util");
const { Schema } = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    instructor: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    students: {
      type: [Schema.Types.ObjectId],
      required: true,
    },
    sessions: {
      type: [Schema.Types.ObjectId],
      required: true,
    },
  },
  { timestamps: true }
);

const courseModel = mongoose.model("Course", courseSchema);
module.exports = { courseModel, courseSchema };
