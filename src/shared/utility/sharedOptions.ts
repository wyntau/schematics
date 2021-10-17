const optionsMap: Record<string, Record<string, any>> = {};

export function sharedOptionsOf<T extends Record<string, any>>(schematicName: string): T {
  return (optionsMap[schematicName] || {}) as any;
}

export function shareOptions(schematicName: string, options: Record<string, any>) {
  return (optionsMap[schematicName] = options);
}
