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
        row.addEventListener("click", function(event: any) {
            event.stopPropagation();

            const domTarget = event.currentTarget;
            const uuid = domTarget.getAttribute('data-uuid');
            ipcRenderer.send("http-exchange-click", { uuid: uuid });

        }, false);
    }

    // DEBUG HERE KICK ME
    const testBlock = function() {
        ipcRenderer.on('test-block', (ev: any, arg: any) => {
            console.log("pong recieved: ", ev, arg);
        })
    };
    testBlock();

    ipcFromMainHandler();
    
}());