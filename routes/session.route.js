const express = require('express');
const controller = require('../controllers/session.controller');
const {verify, restrictTo} = require('../middleware/auth');

const router = express.Router();

router.get('/createSession', verify, restrictTo("instructor"), controller.createSession);
router.get('/all/:courseId', verify, controller.getSessions);
router.get('/:sessionId', verify, controller.getSession);
router.delete('/:sessionId', verify, controller.deleteSession);
router.post('/attend', verify, controller.attendSession);

module.exports = router;
