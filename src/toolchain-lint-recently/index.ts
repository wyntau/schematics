import { mergeWith, Rule, url } from '@angular-devkit/schematics';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function toolchainLintRecently(_options: any): Rule {
  return mergeWith(url('./files'));
}
