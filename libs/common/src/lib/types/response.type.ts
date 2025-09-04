import { PageMetaDto } from '@./contract';

type ObjectType<T> = {
  data: T;
  statusCode: number;
};
export type IResponse<T> = ObjectType<T>;

type ArrayType<T> = {
  data: T[];
  statusCode: number;
};
export type IResponseArray<T> = ArrayType<T>;

export type IPaginationResponse<T> = {
  data: { data: T[] } & PageMetaDto;
  statusCode: number;
};
