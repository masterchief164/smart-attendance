const express = require('express');
const controller = require('../controllers/session.controller');
const {verify, restrictTo} = require('../middleware/auth');
const multer = require('multer');
const {tmpdir} = require("os");
const upload = multer({dest: tmpdir(), storage: multer.memoryStorage()});


const router = express.Router();

router.get('/createSession', verify, restrictTo("instructor"), controller.createSession);
router.get('/all/:courseId', verify, controller.getSessions);
router.get('/:sessionId', verify, controller.getSession);
router.delete('/:sessionId', verify, controller.deleteSession);
router.post('/attend', verify, controller.attendSession);
router.post('/addFace', verify, upload.any(), controller.addFace)
router.post('/checkFace', verify, upload.any(), controller.checkFace)

module.exports = router;
