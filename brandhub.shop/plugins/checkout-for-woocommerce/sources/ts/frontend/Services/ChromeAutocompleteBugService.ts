class ChromeAutocompleteBugService {
    constructor() {
        // Chrome has an awful, pernicious bug: https://bugs.chromium.org/p/chromium/issues/detail?id=448539
        // This results in fields on other tabs from being autofilled
        // By setting fields in hidden tabs to readonly it prevents them from being autofilled
        jQuery( window ).on( 'load updated_checkout cfw-after-tab-change', () => {
            // Mark and set readonly on elements that are not already readonly
            jQuery( '.cfw-panel' )
                .not( ':visible' )
                .find( ':input, select' )
                .not( '[readonly]' )
                .attr( 'readonly', 'readonly' )
                .addClass( 'chrome-fix' ); // Add a class to mark the fields set by this script

            // Remove readonly only from elements marked by this script
            jQuery( '.cfw-panel.active' )
                .find( ':input.chrome-fix' )
                .prop( 'readonly', false )
                .removeClass( 'chrome-fix' ); // Remove the marker class
        } );
    }
}
export default ChromeAutocompleteBugService;
