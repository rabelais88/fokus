/* istanbul ignore file */
// tiny wrapper with default env vars
const NODE_ENV = process.env.NODE_ENV || 'development';
module.exports = {
  NODE_ENV,
  PORT: process.env.PORT || 3000,
  isBuildPerformanceLog: process.env.BUILD_PERFORMANCE_LOG === 'true',
  isCypress: process.env.CYPRESS_MODE === 'true',
  isDevelop: NODE_ENV === 'development',
};
