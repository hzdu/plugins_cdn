declare class Accordion {
    private readonly _targetSelector;
    constructor(targetSelector?: string);
    setListeners(): void;
    static showContent(target: JQuery<HTMLElement>): void;
}
export default Accordion;
