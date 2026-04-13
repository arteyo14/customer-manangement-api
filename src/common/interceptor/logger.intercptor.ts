import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request, Response } from 'express';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(
    context: ExecutionContext,
    next: CallHandler<unknown>,
  ): Observable<unknown> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const { method, url, query } = request;
    const now = Date.now();

    return next.handle().pipe(
      tap((data: unknown) => {
        const response = ctx.getResponse<Response>();
        const statusCode = response.statusCode;
        const delay = Date.now() - now;

        this.logger.log(
          `[${method}] ${url} - Status: ${statusCode} - Delay: ${delay}ms`,
        );

        if (Object.keys(query).length) {
          this.logger.debug(`Query: ${JSON.stringify(query)}`);
        }

        const resData = data as { items?: unknown[]; total?: number };
        if (resData && Array.isArray(resData.items)) {
          this.logger.log(
            `Returned ${resData.items.length} items from total ${resData.total || 0}`,
          );
        }
      }),
    );
  }
}
