var admins = require('express').Router();
var db = require('../db');
var PQ = require('pg-promise').ParameterizedQuery;
var bcrypt = require('bcrypt');

const saltRounds = 10;

admins.post('/', (req, res) => {

  bcrypt.hash(req.body.password, saltRounds, function(err,hash) {

  var sql = new PQ('INSERT INTO app_admins (email, hash) VALUES ($1, $2)');

  sql.values = [req.body.email, hash];


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
        console.error('\n[ERROR]: POST /admins\n');
        console.error(err);
        res.status(500)
          .json({
            status: 'error',
            code: 500,
            message: err.message
          });
      });
  });
});


admins.delete('/:id', (req, res) => {
  var sql = new PQ('DELETE FROM app_admins WHERE id = $1');
  sql.values = [req.params.id];

  db.none(sql)
		.then(() => {
	    res.status(200)
				.json({
					status: 'ok',
					code: 200,
					message: 'Deleted admin with id: ' + req.params.id,
					result: {}
				});
		})
		.catch((err) => {
			console.error('\n[ERROR]: GET /admins/:id\n');
			console.error(err);
			res.status(500)
				.json({
					status: 'error',
					code: 500,
					message: err.message
				});
	  });
});


module.exports = admins;
