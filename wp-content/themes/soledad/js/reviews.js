(function($){
	$(document ).ready(function(){
		var $rates = $('#add_comment_rating_wrap'),
			path = $rates.data('assets_path' ),
			default_rating = 4;

		if ( typeof $('#add_post_rating').attr('data-pccm_rating') !== 'undefined' ) {
			default_rating = $('#add_post_rating').attr('data-pccm_rating');
		}

		$rates.raty({
			half: false,
			target : '#add_post_rating',
			hints: '',
			path: path,
			targetKeep : true,
			//targetType : 'score',
			targetType : 'hint',
			//precision  : true,
			score: default_rating,
			scoreName: 'pccm_rating',
			click: function(rating, evt) {
				$('#add_post_rating' ).val( '' + rating );
				$('#add_post_rating option[value="' + rating + '"]' ).attr( 'selected', 'selected' );
			},
			starType : 'i'
		});

		$('.review_rate' ).raty({
			readOnly: true,
			target : this,
			half: false,
			starType : 'i',
			score: function() {
				return $(this).attr('data-pccm_rating');
			},
			scoreName: 'pccm_rating'
		});
	});
})(jQuery);