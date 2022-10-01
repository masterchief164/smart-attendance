require('dotenv').config();

const cors = require('cors');
const express = require('express');
const cookieParser = require('cookie-parser');
const Router = require('./routes/index.router');

const app = express();

app.use(cors({
    credentials: true,
    origin: ['http://localhost:3000']
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.use('/', Router);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const port = process.env.PORT || 8000;

app.listen(port, (err) => {
    if(err)
        console.log(port);
    console.log("server running on port 8000");
});
