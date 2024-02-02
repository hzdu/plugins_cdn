( function( $, settings ) {

	var modalTemplate = '#happyforms-modal-template';

	var HappyFormsModal = function( el, formId ) {
		this.formId = formId;
		this.el = el;
		this.$el = $( el );
		this.$inner = $( '.happyforms-modal__inner', this.$el );
		this.$container = $( '.happyforms-modal__form-container', this.$el );
		this.$closeButton = $( '.happyforms-modal__close-button', this.$el );
		this.$form = null;

		this.open();
		this.bindEvents();

		$.get( settings.ajaxUrl, {
			action: settings.action,
			form_id: this.formId,
		}, function( html ) {
			this.$container.html( html );
			this.$closeButton.css( 'display', 'block' );
			this.focus();
		}.bind( this ) );
	}

	HappyFormsModal.prototype.open = function() {
		$( 'body' ).append( this.$el );
		$( 'body' ).addClass( 'happyforms-modal-open' );
	}

	HappyFormsModal.prototype.bindEvents = function() {
		this.$closeButton.on( 'click', this.onCloseClick.bind( this ) );
		// this.$el.on( 'click', '.happyforms-form', this.onInsideClick.bind( this ) );
		this.$el.on( 'click', this.onOutsideClick.bind( this ) );
		$( document ).on( 'keydown.happyforms', this.onKeyDown.bind(this) );
		$( this.$el ).on( 'mousewheel touchmove', this.onScroll.bind(this) );
	}

	HappyFormsModal.prototype.onScroll = function() {
		var $form = $( 'form', this.$el );
		var formScrollTop = Math.abs( $form.offset().top - $form.parent().offset().top );

		if ( formScrollTop > 0 ) {
			this.$closeButton.addClass('scrolled');
		} else {
			this.$closeButton.removeClass('scrolled');
		}
	}

	HappyFormsModal.prototype.focus = function() {
		var $firstPart = $( '.happyforms-part', this.$form ).first();

		switch ( $firstPart.attr( 'data-happyforms-type' ) ) {
			case 'single_line_text':
			case 'multi_line_text':
			case 'number':
			case 'email':
				$( 'input:visible, textarea:visible', $firstPart ).trigger( 'focus' );
				break;
			default:
				break;
		}
	}

	HappyFormsModal.prototype.unbindEvents = function() {
		$( document ).off( 'keydown.happyforms' );
	}

	HappyFormsModal.prototype.close = function() {
		$( '.happyforms-form [data-happyforms-type]', this.$el ).trigger( 'happyforms.detach' );
		this.$el.remove();
		$( 'body' ).removeClass( 'happyforms-modal-open' );
	}

	HappyFormsModal.prototype.onInsideClick = function( e ) {
		e.stopPropagation();
	}

	HappyFormsModal.prototype.onCloseClick = function( e ) {
		e.preventDefault();

		this.close();
		this.unbindEvents();
	}

	HappyFormsModal.prototype.onOutsideClick = function( e ) {
		var container = this.$container.get( 0 );
		var eventPath = e.originalEvent.composedPath();

		if ( -1 !== eventPath.indexOf( container ) ) {
			return;
		}

		e.preventDefault();

		this.close();
		this.unbindEvents();
	}

	HappyFormsModal.prototype.onKeyDown = function( e ) {
		if ( 27 === e.keyCode ) {
			e.preventDefault();
			this.close();
			this.unbindEvents();
		}
	}

	$.fn.happyFormsModal = function( formId ) {
		this.each(function() {
			$.data( this, 'HappyFormsModal', new HappyFormsModal( this, formId ) );
		} );
	}

	$( function() {
		$( document ).on( 'click', 'a[href^="#happyforms-"]', function( e ) {
			e.stopPropagation();
			e.preventDefault();

			var formId = $( e.target ).attr( 'data-form-id' );

			if ( ! formId ) {
				formId = $( e.target ).attr( 'href' ).replace( '#happyforms-', '' );
			}

			var html = $( '#happyforms-modal-template-' + formId ).html();
			var $modal = $( html ).happyFormsModal( formId );
		} );
	} );

} )( jQuery, _happyformsModalSettings );
