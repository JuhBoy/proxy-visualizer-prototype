let WebSocket = require('ws');

export class WebSocketClient {

    private socket: any;

    private static CLOSE_NORMAL = 1000;

    constructor(uri: string, onMessage: Function, onClose: Function) {
        this.socket = new WebSocket(uri);

        if (onMessage) {
            this.socket.on('message', (data: any) => {
                let jsonObject;
    
                try {
                    jsonObject = JSON.parse(data);
                } catch (exception) {
                    console.log(exception);
                    return;
                }
    
                onMessage(jsonObject);
            });
        }

        if (onClose) {
            this.socket.on('close', (data: any) => {
                onClose(data);
            });
        }
    }

    public stop(): void {
        this.socket.close(WebSocketClient.CLOSE_NORMAL, 'Application Shutdown');
    }
}