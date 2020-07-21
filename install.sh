#!/bin/sh
echo "running npm install"
npm i
if [ $? -eq 0 ]; then
  echo "running npm run build..."
  npm run build
  if [ $? -eq 0 ]; then
    echo "npm build successful"
    echo "making web files directory"
    mkdir -p /var/www/toolbox/webex-v4prod
    echo "copying new web files"
    cp -rf dist/* /var/www/toolbox/webex-v4prod/
  else
    echo "npm failed to run build script"
  fi
else
  echo "failed npm install"
fi
