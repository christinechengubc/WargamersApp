var routes = require('express').Router();
var games = require('./games');
var events = require('./events');
var gameinfo = require('./game-info');
var gamecreate = require('./game-create');
var eventinfo = require('./event-info');

routes.use('/games', games);
routes.use('/events', events);
routes.use('/game-info', gameinfo);
routes.use('/game-create', gamecreate);
routes.use('/event-info', eventinfo);

routes.get('/', (req, res) => {
	res.status(200).json({ message: "Connected!"});
});

module.exports = routes;
