# servebc-api

Custom backend behind the Serve Legal form and BPMN process. Provides served-document records, attachments, notes, and S3-backed file upload/download. Every route requires a valid Keycloak bearer token (`keycloak-connect`, bearer-only mode) except `/api/v1/healthcheck`; see `src/routes/*.js` for which routes are open vs. auth-required.

## Run
```
npm install

npm run start
```

## Test & Lint
```
npm test
npm run lint
```

## Docker Build
```
docker build -t servebc-api .
```

## Docker Run
```
docker run -p 3003:3003 \
-e KEYCLOAK_REALM="forms-flow-ai" \
-e KEYCLOAK_AUTH_SERVER_URL="http://host.docker.internal:8080/auth/" \
-e KEYCLOAK_CLIENT_ID="forms-flow-web" \
-e DB_NAME="servebc" \
-e DB_USERNAME="<USER>" \
-e DB_PASSWORD="<PASS>" \
-e DB_HOST="<HOST>" \
-e DB_PORT="<PORT>" \
-e DB_USE_POSTGRES="false" \
-e S3_BUCKETNAME="<BUCKET_NAME>" \
-e S3_ACCESS_KEY_ID="<ACCESS_KEY>" \
-e S3_SECRET_ACCESS_KEY="<SECRET_ACCESS_KEY>" \
-e S3_HOST="<HOST>" \
-e S3_USE_SSL="true" \
servebc-api 
```
Notes:
- "false" is the default value for DB_USE_POSTGRES. By default api connects to MSSQL DB. If you want to connect to POSTGRES then use "true".
- S3_USE_SSL defaults to "true" (the real S3-compatible endpoint is HTTPS-only). Set it to "false" only against a plain-HTTP local endpoint such as MinIO.
