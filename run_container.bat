@echo off

mkdir databases

docker stop $(docker ps -a -q)
docker rm -f $(docker ps -a -q)
docker rmi -f database-operations
docker build -t database-operations .
docker run -it -v %cd%/databases:/databases -p 3326:3306 database-operations %1