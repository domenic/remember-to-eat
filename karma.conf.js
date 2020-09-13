'use strict';

module.exports = config => {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      { pattern: '__tests__/*.mjs', type: 'module' },
      { pattern: 'www/lib/**/*.mjs', type: 'module', included: false }
    ],
    reporters: ['progress'],
    logLevel: config.LOG_WARN,
    browsers: ['ChromeHeadless'],
    singleRun: true,
    autoWatch: false,
    concurrency: Infinity
  });
};
