import { chain, mergeWith, noop, Rule, url } from '@angular-devkit/schematics';
import { addPackageJsonDependency, NodeDependencyType } from '../shared/rules/dependencies';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function toolchainPrettier(_options: any): Rule {
  return chain([
    (tree) => (tree.exists('.prettier.json') ? noop() : mergeWith(url('./files'))),
    addPackageJsonDependency(['prettier'], NodeDependencyType.Dev),
  ]);
}
