var search = require('express').Router();
var db = require('../db');
var dh = require('./dataHandler');



search.post('/genre', (req, res) => {
  var genre = req.body.genre;


 var sql = 'SELECT hg.gametitle, g.rating, p.name as publisher FROM games g, hasgenre hg, publishers p, publishedby pb ' +
   'WHERE p.name = pb.publisherName AND g.title = pb.gameTitle AND HG.gametitle = title AND hg.genrename = \''+genre+'\'';

  db.any(sql)
    .then(function (data) {
      var editedData = dh.mergeX(data,'publisher','title');
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
  var publisher = req.body.publisher;


  var sql = 'SELECT g.title, p2.name as publisher FROM games g, publishers p, publishers p2, publishedby pb2, publishedby pb ' +
    'WHERE g.title = pb.gametitle AND pb.publishername = p.name AND  p.name = \''+publisher+'\'' +
    ' AND g.title = pb2.gametitle AND pb2.publishername = p2.name';


  db.any(sql)
    .then(function (data) {
      var editedData = dh.mergeX(data,'publisher','title');
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


search.post('/games', (req, res) => {


  var sql = '';


  db.any(sql)
    .then(function (data) {

      res.status(200)
        .json({
          status: 'success',
          data: data ,
          message: 'Retrieved search for publisher'
        });
    })
    .catch(function (err) {
      console.error("Error when retrieving search " + err);
    });
});


module.exports = search;
