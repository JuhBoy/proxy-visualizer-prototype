import { ICommand } from "../Models/ICommand";
import { appendCss, validMessageCss } from "../Utils/CssHelpers";

export class MessageGenerator {

    private static timeoutId: NodeJS.Timeout;
    private static innerTimeoutId: NodeJS.Timeout;

    private static ID: string = '#message-container';
    private static HEADER_ID: string = '#message-header';
    private static CONTENT_ID: string = '#message-content';

    private headerParent: HTMLDivElement;
    private contentParent: HTMLDivElement;
    private domElement: HTMLDivElement;

    private command: ICommand;

    /**
     * Create a popup message from a div tagged with @class MessageGenerator.ID identifier.
     * Call show() to make it appears
     */
    constructor(command: ICommand) {
        this.command    = command;
        this.domElement = document.querySelector(MessageGenerator.ID);
        appendCss(this.domElement, { ...validMessageCss, display: 'none', opacity: '0' });
        MessageGenerator.clearTimeOut();

        if (this.domElement == undefined) {
            throw new Error("Message div container not found");
        }

        this.createOrSelectHeader();
        this.createOrSelectContent();
        this.fillData();
    }

    public show(timeAlive: number): void {
        appendCss(this.domElement, { display: 'block', opacity: '1' });
        MessageGenerator.timeoutId = setTimeout(() => {
            this.domElement.style.opacity = '0';
            MessageGenerator.innerTimeoutId = setTimeout(() => this.domElement.style.display = 'none', 600);
         }, timeAlive);
    }

    private createOrSelectHeader() {
        let header = this.tryGetElement(MessageGenerator.HEADER_ID);
        if (header == undefined) {
            header = this.createAndAppend(MessageGenerator.HEADER_ID.substring(1));
        }
        this.headerParent = header as HTMLDivElement;
        this.headerParent.innerText = null;
    }

    private createOrSelectContent() {
        let content = this.tryGetElement(MessageGenerator.CONTENT_ID);
        if (content == undefined) {
            content = this.createAndAppend(MessageGenerator.CONTENT_ID.substring(1));
        }
        this.contentParent = content as HTMLDivElement;
        this.contentParent.innerText = null;
    }

    private tryGetElement(childDomId: string): HTMLElement {
        const selector = `${MessageGenerator.ID} ${childDomId}`;
        const domElement = document.querySelector(selector) as HTMLElement;
        return domElement;
    }

    private createAndAppend(childDomId: string): HTMLDivElement {
        const container = document.createElement('div');
        container.id = childDomId;
        this.domElement.appendChild(container);
        return container;
    }

    private fillData() {
        this.appendAndFill(this.headerParent, 'h4', this.command.header);
        this.appendAndFill(this.contentParent, 'p', this.command.content);
    }

    /**
     * Create a child with text and append it to the parent container.
     * @param domElement The parent dom element
     * @param createTag this child's tag
     * @param text the child inner text
     */
    private appendAndFill(domElement: Element, createTag: string, text: string): void {
        const headerDomTitle = document.createElement(createTag);
        domElement.appendChild(headerDomTitle);
        headerDomTitle.innerText = text;
    }

    private static clearTimeOut(): void {
        clearTimeout(MessageGenerator.timeoutId);
        clearTimeout(MessageGenerator.innerTimeoutId);
    }
}