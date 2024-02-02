/* global ajaxurl, wc_gc_import_params */
;( function ( $, window ) {

	/**
	 * Gift_Cards_Import_Form handles the import process.
	 */
	var Gift_Cards_Import_Form = function( $form ) {
		this.$form           = $form;
		this.xhr             = false;
		this.mapping         = wc_gc_import_params.mapping;
		this.position        = 0;
		this.file            = wc_gc_import_params.file;
		this.update_existing = wc_gc_import_params.update_existing;
		this.delimiter       = wc_gc_import_params.delimiter;
		this.security        = wc_gc_import_params.import_nonce;

		// Number of import successes/failures.
		this.imported = 0;
		this.failed   = 0;
		this.updated  = 0;
		this.skipped  = 0;

		// Initial state.
		this.$form.find('.woocommerce-importer-progress').val( 0 );

		this.run_import = this.run_import.bind( this );

		// Start importing.
		this.run_import();
	};

	/**
	 * Run the import in batches until finished.
	 */
	Gift_Cards_Import_Form.prototype.run_import = function() {
		var $this = this;

		$.ajax( {
			type: 'POST',
			url: ajaxurl,
			data: {
				action          : 'woocommerce_gc_do_ajax_import',
				position        : $this.position,
				mapping         : $this.mapping,
				file            : $this.file,
				update_existing : $this.update_existing,
				delimiter       : $this.delimiter,
				security        : $this.security
			},
			dataType: 'json',
			success: function( response ) {
				if ( response.success ) {
					$this.position  = response.data.position;
					$this.imported += response.data.imported;
					$this.failed   += response.data.failed;
					$this.updated  += response.data.updated;
					$this.skipped  += response.data.skipped;
					$this.$form.find('.woocommerce-importer-progress').val( response.data.percentage );

					if ( 'done' === response.data.position ) {
						var file_name = wc_gc_import_params.file.split( '/' ).pop();
						window.location = response.data.url +
							'&giftcards-imported=' +
							parseInt( $this.imported, 10 ) +
							'&giftcards-failed=' +
							parseInt( $this.failed, 10 ) +
							'&giftcards-updated=' +
							parseInt( $this.updated, 10 ) +
							'&giftcards-skipped=' +
							parseInt( $this.skipped, 10 ) +
							'&file-name=' +
							file_name;
					} else {
						$this.run_import();
					}
				}
			}

		} ).fail( function( response ) {
			window.console.log( response );
		} );
	};

	/**
	 * Function to call Gift_Cards_Import_Form on jQuery selector.
	 */
	$.fn.wc_giftcard_importer = function() {
		new Gift_Cards_Import_Form( this );
		return this;
	};

	$( '.woocommerce-importer' ).wc_giftcard_importer();

})( jQuery, window );
