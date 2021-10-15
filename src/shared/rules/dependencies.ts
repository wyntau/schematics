import { Tree } from '@angular-devkit/schematics';
import {
  addPackageJsonDependency as _addPackageJsonDependency,
  NodeDependencyType,
} from '@schematics/angular/utility/dependencies';
import { latestVersions } from '../latest-versions';
import { cyan } from 'colorette';
import debugLib from 'debug';

export { NodeDependencyType } from '@schematics/angular/utility/dependencies';

const debug = debugLib('@wyntau/schematics:shared/rules');

export function addPackageJsonDependency(
  packageNames: Array<string>,
  type: NodeDependencyType = NodeDependencyType.Default
) {
  return function (tree: Tree): Tree {
    packageNames.forEach((packageName) => {
      const packageVersion = latestVersions[packageName];

      if (!packageVersion) {
        debug(`can't find dependency ${cyan(packageName)}`);
        return;
      }

      debug(`add dependency ${cyan(packageName)} version: %s`, cyan(packageVersion));
      _addPackageJsonDependency(tree, {
        type: type,
        name: packageName,
        version: packageVersion,
      });
    });
    return tree;
  };
}
