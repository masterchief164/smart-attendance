const jwt = require('jsonwebtoken');

const verify = (req, res, next) => {
    const token = req.cookies.token;
    // console.log(req.cookies);
    if (token == null) {
        return res.status(401)
            .send('Unauthorized');
    }
    jwt.verify(token, process.env.CLIENT_SECRET, {}, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
};

module.exports = verify;
