import { defaults, type Schema } from './schema';
import * as store from './store'

export type { Schema, PersistedAccount } from './schema'
export { defaults } from './schema'

let _state: Schema = defaults;

export const init = async (): Promise<void> => {
  const stored = store.read();
  if (stored === null || stored === undefined) {
    store.write(defaults);
  }

  _state = stored ?? defaults;
}

export const get = <K extends keyof Schema>(key: K): Schema[K] => {
  return _state[key];
}

export const write = <K extends keyof Schema>(key: K, value: Schema[K]): void => {
  _state[key] = value;
  store.write(_state);
}
