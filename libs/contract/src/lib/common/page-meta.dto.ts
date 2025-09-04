import { PageOptionsDto } from './page-option.dto';

export interface PageMetaDtoParameters {
  pageOptionsDto: PageOptionsDto;
  itemCount: number;
}

export class PageMetaDto {
  readonly page: number;
  readonly take: number;
  readonly totalRecords: number;
  readonly hasPreviousPage: boolean;
  readonly hasNextPage: boolean;
  readonly totalPages: number;
  constructor({ pageOptionsDto, itemCount }: PageMetaDtoParameters) {
    this.page = pageOptionsDto.page;
    this.take = pageOptionsDto.limit;
    this.totalRecords = itemCount;
    this.totalPages = Math.ceil(this.totalRecords / this.take);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.totalPages;
  }
}
