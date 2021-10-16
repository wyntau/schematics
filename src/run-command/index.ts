import { Rule, Tree } from '@angular-devkit/schematics';
import { IRunCommandOptions } from './schema';
import { Observable } from 'rxjs';
import { spawn } from 'child_process';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function runCommand(_options: IRunCommandOptions): Rule {
  return (tree: Tree) => {
    return new Observable<Tree>((subscriber) => {
      console.log(_options);
      const child = spawn(_options.command, _options.arguments, { stdio: 'inherit' });
      child.on('error', (error) => {
        subscriber.error(error);
      });
      child.on('close', () => {
        subscriber.next(tree);
        subscriber.complete();
      });
      return () => {
        child.kill();
      };
    }) as any;
  };
}
