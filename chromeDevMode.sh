#!/bin/zsh
echo warning!  do not browse code outside this project with this browser
open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome "http://localhost:3000/" --args --user-data-dir="/tmp/chrome_dev_test" --disable-web-security
