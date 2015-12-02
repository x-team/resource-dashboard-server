'use strict';

const glob = require('glob');

module.exports = (server) => {
    let routes = glob.sync('./routes/**/*.js', {
        cwd: __dirname
    }).map(require);

    routes.forEach(function(route) {
        route(server);
    });
}
