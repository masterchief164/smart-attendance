require('dotenv').config();

const cors = require('cors');
const http2 = require("http2");
const http2Express = require('http2-express-bridge');
const express = require('express');
const cookieParser = require('cookie-parser');
const Router = require('./routes/index.router');
const morgan = require('morgan');
const app = http2Express(express)
const fs = require('fs');
const path= require('path')

app.use(express.static("public"))

const accessLogStream=fs.createWriteStream(path.join(__dirname,'access.log'),{
    flags:'a'
})

app.use(morgan('combined',{stream:accessLogStream})) // todo: use winston for logging

app.use(cors({
    credentials: true,
    origin: ['http://localhost:3001', 'https://smartattendance.live', 'https://www.smartattendance.live']
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));

app.use('/', Router);

const appid = process.env.APPID;
app.get('/', (req, res) => {
    res.send(`${appid} Hello World!`);
});


const port = process.env.PORT || 8000;
const options = {
    key: fs.readFileSync("./private.pem"),
    cert: fs.readFileSync("./cert.pem"),
    allowHTTP1: true
}

const start = async () => {
    try {
        const server = http2.createSecureServer(options, app)
        server.listen(port)
    } catch (e) {
        console.log(e)
    }
}

start().then(() => {
    console.log("Server started on port", port)
});
