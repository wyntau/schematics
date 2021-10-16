import { Rule, url, mergeWith, chain, Tree } from '@angular-devkit/schematics';
import { JSONFile } from '@schematics/angular/utility/json-file';
import { addPackageJsonDependency, NodeDependencyType } from '../shared/rules/dependencies';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function toolchainHusky(): Rule {
  return chain([
    mergeWith(url('./files')),
    addPackageJsonDependency(['husky'], NodeDependencyType.Dev),
    function (tree: Tree) {
      const packageJson = new JSONFile(tree, 'package.json');
      packageJson.modify(['scripts', 'prepare'], 'husky install || exit 0');
      return tree;
    },
  ]);
}
