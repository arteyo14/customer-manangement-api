import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Response } from 'express';
import { IResponse } from '../interface/response.interface';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  IResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<IResponse<T>> {
    return next.handle().pipe(
      map((data: T) => {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse<Response>();

        if (response.statusCode >= 400) {
          return data as unknown as IResponse<T>;
        }

        return {
          status: true,
          code: response.statusCode,
          data: data ?? ({} as T),
        };
      }),
    );
  }
}
