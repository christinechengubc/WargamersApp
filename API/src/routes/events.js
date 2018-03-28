var events = require('express').Router();
var db = require('../db');


//pass date as all numbers as string in form 'DDMMYYYY'
events.get('/', (req, res) => {
  var sql = 'SELECT * FROM events'
  db.any(sql)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved event information'
        });
    })
    .catch(function (err) {
			console.error("Error when retrieving events " + err);
		});
});


module.exports = events;
