var connection_info;
try {
  connection_info = require('./connection_info');
} catch (err) {
  connection_info = process.env.DATABASE_URL;
}
const initOptions = {};

const pgp = require('pg-promise')(initOptions);

const cn = connection_info;

const db = pgp(cn);

module.exports = db;

//hello
