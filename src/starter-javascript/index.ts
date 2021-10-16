import { chain, noop, Rule, schematic } from '@angular-devkit/schematics';
import { camelCasedOptions, unprefixedOptions } from '../shared/schema';
import { IStarterJavascriptOptions } from './schema';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function starterJavascript(_options: IStarterJavascriptOptions): Rule {
  const { toolchain, target, ...others } = _options;

  const rawOptions: Record<string, any> = others;
  toolchain.concat(['npm']).forEach((item) => (rawOptions[`toolchain-${item}`] = true));
  rawOptions[`target-${target}`] = true;

  const options: Record<string, any> = camelCasedOptions(rawOptions, 'starter-javascript');

  return chain([
    schematic('toolchain-npm', unprefixedOptions(rawOptions, 'toolchain-npm')),

    options.toolchainTypescript
      ? schematic('toolchain-typescript', unprefixedOptions(rawOptions, 'toolchain-typescript'))
      : noop(),

    options.toolchainEslint
      ? schematic('toolchain-eslint', Object.assign({ target }, unprefixedOptions(rawOptions, 'toolchain-eslint')))
      : noop(),
    options.toolchainPrettier
      ? schematic('toolchain-prettier', unprefixedOptions(rawOptions, 'toolchain-prettier'))
      : noop(),

    options.toolchainHusky ? schematic('toolchain-husky', unprefixedOptions(rawOptions, 'toolchain-husky')) : noop(),
    options.toolchainCommitlint
      ? schematic('toolchain-commitlint', unprefixedOptions(rawOptions, 'toolchain-commitlint'))
      : noop(),
    options.toolchainLintStaged
      ? schematic('toolchain-lint-staged', unprefixedOptions(rawOptions, 'toolchain-lint-staged'))
      : noop(),

    options.toolchainLerna ? schematic('toolchain-lerna', unprefixedOptions(rawOptions, 'toolchain-lerna')) : noop(),
    options.toolchainLintRecently
      ? schematic('toolchain-lint-recently', unprefixedOptions(rawOptions, 'toolchain-lint-recently'))
      : noop(),
    options.toolchainPatchPackage
      ? schematic('toolchain-patch-package', unprefixedOptions(rawOptions, 'toolchain-patch-package'))
      : noop(),
  ]);
}
