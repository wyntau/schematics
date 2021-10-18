import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { dependencies } from './latest-versions/package.json';

const collectionPath = path.join(__dirname, '../collection.json');

describe('toolchain-husky', () => {
  it('works', async () => {
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const root = Tree.empty();
    root.create('package.json', '{}');
    const tree = await runner.runSchematicAsync('toolchain-husky', {}, root).toPromise();

    const packageJson = JSON.parse(tree.readContent('package.json'));
    expect(packageJson.devDependencies.husky === dependencies.husky).toBeTruthy();
  });
});
