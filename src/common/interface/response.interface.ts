

export type IErrorPayload = {
    message: string | string[] | Record<string, string> | unknown
}

export interface IPaginationMeta<T = any> {
    total: number;
    items: T;
    page: number;
    limit: number;
    total_pages: number;
}

export interface IResponse<T = any> {
    status: boolean;
    code: number;
    data?: T | IPaginationMeta<T>;
    error?: IErrorPayload;
}