import { Rule, Tree } from '@angular-devkit/schematics';
import { debugLib } from '../shared/utility/debug';
import { addTask as addSchematicsTask } from 'schematics-task';

const debug = debugLib('toolchain-husky');

export function addHookScript(hook: string, script: string): Rule {
  return function (tree: Tree) {
    const hookFile = `.husky/${hook}`;

    if (!tree.exists(hookFile)) {
      return addSchematicsTask(async function createHookFile() {
        const { execa } = await import('execa');
        debug('create hook %s with script: %s', hook, script);
        await execa('npx', ['husky', 'add', hookFile, script]);
      });
    }

    const hookFileContent = tree.read(hookFile)!.toString(); // eslint-disable-line @typescript-eslint/no-non-null-assertion
    if (hookFileContent.indexOf(script) >= 0) {
      debug(`exist hook %s have same script, skip: %s`, hook, script);
      return tree;
    }

    return addSchematicsTask(async function appendHookFile() {
      const { execa } = await import('execa');
      debug('append hook %s with script: %s', hook, script);
      await execa('npx', ['husky', 'add', hookFile, script]);
    });
  };
}
