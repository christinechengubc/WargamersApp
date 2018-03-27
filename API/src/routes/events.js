var events = require('express').Router();
var db = require('../db');

events.get('/', (req, res) => {
	var sql = 'SELECT * ' +
  'FROM events';
  db.any(sql)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved events'
        });
    })
    .catch(function (err) {
			console.error("Error when retrieving events " + err);
		});
});


module.exports = events;
