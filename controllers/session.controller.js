const sessionService = require('../services/session.service')
const crypto = require('crypto');
const client = require('../bin/redis.util');
const kafka = require('../bin/kafka.util');
const rabbitMq = require('../bin/rabbitmq.util');
const {randomUUID} = require('crypto');

// TODO : change the path in frontend of the login routers
const createSession = async (req, res) => {
    try {
        const user = req.user;
        const courseId = req.query.courseId;
        const document = await sessionService.addSession(user, courseId); // TODO replace second user with course
        if (!document) {
            return res.status(404).send({error: "Course not found"});
        }
        const session = document.toObject();
        await kafka.createTopic(document._id.toString());
        const kafkaConsumer = await kafka.getConsumer(document._id.toString());
        await kafkaConsumer.run({
            "eachMessage": async (result) => {
                console.log("Kafka consumer", result.message.value.toString());
                const message = JSON.parse(result.message.value.toString());
                const data = {
                    message,
                    attendance: true,
                }
                res.write(`data: ${JSON.stringify(data)}\n\n`);
            }
        })
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
            kafkaConsumer.disconnect();
        });
        req.on('error', (e) => {
            console.log("error", e)
            clearInterval(interval);
            kafkaConsumer.disconnect();
        });
        res.status(200).send(session);
        console.log(session);
    } catch (error) {
        console.log(error);
        res.status(500)
            .send({error});
    }
}

const getSessions = async (req, res) => {
    try {
        const courseID = req.params.courseId;
        const sessions = await sessionService.getSessions(courseID, req.user._id.toString());
        res.status(200).send(sessions);
    } catch (error) {
        console.log(error);
        res.status(500)
            .send({error});
    }
}

const getSession = async (req, res) => {
    try {
        const sessionId = req.params.sessionId;
        const session = await sessionService.getSession(sessionId);
        res.status(200).send(session);
    } catch (error) {
        console.log(error);
        res.status(500)
            .send({error});
    }
}

const attendSession = async (req, res) => {
    try {
        // console.log(req.body);
        const sessionId = req.body.session_id;
        const nonce = req.body.nonce.toString();
        const redisNonce = await client.get(sessionId);
        if (redisNonce !== nonce) {
            res.status(400).send({error: "Invalid nonce"});
        } else {
            const attend = await sessionService.addAttendance(req.user, sessionId);
            await kafka.sendMessage(sessionId.toString(), JSON.stringify(req.user));
            res.status(200).send(attend);
        }
    } catch (error) {
        console.log(error)
    }
}

const deleteSession = async (req, res) => {
    try {
        const sessionId = req.params.sessionId;
        const session = await sessionService.deleteSession(sessionId);
        res.status(200).send(session);
    } catch (error) {
        console.log(error);
        res.status(500)
            .send({error});
    }
}

const addFace = async (req, res) => {
    try {
        const userId = req.user._id;
        const message = {
            type: "addFace",
            File1: req.files[0].buffer,
            File2: req.files[1].buffer,
            File3: req.files[2].buffer,
            userId
        }
        await rabbitMq.sendMessage(message, "jobs")
        res.status(200).send({
            message: "Processing"
        })
    } catch (error) {
        console.log(error);
        res.status(500)
            .send({error});
    }
}

const checkFace = async (req, res) => {
    try {
        const uuid = randomUUID();
        console.log(uuid);
        const userId = req.user._id;
        const message = {
            uuid,
            type: "checkFace",
            File1: req.files[0].buffer,
            userId
        }
        await rabbitMq.sendMessage(message, "jobs")
        await rabbitMq.consumeMessage(uuid, (message) => {
            console.log(message);
            res.status(200).send({
                message
            });
        });


    } catch (err) {
        console.log(err)
    }

}

module.exports = {createSession, attendSession, getSessions, getSession, deleteSession, addFace, checkFace}
