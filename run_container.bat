@echo off

mkdir databases

docker stop $(docker ps -a -q)
docker rm -f $(docker ps -a -q)
docker rmi -f db-operations
docker build -t db-operations .
docker run -it -v %cd%/databases:/databases -p 3326:3306 db-operations %1