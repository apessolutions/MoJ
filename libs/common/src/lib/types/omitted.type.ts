export type OmittedType<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;
