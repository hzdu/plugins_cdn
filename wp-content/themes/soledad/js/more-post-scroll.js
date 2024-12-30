jQuery(document).ready(function ($) {
    if (!$('.penci-ajax-more-scroll .penci-ajax-more-button').length) {
        return;
    }

    var pc_ajax_more_scrll = function () {

        $('.penci-ajax-more-scroll .penci-ajax-more-button').each(function () {
            var $this_scroll = $(this);
            $(window).on('scroll', $this_scroll, function () {
                var hT = $this_scroll.offset().top,
                    hH = $this_scroll.outerHeight(),
                    wH = $(window).height(),
                    wS = $(this).scrollTop();

                if ((wS > (hT + hH - wH)) && $this_scroll.length) {
                    if (!$this_scroll.hasClass('loading-posts')) {
                        var layout = $this_scroll.data('layout'),
                            ppp = $this_scroll.data('number'),
                            mes = $this_scroll.data('mes'),
                            offset = $this_scroll.attr('data-offset'),
                            exclude = $this_scroll.data('exclude'),
                            from = $this_scroll.data('from'),
                            comeFrom = $this_scroll.data('come_from'),
                            mixed = $this_scroll.data('mixed'),
                            query = $this_scroll.data('query'),
                            infeedads = $this_scroll.data('infeedads'),
                            number = $this_scroll.data('number'),
                            query_type = $this_scroll.data('query_type'),
                            archivetype = $this_scroll.data('archivetype'),
                            archivevalue = $this_scroll.data('archivevalue'),
                            archiveorder = $this_scroll.data('order'),
                            tag = $this_scroll.data('tag'),
                            cat = $this_scroll.data('cat'),
                            author = $this_scroll.data('author'),
                            template = $this_scroll.data('template');

                        $this_scroll.addClass('loading-posts');

                        var OBjBlockData = penciGetOBjBlockData($this_scroll.attr('data-blockuid')),
                            dataFilter = OBjBlockData.atts_json ? JSON.parse(OBjBlockData.atts_json) : OBjBlockData.atts_json;

                        var data = {
                            action: 'penci_more_post_ajax',
                            query: query,
                            offset: offset,
                            mixed: mixed,
                            layout: layout,
                            exclude: exclude,
                            from: from,
                            comefrom: comeFrom,
                            datafilter: dataFilter,
                            template: template,
                            infeedads: infeedads,
                            ppp: ppp,
                            tag: tag,
                            author: author,
                            cat: cat,
                            number: number,
                            query_type: query_type,
                            archivetype: archivetype,
                            archivevalue: archivevalue,
                            order: archiveorder,
                            nonce: pajax_mscroll.nonce,
                        };


                        $.ajax({
                            type: "POST",
                            dataType: "html",
                            url: ajax_var_more.url,
                            data: data,
                            success: function (data) {
                                if (data) {
                                    var data_offset = parseInt(offset) + ppp,
                                        $wrap_content = $this_scroll.parent().parent().find('.penci-wrapper-data');

                                    $this_scroll.attr('data-offset', data_offset);
                                    if (layout === 'masonry' || layout === 'masonry-2') {
                                        var $data = $(data);
                                        $wrap_content.append($data).isotope('appended', $data).imagesLoaded(function () {
                                            $wrap_content.isotope('layout');
                                        });

                                        $(".container").fitVids();

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

                                    } else {
                                        var $data = $(data);
                                        $wrap_content.append($data);

                                        $(".container").fitVids();

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

                                        var $justified_gallery = $('.penci-post-gallery-container.justified');
                                        var $masonry_gallery = $('.penci-post-gallery-container.masonry');
                                        if ($().justifiedGallery && $justified_gallery.length) {
                                            $('.penci-post-gallery-container.justified').each(function () {
                                                var $this = $(this);
                                                $this.justifiedGallery({
                                                    rowHeight: $this.data('height'),
                                                    lastRow: 'nojustify',
                                                    margins: $this.data('margin'),
                                                    randomize: false
                                                });
                                            }); // each .penci-post-gallery-container
                                        }

                                        if ($().isotope && $masonry_gallery.length) {

                                            $('.penci-post-gallery-container.masonry .item-gallery-masonry').each(function () {
                                                var $this = $(this);
                                                if ($this.attr('title')) {
                                                    var $title = $this.attr('title');
                                                    $this.children().append('<div class="caption">' + $title + '</div>');
                                                }
                                            });
                                        }

                                        if ($masonry_gallery.length) {
                                            $masonry_gallery.each(function () {
                                                var $this = $(this);
                                                $this.imagesLoaded(function () {
                                                    // initialize isotope
                                                    $this.isotope({
                                                        itemSelector: '.item-gallery-masonry',
                                                        transitionDuration: '.55s',
                                                        layoutMode: 'masonry'
                                                    });

                                                    $this.addClass('loaded');

                                                    $('.penci-post-gallery-container.masonry .item-gallery-masonry').each(function () {
                                                        var $this = $(this);
                                                        $this.one('inview', function (event, isInView, visiblePartX, visiblePartY) {
                                                            $this.addClass('animated');
                                                        }); // inview
                                                    }); // each
                                                });
                                            });
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
                                    }

                                    $('body').trigger( 'penci_swiper_sliders' );
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

    pc_ajax_more_scrll();

    $(document).on('pcajax_loaded', function () {
        pc_ajax_more_scrll();
    });

    function penciGetOBjBlockData($blockID) {
        var $obj = new penciBlock();

        jQuery.each(penciBlocksArray, function (index, block) {

            if (block.blockID === $blockID) {
                $obj = penciBlocksArray[index];
            }
        });

        return $obj;
    }
});
