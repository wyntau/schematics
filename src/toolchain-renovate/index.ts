import { Rule, url } from '@angular-devkit/schematics';
import { mergeWithIfNotExist } from '../shared/rules/files';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function toolchainRenovate(_options: any): Rule {
  return mergeWithIfNotExist(url('./files'));
}
