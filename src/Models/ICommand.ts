
export const Targets: any = {
    exchangeList: 'exchange-list',
    exchangeContent: 'exchange-content',
    mainWindow: 'main-window',
    settingWindow: 'settingWindow'
}

export const Performs: any = {
    clear: 'clear',
    loadFile: 'load-file',
    push: 'push',
    openWindow: 'open-window'
}

export enum CommandType {
    Void,
    Message,
    Alert,
    Action
}

export interface Action {
    target: string;
    perform: string;
}

export interface MenuAction {
    name: string;
    data?: any;
}

export interface ICommand {
    type: CommandType;
    header?: string;
    content?: string;
    action?: Action;
}
