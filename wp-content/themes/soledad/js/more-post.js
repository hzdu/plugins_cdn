/* global penciBlock */
/* global penciBlocksArray */
jQuery(document).ready(function ($) {
    var offset;
    jQuery('body').on('click', '.penci-ajax-more-click .penci-ajax-more-button', function (event) {
        event.preventDefault();
        if (!$(this).hasClass('loading-posts')) {
            var $this = $(this),
                layout = $this.data('layout'),
                ppp = $this.data('number'),
                mes = $this.data('mes'),
                offset = $(this).attr('data-offset'),
                exclude = $this.data('exclude'),
                from = $this.data('from'),
                comeFrom = $this.data('come_from'),
                mixed = $this.data('mixed'),
                query = $this.data('query'),
                infeedads = $this.data('infeedads'),
                number = $this.data('number'),
                query_type = $this.data('query_type'),
                archivetype = $this.data('archivetype'),
                archivevalue = $this.data('archivevalue'),
                archiveorder = $this.data('order'),
                tag = $this.data('tag'),
                cat = $this.data('cat'),
                author = $this.data('author'),
                template = $this.data('template');

            $this.addClass('loading-posts');

            var OBjBlockData = penciGetOBjBlockData($this.attr('data-blockuid')),
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
                ppp: ppp,
                tag: tag,
                author: author,
                cat: cat,
                number: number,
                infeedads: infeedads,
                query_type: query_type,
                archivetype: archivetype,
                archivevalue: archivevalue,
                order: archiveorder,
                nonce: penci_ajax_more_posts.nonce,
            };


            $.ajax({
                type: "POST",
                dataType: "html",
                url: ajax_var_more.url,
                data: data,
                success: function (data) {
                    if (data) {
                        var data_offset = parseInt(offset) + ppp,
                            $wrap_content = $this.parent().parent().find('.penci-wrapper-data');

                        $this.attr('data-offset', data_offset);
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

                            //lazySizes.init();

                        } else {
                            var $data = $(data);
                            $wrap_content.append($data);

                            //lazySizes.init();

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

                        $this.removeClass('loading-posts');
                        $('body').trigger( 'penci_swiper_sliders' );
                        $(document).trigger('penci_bf_check');

                    } else {
                        $this.find(".ajax-more-text").text(mes);
                        $this.find("i").remove();
                        $this.removeClass('loading-posts');
                        setTimeout(function () {
                            $this.parent().remove();
                        }, 1200);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR + " :: " + textStatus + " :: " + errorThrown);
                }

            });
        }
    });

    function penciGetOBjBlockData($blockID) {
        var $obj = new penciBlock();

        jQuery.each(penciBlocksArray, function (index, block) {

            if (block.blockID === $blockID) {
                $obj = penciBlocksArray[index];
            }
        });

        return $obj;
    };
});
