import { chain, noop, Rule, schematic } from '@angular-devkit/schematics';
import { camelCasedOptions, unprefixedOptions } from '../shared/schema';
import { IStarterJavascriptOptions, schemaJson } from './schema';
import { debugLib } from '../shared/utility/debug';

const debug = debugLib('starter-javascript');

type ItemTypeOf<T extends Array<any>> = T extends Array<infer U> ? U : never;
type ToolchainChildKeys = `toolchain-${ItemTypeOf<IStarterJavascriptOptions['toolchain']> | 'npm'}`;
type RawOptions = Partial<
  Omit<IStarterJavascriptOptions, 'toolchain'> & {
    [P in ToolchainChildKeys]: boolean;
  }
>;

const falsyOptions = (
  schemaJson.properties.toolchain['x-prompt'].items.map((item) => item.value) as IStarterJavascriptOptions['toolchain']
).reduce<Partial<Record<ToolchainChildKeys, boolean>>>(
  (options, key) => ((options[`toolchain-${key}`] = false), options),
  {}
);

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function starterJavascript(_options: IStarterJavascriptOptions): Rule {
  debug('received options %O', _options);

  const { toolchain, ...others } = _options;

  const rawOptions: RawOptions = Object.assign({ 'toolchain-npm': true }, falsyOptions, others);
  toolchain.forEach((item) => (rawOptions[`toolchain-${item}`] = true));

  debug('populated options %O', rawOptions);

  const options: Record<string, any> = camelCasedOptions(rawOptions, 'starter-javascript');

  return chain([
    schematic('toolchain-npm', unprefixedOptions(rawOptions, 'toolchain-npm')),

    options.toolchainTypescript
      ? schematic('toolchain-typescript', unprefixedOptions(rawOptions, 'toolchain-typescript'))
      : noop(),

    options.toolchainEslint ? schematic('toolchain-eslint', unprefixedOptions(rawOptions, 'toolchain-eslint')) : noop(),
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

    options.toolchainRenovate
      ? schematic('toolchain-renovate', unprefixedOptions(rawOptions, 'toolchain-renovate'))
      : noop(),
  ]);
}
