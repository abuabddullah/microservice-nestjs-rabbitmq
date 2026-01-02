export enum RpcErrorCodeEnum {
  BAD_REQUEST = 'BAD_REQUEST',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INTERNAL = 'INTERNAL',
}

export type RpcErrorPayload = {
  code: RpcErrorCodeEnum;

  message: string;

  details?: string | object | Array<any> | null;
};
