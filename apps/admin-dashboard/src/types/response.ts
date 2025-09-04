export interface ApiResponse<T> {
  data: T;
  statusCode: number;
}

export interface ApiPaginatedResponse<T> {
  data: {
    data: T[];
    page: number;
    take: number;
    totalRecords: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

export interface ApiError<T = unknown> {
  message: string;
  errors: { [P in keyof T]?: string };
  statusCode: number;
}
