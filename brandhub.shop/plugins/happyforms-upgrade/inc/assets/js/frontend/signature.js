( function( $ ) {

	HappyForms.parts = HappyForms.parts || {};

	HappyForms.parts.signature = {
		init: function() {
			this.type = this.$el.data( 'happyforms-type' );
			this.$input = $( 'input', this.$el );

			this.$input.on( 'keyup change', this.triggerChange.bind( this ) );
			this.$input.on( 'blur', this.onBlur.bind( this ) );
			this.$input.on( 'focus', this.onInputFocus.bind( this ) );

			if ( 'draw' === this.$el.attr( 'data-happyforms-signature-type' ) ) {
				this.initDrawingArea();
			}
		},

		isFilled: function() {
			var filledInputs = this.$input.filter( function() {
				var $input = $( this );
				var hasValue = false;

				if ( $input.is( '[type=checkbox]' ) ) {
					hasValue = $input.is( ':checked' );
				} else {
					hasValue = '' !== $input.val();
				}

				return hasValue;
			} );

			var isFilled = 2 === filledInputs.length;

			if ( 'draw' === this.$el.attr( 'data-happyforms-signature-type' ) ) {
				isFilled = 3 === filledInputs.length;
			}

			return isFilled;
		},

		serialize: function() {
			var serialized = HappyForms.parts.base.serialize.apply( this, arguments );

			if ( 'draw' === this.$el.attr( 'data-happyforms-signature-type' ) ) {
				serialized.push( {
					name: this.$signatureSVG.attr( 'data-happyforms-name' ),
					value: this.$signatureSVG.attr( 'viewBox' ),
				} );
			}

			return serialized;
		},

		getRasterData: function() {
			var canvas = document.createElement( 'canvas' );
			var boundingBox = this.$signatureSVG.get( 0 ).getBBox();
			var padding = 10;

			canvas.width = ( boundingBox.width + padding * 2 ) * window.devicePixelRatio;
			canvas.height = ( boundingBox.height + padding * 2 ) * window.devicePixelRatio;

			var context = canvas.getContext( '2d' );
			var canvasPath = new Path2D( this.signaturePath );

			context.scale( window.devicePixelRatio, window.devicePixelRatio );
			context.translate( padding - boundingBox.x, padding - boundingBox.y );
			context.fill( canvasPath );

			var signatureData = canvas.toDataURL();

			delete canvas;

			return signatureData;
		},

		initDrawingArea: function() {
			this.$signatureDataInput = $( '[data-happyforms-signature-data]', this.$el );
			this.$signatureAreaContainer = $( '.happyforms--signature-area--container', this.$el );
			this.$signatureArea = $( '.happyforms--signature-area', this.$el );
			this.$signatureSVG = $( 'svg', this.$signatureAreaContainer );
			this.$signaturePath = $( 'path', this.$signatureSVG );
			this.$signaturePathDataInput = $( '[data-happyforms-path-data]', this.$el );
			this.$signatureRasterDataInput = $( '[data-happyforms-raster-data]', this.$el );

			this.formId = $( '[name="happyforms_form_id"]', this.$form ).val();
			this.partId = this.$el.attr( 'data-happyforms-id' );
			this.signaturePath = '';
			this.signaturePoints = [];

			this.$startDrawingButton = $( '.happyforms--signature-area--start-drawing', this.$el );
			this.$clearDrawingButton = $( '.happyforms--signature-area--clear-drawing', this.$el );
			this.$doneDrawingButton = $( '.happyforms--signature-area--done-drawing', this.$el );
			this.$editDrawingButton = $( '.happyforms--signature-area--edit-drawing', this.$el );

			this.$startDrawingButton.on( 'click', this.onStartDrawingClick.bind( this ) );
			this.$clearDrawingButton.on( 'click', this.onClearDrawingClick.bind( this ) );
			this.$doneDrawingButton.on( 'click', this.onDoneDrawingClick.bind( this ) );
			this.$editDrawingButton.on( 'click', this.onEditDrawingClick.bind( this ) );

			this.$signatureAreaContainer.on( 'pointerdown', this.onSignatureAreaContainerFocus.bind( this ) );

			this.resizeDrawingArea();
		},

		resizeDrawingArea: function() {
			var width = Math.floor( this.$signatureSVG.outerWidth() );
			var height = Math.floor( this.$signatureSVG.outerHeight() );

			this.$signatureSVG.attr( 'viewBox', '0 0 ' + width + ' ' + height );
		},

		onSignatureAreaContainerFocus: function( e ) {
			e.preventDefault();
			e.stopPropagation();

			this.$signatureAreaContainer.addClass( 'focus' );
		},

		onSignatureAreaContainerBlur: function( e ) {
			this.$signatureAreaContainer.removeClass( 'focus' );
		},

		onSignatureAreaClickOutside: function( e ) {
			this.doneDrawing();
		},

		onStartDrawingClick: function( e ) {
			e.preventDefault();

			this.startDrawing();
		},

		startDrawing: function() {
			this.resizeDrawingArea();

			this.$signatureAreaContainer.removeClass( 'drawn' );
			this.$signatureAreaContainer.addClass( 'drawing' );

			this.$signatureSVG.on( 'pointerdown', this.onPointerDown.bind( this ) );

			$( window ).one( 'resize', this.onDoneDrawingClick.bind( this ) );
			$( document ).one( 'pointerdown', this.onSignatureAreaClickOutside.bind( this ) );
		},

		onPointerDown: function( e ) {
			e.preventDefault();

			this.signaturePoints = [ [ e.offsetX, e.offsetY, e.pressure ] ];
			this.signaturePath = this.$signaturePath.attr( 'd' );

			this.$signatureSVG.on( 'pointermove', this.onPointerMove.bind( this ) );
			this.$signatureSVG.on( 'pointerleave', this.onPointerLeave.bind( this ) );
			this.$signatureSVG.on( 'pointerenter', this.onPointerEnter.bind( this ) );
			this.$signatureSVG.on( 'pointerup', this.onPointerUp.bind( this ) );
		},

		onPointerMove: function( e ) {
			if ( e.buttons === 1 ) {
				e.preventDefault();

				var lastElement = this.signaturePoints[this.signaturePoints.length - 1];

				if ( e.offsetX === lastElement[0] || e.offsetY === lastElement[1] ) {
					return;
				}

				this.signaturePoints.push( [ e.offsetX, e.offsetY, e.pressure ] );

				var stroke = PerfectFreehand.getStroke( this.signaturePoints );
				var pathData = PerfectFreehand.getSvgPathFromStroke( stroke );

				this.$signaturePath.attr( 'd', this.signaturePath + ' ' + pathData );
			}
		},

		onPointerEnter: function( e ) {
			this.signaturePoints = [ [ e.offsetX, e.offsetY, e.pressure ] ];
			this.signaturePath = this.$signaturePath.attr( 'd' );

			this.$signatureSVG.on( 'pointermove', this.onPointerMove.bind( this ) );
		},

		onPointerLeave: function() {
			this.$signatureSVG.off( 'pointermove' );
		},

		onPointerUp: function( e ) {
			this.signaturePath = this.$signaturePath.attr( 'd' );

			this.$signatureSVG.off( 'pointermove' );
			this.$signatureSVG.off( 'pointerleave' );
			this.$signatureSVG.off( 'pointerenter' );
			this.$signatureSVG.off( 'pointerup' );
		},

		onClearDrawingClick: function( e ) {
			e.preventDefault();

			this.clearDrawing();
		},

		clearDrawing: function( e ) {
			this.signaturePoints = [];
			this.signaturePath = '';
			this.$signaturePath.attr( 'd', '' );
			this.$signaturePathDataInput.val( '' );
			this.$signatureRasterDataInput.val( '' );
			this.$signatureAreaContainer.removeClass( 'drawn' );
		},

		onEditDrawingClick: function( e ) {
			e.preventDefault();

			this.editDrawing();
		},

		editDrawing: function() {
			this.clearDrawing();
			this.startDrawing();
			this.triggerChange();
		},

		onDoneDrawingClick: function( e ) {
			e.preventDefault();

			this.doneDrawing();
		},

		doneDrawing: function() {
			this.$signatureSVG.off( 'pointerdown' );
			this.$signatureSVG.off( 'pointermove' );
			this.$signatureSVG.off( 'pointerenter' );
			this.$signatureSVG.off( 'pointerleave' );

			this.signaturePath = this.$signaturePath.attr( 'd' ).trim();
			this.signaturePoints = [];
			this.$signaturePathDataInput.val( this.signaturePath );
			this.$signatureRasterDataInput.val( this.getRasterData() );

			this.$signatureAreaContainer.removeClass( 'drawing' );

			if ( this.signaturePath ) {
				this.$signatureAreaContainer.addClass( 'drawn' );
			} else {
				this.$signatureAreaContainer.removeClass( 'drawn' );
			}
			this.triggerChange();
			this.onSignatureAreaContainerBlur();
		},
	};

} )( jQuery );
