import DataService    from '../frontend/Services/DataService';

export default function cfwAddOverlay(): void {
    const { checkoutForm } = DataService;
    const formData = checkoutForm.data();

    if ( formData[ 'blockUI.isBlocked' ] === 1 ) {
        return;
    }

    checkoutForm.block( {
        message: null,
        overlayCSS: {
            background: '#fff',
            opacity: 0.6,
        },
    } );
}
