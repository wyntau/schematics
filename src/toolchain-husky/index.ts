import { Rule, url, mergeWith } from '@angular-devkit/schematics';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function toolchainHusky(): Rule {
  return mergeWith(url('./files'));
}
