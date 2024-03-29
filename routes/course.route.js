const express = require('express');
const controller = require('../controllers/course.controller');
const {verify} = require("../middleware/auth");

const router = express.Router();

router.get('/', verify, controller.getCourses);
router.post('/', verify, controller.createCourse);
router.get('/:id', verify, controller.getCourse);
router.put('/:id', verify, controller.updateCourse);
router.delete('/:id', verify, controller.deleteCourse);
// router.patch('/:id', verify, controller.addStudent);
router.patch('/:id', verify, controller.addStudents);
router.get('/:id/:userId', verify, controller.getStudentStats);


module.exports = router;
