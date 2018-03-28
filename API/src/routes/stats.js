var stats = require('express').Router();
var db = require('../db');


stats.get('/game/:rating', (req, res) => {
  var aggregation = 'MAX';
  if (req.params.rating === 'lowest') {
    aggregation = 'MIN';
  }
  var sql = 'SELECT title, rating, description ' +
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

/**
 * it should do a query where it finds all the events with the same name,
 * takes an average of the members attending each of these events,
 * and then return the event with the max/min average attendees
 */
stats.get('/event/:attendance', (req, res) => {
  var aggregation = 'MAX';
  if (req.params.attendance === 'lowest') {
    aggregation = 'MIN';
  }
  var sql1 = 'SELECT name, COUNT(a) as attendees ' +
    'FROM events e, attends a ' +
    'WHERE a.eventName = e.name ' + ' AND a.eventDate = e.date ' +
    'GROUP BY e.name, e.date ';
  var sql2 = 'SELECT c.name, AVG(c.attendees) as avg' +
    ' FROM (' +sql1 + ') c ' +
    'GROUP BY c.name';
  var sql3 = '(SELECT ' + aggregation + '(x.avg) as max' +
  ' FROM (' + sql2 + ') x)';
  var sql = 'SELECT y.name, y.avg' +
            ' FROM (' + sql2 + ') y,  ' + sql3 + ' z' +
            ' WHERE y.avg = z.max';

  console.log(sql);

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
