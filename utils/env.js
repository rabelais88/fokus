// tiny wrapper with default env vars
const _nodeEnv = process.env.NODE_ENV || 'development';
module.exports = {
  NODE_ENV: _nodeEnv,
  PORT: process.env.PORT || 3000,
  isBuildPerformanceLog: process.env.BUILD_PERFORMANCE_LOG === 'true',
  isCypress: process.env.CYPRESS_MODE === 'true',
  isDevelop: _nodeEnv === 'development',
};
