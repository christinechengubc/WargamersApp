var gamecreate = require('express').Router();
var db = require('../db');
var PQ = require('pg-promise').ParameterizedQuery;

gamecreate.get('/genre', (req, res) => {
	var sql = 'SELECT genres.name ' +
  'FROM genres ' +
  'ORDER BY genres.name';
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

gamecreate.get('/publishers', (req, res) => {
	var sql = 'SELECT publishers.name ' +
  'FROM publishers ' +
  'ORDER BY publishers.name';
  db.any(sql)
    .then(function (data) {

      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved publishers'
        });
    })
    .catch(function (err) {
			console.error("Error when retrieving publishers " + err);
		});
});

gamecreate.post('/new', (req, res) => {
	var sql = new PQ('INSERT INTO Game VALUES($1, $2, $3, $4, $5, $6, $7)');
	sql.values = [req.body.title, req.body.rating, req.body.minplayers, req.body.maxplayers, req.body.minplaytime, req.body.maxplaytime, req.body.difficulty];
	var sql2 = new PQ('INSERT INTO PublishedBy VALUES($1, $2, $3)');
	sql2.values = [];
	var sql3 = new PQ('INSERT INTO HasGenre VALUES($1, $2)');
	sql3.values = [];

	var result = {};

	db.task(t => {
		t.none(sql)
			.then(() => {
					req.body.publishers.forEach((publisher) => {
						sql2.values = [publisher.name, req.body.title, publisher.datepublished];
						t.none(sql2)
					});

					req.body.genres.forEach((genre) => {
								sql3.values = [req.body.title, genre.name];
							})
							t.none(sql3);
					});
			})
		.then(() => {
			res.status(200)
				.json({
					status: 'success'
				});
		})
		.catch((error) => {
			console.error(error);
		});
});

module.exports = gamecreate;
