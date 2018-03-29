var borrowed = require('express').Router();
var db = require('../db');
var PQ = require('pg-promise').ParameterizedQuery;
var dh = require('./dataHandler');

borrowed.get('/get/:id', (req, res) => {
  var sql = new PQ('SELECT BR.expectedreturndate, GI.gametitle ' +
    'FROM BorrowRecords BR, Contains C, GameInstances GI ' +
    'WHERE BR.recordid = C.recordid AND C.gameID = GI.id AND C.gametitle = GI.gametitle AND ' +
    'BR.actualreturndate IS NULL AND GI.id = $1');
  sql.values = [req.params.id];

  db.any(sql)
    .then(function (data) {
      //returns JSON with list of distinct titles and array of publishers in the publisher field
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved borrowed game instances'
        });
    })
    .catch(function (err) {
      console.error("Error when retrieving games " + err);
    });
});

module.exports = borrowed;
