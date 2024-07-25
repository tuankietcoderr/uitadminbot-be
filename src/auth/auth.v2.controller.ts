import { Controller } from '@nestjs/common';

@Controller({
  path: 'auth',
  version: '2'
})
export class AuthControllerV2 {
  constructor() {}
}
