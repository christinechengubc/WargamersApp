var login = require('express').Router();
var db = require('../db');
var PQ = require('pg-promise').ParameterizedQuery;
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var secret = require('./secret');
var app = require('express')();



const expiryTime = 180; //the time for expiry for a token


login.post('/', (req, res) => {


  var sql = new PQ('SELECT hash FROM App_Admins WHERE email = $1');
  sql.values = [req.body.email];

  console.log(req.body.email);
  console.log(req.body.password);
db.oneOrNone(sql)
  .then((data) => {
  console.log(data);
   //incorrect username
   if (!data) {
     return res.status(401)
       .json({
          status: 'failure',
          code: 401,
          message: 'authentication failed'
       });
   }



    //the hashed password received
    var hashPassword = data.hash;
    console.log(hashPassword);
   bcrypt.compare(req.body.password, hashPassword, function (err, success) {
      console.log(success);

      if (success) {
        const payload = {
          user: req.body.email,
          admin: true
        };
        //set secret to retrieve from secret.json

        var token = jwt.sign(payload, secret.secret, {expiresIn: expiryTime});

        return res.status(200)
          .json({
            status: 'success',
            code: 200,
            message: 'logged in!',
            token: token
          });
      }
      //incorrect password
      else {
         res.status(401)
          .json({
            status: 'failure',
            code: 401,
            message: 'authentication failed'
          })
      }
    });
  }).catch((err) => {
      //somehow retrieves more than 1 result
     //  console.log(err);
      res.status(500)
         .json({
           status: 'error',
         });
  });

});

module.exports = login;
