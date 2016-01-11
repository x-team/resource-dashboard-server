'use strict';

const opportunitiesController = require('../controllers/opportunities');

module.exports.register = function(server, options, next) {

    server.route({
        method: 'GET',
        path: '/opportunities',
        handler: opportunitiesController.index
    });

    server.route({
        method: 'GET',
        path: '/opportunities/{id}',
        handler: opportunitiesController.show
    });

    server.route({
        method: 'POST',
        path: '/opportunities',
        handler: opportunitiesController.create
    });

    server.route({
        method: 'PATCH',
        path: '/opportunities/{id}',
        handler: opportunitiesController.update
    });

    server.route({
        method: 'DELETE',
        path: '/opportunities/{id}',
        handler: opportunitiesController.destroy
    });
    next();
};

module.exports.register.attributes = {
    name: 'opportunities',
    version: '0.0.0'
};
