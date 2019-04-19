import { net, ClientRequest } from 'electron';

export class HttpClient {

    public static Request<T>(options: object, handle: (s: number, d: T) => void) {
        const requestOptions: object = {
            method: 'GET',
            protocol: 'http:',
            hostname: 'localhost',
            port: 80,
            path: '/',
            ...options
        }

        const request: ClientRequest = net.request(requestOptions);

        request.on('response', (response) => {
            const status = response.statusCode;
            let body: string = '';

            response.on('data', (chunk: Buffer) => {
                body += chunk.toString();
            });

            response.on('end', () => {
                const data = JSON.parse(body) as T;
                handle(status, data);
            });
        });

        request.end();
    }

}