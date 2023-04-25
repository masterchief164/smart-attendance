const amqp = require('amqplib')
require("dotenv").config();
const url = process.env.RABBITMQ_URL;
const sendMessage = async (message, queueName) => {
    try {
        const connection = await amqp.connect(url);
        const channel = await connection.createChannel();
        await channel.assertQueue(queueName, {durable: true});
        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {persistent: true});
    } catch (err) {
        console.log(err);
    }
}

const consumeMessage = async (queueName, callback) => {
    try {
        const connection = await amqp.connect(url);
        const channel = await connection.createChannel();
        await channel.assertQueue(queueName, {durable: true});
        await channel.prefetch(1);
        await channel.consume(queueName, async (message) => {
            await callback(JSON.parse(message.content.toString()));
            channel.ack(message);
            // await channel.deleteQueue(queueName);
            connection.close();
        }, {noAck: false});
    } catch (err) {
        console.log(err);
    }
}

module.exports = {sendMessage, consumeMessage}
