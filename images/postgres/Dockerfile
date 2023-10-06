FROM  image-registry.openshift-image-registry.svc:5000/openshift/postgresql:12-el8

#Update Software Repository
USER root

id postgres
usermod -l 1011120000 postgres
#RUN yum -y update

USER postgres
