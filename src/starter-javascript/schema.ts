export interface IStarterJavascriptOptions {
  'toolchain-typescript': boolean;
  toolchain: Array<
    | 'npm'
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
  target: 'node' | 'react' | 'react-enable-jsx-runtime' | 'vue';
}
