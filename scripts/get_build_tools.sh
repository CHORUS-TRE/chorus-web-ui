#!/bin/bash
apt-get update -y && apt-get install -y curl
curl -sL https://deb.nodesource.com/setup_18.x -o /tmp/nodesource_setup.sh
bash /tmp/nodesource_setup.sh
apt-get install -y nodejs
