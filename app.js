/**
 * Module dependencies.
 */
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
const bodyParser = require('body-parser');
const indexRouter = require('./routes/index');
const droneRouter = require('./routes/drone.route');


/**
 * app config
 */
const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(sassMiddleware({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: true, // true = .sass and false = .scss
    sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));


/**
 * Handle CORS related issue
 */
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    if ('OPTIONS' === req.method) {
        res.send(200);
    } else {
        next();
    }

});

/**
 * Routing
 */
app.use('/', indexRouter);
app.use('/drones', droneRouter);
app.use('*', (req, res, next) => {
    let err = new Error(`"${req.originalUrl}" not found`);
    err.statusCode = 404;
    next(err);

});

/**
 * Express Error handling
 */
app.use((err, req, res, next) => {
    if (!err.errors) {
        if(err.statusCode)
        res.status(err.statusCode).send({
            message: err.message.replace(/"/g, "'"),
            status: err.statusCode
        });
        else{
            res.status(400).send({
                message: err.message.replace(/"/g, "'"),
                status: 400
            });
        }
    } else {
        const errors = err.errors;
        for (let key in errors) {
            if (errors[key].kind === "required") {
                res.status(422).send({
                    message: errors[key].message.replace(/"/g, "'"),
                    status: 422,
                });
            } else {
                if (errors[key].kind)
                    res.status(400).send({
                        message: errors[key].message.replace(/"/g, "'"),
                        status: 400,
                    });
                else {
                    if (!err.statusCode) err.statusCode = 500; // If err has no specified error code, set error code to 'Internal Server Error (500)'
                    res.status(errors.statusCode).send({err});
                }
            }
        }
    }


});


module.exports = app;
