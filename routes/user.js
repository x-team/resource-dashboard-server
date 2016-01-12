'use strict';

const userController = require('../controllers/user');

module.exports.register = function(server, options, next) {
    server.route({
        method: 'POST',
        path: '/user/getToken',
        handler: userController.getToken
    });

    next();
};

module.exports.register.attributes = {
    name: 'user',
    version: '0.0.0'
};
