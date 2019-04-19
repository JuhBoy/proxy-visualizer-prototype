export interface IHttpExchange {
    uuid: string;
    protocol: string;
    status: number;
    host: string;
    path: string;
    time: number;
}