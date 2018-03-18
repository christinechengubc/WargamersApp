const initOptions = {

};

const pgp = require('pg-promise')(initOptions);

const cn = process.env.DATABASE_URL || 'postgres://trevin:longmao298047004@localhost:5432/trevin';
const db = pgp(cn);

module.exports = db; 
