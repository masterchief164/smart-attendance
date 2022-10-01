const {createTokenProfile, decodeToken, getGoogleOAuthTokens} = require("../services/login.service");
const jwt = require('jsonwebtoken');

const googleLogin = async (req, res) => {
    try {
        const code = req.body.tokenId;
        console.log(code);
        const resp = await getGoogleOAuthTokens(code);
        console.log(resp.data);
        const {id_token} = resp.data;
        const user = jwt.decode(id_token, {complete: false});

        user.access_token = resp.data.access_token;
        user.roll = user.email.split('@')[0];
        user.registeredAt = user.iat;

        // const person = await addUser(user);
        // const token = person.hallNumber ? await createTokenProfile(person) : await createToken(person);
        const token = await createTokenProfile(user);
        const userData = decodeToken(token);
        userData.exp = new Date(Date.now() + 1800000);
        console.log(userData);
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
