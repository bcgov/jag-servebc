const process = require('node:process');

async function healthcheck(request, response) {
	const healthcheckData = {
		uptime: process.uptime(),
		message: 'OK',
		timestamp: Date.now(),
	};
	try {
		response.send(healthcheckData);
	} catch (error) {
		healthcheckData.message = error;
		response.status(503).send();
	}
}

// Export router with all routes included
module.exports = {
	allAuth: false,
	healthcheck,
};
