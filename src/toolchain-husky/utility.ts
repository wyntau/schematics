import { Rule, Tree } from '@angular-devkit/schematics';
import { debugLib } from '../shared/utility/debug';
import { addTask as addSchematicsTask } from 'schematics-task';
import execa from 'execa';

const debug = debugLib('toolchain-husky');

export function addTask(hook: string, script: string): Rule {
  return function (tree: Tree) {
    const hookFile = `.husky/${hook}`;

    if (!tree.exists(hookFile)) {
      return addSchematicsTask(async function createHookFile() {
        debug('create hook %s with script: %s', hook, script);
        await execa('npx', ['husky', 'add', hookFile, script]);
      });
    }

    const hookFileContent = tree.read(hookFile)!.toString();
    if (hookFileContent.indexOf(script) >= 0) {
      debug(`exist hook %s have same script, skip: %s`, hook, script);
      return tree;
    }

    return addSchematicsTask(async function appendHookFile() {
      debug('append hook %s with script: %s', hook, script);
      await execa('npx', ['husky', 'add', hook, script]);
    });
  };
}
