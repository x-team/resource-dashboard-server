'use strict';

const User = require('../models/user');
const jwt = require('jsonwebtoken');
const validateJWT = require('hapi-auth-jwt');
const request = require('request');

let generateToken = function(userId) {
    return jwt.sign(
        // payload
        { userId: userId },
        // secret
        process.env.TOKEN_SECRET,
        // options
        { expiresIn: 10000 }
    );
};

module.exports = {
    getToken(req, reply) {

        let googleToken = req.payload.password;


        // send token to Google for validation
        request('https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' + googleToken, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log('\tGoogle Token Valid');
                body = JSON.parse(body);
                let userId = body.user_id;
                let email = body.email.toLowerCase();
                User.findOne({email}, function(err, user) {
                    if(err || !user) {
                        return reply({error: 'Account is not authorized'}).code(400);
                    }
                    return reply({token: generateToken(userId), email});
                });
            } else {
                console.log('\tFailed to validate Google Token');
                return reply().code(400);
            }
        });


    }
};
