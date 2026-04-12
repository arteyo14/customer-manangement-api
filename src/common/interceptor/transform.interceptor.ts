import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";
import { IResponse } from "../interface/response.interface";




@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, IResponse<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<IResponse<T>> {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse();
        const statusCode = response.statusCode;

        return next.handle().pipe(
            map((data) => ({
                status: true,
                code: statusCode,
                data
            }))
        )
    }
}