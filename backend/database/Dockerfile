# Image for the database. A custom image to enable preloading (example) data.

# docker build --rm -f Dockerfile -t database:latest .
# docker run --rm -d -p 27017:27017 database:latest

# If you want to access the container:
# docker exec -it database bash


# Dockerfile reference:
# https://docs.docker.com/engine/reference/builder/

# https://hub.docker.com/_/mongo/
FROM mongo:latest

# (ADD vs COPY: https://phoenixnap.com/kb/docker-add-vs-copy )
#COPY ./uninplemented-init.js /docker-entrypoint-initdb.d/

# Credentials should not be committed into the repository.
# Probably entirely useless environment variables (not used):
#ENV MONGO_INITDB_ROOT_USERNAME=root
#ENV MONGO_INITDB_ROOT_PASSWORD=pass
#ENV MONGO_INITDB_DATABASE=
#ENV MONGO_INITDB_ROOT_PASSWORD_FILE=

#EXPOSE 27017
#CMD ["mongod"]


HEALTHCHECK --start-period=15s \
	CMD echo 'db.runCommand({serverStatus:1}).ok' | \
	mongosh localhost:27017 || exit 1


