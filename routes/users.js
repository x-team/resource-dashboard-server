'use strict';

const usersController = require('../controllers/users');

module.exports.register = function(server, options, next) {
    server.route({
        method: 'POST',
        path: '/users/getToken',
        handler: usersController.getToken
    });

    server.route({
        method: 'GET',
        path: '/users',
        handler: usersController.index,
        config: {auth: 'token'}
    });

    server.route({
        method: 'POST',
        path: '/users',
        handler: usersController.create,
        config: {auth: 'token'}
    });

    server.route({
        method: 'DELETE',
        path: '/users/{id}',
        handler: usersController.destroy,
        config: {auth: 'token'}
    });

    next();
};

module.exports.register.attributes = {
    name: 'users',
    version: '0.0.0'
};
