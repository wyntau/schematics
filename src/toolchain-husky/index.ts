import { Rule, url, mergeWith, chain, Tree } from '@angular-devkit/schematics';
import { addPackageJsonDependency, NodeDependencyType } from '@schematics/angular/utility/dependencies';
import { latestVersions } from '../shared/latest-versions';
import debugLib from 'debug';
import { cyan } from 'colorette';

const debug = debugLib('@wyntau/schematics:toolchain-husky');

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function toolchainHusky(): Rule {
  return chain([
    mergeWith(url('./files')),
    function (tree: Tree) {
      const packageName = 'husky';
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
