'use strict';

const opportunitiesController = require('../controllers/opportunities');

module.exports.register = function(server, options, next) {

    server.route({
        method: 'GET',
        path: '/opportunities',
        handler: opportunitiesController.index,
        config: {auth: 'token'}
    });

    server.route({
        method: 'GET',
        path: '/opportunities/{id}',
        handler: opportunitiesController.show,
        config: {auth: 'token'}
    });

    server.route({
        method: 'POST',
        path: '/opportunities',
        handler: opportunitiesController.create,
        config: {auth: 'token'}
    });

    server.route({
        method: 'PATCH',
        path: '/opportunities/{id}',
        handler: opportunitiesController.update,
        config: {auth: 'token'}
    });

    server.route({
        method: 'DELETE',
        path: '/opportunities/{id}',
        handler: opportunitiesController.destroy,
        config: {auth: 'token'}
    });
    next();
};

module.exports.register.attributes = {
    name: 'opportunities',
    version: '0.0.0'
};
