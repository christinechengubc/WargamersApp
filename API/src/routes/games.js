var games = require('express').Router();
var db = require('../db');

games.get('/', (req, res) => {
	var sql = 'SELECT title, rating, name as publisher ' +
  'FROM game, publishedby, publisher ' +
  'WHERE game.title = publishedby.gameTitle AND publisher.name = publishedby.publisherName';
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
