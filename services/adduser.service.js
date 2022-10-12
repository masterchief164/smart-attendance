const User = require('../models/user.model');

const addUser = async (userDetails) => {
    try {
        const user = await User.create(userDetails);
        console.log(user);
    } catch (error) {
        console.log(error);
    }


}
module.exports = addUser
