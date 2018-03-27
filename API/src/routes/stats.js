var stats = require('express').Router();
var db = require('../db');


stats.get('/game/:rating', (req, res) => {
  var aggregation = 'MAX';
  if (req.params.rating === 'lowest') {
    aggregation = 'MIN';
  }
  var sql = 'SELECT title, rating ' +
            'FROM games WHERE rating = ' +
            '( SELECT ' + aggregation + '(g.rating) FROM games g)';
  db.any(sql)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved info'
        });
    })
    .catch(function (err) {
      console.error("Error when retrieving game info " + err);
    });
});

stats.get('/event/:attendance', (req, res) => {
  var aggregation = 'MAX';
  if (req.params.rating === 'lowest') {
    aggregation = 'MIN';
  }
  var sql = 'SELECT name ' +
            'FROM events';
  db.any(sql)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved info'
        });
    })
    .catch(function (err) {
      console.error("Error when retrieving game info " + err);
    });
});

module.exports = stats;
