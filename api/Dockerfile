FROM node:24-alpine

WORKDIR /api
ENV PATH="/api/node_modules/.bin:$PATH"

# Copy only dependency trackers to leverage Docker build cache
COPY package*.json /api/

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Run a conditional check: install curl ONLY if NODE_ENV is NOT production '--build-arg NODE_ENV=development'
RUN if [ "$NODE_ENV" != "production" ]; then \
        apk add --no-cache curl; \
    fi

RUN npm install 

# Copy the rest of your application code
COPY . /api/

EXPOSE 3003

# Run the container under the secure, unprivileged default node user
USER node

CMD ["node", "src/index.js"]

