import { StatusCodeLine } from "../Models/StatusCodeLine";
import { IHttpExchange } from "../Models/IHttpExchange";

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
        const text = ExchangeGenerator.getTextForStatus(this.model.status);

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

    private static getTextForStatus(status: number): String {
        let statusLine = `${status.toString()} ${StatusCodeLine[status.toString()]}`;
        return statusLine;
    }
}
