( function( $, Backbone ) {

	var HappyFormsVideoHandle = function( el, model, options ) {
		this.el = el;
		this.$el = $( this.el );
		this.model = model;
		this.mediaFileFrame = false;
		this.mediaTypes = [ 'video' ];

		if ( options && options.mediaTypes ) {
			this.mediaTypes = options.mediaTypes;
		}

		this.$uploadButton = $( '.happyforms-upload-button', this.$el );
		this.$changeButton = $( '.happyforms-change-button', this.$el );
		this.$removeButton = $( '.happyforms-remove-button', this.$el );
		this.$previewVideo = $( '.wp-video', this.$el );
		this.$hiddenField = $( 'input[type=hidden]', this.$el );

		this.modelAttribute = this.$uploadButton.attr( 'data-upload-target' );

		this.$uploadButton.on( 'click', this.onUploadButtonClick.bind( this ) );
		this.$changeButton.on( 'click', this.onChangeButtonClick.bind( this ) );
		this.$removeButton.on( 'click', this.onRemoveButtonClick.bind( this ) );
	};

	HappyFormsVideoHandle.prototype.onUploadButtonClick = function( e ) {
		e.preventDefault();

		this.openOverlay();
	}

	HappyFormsVideoHandle.prototype.onChangeButtonClick = function( e ) {
		e.preventDefault();

		this.openOverlay();
	}

	HappyFormsVideoHandle.prototype.onRemoveButtonClick = function( e ) {
		e.preventDefault();

		this.removeMedia();
	}

	HappyFormsVideoHandle.prototype.openOverlay = function() {
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
				case 'video':
					$( '.happyforms-upload-preview', self.$el ).removeClass( 'show' );

					var videoPlayer;
					var $video = $( '<video />', {
						src: attachment.url,
						type: attachment.mime,
						preload: 'metadata',
						poster: ( attachment.image.src !== attachment.icon ) ? attachment.image.src : '',
					} );

					if ( attachment.width ) {
						$video.attr( 'width', attachment.width );
					}

					if ( attachment.height ) {
						$video.attr( 'height', attachment.height );
					}

					self.$previewVideo.html( $video );
					self.$previewVideo.addClass( 'show' );
					videoPlayer = new MediaElementPlayer( $video[0], window._wpmejsSettings );
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

	HappyFormsVideoHandle.prototype.removeMedia = function() {
		this.$removeButton.removeClass( 'show' );
		this.$changeButton.removeClass( 'show' );
		this.$uploadButton.addClass( 'show' );

		this.model.set( this.modelAttribute, '' );
	}

	$.fn.happyFormsVideoHandle = function( model, options ) {
		this.each(function() {
			$.data( this, 'HappyFormsVideoHandle', new HappyFormsVideoHandle( this, model, options ) );
		} );
	}

} ( jQuery, Backbone ) );
