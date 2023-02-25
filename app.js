require('dotenv').config();

const cors = require('cors');
const express = require('express');
const cookieParser = require('cookie-parser');
const Router = require('./routes/index.router');
const morgan = require('morgan');
const app = express();
app.use(morgan('dev'))

app.use(cors({
    credentials: true,
    origin: ['http://localhost:3001', 'https://smart-attendance-blue.vercel.app']
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));


app.use('/', Router);


app.get('/', (req, res) => {
    res.send('Hello World!');
});



const port = process.env.PORT || 8000;

const start =async()=>{
  try {

      app.listen(port, () =>
        console.log(`Server is listening on port ${port}...`)

      );
    } catch (error) {
      console.log(error);
    }
}

start();
