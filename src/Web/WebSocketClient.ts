let WebSocket = require('ws');

export class WebSocketClient {

    private uri: string;
    private socket: any;
    private onMessage: Function;
    private onClose: Function;
    private pingTimeout: NodeJS.Timeout;

    private static CLOSE_NORMAL = 1000;

    constructor(uri: string, onMessage: Function, onClose: Function) {
        this.uri = uri;
        this.onClose = onClose;
        this.onMessage = onMessage;

        this.open();
        this.launchTimeOut();
    }

    private open() {
        this.socket = new WebSocket(this.uri);

        this.socket.on('open', () => {
            console.log("WebSocket Connection Established!");
        });

        this.socket.on('message', (data: any) => {
            if (!this.onMessage) return;
            let jsonObject;

            try {
                jsonObject = JSON.parse(data);
            } catch (exception) {
                console.log(exception);
                return;
            }

            this.onMessage(jsonObject);
        });

        this.socket.on('close', (data: any) => {
            if (this.onClose) this.onClose(data);
        });

        this.socket.on('error', (error: any) => {
            console.log("[WS] Error : " + error.code);
        });
    }

    public stop(): void {
        clearInterval(this.pingTimeout);
        this.socket.close(WebSocketClient.CLOSE_NORMAL, 'Application Shutdown');
    }

    private reconnect() {
        console.log("WebSocket Connection Lost, Trying Reconnect...");
        setTimeout(() => {
            this.socket = null;
            this.open();
        }, 500);
    }

    private launchTimeOut() {
        this.pingTimeout = setInterval(() => {
            if (this.socket.readyState == 0) return;
            if (this.socket.readyState != 1) {
                this.reconnect();
                return;
            }
            this.socket.send('ping', null);
        }, 3_000);
    }
}
