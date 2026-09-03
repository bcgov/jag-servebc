# base image
FROM artifacts.developer.gov.bc.ca/docker-remote/node:14.21.3-alpine as build-stage
# FROM node:14.21.0-alpine as build-stage

# set working directory
WORKDIR /web

# add `/web/node_modules/.bin` to $PATH
ENV PATH /web/node_modules/.bin:$PATH

# This is a staging build. No need to upgrade the package.
RUN apk add --no-cache bash git openssh

ARG NODE_ENV
ARG GENERATE_SOURCEMAP
ARG REACT_APP_CLIENT_ROLE
ARG REACT_APP_STAFF_REVIEWER_ROLE
ARG REACT_APP_STAFF_DESIGNER_ROLE
ARG REACT_APP_CLIENT_ID
ARG REACT_APP_STAFF_REVIEWER_ID
ARG REACT_APP_STAFF_DESIGNER_ID
ARG REACT_APP_USER_RESOURCE_FORM_ID
ARG REACT_APP_ANONYMOUS_ID
ARG REACT_APP_API_SERVER_URL
ARG REACT_APP_API_PROJECT_URL
ARG REACT_APP_KEYCLOAK_CLIENT
ARG REACT_APP_WEB_BASE_URL
ARG REACT_APP_CAMUNDA_API_URI
ARG REACT_APP_WEBSOCKET_ENCRYPT_KEY
ARG REACT_APP_KEYCLOAK_URL_REALM
ARG REACT_APP_KEYCLOAK_URL
ARG REACT_APP_APPLICATION_NAME
ARG REACT_APP_USER_ACCESS_PERMISSIONS
ARG REACT_APP_WEB_BASE_CUSTOM_URL
ARG REACT_APP_FORMIO_JWT_SECRET

# Set environment variables for React build (NOT persisted in final image)
ENV NODE_ENV=${NODE_ENV}
ENV GENERATE_SOURCEMAP=${GENERATE_SOURCEMAP}

# Clone code
RUN git clone -b ${FORMFLOW_SOURCE_REPO_BRANCH} ${FORMFLOW_SOURCE_REPO_URL} /tmp/forms-flow-ai/ && \
    cp -r /tmp/forms-flow-ai/forms-flow-web/. /web/ && \
    rm -rf /tmp/forms-flow-ai


# Copy file to working dorectory
COPY package.json ./

# Install ALL dependencies
RUN npm install --unsafe-perm --production

# Copy customizations (only after deps are installed to leverage caching)
COPY src/ /web/src/
COPY public/ /web/public/

# Copy code in the docker image (avoids npm install if no dependencies have changed) -- Duplicate copy
# COPY . /web

# Build app
RUN npm run build

FROM artifacts.developer.gov.bc.ca/docker-remote/nginx:1.25.3-alpine as production-stage
# FROM nginx:1.22 as production-stage
# RUN mkdir /nginx
# Check for package updates
#RUN apk update && apk upgrade 
# Update vulnerable packages 
#RUN apt-get install zlib1g=1:1.2.11.dfsg-2+deb11u2 && apt-get install libxslt1.1=1.1.34-4+deb11u1  

COPY --from=build-stage /web/build /usr/share/nginx/html
COPY --from=build-stage /web/nginx.conf /etc/nginx/nginx.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
