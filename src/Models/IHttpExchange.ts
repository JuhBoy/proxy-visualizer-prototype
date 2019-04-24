export interface IHttpExchange {
    uuid: string;
    method: string;
    status: number;
    host: string;
    path: string;
    size: number;
}
