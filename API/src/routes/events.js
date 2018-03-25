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


module.exports = events;
