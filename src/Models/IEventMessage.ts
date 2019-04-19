import { ApplicationState } from "../ApplicationState";
import { ICommand } from "./ICommand";

export interface IEventMessage {
    state: ApplicationState;
    command?: ICommand;
}