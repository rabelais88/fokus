export const env = process.env.NODE_ENV || 'development';
export const isDevEnv = env === 'development';
export const isProdEnv = env === 'production';
export const isTestEnv = env === 'test';
export const isCypress =
  (process.env.CYPRESS_MODE || '').toLowerCase() === 'true';
