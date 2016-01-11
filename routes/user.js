const userController = require('../controllers/user');

module.exports = (server) => {
    server.route({
        method: 'POST',
        path: '/user/getToken',
        handler: userController.getToken
    });
};
