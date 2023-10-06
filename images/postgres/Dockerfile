FROM image-registry.openshift-image-registry.svc:5000/openshift/postgresql:10

#Update Software Repository
USER root

RUN id postgres
RUN usermod -l 1011120000 postgres
#RUN yum -y update

USER postgres
