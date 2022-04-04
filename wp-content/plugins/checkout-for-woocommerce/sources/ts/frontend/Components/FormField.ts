class FormField {
    private static _floatClass = 'cfw-label-is-floated';

    constructor() {
        this.processFieldLabels();

        jQuery( document.body ).on( 'keyup change', '.cfw-input-wrap :input', ( e ) => {
            this.maybeAddFloatClass( jQuery( e.target ) );
        } );

        // Handle fields after dynamic refreshes
        jQuery( document.body ).on( 'updated_checkout', () => {
            // Ditto
            setTimeout( () => {
                this.processFieldLabels();
            } );
        } );

        // Disable highlighted countries separator
        jQuery( '.country_select' ).find( 'option:contains(---)' ).attr( 'disabled', 'disabled' );
    }

    maybeAddFloatClass( element: any ): void {
        const parentElement = jQuery( element ).parents( '.cfw-input-wrap' );

        if ( !parentElement.find( '.cfw-floatable-label' ).length ) {
            return;
        }

        if ( jQuery( element ).attr( 'type' ) === 'hidden' ) {
            return;
        }

        if ( jQuery( element ).val() !== '' || jQuery( element ).is( 'select' )  ) {
            parentElement.addClass( FormField.floatClass );
        } else {
            parentElement.removeClass( FormField.floatClass );
        }
    }

    processFieldLabels(): void {
        jQuery( '.cfw-input-wrap :input' ).each( ( index, element ) => {
            this.maybeAddFloatClass( element );
        } );
    }

    static get floatClass(): string {
        return this._floatClass;
    }
}

export default FormField;
