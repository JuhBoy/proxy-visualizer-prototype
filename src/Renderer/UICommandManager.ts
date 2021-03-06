import { ICommand, CommandType, Targets, Performs } from "../Models/ICommand";
import { MessageGenerator } from "./MessageGenerator";
import { ExchangeGenerator } from "./ExchangeGenerator";
import { ExchangeContentGenerator } from "./ExchangeContentGenerator";
import { ExchangeTimingGenerator } from "./ExchangeTimingGenerator";

export class UICommandManager {

    private command: ICommand;

    constructor(command: ICommand) {
        this.command = command;
    }

    public play() {
        switch (this.command.type) {
            case CommandType.Action:
                this.playAction();
                break;
            case CommandType.Alert:
                this.playAlert();
                break;
            case CommandType.Message:
                this.playMessage();
                break;
            case CommandType.Void:
                console.log('IPC Void');
                break;
            default:
                throw Error('IPC MESSAGE INVALID');
                break;
        }
    }

    playMessage() {
        const domMessage = new MessageGenerator(this.command);
        domMessage.show(3000);
    }

    playAlert() {
        const domAlert = new MessageGenerator(this.command);
        domAlert.show(4000);
    }

    playAction() {
        const { action } = this.command;
        switch (action.target) {
            case Targets.exchangeList:
                if (action.perform == Performs.clear) {
                    ExchangeGenerator.clear();
                }
                break;
            case Targets.exchangeContent:
                if (action.perform == Performs.clear) {
                    ExchangeContentGenerator.clearCache();
                    ExchangeTimingGenerator.clearCache();
                }
                break;
            default:
                throw new Error('action is not valid');
        }
    }
}