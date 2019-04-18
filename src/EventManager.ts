import { BrowserWindow, ipcMain } from 'electron';
import { HashStr as Hash } from './Utils/Collections';
import { IHttpExchange } from './Models/IHttpExchange';
import { HttpClient } from './Web/HttpClient';
import { IExchangeContent } from './Models/IExchangeContent';

export class EventManager {

    protected window: BrowserWindow;
    protected handles: Hash<Function>;


    constructor(window: BrowserWindow) {
        this.window = window;
    }

    public startListening(): EventManager {
        this.handles = {};
        return this;
    }

    public stopListening(): EventManager {
        this.handles = null;
        return this;
    }
}

export class MainEventManager extends EventManager {

    public startListening(): MainEventManager {
        super.startListening();

        let mainHandle = (event: any, args: any) => { this.exchangeClickEvent(event, args); };
        ipcMain.on("http-exchange-click", mainHandle);
        this.handles["http-exchange-click"] = mainHandle;

        return this;
    }

    public stopListening(): MainEventManager {
        for (const key in this.handles) {
            if (!this.handles.hasOwnProperty(key)) { continue; }
            ipcMain.removeListener(key, this.handles[key]);
        }
        super.stopListening();

        return this;
    }

    public pushExchangeData(data: IHttpExchange): void {
        this.window.webContents.send("http-exchange-push", data);
    }

    private exchangeClickEvent(event: any, args: any): void {
        const { uuid } = args;

        const query = { hostname: 'localhost', port: 8887, path: `get-exchange-content?uuid=${uuid}` };

        HttpClient.Request<IExchangeContent>(query, (status: number, exchangeContent: IExchangeContent) => {
            if (status != 200 || exchangeContent == undefined) { /* TODO: Call error frame */ return; }
            this.window.webContents.send('exchange-content', exchangeContent);
        }, true);
    }
}