import _debugLib from 'debug';
import { packageName } from '../constant';

export function debugLib(namespace: string) {
  return _debugLib(`${packageName}:${namespace}`);
}
