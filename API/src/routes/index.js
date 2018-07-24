var routes = require('express').Router();
var games = require('./games');
var events = require('./events');
var executives = require('./executives');
var admins = require('./admins');
var login = require('./login');
var secret = require('./secret');
var jwt = require('jsonwebtoken');


var search = require('./search');

routes.use('/login', login);
routes.use('/games', games);
routes.use('/events', events);
routes.use('/executives', executives);
routes.use('/search', search);
routes.use('/admins', admins);

routes.get('/', (req, res) => {
  res.status(200).json({ message: "Connected!"});
});


routes.use((req,res,next) => {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (token) {

    jwt.verify(token, secret.secret, function(err, decoded) {

      if (err) {return res.status(403)
        .json({
          message: "wrong token"
        })
      }

      else {
        //save decoded token for use elsewhere
        req.decoded = decoded;
        next();
      }


    });
  } else {
    return res.status(403)
      .json({
        message: "no token"
      });
  }
});


//IMPORTANT: any routes that need authentication should be put under here, ie. all admin functions
// might have to split up games route into /games and /games-edit so that only admins can edit games





module.exports = routes;

// Responses are designed with: https://medium.com/@shazow/how-i-design-json-api-responses-71900f00f2db in mind
