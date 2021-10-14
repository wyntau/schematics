import { Rule, Tree } from '@angular-devkit/schematics';
import debugLib from 'debug';

const debug = debugLib('@wyntau/schematics:toolchain-husky');

export function addTask(hook: string, script: string): Rule {
  return function (tree: Tree): Tree {
    const hookFile = `.husky/${hook}`;

    if (!tree.exists(hookFile)) {
      debug(`create hook ${hook}`);
      tree.create(hookFile, ['#!/bin/sh', '. "$(dirname "$0")/_/husky.sh"', '\n'].join('\n'));
    }

    let hookFileContent = tree.read(hookFile)!.toString();

    if (hookFileContent.indexOf(script) >= 0) {
      debug(`task repeated, skip`);
      return tree;
    }

    if (hookFileContent[hookFileContent.length - 1] !== '\n') {
      hookFileContent += '\n';
    }

    hookFileContent += script + '\n';
    debug(`overwrite content:\n%s`, hookFile, hookFileContent);

    tree.overwrite(hookFile, hookFileContent);

    return tree;
  };
}
