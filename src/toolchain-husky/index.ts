import { Rule, url, mergeWith, chain } from '@angular-devkit/schematics';
import { addPackageJsonDependency, NodeDependencyType } from '../shared/rules/dependencies';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function toolchainHusky(): Rule {
  return chain([mergeWith(url('./files')), addPackageJsonDependency(['husky'], NodeDependencyType.Dev)]);
}
