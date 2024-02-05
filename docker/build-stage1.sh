#!/bin/bash

set -e

docker build --pull -f dockerfiles/stage1.dockerfile -t registry.dip-dev.thehip.app/dip-cicd-template-frontend-stage1 --secret id=PYPI_USERNAME,env=PYPI_USERNAME --secret id=PYPI_PASSWORD,env=PYPI_PASSWORD ..
docker push registry.dip-dev.thehip.app/dip-cicd-template-frontend-stage1
