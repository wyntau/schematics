export interface IToolchainEslintOptions {
  'toolchain-typescript': boolean;
  'toolchain-prettier': boolean;
  'toolchain-lerna': boolean;
  target: 'node' | 'react' | 'react-with-jsx-runtime' | 'vue';
}
