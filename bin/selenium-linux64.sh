#!/bin/sh

ls | grep chromedriver || wget https://chromedriver.storage.googleapis.com/2.28/chromedriver_linux64.zip && unzip chromedriver_linux64.zip && rm chromedriver_linux64.zip

bin/selenium.sh
