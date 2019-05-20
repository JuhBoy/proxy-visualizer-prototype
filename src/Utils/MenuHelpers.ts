import { ipcRenderer, app } from "electron";
import { GlobalRequireStateChannel } from "./IPCChannels";

/**
 * Ask confirmation whenever it's needed regarding to the state of the App.
 * @param type Type of Menu Action
 * @param data Related data (Nullable)
 * @param state The current state
 */
export function menuActionConfirm(type: string, data: any, state: any): boolean {
    if (!state) return true;

    switch (type.toLowerCase()) {
        case "new":
            if (state.file && state.changed) {
                return confirm("Active Modifications will be lost");
            }
            break;
        case "open":
            if (!data || !data.fileName) return false;
            if (state.file != undefined && state.changed) {
                return confirm("A working file has been opened, continue will discard modifications.");
            }
            break;
        case "save":
            if (!state.file) {
                return confirm("A new file will be created.");
            }
            break;
        case "save-as":
            if (!data) {
                return false;
            }
            if (state.file) {
                return confirm("The file will be duplicated with the current changes");
            }
            break;
        case "start":
        case "stop":
        case "setting":
        default:
            return true;
    }
    return true;
}

/**
 * Shallow Update all keys that changed.
 * @param state The new state
 */
export function updateState(state: any) {
    let currentState = getState();

    for (const key in state) {
        if (!currentState.hasOwnProperty(key))
            continue;

        if (currentState[key] != state[key]) {
            currentState[key] = state[key];
        }
    }

    localStorage.setItem('state', JSON.stringify(currentState));
}

/**
 * Get State
 */
export function getState() {
    let state = JSON.parse(localStorage.getItem('state'))
    if (!state) {
        state = ipcRenderer.sendSync(GlobalRequireStateChannel, null);
        localStorage.setItem('state', JSON.stringify(state));
    }
    return state;
}

/**
 * Synchronize the state with the main process.
 * The main process wil then decide if state changes are accepted or not by 
 * returning a event-message to the renderer wich update the state btw.
 * @param key The specified key for window event manager (use IPCKeys.ts file)
 */
export function syncState(key: string) {
    const { ipcRenderer } = require("electron");
    ipcRenderer.send(key, getState());
}

/**
 * Return data that belongs to the menu action.
 * Only open action is implemented (return a path to a valid selected file wrapped in an object as : { fileName: "/path/to/the/file.(ecz|har|saz)" })
 * @param name name of the menu action
 */
export function getDataForMenuAction(name: string): any {
    if (name == 'open') {
        const { dialog } = require('electron').remote;
        const path: string[] = dialog.showOpenDialog({ properties: ['openFile'], filters: [{ name: 'Data files', extensions: ['ecz', 'har', 'saz'] }] });
        return (path) ? { fileName: path[0] } : null;
    }

    if (name == 'save-as') {
        const { dialog, app } = require('electron').remote;
        const path: string = dialog.showSaveDialog(null, { defaultPath: (app.getPath('documents') + '/Echoes-file.ecz') });
        console.log(path);
        return path;
    }

    return null;
}
