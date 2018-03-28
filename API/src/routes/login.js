var login = require('express').Router();
var db = require('../db');
var PQ = require('pg-promise').ParameterizedQuery;

login.post('/', (req, res) => {
  var sql = new PQ('SELECT memberNumber, year, name, phoneNumber, email FROM members WHERE email = $1 AND password = $2');
  sql.values = [req.body.email, req.body.password];
  var sql2 = new PQ('SELECT * FROM executives WHERE memberNumber = $1');

  db.task(t => {
    db.one(sql)
      .then(function (data) {
        sql2.values = [data.membernumber];
        db.oneOrNone(sql2)
          .then(function (exec) {
            var isAnExec = false;
            if (exec != null) isAnExec = true;
            res.status(200)
              .json({
                status: 'success',
                user: {
                  memberNumber: data.membernumber,
                  year: data.year,
                  name: data.name,
                  phoneNumber: data.phonenumber,
                  email: data.email,
                  isAnExec: isAnExec
                }
              });
          })
            .catch(function (err) {
              // Somehow retrieved more than one result when searching in the executive table
              console.error(err);
            })
      })
        .catch(function (err) {
          res.status(500)
            .json({
              status: 'error',
            });
        });
  })
});

module.exports = login;
