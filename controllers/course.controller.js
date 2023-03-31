const courseService = require('../services/course.service');
const userService = require('../services/user.service');

const getCourses = async (req, res) => {
    try {
        let courses;
        courses = await courseService.getCourses(req.user._id);
        res.status(200).send(courses);
    } catch (error) {
        res.status(500).send(error);
    }
}

const getCourse = async (req, res) => {
    try {
        console.log("here")
        const course = await courseService.getCourse(req.params.id);
        res.status(200).send(course);
    } catch (error) {
        res.status(500).send(error);
    }
}

const createCourse = async (req, res) => {
    try {
        if (req.body.course === undefined) {
            res.status(400).send({error: "No course data provided"});
            return;
        }
        let course = {
            name: req.body.course.name,
            instructor: req.user._id
        }
        console.log(course);
        course = await courseService.createCourse(course);
        res.status(200).send(course);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

const updateCourse = async (req, res) => {
    try {
        const course = await courseService.updateCourse(req.params.id, req.body);
        res.status(200).send(course);
    } catch (error) {
        res.status(500).send(error);
    }
}

const deleteCourse = async (req, res) => {
    try {
        const course = await courseService.deleteCourse(req.params.id);
        res.status(200).send(course);
    } catch (error) {
        res.status(500).send(error);
    }
}

const addStudent = async (req, res) => {
    try {
        const student = req.body.student;
        const studentObject = await userService.findUser(student);
        if (studentObject === null) {
            res.status(404).send({error: "Student not found"});
            return;
        }
        const course = await courseService.addStudent(req.params.id, studentObject._id);
        res.status(200).send({
            course,
            message: "Student added successfully",
        })
    } catch (err) {
        console.log(err);
        res.send(err);
    }
}
const addStudents = async (req, res) => {
    try {
        const student = req.body.student;
        const studentObject = await userService.findUsers(student);
        // console.log(studentObject);
        if (studentObject === null) {
            res.status(404).send({error: "Student not found"});
            return;
        }
        const course = await courseService.addStudents(req.params.id, studentObject);
        res.status(200).send({
            course,
            message: "Student added successfully",
        })
    } catch (err) {
        console.log(err);
        res.send(err);
    }
}

const getStudentStats = async (req, res) => {
    try {
        const student = await userService.findUser(req.params.userId);
        if (student === null) {
            res.status(404).send({error: "Student not found"});
            return;
        }
        const studentStats = await courseService.getStudentStats(req.params.id, student);
        res.status(200).send(studentStats);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

module.exports = {getCourses, getCourse, createCourse, updateCourse, deleteCourse, addStudent, getStudentStats,addStudents};
