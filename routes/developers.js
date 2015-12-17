'use strict';

const developersController = require('../controllers/developers');

module.exports = (server) => {
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
        method: 'PUT',
        path: '/developers/{id}',
        handler: developersController.update
    });

    server.route({
        method: 'DELETE',
        path: '/developers/{id}',
        handler: developersController.destroy
    });
};
