const process = require('node:process');
const app = require('./app.js');
const sequelize = require('./model');
const logger = require('./logger.js');

const serverPort = process.env.API_PORT || 3003;

async function assertDatabaseConnectionOk() {
	logger.info('[api.initialization.db] Checking database connection.');
	try {
		await sequelize.authenticate();
		logger.info('[api.db.init] Database connection OK!');
	} catch (error) {
		logger.error('[api.db.init] Unable to connect to the database');
		logger.error('[api.db.init]', error);
		throw new Error('[api.db.init] Unable to connect to the database', {cause: error});
	}
}

async function init() {
	await assertDatabaseConnectionOk();
	app.listen(serverPort, () => {
		logger.info(`[api.init] Server started on port ${serverPort}`);
	});
}

init();
