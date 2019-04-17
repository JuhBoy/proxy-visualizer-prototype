const Websocket = require('ws');
const Http = require('http');

export class FakeServer {
    
    handle: Function;
    wss: any;
    started: boolean;
    sockets: any[];
    sampleBase: any;
    generatedSample: any;
    
    public constructor(startNow: boolean, handle: Function) {
        if (startNow)
        this.sampleBase = { uuid: "123553-AZER1235AEZRT-123EZR23FE2RFZREG", protocol: "HTTP 1.1", status: 200, host: "www.2befficient.fr", path: "/toto/1?no=yes", time: 2598 };
        this.generatedSample = {};
        this.startWebsocketServer();
        this.startHttpServer();
        this.handle = handle;
        this.sockets = [];
    }

    public startHttpServer() {
        const responseObj: any = {
            'uuid': '',
            'requestHeaders': [
                'access-control-allow-origin: *',
                'cache-control: max-age=0, private, must-revalidate',
                'cf-cache-status: HIT',
                'cf-ray: 4c8dc5f10d9fcdc1-CDG',
                'content-encoding: gzip',
                'content-type: application/json; charset=utf-8',
                'date: Wed, 17 Apr 2019 10:39:06 GMT',
                'etag: W/"17b75f9f53376cb9688a85cfa6d4bd2c"',
                'expect-ct: max-age=604800, report-uri="https://report-uri.cloudflare.com/cdn-cgi/beacon/expect-ct"',
                'referrer-policy: strict-origin-when-cross-origin',
                'server: cloudflare',
                'status: 200',
                'strict-transport-security: max-age=259200',
                'vary: Accept,Accept-Encoding,X-Forwarded-Host,X-Forwarded-Scheme,X-Forwarded-Proto,Fastly-SSL',
                'x-cache: HIT',
                'x-content-type-options: nosniff',
                'x-download-options: noopen',
                'x-permitted-cross-domain-policies: none',
                'x-request-id: e55d74ce-b5e1-4003-8359-dbea747ee61b',
                'x-runtime: 0.035608',
                'x-statuspage-skip-logging: true',
                'x-statuspage-version: 1d310a1c3a4143d50346e3b741a147d97b49f323',
                'x-xss-protection: 1; mode=block',
            ],
            'responseHeaders': [
                'access-control-allow-origin: *',
                'cache-control: max-age=0, private, must-revalidate',
                'cf-cache-status: HIT',
                'cf-ray: 4c8dc5f10d9fcdc1-CDG',
                'content-encoding: gzip',
                'content-type: application/json; charset=utf-8',
                'date: Wed, 17 Apr 2019 10:39:06 GMT',
                'etag: W/"17b75f9f53376cb9688a85cfa6d4bd2c"',
                'expect-ct: max-age=604800, report-uri="https://report-uri.cloudflare.com/cdn-cgi/beacon/expect-ct"',
                'referrer-policy: strict-origin-when-cross-origin',
                'server: cloudflare',
                'status: 200',
                'strict-transport-security: max-age=259200',
                'vary: Accept,Accept-Encoding,X-Forwarded-Host,X-Forwarded-Scheme,X-Forwarded-Proto,Fastly-SSL',
                'x-cache: HIT',
                'x-content-type-options: nosniff',
                'x-download-options: noopen',
                'x-permitted-cross-domain-policies: none',
                'x-request-id: e55d74ce-b5e1-4003-8359-dbea747ee61b',
                'x-runtime: 0.035608',
                'x-statuspage-skip-logging: true',
                'x-statuspage-version: 1d310a1c3a4143d50346e3b741a147d97b49f323',
                'x-xss-protection: 1; mode=block',
            ],
            'requestBody': [255, 12, 0, 145, 65,255, 12, 0, 145, 65,255, 12, 0, 145, 65,255, 12, 0, 145, 65,255, 12, 0, 145, 65,255, 12, 0, 145, 65,255, 12, 0, 145, 65,255, 12, 0, 145, 65],
            'responseBody': [255, 12, 0, 145, 65,255, 12, 0, 145, 65,255, 12, 0, 145, 65,255, 12, 0, 145, 65,255, 12, 0, 145, 65,255, 12, 0, 145, 65,255, 12, 0, 145, 65,255, 12, 0, 145, 65]
        }

        const server = Http.createServer((req: any, res: any) => {
            res.writeHead(200, { 'Content-Type': 'application/json', 'Content-Encoding': 'UTF-8' });
            const { url } = req;
            const index = url.indexOf('?uuid=');
            responseObj.uuid = url.substring(index + 6, url.length);
            responseObj.responseHeaders[0] = `HTTP/1.1 ${this.generatedSample[responseObj.uuid].status} OK`;

            res.write(JSON.stringify(responseObj));
            res.end();
        });
        server.listen(8887);
    }

    public startWebsocketServer() {
        this.wss = new Websocket.Server({ port: 8085 });

        this.wss.on('connection', (ws: any) => {
            this.handle('connection', ws);
            this.sockets.push(ws);
        });

        this.wss.on('close', (ws: any) => {
            this.handle('close', ws);
        });

        this.emulateDataFlow();
        this.started = true;
    }

    private emulateDataFlow() {
        let i = 0;
        const cachedStatus = require('../Models/StatusCodeLine').StatusCodeLine;
        const cachedKeys = Object.keys(cachedStatus);

        setInterval(() => {
            this.sockets.forEach((ws: any, index: number) => {
                if (ws.readyState == 1) {
                    const reandomIndex = Math.floor(Math.random() * (cachedKeys.length - 1));
                    this.sampleBase.uuid += i;
                    this.sampleBase.status = cachedKeys[reandomIndex];

                    const newSample = {
                        ...this.sampleBase
                    };
                    this.generatedSample[newSample.uuid] = newSample;

                    ws.send(JSON.stringify(newSample));
                } else if (ws.readyState == 2 || ws.readyState == 3) {
                    this.sockets.splice(index, 1);
                }
            });
            i++;
        }, 250);

    }

    public stopServer() {
        this.wss.close();
    }
}