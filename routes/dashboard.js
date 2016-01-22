'use strict';

const dashboardController = require('../controllers/dashboard');

module.exports.register = function(server, options, next) {
    server.route({
        method: 'GET',
        path: '/dashboard/graph',
        handler: dashboardController.getGraph,
        config: {auth: 'token'}
    });

    next();
};

module.exports.register.attributes = {
    name: 'dashboard',
    version: '0.0.0'
};
