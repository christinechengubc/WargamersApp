const initOptions = {

};

const pgp = require('pg-promise')(initOptions);

const cn = 'postgres://cryst:Spirals@localhost:5432/cryst';
const db = pgp(cn);

module.exports = db;
