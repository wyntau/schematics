import { chain, Rule, Tree } from '@angular-devkit/schematics';
import { JSONFile } from '@schematics/angular/utility/json-file';
import { addPackageJsonDependency, NodeDependencyType } from '../shared/rules/dependencies';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function toolchainPatchPackage(_options: any): Rule {
  return chain([
    addPackageJsonDependency(['patch-package', 'postinstall-postinstall'], NodeDependencyType.Dev),
    function (tree: Tree) {
      const packageJson = new JSONFile(tree, 'package.json');

      packageJson.modify(['scripts', 'postinstall'], 'patch-package');
      packageJson.modify(['scripts', 'patch-package'], "patch-package --exclude 'the-file-not-exist'");

      return tree;
    },
  ]);
}
