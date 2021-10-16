import { apply, contentTemplate, mergeWith, Rule, url } from '@angular-devkit/schematics';
import { camelCasedOptions } from '../shared/schema';
import { IToolchainYarnOptions } from './schema';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function toolchainYarn(_options: IToolchainYarnOptions): Rule {
  const options = camelCasedOptions(_options);
  return mergeWith(apply(url('./files'), [contentTemplate({ registry: options.withRegistry })]));
}
