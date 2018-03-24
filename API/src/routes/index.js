var routes = require('express').Router();
var games = require('./games');
var events = require('./events');

routes.use('/games', games);
routes.use('/events', events);

routes.get('/', (req, res) => {
	res.status(200).json({ message: "Connected!"});
});

module.exports = routes;
