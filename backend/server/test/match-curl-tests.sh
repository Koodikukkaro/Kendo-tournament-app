#!/bin/bash
BASE_URL=http://localhost:8080/api/match

# -v

curl ${BASE_URL}/id
printf '\n\n'

curl --json '{}' $BASE_URL
printf '\n\n'

curl -X PUT --json '{}' ${BASE_URL}/id
printf '\n\n'

curl -X DELETE ${BASE_URL}/id
printf '\n\n'

