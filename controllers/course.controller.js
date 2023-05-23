const courseService = require('../services/course.service');
const userService = require('../services/user.service');

/**
 * Course Controller
 * Get all courses
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const getCourses = async (req, res) => {
    try {
        const courses = await courseService.getCourses(req.user._id);
        res.status(200).send(courses);
    } catch (error) {
        console.log(error)
        res.status(500).send(error.message);
    }
}

/**
 * Course Controller
 * Get a course by course id
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const getCourse = async (req, res) => {
    try {
        const courseId = req.params.id;
        if (!courseId) {
            res.status(400).send({error: "Course id not provided"});
            return;
        }
        const course = await courseService.getCourse(courseId);
        res.status(200).send(course);
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
}

/**
 * Course Controller
 * Create a course
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const createCourse = async (req, res) => {
    try {
        if (req.body.course === undefined) {
            res.status(400).send({error: "No course data provided"});
            return;
        }
        const courseName = req.body.course.name;
        const instructor = req.body.course.instructor;
        if (!(courseName && instructor)) {
            res.status(400).send({error: "Malformed request"});
            return;
        }
        let course = {
            name: req.body.course.name,
            instructor: req.user._id
        };
        course = await courseService.createCourse(course);
        res.status(200).send(course);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

/**
 * Course Controller
 * Update a course
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const updateCourse = async (req, res) => {
    try {
        const courseId = req.params.id;
        if (!courseId) {
            res.status(400).send({error: "Course id not provided"});
            return;
        }
        let course = await courseService.getCourse(courseId);
        if (!course) {
            res.status(404).send({error: "Course not found"});
            return;
        }
        if (req.body.course === undefined) {
            res.status(400).send({error: "No course data provided"});
            return;
        }
        if (req.body.course.students) {
            res.status(400).send({error: "Cannot update students"});
            return;
        }
        const courseName = req.body.course.name;
        const instructor = req.body.course.instructor;
        if (!(courseName || instructor)) {
            res.status(400).send({error: "Malformed request"});
            return;
        }
        const courseData = {};
        if (courseName) {
            courseData.name = courseName;
        }
        if (instructor) {
            courseData.instructor = instructor;
        }
        course = await courseService.updateCourse(courseId, courseData);
        res.status(200).send(course);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

/**
 * Course Controller
 * Delete a course
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const deleteCourse = async (req, res) => {
    try {
        if (!req.params.id) {
            res.status(400).send({error: "Course id not provided"});
            return;
        }
        const courseId = req.params.id;
        let course = await courseService.getCourse(courseId);
        if (!course) {
            res.status(404).send({error: "Course not found"});
            return;
        }
        course = await courseService.deleteCourse(courseId);
        res.status(200).send(course);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

/**
 * Course Controller
 * Add a student to a course
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const addStudent = async (req, res) => {
    try {
        if (!req.params.id) {
            res.status(400).send({error: "Course id not provided"});
            return;
        }
        const courseId = req.params.id;
        if (!req.body.student) {
            res.status(400).send({error: "No student data provided"});
            return;
        }
        const studentEmail = req.body.student;
        let student = await userService.findUserByEmail(studentEmail);
        if (!student) {
            res.status(404).send({error: "Student not found"});
            return;
        }
        const course = await courseService.addStudentToCourse(courseId, student._id);
        await userService.addCourseToStudent(student._id, course._id);
        res.status(200).send({
            course,
            message: "Student added successfully",
        })
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

/**
 * Course Controller
 * Add students to a course
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const addStudents = async (req, res) => {
    try {
        if (!req.params.id) {
            res.status(400).send({error: "Course id not provided"});
            return;
        }
        if (!req.body.student) {
            res.status(400).send({error: "No student data provided"});
            return;
        }
        const courseId = req.params.id;
        const students = req.body.student;
        const studentsObject = await userService.findUsers(students);
        if (!studentsObject || studentsObject.length === 0) {
            res.status(404).send({error: "No student not found"});
            return;
        }
        const course = await courseService.addStudentsToCourse(courseId, studentsObject);
        for (let i = 0; i < studentsObject.length; i++) {
            await userService.addCourseToStudent(studentsObject[i]._id, course._id);
        }
        res.status(200).send({
            course,
            message: "Students added successfully",
        });
    } catch (error) {
        console.log(error);
        res.send(error);
    }
}

/**
 * Course Controller
 * Get student stats for a course
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const getStudentStats = async (req, res) => {
    try {
        if(!req.params.id) {
            res.status(400).send({error: "Course id not provided"});
            return;
        }
        const courseId = req.params.id;
        if(!req.params.userId) {
            res.status(400).send({error: "Student id not provided"});
            return;
        }
        const userId = req.params.userId;
        const student = await userService.findUserByEmail(userId);
        if (student === null) {
            res.status(404).send({error: "Student not found"});
            return;
        }
        const studentStats = await courseService.getStudentStats(courseId, student);
        res.status(200).send(studentStats);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

module.exports = {
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse,
    addStudent,
    getStudentStats,
    addStudents
};
