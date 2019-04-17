import { BrowserWindow } from "electron";
import { join } from "path";
import { MainEventManager, EventManager } from "./EventManager";
import { Hash } from "./Utils/Collections";
import { WebSocketClient } from "./Web/WebSocketClient";
import { FakeServer } from "./Debug/FakeServer";
import { HttpClient } from "./Web/HttpClient";

export class Application {
    private myName: string;
    private mainWindow: BrowserWindow;
    private currentWindow: BrowserWindow;

    private eventHandlers: Hash<EventManager>;
    private networkClient: WebSocketClient;

    constructor(name: string) {
        this.myName = name;
        this.eventHandlers = {};
    }

    public createWindow(): BrowserWindow {
        new FakeServer(true, (type: string, ws: any) => {/*console.log(type, ws);*/});

        return new BrowserWindow({
            title: this.myName,
            height: 900,
            width: 1600,
            frame: false,
            show: false,
            backgroundColor: "#fafafa"
          });
    }

    public getCurrentWindow(): BrowserWindow {
        return this.currentWindow;
    }

    public startApplication(): void {
        this.mainWindow =  this.createWindow();
        this.mainWindow.loadFile(join(__dirname, "../views/index.html"));
        this.currentWindow = this.mainWindow;

        this.mainWindow.on("closed", () => {this.mainWindow = null;});
        this.mainWindow.on("ready-to-show", () => {this.mainWindow.show()});

        this.eventHandlers[this.mainWindow.id] = new MainEventManager(this.mainWindow).startListening();

        this.networkClient = new WebSocketClient('ws://localhost:8085', (json: any) => {
            const manager = <MainEventManager>this.eventHandlers[this.mainWindow.id];
            manager.pushExchangeData(json);
        }, null);
    }

    public stopApplication(): void {
        this.currentWindow = null;
        this.mainWindow = null;
        this.networkClient.stop();

        for (const key in this.eventHandlers) {
            if (this.eventHandlers.hasOwnProperty(key)) {
                this.eventHandlers[key].stopListening();
            }
        }
    }

    public openDevTools() {
        this.currentWindow.webContents.openDevTools();
    }
}