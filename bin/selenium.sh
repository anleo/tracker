#!/bin/sh

ls | grep selenium-server-standalone-3.3.0.jar || wget http://selenium-release.storage.googleapis.com/3.3/selenium-server-standalone-3.3.0.jar
java -jar selenium-server-standalone-3.3.0.jar
