// @flow

import fs from 'fs';
import path from 'path';

export function resolve(p: string): string {
  return path.resolve(process.cwd(), p);
}

export function webpackExternals(
  nodeModulesFolder: string
): {[string]: string} {
  return fs
    .readdirSync(nodeModulesFolder)
    .filter(
      module =>
        !/\.bin|react-universal-component|require-universal-module|webpack-flush-chunks/.test(
          module
        )
    )
    .reduce((curr, module) => {
      curr[module] = `commonjs ${module}`;
      return curr;
    }, {});
}

type AssetType = {
  name: string,
};

export function getVendorChunkName(assets: AssetType[]): string {
  return assets
    .filter(asset => asset.name.includes('dll'))
    .reduce((curr: string, prev) => (curr = prev.name), '');
}

export function getRandomValues(min: number, max: number): number {
  return Math.random() * (max - min) + min; // eslint-disable-line
}
