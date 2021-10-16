import { apply, forEach, MergeStrategy, mergeWith, Rule, Source, Tree } from '@angular-devkit/schematics';
import debugLib from 'debug';

const debug = debugLib('@wyntau/schematics:shared/rules/files');

export function mergeWithIfNotExist(source: Source, strategy?: MergeStrategy): Rule {
  return function (tree: Tree) {
    return mergeWith(
      apply(source, [
        forEach((fileEntry) => {
          if (tree.exists(fileEntry.path)) {
            debug('file exists, skip %s', fileEntry.path);
            return null;
          }
          debug('create file %s', fileEntry.path);
          return fileEntry;
        }),
      ]),
      strategy
    );
  };
}
