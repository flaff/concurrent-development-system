import express from 'express';
import {createServer} from 'http';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import bcrypt from 'bcryptjs';

import SocketHandler from './sockets';

const
    app = express(),
    server = createServer(app),
    socketHandler = new SocketHandler(server);

//------------- NODE CONFIG -------------------------------------------------
app.use(cors());
app.set('trust proxy', true);

app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'POST, PUT, GET, DELETE, OPTIONS');
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(morgan('dev'));
let router = express.Router();
router.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));
router.use(bodyParser.json({limit: '50mb'}));
let port = 3001;

//------------- SERVER OPTIONS -------------------------------------------------

app.use(express.static(__dirname));
server.listen(port);
console.log('#SERVER: Running on port ' + port + '...');

//------------ DB CONNECTION ---------------------------------------------------

let localDbUrl = 'mongodb://localhost:27017/cds';

let dbUrl = '';
dbUrl = localDbUrl;
console.log('#DATABASE: Connecting to LOCAL... ');

mongoose.connect(dbUrl, (err) => {
        if (err) {
            console.log('#DATABASE: Unable to connect to server. \nError:', err.message);
        }
        else {
            console.log('#DATABASE: Connection established to', dbUrl);
        }
    }
)
;

function exitHandler(options, err) {
    if (options.cleanup)
        console.log('clean');
    if (err)
        console.log(err.stack);
    if (!options.exit)
        console.log('Server unknown error!');
    if (options.exit) {
        console.log('exit');
        process.exit(0);
    }
}

process.on('exit', exitHandler.bind(null, {exit: true}));

process.on('SIGTERM', exitHandler.bind(null, {exit: true}));

process.on('uncaughtException', exitHandler.bind(null, {exit: false}));

//------------ LOAD ROUTES ---------------------------------------------------
require('../routes/routes')(router, app, jwt, bcrypt);

app.use('/api', router);
