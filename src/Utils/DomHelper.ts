
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
