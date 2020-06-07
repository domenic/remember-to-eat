'use strict';

module.exports = {
  globDirectory: 'www/',
  globPatterns: [
    '**/*.{html,jpg,mjs,css}'
  ],
  swDest: 'www/service-worker.js',

  runtimeCaching: [{
    urlPattern: /^https:\/\/unpkg.com\//,
    handler: 'CacheFirst'
  }]
};
