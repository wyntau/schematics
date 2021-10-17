export { default as schemaJson } from './schema.json';
export interface IToolchainEslintOptions {
  'toolchain-typescript': boolean;
  'toolchain-prettier': boolean;
  'toolchain-lerna': boolean;
  target: 'node' | 'react' | 'react-enable-jsx-runtime' | 'vue';
}
