import { apply, contentTemplate, mergeWith, Rule, url } from '@angular-devkit/schematics';
import { camelCasedOptions } from '../shared/schema';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function toolchainNpm(_options: any): Rule {
  const options = camelCasedOptions(_options, 'toolchain-npm');
  return mergeWith(apply(url('./files'), [contentTemplate(options)]));
}
