import { schematics } from '../../collection.json';
import debugLib from 'debug';

const debug = debugLib('@wyntau/schematics:shared/utility/sharedOptions');
const optionsMap: Partial<Record<keyof typeof schematics, Record<string, any>>> = {};

type SchematicName = keyof typeof schematics;

export function sharedOptionsOf<T extends Record<string, any>>(
  schematicName: SchematicName,
  requestFrom: SchematicName
): T {
  const sharedOptions = (optionsMap[schematicName] || {}) as any;
  debug('%s get sharedOptions of %s: %O', requestFrom, schematicName, sharedOptions);
  return sharedOptions;
}

export function shareOptions(schematicName: SchematicName, options: Record<string, any>) {
  debug('%s shareOptions: %O', schematicName, options);
  return (optionsMap[schematicName] = options);
}
