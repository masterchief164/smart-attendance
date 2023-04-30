const userService = require("../services/user.service")
const updateUser = async (req, res) => {

    const user = req.user;
    const newUserData = req.body.user;

    const newUser = await userService.updateUser({
        name: newUserData.name ? newUserData.name : user.name,
        phoneNumber: newUserData.phoneNumber ? newUserData.phoneNumber : user.phoneNumber,
        department: newUserData.department ? newUserData.department : user.department,
        batch: newUserData.batch ? newUserData.batch : user.batch,
        roomNumber: newUserData.roomNumber ? newUserData.roomNumber : user.roomNumber
    })

    return res.status(200).send(newUser);
}

module.exports = {updateUser}
