'use strict';

const User = require('../models/user');
const jwt = require('jsonwebtoken');
const validateJWT = require('hapi-auth-jwt');

module.exports = {
    getToken(request, reply) {
        let token = jwt.sign({userId: '1'}, 'qwerty', {expiresIn: 100000});
        return reply({token});
    }
};
