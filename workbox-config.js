'use strict';

module.exports = {
  globDirectory: 'www/',
  globPatterns: [
    '**/*.{html,jpg,svg,mjs,css,webmanifest}'
  ],
  swDest: 'www/service-worker.js',

  runtimeCaching: [{
    urlPattern: /^https:\/\/unpkg.com\//,
    handler: 'CacheFirst'
  }]
};
