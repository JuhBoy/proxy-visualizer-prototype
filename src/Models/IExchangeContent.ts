
export interface IExchangeContent {
    uuid: string;
    timings: ITiming[];
    requestHeaders: string[];
    responseHeaders: string[];
    requestBody: number[];
    responseBody: number[];
}

export interface ITiming {
    name: string;
    msTime: number;
}
