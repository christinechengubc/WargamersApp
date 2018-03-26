var eventinfo = require('express').Router();
var db = require('../db');


eventinfo.get('/:name/:date', (req, res) => {
  var s = 0;
  req.params.date = req.params.date.replace(/-/g, "/");
  var sql = 'SELECT event.*, member.name as hosts, attend.* ' +
            'FROM (SELECT COUNT(*) AS attending FROM attends WHERE attends.eventName = ' + req.params.name +
            ' AND attends.eventDate = ' + req.params.date + ') attend, event, host, member ' +
            'WHERE event.name = ' + req.params.name + ' AND event.date = ' + req.params.date +
            ' AND host.eventName = ' + req.params.name + ' AND host.eventDate = ' + req.params.date +
            ' AND host.memberNumber = member.memberNumber';
  console.log(sql);
db.any(sql)
  .then(function (data) {
    res.status(200)
      .json({
        status: 'success',
        data: data,
        message: 'Retrieved info for ' + req.params.name
      });
  })
  .catch(function (err) {
    console.error("Error when retrieving game info " + err);
  });
});

module.exports = eventinfo;
