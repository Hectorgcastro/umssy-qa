import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import type { Response } from 'express';

interface BusinessException extends Error {
  statusCode: number;
  code?: string;
}

@Catch()
export class JobOffersExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse() as any;

      if (
        status === 400 &&
        exceptionResponse?.error === 'VALIDATION_ERROR' &&
        Array.isArray(exceptionResponse.detalles)
      ) {
        response.status(422).json({
          statusCode: 422,
          data: null,
          detail: exceptionResponse.detalles,
          ok: false,
        });
        return;
      }

      response.status(status).json({
        statusCode: status,
        data: null,
        detail: exceptionResponse?.message || 'Error inesperado.',
        ok: false,
      });
      return;
    }

    const businessException = exception as BusinessException;
    if (
      businessException instanceof Error &&
      typeof businessException.statusCode === 'number'
    ) {
      response.status(businessException.statusCode).json({
        statusCode: businessException.statusCode,
        data: null,
        detail: businessException.message,
        ok: false,
      });
      return;
    }

    response.status(500).json({
      statusCode: 500,
      data: null,
      detail: 'Ocurrio un error inesperado. Intentelo mas tarde.',
      ok: false,
    });
  }
}