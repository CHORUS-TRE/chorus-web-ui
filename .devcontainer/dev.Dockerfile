FROM node:18
USER root
# see https://github.com/pnpm/pnpm/issues/7024
RUN cat > .npmrc <<EOF package-import-method=clone-or-copy EOF
RUN npm install -g pnpm@latest
