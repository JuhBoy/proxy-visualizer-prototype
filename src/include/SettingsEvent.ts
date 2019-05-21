import { EventManager } from "./EventManager";
import { BrowserWindow, ipcMain } from "electron";
import { SettingStateSyncChannel, GlobalIpcMessage } from "../Utils/IPCChannels";
import { HttpClient } from "../Web/HttpClient";
import { IEventMessage } from "../Models/IEventMessage";
import { CommandType } from "../Models/ICommand";
import { ApplicationState } from "../ApplicationState";

export class SettingsEvent extends EventManager {

    constructor(window: BrowserWindow) { super(window); }

    public startListening(): SettingsEvent {
        super.startListening();

        let handle = (_: any, data: any) => { this.TryUpdateSettings(data); };
        ipcMain.on(SettingStateSyncChannel, handle);
        this.handles[SettingStateSyncChannel] = handle;

        return this;
    }

    public stopListening(): SettingsEvent {
        ipcMain.removeListener(SettingStateSyncChannel, this.handles[SettingStateSyncChannel]);
        super.stopListening();
        return this;
    }

    private TryUpdateSettings(data: any) {
        HttpClient.Request<any>({ path: '/Command/update-state', body: data, method: 'POST' }, (status: number, data: any) => {
            let cmdType: CommandType;

            if (status != 200) {
                cmdType = CommandType.Alert;
            } else {
                cmdType = CommandType.Message;
                ApplicationState.instance().setProperties(data.state);
            }

            let message: IEventMessage = {
                state: ApplicationState.instance(),
                command: {
                    type: cmdType,
                    header: data.header,
                    content: data.content
                }
            };

            this.window.webContents.send(GlobalIpcMessage, message);
        });
    }
}
