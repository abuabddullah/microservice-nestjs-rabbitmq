import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseRpcExceptionFilter, RpcException } from '@nestjs/microservices';
import { Response } from 'express';
import { RpcErrorCodeEnum, RpcErrorPayload } from './rpc.types';

// this filter run -> inside the microservice process
// our payload structure should follow the way that we want

@Catch()
export class RpcAllExceptionFilter extends BaseRpcExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    if (exception instanceof RpcException) {
      return super.catch(exception, host);
    }

    const status = exception?.getStatus?.();
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (status === 400) {
      const payload: RpcErrorPayload = {
        code: RpcErrorCodeEnum.VALIDATION_ERROR,
        message: 'Validation failed',
        details: response,
      };

      return super.catch(new RpcException(payload), host);
    }

    const payload: RpcErrorPayload = {
      code: RpcErrorCodeEnum.INTERNAL,
      message: 'Internal error',
    };

    return super.catch(new RpcException(payload), host);
  }
}
