const sessionService = require('../services/session.service')
const crypto = require('crypto');
const client = require('../bin/redis.util');
const kafka = require('../bin/kafka.util');
const rabbitMq = require('../bin/rabbitmq.util');
const {randomUUID} = require('crypto');
const {addTempSession} = require("../services/session.service");

// TODO : change the path in frontend of the login routers
const createSession = async (req, res) => {
    try {
        const user = req.user;
        const courseId = req.query.courseId;
        const document = await sessionService.addSession(user, courseId);
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
            // const attend = await sessionService.addAttendance(req.user, sessionId);
            // await kafka.sendMessage(sessionId.toString(), JSON.stringify(req.user));
            // res.status(200).send(attend);
            const temp = await addTempSession(req.user, sessionId);
            res.status(200).send(temp);
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
        const userId = req.user._id;
        const sessionId = req.body.sessionId;
        const tempId = req.body.tempId;
        const tempAttendance = await sessionService.getTempSession(tempId);
        if (!tempAttendance && tempAttendance.time.toInt() - Date.now() > 300000) {
            return res.send(400).send({
                message: "Temp session expired"
            });
        }
        const message = {
            uuid,
            type: "checkFace",
            File1: req.files[0].buffer,
            userId
        }
        await rabbitMq.sendMessage(message, "jobs")
        await rabbitMq.consumeMessage(uuid, async (message) => {
            console.log(message);
            if (message) {
                const attend = await sessionService.addAttendance(req.user, sessionId);
                await sessionService.deleteTempSession(tempId);
                await kafka.sendMessage(sessionId.toString(), JSON.stringify(req.user));
                res.status(200).send(attend);
            }
            res.status(200).send({
                message
            });
        });


    } catch (err) {
        console.log(err)
    }

}
const getAttendees=async(req,res)=>{
    try {
        const sessionId = req.params.sessionId;
        const session = await sessionService.getSessionById(sessionId);
        // console.log(session.attendees);
        const students= await sessionService.getAttendees(session.attendees)
        res.status(200).send(students);
    } catch (error) {
        console.log(error);
        res.status(500)
            .send({error});
    }
}
const getSessionsByCourse=async(req,res)=>{
    try {
        const courseId = req.params.courseId;
        const sessions = await sessionService.getSessionsByCourse(courseId);
        res.status(200).send(sessions);
    } catch (error) {
        console.log(error);
        res.status(500)
            .send({error});
    }
}
module.exports = {createSession, attendSession, getSessions, getSession, deleteSession, addFace, checkFace,getAttendees,getSessionsByCourse}