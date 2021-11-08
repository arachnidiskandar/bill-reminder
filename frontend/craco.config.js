/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// craco.config.js
const CracoEsbuildPlugin = require('craco-esbuild');

module.exports = {
  plugins: [{ plugin: CracoEsbuildPlugin }],
};
