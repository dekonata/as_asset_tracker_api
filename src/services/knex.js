const knex = require('knex');
const types = require('pg').types

// override date type to be passed as string by node-postgres driver
const DATE_OID = 1082;
const TIMESTAMPTZ_OID = 1184;
const TIMESTAMP_OID = 1114;
types.setTypeParser(TIMESTAMPTZ_OID, val => val);
types.setTypeParser(TIMESTAMP_OID, val => val);
types.setTypeParser(DATE_OID , val => val);

const config = {
	client: 'pg',
	connection: {
		host: process.env.PG_HOST,
		user: 'postgres',
		password: process.env.PG_PASSWORD,
		database: 'as_asset_tracker',
	}
};

const db = knex(config);

module.exports = db;

