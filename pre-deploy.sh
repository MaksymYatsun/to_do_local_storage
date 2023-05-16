#!/bin/bash
mkdir dist && cp ./src/index.html ./dist/index.html && cp -r ./src/lib ./dist/lib && cp -r ./src/main.js ./dist/main.js && sed -r -i 's/\.\.\/\dist/\./g' ./dist/index.html