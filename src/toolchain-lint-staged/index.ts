import { chain, mergeWith, noop, Rule, url } from '@angular-devkit/schematics';
import { addPackageJsonDependency, NodeDependencyType } from '../shared/rules/dependencies';
import { IToolchainLintStagedOptions } from './schema';
import { addTask } from '../toolchain-husky/utility';
import { camelCasedOptions } from '../shared/schema';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function toolchainLintStaged(_options: IToolchainLintStagedOptions): Rule {
  const options = camelCasedOptions(_options);
  return chain([
    mergeWith(url('./files')),
    addPackageJsonDependency(['lint-staged'], NodeDependencyType.Dev),
    options.toolchainHusky ? addTask('pre-commit', 'npx lint-staged') : noop(),
  ]);
}
