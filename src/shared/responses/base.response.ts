import { HttpStatus } from '@nestjs/common';

interface IBaseResponse<T> {
  data: T;
  statusCode: number;
  timestamp: number;
  message: string;
}

export class BaseResponse<T = any> implements IBaseResponse<T> {
  data: T;
  statusCode: number;
  timestamp: number;
  message: string;

  constructor() {
    const errorMessage = 'Internal server error';

    this.message = errorMessage;

    this.setData(null)
      .setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR)
      .setTimestamp(Date.now())
      .setMessage(errorMessage);
  }

  getError(): string | object {
    return this.toJSON();
  }

  initMessage(): void {
    this.setMessage(this.message);
  }

  public setData(data: T) {
    this.data = data;
    return this;
  }

  public setStatusCode(statusCode: number) {
    this.statusCode = statusCode;
    return this;
  }

  public setTimestamp(timestamp: number = Date.now()) {
    this.timestamp = timestamp;
    return this;
  }

  public setMessage(message: string) {
    this.message = message;
    this.message = message;
    return this;
  }

  public build(res: BaseResponse) {
    this.data = res.data;
    this.message = res.message;
    this.statusCode = res.statusCode;
    this.timestamp = Date.now();
    this.message = res.message;
    return this;
  }

  public toJSON() {
    return {
      data: this.data,
      statusCode: this.statusCode,
      timestamp: this.timestamp,
      message: this.message
    };
  }
}
