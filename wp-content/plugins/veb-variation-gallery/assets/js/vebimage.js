jQuery(document).ready(function($){
    jQuery('a img').removeAttr('title');
    var effect=vebimage_vars.imgeffect;
    var speed = vebimage_vars.speed;
    var dots=vebimage_vars.dotvalue;

    if( effect != '')
    {
        $('ul.products li.wcmi-has-gallery.sale').hover(function() {
            $(this).find( '.woocommerce-LoopProduct-link span.onsale' ).hide();
            $(this).find( '.woocommerce-LoopProduct-link img:first' ).hide();
        }, function() {
            $(this).find( '.woocommerce-LoopProduct-link span.onsale' ).show();
            $(this).find( '.woocommerce-LoopProduct-link img:first' ).show();
        });
        $('ul.products li.wcmi-has-gallery').hover(function () {
            $(this).find( 'a>img.wp-post-image:first-child' ).hide();
        }, function () {
            $(this).find( 'a>img.wp-post-image:first-child' ).show();
        });
    }

    if( effect == 'flip' ){
        $( '.productimgflip' ).cycle({
            timeout :     speed,
        });
        if(dots=='yes'){
            $(this).find( '.imgflipdots span' ).hide();
        }
        $( 'ul.products li.wcmi-has-gallery' ).hover(function () {
            $(this).find( '.productimgflip' ).show();
            $(this).find( '.imgflipdots' ).show();
        }, function () {
            $(this).find( '.productimgflip' ).hide();
            $(this).find( '.imgflipdots' ).hide();
        });
    }
    else if( effect == 'fade' ){
        $( '.productimgfade' ).cycle({
            timeout :     speed,
        });
        if(dots=='yes'){
            $(this).find( '.imgfadedots span' ).hide();
        }
        $( 'ul.products li.wcmi-has-gallery' ).hover(function () {
            $(this).find( '.productimgfade' ).show();
            $(this).find( '.imgfadedots' ).show();
        }, function () {
            $(this).find( '.productimgfade' ).hide();
            $(this).find( '.imgfadedots' ).hide();
        });
    }
    else if( effect == 'slider' ){
        $( '.productimgslider' ).cycle({
            timeout :     speed,
        });
        if(dots=='yes'){
            $(this).find( '.imgsliderdots span' ).hide();
        }
        $( 'ul.products li.wcmi-has-gallery' ).hover(function () {
            $(this).find( '.productimgslider' ).show();
            $(this).find( '.imgsliderdots' ).show();
        }, function () {
            $(this).find( '.productimgslider' ).hide();
            $(this).find( '.imgsliderdots' ).hide();
        });
    }

});
