const Course = require('../models/course.model');


/**
 * Course Service
 * Create a course with given course data
 * @param {Object} course - course data
 * @returns {Promise} - Promise of created course
 */
const createCourse = (course) => {
    try {
        return Course.create(course);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Course Service
 * Get all courses of a user
 * @param {ObjectId|String} id - user id
 * @returns {Promise} - Promise of all courses
 */

const getCourses = (id) => {
    return Course.find({'$or': [{instructor: id}, {students: id}]}).populate('students').populate('instructor');
}

/**
 *
 * @param {ObjectId|String} id - course id
 * @returns {Promise} - Promise of course
 */
const getCourse = (id) => {
    return Course.findById(id).populate('students').populate('instructor');
}

/**
 * Course Service
 * Update course details
 * @param {ObjectId|String} courseId - course id
 * @param {Object} courseData - updated course data
 * @returns {Promise} - Promise of updated course
 */
const updateCourse = (courseId, courseData) => {
    return Course.findByIdAndUpdate(courseId, courseData);
}

/**
 * Course Service
 * Delete a course
 * @param {ObjectId|String} courseId - course id
 * @returns {Promise} - Promise of deleted course
 */
const deleteCourse = (courseId) => {
    return Course.findByIdAndDelete(courseId);
}

/**
 * Course Service
 * Add a student to a course
 * @param {ObjectId|String} courseId - course id
 * @param {ObjectId|String} student - student id
 * @returns {Promise<*>} - Promise of updated course
 */
const addStudentToCourse = (courseId, student) => {
    return Course.findByIdAndUpdate(
        courseId,
        {$addToSet: {students: student}},
        {new: true}
    );
}

/**
 * Course Service
 * Add a students to a course
 * @param {ObjectId|String} courseId - course id
 * @param {Array<ObjectId|String>} students - Array of student ids
 * @returns {Promise<*>} - Promise of updated course
 */
const addStudentsToCourse = (courseId, students) => {
    return Course.findByIdAndUpdate(courseId, {$addToSet: {students: {$each: students}}}, {new: true});
}

/**
 * Course Service
 * Get attendance stats of a student in a course
 * @param {ObjectId|String} course_id - course id
 * @param {Object} student - student object
 * @returns {Promise<{sessions: *, attendanceCount: Number, student, sessionsCount: Number}>}
 */
const getStudentStats = async (course_id, student) => { // TODO: needs work
    const course = await Course.findById(course_id).populate('sessions');
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
    createCourse,
    getCourses,
    getCourse,
    updateCourse,
    deleteCourse,
    addStudentToCourse,
    getStudentStats,
    addStudentsToCourse
};
