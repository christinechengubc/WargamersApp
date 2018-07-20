var login = require('express').Router();
var db = require('../db');
var PQ = require('pg-promise').ParameterizedQuery;
var bcrypt = require('bcrypt');

login.post('/', (req, res) => {
  /*  var sql = new PQ('SELECT memberNumber, year, name, phoneNumber, email FROM members WHERE email = $1 AND password = $2');
  sql.values = [req.body.email, req.body.password];
  var sql2 = new PQ('SELECT * FROM executives WHERE memberNumber = $1');*/
 // console.log(req.body.username);

  var sql = new PQ('SELECT password FROM App_Admins WHERE username = $1');
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
    var hashPassword = data.password;
    console.log(hashPassword);
   bcrypt.compare(req.body.password, hashPassword, function (err, success) {
      console.log(success);
      if (success) {
        return res.status(200)
          .json({
            status: 'success',
            code: 200,
            message: 'logged in!'
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
