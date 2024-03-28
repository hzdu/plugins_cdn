(function($) {
    $(document).ready(function() {
	    qodefDisconnectFromInstagram();
    });

    function qodefDisconnectFromInstagram() {
        if($('.qodef-disconnect-from-instagram').length) {
            $('.qodef-disconnect-from-instagram').on('click', function(e) {
                e.preventDefault();
	            var instagramDisconnectNonce = $('input[name="bridge_qode_disconnect_from_instagram"]').val();

                //@TODO get this from data attr
                var button = $(this);
	            button.text('Disconnecting...');
                var data = {
                    action: 'bridge_qode_disconnect_from_instagram',
	                bridge_qode_disconnect_from_instagram: instagramDisconnectNonce
                }

                $.ajax({
                    type: 'POST',
                    url: ajaxurl,
                    data: data,
                    dataType: 'json',
                    success: function(response) {
	                    if(response.status){
		                    window.location.href = window.location.href.split('&')[0];
	                    }

                    }
                });
            });
        }
    }
})(jQuery)