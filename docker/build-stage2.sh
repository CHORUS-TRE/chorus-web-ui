#!/bin/bash

set -e

docker build --pull -f dockerfiles/stage2.dockerfile -t registry.itrcs3-app.intranet.chuv/ds-cicd-template-frontend:latest  --secret id=PYPI_USERNAME,env=PYPI_USERNAME --secret id=PYPI_PASSWORD,env=PYPI_PASSWORD ..
docker push registry.itrcs3-app.intranet.chuv/ds-cicd-template-frontend:latest
