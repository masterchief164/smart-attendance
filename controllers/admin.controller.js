const jwt = require('jsonwebtoken')
const userServices = require('../services/user.service')

/**
 * Admin Controller
 * Login as admin
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const adminLogin = async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        if (!username || !password) {
            res.status(400).send({error: "Username or password not provided"});
            return;
        }
        if (username !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD) {
            res.status(401).send({error: "Invalid username or password"});
            return;
        }
        const user = {
            userType: 'admin',
            name: username,
        }
        const expiry = new Date(Date.now() + 1800000);
        const token = jwt.sign(user, process.env.CLIENT_SECRET, {expiresIn: '1800s'});
        user.exp = expiry;

        const cookie = {
            expires: expiry,
            httpOnly: true,
            sameSite: 'none',
            secure: true,
        };
        res.status(202)
            .cookie('token', token, cookie)
            .send({...user});
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
}


/**
 * Admin Controller
 * Get all users
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const getAllUsers = async (req, res) => {
    try {
        const users = await userServices.getAllUsers();
        res.status(200).send(users);
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
}

/**
 * Admin Controller
 * Get a user by id
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const getUserById = async (req, res) => {
    try {
        const user = await userServices.getUserById(req.params.userId);
        if (!user) {
            res.status(404).send({error: "User not found"});
            return;
        }
        res.status(200).send(user);
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
}

/**
 * Admin Controller
 * Update a user's role
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const updateUserRole = async (req, res) => {
    try {
        const userId = req.params.userId;
        if(!userId) {
            res.status(400).send({error: "User id not provided"});
            return;
        }
        const user = await userServices.getUserById(req.params.userId);
        if (!user) {
            res.status(404).send({error: "User not found"});
            return;
        }
        if (!req.body.role) {
            res.status(400).send({error: "Role not provided"});
            return;
        }
        if (req.body.role !== 'student' && req.body.role !== 'instructor') {
            res.status(400).send({error: "Invalid role"});
            return;
        }
        user.role = req.body.role;
        const updatedUser = await userServices.updateUserRole(req.params.userId, req.body.role);
        res.status(200).send(updatedUser);
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
}

module.exports = {
    adminLogin,
    getAllUsers,
    getUserById,
    updateUserRole,
}
