export class MessageGenerator {

    private static ID: string = '#message-container';

    private domElement: HTMLDivElement;

    /**
     * Create a popup message from a div tagged with @class MessageGenerator.ID identifier.
     * Call show() to make it appears
     */
    constructor() {
        this.domElement = document.querySelector(MessageGenerator.ID);
        this.domElement.innerHTML = null;
     }

    public show(timeAlive: number): void {
        // TODO: Build message container
    }
}