var events = require('express').Router();
var db = require('../db');
var PQ = require('pg-promise').ParameterizedQuery;

events.get('/', (req, res) => {
  var sql = 'SELECT * FROM events';

  db.many(sql)
    .then((data) => {
      res.status(200)
        .json({
          status: 'ok',
          code: 200,
          message: 'Retrieved all events',
          result: {
            events: data
          },
        });
    })
    .catch((err) => {
      console.error('\n[ERROR]: GET /events\n');
      console.error(err);
			res.status(500)
				.json({
					status: 'error',
					code: 500,
					message: err.message
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
					message: 'Retrieved an event with id: ' + req.params.id,
          result: {
						event: data
					},
	      });
	  })
	  .catch((err) => {
      console.error('\n[ERROR]: GET /events/:id\n');
      console.error(err);
			res.status(500)
				.json({
					status: 'error',
					code: 500,
					message: err.message
				});
	  });
});

events.post('/', (req, res) => {
	if (Number(req.body.start_time) >= Number(req.body.end_time)) {
		return res.status(404).json({status: 'error', code: 404, message: "Bad Request: start_time >= end_time."});
	}
  // if (req.body.date < current_date) {
  //   return res.status(404).json({status: 'error', code: 404, message: "Bad Request: date is before current_date."});
  // }
  if (req.body.always_show != "true" && req.body.always_show != "false") {
		return res.status(404).json({status: 'error', code: 404, message: "Bad Request: always_show is not true or false."});
	}

  var sql = new PQ('INSERT INTO events (title, start_time, end_time, date, location, description, always_show, lead_exec, fb_event_page) ' +
  'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)');
  sql.values = [req.body.title, req.body.start_time, req.body.end_time, req.body.date, req.body.location,
                req.body.description, req.body.always_show, req.body.lead_exec, req.body.fb_event_page];

  db.none(sql)
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
      console.error('\n[ERROR]: POST /events\n');
      console.error(err);
  		res.status(500)
  			.json({
  				status: 'error',
  				code: 500,
  				message: err.message
  			});
  	});
});

events.put('/:id', (req,res) => {
  var sql = new PQ('UPDATE events ' +
    'SET title = $2, start_time = $3, end_time = $4, date = $5, location = $6, description = $7, always_show = $8, lead_exec = $9, fb_event_page = $10 ' +
    'WHERE id = $1');
  sql.values = [req.params.id, req.body.title, req.body.start_time, req.body.end_time, req.body.date, req.body.location,
                req.body.description, req.body.always_show, req.body.lead_exec, req.body.fb_event_page];

  db.none(sql)
    .then((data) => {
      res.status(200)
        .json({
          status: 'ok',
          code: 200,
          message: 'Updated event with id: ' + req.params.id,
          result: {}
        });
    })
    .catch((err) => {
      console.error('\n[ERROR]: GET /events/:id\n');
      console.error(err);
			res.status(500)
				.json({
					status: 'error',
					code: 500,
					message: err.message
				});
		});
});

events.delete('/:id', (req, res) => {
  var sql = new PQ('DELETE FROM events WHERE id = $1');
  sql.values = [req.params.id];

  db.result(sql)
    .then((r) => {
      if (r.rowCount === 0) {
        return res.status(200).json({status: 'ok', code: 200, message: 'No rows were deleted', result: {}});
      } else {
        return res.status(200).json({status: 'ok', code: 200, message: 'Deleted event with id: ' + req.params.id, result: {}});
      }
    })
    .catch((err) => {
      console.error('\n[ERROR]: DEL /events\n');
      console.error(err);
      res.status(500)
        .json({
          status: 'error',
          code: 500,
          message: err.message
        });
    });
});

module.exports = events;
