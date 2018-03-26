var routes = require('express').Router();
var games = require('./games');
var events = require('./events');
var gameinfo = require('./game-info');

routes.use('/games', games);
routes.use('/events', events);
routes.use('/game-info', gameinfo);

routes.get('/', (req, res) => {
	res.status(200).json({ message: "Connected!"});
});

module.exports = routes;
