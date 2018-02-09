'use strict';
const debug = require('debug')('Mukaan');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const winston = require('winston');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const fs = require('fs');
const mongoose = require('mongoose');
const _ = require('lodash');
const db = require('./server/db');

const shortid = require('shortid');
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.-');

const api = require('./server/routes/api');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set up passport
app.use(passport.initialize());

// Set our api routes
app.use('/api', api);
app.use(express.static(path.join(__dirname, '/dist')));
app.use(express.static(path.join(__dirname, '/public')));

// Catch all other routes and return the index file
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        winston.error(err.stack);
        res.status(err.status || 500);
        res.send({
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    winston.error(err.stack);
    res.status(err.status || 500);
    res.send({
        message: err.message,
        error: {}
    });
});

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
    winston.info('IleBoard server listening on port ' + server.address().port);
});

const io = require('socket.io').listen(server);

var activeRooms = {};

// Socket functions
io.on('connection', function (socket) {
    winston.info('A user connected.');
    var roomId;

    // Set socket's username parameter
    socket.on('newRoom', function (data) {
        console.log(Object.keys(io.sockets.connected).length);
        do {
            roomId = shortid.generate().slice(0,4);
            roomId = roomId.toUpperCase();
        } while (activeRooms[roomId] != null);

        var newRoom = {
            created: new Date(),
            usernames: []
        }

        winston.info(JSON.stringify(newRoom, null, 4));
        activeRooms[roomId] = newRoom;
        socket.emit('newRoomId', { roomId: roomId });
    });

    // When joining to room, leave from other rooms
    socket.on('joinRoom', function (data) {
        data.roomId = data.roomId.toUpperCase();
        socket.username = data.username;
        console.log('Connecting ' + data.username + ' to ' + data.roomId);
        for (var r in socket.rooms) {
            socket.leave(r);
        }

        winston.info(activeRooms[data.roomId]);
        if (activeRooms[data.roomId] != null) {
            socket.join(data.roomId);
            roomId = data.roomId;
            if (!_.includes(activeRooms[roomId].usernames, socket.username)) {
                activeRooms[roomId].usernames.push(socket.username);
            }
            socket.to(data.roomId).emit('userJoinedRoom', socket.username);
            socket.emit('roomInit', activeRooms[roomId]);
        } else {
            socket.emit('wrongRoomId', 'This room doesn\t exist.');
        }
    });

    // Emit incoming messages to other users
    socket.on('clipboardPaste', function (data) {
        console.log('Pasted data: ' + data.data);
        if (roomId) {
            socket.broadcast.to(roomId).emit('newClipboardPaste', data.data);
        }
    });

    socket.on('leaveRoom', function (data) {
        if (roomId) {
            socket.leave(roomId);
            socket.broadcast.to(roomId).emit('userLeftRoom', socket.username);
            if (_.includes(activeRooms[roomId].usernames, socket.username)) {
                _.pull(activeRooms[roomId].usernames, socket.username);
                if (activeRooms[roomId].usernames.length === 0) activeRooms[roomId] = null;
            }
            roomId = null;
        }
    });

    socket.on('disconnect', function() {
        if (roomId) {
            socket.broadcast.to(roomId).emit('userLeftRoom', socket.username);
            if (_.includes(activeRooms[roomId].usernames, socket.username)) {
                _.pull(activeRooms[roomId].usernames, socket.username);
                if (activeRooms[roomId].usernames.length === 0) activeRooms[roomId] = null;
            }
        }
    });
});

module.exports = app;
