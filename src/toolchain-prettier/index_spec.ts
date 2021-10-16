import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';

const collectionPath = path.join(__dirname, '../collection.json');

describe('toolchain-prettier', () => {
  it('works', async () => {
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const root = Tree.empty();
    root.create('package.json', '{}');
    const tree = await runner.runSchematicAsync('toolchain-prettier', {}, root).toPromise();

    expect(tree.files).toContain('/.prettierrc.json');
  });
});
