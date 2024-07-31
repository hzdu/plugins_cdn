class Accordion {
    private readonly _targetSelector: string;

    constructor( targetSelector = '.cfw-radio-reveal-group' ) {
        this._targetSelector = targetSelector;
        this.setListeners();
    }

    setListeners(): void {
        const container = jQuery( '#order_review, #cfw-order-review' ).first();
        const targetSelectorRadio = `${this._targetSelector} .cfw-radio-reveal-title-wrap :radio`;
        const targetSelector = this._targetSelector;

        container.on( 'change', targetSelectorRadio, ( e ) => {
            Accordion.showContent( jQuery( e.target ) );
        } );

        jQuery( targetSelectorRadio ).filter( ':checked' ).trigger( 'change' );

        jQuery( document.body ).on( 'updated_checkout', () => {
            jQuery( targetSelector ).each( ( index, element ) => {
                Accordion.showContent( jQuery( element ).find( `${targetSelectorRadio}:checked` ).first() );
            } );
        } );

        jQuery( document.body ).on( 'click', '.cfw-radio-reveal-li', ( e ) => {
            if ( jQuery( e.target ).is( ':input' ) ) {
                return;
            }

            jQuery( e.currentTarget ).find( '.cfw-radio-reveal-title-wrap, .cfw-shipping-method-inner' ).find( ':radio:not(:checked)' ).prop( 'checked', true )
                .trigger( 'change' )
                .trigger( 'click' );
        } );
    }

    static showContent( target: JQuery<HTMLElement> ): void {
        const radioButton = target;
        const parentRow = radioButton.parents( '.cfw-radio-reveal-li' ).first();
        const siblings = parentRow.siblings( '.cfw-radio-reveal-li' );
        const content = siblings.find( '.cfw-radio-reveal-content:visible' );

        if ( radioButton.is( ':checked' ) ) {
            siblings.removeClass( 'cfw-active' );
            parentRow.addClass( 'cfw-active' );
            content.slideUp( 300 );
            parentRow.find( '.cfw-radio-reveal-content:hidden' ).slideDown( 300 );
        } else {
            parentRow.removeClass( 'cfw-active' );
        }
    }
}

export default Accordion;
