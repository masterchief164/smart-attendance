const {createTokenProfile, decodeToken, getGoogleOAuthTokens} = require("../services/login.service");
const jwt = require('jsonwebtoken');
const addUser = require('../services/adduser.service')

const User = require("../models/user.model");

const googleLogin = async (req, res) => {

    try {
        const code = req.body.tokenId;
        const resp = await getGoogleOAuthTokens(code);

        const {id_token} = resp.data;
        const user = jwt.decode(id_token, {complete: false});

        user.access_token = resp.data.access_token;
        user.roll = user.email.split('@')[0];
        user.registeredAt = user.iat;
        let oldUser = await User.findOne({email: user.email})
        console.log(oldUser);
        if (!oldUser) {
            oldUser = await addUser(user);
        }

        const token = await createTokenProfile(oldUser);
        const userData = decodeToken(token);
        userData.exp = new Date(Date.now() + 1800000);

        // console.log(process.env.NODE_ENV === 'production');

        res.status(202)
            .cookie('token', token, {
                expires: new Date(Date.now() + 1800000),
                httpOnly: true,
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                secure: process.env.NODE_ENV === 'production',
            })
            .send({...userData});

    } catch (error) {
        console.log(error);
        res.status(500)
            .send({error});
    }

};


module.exports = {googleLogin};
