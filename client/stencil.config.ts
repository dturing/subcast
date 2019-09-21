import { Config } from '@stencil/core';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import { sass } from '@stencil/sass';

export const config: Config = {
  globalStyle: 'src/global/app.css',
  globalScript: 'src/global/app.ts',
  outputTargets: [
    {
      type: 'www',
      dir: '../public',
      // uncomment the following line to disable service workers in production
      serviceWorker: null
    }
  ],
  plugins: [
    globals(),
    builtins({preferBuiltins: false}),
    sass({ includePaths: ['./node_modules'] })
  ],
  devServer: {
    openBrowser: false,
    address: "d.labenz",
    port: 3000,
    reloadStrategy: "pageReload"
  }
};
