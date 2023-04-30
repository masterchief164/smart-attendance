const express = require('express');
const controller = require('../controllers/user.controller');
const {verify, restrictTo} = require("../middleware/auth");

const router = express.Router();

router.patch("/", verify, controller.updateUser);

module.exports = router;
