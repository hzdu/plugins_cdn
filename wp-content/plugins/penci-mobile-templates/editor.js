;( function( $ ) {
    $(document).ready(function(){
        
        
        function this_init(){
            $('.editor-document-tools').append('<div class="penci-mobile-template-btn"><a target="_blank" href="'+penci_editor_btn.url+'" id="penci-mobile-template-btn-dt" type="button" class="button button-primary button-large pc-edit-'+penci_editor_btn.type+'">'+penci_editor_btn.btn+'</a></div>')
        }

        let blockLoaded = false;
        let blockLoadedInterval = setInterval(function(){
            if(document.getElementsByClassName('wp-block-post-title')){
                blockLoaded = true;
                this_init();
            }
            if(blockLoaded){
                clearInterval(blockLoadedInterval);
            }
        }, 1000);
    

    });
})(jQuery);