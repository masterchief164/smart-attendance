const {addSession, addAttendance} = require('../services/session.service')
const crypto = require('crypto');

const createSession = async (req, res) => {
    try {
        const user = req.user;
        const document = await addSession(user, user); // TODO replace second user with course
        const session = document.toObject();
        session.nonce = crypto.randomInt(10000000, 99999999);
        const headers = {
            "Content-Type": "text/event-stream",
            "Connection": "keep-alive",
            "Cache-Control": "no-cache",
        };
        res.writeHead(200, headers);
        session.nonce = crypto.randomInt(10000000, 99999999);
        const data = `data: ${JSON.stringify({id: session._id, nonce: session.nonce})}\n\n`;
        res.write(data);
        let interval = setInterval(() => {
            session.nonce = crypto.randomInt(10000000, 99999999);
            const data = `data: ${JSON.stringify({id: session._id, nonce: session.nonce})}\n\n`;
            res.write(data);
            console.log("wrote")
            // counter++;
        }, 5000);

        req.on('close', () => {
            console.log("closed")
            clearInterval(interval);
        });
        // res.status(200).send(session);
        // console.log(session);
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
        const nonce = req.body.nonce;
        const attend = await addAttendance(req.user, sessionId);
        console.log(attend);
        res.status(200).send(attend);
    } catch (error) {
        console.log(error)
    }
}

module.exports = {createSession, attendSession}
