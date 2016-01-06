'use strict';

const opportunitiesController = require('../controllers/opportunities');

module.exports = (server) => {
    server.route({
        method: 'GET',
        path: '/api/opportunities',
        handler: opportunitiesController.index
    });

    server.route({
        method: 'GET',
        path: '/api/opportunities/{id}',
        handler: opportunitiesController.show
    });

    server.route({
        method: 'POST',
        path: '/api/opportunities',
        handler: opportunitiesController.create
    });

    server.route({
        method: 'PATCH',
        path: '/api/opportunities/{id}',
        handler: opportunitiesController.update
    });

    server.route({
        method: 'DELETE',
        path: '/api/opportunities/{id}',
        handler: opportunitiesController.destroy
    });
};
