const {addSession, addAttendance} = require('../services/session.service')

const createSession = async (req, res) => {
    try {
        const user = req.user;
        const session = await addSession(user, user); // TODO replace second user with course
        // TODO generate a nonce here
        // console.log(session);
        res.status(200).send(session);
    } catch (error) {
        console.log(error);
        res.status(500)
            .send({error});
    }
}

const attendSession = async (req, res) => {
    try {
        console.log(req.body);
        const sessionId = req.body.session_id;

        const attend = await addAttendance(req.user, sessionId);
        console.log(attend);
        res.status(200).send(attend);
    } catch (error) {
        console.log(error)
    }
}

module.exports = {createSession, attendSession}
