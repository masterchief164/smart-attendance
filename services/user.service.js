const User = require('../models/user.model');
/*!
 * user.service.js - user database service
 * Copyright (c) 2023-2024, Shaswat Gupta (MIT License).
 * https://github.com/masterchief164/smart-attendance
 */

/**
 * User Service
 * Add a new user
 * @param userDetails
 * @returns {Promise}
 */
const addUser = (userDetails) => {
    return User.create(userDetails);
}

/**
 * User Service
 * Get all users
 * @returns {Promise}
 */
const getAllUsers = () => {
    return User.find();
}

/**
 * User Service
 * @param  {ObjectId|String} id - user id
 * @returns {Promise}
 */
const getUserById = (id) => {
    return User.findById(id).lean();
}

/**
 * User Service
 * Find a user by email
 * @param {String} email
 * @returns {Promise}
 */
const findUserByEmail = (email) => {
    return User.findOne({email});
}

/**
 * User Service
 * Find users with given email ids
 * @param {Array<String>} email - array of email ids
 * @returns {Promise} - Promise of users
 */
const findUsers = (email) => {
    return User.find({"email": {$in: [...email]}});
}

/**
 * User Service
 * Update a user's role
 * @param {ObjectId|String} id
 * @param {String} role
 * @returns {Promise}
 */
const updateUserRole = (id, role) => {
    return User.findByIdAndUpdate(id, {$set: {userType: role}}, {new: true, runValidators: true}).lean();
}

const updateUser = (id, user) => {
    return User.findByIdAndUpdate(id, {
        $set: {
            name: user.name,
            phoneNumber: user.phoneNumber,
            department: user.department,
            batch: user.batch,
            roomNumber: user.roomNumber
        }
    }, {
        new: true, runValidators: true
    }).lean();
}

/**
 * User Service
 * Add a course to a user
 * @param {ObjectId|String} courseId - course id
 * @param {ObjectId|String} studentId - student id
 * @returns {Promise} - Promise of updated user
 */
const addCourseToStudent = (courseId, studentId) => {
    return User.findByIdAndUpdate(studentId, {
        $addToSet: {
            courses: courseId
        }
    });
}
module.exports = {
    addUser,
    findUserByEmail,
    getAllUsers,
    getUserById,
    updateUserRole,
    findUsers,
    updateUser,
    addCourseToStudent
};
