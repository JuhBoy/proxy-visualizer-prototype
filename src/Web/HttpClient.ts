import { net, ClientRequest } from 'electron';
import { HashStr } from '../Utils/Collections';

type RspCallback = (s: number, d:any) => void;

export class HttpClient {


    public static Request<T>(options: any, handle: RspCallback, error: RspCallback = null) {
        const requestOptions: any = {
            method: 'GET',
            protocol: 'http:',
            hostname: process.env.HOST,
            port: +process.env.PORT,
            path: '/',
            ...options
        }

        const request: ClientRequest = net.request(requestOptions);
        request.followRedirect();

        console.log("starting " + Date.now().toString());

        request.on('response', (response) => {
            const status = response.statusCode;
            let body: string = '';

            response.on('data', (chunk: Buffer) => {
                if (chunk) {
                    body += chunk.toString();
                }
            });

            response.on('end', () => {
                console.log("ending " + Date.now().toString());
                if (status == 200) {
                    const data = JSON.parse(body) as T;
                    handle(status, data);
                } else if (error) {
                    error(status, body);
                }
            });
        });

        request.on('error', (error) => {
            console.log("[HTTP]", error);
        });

        if (options.body)
            request.end(Buffer.from(JSON.stringify(options.body)));
        else
            request.end();
    }

    public static toPercentEncodingText(text: string): string {
        return encodeURIComponent(text);
    }

    public static toPercentEncodingParameters(params: HashStr<string>): string {
        let result: string[] = [];
        const keys = Object.keys(params);
        keys.forEach(key => {
            result.push(`${key}=${encodeURIComponent(params[key])}`);
        });
        return `?${result.join('&')}`;
    }
}
