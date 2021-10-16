import { camelCasedOptions, kebabCasedOptions, prefixedOptions, unprefixedOptions } from './schema';

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

  it('prefixedOptions', () => {
    const options = {
      foo: true,
      bar: false,
      baz: 'baz',
    };

    expect(prefixedOptions<typeof options, 'foo' | 'bar', 'prefix'>(options, ['foo', 'bar'], 'prefix', 'test')).toEqual(
      {
        'prefix-foo': true,
        'prefix-bar': false,
        baz: 'baz',
      }
    );
  });

  it('unprefixedOptions', () => {
    const options = {
      'prefix-foo': true,
      'prefix-bar': false,
      baz: 'baz',
    };

    expect(unprefixedOptions<typeof options, 'prefix'>(options, 'prefix', 'test')).toEqual({
      foo: true,
      bar: false,
      baz: 'baz',
    });
  });
});
