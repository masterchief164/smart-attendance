
const logout=(req,res)=>{
    
    
    try {
        res.clearCookie('token').status(200).json({success:true});
    } catch (error) {
        console.log(error);
        res.status(500)
            .send({error});
    }
}
module.exports = {logout};