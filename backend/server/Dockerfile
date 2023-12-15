
# Dockerfile reference:
# https://docs.docker.com/engine/reference/builder/
# Best practices:
# https://docs.docker.com/develop/develop-images/dockerfile_best-practices/

# docker build --rm -f Dockerfile -t backend:latest .
# docker run --rm -d -p 80:8080 backend:latest

FROM node:latest

WORKDIR /usr/src/koodikukkaro

COPY . .
RUN npm install
# TODO: building for production
# run npm ci --omit=dev

EXPOSE 8080
CMD ["npm", "run", "start"]

# Shorter start interval for (hopefully) faster startup:
# https://github.com/docker/cli/issues/4486
# --start-interval=3s
HEALTHCHECK --start-period=30s \
	CMD curl -f localhost:8080/ || exit 1


