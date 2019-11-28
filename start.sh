#!/bin/bash

"/bin/bash", "-c", "nvm use 12.13.0"
"npm install"
"cd", "client"
"npm install"
"cd", ".."
"node server.js"

# /usr/bin/command2 param1
# /usr/bin/commnad1