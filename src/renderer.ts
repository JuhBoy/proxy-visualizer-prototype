import { IExchangeContent } from "./Models/IExchangeContent";

// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

(function() {
    const { ipcRenderer, remote } = require("electron");

    const ipcFromMainHandler = function () {
        const { ExchangeGenerator, ExchangeContentGenerator } = require('../dist/renderer-generator.js');

        ipcRenderer.on("http-exchange-push", (event: any, arg: any) => {
            if (arg == undefined) return;
            const addedRow = new ExchangeGenerator("exchange-list-body", arg).flush();
            addExchangeListener(addedRow);
        });

        ipcRenderer.on("exchange-content", (event: any, exchangeContent: IExchangeContent) => {
            if (exchangeContent == undefined) return;
            const generator = new ExchangeContentGenerator(exchangeContent);
            generator.flush();
        });
    }

    const addExchangeListener = function(row: HTMLTableRowElement) {
        row.addEventListener("click", function(event: any) {
            event.stopPropagation();

            const domTarget = event.currentTarget;
            const uuid = domTarget.getAttribute('data-uuid');
            ipcRenderer.send("http-exchange-click", { uuid: uuid });

        }, false);
    }

    /**
     * Resize the main wrapper for better visibility
     * @param ev Event from listener
     */
    const onWindowResize = (ev: any) => {
        let headerSizeInPixel = 25;
        let size = remote.getCurrentWindow().getSize();
        const wrapper: HTMLDivElement = document.querySelector('#main-wrapper');
        wrapper.style.height = (size[1] - headerSizeInPixel) + 'px';
    }
    window.addEventListener('resize', (ev: any) => onWindowResize(ev));

    ipcFromMainHandler();
}());