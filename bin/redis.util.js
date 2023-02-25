const redis = require('redis')

const port = process.env.REDIS_PORT;
const host = process.env.REDIS_HOST;
const redisPassword = process.env.REDIS_PASSWORD;
const redisUrl = `redis://default:${redisPassword}@${host}:${port}/1`;
const client = redis.createClient({url: redisUrl});


client.connect().then(() => {
    console.log("Redis connected");
})


module.exports = client;
