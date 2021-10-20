import { Rule, url, chain } from '@angular-devkit/schematics';
import { addPackageJsonDependency, addPackageJsonScript, NodeDependencyType } from '../shared/rules/packageJson';
import { mergeWithIfNotExist } from '../shared/rules/files';
import { dependencies } from './latest-versions/package.json';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function toolchainHusky(): Rule {
  return chain([
    mergeWithIfNotExist(url('./files')),
    addPackageJsonDependency(dependencies, ['husky'], NodeDependencyType.Dev),
    addPackageJsonScript({ prepare: '(husky install 2>/dev/null ||:) && mkdir -p .husky' }),
  ]);
}
