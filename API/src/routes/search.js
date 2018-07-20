var search = require('express').Router();
var db = require('../db');
var PQ = require('pg-promise').ParameterizedQuery;

search.post('/basic', (req, res) => {
  var available = '';
  if (req.body.available) {available = 'AND available_copies > 0';}
  var sql = new PQ("SELECT * FROM Games WHERE lower(title) LIKE lower($1) " + available);
  sql.values = ['%' + req.body.title + '%'];

  console.log(sql);

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
      console.error("Error when retrieving search: " + err);
    });
});

/**
 * title, minPlayer, maxPlayer minPlayTime, maxPlayTime, difficulty
 * passed: publisher, rating, description
 * req.body.projectpublisher, projectrating, projectdescription = TRUE /FALSE
 */
search.post('/advanced', (req, res) => {
  var title, publisher, category, description, min_players, min_playtime, rating, max_players, max_platyime, complexity, available, condition, year_published;
  title = publisher = category = description = condition = '%%';
  min_players = min_playtime = rating = 0;
  max_players = max_playtime = complexity = 10000;
  available = '';

  if (req.body.title) {title = '%' + req.body.title + '%';}
  if (req.body.min_players) {min_players = req.body.min_players;}
  if (req.body.max_players) {max_players = req.body.max_players;}
  if (req.body.min_playtime) {min_playtime = req.body.min_playtime;}
  if (req.body.max_playtime) {max_playtime = req.body.max_playtime;}
  if (req.body.publisher) {publisher = '%' + req.body.publisher + '%';}
  if (req.body.category) {category = '%' + req.body.category + '%';}
  if (req.body.rating) {rating = req.body.rating;}
  if (req.body.description) {description = '%' + req.body.description + '%';}
  if (req.body.complexity) {complexity = req.body.complexity;}
  if (req.body.condition) {condition = req.body.condition;}
  if (req.body.available) {available = ' AND available_copies > 0';}
  if (req.body.year_published) {year_published = req.body.year_published;}

  if (req.body.year_published == undefined || req.body.year_published == "") {
    var sql = new PQ("SELECT * FROM Games WHERE lower(title) LIKE lower($1) AND max_players >= $2 AND max_players <= $3" +
                      " AND max_playtime >= $4 AND max_playtime <= $5 AND lower(publisher) LIKE lower($6) AND lower(category) LIKE lower($7)" +
                      " AND rating >= $8 AND lower(description) LIKE lower($9) AND complexity <= $10 AND condition LIKE $11" + available + " LIMIT 20");
    sql.values = [title, min_players, max_players, min_playtime, max_playtime, publisher, category, rating, description, complexity, condition];
  } else {
    var sql = new PQ("SELECT * FROM Games WHERE lower(title) LIKE lower($1) AND max_players >= $2 AND max_players <= $3" +
                      " AND max_playtime >= $4 AND max_playtime <= $5 AND lower(publisher) LIKE lower($6) AND lower(category) LIKE lower($7)" +
                      " AND rating >= $8 AND lower(description) LIKE lower($9) AND complexity <= $10 AND condition LIKE $11 AND year_published = $12" + available);
    sql.values = [title, min_players, max_players, min_playtime, max_playtime, publisher, category, rating, description, complexity, condition, year_published];
  }

  console.log(sql);

  db.any(sql)
    .then(function (data) {
      console.log(data)
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
      console.error("Error when retrieving search: " + err);
    });
});


module.exports = search;
