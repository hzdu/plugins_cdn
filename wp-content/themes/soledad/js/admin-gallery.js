jQuery( function ( $ ) {
	'use strict';

	var PENCIPOSTADMIN = PENCIPOSTADMIN || {};

	PENCIPOSTADMIN.colorPicker = function () {
		$( function() {
			$('.penci-color-picker').wpColorPicker();
		});
	},
	PENCIPOSTADMIN.imageSelect = function () {
		$( 'body' ).on( 'change', '.penci-image-select input', function () {
			var $this = $( this ),
				type = $this.attr( 'type' ),
				selected = $this.is( ':checked' ),
				$parent = $this.parent(),
				$others = $parent.siblings();
			if ( selected ) {
				$parent.addClass( 'penci-active' );
				if ( type === 'radio' ) {
					$others.removeClass( 'penci-active' );
				}
			} else {
				$parent.removeClass( 'penci-active' );
			}
		} );
		$( '.penci-image-select input' ).trigger( 'change' );
	},
	PENCIPOSTADMIN.metaboxTab = function () {
		$( '.penci-metabox-tabs' ).on( 'click', 'a', function ( e ) {
			e.preventDefault();

			var $li = $( this ).parent(),
				panel = $li.data( 'panel' ),
				$wrapper = $li.closest( '.penci-metabox-wrap' ),
				$panel = $wrapper.find( '.penci-tab-panel-' + panel );

			$li.addClass( 'tab-active' ).siblings().removeClass( 'tab-active' );
			$panel.show().siblings().hide();
		} );
	},
	PENCIPOSTADMIN.metaboxAccordion = function () {
		var acc = document.getElementsByClassName("penci-accordion-name");
		var i;

		for (i = 0; i < acc.length; i++) {
			acc[i].addEventListener("click", function() {
				this.classList.toggle("active");
				var panel = this.nextElementSibling;
				if (panel.style.minHeight){
					panel.style.minHeight = null;
				} else {
					panel.style.minHeight = panel.scrollHeight + "px";
				}

				return false;
			});
		}
		return false;
	},
	PENCIPOSTADMIN.uploadImg = function () {
			var frame = wp.media( {
				title: PenciObject.WidgetImageTitle,
				multiple: false,
				library: { type: 'image' },
				button: { text: PenciObject.WidgetImageButton }
			} );

			$( 'body' ).on( 'click', '.penci-widget-image__select', function ( e ) {

					e.preventDefault();
					var $this = $( this ),
						$input = $this.siblings( 'input' ),
						$image = $this.siblings( 'img' ),
						$placeholder = $this.prev(),
						$savewidget = $this.closest( '.widget-inside' ).find( '.widget-control-save' );

					frame.off( 'select' )
					     .on( 'select', function () {
						     var id = frame.state().get( 'selection' ).toJSON()[0].id;
						     var url = frame.state().get( 'selection' ).toJSON()[0].url;
						     $input.val( id );
						     $input.data( 'url', url );
						     $image.attr( 'src', url ).removeClass( 'hidden' );
						     $placeholder.addClass( 'hidden' );
						     $savewidget.prop( "disabled", false );
					     } )
					     .open();
				} )
				.on( 'click', '.penci-widget-image__remove', function ( e ) {
					e.preventDefault();
					var $this = $( this ),
						$input = $this.siblings( 'input' ),
						$image = $this.siblings( 'img' ),
						$placeholder = $this.prev().prev(),
						$savewidget = $this.closest( '.widget-inside' ).find( '.widget-control-save' );

					$input.val( '' );
					$image.addClass( 'hidden' );
					$placeholder.removeClass( 'hidden' );
					$savewidget.prop( "disabled", false );
				} )
				.on( 'change', '.penci-widget-image__input', function ( e ) {
					e.preventDefault();
					var $this = $( this ),
						url = $this.data( url ),
						$image = $this.siblings( 'img' );
					$image.attr( 'src', url )[url ? 'removeClass' : 'addClass']( 'hidden' );


				} );


		};

	/* Init functions
	 ---------------------------------------------------------------*/
	$( document ).ready( function () {
		PENCIPOSTADMIN.colorPicker();
		PENCIPOSTADMIN.uploadImg();
		PENCIPOSTADMIN.imageSelect();
		PENCIPOSTADMIN.metaboxTab();
		PENCIPOSTADMIN.metaboxAccordion();
	});
} );

