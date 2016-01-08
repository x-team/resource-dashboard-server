'use strict';

const developersController = require('../controllers/developers');

module.exports.register = function(server, options, next) {
    server.route({
        method: 'GET',
        path: '/developers',
        handler: developersController.index
    });

    server.route({
        method: 'GET',
        path: '/developers/{id}',
        handler: developersController.show
    });

    server.route({
        method: 'POST',
        path: '/developers',
        handler: developersController.create
    });

    server.route({
        method: 'PATCH',
        path: '/developers/{id}',
        handler: developersController.update
    });

    server.route({
        method: 'DELETE',
        path: '/developers/{id}',
        handler: developersController.destroy
    });
    next();
};

module.exports.register.attributes = {
    name: 'developers',
    version: '0.0.0'
};
