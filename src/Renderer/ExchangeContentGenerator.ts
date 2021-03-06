import { IExchangeContent } from "../Models/IExchangeContent";
import { appendCss } from "../Utils/CssHelpers";
import { createNormalButton, xWwwFormUrlEncodedDomSerializer } from "../Utils/DomHelper";
import { addDownloadAsFileListener } from "../renderer";

export class ExchangeContentGenerator {

    private static REQUEST_KEY = "#request-content";
    private static RESPONSE_KEY = "#response-content";

    private static currentExchange: IExchangeContent;

    private content: IExchangeContent;

    public constructor(content: IExchangeContent) {
        this.content = content;
        ExchangeContentGenerator.currentExchange = this.content;
    }

    /**
     * Construct the formatted (#request-content|#response-content) content
     */
    public flush(): void {
        const _static = ExchangeContentGenerator;
        const requestParent = document.querySelector(_static.REQUEST_KEY);
        const responseParent = document.querySelector(_static.RESPONSE_KEY);
        
        _static.clear(requestParent, responseParent);
        _static.appendHeaders(_static.REQUEST_KEY, true, requestParent);
        _static.appendHeaders(_static.RESPONSE_KEY, true, responseParent);
    }

    /**
     * Change the content of (#request-content|#response-content) according to @param dataIdentifier
     * @param formatted If the content should be formatted or not
     * @param dataIdentifier The data identifier (response-headers|request-headers|response-body-content)
     */
    public static switchPresentation(formatted: boolean, dataIdentifier: string): void {
        const _static = ExchangeContentGenerator;
        if (!_static.currentExchange) return;

        const domId = _static.getDomIdFromdataIdentifier(dataIdentifier);
        const domElement = document.querySelector(domId);
        _static.clear(domElement);

        if (dataIdentifier.indexOf('body-content') > -1)
            _static.appendBodyContent(dataIdentifier, domElement);
        else
            _static.appendHeaders(dataIdentifier, formatted, domElement);
    }

    /**
     *  CORE =====================================================================================
     */

    private static appendBodyContent(dataIdentifier: string, domElement: Element) {
        const _static = ExchangeContentGenerator;
        let body: string = "";
        let headers: string[];

        if (dataIdentifier.indexOf('response') > -1) {
            headers = _static.currentExchange.responseHeaders;
            body = _static.decodeB64String(_static.currentExchange.responseBody);
        } else {
            headers = _static.currentExchange.requestHeaders;
            body = _static.decodeB64String(_static.currentExchange.requestBody);
        }

        const button = createNormalButton('', 'fas fa-save');
        appendCss(button, { marginBottom: '5px' });
        addDownloadAsFileListener(button, Buffer.from(body));

        domElement.appendChild(button);
        domElement.appendChild(document.createElement('br'));

        if (_static.isXFormUrlEncodedContentType(headers)) {
            const elements = xWwwFormUrlEncodedDomSerializer(body, 'li');
            elements.forEach((el) => {
                el.setAttribute('class', 'collection-item');
                domElement.appendChild(el);
            });
        } else {
            domElement.append(body);
        }
    }

    private static appendHeaders(dataIdentifier: string, formatted: boolean, domElement: Element) {
        const _static = ExchangeContentGenerator;        
        const isResponse: boolean = (dataIdentifier.indexOf('response') != -1);

        if (formatted) {
            const headers: string[] =  (isResponse) ? _static.currentExchange.responseHeaders : _static.currentExchange.requestHeaders;
            _static.appendFormattedRows(_static.buildFormattedHeaders(headers), domElement);
        } else {
            const headers: string = (isResponse) ? _static.currentExchange.responseRawHeaders : _static.currentExchange.requestRawHeaders;
            _static.appendRawRows(headers, domElement);
        }
    }

    private static buildFormattedHeaders(headers: string[]): HTMLLIElement[] {
        const elements: HTMLLIElement[] = [];

        for (let i = 0; i < headers.length; i++) {
            if (headers[i].indexOf('HTTP') != -1) continue;

            const domLi = document.createElement('li');
            domLi.classList.add('collection-item');

            let headerDom: HTMLSpanElement = this.buildFormattedLiHeaders(headers[i]);

            domLi.appendChild(headerDom);
            elements.push(domLi);
        }

        return elements;
    }

    private static buildFormattedLiHeaders(headerStr: string): HTMLSpanElement {
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

    /**
     *  UTILS =====================================================================================
     */

    private static isXFormUrlEncodedContentType(headers: string[]): boolean {
        return headers.indexOf('Content-Type: application/x-www-form-urlencoded') > -1;
    }

    private static appendFormattedRows(rows: HTMLLIElement[], domElement: Element) {
        for (const row of rows)
            domElement.appendChild(row);
    }

    private static appendRawRows(headers: string, domElement: Element) {
        const lines: string[] = headers.match(/[^\r\n]+/g);
        for (const line of lines) {
            domElement.append(line, document.createElement("br"));
        }
    }

    private static getDomIdFromdataIdentifier(dataIdentifier: string) {
        return (dataIdentifier.indexOf('request') > -1) ? ExchangeContentGenerator.REQUEST_KEY :
            ExchangeContentGenerator.RESPONSE_KEY
    }

    private static decodeB64String(b64string: string): string {
        return atob(b64string);
    }

    private static clear(...elements: Element[]) {
        for (let element of elements) {
            element.innerHTML = null;
        }
    }

    public static clearCache() {
        ExchangeContentGenerator.currentExchange = undefined;

        const request: Element = document.querySelector(ExchangeContentGenerator.REQUEST_KEY);
        const response: Element = document.querySelector(ExchangeContentGenerator.RESPONSE_KEY);

        ExchangeContentGenerator.clear(request, response);
    }
}
