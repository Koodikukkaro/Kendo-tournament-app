// docker exec -it mongo1 mongosh /docker-entrypoint-initdb.d/rs-initiate.js

rs.initiate({
  _id: "rs",
  members: [
    {_id: 0, host: "mongo1"},
    {_id: 1, host: "mongo2"},
    {_id: 2, host: "mongo3"}
  ]
});
