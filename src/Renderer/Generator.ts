export class Generator {

    protected text: string;
    protected parent: HTMLElement;
    protected domElement: HTMLElement;

    constructor(text: string, parent: HTMLElement) {
        this.text = text;
        this.parent = parent;
    }

    /**
     * Flush should be called when parent isn't null.
     */
    public flush(): void {
        if (this.parent) {
            this.parent.appendChild(this.domElement);
        }
    }

    protected buildDomElement(): void {
        throw new Error("Method not implemented.");
    }

    public getDomElement(): HTMLElement {
        return this.domElement;
    }

    public setCustomAttributes(attr: any) {
        if (!attr) return;
        for (const key in attr) {
            if (!attr.hasOwnProperty(key)) return;
            const value = attr[key];
            this.domElement.setAttribute(key, value);
        }
    }
}
