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

    buildTimeDom() {
        const domElement = this.buildGenericNode(this.model.time.toString());
        domElement.innerText += " ms";
        return domElement;
    }

    buildStatusDom() {
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
}

export class ExchangeContentGenerator {

    private content: IExchangeContent;

    public constructor(content: IExchangeContent) {
        this.content = content;
    }

    public flush(): void {
        const requestParent  = document.querySelector('#request-headers');
        const responseParent = document.querySelector('#response-headers');
        const selectionTitle = document.querySelector('#selection');

        this.clear(requestParent, responseParent, selectionTitle);

        const requestRows  = this.buildFormattedHeaders(this.content.requestHeaders);
        const responseRows = this.buildFormattedHeaders(this.content.responseHeaders);

        for (const row of requestRows)
            requestParent.appendChild(row);
        for (const row of responseRows)
            responseParent.appendChild(row);

        selectionTitle.append(`${this.content.responseHeaders[0]}`);
    }

    private clear(...elements: Element[]) {
        for (let element of elements) {
            element.innerHTML = null;
        }
    }

    buildFormattedHeaders(headers: string[]): HTMLLIElement[] {
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

    formatLiHeaderContent(headerStr: string): HTMLSpanElement {
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