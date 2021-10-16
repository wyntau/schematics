import { chain, noop, Rule, Tree, url } from '@angular-devkit/schematics';
import { JSONFile } from '@schematics/angular/utility/json-file';
import { addPackageJsonDependency, NodeDependencyType } from '../shared/rules/dependencies';
import { mergeWithIfNotExist } from '../shared/rules/files';
import { camelCasedOptions } from '../shared/schema';
import { IToolchainEslintOptions } from './schema';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function toolchainEslint(_options: IToolchainEslintOptions): Rule {
  const options = camelCasedOptions(_options, 'toolchain-eslint');
  return chain([
    mergeWithIfNotExist(url('./files')),
    addPackageJsonDependency(['eslint'], NodeDependencyType.Dev),

    options.toolchainTypescript
      ? addPackageJsonDependency(
          ['@typescript-eslint/eslint-plugin', '@typescript-eslint/parser', 'typescript'],
          NodeDependencyType.Dev
        )
      : noop(),

    options.toolchainPrettier
      ? addPackageJsonDependency(
          ['eslint-config-prettier', 'eslint-plugin-prettier', 'prettier'],
          NodeDependencyType.Dev
        )
      : noop(),

    options.target === 'react' || options.target === 'react-enable-jsx-runtime'
      ? addPackageJsonDependency(['eslint-plugin-react', 'eslint-plugin-react-hooks'], NodeDependencyType.Dev)
      : options.target === 'vue'
      ? addPackageJsonDependency(['eslint-plugin-vue', 'vue-eslint-parser'], NodeDependencyType.Dev)
      : noop(),

    function (tree: Tree) {
      const packageJson = new JSONFile(tree, 'package.json');
      packageJson.modify(['scripts', 'eslint'], 'DEBUG=eslint:cli-engine eslint .');
      packageJson.modify(['scripts', 'eslint-fix'], 'DEBUG=eslint:cli-engine eslint --fix .');

      const eslintrcJson = new JSONFile(tree, '.eslintrc.json');

      if (options.toolchainTypescript) {
        eslintrcJson.modify(['parser'], '@typescript-eslint/parser');

        const parserOptionsProject = (eslintrcJson.get(['parserOptions', 'project']) || []) as Array<string>;
        if (parserOptionsProject.indexOf('./tsconfig.json') < 0) {
          eslintrcJson.modify(['parserOptions', 'project'], parserOptionsProject.concat('./tsconfig.json'));
        }

        const extendsArray = (eslintrcJson.get(['extends']) || []) as Array<string>;
        if (extendsArray.indexOf('plugin:@typescript-eslint/recommended') < 0) {
          eslintrcJson.modify(['extends'], extendsArray.concat('plugin:@typescript-eslint/recommended'));
        }
      }

      switch (options.target) {
        case 'react':
        case 'react-enable-jsx-runtime': {
          const extendsArray = (eslintrcJson.get(['extends']) || []) as Array<string>;
          const fullArray =
            options.target === 'react-enable-jsx-runtime'
              ? ['plugin:react/recommended', 'plugin:react/jsx-runtime', 'plugin:react-hooks/recommended']
              : ['plugin:react/recommended', 'plugin:react-hooks/recommended'];

          const appendArray = fullArray.filter((item) => extendsArray.indexOf(item) < 0);
          eslintrcJson.modify(['extends'], extendsArray.concat(appendArray));
          break;
        }
        case 'vue': {
          const extendsArray = (eslintrcJson.get(['extends']) || []) as Array<string>;
          if (extendsArray.indexOf('plugin:vue/recommended') < 0) {
            eslintrcJson.modify(['extends'], extendsArray.concat('plugin:vue/recommended'));
          }

          const originParser = eslintrcJson.get(['parser']) as string;
          originParser && eslintrcJson.modify(['parserOptions', 'parser'], originParser);
          eslintrcJson.modify(['parser'], 'vue-eslint-parser');
          break;
        }
        default:
          break;
      }

      if (options.toolchainPrettier) {
        const extendsArray = (eslintrcJson.get(['extends']) || []) as Array<string>;
        if (extendsArray.indexOf('plugin:prettier/recommended') < 0) {
          eslintrcJson.modify(['extends'], extendsArray.concat('plugin:prettier/recommended'));
        }
      }

      if (options.toolchainLerna && options.toolchainTypescript) {
        const parserOptionsProject = (eslintrcJson.get(['parserOptions', 'project']) || []) as Array<string>;
        eslintrcJson.modify(['parserOptions', 'project'], parserOptionsProject.concat('./packages/**/tsconfig.json'));
      }
      return tree;
    },
  ]);
}
