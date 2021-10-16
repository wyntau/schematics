import { chain, Rule, url } from '@angular-devkit/schematics';
import { addPackageJsonDependency, NodeDependencyType } from '../shared/rules/dependencies';
import { mergeWithIfNotExist } from '../shared/rules/files';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function toolchainPrettier(_options: any): Rule {
  return chain([mergeWithIfNotExist(url('./files')), addPackageJsonDependency(['prettier'], NodeDependencyType.Dev)]);
}
