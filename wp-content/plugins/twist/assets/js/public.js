(function ($) {
  'use strict';

  $(document).ready(function () {

    // Check if have Fancybox
    if (typeof $.fn.fancybox == 'function') {
      // Customize icons
      var data_autostat = false;
      if (wpgs_js_data.thumb_autoStart == '1') {
        data_autostat = true;
      }
      $.fancybox.defaults = $.extend(true, {}, $.fancybox.defaults, {
        btnTpl: {

          // Arrows
          arrowLeft: '<button data-fancybox-prev class="fancybox-button fancybox-button--arrow fancybox-button--arrow_left" title="{{PREV}}">' +
            '<span class="arrow-prev"></span>' +
            "</button>",

          arrowRight: '<button data-fancybox-next class="fancybox-button fancybox-button--arrow fancybox-button--arrow_right" title="{{NEXT}}">' +
            '<span class="arrow-next"></span>' +
            "</button>",


        },
        thumbs: {
          autoStart: data_autostat,
          hideOnClose: true,
          parentEl: ".fancybox-container",
          axis: wpgs_js_data.thumb_axis
        },
        mobile: {
          clickContent: "close",
          clickSlide: "close",
          thumbs: {
            autoStart: false,
            axis: "y"
          }
        }
      });


      var selector = '.wpgs-wrapper .slick-slide:not(.slick-cloned) a';

      // Skip cloned elements
      $().fancybox({
        selector: selector,
        backFocus: false
      });

      // Attach custom click event on cloned elements, 
      // trigger click event on corresponding link
      $(document).on('click', '.wpgs-wrapper .slick-cloned a', function (e) {
        $(selector)
          .eq(($(e.currentTarget).attr("data-slick-index") || 0) % $(selector).length)
          .trigger("click.fb-start", {
            $trigger: $(this)
          });

        return false;
      });

    }

    // Variation Data

    var get_thumb_first = $(document).find('.gallery_thumbnail_first');
    var get_main_first = $(document).find('.woocommerce-product-gallery__image');
    get_main_first.find('img').removeAttr('srcset');
    jQuery('.variations_form').each(function () {

      jQuery(this).on('show_variation', function (event, variation) {

        if (wpgs_js_data.variation_mode == 'default') {
          var thumb_src = variation.image.gallery_thumbnail_src,
            first_thumb_src = get_main_first.find('img').attr("src");
          get_thumb_first.find('img').attr('src', thumb_src);
          get_main_first.find('img').attr('src', variation.image.src);
          get_main_first.find('img').removeAttr('srcset');

          // Reset Slider location to '0' when variation change
          $('.woocommerce-product-gallery__image .img-attr').on('load', function () {
            $('.wpgs-image').slick('slickGoTo', 0);
          });


        } else {
          var gallery_slide_index = $('.wpgs-image').find('[data-attachment-id="' + variation.image_id + '"]').data('slick-index');

          if (gallery_slide_index !== undefined) {
            $('.wpgs-image').slick('slickGoTo', gallery_slide_index);
          }
        }

      });
    });

    $('.thumbnail_image').each(function (index) {
      $(this).on('click', function () {
        $('.thumbnail_image').removeClass('slick-current');
        $(this).addClass('slick-current');
        $('.woocommerce-product-gallery__lightbox').css({ "display": "none" });
        setTimeout(function () {
          $('.slick-current .woocommerce-product-gallery__lightbox').css({ "display": "block", "opacity": "1" });
          $('.woocommerce-product-gallery__image .woocommerce-product-gallery__lightbox').css({ "display": "block", "opacity": "1" });
        }, 400);

      });
    });



    // Remove SRCSET for Thumbanils
    $('.wpgs-thumb img').each(function () {
      $(this).removeAttr('srcset', 'data-thumb_image');
      $(this).removeAttr('data-thumb_image');
      $(this).removeAttr('sizes');
      $(this).removeAttr('data-large_image');
    });

    function ZoomIconApperce() {
      setTimeout(function () {
        $('.woocommerce-product-gallery__lightbox').css({ "display": "block", "opacity": "1" });

      }, 500);
    }

    // On swipe event
    $('.wpgs-image').on('swipe', function (event, slick, direction) {
      $('.woocommerce-product-gallery__lightbox').css({ "display": "none" });
      ZoomIconApperce();
    });
    // On edge hit
    $('.wpgs-image').on('afterChange', function (event, slick, direction) {
      ZoomIconApperce();
    });
    $('.wpgs-image').on('click', '.slick-arrow ,.slick-dots', function () {
      $('.woocommerce-product-gallery__lightbox').css({ "display": "none" });
      ZoomIconApperce();
    });
    $('.wpgs-image').on('init', function (event, slick) {
      ZoomIconApperce();
    });


  });
  // if found prettyphoto rel then unbind click
  $(window).on('load', function () {
    $("a.woocommerce-product-gallery__lightbox").attr('rel', ''); // remove prettyphoto
    $("a.woocommerce-product-gallery__lightbox").removeAttr('data-rel'); // remove prettyphoto ("id")	
    $('a.woocommerce-product-gallery__lightbox').unbind('click.prettyphoto');

  });


})(jQuery);

// Other code using $ as an alias to the other library