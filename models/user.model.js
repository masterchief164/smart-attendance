const mongoose = require('../bin/mongoose.util');
const {Schema} = require("mongoose");

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    picture: {
        type: String,
        required: true,
    },
    roll: {
        type: String,
        required: true
    },
    sub: {
        type: String,
        required: true
    },
    given_name: {
        type: String,
        required: true
    },
    family_name: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
    },
    batch: {
        type: String,
    },
    department: {
        type: String,
        required: false
    },
    courses: {
        type: [Schema.Types.ObjectId],
        required: false
    }
}, {timestamps: true});

module.exports = mongoose.model('User', userSchema);

