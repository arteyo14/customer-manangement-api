

export type IErrorPayload = {
    message: string | string[] | Record<string, string> | unknown
}

export interface IResponse<T = any> {
    status: boolean;
    code: number;
    data?: T;
    error?: IErrorPayload;
}