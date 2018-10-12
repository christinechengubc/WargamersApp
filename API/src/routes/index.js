var routes = require('express').Router();
var games = require('./games');
var events = require('./events');
var executives = require('./executives');
var admins = require('./admins');
var login = require('./login');
var search = require('./search');
var bgg = require('./bgg');

routes.use('/login', login);
routes.use('/games', games);
routes.use('/events', events);
routes.use('/executives', executives);
routes.use('/search', search);
routes.use('/admins', admins);
routes.use('/bgg', bgg);

routes.get('/', (req, res) => {
  res.status(200).json({ message: "Connected!"});
});





module.exports = routes;

// Responses are designed with: https://medium.com/@shazow/how-i-design-json-api-responses-71900f00f2db in mind
