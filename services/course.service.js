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
        return await Course.findById(id).populate('students').populate('instructor');
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

const addStudent = async (course_id, student) => {
    try {
        const course = getCourse(course_id);
        const allStudents = new Set(course.students);
        allStudents.add(student);
        course.students = Array.from(allStudents);
        return await course.save();
    } catch (e) {
        console.log(e);
    }

}

module.exports = {
    createCourse, getCourses, getCourse, updateCourse, deleteCourse, addStudent
};
