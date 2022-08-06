export type ModelConstructor<T> = {
  new (): T;
};
export type Filter<T extends Record<string, any>, K extends keyof T> = {
  field: K;
} & {
  operator: "=";
  value: T[K];
};
export type Repository<T extends Record<string, any>> = {
  name(): string;
  create(data: Omit<T, "id">): Promise<T>;
  readMany<K extends keyof T>(...filters: Filter<T, K>[]): Promise<T[]>;
  read(id: string): Promise<T>;
  update(id: string, data: T): Promise<T>;
  delete(id: string): Promise<T>;
};
