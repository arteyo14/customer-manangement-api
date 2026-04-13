import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { IErrorPayload, IResponse } from '../interface/response.interface';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorPayload: IErrorPayload = { message: 'Internal Server Error' };

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        errorPayload = { message: exceptionResponse };
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        const resObj = exceptionResponse as {
          message?: string | string[];
          error?: string;
          statusCode?: number;
          [key: string]: unknown;
        };

        if (Array.isArray(resObj.message)) {
          const fieldErrors: Record<string, string> = {};
          resObj.message.forEach((msg: string) => {
            const field = msg.split(' ')[0];
            if (!fieldErrors[field]) {
              fieldErrors[field] = msg;
            }
          });

          errorPayload = { message: fieldErrors };
        } else if (typeof resObj.message === 'string') {
          errorPayload = { message: resObj.message };
        } else {
          const {
            // statusCode: _ignoredStatusCode,
            error,
            ...customeErrors
          } = resObj;
          if (Object.keys(customeErrors).length > 0) {
            errorPayload = { message: customeErrors };
          } else {
            errorPayload = { message: error || 'Unknown Error' };
          }
        }
      }
    } else {
      this.logger.error('Unhandled Exception: ', exception);
    }

    const errorResponse: IResponse = {
      status: false,
      code: statusCode,
      error: errorPayload,
    };

    response.status(statusCode).json(errorResponse);
  }
}
