import { IPaginationOptions } from './pagination.interface';

export interface IDataFilter extends Partial<IPaginationOptions> {
  keyword?: string;
}
