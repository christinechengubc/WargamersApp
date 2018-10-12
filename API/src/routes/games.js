var games = require('express').Router();
var db = require('../db');
var PQ = require('pg-promise').ParameterizedQuery;
var noDataError = require('pg-promise').errors.queryResultErrorCode.noData;
var jwt = require('jsonwebtoken');
var secret;
try {
  secret = require('./secret');
} catch (err) {
  secret = process.env.SECRET_KEY;
}
var imageCompressor = require('../imageCompressor');

var LIMIT = 5;

games.get('/:page', (req, res) => {
  let page = req.params.page;
  let offset = LIMIT * page;

	var sql = new PQ('SELECT * FROM games ORDER BY id ASC LIMIT $1 OFFSET $2');
	sql.values = [LIMIT, offset];

  db.many(sql)
    .then((data) => {
      res.status(200)
        .json({
          status: 'ok',
					code: 200,
					message: 'Retrieved games from page: ' + page,
          result: {
						games: data
					},
        });
    })
    .catch((err) => {
      if (err.code === noDataError) {
        return res.status(200)
          .json({
            status: 'ok',
            code: 204,
            message: 'Retrieved no games from page: ' + page,
            result: {
              games: []
            },
          });
      }
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

/*token verification (put in here instead of index.js as the '/games' path had to be split
  based on the verb being used, rather than just the path.
  The same code is copied in events.
*/

games.use((req,res,next) => {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

if (token) {
  jwt.verify(token, secret, function(err, decoded) {
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


games.post('/', async (req, res) => {
	if (Number(req.body.max_players) < Number(req.body.min_players)) {
	 return res.status(400).json({status: 'error', code: 400, message: "Bad Request: max_players < min_players."});
	}
	if (Number(req.body.max_playtime) < Number(req.body.min_playtime)) {
	 return res.status(400).json({status: 'error', code: 400, message: "Bad Request: max_playtime < min_playtime."});
	}
	if (Number(req.body.year_published) > Number(req.body.current_year)) {
	 return res.status(400).json({status: 'error', code: 400, message: "Bad Request: year_published > current_year."});
	}
  if (Number(req.body.available_copies) > Number(req.body.total_copies)) {
    return res.status(400).json({status: 'error', code: 400, message: "Bad Request: available_copies >  total_copies."});
  }
	if (req.body.rating < 0) {
	 return res.status(400).json({status: 'error', code: 400, message: "Bad Request: rating < 0."});
	}
	if (req.body.rating > 10) {
	 return res.status(400).json({status: 'error', code: 400, message: "Bad Request: rating > 10."});
	}
  if (req.body.complexity < 0) {
    return res.status(400).json({status: 'error', code: 400, message: "Bad Request: complexity < 0."});
  }
  if (req.body.complexity > 5) {
    return res.status(400).json({status: 'error', code: 400, message: "Bad Request: complexity > 5."});
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
	if (req.body.bgg_id === undefined) {
	 return res.status(400).json({status: 'error', code: 400, message: "Bad Request: bgg_id is undefined."});
	}
	if (req.body.show_main_page !== "true" && req.body.show_main_page !== "false") {
	 return res.status(400).json({status: 'error', code: 400, message: "Bad Request: show_main_page is not true or false."});
	}
	var sql = new PQ('INSERT INTO games (title, category, min_players, max_players, min_playtime, max_playtime, year_published, description, ' +
		'image, rating, users_rated, complexity, available_copies, total_copies, condition, expansion_of, bgg_id, show_main_page, thumbnail) ' +
	  'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19) RETURNING id');
  if (req.body.image !== "") {
    try {
      req.body.image = await imageCompressor.compress(req.body.image)
    } catch (err) {
      console.error("Could not compress and upload image.");
      res.status(500).json({status: 'error', code: 500, message: err.message});
      return;
    }
  }
  sql.values = [req.body.title, req.body.category, req.body.min_players, req.body.max_players, req.body.min_playtime,
		 						req.body.max_playtime, req.body.year_published, req.body.description, req.body.image, req.body.rating, req.body.users_rated, req.body.complexity,
								req.body.available_copies, req.body.total_copies, req.body.condition, req.body.expansion_of, req.body.bgg_id, req.body.show_main_page, req.body.thumbnail];

   db.one(sql)
    .then((data) => {
      res.status(200)
        .json({
          status: 'ok',
					code: 200,
					message: 'Created a new game',
          result: {
            game_id: data.id
          },
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

games.put('/:id', async (req, res) => {
	var sql = new PQ('UPDATE games ' +
	  'SET title = $2, category = $3, min_players = $4, max_players = $5, min_playtime = $6, max_playtime = $7, year_published = $8, description = $9, ' +
		'image = $10, rating = $11, users_rated = $12, complexity = $13, available_copies = $14, total_copies = $15, condition = $16, expansion_of = $17, bgg_id = $18, '+
		'show_main_page = $19, thumbnail = $20' + 'WHERE id = $1');
  if (req.body.image !== "") {
    try {
      req.body.image = await imageCompressor.compress(req.body.image)
    } catch (err) {
      console.error("Could not compress and upload image.");
      res.status(500).json({status: 'error', code: 500, message: err.message});
      return;
    }
  }
  sql.values = [req.params.id, req.body.title, req.body.category, req.body.min_players, req.body.max_players, req.body.min_playtime,
		 						req.body.max_playtime, req.body.year_published, req.body.description, req.body.image, req.body.rating, req.body.users_rated, req.body.complexity,
								req.body.available_copies, req.body.total_copies, req.body.condition, req.body.expansion_of, req.body.bgg_id, req.body.show_main_page,
							  req.body.thumbnail];
	db.result(sql)
		.then((r) => {
			res.status(200)
				.json({
					status: 'ok',
					code: 200,
					message: 'Updated game with id: ' + req.params.id,
					result: {
					  game_count: r.rowCount
          }
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

games.post('/compressAllImages', async (req, res) => {
  var getSql = new PQ('SELECT * FROM games');

  db.many(getSql)
    .then(async (data) => {
      for (let game of data) {
        let imageCompressedURL = await imageCompressor.compress(game.image).catch((err) => { console.log("Could not upload image of game with id: " + game.id) });
        var putSql = new PQ('UPDATE games SET image = $1 WHERE id = $2');
        putSql.values = [imageCompressedURL, game.id];

        db.result(putSql)
          .then(() => {
          })
          .catch((err) => {
            console.error('\n[ERROR]: PUT /games\n');
            console.error(err);
            return res.status(500)
              .json({
                status: 'error',
                code: 500,
                message: err.message
              });
          });
      }

      res.status(200)
        .json({
          status: 'ok',
          code: 200,
          message: 'Compressed all images and updated games.',
          result: {}
        });
    })
    .catch((err) => {
      console.error('\n[ERROR]: GET /games\n');
      console.error(err);
      return res.status(500)
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

  var getSql = new PQ('SELECT image FROM games WHERE id = $1');
  getSql.values = [req.params.id];
  db.one(getSql)
    .then((data) => {
      db.result(sql)
        .then(async (r) => {
          if (data.image !== "") {
            await imageCompressor.deleteCompressed(data.image);
          }
          res.status(200)
            .json({
              status: 'ok',
              code: 200,
              message: 'Deleted game with id: ' + req.params.id,
              result: {
                game_count: r.rowCount
              }
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

module.exports = games;
