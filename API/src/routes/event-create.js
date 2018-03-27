var eventcreate = require('express').Router();
var db = require('../db');


eventcreate.get('/execs', (req, res) => {
	var sql = 'SELECT members.name ' +
  'FROM executives, members ' +
  'WHERE executives.memberNumber = members.memberNumber '
  'ORDER BY member.memberNumber';
  db.any(sql)
    .then(function (data) {

      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved execs'
        });
    })
    .catch(function (err) {
			console.error("Error when retrieving execs " + err);
		});
});

module.exports = eventcreate;
