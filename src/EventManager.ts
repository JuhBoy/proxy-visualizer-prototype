import { BrowserWindow, ipcMain } from 'electron';

export class EventManager {

    protected window: BrowserWindow;
    protected handles: any;


    constructor(window: BrowserWindow) {
        this.window = window;
    }

    public startListening() {
        this.handles = {};
    }

    public stopListening() {
        this.handles = null;
    }
}

export class MainEventManager extends EventManager {

    public startListening() {
        super.startListening();
        ipcMain.on("http-exchange-click", this.exchangeClickEvent);
        this.handles["http-exchange-click"] = this.exchangeClickEvent;
    }

    public stopListening() {
        for (let key in this.handles) {
            if (!this.handles.hasOwnProperty(key)) { continue; }
            ipcMain.removeListener(key, this.handles[key]);
        }
        super.stopListening();
    }

    private exchangeClickEvent(ev: any) {
        // TODO: PROCESS EXCHANGES HERE
    }
}