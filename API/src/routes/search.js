var search = require('express').Router();
var db = require('../db');
var dh = require('./dataHandler');



search.post('/genre', (req, res) => {
  var genre = req.body.genre;
  var where = '';
  var publisher = '';
  var rating = '';
  var description = '';
  if (req.body.projectpublisher) {publisher = 'publishername AS publisher, ';}
  if (req.body.projectrating) {rating = 'g.rating, ';}
  if (req.body.projectdescription) {description = 'g.description, ';}
  var sql = 'SELECT ' + publisher + rating + description + 'hg.gametitle as title FROM games g LEFT JOIN publishedBy p ON g.title = p.gameTitle, hasgenre hg ' +
    'WHERE HG.gametitle = title AND lower(hg.genrename) LIKE lower(\'%'+genre+'%\')';

  db.any(sql)
    .then(function (data) {
      if (publisher !== NULL){
        var editedData = dh.mergeX(data,'publisher','title');
      }
      res.status(200)
        .json({
          status: 'success',
          data: editedData,
          message: 'Retrieved search for genre'
        });
    })
    .catch(function (err) {
      console.error("Error when retrieving search " + err);
    });
});

search.post('/publisher', (req, res) => {
  var where = '';
  var publisher = '';
  var rating = '';
  var description = '';
  if (req.body.projectpublisher) {publisher = 'pb2.publishername AS publisher, ';}
  if (req.body.projectrating) {rating = 'g.rating, ';}
  if (req.body.projectdescription) {description = 'g.description, ';}
  if (req.body.publisher) where += ' AND lower(p.name) LIKE lower(\'%' + req.body.publisher + '%\')';
  if (req.body.country) where += ' AND lower(p.country) LIKE lower(\'%' + req.body.country + '%\')';



  var sql = 'SELECT ' + publisher + rating + description + 'g.title' +
    ' FROM games g LEFT JOIN publishedby pb2 ON g.title = pb2.gametitle, publishers p, publishedby pb ' +
    'WHERE g.title = pb.gametitle AND pb.publishername = p.name ' + where;


  db.any(sql)
    .then(function (data) {
      if (publisher !== NULL){
        var editedData = dh.mergeX(data,'publisher','title');
      }
      res.status(200)
        .json({
          status: 'success',
          data: editedData,
          message: 'Retrieved search for publisher'
        });
    })
    .catch(function (err) {
      console.error("Error when retrieving search " + err);
    });
});

/**
 * title, minPlayer, maxPlayer minPlayTime, maxPlayTime, difficulty
 * passed: publisher, rating, description
 * req.body.projectpublisher, projectrating, projectdescription = TRUE /FALSE
 */
search.post('/game', (req, res) => {
  var where = '';
  var publisher = '';
  var rating = '';
  var description = '';
  if (req.body.projectpublisher) {publisher = 'publishername AS publisher, ';}
  if (req.body.projectrating) {rating = 'rating, ';}
  if (req.body.projectdescription) {description = 'description, ';}
  if (req.body.title) where += ' AND lower(title) LIKE lower(\'%' + req.body.title + '%\')';
  if (req.body.minPlayer) where += ' AND minPlayer =' + req.body.minPlayer;
  if (req.body.maxPlayer) where += ' AND maxPlayer =' + req.body.maxPlayer;
  if (req.body.minPlaytime) where += ' AND minPlaytime =' + req.body.minPlaytime;
  if (req.body.maxPlaytime) where += ' AND maxPlaytime =' + req.body.maxPlaytime;
  if (req.body.difficulty) where += ' AND lower(difficulty) = lower(\'' + req.body.difficulty + '\')';

  if (where.length > 1) where = 'WHERE ' + where.substring(5);

  var sql = 'SELECT ' + publisher + rating + description + 'title FROM games LEFT JOIN publishedby ON title = gametitle ' +
    where;

console.log(sql);

  db.any(sql)
    .then(function (data) {
      if (publisher !== NULL){
        var editedData = dh.mergeX(data,'publisher','title');
      }
      res.status(200)
        .json({
          status: 'success',
          data: editedData,
          message: 'Retrieved search for publisher'
        });
    })
    .catch(function (err) {
      console.error("Error when retrieving search " + err);
    });
});


module.exports = search;
