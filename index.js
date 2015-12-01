'use strict';

const Hapi = require('hapi');
const mongoose = require('mongoose');
const config = require('./config');

const server = new Hapi.Server();

server.connection({
    host: config.server.host,
    port: config.server.port
});

require('./router')(server);

mongoose.connect(config.database.uri);
mongoose.connection.on('error', console.error.bind(console, 'DB connection error:'));
mongoose.connection.once('open', () => {
    server.start((err) => {
        if (err) {
            throw err;
        }
        console.log('Server running at:', server.info.uri);
    });
});
