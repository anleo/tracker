#!/bin/sh

ls | grep chromedriver || wget https://chromedriver.storage.googleapis.com/2.28/chromedriver_linux64.zip && unzip chromedriver_linux64.zip && rm chromedriver_linux64.zip
ls | grep geckodriver || wget https://github.com/mozilla/geckodriver/releases/download/v0.13.0/geckodriver-v0.13.0-linux64.tar.gz && tar -xvzf geckodriver-v0.13.0-linux64.tar.gz && rm geckodriver-v0.13.0-linux64.tar.gz

bin/selenium.sh
