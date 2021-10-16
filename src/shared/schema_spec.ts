import {
  camelCasedOptions,
  kebabCasedOptions,
  normalizedOptions,
  prefixedOptions,
  specializedOptions,
  unprefixedOptions,
} from './schema';

describe('schema utility functions', () => {
  it('camelCasedOptions', () => {
    const options = {
      'toolchain-eslint': true,
      'toolchain-commitlint': false,
    };

    expect(camelCasedOptions(options, 'test')).toEqual({ toolchainCommitlint: false, toolchainEslint: true });
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

  it('normalizeOptions', () => {
    const options = {
      fooBar: true,
      barFoo: false,
      bazBaz: 'baz',
    };

    expect(
      normalizedOptions<typeof options, 'fooBar' | 'barFoo', 'prefix'>(options, ['fooBar', 'barFoo'], 'prefix', 'test')
    ).toEqual({
      'prefix-foo-bar': true,
      'prefix-bar-foo': false,
      'baz-baz': 'baz',
    });
  });

  it('specializedOptions', () => {
    const options = {
      'prefix-foo-bar': true,
      'prefix-bar-foo': false,
      'baz-baz': 'baz',
    };

    expect(specializedOptions(options, 'prefix', 'teset')).toEqual({ fooBar: true, barFoo: false, bazBaz: 'baz' });
  });
});
