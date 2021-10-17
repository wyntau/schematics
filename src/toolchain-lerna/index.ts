import { apply, chain, contentTemplate, Rule, url } from '@angular-devkit/schematics';
import { addPackageJsonDependency, NodeDependencyType } from '../shared/rules/dependencies';
import { mergeWithIfNotExist } from '../shared/rules/files';
import { camelCasedOptions } from '../shared/schema';
import { IToolchainLernaOptions } from './schema';
import { dependencies } from './latest-versions/package.json';
import { sharedOptionsOf } from '../shared/utility/sharedOptions';
import { IToolchainNpmOptions } from '../toolchain-npm/schema';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function toolchainLerna(_options: IToolchainLernaOptions): Rule {
  const options = camelCasedOptions(_options, 'toolchain-lerna');
  const toolchainNpmOptions = sharedOptionsOf<IToolchainNpmOptions>('toolchain-npm');
  return chain([
    addPackageJsonDependency(dependencies, ['lerna'], NodeDependencyType.Dev),
    mergeWithIfNotExist(
      apply(url('./files'), [
        contentTemplate({ npmClient: options.enableYarn || toolchainNpmOptions['enable-yarn'] ? 'yarn' : 'npm' }),
      ])
    ),
  ]);
}
