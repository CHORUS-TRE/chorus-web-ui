FROM registry.itrcs3-app.intranet.chuv/ds-ubuntu:latest

USER root

RUN apt-get update && \
    apt-get install -y python3 python3-pip unzip default-jre libpq-dev


ENV SHELL /bin/bash
