var gamecreate = require('express').Router();
var db = require('../db');


gamecreate.get('/genre', (req, res) => {
	var sql = 'SELECT genre.name ' +
  'FROM genre ' +
  'ORDER BY genre.name';
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
	var sql = 'SELECT publisher.name ' +
  'FROM publisher ' +
  'ORDER BY publisher.name';
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

module.exports = gamecreate;
