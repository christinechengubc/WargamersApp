var search = require('express').Router();
var db = require('../db');
var PQ = require('pg-promise').ParameterizedQuery;

var LIMIT = 30;

search.post('/basic/:page', (req, res) => {
  var available = '';
  if (req.body.available) {available = 'AND available_copies > 0';}
  let page = req.params.page;
  let offset = LIMIT * page;
  var sql = new PQ("SELECT * FROM Games WHERE lower(title) LIKE lower($1) " + available + "ORDER BY id ASC LIMIT $2 OFFSET $3");
  sql.values = ['%' + req.body.title + '%', LIMIT, offset];

  db.any(sql)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'ok',
          code: 200,
          message: 'Retrieved results for basic search',
          result: {
            games: data
          },
        });
    })
    .catch(function (err) {
      console.error('\n[ERROR]: POST /search/basic\n');
      console.error(err);
      res.status(500)
        .json({
          status: 'error',
          code: 500,
          message: err.message
        });
    });
});

/**
 * title, minPlayer, maxPlayer minPlayTime, maxPlayTime, difficulty
 * passed: rating, description
 * projectrating, projectdescription = TRUE /FALSE
 */
search.post('/advanced/:page', (req, res) => {
  var title, category, description, min_players, min_playtime, rating, max_players, max_platyime, complexity, available, condition, year_published;
  title = category = description = condition = '%%';
  min_players = min_playtime = rating = 0;
  max_players = max_playtime = complexity = 10000;
  available = '';

  if (req.body.title) {title = '%' + req.body.title + '%';}
  if (req.body.min_players) {min_players = req.body.min_players;}
  if (req.body.max_players) {max_players = req.body.max_players;}
  if (req.body.min_playtime) {min_playtime = req.body.min_playtime;}
  if (req.body.max_playtime) {max_playtime = req.body.max_playtime;}
  if (req.body.category) {category = '%' + req.body.category + '%';}
  if (req.body.rating) {rating = req.body.rating;}
  if (req.body.description) {description = '%' + req.body.description + '%';}
  if (req.body.complexity) {complexity = req.body.complexity;}
  if (req.body.condition) {condition = req.body.condition;}
  if (req.body.available) {available = ' AND available_copies > 0';}
  if (req.body.year_published) {year_published = req.body.year_published;}

  let page = req.params.page;
  let offset = LIMIT * page;

  if (req.body.year_published == null || req.body.year_published === "") {
    var sql = new PQ("SELECT * FROM Games WHERE lower(title) LIKE lower($1) AND max_players >= $2 AND max_players <= $3" +
                      " AND max_playtime >= $4 AND max_playtime <= $5 AND lower(category) LIKE lower($6)" +
                      " AND rating >= $7 AND lower(description) LIKE lower($8) AND complexity <= $9 AND condition LIKE $10" + available + "ORDER BY id ASC LIMIT $11 OFFSET $12");
    sql.values = [title, min_players, max_players, min_playtime, max_playtime, category, rating, description, complexity, condition, LIMIT, offset];
  } else {
    var sql = new PQ("SELECT * FROM Games WHERE lower(title) LIKE lower($1) AND max_players >= $2 AND max_players <= $3" +
                      " AND max_playtime >= $4 AND max_playtime <= $5 AND lower(category) LIKE lower($6)" +
                      " AND rating >= $7 AND lower(description) LIKE lower($8) AND complexity <= $9 AND condition LIKE $10 AND year_published = $11" + available + "ORDER BY id ASC LIMIT $12 OFFSET $13");
    sql.values = [title, min_players, max_players, min_playtime, max_playtime, category, rating, description, complexity, condition, year_published, LIMIT, offset];
  }

  db.any(sql)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'ok',
          code: 200,
          message: 'Retrieved results for advanced search',
          result: {
            games: data
          },
        });
    })
    .catch(function (err) {
      console.error('\n[ERROR]: POST /search/advanced\n');
      console.error(err);
      res.status(500)
        .json({
          status: 'error',
          code: 500,
          message: err.message
        });
    });
});


module.exports = search;
