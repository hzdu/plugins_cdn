jQuery(document).ready(function ($) {
    var bgajax_term_more_scroll = function () {
        if (!$('.penci-bgajax-more-terms-scroll .penci-ajax-more-button').length) {
            return;
        }
        $('.penci-bgajax-more-terms-scroll .penci-ajax-more-button').each(function () {
            var $this_scroll = $(this);
            $(window).on('scroll', $this_scroll, function () {
                var hT = $this_scroll.offset().top,
                    hH = $this_scroll.outerHeight(),
                    wH = $(window).height(),
                    wS = $(this).scrollTop();

                if ((wS > (hT + hH - wH)) && $this_scroll.length) {
                    if (!$this_scroll.hasClass('loading-posts')) {
                        var settings = $this_scroll.data('settings'),
                            layout = $this_scroll.data('layout'),
                            mes = $this_scroll.data('mes'),
                            pagednum = $this_scroll.attr('data-pagednum');

                        $this_scroll.addClass('loading-posts');

                        var data = {
                            action: 'penci_bgmore_terms_ajax',
                            settings: settings,
                            layout: layout,
                            pagednum: pagednum,
                            scroll: true,
                            nonce: penci_bgajax_more_terms.nonce,
                        };


                        $.ajax({
                            type: "POST",
                            dataType: "html",
                            url: penci_bgajax_more_terms.url,
                            data: data,
                            success: function (data) {
                                if (data) {
                                    var data_paded = parseInt(pagednum) + 1,
                                        $wrap_content = $this_scroll.parent().parent().find('.penci-biggrid-data');

                                    $this_scroll.attr('data-pagednum', data_paded);

                                    if (layout === 'style-2') {
                                        var $data = $(data);
                                        $wrap_content.append($data).isotope('appended', $data).imagesLoaded(function () {
                                            $wrap_content.isotope('layout');
                                        });


                                    } else {
                                        var $data = $(data);
                                        if (layout === 'style-1') {
                                            $wrap_content.append($data);
                                        } else {
                                            $wrap_content.parent().append($data);
                                        }

                                    }

                                    if ($().theiaStickySidebar) {
                                        var top_margin = 90;
                                        if ($('body').hasClass('admin-bar')) {
                                            top_margin = 122;
                                        }
                                        $('#main.penci-main-sticky-sidebar, #sidebar.penci-sticky-sidebar').theiaStickySidebar({
                                            // settings
                                            additionalMarginTop: top_margin
                                        });
                                    } // if sticky

                                    $this_scroll.removeClass('loading-posts');
                                    $(document).trigger('penci_bf_check');

                                } else {
                                    $this_scroll.find(".ajax-more-text").text(mes);
                                    $this_scroll.find("i").remove();
                                    $this_scroll.removeClass('loading-posts');
                                    setTimeout(function () {
                                        $this_scroll.parent().remove();
                                    }, 1200);
                                }
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                console.log(jqXHR + " :: " + textStatus + " :: " + errorThrown);
                            }

                        });
                    }
                }
            });
        });
    }

    bgajax_term_more_scroll();
    $(document).on('bgajax_loaded', function () {
        bgajax_term_more_scroll();
    });
});
