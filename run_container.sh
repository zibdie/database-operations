#!/bin/bash

mkdir -p databases

docker stop $(docker ps -a -q) 2>/dev/null
docker rm -f $(docker ps -a -q) 2>/dev/null
docker rmi -f db-operations 2>/dev/null
docker build -t db-operations .
docker run -it -v "$(pwd)/databases:/databases" -p 3326:3306 db-operations "$1"