import { IExchangeContent } from "./Models/IExchangeContent";
import { ExchangeContentGenerator, ExchangeGenerator } from "./renderer-generator";
import { ipcRenderer, BrowserWindow } from 'electron';
import { IEventMessage } from "./Models/IEventMessage";
import { IHttpExchange } from "./Models/IHttpExchange";
import { UICommandManager } from "./Renderer/UICommandManager";
import { writeFile } from "fs";
import { ExchangeTimingGenerator } from "./Renderer/ExchangeTimingGenerator";

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
        ipcRenderer.on("http-exchange-push", (event: any, exchange: IHttpExchange) => {
            const addedRow = new ExchangeGenerator(exchange).flush();
            addExchangeListener(addedRow);
        });

        /**
         * EXCHANGE HTTP PUSH ROWS
         */
        ipcRenderer.on('http-exchange-batch-push', (_: any, exchanges: IHttpExchange[]) => {
            for (const exchange of exchanges) {
                const addedRow = new ExchangeGenerator(exchange).flush();
                addExchangeListener(addedRow);
            }
        });

        /**
         * EXCHANGE CONTENT
         */
        ipcRenderer.on("exchange-content", (_: any, exchangeContent: IExchangeContent) => {
            if (exchangeContent == undefined) return;
            const generator = new ExchangeContentGenerator(exchangeContent);
            generator.flush();

            const timingGenerator = new ExchangeTimingGenerator(exchangeContent.timings);
            timingGenerator.flush();
        });

        /**
         * COMMUNICATION IPC MAIN HANDLER
         */
        ipcRenderer.on('serve-ipc-message', (_: any, message: IEventMessage) => {
            const manager = new UICommandManager(message.command);
            manager.play();
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
            ipcRenderer.send("http-exchange-click", { uuid: uuid });
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
        const domElement = ev.currentTarget;
        const type = domElement.getAttribute('data-type');
        ipcRenderer.send(`menu-action`, type);
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
 * @param content The content as array of bytes
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