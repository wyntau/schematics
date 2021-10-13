import { chain, mergeWith, Rule, Tree, url } from '@angular-devkit/schematics';
import { addPackageJsonDependency, NodeDependencyType } from '@schematics/angular/utility/dependencies';
import JSON5 from 'json5';
import fs from 'fs';
import path from 'path';
import debugLib from 'debug';
import { PackageJson } from 'type-fest';
import { cyan } from 'colorette';

const debug = debugLib('@wyntau/schematics:toolchain-commitlint');

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function toolchainCommitlint(_options: any): Rule {
  return chain([
    mergeWith(url('./files')),
    function (tree: Tree) {
      const packages: PackageJson = JSON5.parse(
        fs.readFileSync(path.resolve(__dirname, '../shared/package.json'), { encoding: 'utf-8' })
      );
      debug(`parsed package.json: %O`, packages);

      const packageNames = ['@commitlint/cli', '@commitlint/config-conventional'];

      packageNames.forEach((packageName) => {
        const packageVersion = packages.dependencies![packageName];

        debug(`get ${cyan(packageName)} version: %s`, packageVersion);

        addPackageJsonDependency(tree, {
          type: NodeDependencyType.Dev,
          name: packageName,
          version: packageVersion,
        });
      });

      return tree;
    },
  ]);
}
