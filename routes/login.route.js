const express = require('express');
const controller = require('../controllers/login.controller');
const verify = require('../middleware/auth');

const router = express.Router();

router.post('/googleLogin', controller.googleLogin);


module.exports = router;
