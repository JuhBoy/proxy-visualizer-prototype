import { IExchangeContent } from "./Models/IExchangeContent";
import { ExchangeContentGenerator, ExchangeGenerator } from "./renderer-generator";

// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

export function Init() {
    const { ipcRenderer } = require("electron");

    /**
     * INIT SUBSCRIPTIONS TO IPC TRANSFERS
     */
    const ipcFromMainHandler = function() {
        /**
         * EXCHANGE HTTP PUSH ROW
         */
        ipcRenderer.on("http-exchange-push", (event: any, arg: any) => {
            if (arg == undefined) return;
            const addedRow = new ExchangeGenerator("exchange-list-body", arg).flush();
            addExchangeListener(addedRow);
        });

        /**
         * EXCHANGE CONTENT
         */
        ipcRenderer.on("exchange-content", (event: any, exchangeContent: IExchangeContent) => {
            if (exchangeContent == undefined) return;
            const generator = new ExchangeContentGenerator(exchangeContent);
            generator.flush();
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

    ipcFromMainHandler();
}