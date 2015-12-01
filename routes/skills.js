'use strict';

const skillsController = require('../controllers/skills');

module.exports = (server) => {
    server.route({
        method: 'GET',
        path: '/skills',
        handler: skillsController.index
    });

    server.route({
        method: 'GET',
        path: '/skills/{id}',
        handler: skillsController.show
    });

    server.route({
        method: 'POST',
        path: '/skills',
        handler: skillsController.create
    });

    server.route({
        method: 'PUT',
        path: '/skills/{id}',
        handler: skillsController.update
    });

    server.route({
        method: 'DELETE',
        path: '/skills/{id}',
        handler: skillsController.destroy
    });
};
