import { apply, chain, contentTemplate, Rule, Tree, url } from '@angular-devkit/schematics';
import { JSONFile } from '@schematics/angular/utility/json-file';
import { mergeWithIfNotExist } from '../shared/rules/files';
import { camelCasedOptions } from '../shared/schema';
import { IToolchainYarnOptions } from './schema';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function toolchainYarn(_options: IToolchainYarnOptions): Rule {
  const options = camelCasedOptions(_options, 'toolchain-yarn');
  return chain([
    mergeWithIfNotExist(apply(url('./files'), [contentTemplate({ registry: options.withRegistry })])),
    function (tree: Tree) {
      if (!options.toolchainLerna) {
        return tree;
      }
      const packageJson = new JSONFile(tree, 'package.json');
      packageJson.modify(['workspaces'], ['packages/*']);
      packageJson.modify(['private'], true);
      return tree;
    },
  ]);
}
