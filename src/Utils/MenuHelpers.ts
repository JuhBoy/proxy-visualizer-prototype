
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
        case "open":
            if (!data || !data.fileName) return false;
            if (state._file != undefined && state._changed) {
                return confirm("A working file has been opened, continue will discard modifications.");
            }
            break;
        case "save":
            if (!state._file) {
                return confirm("A new file will be created.");
            }
            break;
        case "save-as":
            if (state._file) {
                return confirm("The file will be duplicated with the current changes");
            }
            break;
        case "start":
        case "stop":
        default:
            return true;
    }
    return true;
}

/**
 * Literaly Replace the State.
 * @param state The new state
 */
export function updateState(state: any) {
    localStorage.setItem('state', JSON.stringify(state));
}

/**
 * Get State contained in LocalStorage
 */
export function getState() {
    return JSON.parse(localStorage.getItem('state'));
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

    return null;
}
