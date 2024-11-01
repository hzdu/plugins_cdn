declare class Alert {
    type: 'error' | 'notice' | 'success';
    message: string;
    cssClass: string;
    alertContainer: JQuery<HTMLElement>;
    temporary: boolean;
    private typeClassMapping;
    /**
     * @param type
     * @param message
     * @param extraCSSClasses
     * @param temporary
     */
    constructor(type: 'error' | 'notice' | 'success', message: string, extraCSSClasses?: string, temporary?: boolean);
}
export default Alert;
