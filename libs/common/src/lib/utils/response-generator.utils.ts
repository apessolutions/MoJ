import { PageMetaDto, PageOptionsDto } from '@./contract';
import {
  IPaginationResponse,
  IResponse,
  IResponseArray,
} from '@./common/types/response.type';

export class ResponseGenerator {
  static generateResourceFormat<T = object>(
    data: T,
    statusCode = 200
  ): IResponse<T> {
    return { data, statusCode };
  }

  static generateResourceArrayFormat<T>(
    data: T[],
    statusCode = 200
  ): IResponseArray<T> {
    return { data, statusCode };
  }

  static generatePaginationFormat<T>(
    data: T[],
    count: number,
    pageOptionsDto: PageOptionsDto,
    statusCode = 200
  ): IPaginationResponse<T> {
    const metadata = new PageMetaDto({ pageOptionsDto, itemCount: count });
    return { data: { data, ...metadata }, statusCode };
  }
}
