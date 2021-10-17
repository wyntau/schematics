import { chain, noop, Rule, Tree, url } from '@angular-devkit/schematics';
import { JSONFile } from '@schematics/angular/utility/json-file';
import { addPackageJsonDependency, NodeDependencyType } from '../shared/rules/dependencies';
import { mergeWithIfNotExist } from '../shared/rules/files';
import { camelCasedOptions } from '../shared/schema';
import { IToolchainEslintOptions } from './schema';
import { dependencies } from './latest-versions/package.json';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function toolchainEslint(_options: IToolchainEslintOptions): Rule {
  const options = camelCasedOptions(_options, 'toolchain-eslint');
  return chain([
    mergeWithIfNotExist(url('./files')),
    addPackageJsonDependency(dependencies, ['eslint'], NodeDependencyType.Dev),

    options.toolchainTypescript
      ? addPackageJsonDependency(
          dependencies,
          ['@typescript-eslint/eslint-plugin', '@typescript-eslint/parser', 'typescript'],
          NodeDependencyType.Dev
        )
      : noop(),

    options.toolchainPrettier
      ? addPackageJsonDependency(
          dependencies,
          ['eslint-config-prettier', 'eslint-plugin-prettier', 'prettier'],
          NodeDependencyType.Dev
        )
      : noop(),

    options.target === 'react' || options.target === 'react-enable-jsx-runtime'
      ? addPackageJsonDependency(
          dependencies,
          ['eslint-plugin-react', 'eslint-plugin-react-hooks'],
          NodeDependencyType.Dev
        )
      : options.target === 'vue'
      ? addPackageJsonDependency(dependencies, ['eslint-plugin-vue', 'vue-eslint-parser'], NodeDependencyType.Dev)
      : noop(),

    function (tree: Tree) {
      const packageJson = new JSONFile(tree, 'package.json');
      packageJson.modify(['scripts', 'eslint'], 'DEBUG=eslint:cli-engine eslint .');
      packageJson.modify(['scripts', 'eslint-fix'], 'DEBUG=eslint:cli-engine eslint --fix .');

      const eslintrcJson = new JSONFile(tree, '.eslintrc.json');

      let extendsArray: Array<string> = ['eslint:recommended'];
      eslintrcJson.modify(['extends'], extendsArray);

      let parser: string;
      eslintrcJson.modify(['parser'], parser!);

      let parserOptionsProject: Array<string> = [];
      eslintrcJson.modify(['parserOptions', 'project'], parserOptionsProject!);

      if (options.toolchainTypescript) {
        extendsArray = extendsArray.concat('plugin:@typescript-eslint/recommended');
        eslintrcJson.modify(['extends'], extendsArray);

        parser = '@typescript-eslint/parser';
        eslintrcJson.modify(['parser'], parser);

        parserOptionsProject = parserOptionsProject.concat(['./tsconfig.json']);
        eslintrcJson.modify(['parserOptions', 'project'], parserOptionsProject);
      }

      switch (options.target) {
        case 'react':
        case 'react-enable-jsx-runtime': {
          extendsArray = extendsArray.concat(
            options.target === 'react-enable-jsx-runtime'
              ? ['plugin:react/recommended', 'plugin:react/jsx-runtime', 'plugin:react-hooks/recommended']
              : ['plugin:react/recommended', 'plugin:react-hooks/recommended']
          );
          eslintrcJson.modify(['extends'], extendsArray);
          break;
        }
        case 'vue': {
          extendsArray = extendsArray.concat('plugin:vue/recommended');
          eslintrcJson.modify(['extends'], extendsArray);

          const originParser = parser!;
          parser = 'vue-eslint-parser';
          eslintrcJson.modify(['parserOptions', 'parser'], originParser);
          eslintrcJson.modify(['parser'], parser);
          break;
        }
        default:
          break;
      }

      if (options.toolchainPrettier) {
        extendsArray = extendsArray.concat('plugin:prettier/recommended');
        eslintrcJson.modify(['extends'], extendsArray);
      }

      if (options.toolchainLerna && options.toolchainTypescript) {
        parserOptionsProject = parserOptionsProject.concat('./packages/**/tsconfig.json');
        eslintrcJson.modify(['parserOptions', 'project'], parserOptionsProject);
      }
      return tree;
    },
  ]);
}
