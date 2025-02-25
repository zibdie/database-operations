#!/bin/bash

mkdir -p databases

docker stop $(docker ps -a -q) 2>/dev/null
docker rm -f $(docker ps -a -q) 2>/dev/null
docker rmi -f database-operations 2>/dev/null
docker build -t database-operations .
docker run -it -v "$(pwd)/databases:/databases" -p 3326:3306 database-operations "$1"