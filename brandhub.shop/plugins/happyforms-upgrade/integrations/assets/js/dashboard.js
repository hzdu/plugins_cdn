( function( $ ) {
	$( document ).on( 'change', 'input[name*=services]', function( e ) {
		var $buttongroup = $( e.target );
		var value   = $buttongroup.val();
		var $widget = $buttongroup.parents( '.inside' );

		if ( value ) {
			var $selectedService = $( '#happyforms-service-' + value, $widget );

			if ( $selectedService.length ) {
				$( '.happyforms-service-integration', $widget ).hide();
				$buttongroup.parents( '[data-active-service]' ).attr( 'data-active-service', value );
				$selectedService.show();
			}
		} else {
			$( '.happyforms-service-integration', $widget ).hide();
		}

		$buttongroup.parents( 'form' ).trigger( 'happyforms.enable' );
	} );

	$( document ).on( 'change', 'input[name*="[mode]"]', function( e ) {
 		var $buttongroup = $( e.target );
 		var value   = $buttongroup.val();

 		$buttongroup.parents( '[data-active-mode]' ).attr( 'data-active-mode', value );

	} );

	$( document ).on( 'change', 'input[class=happyforms-service-toggle]', function( e ) {
		var $checkbox  = $( e.target );
		var $container = $checkbox.parents( '.happyforms-service-integration' );

		if ( $checkbox.is( ':checked' ) ) {
			$container.addClass( 'enabled' );
		} else {
			$container.removeClass( 'enabled' );
		}
	} );

	$( document ).on( 'click', '#happyforms-service-aweber .oauth-connected a', function( e ) {
		var $link  = $( e.target );
		var $widget = $link.parents( '.authenticated' );

		$widget.removeClass( 'authenticated' );
	} );

	$( document ).on( 'submit', '#happyforms-integrations-screen  form.hf-ajax-submit', function( e ) {
		e.preventDefault();

		var $form    = $( e.target );
		var $wrapper = $form.parent();
		var $notices = $( '.happyforms-integrations-notices', $wrapper );
		var $spinner = $( '.spinner', $wrapper );
		var $submit  = $( 'input[type=submit]', $wrapper );

		$submit.prop( 'disabled', false );
		$form.trigger( 'happyforms.disable' );
		$spinner.css( 'visibility', 'visible' );

		$.post( ajaxurl, $form.serialize(), function( response ) {
			$submit.removeAttr( 'disabled' );
			$spinner.css( 'visibility', 'hidden' );

			$form.replaceWith( response );
			$form = $( response );

			$form.trigger( 'happyforms.enable' );
		} );
	} );

	function refreshSearchResults() {
		// Search variables
		var searchGroup = $( '#happyforms-integration-filters' ).val();
		var searchTerm = $( '#happyforms-search-input' ).val().trim();

		// Cache elements
		var $screenOptionsTab = $( '#screen-meta-links .show-settings' );
		var $resultsWrap = $( '#happyforms-integrations-results-wrap' );
		var $resultsContainer = $( '#happyforms-integrations-results' );
		var $dashboardWidgetsContainer = $( '#dashboard-widgets' );
		var $widgets = $( '.happyforms-integrations-widget' );

		// Loop over current results, and replace the widgets
		// they were cloned from with them, in case the user applied 
		// changes directly to a result widget.
		$( '.happyforms-integrations-widget', $resultsContainer ).each( function() {
			var $this = $( this );
			var elementId = $this.attr( 'id' );
			var $clonedElement = $( '#' + elementId, $dashboardWidgetsContainer );

			$( '.notice', $this ).remove();
			$clonedElement.replaceWith( $this );
		} );

		// Reset results container.
		$( '.happyforms-integrations-widget', $resultsContainer ).remove();
		$resultsContainer.hide();
		$resultsWrap.removeClass( 'no-results' );
		
		// If search is empty, just show normal widgets, hide
		// result columns and return.
		if ( '' === searchGroup && '' == searchTerm ) {
			$screenOptionsTab.show();
			$dashboardWidgetsContainer.show();
			
			return;
		}

		// Hide the "Screen Options" tab, the "real" widgets area and the results area.
		var $screenOptionsPanel = $( '#screen-options-wrap' );
		
		$screenOptionsPanel.slideUp( 'fast', function() {
			$screenOptionsTab.removeClass( 'screen-meta-active' ).attr( 'aria-expanded', false );
			$( '.screen-meta-toggle' ).css( 'visibility', '' );
			$screenOptionsPanel.parent().hide();
			$screenOptionsTab.hide();
		} );
		
		$dashboardWidgetsContainer.hide();
		
		// At the beginning, all widgets are good results.
		var $results = $( '.happyforms-integrations-widget', $dashboardWidgetsContainer );

		// If the search includes a group, only boxes from that group
		// are good results.
		if ( '' !== searchGroup ) {
			$results = $results.filter( function() {
				return $( this ).is( '.happyforms-integrations-widget-group-' + searchGroup );
			} );
		}

		// If the search includes a term, only boxes that match that term
		// are good results.
		if ( '' !== searchTerm ) {
			$results = $results.filter( function() {
				return $( 'h2', $( this ) ).text().toLowerCase().indexOf( searchTerm.toLowerCase() ) >= 0;
			} );
		}

		// Reject any widgets that might have previously been
		// hidden through "Screen Options" tab
		$results = $results.filter( function() {
			return 'none' !== $( this ).css( 'display' );
		} );

		// Clone the results list, then turn it into a 
		// vanilla JS array so we can call .pop() on it. 
		$results = $results.clone( true, true ).get();

		if ( 0 === $results.length ) {
			$resultsWrap.addClass( 'no-results' );
		}

		// Remove any leftover notices
		$( '.notice', $results ).remove();
		
		// Show results container
		$resultsContainer.show();

		var $resultColumns = $( '.postbox-container:visible', $resultsContainer );

		while( $results.length > 0 ) {
			$resultColumns.each( function() {
				if ( $results.length > 0 ) {
					var $result = $results.pop();

					$( this ).append( $result );
				}
			} );
		}
	}

	$( document ).on( 'input', '#happyforms-integration-toolbar', refreshSearchResults );
	$( window ).on( 'resize', refreshSearchResults );

} )( jQuery );
