//------------ NODE REQUIRES ---------------------------------------------------

const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const bcrypt = require('bcryptjs');

//------------- NODE CONFIG -------------------------------------------------
app.use(cors());
app.set('trust proxy', true);

app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
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

let localDbUrl = 'mongodb://localhost/cds';

let dbUrl = '';
dbUrl = localDbUrl;
console.log('#DATABASE: Connecting to LOCAL... ');

mongoose.connect(dbUrl, function (err, db) {
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

io.sockets.on('connection', function (socket) {
    socket.emit('connectedToSocket', {socket: socket.id});
    // socket.on('change_room', function (data) {
    //     socket.join(data.userId);
    //     console.log('room changed to ' + data.userId);
    // });
});

process.on('exit', exitHandler.bind(null, {exit: true}));

process.on('SIGTERM', exitHandler.bind(null, {exit: true}));

process.on('uncaughtException', exitHandler.bind(null, {exit: false}));

//------------ LOAD ROUTES ---------------------------------------------------
require('./routes/routes')(router, app, jwt, bcrypt, io);

app.use('/api', router);
