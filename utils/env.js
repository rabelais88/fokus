// tiny wrapper with default env vars
module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,
  isBuildPerformanceLog: process.env.BUILD_PERFORMANCE_LOG === 'true',
  isCypress: process.env.CYPRESS_MODE === 'true',
};
