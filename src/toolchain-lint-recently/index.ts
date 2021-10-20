import { chain, Rule, url } from '@angular-devkit/schematics';
import { addPackageJsonDependency, NodeDependencyType } from '../shared/rules/packageJson';
import { mergeWithIfNotExist } from '../shared/rules/files';
import { dependencies } from './latest-versions/package.json';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function toolchainLintRecently(_options: any): Rule {
  return chain([
    mergeWithIfNotExist(url('./files')),
    addPackageJsonDependency(dependencies, ['lint-recently'], NodeDependencyType.Dev),
  ]);
}
