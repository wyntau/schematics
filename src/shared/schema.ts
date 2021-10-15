import { CamelCasedProperties } from 'type-fest';
import camelize from 'camelize';

export function camelCasedOptions<T extends Record<string, any>>(input: T): CamelCasedProperties<T> {
  return Object.keys(input).reduce((output: Record<string, any>, cur: string) => {
    output[camelize(cur)] = input[cur];
    return output;
  }, {}) as CamelCasedProperties<T>;
}
