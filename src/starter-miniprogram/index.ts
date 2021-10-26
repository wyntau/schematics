import { Rule, Tree } from '@angular-devkit/schematics';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function starterMiniprogram(): Rule {
  return (tree: Tree) => {
    return tree;
  };
}
