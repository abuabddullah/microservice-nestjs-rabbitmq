import { RpcException } from '@nestjs/microservices';
import { RpcErrorCodeEnum, RpcErrorPayload } from './rpc.types';

export function rpcBadRequest(
  message: string,
  details?: string | object | Array<any> | null,
): never {
  const payload: RpcErrorPayload = {
    code: RpcErrorCodeEnum.BAD_REQUEST,
    message,
    details,
  };
  throw new RpcException(payload);
}

export function rpcNotFound(
  message: string,
  details?: string | object | Array<any> | null,
): never {
  const payload: RpcErrorPayload = {
    code: RpcErrorCodeEnum.NOT_FOUND,
    message,
    details,
  };
  throw new RpcException(payload);
}

export function rpcInternal(
  message = 'Internal error',
  details?: string | object | Array<any> | null,
): never {
  const payload: RpcErrorPayload = {
    code: RpcErrorCodeEnum.INTERNAL,
    message,
    details,
  };
  throw new RpcException(payload);
}

export function rpcUnauthorized(
  message = 'Unauthorized',
  details?: string | object | Array<any> | null,
): never {
  const payload: RpcErrorPayload = {
    code: RpcErrorCodeEnum.UNAUTHORIZED,
    message,
    details,
  };
  throw new RpcException(payload);
}

export function rpcForbidden(
  message = 'Forbidden',
  details?: string | object | Array<any> | null,
): never {
  const payload: RpcErrorPayload = {
    code: RpcErrorCodeEnum.FORBIDDEN,
    message,
    details,
  };
  throw new RpcException(payload);
}
