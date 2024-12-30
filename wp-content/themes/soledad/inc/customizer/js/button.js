jQuery( document ).ready( function( $ ) {
	$( '[data-type="render_separate_css"]' ).on( 'click', function( e ) {
		var $this = $( this ),
			$nonce = $this.data( 'nonce' ),
			$ajaxurl = $this.data( 'ajaxurl' );
		e.preventDefault();

		$this.removeClass( 'success' ).addClass( 'loading' );
		
		$.ajax({
			type : "post",
			dataType : "json",
			url : $ajaxurl,
			data : {
				action: "penci_render_separate_css_file",
				_nonce : $nonce,
			},
			success: function() {
				$this.removeClass( 'loading' ).addClass( 'success' );
			},
			 error: function( jqXHR, textStatus, errorThrown ){
				console.log( 'The following error occured: ' + textStatus, errorThrown );
			}
		});
	} );
} );
