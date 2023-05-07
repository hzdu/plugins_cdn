class Accordion {
    private readonly _targetSelector;

    /**
     * Default selector is the class used for all radio reveal groups
     * SO, when using you have to remember that .cfw-radio-reveal-group matches
     * multiple parent containers for different accordions
     *
     * @param targetSelector
     */
    constructor( targetSelector = '.cfw-radio-reveal-group' ) {
        this._targetSelector = targetSelector;

        this.setListeners();
    }

    setListeners(): void {
        jQuery( document.body ).on( 'change', `${this._targetSelector} .cfw-radio-reveal-title-wrap :radio`, ( e ) => {
            this.showContent( e.target );
        } );

        // Page load
        jQuery( `${this._targetSelector} .cfw-radio-reveal-title-wrap :radio:checked` ).each( ( index, element ) => {
            this.showContent( element );
        } );
    }

    showContent( target ): void {
        const radioButton = jQuery( target );

        if ( !radioButton.is( ':checked' ) ) {
            return;
        }

        const parentRow = radioButton.parents( 'li' ).first();

        parentRow.siblings( 'li' ).removeClass( 'cfw-active' );
        parentRow.addClass( 'cfw-active' );
    }
}

export default Accordion;
