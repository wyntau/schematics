import { CamelCasedProperties, KebabCasedProperties } from 'type-fest';
import debugLib from 'debug';
import { strings } from '@angular-devkit/core';

const debug = debugLib('@wyntau/schematics:shared/schema');

export function camelCasedOptions<T extends Record<string, any>>(input: T, section: string): CamelCasedProperties<T> {
  const options = Object.keys(input).reduce((output: Record<string, any>, cur: string) => {
    output[strings.camelize(cur)] = input[cur];
    return output;
  }, {}) as CamelCasedProperties<T>;

  debug('normalized %s options %o', section, options);
  return options;
}

export function kebabCasedOptions<T extends Record<string, any>>(input: T, section: string): KebabCasedProperties<T> {
  const options = Object.keys(input).reduce((output: Record<string, any>, cur: string) => {
    output[strings.dasherize(cur)] = input[cur];
    return output;
  }, {}) as KebabCasedProperties<T>;

  debug('normalized %s options %o', section, options);
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
  prefix: U,
  section: string
): UnprefixedOptions<T, U> {
  const options = Object.keys(input).reduce((output: Record<string, any>, cur) => {
    if (cur.indexOf(prefix) == 0) {
      const key = cur.substr(0, prefix.length + 1);
      if (key) {
        output[key] = input[cur];
      }
    } else {
      output[cur] = input[cur];
    }
    return output;
  }, {}) as UnprefixedOptions<T, U>;

  debug('unprefixed %s options %o', section, options);
  return options;
}

export function prefixedOptions<T extends Record<string, any>, Keys extends string, Pattern extends string>(
  input: T,
  keys: Array<string>,
  pattern: string,
  section: string
): PrefixedOptions<T, Keys, Pattern> {
  const options = Object.keys(input).reduce((output: Record<string, any>, cur: string) => {
    if (keys.indexOf(cur) >= 0) {
      output[`${pattern}-${cur}`] = input[cur];
    } else {
      output[cur] = input[cur];
    }
    return output;
  }, {}) as PrefixedOptions<T, Keys, Pattern>;

  debug('prefixed %s options %o', section, options);
  return options;
}
