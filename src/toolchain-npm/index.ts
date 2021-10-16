import { apply, chain, contentTemplate, mergeWith, noop, Rule, schematic, url } from '@angular-devkit/schematics';
import { camelCasedOptions } from '../shared/schema';
import { IToolchainNpmOptions } from './schema';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function toolchainNpm(_options: IToolchainNpmOptions): Rule {
  const options = camelCasedOptions(_options, 'toolchain-npm');

  return chain([
    mergeWith(apply(url('./files'), [contentTemplate(options)])),
    options.withYarn ? schematic('toolchain-yarn', options) : noop(),
    options.withNvm ? schematic('toolchain-nvm', {}) : noop(),
  ]);
}
