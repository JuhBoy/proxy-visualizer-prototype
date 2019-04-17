import { IHttpExchange } from "./Models/IHttpExchange";
import { StatusCodeLine } from "./Models/StatusCodeLine";
import { IExchangeContent } from "./Models/IExchangeContent";

export class ExchangeGenerator {

    constructor(private parentId: String, private model: IHttpExchange) { }

    public flush(): HTMLTableRowElement {
        const parent = document.getElementById(this.parentId.toString());
        
        if (parent == undefined) 
            throw new Error("Parent not found: " + this.parentId);

        const child = document.createElement("tr");
        child.classList.add("exchange-element");

        this.addUUIDNodeAttribute(child);

        const protocol = this.buildGenericNode(this.model.protocol);
        const status = this.buildStatusDom();
        const host = this.buildGenericNode(this.model.host);
        const path = this.buildGenericNode(this.model.path);
        const time = this.buildTimeDom();

        child.appendChild(protocol);
        child.appendChild(status);
        child.appendChild(host);
        child.appendChild(path);
        child.appendChild(time);

        parent.appendChild(child);

        return child;
    }

    private buildTimeDom() {
        const domElement = this.buildGenericNode(this.model.time.toString());
        domElement.innerText += " ms";
        return domElement;
    }

    private buildStatusDom() {
        const domElement = document.createElement("td");
        const domSpan = document.createElement("span");
        const text = getTextForStatus(this.model.status);

        domSpan.classList.add("be-badge");
        domSpan.classList.add(this.getStatusColor());
        domSpan.classList.add("bold");
        domSpan.innerText = text.toString();
        domElement.appendChild(domSpan);

        return domElement;
    }

    private buildGenericNode(innerText: String) {
        const domElement = document.createElement("td");
        domElement.innerText = innerText.toString();
        return domElement;
    }

    private addUUIDNodeAttribute(child: HTMLTableRowElement) {
        const dataAttribute = document.createAttribute("data-uuid");
        dataAttribute.value = this.model.uuid.toString();
        child.setAttributeNode(dataAttribute);
    }

    private getStatusColor(): string {
        if (this.model.status < 200) {
            return "yellow";
        } else if (this.model.status < 300) {
            return "teal";
        } else if (this.model.status < 400) {
            return "brown";
        } else if (this.model.status < 500) {
            return "purple";
        } else {
            return "red";
        }
    }
}

export class ExchangeContentGenerator {

    static currentExchange: IExchangeContent;
    private content: IExchangeContent;

    public constructor(content: IExchangeContent) {
        this.content = content;
        ExchangeContentGenerator.currentExchange = this.content;
    }

    public flush(): void {
        const _static = ExchangeContentGenerator;
        const requestParent  = document.querySelector('#request-headers');
        const responseParent = document.querySelector('#response-headers');
        const selectionTitle = document.querySelector('#selection');

        ExchangeContentGenerator.clear(requestParent, responseParent, selectionTitle);

        const requestRows  = _static.buildFormattedHeaders(this.content.requestHeaders);
        const responseRows = _static.buildFormattedHeaders(this.content.responseHeaders);

        _static.appendRowsFormatted(requestRows, requestParent);
        _static.appendRowsFormatted(responseRows, responseParent);

        selectionTitle.append(`${this.content.responseHeaders[0]}`);
    }

    public static switchPresentation(formatted: boolean, ancor: "#request-headers" | "#response-headers" | string): void {
        const _static = ExchangeContentGenerator;
        if (!_static.currentExchange) return;

        const domElement = document.querySelector(ancor);
        _static.clear(domElement);

        let headers: string[] = [];
        if (ancor.indexOf('response') != -1)
            headers = _static.currentExchange.responseHeaders;
        else
            headers = _static.currentExchange.requestHeaders;

        if (formatted) {
            const rows = _static.buildFormattedHeaders(headers);
            _static.appendRowsFormatted(rows, domElement);
        } else {
            _static.appendHeaderRaw(headers, domElement);
        }
    }

    private static appendRowsFormatted(rows: HTMLLIElement[], domElement: Element) {
        for (const row of rows)
            domElement.appendChild(row);
    }

    private static appendHeaderRaw(headers: string[], domElement: Element) {
        for (const header of headers) {
            domElement.append(header);
            domElement.appendChild(document.createElement('br'));
        }
    }

    private static clear(...elements: Element[]) {
        for (let element of elements) {
            element.innerHTML = null;
        }
    }

    public static clearCache() {
        ExchangeContentGenerator.currentExchange = undefined;
    }

    private static buildFormattedHeaders(headers: string[]): HTMLLIElement[] {
        let elements: HTMLLIElement[] = [];

        for (let i = 0; i < headers.length; i++) {
            if (headers[i].indexOf('HTTP') != -1) continue;

            const domLi = document.createElement('li');
            domLi.classList.add('collection-item');

            let headerDom: HTMLSpanElement = this.formatLiHeaderContent(headers[i]);

            domLi.appendChild(headerDom);
            elements.push(domLi);
        }

        return elements;
    }

    private static formatLiHeaderContent(headerStr: string): HTMLSpanElement {
        let index = headerStr.indexOf(':') + 1;
        let left = headerStr.substring(0, index);
        let right = headerStr.substring(index, headerStr.length);

        const span = document.createElement('span');
        span.classList.add('bold');
        span.innerText = left;

        const parent = document.createElement('span');
        parent.appendChild(span);
        parent.append(right);

        return parent;
    }
}

function getTextForStatus(status: number): String {
    let statusLine = `${status.toString()} ${StatusCodeLine[status.toString()]}`;
    return statusLine;
}