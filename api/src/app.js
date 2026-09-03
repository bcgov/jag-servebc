const process = require('node:process');
const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const audit = require('express-requests-logger');
const keycloak = require('./keycloak-config.js');
const logger = require('./logger.js');

const apiVersion = 'v1';

const app = express();

const routes = {
	attachments: require('./routes/attachments.js'),
	notes: require('./routes/notes.js'),
	servedDocuments: require('./routes/served-documents.js'),
	files: require('./routes/files.js'),
	// Add more routes here...
	health: require('./routes/healthcheck.js'),
};

// Enable files upload
const uploadMaxFileSizeMb = Number(process.env.UPLOAD_MAX_FILE_SIZE_MB) || 20;

app.use(fileUpload({
	createParentPath: true,
	limits: {fileSize: uploadMaxFileSizeMb * 1024 * 1024},
	abortOnLimit: true,
	responseOnLimit: `File too large. Maximum allowed size is ${uploadMaxFileSizeMb}MB.`,
}));

if (process.env.NODE_ENV !== 'production') {
	app.set('json spaces', 2);
}

const allowedOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : [];

app.use(cors({
	origin(origin, callback) {
		if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
			callback(null, true);
		} else {
			callback(new Error(`CORS blocked: ${origin}`));
		}
	},
	credentials: true,
}));

// Install the Keycloak middleware.
app.use(keycloak.middleware());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//	For logging request details
//	app.use(morgan("[:date[iso]] info :method :url Status- :status Content-Length- :response[content-length] Response Time - :response-time ms"));
//	morgan.token('status', (request, response) => response.statusCode);
morgan.token('statusMessage', (request, response) => response.statusMessage);

app.use(morgan((tokens, request, response) => {
	const status = tokens.status(request, response);
	const logLevel = getStatusLogLevel(status);
	if (logLevel === 'info') {
		const logMessage = [
			`${tokens.method(request, response)} ${tokens.url(request, response)}`,
			`${status}-${tokens.statusMessage(request, response)}`,
			`[ContentLength] ${tokens.res(request, response, 'content-length')}`,
			`[ResponseTime] ${tokens['response-time'](request, response)} ms`,
		].join(' ');
		logger.log(logLevel, logMessage);
		logger.debug('');
	} else {
		const logMessage = [
			`${tokens.method(request, response)} ${tokens.url(request, response)}`,
			`${status}-${tokens.statusMessage(request, response)}`,
			`[Response Time] ${tokens['response-time'](request, response)} ms`,
		].join(' ');
		logger.log(logLevel, logMessage);
	}
}));

// Function to determine log level based on status code
function getStatusLogLevel(status) {
	let logLevel = '';
	if (status >= 400) {
		logLevel = 'error';
	} else if (status >= 300) {
		logLevel = 'warn';
	} else {
		logLevel = 'info';
	}

	return logLevel;
}

//	Logging request & response details for failed requestuests
app.use(audit({
	logger,
	excludeURLs: ['healthcheck'], // Exclude paths which enclude 'healthcheck'
	request: {
		maskBody: [''], // Mask '' field in incoming requests
		excludeHeaders: ['*'], // Exclude '*' (all) header from requests
		excludeBody: [''], // Exclude '' field from requests body
		maskHeaders: [''], // Mask '' header in incoming requests
		maxBodyLength: 100, // Limit length to 100 chars + '...'
	},
	response: {
		maskBody: [''], // Mask '' field in response body
		excludeHeaders: ['*'], // Exclude all headers from responses,
		excludeBody: [''], // Exclude '' body from responses
		maskHeaders: [''], // Mask '' header in incoming requests
		maxBodyLength: 100, // Limit length to 100 chars + '...'
		levels: {
			'2xx': 'info', // All 2xx responses are info
			'4xx': 'error', // All 4xx are error
			503: 'warn',
			'5xx': 'error', // All 5xx except 503 are errors, 503 is warn,
		},
	},
	shouldSkipAuditFunc(request, response) {
		let shouldSkip = false;
		//	Skip auditing for successful requests
		if (response.statusCode >= 200 && response.statusCode < 300) {
			shouldSkip = true;
		}

		return shouldSkip;
	},
}));

// We create a wrapper to workaround async errors not being transmitted correctly.
function makeHandlerAwareOfAsyncErrors(handler) {
	return async function (request, response, next) {
		try {
			await handler(request, response);
		} catch (error) {
			next(error);
		}
	};
}

// We provide a root route just as an example
app.get('/', (request, response) => {
	logger.info('[api.init] API is running...');
	response.send('API is running...');
});

// Example how to protect a service with keycloak
// https://github.com/keycloak/keycloak-nodejs-connect/blob/main/keycloak.d.ts#L297
// https://wjw465150.gitbooks.io/keycloak-documentation/content/securing_apps/topics/oidc/nodejs-adapter.html
app.get(`/api/${apiVersion}/protected`, keycloak.protect(), (request, response) => {
	response.send('{"test": "Private details"}');
});

// Define REST APIs for each route (if they exist).
for (const [routeName, routeController] of Object.entries(routes)) {
	const routeConfigurations = [
		{method: 'getByQuery', verb: 'get'},
		{method: 'getAll', verb: 'get'},
		{method: 'getById', verb: 'get', param: '/:id'},
		{method: 'create', verb: 'post'},
		{method: 'update', verb: 'put', param: '/:id'},
		{method: 'updateByApplicationId', verb: 'put'},
		{method: 'remove', verb: 'delete', param: '/:id'},
		{method: 'healthcheck', verb: 'get', path: '/healthcheck'}, // Use a distinct path
	];

	for (const config of routeConfigurations) {
		const {method, verb, param, path} = config;

		if (routeController[method]) {
			const routePath = param ? `/api/${apiVersion}/${routeName}${param}` : `/api/${apiVersion}/${routeName}`;
			const routeMiddleware = routeController.allAuth ? keycloak.protect() : (routeController[`${method}_auth`] ? keycloak.protect() : null);
			// Use a distinct path for the health check route
			const finalPath = method === 'healthcheck' ? `/api/${apiVersion}${path}` : routePath;

			if (routeMiddleware) {
				logger.debug(`Middleware assigned for route: ${method}`);
				app[verb](finalPath, routeMiddleware, makeHandlerAwareOfAsyncErrors(routeController[method]));
			} else {
				logger.debug(`No middleware assigned for route: ${method}`);
				app[verb](finalPath, makeHandlerAwareOfAsyncErrors(routeController[method]));
			}
		}
	}
}

module.exports = app;
