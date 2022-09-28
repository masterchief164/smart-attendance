require('dotenv').config();

const cors = require('cors');
const express = require('express');

const app = express();

app.use(cors({
    credentials: true,
    origin: ['http://localhost:3000']
}));

const port = process.env.PORT || 8000;

app.listen(port, (err) => {
    if(err)
        console.log(port);
    console.log("server running on port 8000");
});
