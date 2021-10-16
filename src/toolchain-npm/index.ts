import {
  apply,
  chain,
  contentTemplate,
  mergeWith,
  noop,
  Rule,
  schematic,
  SchematicContext,
  Tree,
  url,
} from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { camelCasedOptions } from '../shared/schema';
import { IToolchainNpmOptions } from './schema';
import debugLib from 'debug';

const debug = debugLib('@wyntau/schematics:toolchain-npm');

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function toolchainNpm(_options: IToolchainNpmOptions): Rule {
  const options = camelCasedOptions(_options, 'toolchain-npm');

  return chain([
    function (tree: Tree) {
      if (!tree.exists('/package.json')) {
        debug('create package.json');
        tree.create('package.json', '{}');
      }
      return tree;
    },
    mergeWith(
      apply(url('./files'), [
        contentTemplate({ registry: options.withRegistry, engineStrict: options.enableEngineStrict }),
      ])
    ),
    options.enableYarn ? schematic('toolchain-yarn', _options) : noop(),
    options.enableNvm ? schematic('toolchain-nvm', _options) : noop(),
    function (tree: Tree, context: SchematicContext) {
      context.addTask(
        new NodePackageInstallTask({
          packageManager: options.enableYarn ? 'yarn' : 'npm',
        })
      );
      return tree;
    },
  ]);
}
