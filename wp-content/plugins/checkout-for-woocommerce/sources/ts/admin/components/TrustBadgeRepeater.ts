class TrustBadgeRepeater {
    constructor() {
        const templateRow = jQuery( '.cfw-admin-trust-badge-template-row' );

        templateRow.find( ':input' ).prop( 'disabled', true );
        templateRow.hide();

        jQuery( '.cfw-admin-add-trust-badge-row-button' ).on( 'click', ( e ) => {
            e.preventDefault();

            const lastRow = jQuery( '.cfw-admin-trust-badge-row' ).last();

            const newRow = templateRow.clone()
                .removeClass( 'cfw-admin-trust-badge-template-row' )
                .insertAfter( lastRow );

            // Enable the inputs in the new row
            newRow.find( ':input' ).prop( 'disabled', false );

            const rowsCount = jQuery( 'tr.cfw-admin-trust-badge-row' ).not( '.cfw-admin-trust-badge-template-row' ).length.toString();

            newRow.find( ':input' ).each( ( index, element ) => {
                let name = jQuery( element ).attr( 'name' );

                if ( typeof name === 'undefined' ) {
                    return;
                }

                name = name.toString();

                name = name.replace( 'placeholder', rowsCount );
                jQuery( element ).attr( 'name', name );
            } );
            newRow.show();
        } );

        jQuery( document.body ).on( 'click', '.cfw-admin-trust-badge-remove-row-button', ( e ) => {
            e.preventDefault();

            const rowToRemove = jQuery( e.currentTarget ).parents( '.cfw-admin-trust-badge-row' );

            // eslint-disable-next-line no-alert
            if ( window.confirm( 'Are you sure you want to remove this trust badge?' ) ) {
                rowToRemove.remove();
            }
        } );
    }
}

export default TrustBadgeRepeater;
