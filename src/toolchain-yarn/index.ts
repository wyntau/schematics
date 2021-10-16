import { apply, contentTemplate, Rule, url } from '@angular-devkit/schematics';
import { mergeWithIfNotExist } from '../shared/rules/files';
import { camelCasedOptions } from '../shared/schema';
import { IToolchainYarnOptions } from './schema';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function toolchainYarn(_options: IToolchainYarnOptions): Rule {
  const options = camelCasedOptions(_options, 'toolchain-yarn');
  return mergeWithIfNotExist(apply(url('./files'), [contentTemplate({ registry: options.withRegistry })]));
}
