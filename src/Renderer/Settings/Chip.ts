import { Generator } from "../Generator";
import { createAwesomIcon } from "../../Utils/DomHelper";

export class Chip extends Generator {

    constructor(text: string, parent: HTMLElement) {
        super(text, parent);
        this.buildElement();
    }

    public flush(): void {
        super.flush();
    }

    public addRightIcon(classes: string, onClick: EventListener) {
        const domIcon = createAwesomIcon(classes, '');
        domIcon.addEventListener('click', onClick);
        this.domElement.append(' ', domIcon);
    }

    private buildElement(): void {
        this.domElement = document.createElement('div');
        this.domElement.setAttribute('class', 'chip');
        this.domElement.append(this.text);
    }
}
