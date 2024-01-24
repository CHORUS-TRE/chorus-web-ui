#!/bin/bash

# Main procedure.
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
cd "$DIR"

PATH="$PATH:$PWD/scripts/tools/linux/bin"

echo $PATH

function generate_client() {
    # Protobuf and openapiv2 instantiations.
    echo
    echo "==> Handling openapi file:"

    echo "---> generating flask server ..."
    java -jar ./scripts/tools/openapi-generator-cli.jar generate \
       -i api/openapiv2/v1-tags/apis.swagger.yaml \
       -g typescript-fetch \
       -o src/internal/client

    # rm -rf src/internal/api/server_template
    # mv src/internal/api/server_template_tmp/server_template src/internal/api/server_template
    # rm -r src/internal/api/server_template_tmp
}

generate_client
