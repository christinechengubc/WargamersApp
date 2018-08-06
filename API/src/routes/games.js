var games = require('express').Router();
var db = require('../db');
var PQ = require('pg-promise').ParameterizedQuery;
var jwt = require('jsonwebtoken');
var secret = require('./secret');



games.get('/', (req, res) => {
	var sql = 'SELECT * FROM games WHERE show_main_page = TRUE LIMIT 10';

  db.many(sql)
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
			console.error('\n[ERROR]: GET /games\n');
			console.error(err);
			res.status(500)
				.json({
					status: 'error',
					code: 500,
					message: err.message
				});
		});
});

// games.get('/:id', (req, res) => {
//   var sql = new PQ('SELECT * FROM games WHERE id = $1');
// 	sql.values = [req.params.id];
//
// 	db.one(sql)
// 	  .then((data) => {
// 	    res.status(200)
// 	      .json({
// 					status: 'ok',
// 					code: 200,
// 					message: 'Retrieved a game with id: ' + req.params.id,
//           result: {
// 						game: data
// 					},
// 	      });
// 	  })
// 	  .catch((err) => {
// 			console.error('\n[ERROR]: GET /games/:id\n');
// 			console.error(err);
// 			res.status(500)
// 				.json({
// 					status: 'error',
// 					code: 500,
// 					message: err.message
// 				});
// 	  });
// });
//
// games.get('/?category=:category', (req, res) => {
//   var sql = new PQ('SELECT * FROM games WHERE category = $1');
// 	sql.values = [req.params.category];
//
// 	db.many(sql)
// 	  .then((data) => {
// 	    res.status(200)
// 	      .json({
// 					status: 'ok',
// 					code: 200,
// 					message: 'Retrieved games with category: ' + req.params.category,
//           result: {
// 						games: data
// 					},
// 	      });
// 	  })
// 	  .catch((err) => {
// 			console.error('\n[ERROR]: GET /games/:category\n');
// 			console.error(err);
// 			res.status(500)
// 				.json({
// 					status: 'error',
// 					code: 500,
// 					message: err.message
// 				});
// 	  });
// });
//
// games.get('/?partial_title=:partial_title', (req, res) => {
//   var partial_title = req.params.partial_title.replace(/\'/g, "");
// 	var sql = new PQ('SELECT title FROM games WHERE title LIKE \'%$1%\'');
// 	sql.values = [partial_title];
//
// 	db.many(sql)
// 	  .then((data) => {
// 			res.status(200)
// 				.json({
// 					status: 'ok',
// 					code: 200,
// 					message: 'Retrieved games with partial_title: ' + partial_title,
// 					result: {
// 						games: data
// 					}
// 				});
// 	  })
// 	  .catch((err) => {
// 			console.error('\n[ERROR]: GET /games/:partial_title\n');
// 			console.error(err);
// 			res.status(500)
// 				.json({
// 					status: 'error',
// 					code: 500,
// 					message: err.message
// 				});
// 	  });
// });


/*token verification (put in here instead of index.js as the '/games' path had to be split
  based on the verb being used, rather than just the path.
  The same code is copied in events.
*/
games.use((req,res,next) => {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

if (token) {

  jwt.verify(token, secret.secret, function(err, decoded) {

    if (err) {return res.status(403)
      .json({
        message: "not logged in"
      })
    }

    else {
      //save decoded token for use elsewhere
      req.decoded = decoded;
      next();
    }


  });
} else {
  return res.status(403)
    .json({
      message: "not logged in"
    });
}
});


