//Lock Google Analytics
jQuery(document).ready(function($) {
	$('#seopress-google-analytics-lock').on('click', function() {
		$.ajax({
			method : 'POST',
			url : seopressAjaxLockGoogleAnalytics.seopress_google_analytics_lock,
			data : {
				action: 'seopress_google_analytics_lock',
				_ajax_nonce: seopressAjaxLockGoogleAnalytics.seopress_nonce,
			},
			success : function() {
				window.location.reload(true);
			},
		});
	});
	$('#seopress-google-analytics-lock').on('click', function() {
		$(this).attr("disabled", "disabled");
		$( '.spinner' ).css( "visibility", "visible" );
		$( '.spinner' ).css( "float", "none" );
	});
});