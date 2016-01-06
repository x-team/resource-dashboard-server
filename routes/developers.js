'use strict';

const developersController = require('../controllers/developers');

module.exports = (server) => {
    server.route({
        method: 'GET',
        path: '/api/developers',
        handler: developersController.index
    });

    server.route({
        method: 'GET',
        path: '/api/developers/{id}',
        handler: developersController.show
    });

    server.route({
        method: 'POST',
        path: '/api/developers',
        handler: developersController.create
    });

    server.route({
        method: 'PATCH',
        path: '/developers/{id}',
        handler: developersController.update
    });

    server.route({
        method: 'DELETE',
        path: '/api/developers/{id}',
        handler: developersController.destroy
    });
};
