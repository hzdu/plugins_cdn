/* global penciBlock */
/* global penciBlocksArray */
jQuery( document ).ready( function ( $ ) {
	var pagednum;
	jQuery( 'body' ).on( 'click', '.penci-bgajax-more-click .penci-ajax-more-button', function ( event ) {
		event.preventDefault();
		if ( !$( this ).hasClass( 'loading-posts' ) ) {
			var $this = $( this ),
				settings = $this.data( 'settings' ),
				layout = $this.data( 'layout' ),
				mes = $this.data( 'mes' ),
				query_type = $this.data('query_type'),
				archivetype = $this.data('archivetype'),
				archivevalue = $this.data('archivevalue'),
				arppp = $this.data('arppp'),
				cat = $this.data('cat'),
				tag = $this.data('tag'),
				author = $this.data('author'),
				pagednum = $( this ).attr( 'data-pagednum' );

			$this.addClass( 'loading-posts' );
			
			var data = {
				action: 'penci_bgmore_post_ajax',
				settings: settings,
				layout: layout,
				pagednum: pagednum,
				archivetype: archivetype,
				archivevalue: archivevalue,
				query_type: query_type,
				arppp: arppp,
				cat: cat,
				tag: tag,
				author: author,
				nonce: pcbgajax_more_posts.nonce,
			};

			$.ajax( {
				type    : "POST",
				dataType: "html",
				url     : ajax_var_more.url,
				data    : data,
				success : function ( data ) {
					if ( data ) {
						var data_paded = parseInt( pagednum ) + 1,
							$wrap_content = $this.parent().parent().find('.penci-biggrid-data');

						$this.attr( 'data-pagednum', data_paded );
						
						if ( layout === 'style-2' ) {
							var $data = $( data );
							$wrap_content.append( $data ).isotope( 'appended', $data ).imagesLoaded( function () {
								$wrap_content.isotope( 'layout' );
							} );

							if( $().easyPieChart ) {
								$( '.penci-piechart' ).each( function () {
									var $this = $( this );
									$this.one( 'inview', function ( event, isInView, visiblePartX, visiblePartY ) {
										var chart_args = {
											barColor  : $this.data( 'color' ),
											trackColor: $this.data( 'trackcolor' ),
											scaleColor: false,
											lineWidth : $this.data( 'thickness' ),
											size      : $this.data( 'size' ),
											animate   : 1000
										};
										$this.easyPieChart( chart_args );
									} ); // bind inview
								} ); // each
							}
							
							//lazySizes.init();

						} else {
							var $data = $( data );
							if( layout === 'style-1' ){
								$wrap_content.append( $data );
							} else {
								$wrap_content.parent().append( $data );
							}
							
							//lazySizes.init();

							if( $().easyPieChart ) {
								$( '.penci-piechart' ).each( function () {
									var $this = $( this );
									$this.one( 'inview', function ( event, isInView, visiblePartX, visiblePartY ) {
										var chart_args = {
											barColor  : $this.data( 'color' ),
											trackColor: $this.data( 'trackcolor' ),
											scaleColor: false,
											lineWidth : $this.data( 'thickness' ),
											size      : $this.data( 'size' ),
											animate   : 1000
										};
										$this.easyPieChart( chart_args );
									} ); // bind inview
								} ); // each
							}
						}
						
						if ( $().theiaStickySidebar ) {
							var top_margin = 90;
							if( $('body' ).hasClass('admin-bar') ) {
								top_margin = 122;
							}
							$('#main.penci-main-sticky-sidebar, #sidebar.penci-sticky-sidebar' ).theiaStickySidebar({
								// settings
								additionalMarginTop: top_margin
							});
						} // if sticky

						$this.removeClass( 'loading-posts' );
						$(document).trigger('penci_bf_check');
						
					} else {
						$this.find( ".ajax-more-text" ).text( mes );
						$this.find( "i" ).remove();
						$this.removeClass( 'loading-posts' );
						setTimeout(function(){
							$this.parent().remove();
						}, 1200);
					}
				},
				error   : function ( jqXHR, textStatus, errorThrown ) {
					console.log( jqXHR + " :: " + textStatus + " :: " + errorThrown );
				}

			} );
		}
	} );
} );
