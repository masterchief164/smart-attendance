
const User =require('../models/user.model');
const addUser= async(userdetails)=>{
    try {
        const user=await User.create(userdetails);
        console.log(user);
    } catch (error) {
        console.log(error);
    }
   

}
module.exports=addUser