
# Dockerfile reference:
# https://docs.docker.com/engine/reference/builder/

FROM node:latest

WORKDIR /usr/src/koodikukkaro

COPY . .
RUN npm install
# TODO: building for production

EXPOSE 8080
CMD ["node", "index.js"]


