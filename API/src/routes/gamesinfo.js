var gamesinfo = require('express').Router();
var db = require('../db');
var dh = require('./dataHandler');

gamesinfo.get('/:title', (req, res) => {
  var s = 0;
  var sql = 'SELECT g.*, h.genreName AS genre, p.publisherName AS publisher, total.*, free.*' +
            'FROM (SELECT COUNT(*) AS availableCopies FROM GameInstance WHERE gameTitle = ' + req.params.title + ' AND borrowed = 0) free, ' +
                 '(SELECT COUNT(*) AS totalCopies FROM GameInstance WHERE gameTitle = ' + req.params.title + ') total, ' +
                 'Game g, HasGenre h, publishedBy p ' +
            'WHERE g.title = ' + req.params.title +
                 ' AND h.gameTitle = ' + req.params.title +
                 ' AND p.gameTitle = ' + req.params.title +
            ' ORDER BY p.publisherName';
db.any(sql)
  .then(function (data) {

    var editedData = dh.mergeX(data, 'genre', 'publisher');
    editedData = dh.mergeX(editedData, 'publisher', 'title');
    res.status(200)
      .json({
        status: 'success',
        data: editedData,
        message: 'Retrieved game info for ' + req.params.title
      });
  })
  .catch(function (err) {
    console.error("Error when retrieving game info " + err);
  });
});



module.exports = gamesinfo;
