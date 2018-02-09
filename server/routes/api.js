'use strict';
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const winston = require('winston');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User').User;
const fs = require('fs');
const jwt = require('express-jwt');
const auth = jwt({
    secret: 'secRET',
    userProperty: 'user'
});

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
},
    (username, password, done) => {
        winston.info('logging in: ' + username + ' : ' + password);
        User.findOne({ username: username }, (err, user) => {
            if (err || !user) return done(null, false, {
                message: 'Wrong username or password'
            });
            if (!user.verifyPassword(password)) return done('Wrong password', false);
            return done(null, user);
        });
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

/* GET api listing. */
router.get('/', function(req, res) {
    res.send('api works');
    
});

router.post('/register', function(req, res, next) {
    User.findOne({ 'username': req.body.username }, (err, doc) => {
        if (err) return res.status(500).send({ message: 'Internal server error.' });
        if (doc != null) return res.status(409).send({ message: 'User already exists' });
        if (req.body.password !== req.body.passwordConfirm) return res.status(409).send({ message: 'Passwords don\'t match' });
        if (req.body.username != null && req.body.password != null) {

            // Generate salt
            bcrypt.genSalt(10, (err, salt) => {
                if (err || salt == null) return res.status(500).send({ message: 'Internal server error.' });

                // Generate hash from password
                bcrypt.hash(req.body.password, salt, (err, hash) => {
                    winston.info(JSON.stringify(req.body));
                    var newUser = new User({
                        username: req.body.username,
                        hash: hash,
                        registrationDate: new Date(),
                        lastLoginDate: new Date()
                    });

                    newUser.save((err, doc) => {
                        if (err || doc == null) return res.status(500).send({ message: 'Internal server error.' });
                        req.login(newUser, (err) => {
                            winston.error(err);
                            res.status(200).send({ token: doc.generateJwt() });
                        });
                    });
                });
            });
        } else {
            return res.status(500).send({ message: 'Internal server error.' });
        }
    });
});

router.post('/login', function(req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        var token;
        if (err) {
            winston.error(err);
            res.status(404).send(err);
            return;
        }

        if (user) {
            res.status(200).send({ token: user.generateJwt() });
        } else {
            res.status(401).send(info);
        }
    })(req, res, next);
});

module.exports = router;