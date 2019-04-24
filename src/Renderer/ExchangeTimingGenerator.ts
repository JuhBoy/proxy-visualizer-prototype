import { ITiming } from "../Models/IExchangeContent";

export class ExchangeTimingGenerator {

    public static readonly ID = "#exchange-timings";

    private static currentTimings: ITiming[];
    private timings: ITiming[];

    constructor(timings: ITiming[]) {
        if (!timings) {
            throw new Error("timings cannot be null");
        }
        this.timings = timings;
    }

    public flush(): void {
        const domParent = document.querySelector(ExchangeTimingGenerator.ID);
        ExchangeTimingGenerator.clear(domParent);

        this.timings.forEach(timing => {
            const row = this.createTimeRow(timing);
            domParent.appendChild(row);
        });

        ExchangeTimingGenerator.currentTimings = this.timings;
    }

    private createTimeRow(timing: ITiming): HTMLLIElement {
        const domElement = document.createElement('li');
        const spanDomKey = document.createElement('span');
        const spanDomVal = document.createElement('span');

        spanDomKey.innerText = `${timing.name}: `;
        spanDomVal.innerText = `${timing.msTime}ms`;
        spanDomKey.classList.add('bold');

        domElement.appendChild(spanDomKey);
        domElement.appendChild(spanDomVal);
        domElement.classList.add('collection-item');

        return domElement;
    }

    public static clear(el: Element) {
        el.innerHTML = null;
    }

    public static clearCache() {
        ExchangeTimingGenerator.currentTimings = null;
        const domElement = document.querySelector(ExchangeTimingGenerator.ID);
        ExchangeTimingGenerator.clear(domElement);
    }
}
