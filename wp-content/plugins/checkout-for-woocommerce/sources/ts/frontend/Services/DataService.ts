declare let cfw: any;

class DataService {
    /**
     * @type {any}
     * @private
     */
    private static _checkoutForm: JQuery<HTMLElement>;

    static initRunTimeParams(): void {
        cfw.runtime_params = {};
    }

    static getSettings(): Record<string, unknown> {
        return cfw.settings;
    }

    static getSetting( setting: string ): any {
        if ( cfw.settings[ setting ] ) {
            return cfw.settings[ setting ];
        }

        return false;
    }

    static getData( key: string ): any {
        return cfw.data[ key ] ?? false;
    }

    static updateData( key: string, value: any ): void {
        cfw.data[ key ] = value;
    }

    static getMessage( messageKey: string ): string {
        if ( cfw.messages[ messageKey ] ) {
            return cfw.messages[ messageKey ];
        }

        return '';
    }

    static getCompatibilityClass( key: string ): CompatibilityClass {
        return cfw.compatibility[ key ];
    }

    static getElement( element: string ): JQuery<HTMLElement> {
        if ( cfw.elements[ element ] ) {
            return jQuery( cfw.elements[ element ] );
        }

        return jQuery();
    }

    static getCheckoutParams(): Record<string, unknown> {
        return cfw.checkout_params;
    }

    /**
   * @param param
   */
    static getCheckoutParam( param: string ): string | boolean | null {
        if ( cfw.checkout_params[ param ] ) {
            return cfw.checkout_params[ param ];
        }

        return null;
    }

    static getRuntimeParameters(): Record<string, unknown> {
        return cfw.runtime_params;
    }

    static getRuntimeParameter( param: string ): any {
        if ( cfw.runtime_params[ param ] ) {
            return cfw.runtime_params[ param ];
        }

        return null;
    }

    static setRuntimeParameter( param: string, value: any ): void {
        cfw.runtime_params[ param ] = value;
    }

    /**
     * @returns {JQuery}
     */
    static get checkoutForm(): JQuery {
        return DataService._checkoutForm;
    }

    /**
     * @param {JQuery} value
     */
    static set checkoutForm( value: JQuery ) {
        this._checkoutForm = value;
    }
}

export default DataService;
