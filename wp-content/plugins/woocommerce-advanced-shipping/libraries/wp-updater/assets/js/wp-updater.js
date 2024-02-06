jQuery( function( $ ) {

    // Update license
    $( document.body ).on( 'keypress', '.wp-updater-license-row input', function( e ) {

        if ( e.which !== 13 ) { // Only on enter
            return;
        }
        e.preventDefault();

        var $this = $(this);
        var data = {
            action: 'updater_update_license',
            plugin: $this.attr( 'data-plugin' ),
            license: $this.val(),
            nonce: wpu.nonce
        };

        // Show loading
        $this.parents('tr').first().find('.spinner').addClass('is-active');

        $.post( ajaxurl, data, function( response ) {
			$this.parents('tr.wp-updater-license-row').after(
				notice(response.message, response.message_type)
			);

            // Replace updater row
            $this.parents('tr.wp-updater-license-row').replaceWith( response.html );
        });

    });

    // Deactivate license
    $( document.body ).on( 'click', '.wp-updater-license-row .deactivate', function( e ) {

        var $this = $( this );
        var data = {
            action: 'updater_deactivate_license',
            plugin: $this.attr( 'data-plugin' ),
            nonce: wpu.nonce
        };

        // Show loading
        $this.parents('tr').first().find('.spinner').addClass('is-active');

        $.post( ajaxurl, data, function( response ) {
			$this.parents('tr.wp-updater-license-row').after(
				notice( response.message, response.message_type )
			);

            // Replace updater row
            $this.parents('tr.wp-updater-license-row').replaceWith( response.html );
        });

    });

    // Add a notice
    function notice( message, type ) {

        if ( undefined == type ) {
            type = 'updated';
        }

        $('.wp-updater-message-row').remove();
        return '<tr class="wp-updater-message-row ' + type + '">' +
			'<td colspan="5"><span>' + message + '</span></td>' +
		'</tr>';
    }

});
