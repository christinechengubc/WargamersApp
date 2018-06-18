var execs = require('express').Router();
var db = require('../db');
var PQ = require('pg-promise').ParameterizedQuery;

execs.get('/', (req, res) => {
	var sql = 'SELECT * FROM execs';

  db.any(sql)
    .then((data) => {
      res.status(200)
        .json({
          status: 'ok',
					code: 200,
					messages: ['Retrieved all execs'],
          result: {
						games: data
					},
        });
    })
    .catch((err) => {
			console.error('Error ' + err.code + ' in endpoint: GET /execs\n' + err.message);
			console.error(err.stack);
			res.status(err.code)
				.json({
					status: 'error',
					code: err.code,
					messages: [err.message]
				});
		});
});

execs.post('/', (req, res) => {
  var sql = new PQ('INSERT INTO execs VALUES name = $1, position = $2, contact = $3');
  sql.values = [req.body.name, req.body.position, req.body.contact];

   db.any(sql)
    .then((data) => {
      res.status(200)
        .json({
          status: 'ok',
					code: 200,
					message: 'Created a new exec',
          result: {},
        });
    })
    .catch((err) => {
			console.error('Error ' + err.code + ' in endpoint: POST /execs\n' + err.message);
			console.error(err.stack);
			res.status(err.code)
				.json({
					status: 'error',
					code: err.code,
					message: err.message
				});
		});
});

execs.delete('/:id', (req, res) => {
  var sql = new PQ('DELETE FROM execs WHERE id = $1');
  sql.values = [req.params.id];

  db.none(sql)
		.then(() => {
	    res.status(200)
				.json({
					status: 'ok',
					code: 200,
					messages: ['Deleted exec with id: ' + req.params.id],
					result: {}
				});
		})
		.catch((err) => {
			console.error('Error ' + err.code + ' in endpoint: DEL /execs\n' + err.message);
			console.error(err.stack);
			res.status(err.code)
				.json({
					status: 'error',
					code: err.code,
					messages: [err.message]
				});
	  });
});


module.exports = execs;
