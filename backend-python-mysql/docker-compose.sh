#!/bin/bash

docker-compose build --force-rm
docker-compose up -d
docker-compose exec app sh /usr/local/bin/hosts_script.sh
