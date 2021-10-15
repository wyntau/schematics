export interface IToolchainEslintOptions {
  toolchain: Array<'typescript' | 'prettier' | 'lerna'>;
  target: 'node' | 'react' | 'react-with-jsx-runtime' | 'vue';
}
