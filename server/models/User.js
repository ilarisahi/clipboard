'use strict';
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
const winston = require('winston');

var UserSchema = new Schema({
    username: String,
    hash: String,
    registrationDate: Date,
    lastLoginDate: Date
});

UserSchema.methods.verifyPassword = function(password) {
    winston.info('Comparing: ' + password + ' and ' + this.hash);
    return bcrypt.compareSync(password, this.hash);
}

UserSchema.methods.generateJwt = function() {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    return jwt.sign({
        id: this.id,
        username: this.username,
        exp: parseInt(expiry.getTime() / 1000)
    }, 'secRET');
}

var User = mongoose.model('User', UserSchema);

module.exports = { UserSchema, User };
