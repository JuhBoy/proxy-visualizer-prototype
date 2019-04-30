const MessageCss: any = {
    position: 'absolute',
    padding: '11px',
    bottom: '20px',
    right: '20px',
    width: '350px',
    height: '100px',
    color: 'white',
    borderRadius: '3px',
    overflow: 'hidden',
    transition: '0.3s ease'
}

export const validMessageCss: any = {
    ...MessageCss,
    background: '#43a047',
}

export const warnMessageCss: any = {
    ...MessageCss,
    background: '#fdd835'
}

export const errorMessageCss: any = {
    ...MessageCss,
    background: '#e53935'
}

export const chipContainerCss: any = {
    border: '1px solid gray',
    height: '150px',
    padding: '2px',
    margin: '5px',
    overflowY: 'scroll'
}

export function appendCss(element: HTMLElement, properties: any) {
    for (const key in properties) {
        if (!properties.hasOwnProperty(key)) continue;
        let that: any = element.style;
        that[key] = properties[key];
    }
}
