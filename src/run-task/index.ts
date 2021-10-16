import { noop, Rule, Tree } from '@angular-devkit/schematics';
import { IRunTaskOptions } from './schema';
import { Observable } from 'rxjs';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function runTask(_options: IRunTaskOptions): Rule {
  return _options.run && typeof _options.run === 'function'
    ? (tree: Tree) => {
        return new Observable<Tree>((subscriber) => {
          _options.run().then(
            () => {
              subscriber.next(tree);
              subscriber.complete();
            },
            (error) => {
              subscriber.error(error);
            }
          );
        }) as any;
      }
    : noop();
}
