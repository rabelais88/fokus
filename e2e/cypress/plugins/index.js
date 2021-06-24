// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  // ignore examples/
  config.ignoreTestFiles = '**/examples/*.spec.js';

  require('@cypress/code-coverage/task')(on, config);
  on('file:preprocessor', require('@cypress/code-coverage/use-babelrc'));

  // https://github.com/cypress-io/cypress/issues/349
  // add --disable-dev-shm-usage chrome flag
  on('before:browser:launch', (browser, launchOptions) => {
    if (browser.family === 'chromium') {
      console.log('Adding Chrome flag: --disable-dev-shm-usage');
      launchOptions.args.push('--disable-dev-shm-usage');
    }

    // supply the absolute path to an unpacked extension's folder
    // NOTE: extensions cannot be loaded in headless Chrome
    // const extPath = path.join(__dirname, 'build');
    // launchOptions.extensions.push(extPath);

    return launchOptions;
  });

  return config;
};
