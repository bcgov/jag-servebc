const session = require('express-session');

// Create a session-store to be used by both the express-session
// Middleware and the keycloak middleware.

const memoryStore = new session.MemoryStore();

const configuredSession = session({
	secret: 'mySecret',
	resave: false,
	saveUninitialized: true,
	store: memoryStore,
});

module.exports = {memoryStore, configuredSession};
