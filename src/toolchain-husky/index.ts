import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { camelCasedOptions } from '../shared';
import { IToolchainHuskySchema } from './schema';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function toolchainHusky(_options: IToolchainHuskySchema): Rule {
  const options = camelCasedOptions(_options);
  return (tree: Tree, _context: SchematicContext) => {
    console.log(options);
    return tree;
  };
}
