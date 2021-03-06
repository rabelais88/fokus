const CircularDependencyPlugin = require('circular-dependency-plugin');
var webpack = require('webpack'),
  path = require('path'),
  fileSystem = require('fs-extra'),
  env = require('./utils/env'),
  { CleanWebpackPlugin } = require('clean-webpack-plugin'),
  CopyWebpackPlugin = require('copy-webpack-plugin'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  // TerserPlugin = require('terser-webpack-plugin'),
  Dotenv = require('dotenv-webpack'),
  SpeedMeasurePlugin = require('speed-measure-webpack-plugin'),
  { ESBuildMinifyPlugin } = require('esbuild-loader');

const ASSET_PATH = process.env.ASSET_PATH || '/';

const rootPath = path.join(__dirname, 'src');
const envFiles = {
  production: './.env.production',
  development: './.env.development',
};

const smpOption = {};
if (env.isBuildPerformanceLog) {
  smpOption.compareLoadersBuild = {
    filePath: './build-perf.json',
  };
}
const smp = new SpeedMeasurePlugin(smpOption);

var alias = {
  'react-dom': '@hot-loader/react-dom',
  '@': rootPath,
};
if (env.isCypress) {
  alias[path.join(rootPath, 'components', 'Tutorial')] = path.join(
    rootPath,
    'components',
    'Stub'
  );
}

if (env.isDevelop) {
  alias[path.join(rootPath, 'lib', 'miscStorage')] = path.join(
    rootPath,
    'lib',
    'miscStorageDev'
  );
}

// load the secrets
var secretsPath = path.join(__dirname, 'secrets.' + env.NODE_ENV + '.js');

var fileExtensions = [
  'jpg',
  'jpeg',
  'png',
  'gif',
  'eot',
  'otf',
  'svg',
  'ttf',
  'woff',
  'woff2',
];

if (fileSystem.existsSync(secretsPath)) {
  alias['secrets'] = secretsPath;
}

let moduleRulesTsLoader = {
  test: /\.(ts|tsx)$/,
  loader: 'ts-loader',
  exclude: /node_modules/,
};
// if (process.env.CYPRESS_MODE === 'true') {
if (true) {
  moduleRulesTsLoader.loader = 'esbuild-loader';
  moduleRulesTsLoader.options = {
    loader: 'tsx',
    target: 'es2015',
  };
}

let cyclicDependencyCount = 0;
const MAX_DEPENDENCY_CYCLE = 1;

var options = {
  mode: process.env.NODE_ENV || 'development',
  entry: {
    newtab: path.join(__dirname, 'src', 'pages', 'Newtab', 'index.jsx'),
    options: path.join(__dirname, 'src', 'pages', 'Options', 'index.tsx'),
    popup: path.join(__dirname, 'src', 'pages', 'Popup', 'index.jsx'),
    background: path.join(__dirname, 'src', 'pages', 'Background', 'index.js'),
    // contentScript: path.join(__dirname, 'src', 'pages', 'Content', 'index.js'),
    devtools: path.join(__dirname, 'src', 'pages', 'Devtools', 'index.js'),
    panel: path.join(__dirname, 'src', 'pages', 'Panel', 'index.jsx'),
  },
  // chromeExtensionBoilerplate: {
  //   notHotReload: ['contentScript'],
  // },
  chromeExtensionBoilerplate: {
    notHotReload: ['devtools'],
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].bundle.js',
    publicPath: ASSET_PATH,
  },
  module: {
    rules: [
      {
        // look for .css or .scss files
        test: /\.(css|scss)$/,
        // in the `src` directory
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'esbuild-loader',
            options: {
              loader: 'css',
              minify: true,
            },
          },
        ],
      },
      {
        test: new RegExp('.(' + fileExtensions.join('|') + ')$'),
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
        },
        exclude: /node_modules/,
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
        exclude: /node_modules/,
      },
      moduleRulesTsLoader,
      {
        test: /\.(js|jsx)$/,
        use: [
          {
            loader: 'source-map-loader',
          },
          {
            loader: 'esbuild-loader',
            options: {
              loader: 'jsx',
              target: 'es2015',
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    alias: alias,
    extensions: fileExtensions
      .map((extension) => '.' + extension)
      .concat(['.js', '.jsx', '.ts', '.tsx', '.css']),
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new CircularDependencyPlugin({
      onStart({ compilation }) {
        cyclicDependencyCount = 0;
      },
      // `onDetected` is called for each module that is cyclical
      onDetected({ module: webpackModuleRecord, paths, compilation }) {
        // ignore library's cylic dependencies
        if (!/(node_modules\/)/.test(path[0])) return;
        cyclicDependencyCount += 1;
        // `paths` will be an Array of the relative module paths that make up the cycle
        // `module` will be the module record generated by webpack that caused the cycle
        compilation.warnings.push(new Error(paths.join(' -> ')));
      },
      onEnd({ compilation }) {
        if (cyclicDependencyCount > MAX_DEPENDENCY_CYCLE) {
          compilation.errors.push(
            new Error(
              `Detected ${cyclicDependencyCount} cycles exceeds ${MAX_DEPENDENCY_CYCLE} cycles`
            )
          );
        }
      },
    }),
    // clean the build folder
    new CleanWebpackPlugin({
      verbose: true,
      cleanStaleWebpackAssets: true,
    }),
    // expose and write the allowed env vars on the compiled bundle
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/manifest.json',
          to: path.join(__dirname, 'build'),
          force: true,
          transform: function (content, path) {
            // generates the manifest file using the package.json informations
            return Buffer.from(
              JSON.stringify({
                description: process.env.npm_package_description,
                version: process.env.npm_package_version,
                ...JSON.parse(content.toString()),
              })
            );
          },
        },
      ],
    }),
    // new CopyWebpackPlugin({
    //   patterns: [
    //     {
    //       from: 'src/pages/Content/content.styles.css',
    //       to: path.join(__dirname, 'build'),
    //       force: true,
    //     },
    //   ],
    // }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/lib/bg-loader.js',
          to: path.join(__dirname, 'build'),
          force: true,
        },
      ],
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'pages', 'Newtab', 'index.html'),
      filename: 'newtab.html',
      chunks: ['newtab'],
      cache: false,
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'pages', 'Options', 'index.html'),
      filename: 'options.html',
      chunks: ['options'],
      cache: false,
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'pages', 'Popup', 'index.html'),
      filename: 'popup.html',
      chunks: ['popup'],
      cache: false,
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'pages', 'Devtools', 'index.html'),
      filename: 'devtools.html',
      chunks: ['devtools'],
      cache: false,
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'pages', 'Panel', 'index.html'),
      filename: 'panel.html',
      chunks: ['panel'],
      cache: false,
    }),
    new Dotenv({
      path: envFiles[process.env.NODE_ENV] || envFiles.development,
    }),
  ],
  infrastructureLogging: {
    level: 'info',
  },
};

if (env.NODE_ENV === 'development') {
  options.devtool = 'eval-cheap-module-source-map';
} else {
  options.optimization = {
    minimize: true,
    minimizer: [
      // new TerserPlugin({
      //   extractComments: false,
      // }),
      new ESBuildMinifyPlugin({
        target: 'es2015',
        css: true,
      }),
    ],
  };
}

module.exports = smp.wrap(options);
