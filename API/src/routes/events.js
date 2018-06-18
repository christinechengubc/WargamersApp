var events = require('express').Router();
var db = require('../db');
var PQ = require('pg-promise').ParameterizedQuery;

events.get('/', (req, res) => {
  var sql = 'SELECT * FROM events'

  db.any(sql)
    .then((data) => {
      res.status(200)
        .json({
          status: 'ok',
          code: 200,
          messages: ['Retrieved all events'],
          result: {
            events: data
          },
        });
    })
    .catch((err) => {
			console.error('Error ' + err.code + ' in endpoint: GET /events\n' + err.message);
			console.error(err.stack);
			res.status(err.code)
				.json({
					status: 'error',
					code: err.code,
					messages: [err.message]
				});
		});
});

events.get('/:id', (req, res) => {
  var sql = new PQ('SELECT * FROM events WHERE id = $1');
	sql.values = [req.params.id];

	db.one(sql)
	  .then((data) => {
	    res.status(200)
	      .json({
					status: 'ok',
					code: 200,
					messages: ['Retrieved an event where id is: ' + req.params.id],
          result: {
						games: data
					},
	      });
	  })
	  .catch((err) => {
			console.error('Error ' + err.code + ' in endpoint: GET /events/:id\n' + err.message);
			console.error(err.stack);
			res.status(err.code)
				.json({
					status: 'error',
					code: err.code,
					messages: [err.message]
				});
	  });
});

events.post('/', (req, res) => {
	if (req.body.start_time >= req.body.end_time) {
		return res.status(404).json({status: 'error', code: 404, message: "Bad Request: start_time is ahead of end_time."});
	}
  // if (req.body.date < current_date) {
  //   return res.status(404).json({status: 'error', code: 404, message: "Bad Request: date is before current_date."});
  // }
  if (req.body.always_show != 0 || req.body.always_show != 1) {
		return res.status(404).json({status: 'error', code: 404, message: "Bad Request: always_show is not 0 or 1."});
	}

  var sql = new PQ('INSERT INTO events ' +
  'VALUES title = $1, startTime = $2, endTime = $3, date = $4, location = $5, description = $6, always_show = $7, lead_exec = $8, fb_event_page = $9');
  sql.values = [req.body.title, req.body.startTime, req.body.endTime, req.body.date, req.body.location,
                req.body.description, req.body.always_show, req.body.lead_exec, rec.body.fb_event_page];

   db.any(sql)
    .then((data) => {
      res.status(200)
        .json({
          status: 'ok',
					code: 200,
					message: 'Created a new event',
          result: {},
        });
    })
    .catch((err) => {
			console.error('Error ' + err.code + ' in endpoint: POST /events\n' + err.message);
			console.error(err.stack);
			res.status(err.code)
				.json({
					status: 'error',
					code: err.code,
					message: err.message
				});
		});
});

events.put('/:id', (req,res) => {
  var sql = new PQ('UPDATE events ' +
    'SET title = $2, startTime = $3, endTime = $4, date = $5, location = $6, description = $7, always_show = $8, lead_exec = $9, fb_event_page = $10 ' +
    'WHERE id = $1');
  sql.values = [req.params.id, req.body.title, req.body.startTime, req.body.endTime, req.body.date, req.body.location,
                req.body.description, req.body.always_show, req.body.lead_exec, rec.body.fb_event_page];

  db.none(sql)
    .then((data) => {
      res.status(200)
        .json({
          status: 'ok',
          code: 200,
          messages: ['Updated event with id: ' + req.params.id],
          result: {}
        });
    })
    .catch((err) => {
			console.error('Error ' + err.code + ' in endpoint: PUT /events/:id\n' + err.message);
			console.error(err.stack);
			res.status(err.code)
				.json({
					status: 'error',
					code: err.code,
					messages: [err.message]
				});
		});
});

events.delete('/:id', (req, res) => {
  var sql = new PQ('DELETE FROM events WHERE id = $1');
  sql.values = [req.params.id];

  db.none(sql)
    .then(() => {
      res.status(200)
        .json({
          status: 'ok',
          code: 200,
          messages: ['Deleted event with id: ' + req.params.id],
          result: {}
        });
    })
    .catch((err) => {
      console.error('Error ' + err.code + ' in endpoint: DEL /events\n' + err.message);
      console.error(err.stack);
      res.status(err.code)
        .json({
          status: 'error',
          code: err.code,
          messages: [err.message]
        });
    });
});

module.exports = events;
