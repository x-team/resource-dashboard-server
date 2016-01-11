'use strict';

const glob = require('glob');

module.exports = (server) => {
    let routes = glob.sync('./routes/**/*.js', {
        cwd: __dirname
    }).map(require);

    routes.forEach(function(route) {
        server.register({register: route}, {
            routes: { prefix: '/api'}
        }, (err)=>{
            if(err) {
                //TODO: log when we have a logging system
                console.error('Failed to init internal routes: ', err);
            }
        });
    });
}
