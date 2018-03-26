// Set-up our dependencies
var app = require('express')(); // shorthand form of express = require('express'), app = express();
var bodyParser = require('body-parser');
var routes = require('./routes'); // we can require a folder and it will automatically search for an index.js there 
var cors = require('cors');

// Use middleware to process URL encoded forms
app.use(bodyParser.urlencoded({ extended: true }));

// Use middleware to set cors for HTTP responses
app.use(cors());

// Connect our routes to our app
app.use('/', routes); 

// Set the port
app.set('port', (process.env.PORT || 5000));

// Have the server start listening on the given port
app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});

