import { IHttpExchange } from "./Models/IHttpExchange";
import { StatusCodeLine } from "./Models/StatusCodeLine";

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
        domSpan.classList.add("teal");
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
}

function getTextForStatus(status: number): String {
    let statusLine = `${status.toString()} ${StatusCodeLine[status.toString()]}`;
    return statusLine;
}