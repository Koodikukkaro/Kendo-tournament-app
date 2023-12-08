# Kendo Tournament App (Database)

This is a simple database for the Kendo App project.
It can be used for development or as a template for
a deployment database.  However, it does not implement
any kind of clustering or such.  By default, authentication
is disabled.

## Getting Started

The database won't store any data permanently into a volume,
so it is ideal for development.

### Prerequisites

- Docker. E.g. Docker Desktop

### Usage

- docker build --rm -f Dockerfile -t database:latest .
- docker run --rm -d -p 27017:27017 --name database database:latest
- Access at 127.0.0.1:27017
- Directly access the database with docker exec -it database bash
    and by running mongosh
- You can read the Dockerfile comments for tips.

### Replica set usage

- docker compose --file mongo.yaml up
- docker exec -it mongo1 mongosh /docker-entrypoint-initdb.d/rs-initiate.js
- Check in mongosh with rs.status()

## Contributing

The database implementation is subject to change. No changes
expected here. If we want to keep a local database, Setupping
a replica set is likely required.

