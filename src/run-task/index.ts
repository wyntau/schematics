import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { IRunTaskOptions } from './schema';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function runTask(_options: IRunTaskOptions): Rule {
  return async (tree: Tree, context: SchematicContext): Promise<void> => {
    try {
      _options.run && _options.run(tree, context);
    }catch(e){} // eslint-disable-line
  };
}
