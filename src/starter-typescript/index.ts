import { chain, noop, Rule, schematic } from '@angular-devkit/schematics';
import { camelCasedOptions, unprefixedOptions } from '../shared/schema';
import { IStarterTypescriptOptions } from './schema';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function starterTypescript(_options: IStarterTypescriptOptions): Rule {
  const rawOptions: Record<string, any> = {};
  _options.toolchain.forEach((item) => (rawOptions[`toolchain-${item}`] = true));
  rawOptions[`target-${_options.target}`] = true;

  const options: Record<string, any> = camelCasedOptions(rawOptions);

  return chain([
    schematic('toolchain-npm', {}),
    schematic('toolchain-typescript', {}),
    options.toolchainCommitlint
      ? schematic('toolchain-commitlint', unprefixedOptions(options, 'toolchain-commitlint'))
      : noop(),
    options.toolchainEslint ? schematic('toolchain-eslint', unprefixedOptions(options, 'toolchain-eslint')) : noop(),
    options.husky ? schematic('toolchain-husky', unprefixedOptions(options, 'toolchain-husky')) : noop(),
    options.lerna ? schematic('toolchain-lerna', unprefixedOptions(options, 'toolchain-lerna')) : noop(),
    options.lintRecently
      ? schematic('toolchain-lint-recently', unprefixedOptions(options, 'toolchain-lint-recently'))
      : noop(),
    options.lintStaged
      ? schematic('toolchain-lint-staged', unprefixedOptions(options, 'toolchain-lint-staged'))
      : noop(),
    options.nvm ? schematic('toolchain-nvm', unprefixedOptions(options, 'toolchain-nvm')) : noop(),
    options.patchPackage
      ? schematic('toolchain-patch-package', unprefixedOptions(options, 'toolchain-patch-package'))
      : noop(),
    options.prettier ? schematic('toolchain-prettier', unprefixedOptions(options, 'toolchain-prettier')) : noop(),
    options.yarn ? schematic('toolchain-yarn', unprefixedOptions(options, 'toolchain-yarn')) : noop(),
  ]);
}
