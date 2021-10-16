export interface IStarterTypescriptOptions {
  toolchain: Array<
    | 'npm'
    | 'typescript'
    | 'commitlint'
    | 'eslint'
    | 'husky'
    | 'lerna'
    | 'lint-recently'
    | 'lint-staged'
    | 'nvm'
    | 'patch-package'
    | 'prettier'
    | 'yarn'
  >;
  target: 'node' | 'react' | 'react-with-jsx-runtime' | 'vue';
}
