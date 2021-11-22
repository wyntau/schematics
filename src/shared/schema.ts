import { CamelCasedProperties, KebabCasedProperties } from 'type-fest';
import { debugLib } from '../shared/utility/debug';
import { strings } from '@angular-devkit/core';

const debug = debugLib('shared/schema');

export function camelCasedOptions<T extends Record<string, any>>(input: T, requestFrom = ''): CamelCasedProperties<T> {
  const options = Object.keys(input).reduce<Record<string, any>>(
    (output, cur) => ({ ...output, [strings.camelize(cur)]: input[cur] }),
    {}
  ) as CamelCasedProperties<T>;

  debug('camelCased %s options %O', requestFrom, options);
  return options;
}

export function kebabCasedOptions<T extends Record<string, any>>(input: T, requestFrom = ''): KebabCasedProperties<T> {
  const options = Object.keys(input).reduce<Record<string, any>>(
    (output, cur) => ({ ...output, [strings.dasherize(cur)]: input[cur] }),
    {}
  ) as KebabCasedProperties<T>;

  debug('kebabCased %s options %O', requestFrom, options);
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
  [P in keyof T as Unprefix<Unprefix<P, Prefix>, 'no'>]: T[P];
};

export type PrefixedOptions<T extends Record<string, any>, Keys extends string, Pattern extends string> = {
  [P in Keys as Prefix<P, Keys, Pattern>]: T[P];
} & Omit<T, Keys>;

export function unprefixedOptions<T extends Record<string, any>, U extends string>(
  input: T,
  prefixs: U | Array<U>
): UnprefixedOptions<T, U> {
  const options = Object.keys(input).reduce((output: Record<string, any>, cur) => {
    prefixs = Array.isArray(prefixs) ? prefixs : [prefixs];
    const prefix = prefixs.find((item) => cur.indexOf(item) === 0);

    if (prefix) {
      const key = cur.substr(prefix.length + 1);
      // 截断后，变为空字符串则不处理，相当于把此选项清除
      if (key) {
        // convert no-xxx to xxx=false
        if (key.indexOf('no-') === 0) {
          output[key.substr(3)] = false;
        } else {
          output[key] = input[cur];
        }
      }
    } else {
      output[cur] = input[cur];
    }
    return output;
  }, {}) as UnprefixedOptions<T, U>;

  debug('unprefixed %s options %O', prefixs, options);
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

  debug('prefixed %s options %O', pattern, options);
  return options;
}

export function specializedOptions<T extends Record<string, any>, Prefix extends string>(
  options: T,
  prefix: Prefix
): CamelCasedProperties<UnprefixedOptions<T, Prefix>> {
  return camelCasedOptions(unprefixedOptions(options, prefix), prefix);
}

export function normalizedOptions<T extends Record<string, any>, Keys extends string, Pattern extends string>(
  options: T,
  keys: Array<Keys>,
  pattern: Pattern
): KebabCasedProperties<PrefixedOptions<T, Keys, Pattern>> {
  return kebabCasedOptions(prefixedOptions<T, Keys, Pattern>(options, keys, pattern), pattern);
}
