var routes = require('express').Router();
var games = require('./games');
var events = require('./events');
var execs = require('./execs');
var admins = require('./admins');

var search = require('./search');

routes.use('/games', games);
routes.use('/events', events);
routes.use('/execs', execs);
routes.use('/admins', admins)
routes.use('/search', search);

routes.get('/', (req, res) => {
	res.status(200).json({ message: "Connected!"});
});

module.exports = routes;

// Responses are designed with: https://medium.com/@shazow/how-i-design-json-api-responses-71900f00f2db in mind
