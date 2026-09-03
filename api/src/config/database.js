'use strict';
require('dotenv').config();

const {
	DB_NAME,
	DB_USERNAME,
	DB_PASSWORD,
	DB_HOST,
	DB_PORT,
	DB_USE_POSTGRES,
} = process.env;

const isPostgres = DB_USE_POSTGRES === 'true';

const base = {
	username: DB_USERNAME,
	password: DB_PASSWORD,
	database: DB_NAME,
	host: DB_HOST,
	port: Number(DB_PORT),
	dialect: isPostgres ? 'postgres' : 'mssql',
	...(isPostgres ? {} : {dialectOptions: {options: {}}}),
};

module.exports = {
	development: base,
	test: base,
	production: base,
};
