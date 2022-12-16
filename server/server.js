const express = require('express');
const errorHandler = require('../middleware/error');
const xss = require('xss-clean');
const dotenv = require('dotenv')
const cors = require('cors');
const hpp = require('hpp');

const requestIp = require('request-ip')

const fileUpload = require('express-fileupload');
const rateLimit = require('express-rate-limit');
const path = require('path');

// timestamp for Logs
require("log-timestamp")(function () {
    let date = new Date();
    return `[${date.toLocaleString()}] :::`.grey.bold;
});

// load env variables

dotenv.config({path: './config/config.env'})

require('dotenv').config();
// Import DB
const connectDB = require('../config/db');
connectDB().then(r => console.log("Connected"));
require('colors');
const {routes} = require("../api");

const app = express();
// Body Parser

app.use(express.json());
// sanitize Data

// xss-clean

app.use(xss());
// Rate Limit

app.use(requestIp.mw())
const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minutes
    max: 10000, // limit each IP to 1000 requests per windowMs
    keyGenerator: (req, res) => {
        return req.clientIp
    }
});

if (process.env.NODE_ENV === 'development') {
    const corsOptions = {
        origin: process.env.DEV_APP_URL || 'http://localhost:3000',
        credentials: true
    }
    // cors
    app.use(cors(corsOptions))
    app.options('*', cors(corsOptions))
}

if (process.env.NODE_ENV === 'production') {
    const corsOptions = {
        origin: process.env.APP_URL
    }
    // cors
    app.use(cors(corsOptions))
    app.options('*', cors(corsOptions))
}

app.use(limiter);
// hpp

app.use(hpp());
// cors

// file Upload
app.use(fileUpload());


// set static folder
const options = {
    dotfiles: 'ignore',
    etag: false,
    extensions: ['htm', 'html'],
    maxAge: '1d',
    redirect: false,
    setHeaders: function (res, path, stat) {
        res.set('x-timestamp', Date.now());
    },
};

app.use(express.static(path.join(__dirname, '../public'), options))
app.use(express.static(path.join(__dirname, '../public/client'), options))

// Use Routes
routes(app, express)

// All other routes should redirect to the index.html
app.route('/*')
    .get((req, res) => {
        res.sendFile(path.resolve('public/client/index.html'))
    })

module.exports = app;