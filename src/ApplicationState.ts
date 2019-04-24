
export class ApplicationState {

    private static _instance: ApplicationState = new ApplicationState();

    private _isAlive: boolean;
    private _isListening: boolean;
    private _file: string | null;
    private _changed: boolean;

    public static instance(): ApplicationState {
        return ApplicationState._instance;
    }

    public isAlive(): boolean {
        return this._isAlive;
    }

    public setAlive(alive: boolean): void {
        this._isAlive = alive;
    }

    public setListening(listen: boolean): void {
        this._isListening = listen;
    }

    public isListening(): boolean {
        return this._isListening;
    }

    public getFile(): string {
        return this._file;
    }

    public setFile(file: string): void {
        this._file = file;
    }

    public hasChanged(): boolean {
        return this._changed;
    }

    public setChanged(changed: boolean): void {
        this._changed = changed;
    }
}
