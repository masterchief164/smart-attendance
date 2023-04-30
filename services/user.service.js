const User = require('../models/user.model');

const addUser = async (userDetails) => {
    try {
        const user = await User.create(userDetails);
        console.log(user);
    } catch (error) {
        console.log(error);
    }
}

const getAllUsers = async () => {
    try {
        return await User.find();
    } catch (error) {
        console.log(error);
    }
}

const getUserById = async (id) => {
    try {
        return await User.findById(id).lean();
    } catch (error) {
        console.log(error);
    }
}

const findUser = async (email) => {
    try {
        return await User.findOne({email});
    } catch (error) {
        console.log(error);
    }
}
const findUsers = async (email) => {
    try {
        return await User.find({"email": {$in: [...email]}}, {"_id": 1});
    } catch (error) {
        console.log(error);
    }
}

const updateUserRole = async (id, role) => {
    try {
        return await User.findByIdAndUpdate(id, {$set: {userType: role}}, {new: true, runValidators: true}).lean();
    } catch (error) {
        console.log(error);
    }
}

const updateUser = async (user) => {
    try {
        return await User.findByIdAndUpdate(id, {
            $set: {
                name: user.name,
                phoneNumber: user.phoneNumber,
                department: user.department,
                batch: user.batch,
                roomNumber: user.roomNumber
            }
        }, {
            new: true,
            runValidators: true
        }).lean();
    } catch (error) {
        console.log(error);
    }
}
module.exports = {addUser, findUser, getAllUsers, getUserById, updateUserRole, findUsers, updateUser};
