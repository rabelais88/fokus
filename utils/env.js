// tiny wrapper with default env vars
module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,
  skipBuildLog: process.env.SKIP_BUILD_LOG === 'true',
  isCypress: process.env.CYPRESS_MODE === 'true',
};
