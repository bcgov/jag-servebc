#For bcgov openshift
FROM artifacts.developer.gov.bc.ca/docker-remote/maven:3.6.1-jdk-11-slim AS MAVEN_TOOL_CHAIN
#For local build
# FROM maven:3.6.1-jdk-11-slim AS MAVEN_TOOL_CHAIN

RUN apt-get update && apt-get install -y git   
RUN git clone --branch ${FORMFLOW_SOURCE_REPO_BRANCH} ${FORMFLOW_SOURCE_REPO_URL} /bpm/

#Copy local copy of pom-docker.xml & settings-docker.xml
COPY pom-docker.xml /tmp/pom.xml
COPY settings-docker.xml /usr/share/maven/ref/

WORKDIR /tmp/

# This allows Docker to cache most of the maven dependencies
RUN mvn -s /usr/share/maven/ref/settings-docker.xml dependency:resolve-plugins dependency:resolve dependency:go-offline -B

RUN cp -r /bpm/forms-flow-bpm/src/ /tmp/src/
ARG CUSTOM_SRC_DIR=src/
# Override these files they have custom changes in the jag-ospg repository
COPY ./${CUSTOM_SRC_DIR}/  /tmp/${CUSTOM_SRC_DIR}/
RUN mvn -s /usr/share/maven/ref/settings-docker.xml package

# final custom slim java image (for apk command see jdk-11.0.3_7-alpine-slim)
FROM artifacts.developer.gov.bc.ca/docker-remote/adoptopenjdk/openjdk11:jdk-11.0.11_9-alpine-slim
# FROM adoptopenjdk/openjdk11:jdk-11.0.11_9-alpine

#Check for Package updates & Update Vulnerable Packages
RUN apk update && apk add --upgrade apk-tools && apk add --upgrade busybox && apk add --upgrade libretls

ENV JAVA_VERSION jdk-11.0.11+9
ENV JAVA_HOME=/opt/java/openjdk \
    PATH="/opt/java/openjdk/bin:$PATH"

EXPOSE 8080
# OpenShift has /app in the image, but it's missing when doing local development - Create it when missing
RUN test ! -d /app && mkdir /app || :
# Add spring boot application
RUN mkdir -p /app
COPY --from=MAVEN_TOOL_CHAIN /tmp/target/forms-flow-bpm.jar ./app
RUN chmod a+rwx -R /app
WORKDIR /app
VOLUME /tmp
ENTRYPOINT ["java","-Ddebug=true -Djava.security.egd=file:/dev/./urandom","-jar","/app/forms-flow-bpm.jar"]
