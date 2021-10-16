import { apply, chain, contentTemplate, mergeWith, noop, Rule, url } from '@angular-devkit/schematics';
import { addPackageJsonDependency, NodeDependencyType } from '../shared/rules/dependencies';
import { camelCasedOptions } from '../shared/schema';
import { IToolchainLernaOptions } from './schema';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function toolchainLerna(_options: IToolchainLernaOptions): Rule {
  const options = camelCasedOptions(_options, 'toolchain-lerna');
  return chain([
    addPackageJsonDependency(['lerna'], NodeDependencyType.Dev),
    (tree) =>
      tree.exists('lerna.json')
        ? noop()
        : mergeWith(apply(url('./files'), [contentTemplate({ npmClient: options.toolchainYarn ? 'yarn' : 'npm' })])),
  ]);
}
