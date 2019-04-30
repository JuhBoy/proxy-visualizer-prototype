import { BrowserWindow, ipcMain } from 'electron';
import { HashStr as Hash } from '../Utils/Collections';
import { IHttpExchange } from '../Models/IHttpExchange';
import { HttpClient } from '../Web/HttpClient';
import { IExchangeContent } from '../Models/IExchangeContent';
import { MenuActionHandle, Action } from './MenuActionHandle';
import { ApplicationState } from '../ApplicationState';
import { IEventMessage } from '../Models/IEventMessage';
import { MenuCommandHandler } from './Commands';
import { MenuAction } from '../Models/ICommand';
import {
    ExchangeClickChannel,
    MenuActionChannel,
    GlobalIpcMessage,
    NewHttpExchangePushChannel,
    BatchHttpExchangePushChannel,
    UpdateExchangeContentChannel
} from '../Utils/IPCChannels';

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

    public showWindow(): void {
        this.window.show();
    }
}

export class MainEventManager extends EventManager {

    constructor(window: BrowserWindow) { super(window); }

    public startListening(): MainEventManager {
        super.startListening();
        this.setClickExchangeListener();
        this.setMenuListener();
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

    //===========================
    //        Listeners
    //===========================

    private setClickExchangeListener() {
        let clickExchangeListener = (event: any, args: any) => {
            const { uuid } = args;
            const query = { hostname: process.env.HOST, port: process.env.PORT, path: `/get-exchange-content?uuid=${uuid}` };

            HttpClient.Request<IExchangeContent>(query, (status: number, content: IExchangeContent) => {
                if (status != 200 || content == undefined) { return; }
                this.window.webContents.send(UpdateExchangeContentChannel, content);
            });
        };
        ipcMain.on(ExchangeClickChannel, clickExchangeListener);
        this.handles[ExchangeClickChannel] = clickExchangeListener;
    }

    /**
     * Handle menu item click event from renderer process.
     * Request the api to get state of the request and send back a
     * command to the renderer process
     */
    private setMenuListener() {
        let menuItemListener = (_: any, menuAction: MenuAction) => {
            const actionEnum: Action = MenuActionHandle.getActionFromString(menuAction.name);
            const menuHandle: MenuActionHandle = new MenuActionHandle(actionEnum, ApplicationState.instance());
            const cmdHandler: MenuCommandHandler = new MenuCommandHandler(this);
            menuHandle.Act(cmdHandler, menuAction.data);
        };
        ipcMain.on(MenuActionChannel, menuItemListener);
        this.handles[MenuActionChannel] = menuItemListener;
    }

    //===========================
    //           API
    //===========================

    public serveMessage(message: IEventMessage) {
        this.window.webContents.send(GlobalIpcMessage, message);
    }

    public pushExchangeData(data: IHttpExchange): void {
        this.window.webContents.send(NewHttpExchangePushChannel, data);
    }

    public pushExchangeBatch(data: IHttpExchange[]): void {
        this.window.webContents.send(BatchHttpExchangePushChannel, data);
    }
}
