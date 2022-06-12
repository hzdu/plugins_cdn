(function( $ ) {
	'use strict';

	// Create the defaults once
	var pluginName = "WooCommercePDFCatalog",
		defaults = {
			'modalHeightAuto' : '1',
		};

	// The actual plugin constructor
	function Plugin ( element, options ) {
		this.element = element;
		
		this.settings = $.extend( {}, defaults, options );
		this._defaults = defaults;
		this.trans = this.settings.trans;
		this._name = pluginName;
		this.init();
	}

	// Avoid Plugin.prototype conflicts
	$.extend( Plugin.prototype, {
		init: function() {
			this.window = $(window);
			this.documentHeight = $( document ).height();
			this.windowHeight = this.window.height();
			this.product = {};
			this.elements = {};

			this.emailSendPopup();
			this.woofFilter();
			this.builder();
		},
		builder : function() {

			$('.woocommerce-pdf-catalog-builder-auto-select-subcategories-yes input').on('change', function(e) {
				console.log('asd');
				var $this = $(this);
				var children = $this.parent().parent().find('.woocommerce-pdf-catalog-builder-children');
				if(children.length > 0) {
					if($this.is(":checked")) {
						children.find('input').prop('checked', true);
					} else {
						children.find('input').prop('checked', false);
					}
				}

			});

		},
		woofFilter : function() {
			var woof = $('.woof');
			if(woof.length < 1) {
				return;
			}

			woof.on('change', 'select, input', function(e) {
				$('.woocommerce_pdf_catalog_button_full').attr('href', $(location).attr('href') + '&pdf-catalog=full');
			});
		},
		emailSendPopup : function() {

			var that = this;
			var overlay = $('.woocommerce-pdf-catalog-overlay');
			var popup = $('.woocommerce-pdf-catalog-popup-container');
			if(overlay.length < 1) {

				return ;
			}
			
			var toggler = $('.woocommerce-pdf-catalog-email-button');
			toggler.on('click', function(e) {
				e.preventDefault();
				overlay.fadeIn();
				popup.fadeIn();

				$('.woocommerce-pdf-catalog-email-type').trigger('change');
			});

			overlay.on('click', function(e) {
				$(this).fadeOut();
				popup.fadeOut();
			});

			popup.on('change', '.woocommerce-pdf-catalog-email-type', function(e) {
				var selectedType = $(this).val();

				if(selectedType == "category") {
					$('.woocommerce-pdf-catalog-email-category-select').fadeIn();
				} else {
					$('.woocommerce-pdf-catalog-email-category-select').fadeOut();
				}
			});

			$(document).on('submit', '.woocommerce-pdf-catalog-email-form', function(e) {
				e.preventDefault();

				var $this = $(this);
				var to = $this.find('.woocommerce-pdf-catalog-email-to').val();
				var type = $this.find('.woocommerce-pdf-catalog-email-type').val();
				var text = $this.find('.woocommerce-pdf-catalog-email-text').val();
				var category = $this.find('.woocommerce-pdf-catalog-email-category').val();

				if(!to || to == "" || !type || type == "") {
					alert('Fields missing');
					return false;
				}

				$('.woocommerce-pdf-catalog-email-send').attr('disabled', 'disabled');
				jQuery.ajax({
					url: that.settings.ajax_url,
					type: 'post',
					dataType: 'JSON',
					data: {
						action: 'woocommerce_pdf_catalog_send_email',
						to: to,
						type: type,
						text: text,
						category: category,
					},
					success : function( response ) {
						if(response.status == 0) {
							alert(response.message);
							$('.woocommerce-pdf-catalog-email-send').removeAttr('disabled');
							return false;
						}

						$this.html(that.settings.sendEMailSuccessText);
					},
					error: function(jqXHR, textStatus, errorThrown) {
					    console.log('An Error Occured: ' + jqXHR.status + ' ' + errorThrown + '! Please contact System Administrator!');
					}
				});

			});
		},
	} );

	// Constructor wrapper
	$.fn[ pluginName ] = function( options ) {
		return this.each( function() {
			if ( !$.data( this, "plugin_" + pluginName ) ) {
				$.data( this, "plugin_" +
					pluginName, new Plugin( this, options ) );
			}
		} );
	};

	$(document).ready(function() {

		$( "body" ).WooCommercePDFCatalog(woocommerce_pdf_catalog_options);

	} );

})( jQuery );