const axios = require('axios');
const qs = require('querystring');
const jwt = require('jsonwebtoken');

/**
 * Exchange Auth code for Google OAuth access and refresh tokens
 * @param code
 * @param referrer
 * @returns {Promise<AxiosResponse<any>>}
 */
const getGoogleOAuthTokens = async (code, referrer) => {
    const url = 'https://oauth2.googleapis.com/token';

    const options = {
        code,
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        redirect_uri: `${referrer}google`,
        grant_type: 'authorization_code',
    };

    return await axios.post(url, qs.stringify(options), {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    }).catch((err) => {
        if (err.response.status === 400) {
            console.log(err.response.message);
            return {status: 400};
        } else {
            console.log(err.response.data);
            return {status: 500};
        }
    });
};

/**
 * Create a JSON Web Token using the profile data
 * @param {Object} user profile data
 * @returns {String} - JSON Web Token
 */
const createTokenProfile = (user) => {
    const newUser = {
        name: user.name,
        email: user.email,
        picture: user.picture,
        sub: user.sub,
        roll: user.roll,
        registeredAt: user.registeredAt,
        locale: user.locale,
        given_name: user.given_name,
        family_name: user.family_name,
        _id: user._id,
        phoneNumber: user.phoneNumber,
        userType: user.userType,
        faceData: user.faceData,
    };
    return jwt.sign(newUser, process.env.CLIENT_SECRET, {expiresIn: '1800s'});
};

/**
 * Decode a JSON Web Token
 * @param token - JSON Web Token
 * @returns {Object} - decoded token
 */
const decodeToken = (token) => jwt.decode(token, {complete: false});

module.exports = {getGoogleOAuthTokens, createTokenProfile, decodeToken};
