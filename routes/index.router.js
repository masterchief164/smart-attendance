const express = require('express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const router = express.Router();

const authRouter = require('./login.route');
const logoutRouter=require('./logout.route');


// swagger docs config

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Documentation',
        },
        servers: [
            { url: 'http://localhost:8000' },
        ],
    },
    apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);




router.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocs),
);





// routes
router.use('/login', authRouter);
router.use('/auth',logoutRouter);


module.exports = router;
