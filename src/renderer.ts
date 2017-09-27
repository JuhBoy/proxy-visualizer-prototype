// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

(function() {
    const { ipcRenderer } = require("electron");

    const ipcFromMainHandler = function () {
        const { ExchangeGenerator } = require('../dist/renderer-generator.js');
        ipcRenderer.on("http-exchange-push", (event: any, arg: any) => {
            if (arg == undefined) return;
            const addedRow = new ExchangeGenerator("exchange-list-body", arg).flush();
            addExchangeListener(addedRow);
        });
    }

    const addExchangeListener = function(row: HTMLTableRowElement) {
        row.addEventListener("click", function(el) {
            console.log(el);
            ipcRenderer.send("http-exchange-click", "clicked");
        });
    }

    ipcFromMainHandler();
}());