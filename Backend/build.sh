#!/usr/bin/env bash
# exit on error
set -o errexit

npm install

# Manually force download chrome binary using puppeteer launcher utility
echo "Downloading Chrome binary..."
node -e "const puppeteer = require('puppeteer'); puppeteer.launch();" || true