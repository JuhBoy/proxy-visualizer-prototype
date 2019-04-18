import { app } from "electron";
import { Application } from "./Application";

const application: Application = new Application("2be-profiler");
app.on("ready", () => {
    application.startApplication();
    application.openDevTools();
});

app.on("window-all-closed", () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
        app.quit();
    }
    application.stopApplication();
});

app.on("activate", () => {
    // On OS X it"s common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (application.getCurrentWindow === null) {
        application.startApplication();
    }
});
