var games = require('express').Router();
var db = require('../db');
var dh = require('./dataHandler');


games.get('/', (req, res) => {
	var sql = 'SELECT title, rating, name as publisher ' +
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


module.exports = games;
