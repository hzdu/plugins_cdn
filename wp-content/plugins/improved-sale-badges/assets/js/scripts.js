(function($){
"use strict";

	function u(e) {
		return typeof e == 'undefined' ? false : e;
	}

	$(document).ajaxComplete( function() {
		isb_register();
	});

	function _switch_badge(e,v) {
		var f = e.closest('.type-product');

		f.find('.isb_variable').hide();

		if ( v == '' ) {
			f.find('.isb_variable[data-id=0]').show();
		}
		else {
			f.find('.isb_variable[data-id='+v+']').show();
		}
	}

	$(document).on( 'change', 'input[name=variation_id]', function() {
		_switch_badge($(this),$(this).val());
		_do_badges();
	});

	var domInterval = null;
	$('body').on('DOMSubtreeModified', '.ivpa-content', function() {
		clearInterval(domInterval);
		var v = $(this);
		domInterval = setInterval( function() {
			__check_for_badges_ipa(v);
		}, 500);
	});


	function __check_for_badges_ipa(v) {
		_switch_badge(v,v.attr('data-selected'));
		_do_badges();

		clearInterval(domInterval);
	}

	function _do_badges() {
		$('.isb_badges').each( function() {
			__check_badge_margins($(this));
		} );
	}

	function isb_register() {

		$('.isb_variable_group:not(.isb_registered)').each( function() {

			$(this).addClass('isb_registered');

			var curr = $(this).closest('.type-product').find('input[name=variation_id]').val();

			if ( u(curr) === false ) {
				curr = $(this).closest('.type-product').find('.ivpa-content').attr('data-selected');
			}

			if ( u(curr) === false ) {
				curr = 0;
			}

			$(this).find('.isb_variable[data-id='+curr+']').show();

		});

		$('.isb_scheduled_sale:not(.isb_registered)').each( function() {

			$(this).addClass('isb_registered');

			var curr = $(this).find('span.isb_scheduled_time');

			if ( curr.text() == '' ) {
				return;
			}

			var timestamp = curr.text() - isb.time;

			function component(x, v) {
				return Math.floor(x / v);
			}

			var $div = curr;

			function do_it() {
					timestamp--;

				var days    = component(timestamp, 24 * 60 * 60),
					hours   = component(timestamp,      60 * 60) % 24,
					minutes = component(timestamp,           60) % 60,
					seconds = component(timestamp,            1) % 60;

				if ( curr.hasClass('isb_scheduled_compact') ) {
					$div.html( ( days !== 0 ? days + '<span>'+isb.localization.d+'</span>' : '' ) + hours + ':' + minutes + ':' + seconds);
				}
				else {
					$div.html( ( days !== 0 ? days + ' '+isb.localization.days+', ' : '' ) + hours + ':' + minutes + ':' + seconds);
				}
				if ( days == 0 ) {
					curr.addClass('isb_no_date');
				}

			}
			do_it();
			setInterval(function() {
				do_it();
			}, 1000);

		} );

		_do_badges();

	}

	function _get_heights(e,i) {
		var d = $(e[(i-1)]);
		var dSale = d.find('.isb_scheduled_sale:visible').length>0?d.find('.isb_scheduled_sale:visible').outerHeight()+7:0,
			dMargin = parseInt(d.css('margin-top'),10)+3;
		return d.is('.isb_variable_group') ? d.find(':first').outerHeight()+dSale+dMargin : d.outerHeight()+dSale+dMargin;
	}

	function __check_badge_margins(c) {

		var lefts = c.find('> .isb_left');
		lefts.each( function(i,o) {
			if ( i>0 ) {
				$(o).css('margin-top', _get_heights(lefts,i));
			}
		} );

		var rights = c.find('> .isb_right');
		rights.each( function(i,o) {
			if ( i>0 ) {
				$(o).css('margin-top', _get_heights(rights,i));
			}
		} );

	}

	isb_register();

})(jQuery);