const {Kafka} = require('kafkajs');


const host = process.env.KAFKA_HOST || 'localhost';
let admin = null;
let producer = null;
const kafka = new Kafka({
    "clientId": 'sma',
    "brokers": [`${host}:9092`]
});
const connectToAdmin = async () => {
    try {
        admin = kafka.admin();
        console.log("connecting to kafka admin")
        await admin.connect()
        console.log("KAFKA admin connected")
    } catch (error) {
        console.log(error);
    }
}

const createTopic = async (topic) => {
    try {
        if (admin == null) {
            await connectToAdmin()
        }
        await admin.createTopics({
            "topics": [{
                "topic": topic,
                "numPartitions": 1
            }]
        });
        console.log("created topic for", topic)
        await admin.disconnect();
    } catch (error) {
        console.log(error);
    }
}

const connectToProducer = async () => {
    try {
        producer = kafka.producer();
        await producer.connect();
        console.log("KAFKA producer connected")
    } catch (error) {
        console.log(error);
    }
}

const sendMessage = async (topic, message) => {
    try {
        console.log("here segerhd")
        if (producer == null) {
            await connectToProducer()
        }
        await producer.send({
            "topic": topic,
            "messages": [{
                "value": message
            }]
        })
        console.log("sent message to", topic);
    } catch (error) {
        console.log(error);
    }
}

const getConsumer = async (topic) => {
try {
        const consumer = kafka.consumer({
            "groupId": "test"
        });
        await consumer.connect();
        await consumer.subscribe({
            "topic": topic,
            "fromBeginning": false
        });
        return consumer;
    } catch (error) {
        console.log(error);
    }
}


module.exports = {
    createTopic,
    sendMessage,
    getConsumer
}
