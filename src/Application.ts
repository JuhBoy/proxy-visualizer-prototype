import { BrowserWindow, ipcMain } from "electron";
import { join } from "path";
import { MainEventManager, EventManager } from "./include/EventManager";
import { Hash, HashStr } from "./Utils/Collections";
import { WebSocketClient } from "./Web/WebSocketClient";
import { FakeServer } from "./Debug/FakeServer";
import { ApplicationState } from "./ApplicationState";
import { SettingsEvent } from "./include/SettingsEvent";
import { GlobalIpcMessage } from "./Utils/IPCChannels";
import { IEventMessage } from "./Models/IEventMessage";
import { CommandType, Targets } from "./Models/ICommand";

export class Application {
    private myName: string;
    private mainWindow: BrowserWindow;
    private settingsWindow: BrowserWindow;
    private currentWindow: BrowserWindow;

    private networkClient: WebSocketClient;

    private static tagToIdWindow: HashStr<number>;
    private static eventHandlers: Hash<EventManager>;

    constructor(name: string) {
        this.myName = name;
        Application.tagToIdWindow = {};
        Application.eventHandlers = {};
        ApplicationState.instance().setAlive(false);
    }

    public static getEventManagerByTag(tag: string): EventManager {
        const id: number = Application.tagToIdWindow[tag];
        return Application.eventHandlers[id];
    }

    public createMainWindow(): BrowserWindow {
        if (process.env.ENV == "Development") {
            new FakeServer(true, (type: string, ws: any) => { /* SILENCE! */ });
        }

        return new BrowserWindow({
            title: this.myName,
            height: 920,
            width: 1600,
            minWidth: 1000,
            minHeight: 920,
            frame: false,
            show: false,
            backgroundColor: "#fafafa"
        });
    }

    private setUpMainWindow() {
        this.mainWindow = this.createMainWindow();
        this.mainWindow.loadFile(join(__dirname, "../views/index.html"));
        this.currentWindow = this.mainWindow;
        this.mainWindow.on("closed", () => { this.mainWindow = null; });
        this.mainWindow.on("ready-to-show", () => { this.mainWindow.show(); });
        Application.eventHandlers[this.mainWindow.id] = new MainEventManager(this.mainWindow).startListening();
        Application.tagToIdWindow[Targets.mainWindow] = this.mainWindow.id;
    }

    private setUpSettingsWindow() {
        this.settingsWindow = new BrowserWindow({
            title: 'Configuration',
            height: 620,
            width: 600,
            minWidth: 600,
            minHeight: 620,
            frame: false,
            show: false,
            backgroundColor: "#fafafa"
        });
        this.settingsWindow.loadFile(join(__dirname, '../views/settings.html'));
        Application.eventHandlers[this.settingsWindow.id] = new SettingsEvent(this.settingsWindow).startListening();
        Application.tagToIdWindow[Targets.settingWindow] = this.settingsWindow.id;
    }

    public startApplication(): void {
        this.setUpMainWindow();
        this.setUpSettingsWindow();
        this.setOrUpdateRendererState();

        this.networkClient = new WebSocketClient('ws://localhost:8085', (json: any) => {
            const manager = <MainEventManager> Application.eventHandlers[this.mainWindow.id];
            manager.pushExchangeData(json);
        }, null);

        ApplicationState.instance().setAlive(true);
    }

    private setOrUpdateRendererState() {
        this.mainWindow.on('ready-to-show', () => {
            const message: IEventMessage = { state: ApplicationState.instance(), command: { type: CommandType.Void } };
            this.mainWindow.webContents.send(GlobalIpcMessage, message);
        });
    }

    public stopApplication(): void {
        this.currentWindow = null;
        this.mainWindow = null;
        this.settingsWindow = null;
        this.networkClient.stop();

        for (const key in Application.eventHandlers) {
            if (Application.eventHandlers.hasOwnProperty(key)) {
                Application.eventHandlers[key].stopListening();
            }
        }

        Application.eventHandlers = {};
        Application.tagToIdWindow = {};

        ApplicationState.instance().setAlive(false);
    }

    public getCurrentWindow(): BrowserWindow {
        return this.currentWindow;
    }

    public setCurrentWindow(window: BrowserWindow): void {
        this.currentWindow = window;
    }

    public openDevTools() {
        this.currentWindow.webContents.openDevTools();
        this.settingsWindow.webContents.openDevTools();
    }
}
