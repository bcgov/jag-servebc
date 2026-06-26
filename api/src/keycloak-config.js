const Keycloak = require('keycloak-connect');

// bearer-only: true is set in keycloak.json — this API validates JWT tokens
// on every request and never initiates browser login flows or uses sessions.
const keycloak = new Keycloak({});

module.exports = keycloak;