games.post('/', (req, res) => {
	if (Number(req.body.max_players) < Number(req.body.min_players)) {
	 return res.status(400).json({status: 'error', code: 400, message: "Bad Request: max_players < min_players."});
	}
	if (Number(req.body.max_playtime) < Number(req.body.min_playtime)) {
	 return res.status(400).json({status: 'error', code: 400, message: "Bad Request: max_playtime < min_playtime."});
	}
	if (Number(req.body.year_published) > Number(req.body.current_year)) {
	 return res.status(400).json({status: 'error', code: 400, message: "Bad Request: year_published > current_year."});
	}
	if (req.body.rating < 0) {
	 return res.status(400).json({status: 'error', code: 400, message: "Bad Request: rating < 0."});
	}
	if (req.body.rating > 10) {
	 return res.status(400).json({status: 'error', code: 400, message: "Bad Request: rating > 0."});
	}
	if (req.body.users_rated < 0) {
	 return res.status(400).json({status: 'error', code: 400, message: "Bad Request: users_rated < 0."});
	}
	if (req.body.available_copies < 0) {
	 return res.status(400).json({status: 'error', code: 400, message: "Bad Request: available_copies < 0."});
	}
	if (req.body.total_copies < 0) {
	 return res.status(400).json({status: 'error', code: 400, message: "Bad Request: total_copies < 0."});
	}
	if (Number(req.body.available_copies) > Number(req.body.total_copies)) {
	 return res.status(400).json({status: 'error', code: 400, message: "Bad Request: available_copies >  total_copies."});
	}
	if (req.body.bgg_id === undefined) {
	 return res.status(400).json({status: 'error', code: 400, message: "Bad Request: bgg_id is undefined."});
	}
	if (req.body.show_main_page != "true" && req.body.show_main_page != "false") {
	 return res.status(400).json({status: 'error', code: 400, message: "Bad Request: show_main_page is not true or false."});
	}
	var sql = new PQ('INSERT INTO games (title, category, min_players, max_players, min_playtime, max_playtime, year_published, description, ' +
		'image, rating, users_rated, complexity, available_copies, total_copies, condition, expansion_of, bgg_id, show_main_page) ' +
	  'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)');
  sql.values = [req.body.title, req.body.category, req.body.min_players, req.body.max_players, req.body.min_playtime,
		 						req.body.max_playtime, req.body.year_published, req.body.description, req.body.image, req.body.rating, req.body.users_rated, req.body.complexity,
								req.body.available_copies, req.body.total_copies, req.body.condition, req.body.expansion_of, req.body.bgg_id, req.body.show_main_page];

   db.none(sql)
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
			console.error('\n[ERROR]: POST /games\n');
			console.error(err);
			res.status(500)
				.json({
					status: 'error',
					code: 500,
					message: err.message
				});
		});
});

games.put('/:id', (req, res) => {
	var sql = new PQ('UPDATE games ' +
	  'SET title = $2, category = $3, min_players = $4, max_players = $5, min_playtime = $6, max_playtime = $7, year_published = $8, description = $9, ' +
		'image = $10, rating = $11, users_rated = $12, complexity = $13, available_copies = $14, total_copies = $15, condition = $16, expansion_of = $17, bgg_id = $18, '+
		'show_main_page = $19, thumbnail = $20' + 'WHERE id = $1');
  sql.values = [req.params.id, req.body.title, req.body.category, req.body.min_players, req.body.max_players, req.body.min_playtime,
		 						req.body.max_playtime, req.body.year_published, req.body.description, req.body.image, req.body.rating, req.body.users_rated, req.body.complexity,
								req.body.available_copies, req.body.total_copies, req.body.condition, req.body.expansion_of, req.body.bgg_id, req.body.show_main_page,
							  req.body.thumbnail];
  console.log("in games.put!");
	db.none(sql)
		.then((data) => {

			res.status(200)
				.json({
					status: 'ok',
					code: 200,
					message: 'Updated game with id: ' + req.params.id,
					result: {}
				});
		})
		.catch((err) => {
			console.error('\n[ERROR]: PUT /games\n');
			console.error(err);
			res.status(500)
				.json({
					status: 'error',
					code: 500,
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
			console.error('\n[ERROR]: DEL /games/:id\n');
			console.error(err);
			res.status(500)
				.json({
					status: 'error',
					code: 500,
					message: err.message
				});
	  });
});

module.exports = games;
