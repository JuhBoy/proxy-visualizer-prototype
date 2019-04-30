import { Generator } from "../Generator";
import { HashStr } from "../../Utils/Collections";
import { createAwesomIcon } from "../../Utils/DomHelper";

/**
 * Empty Row for settings view
 */
export class SettingRow extends Generator {

    private innerRow: HTMLElement;

    constructor(text: string, parent: HTMLElement) {
        super(text, parent);
        this.buildDomElement();
    }

    public flush(): void {
        super.flush();
    }

    public addContent(content: Generator) {
        this.domElement.firstChild.appendChild(content.getDomElement());
    }

    public getInnerRow(): HTMLElement {
        return this.innerRow;
    }

    protected buildDomElement(): void {
        this.innerRow = document.createElement('div');
        this.innerRow.setAttribute('class', 'col s12');

        this.domElement = document.createElement('div');
        this.domElement.setAttribute('class', 'row valign-wrapper');
        this.domElement.appendChild(this.innerRow);

        if (this.text) {
            this.domElement.append(this.text);
        }
    }
}

/**
 * HTML CHECKBOX INPUT
 * Uses Materialize Classes
 */
export class CheckBox extends Generator {

    /**
     * Must have a parent to add the special class "switch" or it will not appears.
     * If no parent specified, add the class yourself to the parent of the checkbox.
     * @param text Left text
     * @param parent The parent on wich the flushing occures
     */
    constructor(text: string, parent: HTMLElement) {
        super(text, parent);
        this.buildDomElement();
    }

    public flush(): void {
        super.flush();
        if (this.parent) {
            this.parent.classList.add('switch');
        }
    }

    public addListener(event: EventListener): void {
        this.domElement.children[0].addEventListener('change', event, false);
    }

    public setValue(value: boolean): void {
        const innerInput: any = this.domElement.querySelector('input[type="checkbox"]');
        innerInput.checked = value;
    }

    protected buildDomElement(): void {
        this.domElement = document.createElement('label');

        const domLever = document.createElement('span');
        domLever.classList.add('lever');

        const domInput = document.createElement('input');
        domInput.setAttribute('type', 'checkbox');

        this.domElement.append(this.text);
        this.domElement.appendChild(domInput);
        this.domElement.appendChild(domLever);
    }
}

/**
 * HTML SELECT
 * Use Materialize classes
 */
export class Select extends Generator {

    private label: HTMLElement;
    private options: HashStr<string>;

    constructor(text: string, parent: HTMLElement) {
        super(text, parent);
        this.buildDomElement();
        this.options = {};
    }

    public flush(): void {
        super.flush();
    }

    /**
     * Add options to the current select HTML DOM Element
     * @param options The options as key::value pair.
     * The Key is used for the text node <option> while the value for the value attribute
     */
    public addOptions(options: HashStr<string>) {
        this.options = {
            ...this.options,
            ...options
        };

        for (const key of Object.keys(options)) {
            const domOption = document.createElement('option');
            domOption.setAttribute('value', this.options[key]);
            domOption.append(key);

            if (this.domElement.children.length == 0) {
                domOption.setAttribute('disabled', null);
                domOption.setAttribute('selected', null);
            }

            this.domElement.appendChild(domOption);
        }
    }

    public addListener(event: EventListener) {
        this.domElement.addEventListener('change', event);
    }

    /**
     * This method change the value showed by the select.
     * @param value The string value present in the hash of options.
     */
    public setValue(value: string) {
        const index: number = Object.keys(this.options).indexOf(value);
        (this.domElement as HTMLSelectElement).selectedIndex = index;

        this.domElement.querySelector('option[selected="null"]').removeAttribute('selected');
        const option: HTMLOptionElement = this.domElement.querySelector(`option[value="${value}"`);
        option.setAttribute('selected', null);
        this.domElement.dispatchEvent(new Event('change')); // For some framwork, it's needed
    }

    protected buildDomElement(): void {
        this.domElement = document.createElement('select');
        const domIcon = createAwesomIcon('fas fa-dot-circle', '');
        this.label = document.createElement('label');
        this.label.appendChild(domIcon);
        this.label.append(` ${this.text}`);
    }
}

export class Input extends Generator {

    private inputLabel: HTMLElement;

    /**
     * Constructor
     * @param text Text of the Input label
     * @param parent Parent to flush new dom data
     */
    constructor(text: string, parent: HTMLElement) {
        super(text, parent);
        this.buildDomElement();
    }

    public flush(): void {
        super.flush();
        if (this.parent) {
            this.parent.appendChild(this.inputLabel);
        }
    }

    /**
     * Overrided to include label dom element.
     * Flush must be called first
     */
    public getDomElement(): HTMLElement {
        const wrapper = document.createElement('div');
        wrapper.setAttribute('class', 'input-field');
        wrapper.appendChild(this.domElement);
        wrapper.appendChild(this.inputLabel);
        return wrapper;
    }

    public setTypeName(type: string, name: string) {
        this.inputLabel.setAttribute('for', name);
        this.domElement.setAttribute('type', type);
        this.domElement.setAttribute('name', name);
    }

    public setIcon(klass: string) {
        const domIcon = createAwesomIcon(klass, '');
        this.inputLabel.prepend(domIcon, ' ');
    }

    public setListener(type: string, event: EventListener) {
        this.domElement.addEventListener(type, event);
    }

    public setValue(value: any) {
        (this.domElement as HTMLInputElement).value = value;
    }

    protected buildDomElement(): void {
        this.domElement = document.createElement('input');
        this.inputLabel = document.createElement('label');
        this.inputLabel.append(this.text);
    }
}
