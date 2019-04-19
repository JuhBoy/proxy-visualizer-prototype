
export const Targets: any = {
    exchangeList: 'exchange-list',
    exchangeContent: 'exchange-content'
}

export const Performs: any = {
    clear: 'clear',
    loadFile: 'load-file',
    push: 'push'
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

export interface ICommand {
    type: CommandType;
    header?: string;
    content?: string;
    action?: Action;
}