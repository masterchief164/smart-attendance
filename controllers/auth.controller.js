const {createTokenProfile, decodeToken, getGoogleOAuthTokens} = require("../services/auth.service");
const jwt = require('jsonwebtoken');
const {addUser, findUserByEmail} = require('../services/user.service')

/**
 * Auth Controller
 * Login with Google OAuth2.0
 * @param req
 * @param res
 * @returns {Promise<void>}
 */

const googleLogin = async (req, res) => {

    try {
        const {tokenId: code} = req.body;
        const userType = req.body.userType ? req.body.userType : "student";
        const referrer = req.headers.referer? req.headers.referer: "http://localhost:3000/";
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
        user.roll = user.email.split('@')[0]; // generalize for different orgs
        user.registeredAt = user.iat;
        user.userType = userType;
        let oldUser = await findUserByEmail(user.email);
        if (!oldUser) {
            oldUser = await addUser(user);
        }
        const expiry = new Date(Date.now() + 14400000);
        const token = createTokenProfile(oldUser);
        const userData = decodeToken(token);
        userData.exp = expiry;

        const cookie =  {
            expires: expiry,
            httpOnly: true,
            sameSite: 'none',
            secure: true,
        }
        res.status(202)
            .cookie('token', token, cookie)
            .send({...userData});

    } catch (error) {
        console.log(error);
        res.status(500)
            .send({error});
    }

};

/**
 * Auth Controller
 * Logout the user by clearing the cookies
 * @param req
 * @param res
 */

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
