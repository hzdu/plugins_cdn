
( function( window, wp ){

    // just to keep it cleaner - we refer to our link by id for speed of lookup on DOM.
    var link_id = 'penciai-content-generator-btn';

    // prepare our custom link's html.
    var link_html = '<a id="' + link_id + '" class="components-button penciai-toolbar-btn penciai-content-generator-btn penciai-button loading" href="#" >Penci AI SmartContent Creator <span class="penciai_spinner hide_spin"></span></a>';

    // check if gutenberg's editor root element is present.
    var editorEl = document.getElementById( 'editor' );
    if( !editorEl ){ // do nothing if there's no gutenberg root element on page.
        return;
    }

    var unsubscribe = wp.data.subscribe( function () {
        setTimeout( function () {
            if ( /*!document.getElementById( link_id )*/ document.getElementsByClassName("penciai-toolbar-btn")[0]==undefined ) {
                var toolbalEl = editorEl.querySelector( '.edit-post-header-toolbar' );
                if( toolbalEl instanceof HTMLElement ){
                    toolbalEl.insertAdjacentHTML( 'beforeend', link_html );
                }
            }

        }, 1 )
    } );
    // unsubscribe is a function - it's not used right now
    // but in case you'll need to stop this link from being reappeared at any point you can just call unsubscribe();

} )( window, wp )