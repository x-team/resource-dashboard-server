'use strict';

const jsonApi = require('../helpers/jsonApi.js');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const validateJWT = require('hapi-auth-jwt');
const request = require('request');

module.exports = {
    index(request, reply) {
        User.find({}, (err, users) => {
            if(err) {
                return reply(new Error(err));
            }

            users = users.map((user) => {
                return jsonApi.mongoosetoJsonApiObject(user, 'user')
            });

            reply({data: users});
        });
    },

    create(request, reply) {
        let data = request.payload.data.attributes;
        data.email = data.email || '';
        User.create({
            name: data.name,
            email: data.email.toLowerCase(),
        }, (err, user) => {
            if (err) {
                return reply({errors: err.errors}).code(400);
            }
            let result = jsonApi.mongoosetoJsonApiObject(user, 'user')
            return reply({data: result});
        });
    },

    destroy(request, reply) {
        let id = encodeURIComponent(request.params.id);
        let currentUserId = request.auth.credentials.id;

        if(id === currentUserId) {
            let errors = {
                email: {
                    message: 'Current user can\'t be deleted'
                }
            };
            return reply({errors}).code(400);
        }

        User.findByIdAndRemove(id, (err, user) => {
            if (err) {
                return reply(new Error(err));
            }
            return reply().code(204)
        });
    },

    getToken(req, reply) {
        let googleToken = req.payload.password;
        // send token to Google for validation
        request('https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' + googleToken, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                body = JSON.parse(body);
                let userId = body.user_id;
                let email = body.email.toLowerCase();
                User.findOne({email}, function(err, user) {
                    if(err || !user) {
                        return reply({error: 'Account is not authorized'}).code(400);
                    }
                    return reply({token: generateToken(user._id, email), email});
                });
            } else {
                console.log('\tFailed to validate Google Token');
                return reply().code(400);
            }
        });
    }
};

let generateToken = function(id, email) {
    return jwt.sign(
        // payload
        { email, id},
        // secret
        process.env.TOKEN_SECRET,
        // options
        { expiresIn: 10000 }
    );
};
