( function( $, Cookies, settings ) {

	var FormSessions = function() {
		this.request = null;
		this.timeout = null;
		this.interval = parseInt( settings.sessionTimeout, 10 );
		this.abandonAlerts = {};
	};

	FormSessions.prototype.bind = function() {
		$( document ).on( 'click', 'button.happyforms-clear-session', this.onSessionClear.bind( this ) );
		$( document ).on( 'click', 'button.happyforms-save-session', this.onSessionSave.bind( this ) );
	};

	FormSessions.prototype.hasSessions = function( form ) {
		var hasSessions = ( form.$form.is( '[data-happyforms-resumable]' )
		);

		return hasSessions;
	};

	FormSessions.prototype.hasAbandonmentAlerts = function( form ) {
		var hasAbandonmentAlerts = form.$form.is( '[data-happyforms-abandonment-alerts]' );

		return hasAbandonmentAlerts;
	};

	FormSessions.prototype.getSessionId = function( form ) {
		var sessionId = $( '[name="' + settings.actionSession + '"]', form.$form ).val();

		return sessionId;
	};

	FormSessions.prototype.getFormId = function( form ) {
		var formId = $( '[name="happyforms_form_id"]', form.$form ).val();

		return formId;
	};

	FormSessions.prototype.add = function( formId, sessionId ) {
		Cookies.set( 'happyforms_session_' + formId, sessionId, { expires: 30 } );
	};

	FormSessions.prototype.get = function( formId ) {
		var sessionId = Cookies.get( 'happyforms_session_' + formId );

		return sessionId;
	};

	FormSessions.prototype.remove = function( formId ) {
		Cookies.remove( 'happyforms_session_' + formId );
	};

	FormSessions.prototype.sync = function( form ) {
		var data = form.serialize().replace( /action=[^&]+&/, '' );

		if ( this.hasSessions( form ) ) {
			var sessionId = this.getSessionId( form );
			var formId = this.getFormId( form );

			this.add( formId, sessionId );

			if ( this.hasAbandonmentAlerts( form ) ) {
				this.abandonAlerts[formId] = sessionId;
			}
		}

		$.ajax( {
			type: 'post',
			data: data,
		} );
	};

	FormSessions.prototype.onSessionClear = function( e ) {
		e.preventDefault();

		var $link = $( e.target );
		var $form = $link.parents( '.happyforms-form' );
		var $notice = $link.parents( '.happyforms-message-notice' );
		var form = $.data( $form.get( 0 ), 'HappyForm' );
		var formId = $( e.target ).attr( 'data-happyforms-form-id' );

		this.remove( formId );

		form.$form.addClass( 'happyforms-form--submitting' );
		form.$submits.prop( 'disabled', true );

		$.get( settings.ajaxUrl, {
			action: settings.actionSessionClear,
			form_id: formId,
		}, function( response ) {
			if ( ! response.success ) {
				return;
			}

			var $el = $( response.data.html );
			var $parts = $( '[data-happyforms-type]', form.$form );

			$parts.each( function() {
				$( this ).trigger( 'happyforms.detach' );
			} );

			form.$el.replaceWith( $el );
			$el.happyForm();

		}.bind( this ) );
	};

	FormSessions.prototype.onSessionSave = function( e ) {
		e.preventDefault();

		var $link = $( e.target );
		var $form = $link.parents( '.happyforms-form' );
		var form = $.data( $form.get( 0 ), 'HappyForm' );
		var formId = $( e.target ).attr( 'data-happyforms-form-id' );

		this.sync( form );
	};

	HappyForms.formSessionWatcher = null;

	$( function() {
		HappyForms.formSessionWatcher = new FormSessions();
		HappyForms.formSessionWatcher.bind();
	} );

} )( jQuery, Cookies, _happyFormsSettings );
