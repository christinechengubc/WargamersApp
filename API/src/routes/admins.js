var admins = require('express').Router();
var db = require('../db');
var PQ = require('pg-promise').ParameterizedQuery;

admins.get('/', (req, res) => {
	var sql = 'SELECT * FROM admins';

  db.any(sql)
    .then((data) => {
      res.status(200)
        .json({
          status: 'ok',
					code: 200,
					messages: ['Retrieved all admins'],
          result: {
						games: data
					},
        });
    })
    .catch((err) => {
			console.error('Error ' + err.code + ' in endpoint: GET /admins\n' + err.message);
			console.error(err.stack);
			res.status(err.code)
				.json({
					status: 'error',
					code: err.code,
					messages: [err.message]
				});
		});
});

admins.post('/', (req, res) => {
  var sql = new PQ('INSERT INTO execs VALUES username = $1, password = $2');
  sql.values = [req.body.username, req.body.password];

   db.any(sql)
    .then((data) => {
      res.status(200)
        .json({
          status: 'ok',
					code: 200,
					message: 'Created a new admin',
          result: {},
        });
    })
    .catch((err) => {
			console.error('Error ' + err.code + ' in endpoint: POST /admins\n' + err.message);
			console.error(err.stack);
			res.status(err.code)
				.json({
					status: 'error',
					code: err.code,
					message: err.message
				});
		});
});


admins.delete('/:id', (req, res) => {
  var sql = new PQ('DELETE FROM admins WHERE id = $1');
  sql.values = [req.params.id];

  db.none(sql)
		.then(() => {
	    res.status(200)
				.json({
					status: 'ok',
					code: 200,
					messages: ['Deleted admin with id: ' + req.params.id],
					result: {}
				});
		})
		.catch((err) => {
			console.error('Error ' + err.code + ' in endpoint: DEL /admins\n' + err.message);
			console.error(err.stack);
			res.status(err.code)
				.json({
					status: 'error',
					code: err.code,
					messages: [err.message]
				});
	  });
});


module.exports = admins;
