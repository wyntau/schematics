import { chain, noop, Rule, url } from '@angular-devkit/schematics';
import { addPackageJsonDependency, NodeDependencyType } from '../shared/rules/packageJson';
import { IToolchainLintStagedOptions } from './schema';
import { addHookScript } from '../toolchain-husky/utility';
import { camelCasedOptions } from '../shared/schema';
import { mergeWithIfNotExist } from '../shared/rules/files';
import { dependencies } from './latest-versions/package.json';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function toolchainLintStaged(_options: IToolchainLintStagedOptions): Rule {
  const options = camelCasedOptions(_options, 'toolchain-lint-staged');
  return chain([
    mergeWithIfNotExist(url('./files')),
    addPackageJsonDependency(dependencies, ['lint-staged'], NodeDependencyType.Dev),
    options.toolchainHusky ? addHookScript('pre-commit', 'npx lint-staged') : noop(),
  ]);
}
