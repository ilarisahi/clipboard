'use strict';
const winston = require('winston');
const mongoose = require('mongoose');
// Set up mongoose
mongoose.connect('mongodb://localhost:29448/database', err => {
    if (err) {
        throw err;
    }
});

mongoose.connection.on('connected', () => {
    winston.info('Successfully connected with Mongoose');
});

mongoose.connection.on('error', err => {
    winston.error('Mongoose default connection error: ' + err);
});

mongoose.connection.on('disconnected', () => {
    winston.info('Mongoose default connection disconnected');
});
