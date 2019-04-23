import { ICommand, CommandType, Performs } from "../Models/ICommand";
import { IHttpExchange } from "../Models/IHttpExchange";
import { IEventMessage } from "../Models/IEventMessage";
import { ApplicationState } from "../ApplicationState";
import { HttpClient } from "../Web/HttpClient";
import { MainEventManager } from "./EventManager";

export class MenuCommandHandler {

    private eventManager: MainEventManager;

    /**
     * Act as a pipe from API to Renderer process.
     * Recieve command from @class MenuActionHandle and dispatch them to the underlying renderer process.
     */
    constructor(eventManager: MainEventManager) {
        if (eventManager == null)
            throw new Error("eventManager cannot be null");
        this.eventManager = eventManager;
    }

    /**
     * Can be called multiple times by the @class MenuActionHandle
     * @param command A command from @class MenuActionHandle
     */
    public Process(command: ICommand) {
        if (this.isALoadFileCommand(command)) {
            this.ProcessLoadFileCmd(command);
            return;
        }

        const message: IEventMessage = {
            state: ApplicationState.instance(),
            command: command
        };
        this.eventManager.serveMessage(message);
    }

    private ProcessLoadFileCmd(command: ICommand) {
        HttpClient.Request<IHttpExchange[]>({ port: 8887, path: '/get-current-exchange-list' }, (s: number, d: IHttpExchange[]) => {
            if (!d || s != 200) return;
            this.eventManager.pushExchangeBatch(d);
        });
    }

    private isALoadFileCommand(command: ICommand): boolean {
        return (command.type == CommandType.Action && command.action.perform == Performs.loadFile);
    }
}