/* global SOLEDADLOCALIZE */
jQuery( function ( $ ) {
	'use strict'

	function buttonClick() {
		$( 'body' ).on( 'click', '.penci-ajax-arch .penci-ajax-more-button', function ( event ) {
			event.preventDefault()
			loadMorePostRun( $( this ) )
		} )
	}

	function infiniteScroll() {
		var $handle = $( '.penci-ajax-arch' ),
			$button_load = $handle.find( '.penci-ajax-more-button' )

		if ( $handle.hasClass( 'penci-infinite-scroll' ) ) {
			$( window ).on( 'scroll', function () {

				var hT = $button_load.offset().top,
					hH = $button_load.outerHeight(),
					wH = $( window ).height(),
					wS = $( this ).scrollTop()

				if ( (
					     wS > (
						        hT + hH - wH
					        )
				     ) && $button_load.length ) {
					loadMorePostRun( $button_load )
				}
			} ).trigger( 'scroll' )
		}
	}

	function loadMorePostRun( $button_load ) {
		if ( $button_load.hasClass( 'loading-posts' ) ) {
			return false
		}

		var layout = $button_load.data( 'layout' ),
			ppp = $button_load.data( 'number' ),
			mes = $button_load.data( 'mes' ),
			offset = $button_load.attr( 'data-offset' ),
			exclude = $button_load.data( 'exclude' ),
			from = $button_load.data( 'from' ),
			template = $button_load.data( 'template' ),
			archiveType = $button_load.data( 'archivetype' ),
			archiveValue = $button_load.data( 'archivevalue' ),
			archiveOrder = $button_load.data( 'order' )

		$button_load.addClass( 'loading-posts' )

		var dataAjax = 'order=' + archiveOrder + '&offset=' + offset + '&layout=' + layout + '&from=' + from +
		               '&template=' + template + '&ppp=' + ppp +
		               '&archivetype=' + archiveType + '&archivevalue=' + archiveValue +
		               '&action=penci_archive_more_post_ajax&nonce=' + pcajaxamore_scroll.nonce

		$.ajax( {
			type: 'POST',
			dataType: 'html',
			url: SOLEDADLOCALIZE.url,
			data: dataAjax,
			success: function ( data ) {

				if ( !data ) {
					$button_load.find( '.ajax-more-text' ).text( mes )
					$button_load.find( 'i' ).remove()
					$button_load.removeClass( 'loading-posts' )
					setTimeout( function () {
						$button_load.parent().remove()
					}, 1200 )

					return false
				}

				var data_offset = parseInt( offset ) + ppp,
					$wrap_content = $button_load.parent().parent().find( '.penci-wrapper-data' )

				$button_load.attr( 'data-offset', data_offset )

				if ( layout === 'masonry' || layout === 'masonry-2' ) {
					var $data = $( data )

					$wrap_content.append( $data ).isotope( 'appended', $data ).imagesLoaded( function () {
						$wrap_content.isotope( 'layout' )
					} )

					$( '.container' ).fitVids()

					if ( $().easyPieChart ) {
						$( '.penci-piechart' ).each( function () {
							var $this = $( this )
							$this.one( 'inview', function ( event, isInView, visiblePartX, visiblePartY ) {
								var chart_args = {
									barColor: $this.data( 'color' ),
									trackColor: $this.data( 'trackcolor' ),
									scaleColor: false,
									lineWidth: $this.data( 'thickness' ),
									size: $this.data( 'size' ),
									animate: 1000,
								}
								$this.easyPieChart( chart_args )
							} ) // bind inview
						} ) // each
					}

				} else {
					var $data = $( data )
					$wrap_content.append( $data )

					$( '.container' ).fitVids()

					$( 'body' ).trigger( 'penci_swiper_sliders' )

					if ( $().easyPieChart ) {
						$( '.penci-piechart' ).each( function () {
							var $this = $( this )
							$this.one( 'inview', function ( event, isInView, visiblePartX, visiblePartY ) {
								var chart_args = {
									barColor: $this.data( 'color' ),
									trackColor: $this.data( 'trackcolor' ),
									scaleColor: false,
									lineWidth: $this.data( 'thickness' ),
									size: $this.data( 'size' ),
									animate: 1000,
								}
								$this.easyPieChart( chart_args )
							} ) // bind inview
						} ) // each
					}

					var $justified_gallery = $( '.penci-post-gallery-container.justified' )
					var $masonry_gallery = $( '.penci-post-gallery-container.masonry' )
					if ( $().justifiedGallery && $justified_gallery.length ) {
						$( '.penci-post-gallery-container.justified' ).each( function () {
							var $this = $( this )
							$this.justifiedGallery( {
								rowHeight: $this.data( 'height' ),
								lastRow: 'nojustify',
								margins: $this.data( 'margin' ),
								randomize: false,
							} )
						} ) // each .penci-post-gallery-container
					}

					if ( $().isotope && $masonry_gallery.length ) {

						$( '.penci-post-gallery-container.masonry .item-gallery-masonry' ).each( function () {
							var $this = $( this )
							if ( $this.attr( 'title' ) ) {
								var $title = $this.attr( 'title' )
								$this.children().append( '<div class="caption">' + $title + '</div>' )
							}
						} )
					}

					if ( $masonry_gallery.length ) {
						$masonry_gallery.each( function () {
							var $this = $( this )
							$this.imagesLoaded( function () {
								// initialize isotope
								$this.isotope( {
									itemSelector: '.item-gallery-masonry',
									transitionDuration: '.55s',
									layoutMode: 'masonry',
								} )

								$this.addClass( 'loaded' )

								$( '.penci-post-gallery-container.masonry .item-gallery-masonry' ).each( function () {
									var $this = $( this )
									$this.one( 'inview', function ( event, isInView, visiblePartX, visiblePartY ) {
										$this.addClass( 'animated' )
									} ) // inview
								} ) // each
							} )
						} )
					}

					if ( $().theiaStickySidebar ) {
						var top_margin = 90
						if ( $( 'body' ).hasClass( 'admin-bar' ) ) {
							top_margin = 122
						}
						$( '#main.penci-main-sticky-sidebar, #sidebar.penci-sticky-sidebar' ).theiaStickySidebar( {
							// settings
							additionalMarginTop: top_margin,
						} )
					} // if sticky
				}
				$( 'body' ).trigger( 'penci_swiper_sliders' )
				$button_load.removeClass( 'loading-posts' )
				$( document ).trigger( 'penci_bf_check' )
			},
			error: function ( jqXHR, textStatus, errorThrown ) {
				console.log( jqXHR + ' :: ' + textStatus + ' :: ' + errorThrown )
			},

		} )
	}

	$( document ).ready( function () {
		buttonClick()
		infiniteScroll()
	} )
} )
