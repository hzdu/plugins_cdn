jQuery(document).ready(function($) {

	

	wpweb_get_year();

	

	$(".toggle-content").hide();

    

    $(".toggle-trigger").click(function() {

        if ($(".toggle-trigger").hasClass("active")) {

            $(".toggle-content").hide();

            $(".toggle-trigger").removeClass("active")

        } else {

            $(".toggle-content").show();

            $(".toggle-trigger").addClass("active")

        }

    });

    

    $(".wpweb-top").hide();

    

    $(window).scroll(function() {

        var y = jQuery(this).scrollTop();

        var sidebar_main_height = jQuery('.wpweb-sidebar-main').height();

        var footer_top = jQuery('.wpweb-footer-wrapper').offset().top;

        if (y > 100) {

            $('.wpweb-top').fadeIn()

        } else {

            $('.wpweb-top').fadeOut()

        } if ((y + sidebar_main_height) <= (footer_top)) {

            $('.wpweb-sidebar-main').fadeIn()

        } else {

            $('.wpweb-sidebar-main').fadeOut()

        }

    });

    

    $('.wpweb-top').click(function() {

        $('html,body').animate({

            scrollTop: 0

        }, 800);

        return false

    });

    

    if ($('.wpweb-sidebar-main').offset()) {

    	

    	var window_height = $( window ).height();

		var sidebar_height = $( '.wpweb-sidebar-main' ).height();

    	

		if( sidebar_height < window_height ) {

	        var stickyTop = $('.wpweb-sidebar-main').offset().top;

	        $(window).scroll(function() {

	            var windowTop = $(window).scrollTop();

	            if (stickyTop < windowTop) {

	                $('.wpweb-sidebar-main').addClass('affix');

	            } else {

	                $('.wpweb-sidebar-main').removeClass('affix');

	            }

	            if (windowTop == 0) {

	                $('.wpweb-sidebar li').removeClass('active');

	            }

	        });

		}

    }

    

    $(document).on('click', '#wpweb-section-nav .nav li a, a[href$="#schedule_time_metabox"], a[href$="#schedule_wall_posts"]', function(e) {

        var exclude_class = $(this).attr('class');

        if (exclude_class != 'wpweb-exclude') {

            target = this.hash;

            var tab_offset = $(target).offset();

            $('.wpweb-sidebar li').removeClass('active');

            $(this).parents('.nav').parent('li').addClass('active');

            $(this).parent('li').addClass('active');

            if (typeof(tab_offset) != 'undefined') {

                $('html,body').animate({

                    scrollTop: tab_offset.top

                }, 800);

            }

            return false

        }

    });

    

    $("select").each(function() {

        $(this).chosen({

            disable_search: true

        })

    });

    

    $('.auto_submit').change(function() {

        window.location.href = $(this).val()

    });

    

    $('#wpwebtab a').click(function(e) {

        e.preventDefault();

        $(this).tab('show');

        var hash = this.hash + '-tab';

        var tab_offset = $(hash).offset();

        if (typeof(tab_offset) != 'undefined') {}

        window.location = hash;

        return false

    });

    

    var url = document.location.toString();

    

    if (url.match('#')) {

        var tab_loc = (url.split('#')[1]);

        var res = tab_loc.replace('-tab', '');

        $('#wpwebtab a[href=#' + res + ']').tab('show')

    }

    

    $(document).on('click', '.wpweb-license-pop-show', function(e) {

        var wpweb_popwidth = '-' + (($('.wpweb-license-pop').width() / 2) - 10) + 'px';

        $('.wpweb-overlay').fadeIn('slow');

        $('.wpweb-license-pop').fadeIn('slow').css('margin-right', wpweb_popwidth)

    });

    

    $(document).on('click', '.wpweb-pup-close-button, .wpweb-overlay', function(e) {

        $('.wpweb-overlay').fadeOut('slow');

        $('.wpweb-license-pop').hide()

    })

});

function wpweb_get_year() {

	var d = new Date();

	var n = d.getFullYear();

	

	jQuery('.wpweb-year').html(n);

}

equalheight = function(container){

var currentTallest = 0,
     currentRowStart = 0,
     rowDivs = new Array(),
     $el,
     topPosition = 0;
 $(container).each(function() {

   $el = $(this);
   $($el).height('auto')
   topPostion = $el.position().top;

   if (currentRowStart != topPostion) {
     for (currentDiv = 0 ; currentDiv < rowDivs.length ; currentDiv++) {
       rowDivs[currentDiv].height(currentTallest);
     }
     rowDivs.length = 0; // empty the array
     currentRowStart = topPostion;
     currentTallest = $el.height();
     rowDivs.push($el);
   } else {
     rowDivs.push($el);
     currentTallest = (currentTallest < $el.height()) ? ($el.height()) : (currentTallest);
  }
   for (currentDiv = 0 ; currentDiv < rowDivs.length ; currentDiv++) {
     rowDivs[currentDiv].height(currentTallest);
   }
 });
}

$(window).load(function() {
  equalheight('.main .wpv-doc-group');
});


$(window).resize(function(){
  equalheight('.main .wpv-doc-group');
});