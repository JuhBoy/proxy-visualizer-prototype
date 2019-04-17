
export function Init() {
    const { remote } = require("electron");
    
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
        remote.getCurrentWindow().close();
    }
    document.querySelector('#close-window-btn').addEventListener('click', closeWindowHandle);
}