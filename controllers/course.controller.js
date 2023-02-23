const courseService = require('../services/course.service');

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

module.exports = {getCourses, getCourse, createCourse, updateCourse, deleteCourse};
