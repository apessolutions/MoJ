export type IPaginationResult<T> = Readonly<{
  data: T[];
  count: number;
}>;
