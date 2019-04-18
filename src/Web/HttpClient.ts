import { net, ClientRequest } from 'electron';
import { IExchangeContent } from '../Models/IExchangeContent';

export class HttpClient {

    public static Request<T>(options: Object, handle: Function, tojson: boolean = true) {
        const requestOptions: Object = {
            method: 'GET',
            protocol: 'http:',
            hostname: 'localhost',
            port: 80,
            path: '/',
            ...options
        }

        const request: ClientRequest = net.request(requestOptions);

        request.on('response', (response) => {
            const headers: any = JSON.stringify(response.headers);
            const status = response.statusCode;

            response.on('data', (chunk: Buffer) => {
                if (tojson) {
                    const data = <T> JSON.parse(chunk.toString());
                    handle(status, data);
                } else {
                    handle(status, chunk.toString());
                }
            });
        });

        request.end();
    }

}