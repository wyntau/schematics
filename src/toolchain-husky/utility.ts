import { Rule, Tree } from '@angular-devkit/schematics';

export function addTask(hook: string, script: string): Rule {
  return function (tree: Tree): Tree {
    const hookFile = `.husky/${hook}`;

    if (!tree.exists(hookFile)) {
      tree.create(hookFile, ['#!/bin/sh', '. "$(dirname "$0")/_/husky.sh"', '\n'].join('\n'));
    }

    let hookFileContent = tree.read(hookFile)!.toString();

    if (hookFile.indexOf(script) >= 0) {
      return tree;
    }

    if (hookFileContent[hookFileContent.length - 1] !== '\n') {
      hookFileContent += '\n';
    }

    hookFileContent += script + '\n';

    tree.overwrite(hookFile, hookFileContent);

    return tree;
  };
}
