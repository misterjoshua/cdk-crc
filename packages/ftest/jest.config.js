module.exports = {
  roots: ['<rootDir>/test'],
  testEnvironment: './puppeteer_environment.js',
  globalSetup: './setup.js',
  globalTeardown: './teardown.js',
};
