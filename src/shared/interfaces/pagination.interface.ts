export interface IPaginationOptions {
  page: number;
  limit: number;
}

export interface IPagination extends IPaginationOptions {
  totalDocuments: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}
