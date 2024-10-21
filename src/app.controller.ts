import { Controller, Get } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { ResponseMessage } from './utils/types/response-message';
import { Public } from './utils/decorators/public.decorator';

@Public()
@ApiExcludeController()
@Controller()
export class AppController {
  @Get()
  heatlCheck(): ResponseMessage {
    return { message: 'Server is running' };
  }
}
