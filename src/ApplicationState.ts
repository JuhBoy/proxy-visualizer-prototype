import { ipcMain } from "electron";
import { GlobalRequireStateChannel } from "./Utils/IPCChannels";

export class ApplicationState {

    private static _instance: ApplicationState = new ApplicationState();

    private alive: boolean;
    private listening: boolean;
    private file: string | null;
    private changed: boolean;
    private settings: any = { exclusionList: [], port: null, interface: "-1", registered: true };

    constructor() {
        ipcMain.on(GlobalRequireStateChannel, (_: any, data: any) => {
            _.returnValue = ApplicationState.instance();
        });
    }

    public static instance(): ApplicationState {
        return ApplicationState._instance;
    }

    public isAlive(): boolean {
        return this.alive;
    }

    public setAlive(alive: boolean): void {
        this.alive = alive;
    }

    public setListening(listen: boolean): void {
        this.listening = listen;
    }

    public isListening(): boolean {
        return this.listening;
    }

    public getFile(): string {
        return this.file;
    }

    public setFile(file: string): void {
        this.file = file;
    }

    public hasChanged(): boolean {
        return this.changed;
    }

    public setChanged(changed: boolean): void {
        this.changed = changed;
    }

    public getSettings() {
        return this.settings;
    }

    public setProperties(data: any) {
        const that: any = this;
        for (const key in data) {
            if (!this.hasOwnProperty(key)) { continue; }
            that[key] = data[key];
        }
    }

    public setSettings(settings: any): void {
        if (!settings) return;
        this.settings = {
            ...this.settings,
            ...settings
        };
    }
}
