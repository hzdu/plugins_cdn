( function( $, Backbone ) {

	var HappyFormsAudioHandle = function( el, model, options ) {
		this.el = el;
		this.$el = $( this.el );
		this.model = model;
		this.mediaFileFrame = false;
		this.mediaTypes = [ 'audio' ];

		if ( options && options.mediaTypes ) {
			this.mediaTypes = options.mediaTypes;
		}

		this.$uploadButton = $( '.happyforms-upload-button', this.$el );
		this.$changeButton = $( '.happyforms-change-button', this.$el );
		this.$removeButton = $( '.happyforms-remove-button', this.$el );
		this.$previewAudio = $( '.wp-audio', this.$el );
		this.$hiddenField = $( 'input[type=hidden]', this.$el );

		this.modelAttribute = this.$uploadButton.attr( 'data-upload-target' );

		this.$uploadButton.on( 'click', this.onUploadButtonClick.bind( this ) );
		this.$changeButton.on( 'click', this.onChangeButtonClick.bind( this ) );
		this.$removeButton.on( 'click', this.onRemoveButtonClick.bind( this ) );
	};

	HappyFormsAudioHandle.prototype.onUploadButtonClick = function( e ) {
		e.preventDefault();

		this.openOverlay();
	}

	HappyFormsAudioHandle.prototype.onChangeButtonClick = function( e ) {
		e.preventDefault();

		this.openOverlay();
	}

	HappyFormsAudioHandle.prototype.onRemoveButtonClick = function( e ) {
		e.preventDefault();

		this.removeMedia();
	}

	HappyFormsAudioHandle.prototype.openOverlay = function() {
		var self = this;

		wp.media.model.settings.post_id = this.model.id;

		if ( this.mediaFileFrame ) {
			this.mediaFileFrame.open();

			return;
		}

		this.mediaFileFrame = wp.media.frames.wp_upload_file_frame = wp.media( {
			title: self.$el.attr( 'data-overlay-title' ),
			button: {
				text: self.$el.attr( 'data-overlay-button-text' )
			},
			multiple: false
		} );

		this.mediaFileFrame.on( 'select', function() {
			var attachment = self.mediaFileFrame.state().get( 'selection' ).first().toJSON();
			var previewURL = attachment.url;

			if ( -1 === self.mediaTypes.indexOf( attachment.type ) ) {
				return;
			}

			switch ( attachment.type ) {
				case 'audio':
					$( '.happyforms-upload-preview', self.$el ).removeClass( 'show' );

					var audioPlayer;
					var $audio = $( '<audio />', {
						src: attachment.url,
						type: attachment.mime,
						preload: 'none',
					} );

					$audio.attr( 'width', '100%' );

					self.$previewAudio.html( $audio );
					self.$previewAudio.addClass( 'show' );
					audioPlayer = new MediaElementPlayer( $audio[0], window._wpmejsSettings );
					break;
			}

			self.$hiddenField.val( attachment.id );

			self.model.set( self.modelAttribute, attachment.id );

			self.$uploadButton.removeClass( 'show' );
			self.$removeButton.addClass( 'show' );
			self.$changeButton.addClass( 'show' );
		} );

		this.mediaFileFrame.open();
	}

	HappyFormsAudioHandle.prototype.removeMedia = function() {
		this.$removeButton.removeClass( 'show' );
		this.$changeButton.removeClass( 'show' );
		this.$uploadButton.addClass( 'show' );

		this.model.set( this.modelAttribute, '' );
	}

	$.fn.happyFormsAudioHandle = function( model, options ) {
		this.each(function() {
			$.data( this, 'HappyFormsAudioHandle', new HappyFormsAudioHandle( this, model, options ) );
		} );
	}

} ( jQuery, Backbone ) );
