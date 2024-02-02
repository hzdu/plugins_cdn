import swal                    from 'sweetalert2/dist/sweetalert2';

class SettingsImporterButton {
    constructor( selector: string ) {
        const importButton = jQuery( selector );

        importButton.on( 'click', ( e ) => {
            e.preventDefault();

            swal.fire( {
                title: 'Confirm',
                text: 'Are you sure you want replace your current settings?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, replace my settings!',
                confirmButtonColor: '#4e9ae0',
                customClass: {
                    container: 'cfw-swal-container',
                },
            } ).then( ( result ) => {
                if ( result.isConfirmed ) {
                    importButton.off( 'click' );
                    importButton.click();
                }
            } );
        } );
    }
}

export default SettingsImporterButton;
