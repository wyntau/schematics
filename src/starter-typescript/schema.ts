export interface IStarterTypescriptOptions {
  toolchain: Array<
    | 'commitlint'
    | 'eslint'
    | 'husky'
    | 'lerna'
    | 'lint-recently'
    | 'lint-staged'
    | 'npm'
    | 'nvm'
    | 'patch-package'
    | 'prettier'
    | 'typescript'
    | 'yarn'
  >;
  target: 'node' | 'react' | 'react-with-jsx-runtime' | 'vue';
}
