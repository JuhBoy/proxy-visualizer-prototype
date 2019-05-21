require('dotenv').config();
if (!process.env.ENV) {
    process.env.PORT = "8887";
    process.env.HOST = "127.0.0.1";
    process.env.NAME = "Proxy Visualizer";
    process.env.ENV = "Production";
}

import { app } from "electron";
import { Application } from "./Application";

const application: Application = new Application(process.env.NAME);

app.on("ready", () => {
    application.startApplication();
    if (process.env.ENV != 'Production') {
        application.openDevTools();
    }
});

app.on("window-all-closed", () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
        app.quit();
    }
    if (!application.isStopped()) {
        application.stopApplication();
    }
});

app.on("activate", () => {
    // On OS X it"s common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (application.getCurrentWindow === null) {
        application.startApplication();
    }
});
