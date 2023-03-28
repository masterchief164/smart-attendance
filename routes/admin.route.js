const express = require('express');
const controller = require('../controllers/admin.controller');
const authController = require('../controllers/auth.controller');
const {verify, restrictTo} = require("../middleware/auth");

const router = express.Router();

router.post('/login', controller.adminLogin);
router.get('/allUsers', verify, restrictTo('admin'),controller.getAllUsers);
router.get('/user/:userId', verify, restrictTo('admin'), controller.getUserById);
router.patch('/user/:userId', verify, restrictTo('admin'), controller.updateUserRole);
router.get('logout', authController.logout);

module.exports = router;
