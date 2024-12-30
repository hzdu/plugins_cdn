/* global penciBlock */
/* global penciBlocksArray */
jQuery( document ).ready( function( $ ) {
  var pagednum;
  jQuery( 'body' ).
      on( 'click', '.penci-bgajax-more-terms-click .penci-ajax-more-button',
          function( event ) {
            event.preventDefault();
            if ( !$( this ).hasClass( 'loading-posts' ) ) {
              var $this = $( this ),
                  settings = $this.data( 'settings' ),
                  layout = $this.data( 'layout' ),
                  mes = $this.data( 'mes' ),
                  pagednum = $( this ).attr( 'data-pagednum' );

              $this.addClass( 'loading-posts' );

              var data = {
                action: 'penci_bgmore_terms_ajax',
                settings: settings,
                layout: layout,
                pagednum: pagednum,
                nonce: penci_bgajax_more_terms.nonce,
              };

              $.ajax( {
                type: 'POST',
                dataType: 'html',
                url: penci_bgajax_more_terms.url,
                data: data,
                success: function( data ) {
                  if ( data ) {
                    var data_paded = parseInt( pagednum ) + 1,
                        $data = $( data ),
                        $wrap_content = $this.parent().
                                              parent().
                                              find( '.penci-biggrid-data' );

                    $this.attr( 'data-pagednum', data_paded );

                    if ( layout === 'style-2' ) {

                      $wrap_content.append( $data ).
                                    isotope( 'appended', $data ).
                                    imagesLoaded( function() {
                                      $wrap_content.isotope( 'layout' );
                                    } );

                    } else {

                      if ( layout === 'style-1' ) {
                        $wrap_content.append( $data );
                      } else {
                        $wrap_content.parent().append( $data );
                      }

                    }

                    if ( $().theiaStickySidebar ) {
                      var top_margin = 90;
                      if ( $( 'body' ).hasClass( 'admin-bar' ) ) {
                        top_margin = 122;
                      }
                      $( '#main.penci-main-sticky-sidebar, #sidebar.penci-sticky-sidebar' ).
                          theiaStickySidebar( {
                            // settings
                            additionalMarginTop: top_margin,
                          } );
                    } // if sticky

                    $this.removeClass( 'loading-posts' );
                    $( document ).trigger( 'penci_bf_check' );

                  } else {
                    $this.find( '.ajax-more-text' ).text( mes );
                    $this.find( 'i' ).remove();
                    $this.removeClass( 'loading-posts' );
                    setTimeout( function() {
                      $this.parent().remove();
                    }, 1200 );
                  }
                },
                error: function( jqXHR, textStatus, errorThrown ) {
                  console.log(
                      jqXHR + ' :: ' + textStatus + ' :: ' + errorThrown );
                },

              } );
            }
          } );
} );
