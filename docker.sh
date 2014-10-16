#!/bin/bash


case "$1" in
	build) docker build -t "esiqveland/spotifyghtclient" .
		;;
	run) docker run --name spotifyghtclient --link my-redis:redis -p 127.0.0.1:3000:3000 -d  esiqveland/spotifyghtclient
		;;
	*) echo "Usage: $0 [build|run]"
		;;
esac
