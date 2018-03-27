var login = require('express').Router();
var db = require('../db');
var PQ = require('pg-promise').ParameterizedQuery;

login.post('/', (req, res) => {
  var sql = new PQ('SELECT memberNumber, year, name, phoneNumber, email FROM member WHERE email = $1 AND password = $2');
  sql.values = [req.body.email, req.body.password];
  db.one(sql)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          user: {
            memberNumber: data.memberNumber,
            year: data.year,
            name: data.name,
            phoneNumber: data.phoneNumber,
            email: data.email
          }
        });
    })
      .catch(function (err) {
        console.error("Retrieved more than one user.");
        res.status(500)
          .json({
            status: 'error',
            message: 'Retrieved more than one user.'
          });
      });
});

module.exports = login;
