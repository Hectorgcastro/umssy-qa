import {
  Catch,
  HttpException,
  HttpStatus,
  Logger,
  type ArgumentsHost,
  type ExceptionFilter,
} from '@nestjs/common';
import type { Response } from 'express';
import type { ApiResponse } from '../types/api-response.types.js';

const INTERNAL_ERROR_DETAIL = 'Ocurrió un error interno en el servidor';

function getExceptionDetail(exception: HttpException): string {
  const response = exception.getResponse();

  if (typeof response === 'string') {
    return response;
  }

  const { message } = response as { message?: string | string[] };
  if (Array.isArray(message)) {
    return message.join('; ');
  }
  return message ?? exception.message;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const isHttpException = exception instanceof HttpException;
    const statusCode = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    if (!isHttpException) {
      this.logger.error(exception);
    }

    const body: ApiResponse<null> = {
      statusCode,
      data: null,
      detail: isHttpException
        ? getExceptionDetail(exception)
        : INTERNAL_ERROR_DETAIL,
      ok: false,
    };

    response.status(statusCode).json(body);
  }
}
