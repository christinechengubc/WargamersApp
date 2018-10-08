var login = require('express').Router();
var db = require('../db');
var PQ = require('pg-promise').ParameterizedQuery;
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
try {
  secret = require('./secret');
} catch (err) {
  secret = process.env.SECRET_KEY;
}
var app = require('express')();



const expiryTime = 3600; //the time for expiry for a token


login.post('/', (req, res) => {


  var sql = new PQ('SELECT hash FROM App_Admins WHERE email = $1');
  sql.values = [req.body.email];
  db.oneOrNone(sql)
    .then((data) => {

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
   // console.log(hashPassword);
   bcrypt.compare(req.body.password, hashPassword, function (err, success) {
    //  console.log(success);

      if (success) {
        const payload = {
          user: req.body.email,
          admin: true
        };
        //set secret to retrieve from secret.json
        var token = jwt.sign(payload, secret, {expiresIn: expiryTime});

        return res.status(200)
          .json({
            status: 'success',
            code: 200,
            message: 'logged in!',
            result: {
              token: token
            }
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

login.use((req,res,next) => {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
if (token) {

  jwt.verify(token, secret, function(err, decoded) {
    console.log("success");
    if (err) {return res.status(403)
      .json({
        message: "not logged in"
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
      message: "not logged in"
    });
}
});

login.get('/', (req, res) => {
  return res.status(200).json({
    status: 'success',
    code:200,
})
});


module.exports = login;
