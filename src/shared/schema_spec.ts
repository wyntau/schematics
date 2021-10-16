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

    expect(camelCasedOptions(options)).toEqual({ toolchainCommitlint: false, toolchainEslint: true });
  });

  it('kebabCasedOptions', () => {
    const options = {
      toolchainEslint: true,
      toolchainCommitlint: true,
    };

    expect(kebabCasedOptions(options)).toEqual({ 'toolchain-eslint': true, 'toolchain-commitlint': true });
  });

  it('prefixedOptions', () => {
    const options = {
      foo: true,
      bar: false,
      baz: 'baz',
    };

    expect(prefixedOptions<typeof options, 'foo' | 'bar', 'prefix'>(options, ['foo', 'bar'], 'prefix')).toEqual({
      'prefix-foo': true,
      'prefix-bar': false,
      baz: 'baz',
    });
  });

  it('unprefixedOptions', () => {
    const options = {
      'prefix-foo': true,
      'prefix-bar': false,
      baz: 'baz',
    };

    expect(unprefixedOptions<typeof options, 'prefix'>(options, 'prefix')).toEqual({
      foo: true,
      bar: false,
      baz: 'baz',
    });
  });

  it('unprefixedOptions with multi prefix', () => {
    const options = {
      'foo-foo': true,
      'bar-bar': false,
      baz: 'baz',
    };

    expect(unprefixedOptions(options, ['foo', 'bar'])).toEqual({ foo: true, bar: false, baz: 'baz' });
  });

  it('unprefixedOptions with no-', () => {
    const options = {
      'foo-no-foo': true,
      'bar-bar': false,
      baz: 'baz',
    };
    expect(unprefixedOptions(options, 'foo')).toEqual({ foo: false, 'bar-bar': false, baz: 'baz' });
  });

  it('normalizeOptions', () => {
    const options = {
      fooBar: true,
      barFoo: false,
      bazBaz: 'baz',
    };

    expect(
      normalizedOptions<typeof options, 'fooBar' | 'barFoo', 'prefix'>(options, ['fooBar', 'barFoo'], 'prefix')
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

    expect(specializedOptions(options, 'prefix')).toEqual({ fooBar: true, barFoo: false, bazBaz: 'baz' });
  });
});
