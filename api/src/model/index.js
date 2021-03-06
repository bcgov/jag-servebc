const { Sequelize } = require('sequelize');
const { applyExtraSetup } = require('./extra-setup');
require('dotenv').config();

// const sequelize = new Sequelize({
// 	dialect: 'sqlite',
// 	storage: 'sqlite-example-database/example-db.sqlite',
// 	logQueryParameters: true,
// 	benchmark: true
// });

const DB_NAME = process.env.DB_NAME;
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_USE_POSTGRES = process.env.DB_USE_POSTGRES;

let sequelize = null;

if (DB_USE_POSTGRES==="true") {
	console.log('Connecting to Postgres DB')
	console.log('DB_NAME:', DB_NAME)
	sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
		host: DB_HOST,
		port: DB_PORT,
		dialect: 'postgres',
	})
} else {
	console.log('Connecting to MSSQL DB')
	console.log('DB_NAME:', DB_NAME)
	sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
		host: DB_HOST,
		port: DB_PORT,
		dialect: 'mssql',
		dialectOptions: {
		  options: {
			// useUTC: false,
			// dateFirst: 1,
		  }
		}
	})
}


const modelDefiners = [
	require('./attachment.model'),
	require('./note.model'),
	require('./served-document.model'),
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
