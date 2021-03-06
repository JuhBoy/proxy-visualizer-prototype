import { IExchangeContent } from "./Models/IExchangeContent";
import { ExchangeContentGenerator, ExchangeGenerator } from "./renderer-generator";
import { ipcRenderer } from 'electron';
import { IHttpExchange } from "./Models/IHttpExchange";
import { writeFile } from "fs";
import { ExchangeTimingGenerator } from "./Renderer/ExchangeTimingGenerator";
import { menuActionConfirm, updateState, getState, getDataForMenuAction } from "./Utils/MenuHelpers";
import { MenuAction } from "./Models/ICommand";
import { NewHttpExchangePushChannel, BatchHttpExchangePushChannel, UpdateExchangeContentChannel, ExchangeClickChannel } from "./Utils/IPCChannels";

// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

export function Init() {

    /**
     * INIT SUBSCRIPTIONS TO IPC TRANSFERS
     */
    const ipcFromMainHandler = function() {
        /**
         * EXCHANGE HTTP PUSH ROW
         */
        ipcRenderer.on(NewHttpExchangePushChannel, (event: any, exchange: IHttpExchange) => {
            const addedRow = new ExchangeGenerator(exchange).flush();
            addExchangeListener(addedRow);
        });

        /**
         * EXCHANGE HTTP PUSH ROWS
         */
        ipcRenderer.on(BatchHttpExchangePushChannel, (_: any, exchanges: IHttpExchange[]) => {
            for (const exchange of exchanges) {
                const addedRow = new ExchangeGenerator(exchange).flush();
                addExchangeListener(addedRow);
            }
        });

        /**
         * EXCHANGE CONTENT
         */
        ipcRenderer.on(UpdateExchangeContentChannel, (_: any, exchangeContent: IExchangeContent) => {
            if (exchangeContent == undefined) return;
            const generator = new ExchangeContentGenerator(exchangeContent);
            generator.flush();

            const timingGenerator = new ExchangeTimingGenerator(exchangeContent.timings);
            timingGenerator.flush();
        });
    }

    /**
     * Apply the Click event on the exchange's row HTML DOM element
     * @param row The html element on wich apply listener
     */
    const addExchangeListener = function(row: HTMLTableRowElement) {
        row.addEventListener("click", function(event: any) {
            event.stopPropagation();

            const domTarget = event.currentTarget;
            const uuid = domTarget.getAttribute('data-uuid');
            ipcRenderer.send(ExchangeClickChannel, { uuid: uuid });
        }, false);
    }

    /**
     * Change headers view from Formatted to Raw
     * @param ev MouseEvent from listener
     */
    const onRequestResponseTabsClicked = (ev: any) => {
        event.stopPropagation();

        const type: string = ev.currentTarget.getAttribute('data-type');
        const tRaw: boolean = ev.currentTarget.getAttribute('data-formatted') === "F";

        ExchangeContentGenerator.switchPresentation(tRaw, type);
    }
    document.querySelectorAll(".toggle-view-content").forEach((domDiv: HTMLDivElement) => {
        domDiv.addEventListener("click", (ev: any) => onRequestResponseTabsClicked(ev), false);
    });

    /**
     * Request a menu-action to the main process
     * @param ev MouseEvent from listener
     */
    const onMenuItemClick = (ev: any) => {
        const name = ev.currentTarget.getAttribute('data-type');
        const data = getDataForMenuAction(name);
        const ok = menuActionConfirm(name, data, getState());

        if (ok) {
            ipcRenderer.send('menu-action', { name: name, data: data } as MenuAction);
        }
    }
    document.querySelectorAll('#menu-button-container div').forEach((menuItem: HTMLDivElement) => {
        menuItem.addEventListener('click', (ev: any) => { onMenuItemClick(ev); });
    });

    ipcFromMainHandler();
}

/**
 * Add A listener click on a HTMLElement.
 * Use with care, references to the 'content' is boxed inside the event for later access
 * @param domElement Element on wich the event will trigger
 * @param content The content as a Base 64 string Buffer
 */
export function addDownloadAsFileListener(domElement: HTMLElement, content: Buffer) {
    const { dialog } = require('electron').remote;

    domElement.addEventListener('click', () => {
        const path = dialog.showSaveDialog({ title: 'Select the saving path', defaultPath: 'C:/' });
        if (!path) return;

        writeFile(path, content, (err: NodeJS.ErrnoException) => {
            if (err) {
                dialog.showMessageBox({ message: err.message });
            }
        });
    }, false);
}
