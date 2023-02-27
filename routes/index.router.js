const express = require('express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

const router = express.Router();

const authRouter = require('./auth.route');
const session = require('./session.route');
const course = require('./course.route');


// swagger docs config

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Documentation',
        },
        servers: [
            {url: 'http://localhost:8000'},
        ],
    },
    apis: ['./routes/*.js'],
};

swaggerJsDoc(swaggerOptions);


router.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument),
);


// routes
router.use('/auth', authRouter);
router.use('/session', session);
router.use('/course', course);


module.exports = router;
