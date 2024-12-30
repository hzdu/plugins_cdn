jQuery(document).ready(function ($) {
    if (!$('.penci-slajax-more-scroll .penci-ajax-more-button').length) {
        return;
    }
    var penci_slajax_more_scroll = function () {

        $('.penci-slajax-more-scroll .penci-ajax-more-button').each(function () {
            var $this_scroll = $(this);

            $(document).on('scroll', $this_scroll, function () {
                var hT = $this_scroll.offset().top,
                    hH = $this_scroll.outerHeight(),
                    wH = $(window).height(),
                    wS = $(this).scrollTop();

                if ((wS > (hT + hH - wH)) && $this_scroll.length) {
                    if (!$this_scroll.hasClass('loading-posts')) {
                        var wrapId = $this_scroll.data('id'),
                            parentclass = $this_scroll.closest('.pcnav-lgroup'),
                            wrapper = $this_scroll.closest('.penci-smalllist').find('.pcsl-inner'),
                            tag = $this_scroll.data('tag'),
                            cat = $this_scroll.data('cat'),
                            ppp = parentclass.data('ppp'),
                            maxitem = $this_scroll.data('max'),
                            author = $this_scroll.data('author'),
                            mes = $this_scroll.data('mes'),
                            type = $this_scroll.data('query_type'),
                            pagednum = parseInt($this_scroll.attr('data-pagednum')),
                            curpaged = pagednum;

                        var OBjBlockData = penciGetOBjBlockData($this_scroll.data('blockid')),
                            dataFilter = OBjBlockData.atts_json ? JSON.parse(OBjBlockData.atts_json) : OBjBlockData.atts_json;

                        $this_scroll.addClass('loading-posts');

                        var data = {
                            action: 'penci_more_slist_post_ajax',
                            datafilter: dataFilter,
                            id: wrapId,
                            tag: tag,
                            cat: cat,
                            author: author,
                            pagednum: pagednum,
                            type: type,
                            checkmore: true,
                            nonce: penci_smlajax.nonce,
                        };

                        $.ajax({
                            type: "POST",
                            dataType: "html",
                            url: ajax_var_more.url,
                            data: data,
                            success: function (data) {
                                if (data) {

                                    var data_paded = curpaged;

                                    if (data_paded <= 1) {
                                        parentclass.find('.pc-ajaxfil-link.prev').addClass('disable');
                                    } else {
                                        parentclass.find('.pc-ajaxfil-link.prev').removeClass('disable');
                                    }

                                    if (data_paded * ppp >= maxitem) {
                                        parentclass.find('.pc-ajaxfil-link.next').addClass('disable');
                                    } else {
                                        parentclass.find('.pc-ajaxfil-link.next').removeClass('disable');
                                    }

                                    $this_scroll.attr('data-pagednum', curpaged + 1);

                                    wrapper.append(data);

                                    $(".penci-wrapper-smalllist").fitVids();

                                    $('body').trigger( 'penci_swiper_sliders' );

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
                            }
                        });
                    }
                }
            });
        });
    };

    penci_slajax_more_scroll();

    $(document).on('pajax-tab-loaded',function (){
        penci_slajax_more_scroll();
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
