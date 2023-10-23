#!/bin/bash
BASE_URL=http://localhost:8080/api/match

# -v

#curl ${BASE_URL}/id
#printf '\n\n'

#curl --json '{}' $BASE_URL
#printf '\n\n'

#curl -X PUT --json '{}' ${BASE_URL}/id
#printf '\n\n'

#curl -X DELETE ${BASE_URL}/id
#printf '\n\n'


# Example ids:
# id: 653bdad026454686db59e5bb
# id: 653bfb2665148722f2573d17
# id: 653d0b8eae97a05a82e065fd
# id: 653d0c32ae97a05a82e06601

#curl --json '{"matchType": "teppomatsi", "players": [{"userId": "6339bfb73f2733331ef8c5dd", "color": "red"}, {"userId": "6339bfb73f2733331ef8c5da", "color": "white"}]}' ${BASE_URL}/

#curl -X PUT --json '{"point": {"color": "white", "type": "hansoku", "timestamp": "\"Fri, 27 Oct 2023 13:49:05 GMT\""}}' ${BASE_URL}/id

