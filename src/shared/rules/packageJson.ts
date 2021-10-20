import { Rule, Tree } from '@angular-devkit/schematics';
import {
  addPackageJsonDependency as _addPackageJsonDependency,
  NodeDependencyType,
} from '@schematics/angular/utility/dependencies';
import { cyan, redBright } from 'colorette';
import { debugLib } from '../utility/debug';

export { NodeDependencyType } from '@schematics/angular/utility/dependencies';

const debug = debugLib('shared/rules/dependencies');

export function addPackageJsonDependency<T extends Record<string, string>>(
  latestVersions: T,
  packageNames: Array<keyof T> = Object.keys(latestVersions),
  type: NodeDependencyType = NodeDependencyType.Default
): Rule {
  return function (tree: Tree): Tree {
    packageNames.forEach((_packageName) => {
      const packageName = _packageName as string;
      const packageVersion = latestVersions[packageName];

      if (!packageVersion) {
        debug(`can't find dependency ${redBright(packageName)}`);
        return;
      }

      debug(`add %s %s version: %s`, cyan(type), cyan(packageName), cyan(packageVersion));
      _addPackageJsonDependency(tree, {
        type: type,
        name: packageName,
        version: packageVersion,
      });
    });
    return tree;
  };
}
