import { apply, chain, contentTemplate, Rule, Tree, url } from '@angular-devkit/schematics';
import { addPackageJsonDependency, NodeDependencyType } from '../shared/rules/packageJson';
import { mergeWithIfNotExist } from '../shared/rules/files';
import { camelCasedOptions } from '../shared/schema';
import { IToolchainLernaOptions } from './schema';
import { dependencies } from './latest-versions/package.json';
import { sharedOptionsOf } from '../shared/utility/sharedOptions';
import { IToolchainNpmOptions } from '../toolchain-npm/schema';
import { CamelCasedProperties } from 'type-fest';
import { JSONFile } from '@schematics/angular/utility/json-file';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function toolchainLerna(_options: IToolchainLernaOptions): Rule {
  const options = camelCasedOptions(_options, 'toolchain-lerna');
  const toolchainNpmOptions = sharedOptionsOf<CamelCasedProperties<IToolchainNpmOptions>>(
    'toolchain-npm',
    'toolchain-lerna'
  );
  return chain([
    addPackageJsonDependency(dependencies, ['lerna'], NodeDependencyType.Dev),
    mergeWithIfNotExist(
      apply(url('./files'), [
        contentTemplate({ npmClient: options.enableYarn || toolchainNpmOptions.enableYarn ? 'yarn' : 'npm' }),
      ])
    ),
    function (tree: Tree) {
      if (!options.enableYarn && !toolchainNpmOptions.enableYarn) {
        return tree;
      }

      const lernaJson = new JSONFile(tree, 'lerna.json');
      lernaJson.modify(['useWorkspaces'], true);
      lernaJson.modify(['packages'], undefined);
      return tree;
    },
  ]);
}
