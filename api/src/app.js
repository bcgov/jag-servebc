const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const keycloak = require('./keycloak-config.js')
const { configuredSession } = require('./session-config.js')
const cors = require("cors")
const { uploadFile, getFile, removeFile } = require('./routes/files')
const logger = require("./logger");
const morgan = require("morgan");
var audit = require('express-requests-logger');

const apiVersion = 'v1'

const app = express();

const routes = {
	attachments: require('./routes/attachments'),
	notes: require('./routes/notes'),
	servedDocuments: require('./routes/served-documents'),
	// Add more routes here...
	// items: require('./routes/items'),
	health: require('./routes/healthcheck'),
};


// enable files upload
app.use(fileUpload({
    createParentPath: true
}));

// FUTURE: comment it for prod
app.set('json spaces', 2)


// FUTURE: Change it to the correct origin
app.use(
  cors({
    origin: "*",
    credentials: true
  })
)

app.use(configuredSession);

// Install the Keycloak middleware.
app.use(keycloak.middleware({
  logout: '/logout'
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//For logging request details
//app.use(morgan("[:date[iso]] info :method :url Status- :status Content-Length- :res[content-length] Response Time - :response-time ms"));
//morgan.token('status', (req, res) => res.statusCode);
morgan.token('statusMessage', (req, res) => res.statusMessage);

app.use(morgan((tokens, req, res) => {
	const status = tokens.status(req, res);
	const logLevel = getStatusLogLevel(status);
	if (logLevel === "info") {
		logger.log(logLevel, `${tokens.method(req, res)} ${tokens.url(req, res)} ${status}-${tokens.statusMessage(req, res)} [ContentLength] ${tokens.res(req, res, 'content-length')} [ResponseTime] ${tokens['response-time'](req, res)} ms`);
		logger.debug(``)
	}
	else {
		logger.log(logLevel, `${tokens.method(req, res)} ${tokens.url(req, res)} ${status}-${tokens.statusMessage(req, res)} [Response Time] ${tokens['response-time'](req, res)} ms`);
	}
}));

// Function to determine log level based on status code
function getStatusLogLevel(status) {
	if (status >= 400) {
	  return 'error';
	}
	else if (status >= 300) {
	  return 'warn';
	}
	return 'info';
  }

/* Another logging option
const morganMiddleware = morgan(
	':method :url [Status]-:status ,[ContentLength]-:res[content-length] ,[ResponseTime] - :response-time ms',
	{
	  stream: {
		// Configure Morgan to use our custom logger with the http severity
		if (:status >= 200 && :status <300) {
			write: (message) => logger.info(message.trim()),
		}
		else {
			write: (message) => logger.error(message.trim()),

		}
	  },
	}
  );
app.use(morganMiddleware);
*/

//Logging request & response details for failed requests
app.use(audit({
    logger: logger,
    excludeURLs: ['healthcheck'], // Exclude paths which enclude 'healthcheck'
    request: {
        maskBody: [''], // Mask '' field in incoming requests
        excludeHeaders: ['*'], // Exclude '*' (all) header from requests
        excludeBody: [''], // Exclude '' field from requests body
        maskHeaders: [''], // Mask '' header in incoming requests
        maxBodyLength: 50 // limit length to 50 chars + '...'
    },
    response: {
        maskBody: [''], // Mask '' field in response body
        excludeHeaders: ['*'], // Exclude all headers from responses,
        excludeBody: [''], // Exclude '' body from responses
        maskHeaders: [''], // Mask '' header in incoming requests
        maxBodyLength: 50, // limit length to 50 chars + '...'
		levels: {
			"2xx":"info", // All 2xx responses are info
			"4xx":"error", // All 4xx are error
			"503":"warn",
			"5xx":"error" // All 5xx except 503 are errors, 503 is warn,
		}
    },
    shouldSkipAuditFunc: function(req, res){
        let shouldSkip = false;
		//Skip auditing for successful requests
		if (res.statusCode >= 200 && res.statusCode < 300) {
			shouldSkip = true;
		}
  		return shouldSkip;
    }
}));

// We create a wrapper to workaround async errors not being transmitted correctly.
function makeHandlerAwareOfAsyncErrors(handler) {
	return async function(req, res, next) {
		try {
			await handler(req, res);
		} catch (error) {
			next(error);
		}
	};
}

// We provide a root route just as an example
app.get('/', (req, res) => {
	logger.info("[api.init] API is running...");
	res.send(`API is running...`);
});

// Example how to protect a service with keycloak
// https://github.com/keycloak/keycloak-nodejs-connect/blob/main/keycloak.d.ts#L297
// https://wjw465150.gitbooks.io/keycloak-documentation/content/securing_apps/topics/oidc/nodejs-adapter.html
app.get(`/api/${apiVersion}/protected`, keycloak.protect(), function (req, res) {
    res.send('{"test": "Private details"}')
});

// Files endpoint
app.post(`/api/${apiVersion}/files`, uploadFile)
app.get(`/api/${apiVersion}/files/:fileId`, keycloak.protect(), getFile)
app.delete(`/api/${apiVersion}/files/:fileId`, removeFile)

// Define REST APIs for each route (if they exist).
for (const [routeName, routeController] of Object.entries(routes)) {
 
	const routeConfigurations = [
	  { method: 'getByQuery', verb: 'get' },
	  { method: 'getAll', verb: 'get' },
	  { method: 'getById', verb: 'get', param: '/:id' },
	  { method: 'create', verb: 'post' },
	  { method: 'update', verb: 'put', param: '/:id' },
	  { method: 'updateByApplicationId', verb: 'put' },
	  { method: 'remove', verb: 'delete', param: '/:id' },
	  { method: 'healthcheck', verb: 'get', path: '/healthcheck' } // Use a distinct path
	];
  
	for (const config of routeConfigurations) {
	  const { method, verb, param, path } = config;
  
	  if (routeController[method]) {
		const routePath = param ? `/api/${apiVersion}/${routeName}${param}` : `/api/${apiVersion}/${routeName}`;
		//const routeMiddleware = routeController.allAuth || routeController[`${method}_auth`] ? keycloak.protect() : null;
		const routeMiddleware = routeController.allAuth ? keycloak.protect() : (routeController[`${method}_auth`] ? keycloak.protect() : null);
		// Use a distinct path for the health check route
		const finalPath = method === 'healthcheck' ? `/api/${apiVersion}${path}` : routePath;

		if (!routeMiddleware) {
			logger.debug(`No middleware assigned for route: ${method}`);
			app[verb](finalPath, makeHandlerAwareOfAsyncErrors(routeController[method]));
		}
		else {
			logger.debug(`Middleware assigned for route: ${method}`);
			app[verb](finalPath, routeMiddleware, makeHandlerAwareOfAsyncErrors(routeController[method]));
		}
  
	  }
	}
  }
  

module.exports = app;
