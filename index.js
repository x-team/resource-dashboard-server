'use strict';
require('dotenv').config({silent: true});

const Hapi = require('hapi');
const mongoose = require('mongoose');
const config = require('./config');

const server = new Hapi.Server();
const router = require('./router');

server.connection({
    host: config.server.host,
    port: config.server.port
});

router(server);

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

module.exports = server;
