import { IExchangeContent } from "../Models/IExchangeContent";
import { appendCss } from "../Utils/CssHelpers";
import { createNormalButton } from "../Utils/DomHelper";
import { addDownloadAsFileListener } from "../renderer";

export class ExchangeContentGenerator {

    private static REQUEST_KEY = "#request-content";
    private static RESPONSE_KEY = "#response-content";
    private static SELECTION_KEY = "#selection";

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
        const selectionTitle = document.querySelector(_static.SELECTION_KEY);

        _static.clear(requestParent, responseParent, selectionTitle);
        _static.appendHeaders(_static.REQUEST_KEY, true, requestParent);
        _static.appendHeaders(_static.RESPONSE_KEY, true, responseParent);

        selectionTitle.append(`${this.content.responseHeaders[0]}`);
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
        let body: string = "";
        let bodyBytes: number[];

        if (dataIdentifier.indexOf('response') > -1)
            bodyBytes = ExchangeContentGenerator.currentExchange.responseBody;
        else
            bodyBytes = ExchangeContentGenerator.currentExchange.requestBody;

        for (const byte of bodyBytes)
            body += String.fromCharCode(byte);

        const button = createNormalButton('Download', 'fas fa-save');
        appendCss(button, { margin: '10px' });
        addDownloadAsFileListener(button, Buffer.from(bodyBytes));

        domElement.appendChild(button);
        domElement.appendChild(document.createElement('br'));
        domElement.append(body);
    }

    private static appendHeaders(dataIdentifier: string, formatted: boolean, domElement: Element) {
        const _static = ExchangeContentGenerator;
        let headers: string[] = [];

        headers = (dataIdentifier.indexOf('response') != -1) ? _static.currentExchange.responseHeaders :
            _static.currentExchange.requestHeaders;

        if (formatted)
            _static.appendFormattedRows(_static.buildFormattedHeaders(headers), domElement);
        else
            _static.appendRawRows(headers, domElement);
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

    private static appendFormattedRows(rows: HTMLLIElement[], domElement: Element) {
        for (const row of rows)
            domElement.appendChild(row);
    }

    private static appendRawRows(headers: string[], domElement: Element) {
        for (const header of headers) {
            domElement.append(header);
            domElement.appendChild(document.createElement('br'));
        }
    }

    private static getDomIdFromdataIdentifier(dataIdentifier: string) {
        return (dataIdentifier.indexOf('request') > -1) ? ExchangeContentGenerator.REQUEST_KEY :
            ExchangeContentGenerator.RESPONSE_KEY
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
        const selection: Element = document.querySelector(ExchangeContentGenerator.SELECTION_KEY);

        ExchangeContentGenerator.clear(request, response, selection);
    }
}