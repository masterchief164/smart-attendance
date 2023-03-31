const Course = require('../models/course.model');
const User = require('../models/user.model');

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
        return await Course.findByIdAndUpdate(id, course); // TODO: Validate this
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
        const course = await getCourse(course_id);
        const allStudents = new Set(course.students);
        allStudents.add(student);
        course.students = Array.from(allStudents);
        console.log(course);
        return await course.save();
    } catch (e) {
        console.log(e);
    }
}
const addStudents = async (course_id, students) => {
    try {
        const course = await getCourse(course_id);
        const allStudents = new Set(course.students);
        students.forEach((s)=>{
            // console.log(s);
            allStudents.add(s._id);
        })
        course.students = Array.from(allStudents);
        // console.log(course);
        return await course.save();
    } catch (e) {
        console.log(e);
    }
}

const getStudentStats = async (course_id, student) => {
    const course = await Course.findById(course_id).populate('sessions');
    console.log(course);
    let attendanceCount = 0;
    course.sessions.forEach(session => {
        if (session.attendees.includes(student._id)) {
            attendanceCount++;
        }
    });

    return {
        attendanceCount,
        sessions: course.sessions,
        sessionsCount: course.sessions.length,
        student
    }

}

module.exports = {
    createCourse, getCourses, getCourse, updateCourse, deleteCourse, addStudent, getStudentStats,addStudents
};
