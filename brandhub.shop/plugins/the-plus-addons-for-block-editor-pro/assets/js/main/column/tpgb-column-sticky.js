
/**
 * Sticky Column
 */
window.addEventListener('load', () => {
    tpstiCol(document)
});

function tpstiCol(doc) {

    let allStickyCol = doc.querySelectorAll('.tpgb-column.tpgb-column-sticky,.tpgb-container-col.tpgb-column-sticky');
    if(allStickyCol){
        allStickyCol.forEach((sc)=>{
            let settings = JSON.parse(sc.getAttribute('data-sticky-column'));
            let stickyInst = null,
            stickyInstOptions = {
                topSpacing: 40,
                bottomSpacing: 40,
                containerSelector: (sc.classList.contains('tpgb-container-col')) ? '.tpgb-container-row' : '.tpgb-container' ,
                innerWrapperSelector: (sc.classList.contains('tpgb-container-col')) ? '' :  '.tpgb-column',
                minWidth: 100,
            },
            screenWidth = screen.width ; 

            if ( sc.classList.contains('tpgb-column-sticky') ) {
                if( true === settings['sticky'] ){
                    if( (screenWidth >= 1201  && -1 !== settings['stickyOn'].indexOf( 'desktop' )) || (screenWidth <= 1200 && screenWidth >= 768  && -1 !== settings['stickyOn'].indexOf( 'tablet' )) || (screenWidth <= 767 && -1 !== settings['stickyOn'].indexOf( 'mobile' ))){
                        tpgb_stickyColumn();
                        window.addEventListener('resize', ()=>{debounce(150, columnResizeDebounce)});
                        window.addEventListener('orientationchange', ()=>{debounce(150, columnResizeDebounce)});
                    }
                }
            }

            function tpgb_stickyColumn(){
                stickyInstOptions.topSpacing = settings['topSpacing'];
                stickyInstOptions.bottomSpacing = settings['bottomSpacing'];
                sc.setAttribute('data-stickyColumnInit', true);
                stickyInst = new StickySidebar( sc, stickyInstOptions );
            }

            function columnResizeDebounce() {
                var availableDevices  = settings['stickyOn'] || [];

                if ( [] !== availableDevices ) {
                    sc.setAttribute( 'data-stickyColumnInit', true );
                    stickyInst = new StickySidebar( sc, stickyInstOptions );
                    stickyInst.updateSticky();
                } else {
                    sc.setAttribute( 'data-stickyColumnInit', false );
                    stickyInst.destroy();
                }
            }
        });
    }
    
}

function debounce( threshold, callback ) {
    var timeout;
    return function debounced( $event ) {
        function delayed() {
            callback.call( this, $event );
            timeout = null;
        }
        if ( timeout ) {
            clearTimeout( timeout );
        }
        timeout = setTimeout( delayed, threshold );
    };
}