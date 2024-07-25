import { HttpStatus } from '@nestjs/common';
import { BaseResponse } from './base.response';
import { IPagination } from '../interfaces';

export class PaginateResponse<T> extends BaseResponse<T> implements IPagination {
  page: number;
  limit: number;
  totalDocuments: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number;
  prevPage: number;

  constructor(data: T, pagination: Pick<IPagination, 'page' | 'limit' | 'totalDocuments'>) {
    super();
    this.setData(data).setStatusCode(HttpStatus.OK).setMessage('Success');
    this.setPagination(pagination);
  }

  getError(): string | object {
    return null;
  }

  public setPagination(pagination: Pick<IPagination, 'page' | 'limit' | 'totalDocuments'>) {
    const totalPages = Math.ceil(pagination.totalDocuments / (pagination.limit || 1));

    this.page = pagination.page;
    this.limit = pagination.limit || 1;
    this.totalDocuments = pagination.totalDocuments;
    this.totalPages = totalPages;
    this.hasNextPage = pagination.page < totalPages;
    this.hasPrevPage = pagination.page > 1;
    this.nextPage = pagination.page < totalPages ? pagination.page + 1 : null;
    this.prevPage = pagination.page > 1 ? pagination.page - 1 : null;

    return this;
  }

  public override toJSON() {
    return {
      ...super.toJSON(),
      success: true,
      page: this.page,
      limit: this.limit,
      totalDocuments: this.totalDocuments,
      totalPages: this.totalPages,
      hasNextPage: this.hasNextPage,
      hasPrevPage: this.hasPrevPage,
      nextPage: this.nextPage,
      prevPage: this.prevPage
    };
  }
}
