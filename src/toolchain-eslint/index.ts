import { chain, mergeWith, noop, Rule, Tree, url } from '@angular-devkit/schematics';
import { JSONFile } from '@schematics/angular/utility/json-file';
import { addPackageJsonDependency, NodeDependencyType } from '../shared/rules/dependencies';
import { IToolchainEslintOptions } from './schema';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function toolchainEslint(_options: IToolchainEslintOptions): Rule {
  return chain([
    mergeWith(url('./files')),
    addPackageJsonDependency(['eslint'], NodeDependencyType.Dev),
    _options.toolchain.indexOf('typescript') >= 0
      ? addPackageJsonDependency(
          ['@typescript-eslint/eslint-plugin', '@typescript-eslint/parser', 'typescript'],
          NodeDependencyType.Dev
        )
      : noop(),
    _options.toolchain.indexOf('prettier') >= 0
      ? addPackageJsonDependency(['eslint-config-prettier', 'eslint-plugin-prettier', 'prettier'])
      : noop(),
    _options.toolchain.indexOf('lerna') >= 0 ? addPackageJsonDependency(['lerna'], NodeDependencyType.Dev) : noop(),
    _options.target === 'react' || _options.target === 'react-with-jsx-runtime'
      ? addPackageJsonDependency(['eslint-plugin-react', 'eslint-plugin-react-hooks'], NodeDependencyType.Dev)
      : _options.target === 'vue'
      ? addPackageJsonDependency(['eslint-plugin-vue', 'vue-eslint-parser'], NodeDependencyType.Dev)
      : noop(),
    function (tree: Tree) {
      const packageJson = new JSONFile(tree, 'package.json');

      packageJson.modify(['scripts', 'eslint'], 'DEBUG=eslint:cli-engine eslint .');
      packageJson.modify(['scripts', 'eslint-fix'], 'DEBUG=eslint:cli-engine eslint --fix .');

      const eslintrcJson = new JSONFile(tree, '.eslintrc.json');

      if (_options.toolchain.indexOf('typescript') >= 0) {
        eslintrcJson.modify(['parser'], '@typescript-eslint/parser');

        const parserOptionsProject = (eslintrcJson.get(['parserOptions', 'project']) || []) as Array<string>;
        eslintrcJson.modify(['parserOptions', 'project'], parserOptionsProject.concat('./tsconfig.json'));

        const extendsArray = (eslintrcJson.get(['extends']) || []) as Array<string>;
        eslintrcJson.modify(['extends'], extendsArray.concat(['plugin:@typescript-eslint/recommended']));
      }

      switch (_options.target) {
        case 'react':
        case 'react-with-jsx-runtime': {
          const extendsArray = (eslintrcJson.get(['extends']) || []) as Array<string>;
          eslintrcJson.modify(
            ['extends'],
            extendsArray.concat(
              _options.target === 'react-with-jsx-runtime'
                ? ['plugin:react/recommended', 'plugin:react/jsx-runtime', 'plugin:react-hooks/recommended']
                : ['plugin:react/recommended', 'plugin:react-hooks/recommended']
            )
          );
          break;
        }
        case 'vue': {
          const extendsArray = (eslintrcJson.get(['extends']) || []) as Array<string>;
          eslintrcJson.modify(['extends'], extendsArray.concat(['plugin:vue/recommended']));
          eslintrcJson.modify(['parser'], 'vue-eslint-parser');
          if (_options.toolchain.indexOf('typescript') >= 0) {
            eslintrcJson.modify(['parserOptions', 'parser'], '@typescript-eslint/parser');
          }
          break;
        }
        default:
          break;
      }

      if (_options.toolchain.indexOf('prettier') >= 0) {
        const extendsArray = (eslintrcJson.get(['extends']) || []) as Array<string>;
        eslintrcJson.modify(['extends'], extendsArray.concat(['plugin:prettier/recommended']));
      }

      if (_options.toolchain.indexOf('lerna') >= 0 && _options.toolchain.indexOf('typescript') >= 0) {
        const parserOptionsProject = (eslintrcJson.get(['parserOptions', 'project']) || []) as Array<string>;
        eslintrcJson.modify(['parserOptions', 'project'], parserOptionsProject.concat('./packages/**/tsconfig.json'));
      }
      return tree;
    },
  ]);
}
