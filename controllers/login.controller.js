const {createTokenProfile, decodeToken, getGoogleOAuthTokens} = require("../services/login.service");
const jwt = require('jsonwebtoken');
const {addUser, findUser} = require('../services/user.service')


const googleLogin = async (req, res) => {

    try {
        const code = req.body.tokenId;
        const userType = req.body.userType ? req.body.userType : "student";
        const referrer = req.headers.referer;
        const resp = await getGoogleOAuthTokens(code, referrer);
        if (resp.status === 400) {
            res.status(400).send({error: 'Invalid auth code'});
            return;
        }
        if (resp.status === 500) {
            res.status(500).send({error: 'Internal server error'});
            return;
        }
        const {id_token} = resp.data;
        const user = jwt.decode(id_token, {complete: false});

        user.access_token = resp.data.access_token;
        user.roll = user.email.split('@')[0];
        user.registeredAt = user.iat;
        user.userType = userType;
        let oldUser = await findUser(user.email);
        // console.log(oldUser);
        if (!oldUser) {
            oldUser = await addUser(user);
        }

        const token = await createTokenProfile(oldUser);
        const userData = decodeToken(token);
        userData.exp = new Date(Date.now() + 1800000);

        const cookie =  {
            expires: new Date(Date.now() + 1800000),
            httpOnly: true,
            sameSite: 'none',
            secure: true,
        }
        console.log(cookie);
        res.status(202)
            .cookie('token', token, cookie)
            .send({...userData});

    } catch (error) {
        console.log(error);
        res.status(500)
            .send({error});
    }

};

const logout = (req, res) => {

    try {
        res.clearCookie('token').status(200).json({success: true});
    } catch (error) {
        console.log(error);
        res.status(500)
            .send({error});
    }
}
module.exports = {googleLogin, logout};
