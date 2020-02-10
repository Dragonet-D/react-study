#! /bin/bash
webVersion=$1

sudo docker pull docker.artifactory.kaisquare.com/ummi/ummi-web:$webVersion

sudo docker stop ummi-web
if [ $? -ne 0 ];then
    echo "ummi-web is  not start"
else
   sudo  docker rm ummi-web
 fi

sudo docker run -it --name ummi-web -d -p 81:81 docker.artifactory.kaisquare.com/ummi/ummi-web:$webVersion

