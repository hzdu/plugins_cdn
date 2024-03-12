class Alert {
    public type: 'error' | 'notice' | 'success';

    public message: string;

    public cssClass: string;

    public alertContainer: JQuery<HTMLElement>;

    public temporary: boolean;

    private typeClassMapping = {
        error: 'cfw-alert-error',
        notice: 'cfw-alert-info',
        success: 'cfw-alert-success',
    };

    /**
     * @param type
     * @param message
     * @param extraCSSClasses
     * @param temporary
     */
    constructor( type: 'error' | 'notice' | 'success', message: string, extraCSSClasses: string = null, temporary = false ) {
        this.type = type;
        this.message = message;
        this.cssClass = this.typeClassMapping[ type ] + ( extraCSSClasses ? ` ${extraCSSClasses}` : '' );
        this.alertContainer = jQuery( '#cfw-alert-container' );
        this.temporary = temporary;
    }
}

export default Alert;
