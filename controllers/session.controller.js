const {addSession, addAttendance} = require('../services/session.service')
const crypto = require('crypto');
const client = require('../bin/redis.util');
// TODO : change the path in frontend of the login routers
const createSession = async (req, res) => {
    try {
        const user = req.user;
        const courseId = req.query.courseId;
        const document = await addSession(user, user); // TODO replace second user with course
        const session = document.toObject();
        session.nonce = crypto.randomInt(10000000, 99999999);
        const headers = {
            'Content-Type': 'text/event-stream',
            'Connection': 'keep-alive',
            'Cache-Control': 'no-cache',
        };
        res.writeHead(200, headers);
        console.log("wrote")
        session.nonce = crypto.randomInt(10000000, 99999999);
        const data = `data: ${JSON.stringify({id: session._id, nonce: session.nonce})}\n\n`;
        res.write(data);
        let interval = setInterval(async () => {
            session.nonce = crypto.randomInt(10000000, 99999999);
            await client.set(session._id.toString(), session.nonce)
            const data = `data: ${JSON.stringify({id: session._id, nonce: session.nonce})}\n\n`;
            res.write(data);
            console.log("wrote")
        }, 5000);

        req.on('close', () => {
            console.log("closed")
            clearInterval(interval);
        });
        req.on('error', (e) => {
            console.log("error", e)
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
        const nonce = req.body.nonce.toString();
        const redisNonce = await client.get(sessionId);
        if (redisNonce !== nonce) {
            res.status(400).send({error: "Invalid nonce"});
        } else {
            const attend = await addAttendance(req.user, sessionId);
            console.log(attend);
            res.status(200).send(attend);
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports = {createSession, attendSession}
