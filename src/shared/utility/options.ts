const optionsMap: Record<string, Record<string, any>> = {};

export function getSchematicOptions<T extends Record<string, any>>(schematicName: string): T {
  return (optionsMap[schematicName] || {}) as any;
}

export function setSchematicOptions(schematicName: string, options: Record<string, any>) {
  return (optionsMap[schematicName] = options);
}
