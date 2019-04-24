
/**
 * create a normal button
 * @param text Button's text
 * @param icon Font awesome tag
 */
export function createNormalButton(text: string, icon?: string): HTMLButtonElement {
    const button = document.createElement('button');

    if (icon) {
        const iDomElement = createAwesomIcon(icon, null);
        button.appendChild(iDomElement);
    }

    button.append(` ${text}`);
    button.setAttribute('class', 'btn-small blue darken-3');

    return button;
}

/**
 * Create a <i> element with font awesome framework.
 * @param type valid fa class list from font awesome
 */
export function createAwesomIcon(type: string, text: string): HTMLElement {
    const iDomElement = document.createElement('i');
    iDomElement.setAttribute('class', type);
    iDomElement.innerText = text;
    return iDomElement;
}

/**
 * Create DOM elements from body of type application/x-www-form-urlencoded
 * @param content Decoded content as string from HTTP body
 * @param htmlType the HTML tag to use as parents of each keys
 */
//TODO: Change this to class if more parser are required in the futur
export function xWwwFormUrlEncodedDomSerializer(content: string, htmlType: string): HTMLElement[] {
    const elements: HTMLElement[] = [];
    const kvSeparator = '=';
    const blockSeparator = '&';

    let blocks = content.split(blockSeparator);
    blocks.forEach((block: string) => {
        const keyValue = block.split(kvSeparator);

        const domElement = document.createElement(htmlType);
        const leftElement = document.createElement('span');
        const rightElement = document.createElement('span');

        leftElement.setAttribute('class', 'bold');
        rightElement.setAttribute('class', 'italic');

        domElement.appendChild(leftElement);
        domElement.appendChild(rightElement);

        leftElement.innerText = `${keyValue[0]}: `;
        rightElement.innerText = keyValue[1];

        elements.push(domElement);
    });
    return elements;
}
