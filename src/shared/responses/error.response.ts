import { HttpStatus } from '@nestjs/common';
import { BaseResponse } from './base.response';

export class ErrorResponse<T> extends BaseResponse<T> {
  private _stackTrace: string;
  private _exceptionName: string;

  constructor(message: string = 'Error') {
    super();
    this.setData(null).setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR).setMessage(message);
  }

  public setStackTrace(stack: string) {
    this._stackTrace = stack;
    return this;
  }

  public setExceptionName(exceptionName: string) {
    this._exceptionName = exceptionName;
    return this;
  }

  public getStackTrace(): string {
    return this._stackTrace;
  }

  public getExceptionName(): string {
    return this._exceptionName;
  }

  public override toJSON() {
    const response = {
      ...super.toJSON(),
      stackTrace: this._stackTrace ?? null,
      exceptionName: this._exceptionName ?? null,
      success: false
    };

    process.env.NODE_ENV === 'production' && delete response.stackTrace;
    process.env.NODE_ENV === 'production' && delete response.exceptionName;

    return response;
  }

  public override build(res: ErrorResponse<T>) {
    super.build(res).setStackTrace(res._stackTrace).setExceptionName(res._exceptionName);
    return this;
  }
}
