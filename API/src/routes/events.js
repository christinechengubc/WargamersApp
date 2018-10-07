var events = require('express').Router();
var db = require('../db');
var PQ = require('pg-promise').ParameterizedQuery;
var jwt = require('jsonwebtoken');
var imageCompressor = require('../imageCompressor');
var secret;
try {
  secret = require('./secret');
} catch (err) {
  secret = process.env.SECRET_KEY;
}

events.get('/', (req, res) => {
  var sql = 'SELECT * FROM events WHERE always_show = true OR events.date > now() ORDER BY date';

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

/*token verification (put in here instead of index.js as the '/games' path had to be split
  based on the verb being used, rather than just the path.
  The same code is copied in games. Any type of task that requires authentication (ie. updating events) must be put
  below this events.use. This ensures that all those tasks will go through events.use and hence require authentication in
  order for it to work.
*/

events.use((req,res,next) => {
  //retrieve token from client side
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

if (token) {
  //verify token using the token and secret as the key
  jwt.verify(token, secret, function(err, decoded) {

    if (err) {return res.status(403)
      .json({
        message: "not logged in"
      })
    }

    else {
      //save decoded token for use elsewhere
      req.decoded = decoded;
      next();
    }


  });
} else {
  return res.status(403)
    .json({
      message: "not logged in"
    });
}
});


events.post('/', async (req, res) => {
	if (Number(req.body.start_time) >= Number(req.body.end_time)) {
		return res.status(400).json({status: 'error', code: 400, message: "Bad Request: start_time >= end_time."});
	}
  if (req.body.always_show == null) {
		return res.status(400).json({status: 'error', code: 400, message: "Bad Request: always_show is null."});
	}

  var sql = new PQ('INSERT INTO events (title, start_time, end_time, date, location, description, always_show, lead_exec, fb_event_page, image) ' +
  'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id') ;
  let imageCompressedURL = await imageCompressor.compress(req.body.image).catch((err) => {
    console.error("Could not compress and upload image.");
    return res.status(500).json({status: 'error', code: 500, message: err.message});
  });
  sql.values = [req.body.title, req.body.start_time, req.body.end_time, req.body.date, req.body.location,
                req.body.description, req.body.always_show, req.body.lead_exec, req.body.fb_event_page, imageCompressedURL];

  db.one(sql)
    .then((data) => {
      res.status(200)
        .json({
          status: 'ok',
  				code: 200,
  				message: 'Created a new event',
          result: {
            event_id: data.id
          },
        });
    })
    .catch((err) => {
      console.error('\n[ERROR]: POST /events\n');
      console.error(err);
  		return res.status(500)
  			.json({
  				status: 'error',
  				code: 500,
  				message: err.message
  			});
  	});
});

events.put('/:id', async (req,res) => {
  var sql = new PQ('UPDATE events ' +
    'SET title = $2, start_time = $3, end_time = $4, date = $5, location = $6, description = $7, always_show = $8, lead_exec = $9, fb_event_page = $10, image = $11 ' +
    'WHERE id = $1');
  let imageCompressedURL = await imageCompressor.compress(req.body.image).catch((err) => {
    console.error("Could not compress and upload image.");
    return res.status(500).json({status: 'error', code: 500, message: err.message});
  });
  sql.values = [req.params.id, req.body.title, req.body.start_time, req.body.end_time, req.body.date, req.body.location,
                req.body.description, req.body.always_show, req.body.lead_exec, req.body.fb_event_page, imageCompressedURL];

  db.result(sql)
    .then((r) => {
      res.status(200)
        .json({
          status: 'ok',
          code: 200,
          message: 'Updated event with id: ' + req.params.id,
          result: {
            event_count: r.rowCount
          }
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

  var getSql = new PQ('SELECT image FROM events WHERE id = $1');
  getSql.values = [req.params.id];
  db.one(getSql)
    .then((data) => {
      db.result(sql)
        .then(async (r) => {
          await imageCompressor.deleteCompressed(data.image);
          res.status(200).json({status: 'ok', code: 200, message: 'Deleted event with id: ' + req.params.id, result: {event_count: r.rowCount}});
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
    })
    .catch((err) => {
      console.error('\n[ERROR]: DEL /events/:id\n');
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
