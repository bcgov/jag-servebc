const process = require('node:process');
const {Sequelize} = require('sequelize');
const logger = require('../logger.js');
const {applyExtraSetup} = require('./extra-setup.js');
require('dotenv').config();

const {
	DB_NAME,
	DB_USERNAME,
	DB_PASSWORD,
	DB_HOST,
	DB_PORT,
	DB_USE_POSTGRES,
} = process.env;

let sequelize = null;

if (DB_USE_POSTGRES === 'true') {
	logger.info('[api.db.init.model] Connecting to Postgres DB ', DB_NAME);
	sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
		host: DB_HOST,
		port: DB_PORT,
		dialect: 'postgres',
		logging: false,
	});
} else {
	logger.info('[api.db.init.model] Connecting to MSSQL DB ', DB_NAME);
	sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
		host: DB_HOST,
		port: DB_PORT,
		dialect: 'mssql',
		dialectOptions: {
			options: {},
		},
	});
}

const modelDefiners = [
	require('./attachment.model.js'),
	require('./note.model.js'),
	require('./served-document.model.js'),
	// Add more models here...
	// require('./models/item'),
];

// We define all models according to their files.
for (const modelDefiner of modelDefiners) {
	modelDefiner(sequelize);
}

// We execute any extra setup after the models are defined, such as adding associations.
applyExtraSetup(sequelize);

// We export the sequelize connection instance to be used around our app.
module.exports = sequelize;
