var events = require('express').Router();
var db = require('../db');
var PQ = require('pg-promise').ParameterizedQuery;

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

events.put('/edit', (req,res) => {
  var name = req.body.name;
  var date = req.body.date;
  var description = req.body.description;
  var startTime = req.body.startTime;
  var endTime = req.body.endTime;
  var location = req.body.location;

  var sql = new PQ('UPDATE events ' +
    'SET name = $1, date = $2, description = $3, startTime = $4, endTime = $5, location = $6 ' +
    'WHERE name = $1 AND date = $2');
  sql.values = [name,date,description,startTime,endTime,location];

  db.none(sql).then(
    res.status(200)
      .json({
        status: 'success',
        message: 'Updated event successfully'
      })
  ).catch(function (err){
    console.error("Error updating event : " + err);
  })
});

events.delete('/del/:name', (req, res) => {
  var name = req.params.name;
  console.log(name);
  var sql = new PQ('DELETE FROM events WHERE name = $1');
  sql.values = [name];
  db.none(sql).then(
    res.status(200)
      .json({
        status: 'success',
        message: 'Deleted event successfully'
      })
  ).catch(function(err){
    console.error("Error deleting: " + err);
  })
});

module.exports = events;
