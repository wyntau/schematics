import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';

const collectionPath = path.join(__dirname, '../collection.json');

describe('toolchain-typescript', () => {
  it('works', async () => {
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const root = Tree.empty();
    root.create('package.json', '{}');
    const tree = await runner.runSchematicAsync('toolchain-typescript', {}, root).toPromise();

    expect(!!tree.files).toBeTrue();
  });
});
