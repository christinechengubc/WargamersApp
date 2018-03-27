var stats = require('express').Router();
var db = require('../db');


stats.get('/game/:rating', (req, res) => {
  var aggregation = 'MAX';
  if (req.params.rating === 'lowest') {
    aggregation = 'MIN';
  }
  var sql = 'SELECT title, rating ' +
    'FROM game WHERE rating = ' +
    '( SELECT ' + aggregation + '(g.rating) FROM game g)';
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

/*stats.get('/event/:attendance', (req, res) => {
  var aggregation = 'MAX';
  if (req.params.rating === 'lowest') {
    aggregation = 'MIN';
  }
  var sql = 'SELECT name ' +
            'FROM event';
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
});*/


/**
 * it should do a query where it finds all the events with the same name,
 * takes an average of the members attending each of these events,
 * and then return the event with the max/min average attendees
 */
stats.get('/event/:attendance', (req, res) => {
  var aggregation = 'MAX';
  if (req.params.rating === 'lowest') {
    aggregation = 'MIN';
  }
  var sql = 'SELECT name, date, COUNT(a) as attendees ' +
    'FROM event e, attends a ' +
    'WHERE a.eventName = e.name ' + ' AND a.eventDate = e.date ' +
    'GROUP BY e.name, e.date ';
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
