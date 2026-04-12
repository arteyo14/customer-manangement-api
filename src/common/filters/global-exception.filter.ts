import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { IErrorPayload, IResponse } from "../interface/response.interface";



@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        let errorPayload: IErrorPayload = { message: "Internal Server Error" };

        if (exception instanceof HttpException) {
            statusCode = exception.getStatus();
            const exceptionResponse = exception.getResponse();

            if (typeof exceptionResponse === "string") {
                errorPayload = { message: exceptionResponse }
            } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
                const resObj = exceptionResponse as any;

                if (Array.isArray(resObj.message)) {
                    const fieldErrors: Record<string, string> = {}
                    resObj.message.forEach((msg: string) => {
                        const field = msg.split(' ')[0];
                        if (!fieldErrors[field]) {
                            fieldErrors[field] = msg;
                        }
                    })

                    errorPayload = { message: fieldErrors }
                } else if (typeof resObj.message === 'string') {
                    errorPayload = { message: resObj.message }
                } else {
                    const { statusCode, error, ...customeErrors } = resObj;
                    if (Object.keys(customeErrors).length > 0) {
                        errorPayload = { message: customeErrors }
                    } else {
                        errorPayload = { message: error || 'Unknown Error' }
                    }
                }
            }
        } else {
            console.log('Unhandle Exception: ', exception)
        }

        const errorResponse: IResponse = {
            status: false,
            code: statusCode,
            error: errorPayload
        }

        response.status(statusCode).json(errorResponse)
    }
}