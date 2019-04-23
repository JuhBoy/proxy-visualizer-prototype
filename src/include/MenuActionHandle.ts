import { ApplicationState } from "../ApplicationState";
import { ICommand, CommandType, Targets, Performs } from "../Models/ICommand";
import { HttpClient } from "../Web/HttpClient";
import { MenuCommandHandler } from "./Commands";

export enum Action {
    New = "NewAction",
    Open = "OpenAction",
    Save = "SaveAction",
    SaveAs = "SaveAsAction",
    Start = "StartAction",
    Stop = "StopAction"
}

type ReqCallback = (status: number, data: any, command: ICommand) => void;

export class MenuActionHandle {

    private static START_CONFIG = { port: 8887, path: '/start-listening' };
    private static STOP_CONFIG = { port: 8887, path: '/stop-listening' };
    private static NEW_CONFIG = { port: 8887, path: '/new' };
    private static OPEN_CONFIG = { port: 8887, path: '/open' };

    private state: ApplicationState;
    private action: Action;
    private callback: (c: ICommand) => void;

    /**
     * Act as a pipe from Rednerer Request to the Server API.
     * Provide commands that can be dispatched by the @class MenuCommandHandler
     */
    constructor(action: Action, appState: ApplicationState) {
        this.state = appState;
        this.action = action;
    }

    //=========================
    //     MENU ACTIONS
    //=========================

    private NewAction(): void {
        if (this.state.isListening()) {
            this.StopAction();
        }

        this.makeRequest(MenuActionHandle.NEW_CONFIG, (status: number, data: any, cmd: ICommand) => {
            if (cmd.type == CommandType.Alert) { return; }

            const contentCmd: ICommand = {
                type: CommandType.Action,
                action: { target: Targets.exchangeContent, perform: Performs.clear }
            }
            this.callback(contentCmd);

            const listCmd: ICommand = {
                type: CommandType.Action,
                action: { target: Targets.exchangeList, perform: Performs.clear }
            }
            this.callback(listCmd);

            this.state.setFile(data.file);
        });
    }

    private OpenAction(): void {
        if (this.state.isListening())
            this.StopAction();

        this.makeRequest(MenuActionHandle.OPEN_CONFIG, (_: number, data: any, cmd: ICommand) => {
            const clearCmd: ICommand = { type: CommandType.Action, action: { target: Targets.exchangeList, perform: Performs.clear } };
            const clearContentCmd: ICommand = { type: CommandType.Action, action: { target: Targets.exchangeContent, perform: Performs.clear } };
            const loadFromFile: ICommand = { type: CommandType.Action, action: { target: Targets.exchangeList, perform: Performs.loadFile } };

            this.callback(clearCmd);
            this.callback(clearContentCmd);
            this.callback(loadFromFile);

            this.state.setChanged(false);
        });
    }

    private SaveAction(): void {
    }

    private SaveAsAction(): void {
    }

    private StartAction(): void {
        if (this.state.isListening()) {
            this.callback(this.createVoidCommand());
            return;
        }

        this.makeRequest(MenuActionHandle.START_CONFIG, (status: number, data: any, c: ICommand) => {
            const ok: boolean = status == 200;
            this.state.setListening(ok);
            this.state.setChanged(ok);
        });
    }

    private StopAction(): void {
        if (!this.state.isListening()) {
            this.callback(this.createVoidCommand());
            return;
        }

        this.makeRequest(MenuActionHandle.STOP_CONFIG, (status: number, data: any, c: ICommand) => {
            this.state.setListening(status != 200);
        });
    }

    private createVoidCommand(): ICommand {
        return { type: CommandType.Void };
    }

    /**
     * Handle Menu specific actions.
     * Actions can be performed in chain, meaning the callback (MenuCommandHandler.Proccess) can
     * be called multiple time in order to send back different commands.
     * @param callback A callback that can be called multiple times.
     */
    public Act(handler: MenuCommandHandler): void {
        this.callback = (cmd: ICommand) => { handler.Process(cmd); };

        // Reproduce only if you know exactly what you're doing
        const method: string = this.action.toString();
        const that: any = this;
        that[method]();
    }

    private makeRequest(config: any, onResponse: ReqCallback): void {
        HttpClient.Request<any>(config, (status: number, data: any) => {
            let command: ICommand = {
                type: CommandType.Message,
                header: data.header.toString(),
                content: data.content.toString()
            };

            if (status != 200)
                command.type = CommandType.Alert;

            onResponse(status, data, command);
            this.callback(command);
        });
    }

    public static getActionFromString(action: string): Action {
        switch (action.toLowerCase()) {
            case "new":
                return Action.New;
            case "open":
                return Action.Open;
            case "save":
                return Action.Save;
            case "save-as":
                return Action.SaveAs;
            case "start":
                return Action.Start;
            case "stop":
                return Action.Stop;
            default:
                return undefined;
        }
    }
}