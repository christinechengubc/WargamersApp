var games = require('express').Router();
var db = require('../db');
var PQ = require('pg-promise').ParameterizedQuery;

games.get('/', (req, res) => {
	var sql = 'SELECT * FROM games';

  db.any(sql)
    .then((data) => {
      res.status(200)
        .json({
          status: 'ok',
					code: 200,
					message: 'Retrieved all games',
          result: {
						games: data
					},
        });
    })
    .catch((err) => {
			console.error('Error ' + err.code + ' in endpoint: GET /games\n' + err.message);
			console.error(err.stack);
			res.status(err.code)
				.json({
					status: 'error',
					code: err.code,
					message: err.message
				});
		});
});

games.get('/:id', (req, res) => {
  var sql = new PQ('SELECT * FROM games WHERE id = $1');
	sql.values = [req.params.id];

	db.one(sql)
	  .then((data) => {
	    res.status(200)
	      .json({
					status: 'ok',
					code: 200,
					message: 'Retrieved a game where id is: ' + req.params.id,
          result: {
						games: data
					},
	      });
	  })
	  .catch((err) => {
			console.error('Error ' + err.code + ' in endpoint: GET /games/:id\n' + err.message);
			console.error(err.stack);
			res.status(err.code)
				.json({
					status: 'error',
					code: err.code,
					message: err.message
				});
	  });
});

games.get('/:category', (req, res) => {
  var sql = new PQ('SELECT * FROM games WHERE category = $1');
	sql.values = [req.params.category];

	db.any(sql)
	  .then((data) => {
	    res.status(200)
	      .json({
					status: 'ok',
					code: 200,
					message: 'Retrieved a list of games where category is: ' + req.params.category,
          result: {
						games: data
					},
	      });
	  })
	  .catch((err) => {
			console.error('Error ' + err.code + ' in endpoint: GET /games/:category\n' + err.message);
			console.error(err.stack);
			res.status(err.code)
				.json({
					status: 'error',
					code: err.code,
					message: err.message
				});
	  });
});

games.get('/:partial_title', (req, res) => {
  var partial_title = req.params.partial_title.replace(/\'/g, "");
	var sql = new PQ('SELECT title FROM games WHERE title LIKE \'%$1%\'');
	sql.values = [partial_title];

	db.any(sql)
	  .then((data) => {
			res.status(200)
				.json({
					status: 'ok',
					code: 200,
					message: 'Retrieved a list of games where title has the following in any position: ' + partial_title,
					result: {
						games: data
					}
				});
	  })
	  .catch((err) => {
			console.error('Error ' + err.code + ' in endpoint: GET /games/:partial_title\n' + err.message);
			console.error(err.stack);
			res.status(err.code)
				.json({
					status: 'error',
					code: err.code,
					message: err.message
				});
	  });
});

games.post('/', (req, res) => {
	if (req.body.max_players < req.body.min_players) {
		return res.status(404).json({status: 'error', code: 404, message: "Bad Request: Max players is less than min players."});
	}
	if (req.body.max_playtime < req.body.min_playtime) {
		return res.status(404).json({status: 'error', code: 404, message: "Bad Request: Max playtime is less than min playtime."});
	}
	if (req.body.year_published > req.body.current_year) {
		return res.status(404).json({status: 'error', code: 404, message: "Bad Request: Year published is greater than current year."});
	}
	if (req.body.rating < 0 || req.body.rating > 10) {
		return res.status(404).json({status: 'error', code: 404, message: "Bad Request: Rating is not between 0 and 10."});
	}
	if (req.body.users_rated < 0) {
		return res.status(404).json({status: 'error', code: 404, message: "Bad Request: Users rated is below 0."});
	}
	if (req.body.available_copies < 0 || req.body.available_copies > req.body.total_copies) {
		return res.status(404).json({status: 'error', code: 404, message: "Bad Request: Available copies is below 0 or above total copies."});
	}
	if (req.body.bgg_id === null) {
		return res.status(404).json({status: 'error', code: 404, message: "Bad Request: bgg_id does not exist."});
	}
	if (req.body.show_main_page != 0 || req.body.show_main_page != 1) {
		return res.status(404).json({status: 'error', code: 404, message: "Bad Request: show_main_page is not 0 or 1."});
	}

	var sql = new PQ('INSERT INTO games ' +
	  'VALUES title = $1, publisher = $2, category = $3, min_players = $4, max_players = $5, min_playtime = $6, max_playtime = $7, year_published = $8, description = $9, ' +
		'image = $10, rating = $11, users_rated = $12, complexity = $13, available_copies = $14, total_copies = $15, condition = $16, expansion_of = $17, bgg_id = $18, ' +
		'show_main_page = $19 ');
  sql.values = [req.body.title, req.body.publisher, req.body.category, req.body.min_players, req.body.max_players, req.body.min_playtime,
		 						req.body.max_playtime, req.body.year_published, req.body.description, req.body.image, req.body.rating, req.body.users_rated, req.body.complexity,
								req.body.available_copies, req.body.total_copies, req.body.condition, req.body.expansion_of, req.body.bgg_id, req.body.show_main_page];

   db.any(sql)
    .then((data) => {
      res.status(200)
        .json({
          status: 'ok',
					code: 200,
					message: 'Created a new game',
          result: {},
        });
    })
    .catch((err) => {
			console.error('Error ' + err.code + ' in endpoint: POST /games\n' + err.message);
			console.error(err.stack);
			res.status(err.code)
				.json({
					status: 'error',
					code: err.code,
					message: err.message
				});
		});
});

games.put('/:id', (req, res) => {
	var sql = new PQ('UPDATE games ' +
	  'SET title = $2, publisher = $3, category = $4, min_players = $5, max_players = $6, min_playtime = $7, max_playtime = $8, year_published = $9, description = $10, ' +
		'image = $11, rating = $12, users_rated = $13, complexity = $14, available_copies = $15, total_copies = $16, condition = $17, expansion_of = $18, bgg_id = $19, ' +
		'show_main_page = $20 ' +
	  'WHERE id = $1');
  sql.values = [req.params.id, req.body.title, req.body.publisher, req.body.category, req.body.min_players, req.body.max_players, req.body.min_playtime,
		 						req.body.max_playtime, req.body.year_published, req.body.description, req.body.image, req.body.rating, req.body.users_rated, req.body.complexity,
								req.body.available_copies, req.body.total_copies, req.body.condition, req.body.expansion_of, req.body.bgg_id, req.body.show_main_page];

	db.none(sql)
		.then(() => {
			res.status(200)
				.json({
					status: 'ok',
					code: 200,
					message: 'Updated game with id: ' + req.params.id,
					result: {}
				});
		})
		.catch((err) => {
			console.error('Error ' + err.code + ' in endpoint: PUT /games\n' + err.message);
			console.error(err.stack);
			res.status(err.code)
				.json({
					status: 'error',
					code: err.code,
					message: err.message
				});
		});
});

games.delete('/:id', (req, res) => {
  var sql = new PQ('DELETE FROM games WHERE id = $1');
  sql.values = [req.params.id];

  db.none(sql)
		.then(() => {
	    res.status(200)
				.json({
					status: 'ok',
					code: 200,
					message: 'Deleted game with id: ' + req.params.id,
					result: {}
				});
		})
		.catch((err) => {
			console.error('Error ' + err.code + ' in endpoint: DEL /games\n' + err.message);
			console.error(err.stack);
			res.status(err.code)
				.json({
					status: 'error',
					code: err.code,
					message: err.message
				});
	  });
});

module.exports = games;
