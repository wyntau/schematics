import { apply, contentTemplate, mergeWith, Rule, url } from '@angular-devkit/schematics';
import { IToolchainYarnOptions } from './schema';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function toolchainYarn(_options: IToolchainYarnOptions): Rule {
  return mergeWith(apply(url('./files'), [contentTemplate(_options)]));
}
