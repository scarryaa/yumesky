import { type Schema, schema } from './schema';

const YSKY_STORAGE = 'YSKY_STORAGE';

export const write = (value: Schema): void => {
  schema.parse(value);
  localStorage.setItem(YSKY_STORAGE, JSON.stringify(value));
}

export const read = (): Schema | undefined => {
  const rawData = localStorage.getItem(YSKY_STORAGE);
  const objData = (rawData != null) ? JSON.parse(rawData) : undefined;
  if (schema.safeParse(objData).success) {
    return objData;
  }
}

export const clear = (): void => {
  localStorage.removeItem(YSKY_STORAGE);
}
