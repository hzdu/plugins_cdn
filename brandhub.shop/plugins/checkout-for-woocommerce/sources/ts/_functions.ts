/**
 * An error tolerant DOM ready replacement for jQuery(document).ready()
 * @param fn
 */
function cfwDomReady( fn ): void {
    if ( document.readyState !== 'loading' ) {
        // Document is already ready, so run the function immediately
        fn();
    } else {
        // Workaround for our Cloudflare Turnstile fix in this commit: 1a71ad88fd1d4caf35b0a0b2bbae0714cae908fe
        // One fixed, we can start using @wordpress/dom-ready
        const listener = () => {
            fn();
            document.removeEventListener( 'DOMContentLoaded', listener ); // Remove listener after execution
        };
        document.addEventListener( 'DOMContentLoaded', listener );
    }
}

function cfwDefineScrollToNotices(): void {
    // Common scroll to element code.
    jQuery.scroll_to_notices = ( scrollElement ) => {
        if ( scrollElement.length ) {
            jQuery( 'html, body' ).animate( {
                scrollTop: ( scrollElement.offset().top - 100 ),
            }, 1000 );
        }
    };
}

export { cfwDomReady, cfwDefineScrollToNotices };
