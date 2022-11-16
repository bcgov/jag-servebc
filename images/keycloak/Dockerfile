FROM quay.io/keycloak/keycloak:16.1.0

MAINTAINER Victor Ameh <victor.ameh@aot-technologies.com>

LABEL Remarks="Dockerfile to update packages to address vulnerability CVE-2021-43527"

#Update Software Repository
USER root

# Update Vulnerable Packages
RUN microdnf update -y && microdnf install -y systemd-libs libksba

# RUN yum -y update

USER default
