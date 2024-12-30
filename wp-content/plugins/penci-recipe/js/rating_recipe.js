if ( jQuery(".penci_rateyo").length ) {
	jQuery(".penci_rateyo").each( function(){
		var $this 	= jQuery(this),
			rate 	= parseFloat( $this.data('rate') ),
			allow 	= $this.data('allow'),
			total 	= $this.data('total'),
			people_numb = parseInt( $this.data('people') );

		$this.rateYo({
			rating: rate,
			fullStar: true,
			starWidth: "13px",
			spacing: "3px",
			onSet: function ( rating, rateYoInstance ) {
				jQuery(this).rateYo("option", "readOnly", true);
				var postid = jQuery(this).data('postid');

				jQuery.ajax({
					type: "POST",
					url: PENCI.ajaxUrl,
					dataType: 'html',
					data: { action: 'penci_rateyo', nonce: PENCI.nonce, postid: postid, rating: rating },
					success: function( data ) {
						var parent = jQuery(this).parent(),
							new_rate = ( total + rating ) / ( people_numb + 1 );
						jQuery('.penci-rate-number', parent).html(new_rate);
						$this.rateYo("rating", new_rate);
						$this.parent().find('.penci-rate-number').html( new_rate.toPrecision(2) );
						$this.parent().find('.penci-number-people').html( people_numb + 1 );
					}
				});
			}
		});

		if ( allow == '0' ) {
			$this.rateYo("option", "readOnly", true);
		}
	} );
}