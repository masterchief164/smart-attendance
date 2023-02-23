const Course = require('../models/course.model');
const mongoose = require("mongoose");

const createCourse = async (course) => {
    try {
        return await Course.create(course);
    } catch (error) {
        console.log(error);
    }
}

const getCourses = async (id) => {
    try {
        return await Course.find({'$or': [{instructor: id}, {students: id}]}).populate('students').populate('instructor');
    } catch (error) {
        console.log(error);
    }
}

const getCourse = async (id) => {
    try {
        return await Course.findById(id).populate('students').populate('teachers');
    } catch (error) {
        console.log(error);
    }
}

const updateCourse = async (id, course) => {
    try {
        return await Course.findByIdAndUpdate(id, course);
    } catch (error) {
        console.log(error);
    }
}

const deleteCourse = async (id) => {
    try {
        return await Course.findByIdAndDelete(id);
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    createCourse, getCourses, getCourse, updateCourse, deleteCourse
};
