import { chain, Rule } from '@angular-devkit/schematics';
import { addPackageJsonDependency, NodeDependencyType } from '../shared/rules/packageJson';
import { dependencies } from './latest-versions/package.json';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function toolchainTypescript(): Rule {
  return chain([
    addPackageJsonDependency(dependencies, ['typescript'], NodeDependencyType.Dev),
    addPackageJsonDependency(dependencies, ['tslib'], NodeDependencyType.Default),
  ]);
}
