var events = require('express').Router();
var db = require('../db');

//pass date as all numbers as string in form 'DDMMYYYY'
events.get('/:title/:date', (req, res) => {
  var date = req.params.date;
  var sql = 'SELECT * FROM event';
	var sqlDRAFT = 'SELECT e.*, att.* ' +
            'FROM (SELECT COUNT(*) as attendeecount FROM member m, attends att ' +
                  'WHERE att.eventName =' + req.params.title + ' AND att.eventDate LIKE ' + date +
                  ' AND att.memberNumber = m.memberNumber) attendees, event e ' +
            'WHERE e.name = ' + req.params.title + ' AND e.date LIKE ' + date;

  db.any(sql)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved event information'
        });
    })
    .catch(function (err) {
			console.error("Error when retrieving events " + err);
		});
});

events.put('/add/:name/:date/:description/:startTime/:endTime/:location', (req,res) => {
  var name = req.body.name;
  var date = req.body.date;
  var description = req.body.description;
  var startTime = req.body.startTime;
  var endTime = req.body.endTime;
  var location = req.body.location;
  var value = name + ',' + date + ',' + description + ',' + startTime + ',' + endTime + ',' + location;
  var sql = 'INSERT INTO events VALUES(' + value + ')';

  db.none(sql).then(
    res.status(200)
      .json({
        status: 'success',
        message: 'Added the event to Events'
      })
  ).catch(function (err){
    console.error("Error adding event to Events: " + err);
  })
});


module.exports = events;
