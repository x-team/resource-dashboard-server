'use strict';

const glob = require('glob');
const User = require('./models/user');
const hapiAuthJwt = require('hapi-auth-jwt');

module.exports = (server) => {
    let routes = glob.sync('./routes/**/*.js', {
        cwd: __dirname
    }).map(require);

    server.register(hapiAuthJwt, function(error) {
        server.auth.strategy('token', 'jwt', {
            key: process.env.TOKEN_SECRET,
            validateFunc: validateUserToken
        });

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

    });
}

let validateUserToken = function (request, decodedToken, callback) {
    if (!decodedToken || !decodedToken.email) {
        return callback(null, false);
    }

    User.findOne({email: decodedToken.email.toLowerCase()}, function(err, user) {
        if(err || !user) {
            return callback(null, false);
        }
        return callback(null, true, user);
    });
};
