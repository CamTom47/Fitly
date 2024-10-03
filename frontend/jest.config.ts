/** @type {import('jest').Config} */
const config = {
  verbose: true,
  moduleDirectories: [
    'node_modules','components'
  ],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^FitlyApi(.*)': '<rootDir>/Api/FitlyApi.js',
    '^axios(.*)': '<rootDir>/node_modules/axios/dist/node/axios.js'
  }
};
  
  module.exports = config;