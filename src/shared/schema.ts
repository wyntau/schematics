import { CamelCasedProperties, KebabCasedProperties } from 'type-fest';
import debugLib from 'debug';
import { strings } from '@angular-devkit/core';

const debug = debugLib('@wyntau/schematics:shared/schema');

export function camelCasedOptions<T extends Record<string, any>>(input: T): CamelCasedProperties<T> {
  const options = Object.keys(input).reduce((output: Record<string, any>, cur: string) => {
    output[strings.camelize(cur)] = input[cur];
    return output;
  }, {}) as CamelCasedProperties<T>;

  debug('normalized options %o', options);
  return options;
}

export function kebabCasedOptions<T extends Record<string, any>>(input: T): KebabCasedProperties<T> {
  const options = Object.keys(input).reduce((output: Record<string, any>, cur: string) => {
    output[strings.dasherize(cur)] = input[cur];
    return output;
  }, {}) as KebabCasedProperties<T>;

  debug('normalized options %o', options);
  return options;
}

type Unprefix<
  T extends keyof any,
  Prefix extends string,
  Delimiter extends string = '-'
> = T extends `${Prefix}${Delimiter}${infer P}` ? P : T;

type Prefix<
  T extends keyof any,
  Keys extends string,
  Pattern extends string,
  Delimiter extends string = '-'
> = T extends Keys ? `${Pattern}${Delimiter}${T}` : T;

export type UnprefixedOptions<T extends Record<string, any>, Prefix extends string> = {
  [P in keyof T as Unprefix<P, Prefix>]: T[P];
};

export type PrefixedOptions<T extends Record<string, any>, Keys extends string, Pattern extends string> = {
  [P in Keys as Prefix<P, Keys, Pattern>]: T[P];
} & Omit<T, Keys>;

export function unprefixedOptions<T extends Record<string, any>, U extends string>(
  input: T,
  prefix: U
): UnprefixedOptions<T, U> {
  const options = Object.keys(input).reduce((output: Record<string, any>, cur) => {
    if (cur.indexOf(prefix) == 0) {
      const key = cur.substr(prefix.length + 1);
      if (key) {
        output[key] = input[cur];
      }
    } else {
      output[cur] = input[cur];
    }
    return output;
  }, {}) as UnprefixedOptions<T, U>;

  debug('unprefixed %s options %o', prefix, options);
  return options;
}

export function prefixedOptions<T extends Record<string, any>, Keys extends string, Pattern extends string>(
  input: T,
  keys: Array<Keys>,
  pattern: Pattern
): PrefixedOptions<T, Keys, Pattern> {
  const options = Object.keys(input).reduce((output: Record<string, any>, cur: string) => {
    if (keys.indexOf(cur as Keys) >= 0) {
      output[`${pattern}-${cur}`] = input[cur];
    } else {
      output[cur] = input[cur];
    }
    return output;
  }, {}) as PrefixedOptions<T, Keys, Pattern>;

  debug('prefixed %s options %o', pattern, options);
  return options;
}

export function specializedOptions<T extends Record<string, any>, Prefix extends string>(
  options: T,
  prefix: Prefix
): CamelCasedProperties<UnprefixedOptions<T, Prefix>> {
  return camelCasedOptions(unprefixedOptions(options, prefix));
}

export function normalizedOptions<T extends Record<string, any>, Keys extends string, Pattern extends string>(
  options: T,
  keys: Array<Keys>,
  pattern: Pattern
): KebabCasedProperties<PrefixedOptions<T, Keys, Pattern>> {
  return kebabCasedOptions(prefixedOptions<T, Keys, Pattern>(options, keys, pattern));
}
