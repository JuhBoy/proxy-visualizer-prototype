import { BrowserWindow } from "electron";
import { join } from "path";
import { MainEventManager, EventManager } from "./EventManager";
import { Hash } from "./Utils/Collections";

export class Application {
    private myName: String;
    private mainWindow: BrowserWindow;
    private currentWindow: BrowserWindow;

    private eventHandlers: Hash<EventManager>;

    constructor(name: String) {
        this.myName = name;
        this.eventHandlers = {};
    }

    public createWindow(): BrowserWindow {
        return new BrowserWindow({
            height: 900,
            width: 1600,
            frame: true,
            show: false,
            backgroundColor: "#FFF"
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

        this.DEBUG_PUSH();
    }

    public stopApplication(): void {
        this.currentWindow = null;
        this.mainWindow = null;

        for (const key in this.eventHandlers) {
            if (this.eventHandlers.hasOwnProperty(key)) {
                this.eventHandlers[key].stopListening();
            }
        }
    }

    public openDevTools() {
        this.currentWindow.webContents.openDevTools();
    }

    private DEBUG_PUSH(): void {
        setInterval(() => {
            const manager = <MainEventManager>this.eventHandlers[this.mainWindow.id];
            manager.pushExchangeData({
                uuid: "123553-AZER1235AEZRT-123EZR23FE2RFZREG",
                protocol: "HTTP 1.1",
                status: 200,
                host: "www.2befficient.fr",
                path: "/toto/1?no=yes",
                time: 2598
            });
        }, 3000);
    }
}