import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RpcErrorCodeEnum } from '../rpc.types';

export function mapRpcErrorToHttp(err: any): never {
  const payload = err?.error ?? err;

  const code = payload?.code as string | undefined;
  const message = payload?.message ?? 'Request failed!!!';

  if (
    code === RpcErrorCodeEnum.BAD_REQUEST ||
    code === RpcErrorCodeEnum.VALIDATION_ERROR
  ) {
    throw new BadRequestException(message);
  }

  if (code === RpcErrorCodeEnum.NOT_FOUND) {
    throw new NotFoundException(message);
  }

  if (code === RpcErrorCodeEnum.UNAUTHORIZED) {
    throw new UnauthorizedException(message);
  }

  if (code === RpcErrorCodeEnum.FORBIDDEN) {
    throw new ForbiddenException(message);
  }

  throw new InternalServerErrorException(message);
}
