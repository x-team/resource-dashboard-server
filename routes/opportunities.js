'use strict';

const opportunitiesController = require('../controllers/opportunities');

module.exports = (server) => {
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
        method: 'PUT',
        path: '/opportunities/{id}',
        handler: opportunitiesController.update
    });

    server.route({
        method: 'DELETE',
        path: '/opportunities/{id}',
        handler: opportunitiesController.destroy
    });
};
