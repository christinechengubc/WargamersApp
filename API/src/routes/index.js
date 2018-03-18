var routes = require('express').Router();
var games = require('./games');

routes.use('/games', games);

routes.get('/', (req, res) => {
	res.status(200).json({ message: "Connected!"});
});

module.exports = routes;
