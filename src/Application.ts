import { BrowserWindow } from "electron";
import { join } from "path";

export class Application {
    private myName: String;
    private mainWindow: BrowserWindow;
    private currentWindow: BrowserWindow;

    constructor(name: String) {
        this.myName = name;
    }

    public createWindow(): BrowserWindow {
        return new BrowserWindow({
            height: 600,
            width: 800,
            frame: true,
            show: false,
            backgroundColor: "#FFF" //"#272c34"
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

        // DUMMY DATA FOR DEBUGGING
        setInterval(() => {
            this.mainWindow.webContents.send("http-exchange-push", {
                protocol: "HTTP 1.1",
                status: 200,
                host: "www.2befficient.fr",
                path: "/toto/1?no=yes",
                time: 2598
            });
        }, 1000);
    }

    public stopApplication(): void {
        this.currentWindow = null;
        this.mainWindow = null;
    }

    public openDevTools() {
        this.currentWindow.webContents.openDevTools();
    }
}