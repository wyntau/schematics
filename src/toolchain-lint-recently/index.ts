import { chain, mergeWith, Rule, Tree, url } from '@angular-devkit/schematics';
import { addPackageJsonDependency, NodeDependencyType } from '@schematics/angular/utility/dependencies';
import debugLib from 'debug';
import { cyan } from 'colorette';
import { latestVersions } from '../shared/latest-versions';

const debug = debugLib('@wyntau/schematics:toolchain-lint-recently');

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function toolchainLintRecently(_options: any): Rule {
  return chain([
    mergeWith(url('./files')),
    function (tree: Tree) {
      const packageName = 'lint-recently';
      const packageVersion = latestVersions[packageName];
      debug(`get ${cyan(packageName)} version: %s`, cyan(packageVersion));

      addPackageJsonDependency(tree, {
        type: NodeDependencyType.Dev,
        name: packageName,
        version: packageVersion,
      });

      return tree;
    },
  ]);
}
