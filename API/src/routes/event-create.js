var eventcreate = require('express').Router();
var db = require('../db');


eventcreate.get('/execs', (req, res) => {
	var sql = 'SELECT member.name ' +
  'FROM executive, member ' +
  'WHERE executive.memberNumber = member.memberNumber '
  'ORDER BY member.memberNumber';
  db.any(sql)
    .then(function (data) {

      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved genres'
        });
    })
    .catch(function (err) {
			console.error("Error when retrieving genres " + err);
		});
});

module.exports = eventcreate;
