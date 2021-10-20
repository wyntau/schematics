import { Rule, Tree } from '@angular-devkit/schematics';
import {
  addPackageJsonDependency as _addPackageJsonDependency,
  NodeDependencyType,
} from '@schematics/angular/utility/dependencies';
import { JSONFile } from '@schematics/angular/utility/json-file';
import { cyan, redBright } from 'colorette';
import { debugLib } from '../utility/debug';

export { NodeDependencyType } from '@schematics/angular/utility/dependencies';

const debug = debugLib('shared/rules/packageJson');

export function addPackageJsonDependency<T extends Record<string, string>>(
  latestVersions: T,
  packageNames: Array<keyof T> = Object.keys(latestVersions),
  type: NodeDependencyType = NodeDependencyType.Default
): Rule {
  return function (tree: Tree) {
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

export function addPackageJsonScript(scripts: Record<string, string>): Rule {
  return function (tree: Tree): Tree {
    const packageJson = new JSONFile(tree, 'package.json');
    Object.keys(scripts).forEach((name) => {
      packageJson.modify(['scripts', name], scripts[name]);
      debug('add npm script %s: %s', name, scripts[name]);
    });
    return tree;
  };
}
