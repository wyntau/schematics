export { default as schemaJson } from './schema.json';
export interface IStarterJavascriptOptions {
  'toolchain-typescript': boolean;
  toolchain: Array<
    | 'commitlint'
    | 'eslint'
    | 'husky'
    | 'lerna'
    | 'lint-recently'
    | 'lint-staged'
    | 'patch-package'
    | 'prettier'
    | 'renovate'
  >;
  target: 'node' | 'react' | 'react-enable-jsx-runtime' | 'vue';
}
