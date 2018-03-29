var games = require('express').Router();
var db = require('../db');

var PQ = require('pg-promise').ParameterizedQuery;
var dh = require('./dataHandler');

games.get('/', (req, res) => {
	var sql = 'SELECT title, rating, description, name as publisher ' +
  'FROM games, publishedby, publishers ' +
  'WHERE games.title = publishedby.gameTitle AND publishers.name = publishedby.publisherName ' +
  'ORDER BY title';
  db.any(sql)
    .then(function (data) {
      //returns JSON with list of distinct titles and array of publishers in the publisher field
      var editedData = dh.mergeX(data,'publisher','title');

      res.status(200)
        .json({
          status: 'success',
          data: editedData,
          message: 'Retrieved ALL games'
        });
    })
    .catch(function (err) {
			console.error("Error when retrieving games " + err);
		});
});

games.get('/has-genre/:genre', (req, res) => {
  var genre = req.params.genre;
  var sql = 'SELECT gametitle FROM games, hasgenre WHERE gametitle = title AND genrename =' + genre;
db.any(sql)
  .then(function (data) {

    res.status(200)
      .json({
        status: 'success',
        data: data,
        message: 'Retrieved games with genre ' + genre
      });
  })
  .catch(function (err) {
    console.error("Error when retrieving games " + err);
  });
});

games.get('/title/:partTitle', (req, res) => {
  var partTitle = req.params.partTitle;
  partTitle = partTitle.replace(/\'/g, "");

var sql = 'SELECT title FROM games WHERE title LIKE \'%' + partTitle + '%\'';
db.any(sql)
  .then(function (data) {

    res.status(200)
      .json({
        status: 'success',
        data: data,
        message: 'Retrieved games with partial title ' + partTitle
      });
  })
  .catch(function (err) {
    console.log(sql);
    console.error("Error when retrieving games " + err);
  });
});

games.put('/edit', (req, res) => {
  var title = req.body.title;
  var rating = req.body.rating;
  var minPlayers = req.body.minPlayers;
  var maxPlayers = req.body.maxPlayers;
  var minPlaytime = req.body.minPlaytime;
  var maxPlaytime = req.body.maxPlaytime;
  var yearPublished = req.body.yearPublished;
  var description = req.body.description;
  var difficulty = req.body.difficulty;
  var sql = new PQ('UPDATE games ' +
    'SET title = $1, rating = $2, minPlayer = $3, maxPlayer = $4, minPlaytime = $5, maxPlaytime = $6, yearPublished = $7, description = $8, difficulty = $9 ' +
    'WHERE title = $1');
	var sql2 = new PQ('DELETE FROM PublishedBy WHERE gametitle = $1');
	var sql3 = new PQ('DELETE FROM HasGenre WHERE gametitle = $1');
	sql2.values = [req.body.title];
	sql3.values = [req.body.title];
	var sql4 = new PQ('INSERT INTO PublishedBy VALUES($1, $2)');
	var sql5 = new PQ('INSERT INTO HasGenre VALUES($1, $2)');
	// note that the column is called minPlayer and maxPlayer but we're passing parameters minPlayer and maxPlayers, fix this later
  sql.values = [title, rating, minPlayers, maxPlayers, minPlaytime, maxPlaytime, yearPublished, description,
    difficulty];

	db.task(t => {
		return t.none(sql)
			.then(() => {
				var deletePromises = [];
				deletePromises.push(t.none(sql2));
				deletePromises.push(t.none(sql3));

				return Promise.all(deletePromises).then(() => {
					var promises = [];
					req.body.publishers.forEach((publisher) => {
						sql4.values = [publisher, req.body.title];
						promises.push(t.none(sql4));
					});

					req.body.genres.forEach((genre) => {
						sql5.values = [req.body.title, genre];
						promises.push(t.none(sql5));
					});

					return Promise.all(promises);
				})
		})
	})
		.then(() => {
			res.status(200)
				.json({
					status: 'success',
					message: 'Updated game successfully '
				});
		})
		.catch((error) => {
			console.error(error);
			res.status(500)
				.json({
					status: 'failure',
					detail: error.detail
				});
		})
});

games.delete('/del/:title', (req, res) => {
  var title = req.params.title;
  console.log(title);
  var sql = new PQ('DELETE FROM games WHERE title = $1');
	// cascade will delete everything else
  sql.values = [title];
  db.none(sql).then(
    res.status(200)
      .json({
        status: 'success',
        message: 'Deleted game successfully'
      })
  ).catch(function(error){
    console.error("Error deleting: " + error);
		res.status(500)
			.json({
				status: 'failure',
				detail: error.detail
			});
  })
});

module.exports = games;
