(function($) {
    'use strict';
    $(document).ready(function() {
        try{
            $('.mediPlayer').mediaPlayer();
        }catch(e){
            //console.log(e.message);
        }
    });
})(jQuery);