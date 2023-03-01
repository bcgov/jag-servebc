# Used by docker-compose.yml to deploy the formio application
# (When modified, you must include `--build` )
# -----------------------------------------------------------

# Use Node image, maintained by Docker:
# hub.docker.com/r/_/node/
FROM artifacts.developer.gov.bc.ca/docker-remote/node:lts-alpine3.17 as BUILD
RUN apk add git --no-cahce

# expect a build-time variable
ARG FORMFLOW_SOURCE_REPO_BRANCH
# use the value to set the ENV var default
ENV FORMFLOW_SOURCE_REPO_BRANCH ${FORMFLOW_SOURCE_REPO_BRANCH}
# expect a build-time variable
ARG FORMFLOW_SOURCE_REPO_URL
# use the value to set the ENV var default
ENV FORMFLOW_SOURCE_REPO_URL ${FORMFLOW_SOURCE_REPO_URL}

# Clone code
RUN git clone -b ${FORMFLOW_SOURCE_REPO_BRANCH} ${FORMFLOW_SOURCE_REPO_URL} /tmp/forms-flow-ai/

FROM artifacts.developer.gov.bc.ca/docker-remote/node:lts-alpine3.17
COPY --from=BUILD /tmp/forms-flow-ai/forms-flow-forms/. /forms-flow-forms/app/

WORKDIR /forms-flow-forms/app
RUN set -x \
	&& chmod -R 777 /forms-flow-forms/app/
ENV PATH /forms-flow-forms/app/node_modules/.bin:$PATH
RUN apk update && \
    apk upgrade && \
    rm -vrf /var/cache/apk/*
RUN npm ci

# Set this to inspect more from the application. Examples:
#   DEBUG=formio:db (see index.js for more)
#   DEBUG=formio:*
ENV DEBUG=""

# This will initialize the application based on
# some questions to the user (login email, password, etc.)
ENTRYPOINT [ "node", "main" ]
