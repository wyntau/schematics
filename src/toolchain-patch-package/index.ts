import { chain, Rule } from '@angular-devkit/schematics';
import { addPackageJsonDependency, addPackageJsonScript, NodeDependencyType } from '../shared/rules/packageJson';
import { dependencies } from './latest-versions/package.json';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function toolchainPatchPackage(_options: any): Rule {
  return chain([
    addPackageJsonDependency(dependencies, ['patch-package', 'postinstall-postinstall'], NodeDependencyType.Dev),
    addPackageJsonScript({
      postinstall: 'patch-package',
      'patch-package': "patch-package --exclude 'the-file-not-exist'",
    }),
  ]);
}
