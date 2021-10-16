import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { RunSchematicTask } from '@angular-devkit/schematics/tasks';
import { ITaskOptions, TaskFn } from './schema';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function runTask(taskFn: ITaskOptions): Rule {
  return async (tree: Tree, context: SchematicContext): Promise<void> => {
    try {
      taskFn(tree, context);
    } catch (e) {} // eslint-disable-line
  };
}

export function addTask(taskFn: TaskFn): Rule {
  return function (tree, context) {
    context.addTask(new RunSchematicTask<TaskFn>('task', taskFn));
    return tree;
  };
}
