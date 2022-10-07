const mongoose = require("../bin/mongoose.util");
const { Schema } = require("mongoose");

const instructorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
      required: true,
    },
    sub: {
      type: String,
      required: true,
    },
    given_name: {
      type: String,
      required: true,
    },
    family_name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    courses: {
      type: [Schema.Types.ObjectId],
      required: false,
    },
  },
  { timestamps: true }
);

const instructorModel = mongoose.model("Instructor", instructorSchema);
module.exports = { instructorModel, instructorSchema };
