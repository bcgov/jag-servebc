const app = require('./app');
const sequelize = require('./model');
const logger = require("./logger");

const serverPort = 3003;


async function assertDatabaseConnectionOk() {
	logger.info(`[api.initialization.db] Checking database connection.`);
	try {
		await sequelize.authenticate();
		logger.info('[api.db.init] Database connection OK!');
	} catch (error) {
		logger.error('[api.db.init] Unable to connect to the database:');
		logger.error('[api.db.init]',error);
		process.exit(1);
	}
}

async function init() {
	await assertDatabaseConnectionOk();
	app.listen(serverPort, () => {
		logger.info(`[api.init] Server started on port ${serverPort}.`);
	});
}

init();
