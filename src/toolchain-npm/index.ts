import {
  apply,
  chain,
  contentTemplate,
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
import { mergeWithIfNotExist } from '../shared/rules/files';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function toolchainNpm(_options: IToolchainNpmOptions): Rule {
  const options = camelCasedOptions(_options, 'toolchain-npm');

  return chain([
    mergeWithIfNotExist(
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
