import { defaults, type Schema } from './schema';
import * as store from './store'

export type { Schema, PersistedAccount } from './schema'
export { defaults } from './schema'

const _state: Schema = defaults;

export const get = <K extends keyof Schema>(key: K): Schema[K] => {
  return _state[key];
}

export const write = <K extends keyof Schema>(key: K, value: Schema[K]): void => {
  _state[key] = value;
  store.write(_state);
}