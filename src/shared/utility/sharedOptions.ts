import { schematics } from '../../collection.json';

const optionsMap: Partial<Record<keyof typeof schematics, Record<string, any>>> = {};

export function sharedOptionsOf<T extends Record<string, any>>(schematicName: keyof typeof schematics): T {
  return (optionsMap[schematicName] || {}) as any;
}

export function shareOptions(schematicName: keyof typeof schematics, options: Record<string, any>) {
  return (optionsMap[schematicName] = options);
}
