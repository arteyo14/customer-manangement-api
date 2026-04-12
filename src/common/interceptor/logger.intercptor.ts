import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";


@Injectable()
export class LoggerInterceptor implements NestInterceptor {
    private readonly logger = new Logger('HTTP');

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();
        const { method, url, body, query } = request;
        const now = Date.now();

        return next.handle().pipe(
            tap((data) => {
                const response = ctx.getResponse();
                const statusCode = response.statusCode;
                const delay = Date.now() - now;

                this.logger.log(
                    `[${method}] ${url} - Status: ${statusCode} - Delay: ${delay}ms`
                );

                if (Object.keys(query).length) {
                    this.logger.debug(`Query: ${JSON.stringify(query)}`);
                }

                if (data && data.items) {
                    this.logger.log(`Returned ${data.items.length} items from total ${data.total}`);
                }
            })
        )
    }
}