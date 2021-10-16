import { Rule, Tree } from '@angular-devkit/schematics';
import execa from 'execa';
import { IRunCommandOptions } from './schema';
import { Observable } from 'rxjs';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function runCommand(_options: IRunCommandOptions): Rule {
  return (tree: Tree) => {
    return new Observable<Tree>((subscriber) => {
      execa(_options.command, _options.arguments, _options.options).then(
        () => {
          subscriber.next(tree);
          subscriber.complete();
        },
        (error) => {
          subscriber.error(error);
        }
      );
    }) as any;
  };
}
