/* global importScripts */
try {
  importScripts('background.bundle.js' /*, and so on */);
} catch (e) {
  console.error(e);
}
