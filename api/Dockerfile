# base image
#FROM docker-remote.artifacts.developer.gov.bc.ca/node:12.4.0-alpine as build-stage
FROM node:18.10-alpine as build-stage

# set working directory
WORKDIR /api

# add `/api/node_modules/.bin` to $PATH
ENV PATH /api/node_modules/.bin:$PATH

COPY . /api/

RUN apk update && apk add busybox-extras

RUN wget https://download.microsoft.com/download/e/4/e/e4e67866-dffd-428c-aac7-8d28ddafb39b/msodbcsql17_17.9.1.1-1_amd64.apk
RUN wget https://download.microsoft.com/download/e/4/e/e4e67866-dffd-428c-aac7-8d28ddafb39b/mssql-tools_17.9.1.1-1_amd64.apk
RUN apk add --allow-untrusted msodbcsql17_17.9.1.1-1_amd64.apk
RUN apk add --allow-untrusted mssql-tools_17.9.1.1-1_amd64.apk

#Install curl
RUN apk add curl

RUN apk add unixodbc-dev

# Fix required when upgrading from node:14.17.0-alpine to node:18.10-alpine
RUN mkdir /.npm
# Deploying to dev use 1011120000:0
RUN chown -R 1011120000:0 "/.npm"

RUN npm install

# RUN node src/sqlite-example-database/setup.js

EXPOSE 3003:3003
CMD ["npm", "run", "start"]
