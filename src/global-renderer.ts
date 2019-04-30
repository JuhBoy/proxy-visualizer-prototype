import { ipcRenderer } from "electron";
import { GlobalIpcMessage } from "./Utils/IPCChannels";
import { updateState } from "./Utils/MenuHelpers";
import { UICommandManager } from "./renderer-generator";
import { IEventMessage } from "./Models/IEventMessage";

export function Init(options: any) {
    const { remote } = require("electron");

    /**
     * COMMUNICATION IPC MAIN HANDLER
     */
    ipcRenderer.on(GlobalIpcMessage, (_: any, message: IEventMessage) => {
        updateState(message.state);
        const manager = new UICommandManager(message.command);
        manager.play();
    });

    /**
     * Resize the main wrapper for better visibility
     * @param ev Event from listener
     */
    const onWindowResizeReevaluateWrapper = (ev: any) => {
        let headerSizeInPixel = 25;
        let size = remote.getCurrentWindow().getSize();
        const wrapper: HTMLDivElement = document.querySelector('#main-wrapper');
        wrapper.style.height = (size[1] - headerSizeInPixel) + 'px';
    }
    window.addEventListener('resize', (ev: any) => onWindowResizeReevaluateWrapper(ev));

    /**
     * Control wether the application shall be min/maximized
     */
    const maximazingWindowHandle = () => {
        const maximized = remote.getCurrentWindow().isMaximized();
        if (maximized)
            remote.getCurrentWindow().unmaximize();
        else
            remote.getCurrentWindow().maximize();
    }
    document.querySelector('#maximize-window-btn').addEventListener('click', maximazingWindowHandle);

    /**
     * Minimize the current window
     */
    const minimazingWindowHandle = () => {
        remote.getCurrentWindow().minimize();
    }
    document.querySelector('#minimize-window-btn').addEventListener('click', minimazingWindowHandle);

    /**
     * Close the current Window
     */
    const closeWindowHandle = () => {
        if (options.hideNotClose)
            remote.getCurrentWindow().hide();
        else
            remote.getCurrentWindow().close();
    }
    document.querySelector('#close-window-btn').addEventListener('click', closeWindowHandle);

    /**
     * Detect CTRL+R and stop it
     */
    const killReloadPage = () => {
        document.addEventListener('keydown', (ev: any) => {
            if (ev.keyCode == 82 && ev.ctrlKey) {
                ev.preventDefault();
                return false;
            }
        });
    }
    killReloadPage();
}
