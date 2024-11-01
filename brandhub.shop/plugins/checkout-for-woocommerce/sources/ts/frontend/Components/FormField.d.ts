declare class FormField {
    private static _floatClass;
    constructor();
    static maybeAddFloatClass(element: any): void;
    processFieldLabels(): void;
    static get floatClass(): string;
}
export default FormField;
