const initOptions = {

};

const pgp = require('pg-promise')(initOptions);

const cn = 'postgres://christine:@localhost:5432/christine';;
const db = pgp(cn);

module.exports = db;
