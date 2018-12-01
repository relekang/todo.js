#!/usr/bin/env node

if (process.env.SOURCE_MAPS === 'true') {
  require('source-map-support').install();
}
require('./lib/main.js');
