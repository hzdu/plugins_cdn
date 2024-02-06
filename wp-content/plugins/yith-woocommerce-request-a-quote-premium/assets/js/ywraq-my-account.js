jQuery(document).ready(function ($) {
	"use strict";

	var blockParams = {
		message: null,
		overlayCSS: {background: '#fff', opacity: 0.7},
		ignoreIfBlocked: true
	};

	var rejectPopup = $('#ywraq-reject-confirm'),

		reloadQuoteView = function () {
			$.post(document.location.href, function (data) {
				if (data != '') {
					var c = $("<div></div>").html(data),
						wrap = c.find('.ywraq-view-quote-wrapper');
					$('.ywraq-view-quote-wrapper').html(wrap.html());
				}
			});
		};

	// onclick of row in quote list redirect to the view quote
	$('tr.quotes').on('click', function ( e ) {
		var parentQuoteAction = $(e.target).closest('.quote-actions__more');
		if( parentQuoteAction.length === 0 ){
			window.location.href = $(this).data('url');
		}
	});

	$(document).on('click', '.ywraq-reject', function (e) {
		e.preventDefault();


		// init dialog
		rejectPopup.dialog({
			width: 350,
			modal: true,
			dialogClass: 'ywraq-reject-confirm'
		});
	});

	$(document).on('click', '#reject-form button', function (e) {

		e.preventDefault();
		var $t = $(this),
			form = $('#reject-form');

		$t.block(blockParams);

		$.ajax({
				url: ywraq_frontend.ajaxurl.toString().replace('%%endpoint%%', 'yith_ywraq_action'),
				data: form.serialize(),
				type: 'POST',
				success: function (response) {
					if (response.result) {
						reloadQuoteView();
						rejectPopup.dialog('close');
					} else {
						var c = $("<div></div>").html(response.message);
						$('.ywraq-reject-confirm-wrapper').html(c.html()).addClass('error');
					}

				},
				complete: function () {
					$t.unblock();
				}
			}
		);
	});


	/**
	 * Action buttons
	 */
	var actionButtons = {
		init           : function () {
			$( document ).on( 'click', '.quote-actions__more', actionButtons.open );
			$( document ).on( 'click', '.quote-actions-button__menu', actionButtons.stopPropagation );
			$( document ).on( 'click', actionButtons.closeAll );
		},
		closeAll       : function () {
			$( '.quote-actions-button--opened' ).removeClass( 'quote-actions-button--opened' );
		},
		open           : function ( e ) {
			var button    = $( this ).find( '.quote-actions__action-button' ),
				wasOpened = button.hasClass( 'quote-actions-button--opened' );
			e.preventDefault();
			e.stopPropagation();

			actionButtons.closeAll();

			if ( !wasOpened ) {
				button.addClass( 'quote-actions-button--opened' );
			}
		},
		stopPropagation: function ( e ) {
			e.stopPropagation();
		}
	};
	actionButtons.init();

});
