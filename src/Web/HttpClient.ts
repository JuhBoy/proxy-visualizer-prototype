import { net, ClientRequest } from 'electron';

export class HttpClient {

    public static Request<T>(options: any, handle: (s: number, d: T) => void) {
        const requestOptions: object = {
            method: 'GET',
            protocol: 'http:',
            hostname: process.env.HOST,
            port: process.env.PORT,
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

        if (options.body)
            request.end(Buffer.from(JSON.stringify(options.body)));
        else
            request.end();
    }
}
