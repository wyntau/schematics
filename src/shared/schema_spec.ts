import { camelCasedOptions, kebabCasedOptions } from './schema';

describe('schema utility functions', () => {
  it('camelCasedOptions', () => {
    const options = {
      'toolchain-eslint': true,
      'toolchain-commitlint': true,
    };

    expect(camelCasedOptions(options, 'test')).toEqual({ toolchainCommitlint: true, toolchainEslint: false });
  });

  it('kebabCasedOptions', () => {
    const options = {
      toolchainEslint: true,
      toolchainCommitlint: true,
    };

    expect(kebabCasedOptions(options, 'test')).toEqual({ 'toolchain-eslint': true, 'toolchain-commitlint': true });
  });
});
