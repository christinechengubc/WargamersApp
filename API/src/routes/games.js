var games = require('express').Router();
var db = require('../db');


games.get('/', (req, res) => {
	var sql = 'SELECT title, rating, name as publisher ' +
  'FROM game, publishedby, publisher ' +
  'WHERE game.title = publishedby.gameTitle AND publisher.name = publishedby.publisherName ' +
  'ORDER BY title';
  db.any(sql)
    .then(function (data) {
      var i = 0;
      var publishers;
      var editedData = [];
      //#11 returned games with list of publishers
      while (data[i]) {
        var x = i;
        publishers = [data[i]['publisher']];

        while (data[++i]) {
          if (data[x]['title'] == data[i]['title']) {
            publishers.push(data[i]['publisher']);
          }
          else break;
        }
       data[x]['publisher'] = publishers;
       editedData.push(data[x]);
     }
      res.status(200)
        .json({
          status: 'success',
          data: editedData,
          message: 'Retrieved ALL games'
        });
    })
    .catch(function (err) {
			console.error("Error when retrieving games " + err);
		});
});

games.get('/has-genre/:genre', (req, res) => {
  var genre = req.params.genre;
  var sql = 'SELECT gametitle FROM game, hasgenre WHERE gametitle = title AND genrename =' + genre;
db.any(sql)
  .then(function (data) {

    res.status(200)
      .json({
        status: 'success',
        data: data,
        message: 'Retrieved games with genre ' + genre
      });
  })
  .catch(function (err) {
    console.error("Error when retrieving games " + err);
  });
});

games.get('/title/:partTitle', (req, res) => {
  var partTitle = req.params.partTitle;
  partTitle = partTitle.replace(/\'/g, "");

var sql = 'SELECT title FROM game WHERE title LIKE \'%' + partTitle + '%\'';
db.any(sql)
  .then(function (data) {

    res.status(200)
      .json({
        status: 'success',
        data: data,
        message: 'Retrieved games with partial title ' + partTitle
      });
  })
  .catch(function (err) {
    console.log(sql);
    console.error("Error when retrieving games " + err);
  });
});



module.exports = games;
