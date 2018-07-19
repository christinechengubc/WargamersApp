var connection_info;
try {
  connection_info = require('./connection_info');
} catch (err) {
  connection_info = 'postgres://cryst:Spirals@localhost:5432/cryst';//process.env.DATABASE_URL;
}
const initOptions = {};

const pgp = require('pg-promise')(initOptions);

const cn = connection_info;

const db = pgp(cn);

module.exports = db;

