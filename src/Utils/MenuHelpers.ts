
/**
 * Ask confirmation whenever it's needed regarding to the state of the App.
 * @param type Type of Menu Action
 * @param state The current state
 */
export function menuActionConfirm(type: string, state: any): boolean {
    if (!state) return true;

    switch (type.toLowerCase()) {
        case "new":
        case "open":
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
