#!/bin/bash
#docker build -t rtop-vis .
docker run --rm -it -p 8080:8080 -v $(pwd):/go/src/rtop-vis -v ${SSH_AUTH_SOCK}:${SSH_AUTH_SOCK} -e SSH_AUTH_SOCK="${SSH_AUTH_SOCK}" rtop-vis-dev #rtop-vis $(cat hosts | xargs echo)
