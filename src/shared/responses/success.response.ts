import { HttpStatus } from '@nestjs/common';
import { BaseResponse } from './base.response';

export class SuccessResponse<T> extends BaseResponse<T> {
  constructor(data: T, message: string = 'Success') {
    super();
    this.setData(data).setStatusCode(HttpStatus.OK).setMessage(message);
  }

  getError(): string | object {
    return null;
  }

  public override toJSON() {
    return {
      ...super.toJSON(),
      success: true
    };
  }
}
