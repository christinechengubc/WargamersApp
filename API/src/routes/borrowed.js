var games = require('express').Router();
var db = require('../db');
var PQ = require('pg-promise').ParameterizedQuery;
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

games.put('/edit', (req, res) => {
  var title = req.body.title;
  var rating = req.body.rating;
  var minPlayer = req.body.minPlayer;
  var maxPlayer = req.body.maxPlayer;
  var minPlayTime = req.body.minPlayTime;
  var maxPlayTime = req.body.maxPlayTime;
  var yearPublished = req.body.yearPublished;
  var description = req.body.description;
  var difficulty = req.body.difficulty;
  var sql = new PQ('UPDATE games ' +
    'SET title = $1, rating = $2, minPlayer = $3, maxPlayer = $4, minPlayTime = $5, maxPlayTime = $6, ' +
    'yearPublished = $7, description = $8, difficulty = $9 ' +
    'WHERE title = $1');
  sql.values = [title, rating, minPlayer, maxPlayer, minPlayTime, maxPlayTime, yearPublished, description,
    difficulty];
  db.none(sql).then(
    res.status(200)
      .json({
        status: 'success',
        message: 'Updated game successfully '
      })
  ).catch(function (err){
    console.error("Error updating " + err);
  });
});

games.delete('/del/:title', (req, res) => {
  var title = req.params.title;
  console.log(title);
  var sql = new PQ('DELETE FROM games WHERE title = $1');
  sql.values = [title];
  db.none(sql).then(
    res.status(200)
      .json({
        status: 'success',
        message: 'Deleted game successfully'
      })
  ).catch(function(err){
    console.error("Error deleting: " + err);
  })
});

module.exports = games;
