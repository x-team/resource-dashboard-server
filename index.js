const Hapi = require('hapi');
const mongoose = require('mongoose');
const config = require('./config');

const server = new Hapi.Server();

server.connection({
    host: config.server.host,
    port: config.server.port
});

server.route({
    method: 'GET',
    path: '/developers',
    handler(request, reply) {
        return reply(Developer.find());
    }
});

const Developer = require('./models/developer');
const names = ['Kamil', 'Krystian', 'Andrzej', 'Błażej', 'Roksana'];
server.route({
    method: 'POST',
    path: '/developers',
    handler(request, reply) {
        Developer.create({ name: names[Math.floor(Math.random() * names.length)] }, (err) => {
          if (err) {
              return reply(new Error(err));
          }
          return reply('New developer has been added');
        });
    }
});

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
