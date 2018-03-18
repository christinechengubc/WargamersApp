var games = require('express').Router();
var db = require('../db');

games.get('/', (req, res) => {
	var sql = 'SELECT * FROM game';
  db.any(sql)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ALL games'
        });
    })
    .catch(function (err) {
			console.error("Error when retrieving games " + err);
		});
});

module.exports = games;
