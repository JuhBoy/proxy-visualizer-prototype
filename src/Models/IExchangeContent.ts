export interface IExchangeContent {
    uuid: string;
    timings: ITiming[];
    requestHeaders: string[];
    responseHeaders: string[];
    requestBody: string;
    responseBody: string;
}

export interface ITiming {
    name: string;
    msTime: number;
}
