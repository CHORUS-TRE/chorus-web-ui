#!/bin/bash

# Main procedure.
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
cd "$DIR"

PATH="$PATH:$PWD/scripts/tools/linux/bin"

echo $PATH

function clean() {
    echo
    echo "==> Deleting generated client code:"
    rm -rf src/internal/client
}

function generate_client() {
    # Protobuf and openapiv2 instantiations.
    echo
    echo "==> Handling openapi file:"

    echo "---> generating flask server ..."
    java -jar ./scripts/tools/openapi-generator-cli.jar generate \
       -i api/openapiv2/v1-tags/apis.swagger.yaml \
       -g typescript-fetch \
       -o src/internal/client
}

function lint_client() {
    echo
    echo "==> Linting generated client code:"
    pnpm fix
}


clean
generate_client
git checkout src/internal/client/runtime.ts
lint_client
