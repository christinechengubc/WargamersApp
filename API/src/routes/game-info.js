var gameinfo = require('express').Router();
var db = require('../db');


gameinfo.get('/:title', (req, res) => {
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
    var editedData = mergeX(data, 'genre', 'publisher');
    editedData = mergeX(editedData, 'publisher', 'title');
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


/**
 * Takes a JSON object and merges games with the same matchingValue but different multipleValue fields into one.
 *
 * @param data              The JSON object
 * @param multipleValue     The attribute to find different values of
 * @param matchingValue     The attribute that the multipleValue should be grouped
 *
 * @returns the JSON data with a list of unique matchingValue, their other attributes, and their list of different multipleValues
 */
function mergeX(data, multipleValue, matchingValue) {
  var i = 0;
  var xdata;
  var editedData = [];
  while (data[i]) {
    var temp = i;
    xdata = [data[i][multipleValue]];

    while (data[++i]) {
      if (data[temp][matchingValue] == data[i][matchingValue]) {
        xdata.push(data[i][multipleValue]);
      }
      else break;
    }

    data[temp][multipleValue] = xdata;
    editedData.push(data[temp]);
  }

  return editedData;
}

module.exports = gameinfo;
