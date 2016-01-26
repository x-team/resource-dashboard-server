'use strict';

require('dotenv').config({silent: true});
const config = require('./config');

const Hapi = require('hapi');
const mongoose = require('mongoose');

const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : config.server.host;
const port = process.env.PORT || config.server.port;
const mongodbUri = process.env.MONGOLAB_URI || config.database.uri;

const server = new Hapi.Server();
server.connection({
    host,
    port,
    routes: {
        cors: true
    }
});

require('./router')(server);

mongoose.connect(mongodbUri);
mongoose.connection.on('error', console.error.bind(console, 'DB connection error:'));
mongoose.connection.once('open', () => {
    console.log('Connected to database at:', mongodbUri);
    server.start((err) => {
        if (err) {
            throw err;
        }
        console.log('Server running at:', server.info.uri);
    });
});

module.exports = server;
