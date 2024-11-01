import LoggingService from '../../Services/LoggingService';
import Compatibility  from '../Compatibility';
import ParsleyService from '../../Services/ParsleyService';

class ExtraCheckoutFieldsBrazil extends Compatibility {
    private _targetNodes = [
        'billing_persontype_field',
        'billing_cnpj_field',
        'billing_cpf_field',
    ];

    constructor() {
        super( 'ExtraCheckoutFieldsBrazil' );
    }

    load() {
        // Options for the observer (which mutations to observe)
        const config = { attributes: true, childList: false, subtree: false };

        // Callback function to execute when mutations are observed
        const callback = ( mutationsList ) => {
            mutationsList.forEach( ( { type, target } ) => {
                if ( type !== 'attributes' ) {
                    return;
                }

                const group = jQuery( target ).parents( '.cfw-panel' ).attr( 'id' );

                if ( target.classList.contains( 'validate-required' ) && target.style.display !== 'none' ) {
                    LoggingService.logNotice( `${target.id} needs to be validated!` );

                    jQuery( target ).find( ':input' ).attr( 'data-parsley-trigger', 'keyup change focusout' )
                        .attr( 'data-parsley-group', group )
                        .attr( 'data-parsley-required', 'true' );
                } else if ( !target.classList.contains( 'validate-required' ) || target.style.display === 'none' ) {
                    LoggingService.logNotice( `${target.id} needs to be UNVALIDATED!` );

                    jQuery( target ).find( ':input' ).removeAttr( 'data-parsley-trigger' )
                        .removeAttr( 'data-parsley-group' )
                        .attr( 'data-parsley-required', 'false' );
                }
            } );

            ParsleyService.instance.queueRefreshParsley();
        };

        // Create an observer instance linked to the callback function
        const observer = new MutationObserver( callback );

        // Start observing the target node for configured mutations
        this._targetNodes.forEach( ( value ) => {
            const element = document.getElementById( value );

            if ( element ) {
                observer.observe( element, config );
            }
        } );
    }
}

export default ExtraCheckoutFieldsBrazil;
