var executives = require('express').Router();
var db = require('../db');
var PQ = require('pg-promise').ParameterizedQuery;

executives.get('/', (req, res) => {
	var sql = 'SELECT * FROM executives';

  db.many(sql)
    .then((data) => {
      res.status(200)
        .json({
          status: 'ok',
					code: 200,
					message: 'Retrieved all executives',
          result: {
						executives: data
					},
        });
    })
    .catch((err) => {
			console.error('\n[ERROR]: GET /executives\n');
			console.error(err);
			res.status(500)
				.json({
					status: 'error',
					code: 500,
					message: err.message
				});
		});
});

executives.post('/', (req, res) => {
  var sql = new PQ('INSERT INTO executives (name, position, phone, email) VALUES ($1, $2, $3, $4)');
  sql.values = [req.body.name, req.body.position, req.body.phone, req.body.email];

   db.none(sql)
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
			console.error('\n[ERROR]: POST /executives\n');
			console.error(err);
			res.status(500)
				.json({
					status: 'error',
					code: 500,
					message: err.message
				});
		});
});

executives.delete('/:id', (req, res) => {
  var sql = new PQ('DELETE FROM executives WHERE id = $1');
  sql.values = [req.params.id];

  db.none(sql)
		.then(() => {
	    res.status(200)
				.json({
					status: 'ok',
					code: 200,
					message: 'Deleted exec with id: ' + req.params.id,
					result: {}
				});
		})
		.catch((err) => {
			console.error('\n[ERROR]: DEL /executives\n');
			console.error(err);
			res.status(500)
				.json({
					status: 'error',
					code: 500,
					message: err.message
				});
	  });
});


module.exports = executives;
