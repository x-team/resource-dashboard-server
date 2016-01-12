'use strict';

const developersController = require('../controllers/developers');

module.exports.register = function(server, options, next) {
    server.route({
        method: 'GET',
        path: '/developers',
        handler: developersController.index,
        config: {auth: 'token'}
    });

    server.route({
        method: 'GET',
        path: '/developers/{id}',
        handler: developersController.show,
        config: {auth: 'token'}
    });

    server.route({
        method: 'POST',
        path: '/developers',
        handler: developersController.create,
        config: {auth: 'token'}
    });

    server.route({
        method: 'PATCH',
        path: '/developers/{id}',
        handler: developersController.update,
        config: {auth: 'token'}
    });

    server.route({
        method: 'DELETE',
        path: '/developers/{id}',
        handler: developersController.destroy,
        config: {auth: 'token'}
    });
    next();
};

module.exports.register.attributes = {
    name: 'developers',
    version: '0.0.0'
};
