import { SchematicContext, Tree } from '@angular-devkit/schematics';

export interface IRunTaskOptions {
  run: (tree: Tree, context: SchematicContext) => any;
}
