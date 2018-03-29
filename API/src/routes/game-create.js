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
	var sql = new PQ('INSERT INTO Games VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)');
	sql.values = [req.body.title, req.body.rating, req.body.minPlayers, req.body.maxPlayers, req.body.minPlaytime, req.body.maxPlaytime, req.body.yearPublished, req.body.description, req.body.difficulty];
	var sql2 = new PQ('INSERT INTO PublishedBy VALUES($1, $2)');
	var sql3 = new PQ('INSERT INTO HasGenre VALUES($1, $2)');
	var sql4 = new PQ('SELECT max(id) as id FROM GameInstances WHERE gameTitle = $1');
	sql4.values = [req.body.title];
	var sql5 = new PQ('INSERT INTO GameInstances VALUES($1, $2, $3, $4, $5)');

	var result = {};

	db.task(t => {
		return t.none(sql)
			.then(() => {
				return t.one(sql4)
					.then((mostRecentGameInstance) => {
						var nextID;
						if (mostRecentGameInstance.id === null) nextID = 0;
						else nextID = mostRecentGameInstance.id + 1;
						// actually redundant since users should never be allowed to create duplicate games, hence mostRecentGameInstance.id will always equal 0.
						// but i already wrote the query and i want to re-use the code for something else, e.g. adding a new game instance

						var promises = [];
						sql5.values = [nextID, 0, req.body.datePurchased, req.body.language, req.body.title];
						promises.push(t.none(sql5));

						req.body.publishers.forEach((publisher) => {
							sql2.values = [publisher, req.body.title];
							promises.push(t.none(sql2));
						});

						req.body.genres.forEach((genre) => {
							sql3.values = [req.body.title, genre];
							promises.push(t.none(sql3));
						});

						return Promise.all(promises);
					});
			})
	})
		.then(() => {
			res.status(200)
				.json({
					status: 'success'
				});
		})
		.catch((error) => {
			console.error(error);
			res.status(500)
				.json({
					status: 'failure',
					detail: error.detail
				});
		});
});

module.exports = gamecreate;
