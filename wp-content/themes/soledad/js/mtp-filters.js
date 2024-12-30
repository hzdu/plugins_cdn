(function($) {
    'use strict';
    var PENCI = PENCI || {};
    PENCI.mtpFilter = function() {
        
        if ($().theiaStickySidebar) {
            var top_margin = 90;
            if ($('body').hasClass('admin-bar')) {
                top_margin = 122;
            }
            $('.penci-mtp-sticky .penci-mtp-filters-terms,.penci-mtp-sticky .penci-mtp-filters-posts').theiaStickySidebar({
                // settings
                additionalMarginTop: top_margin
            });
        } // if sticky

        $(document).on('click','.pcmtp-f-term',function(e) {
            e.preventDefault()
            
            var t = $(this),
                id = t.attr('data-id'),
                filter_id = '',
                wrapper = t.closest( '.penci-mtp-filters-wrapper' ),
                current_filter_id = wrapper.attr('data-filter-terms')

                if ( 'all' == id ) {
                    wrapper.find('.pcmtp-f-term').removeClass('added')
                    wrapper.attr('data-filter-terms', '')
                } else {
                    if ( t.hasClass('added') ) {
                        var parts = current_filter_id.split('|'),
                            updatedParts = parts.filter(function(part) {
                                return part !== id;
                            }),
                            filter_id = updatedParts.join('|')
                        t.removeClass('added')
                    } else {
                        if ( current_filter_id ) {
                            filter_id = current_filter_id + '|' + id
                        } else {
                            filter_id = id
                        }
                        t.addClass('added')
                    }
                }

                wrapper.attr('data-filter-terms', filter_id)

                PENCI.mtpGetData(wrapper,1)

                if ( wrapper.hasClass('penci-mtp-sticky') ) {
                    $('html, body').animate({
                        scrollTop: wrapper.offset().top - 120
                    }, 1000); // Duration in milliseconds
                }
        });

        $(document).on('click','.penci-mtpf-more-click .penci-ajax-more-button',function(e){
            e.preventDefault()
            var t = $(this),
                wrapper = t.closest( '.penci-mtp-filters-wrapper' ),
                paged = parseInt(wrapper.attr('data-paged')) + 1;
            PENCI.mtpGetData(wrapper,paged,'append')
        });
    }

    PENCI.mtp_more_scroll = function(e) {
        if (!$('.penci-mtpf-more-scroll .penci-ajax-more-button').length) {
            return;
        }

        $('.penci-mtpf-more-scroll .penci-ajax-more-button').each(function () {
            var $this_scroll = $(this),
                t = $(this),
                paged,
                wrapper = t.closest( '.penci-mtp-filters-wrapper' );
            
            $(window).on('scroll', $this_scroll, function () {

                if ( t.hasClass( 'deactivate' ) ) {
                    return;
                }
                
                var hT = $this_scroll.offset().top,
                    hH = $this_scroll.outerHeight(),
                    wH = $(window).height(),
                    wS = $(this).scrollTop()

                paged = parseInt(wrapper.attr('data-paged')) + 1

                if ((wS > (hT + hH - wH)) && $this_scroll.length) {
                    PENCI.mtpGetData(wrapper,paged,'append')
                }
            })
        })
    }

    PENCI.mtphidebtn = function(t){
        if ( t.find('.penci-ajax-more-button').length ) {
            var button = t.find('.penci-ajax-more-button')

            button.addClass('deactivate');
            button.find(".ajax-more-text").text(button.attr('data-mes'));
            button.find("i").hide();
            button.removeClass('loading-posts');
            setTimeout(function () {
                button.parent().hide();
            }, 1200);
        }
    }

    PENCI.mtpshowbtn = function(t){
        if ( t.find('.penci-ajax-more-button').length ) {
            var button = t.find('.penci-ajax-more-button')

            button.removeClass('deactivate');
            button.find(".ajax-more-text").text(button.attr('data-more'));
            button.find("i").show();
            button.parent().show();
        }
    }

    PENCI.mtpGetData = function( selection, cpaged='', type='replace') {
        var t = $(selection),
            paged = t.attr('data-paged'),
            ids = t.attr('data-filter-terms'),
            query = t.attr('data-query'),
            tax = t.attr('data-tax'),
            settings = t.attr('data-settings'),
            rid = t.attr('data-request-id')

            if ( t.find('.penci-smalllist').hasClass('pcftaj-ld') ) {
                return
            }

            if ( cpaged ) {
                paged = cpaged
            }

            t.find('.penci-smalllist').addClass('pcftaj-ld')

            $.ajax( {
                type: 'POST',
                dataType: 'JSON',
                url: ajax_var_more.url,
                data: {
                    action: 'penci_mtp_getdata',
                    paged: paged,
                    ids: ids,
                    tax: tax,
                    query: query,
                    settings: settings,
                    nonce: rid,
                },
                beforeSend: function() {
                    if ( t.find('.penci-ajax-more-button').length ) {
                        t.find('.penci-ajax-more-button').addClass('loading-posts')
                    }
                },
                success: function( response ) {
                    if ( type == 'replace' && response.data.html ) {
                        t.find('.penci-mtp-filters-posts .pcsl-inner').html($(response.data.html))
                        PENCI.mtpshowbtn(t)
                    } else if ( response.data.html ) {
                        t.find('.penci-mtp-filters-posts .pcsl-inner').append($(response.data.html))
                    } else {
                        PENCI.mtphidebtn(t)
                    }

                    t.attr('data-paged',response.data.paged)
                    t.find('.penci-smalllist').removeClass('pcftaj-ld')
                    if ( t.find('.penci-ajax-more-button').length ) {
                        t.find('.penci-ajax-more-button').addClass('loading-posts')
                    }
                    if ($().theiaStickySidebar) {
                        var top_margin = 90;
                        if ($('body').hasClass('admin-bar')) {
                            top_margin = 122;
                        }
                        $('.penci-mtp-sticky .penci-mtp-filters-terms,.penci-mtp-sticky .penci-mtp-filters-posts').theiaStickySidebar({
                            // settings
                            additionalMarginTop: top_margin
                        });
                    } // if sticky
                    $(".penci-wrapper-smalllist").fitVids();

                    if ($().easyPieChart) {
                        $('.penci-piechart').each(function () {
                            var $this = $(this);
                            $this.one('inview', function (event, isInView, visiblePartX, visiblePartY) {
                                var chart_args = {
                                    barColor: $this.data('color'),
                                    trackColor: $this.data('trackcolor'),
                                    scaleColor: false,
                                    lineWidth: $this.data('thickness'),
                                    size: $this.data('size'),
                                    animate: 1000
                                };
                                $this.easyPieChart(chart_args);
                            }); // bind inview
                        }); // each
                    }
                    
                    $(document).trigger('penci_bf_check');
                }
            })
    }
    
    $(document).ready(function() {
      PENCI.mtpFilter();
      PENCI.mtp_more_scroll();
    });
  })(jQuery);