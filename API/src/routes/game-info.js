var gameinfo = require('express').Router();
var db = require('../db');
var dh = require('./dataHandler');
var PQ = require('pg-promise').ParameterizedQuery;

gameinfo.get('/:title', (req, res) => {
  var title = req.params.title;
  var sql = new PQ('SELECT * FROM (SELECT COUNT(*) AS availablecopies FROM GameInstances ' +
    'WHERE gametitle = $1 AND borrowed = 0) free, (SELECT COUNT(*) AS totalCopies ' +
    'FROM GameInstances WHERE gameTitle = $1) total ' +
    'LEFT JOIN Games g ON $1 = g.title ' +
    'LEFT JOIN Hasgenre h ON $1 = h.gametitle ' +
    'LEFT JOIN publishedBy p ON $1 = p.gametitle;');
  sql.values = [title];
db.any(sql)
  .then(function (data) {
    console.log(data);
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



module.exports = gameinfo;
