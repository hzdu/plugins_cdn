jQuery(document).ready(function ($) {
    $('.penci-featured-cat-sc').each(function () {
        if ($(this).find('.pcflx-nav').length > 0) {
            var maxnum = $(this).find('.pcflx li.all a').attr('data-maxp');
            if (parseInt(maxnum) <= 1) {
                $(this).find('.pcflx-nav .pcaj-nav-link').addClass('disable');
            }
        }
    });
    jQuery('body').on('click', '.penci-featured-cat-sc .pc-ajaxfil-link', function (event) {
        event.preventDefault();
        if (!$(this).hasClass('loading-posts')) {
            var $this = $(this),
                $navthis = $this,
                wrapId = $this.data('id'),
                parentclass = $(this).closest('.pcnav-lgroup'),
                wrapper = $(this).closest('.penci-featured-cat-sc').find('.home-featured-cat-wrapper'),
                tag = $this.data('tag'),
                cat = $this.data('cat'),
                author = $this.data('author'),
                navlink = false,
                prev,
                pagednum = parseInt($this.attr('data-paged')),
                curpaged = pagednum,
                dataFilter,
                $wrap_content_id = wrapper.find('.pwf-id-' + wrapId),
                OBjBlockData = penciGetOBjBlockData(parentclass.data('blockid'));

            if (OBjBlockData.atts_json) {
                var sanitizedJsonString = OBjBlockData.atts_json.replace(/[\u0000-\u001F]/g, '');
                
                try {
                    dataFilter = JSON.parse(sanitizedJsonString);
                } catch (e) {
                    console.error("Error parsing JSON:", e);
                }
            } else {
                dataFilter = OBjBlockData.atts_json;
            }

            $this.addClass('loading-posts');

            wrapper.addClass('loading-posts pcftaj-ld');

            if ($this.hasClass('pcaj-nav-link')) {
                navlink = true;
            }

            if (navlink && $this.hasClass('prev')) {
                prev = true;
            }

            if (navlink) {
                $this = parentclass.find('.current-item');
                wrapId = $this.data('id');
                cat = $this.data('cat');
                tag = $this.data('tag');

                curpaged = parseInt($this.attr('data-paged'));


                if (prev) {
                    pagednum = curpaged - 1;
                } else {
                    pagednum = curpaged + 1;
                }
            }

            if (!navlink) {
                parentclass.find('.pc-ajaxfil-link').removeClass('current-item');
                $this.addClass('current-item');
            }

            if ($wrap_content_id.length && !navlink) {
                wrapper.find('.home-featured-cat-content').hide();
                wrapper.find('.pwf-id-' + wrapId).show();
                wrapper.removeClass('loading-posts pcftaj-ld');
                $this.removeClass('loading-posts');
                $navthis.removeClass('loading-posts');

                if (curpaged <= 1) {
                    parentclass.find('.pc-ajaxfil-link.prev').addClass('disable');
                } else {
                    parentclass.find('.pc-ajaxfil-link.prev').removeClass('disable');
                }

                var maxp = undefined;
                if (wrapId == 'default') {
                    maxp = parentclass.find('li.all .pc-ajaxfil-link').attr('data-maxp');
                }

                if ($wrap_content_id.hasClass('pc-nomorepost') || parseInt(maxp) <= 1) {
                    parentclass.find('.pc-ajaxfil-link.next').addClass('disable');
                } else {
                    parentclass.find('.pc-ajaxfil-link.next').removeClass('disable');
                }

                var o = 0;
                $wrap_content_id.find('.hentry').each(function () {
                    o++;
                    $(this).addClass('penci-ajrs-animate').attr('style', 'animation-delay:' + o / 10 + 's')
                });

            } else {

                var data = {
                    action: 'penci_more_featured_post_ajax',
                    datafilter: dataFilter,
                    id: wrapId,
                    tag: tag,
                    cat: cat,
                    author: author,
                    pagednum: pagednum,
                    nonce: pcfcat_ajax.nonce,
                };

                $.ajax({
                    type: "POST",
                    dataType: "html",
                    url: ajax_var_more.url,
                    data: data,
                    success: function (data) {
                        if (data) {

                            var data_paded = curpaged;

                            if (navlink) {
                                wrapper.find('.pwf-id-' + wrapId).remove();
                                data_paded = curpaged + 1;
                            }

                            if (prev) {
                                data_paded = curpaged - 1;
                            }

                            if (data_paded <= 1) {
                                parentclass.find('.pc-ajaxfil-link.prev').addClass('disable');
                            } else {
                                parentclass.find('.pc-ajaxfil-link.prev').removeClass('disable');
                            }

                            wrapper.append(data);

                            if ($('.pwf-id-' + wrapId).hasClass('pc-nomorepost')) {
                                parentclass.find('.pc-ajaxfil-link.next').addClass('disable');
                            } else {
                                parentclass.find('.pc-ajaxfil-link.next').removeClass('disable');
                            }

                            $this.attr('data-paged', data_paded);


                            $(".home-featured-cat-wrapper").fitVids();

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

                            wrapper.find('.home-featured-cat-content').hide();
                            wrapper.find('.pwf-id-' + wrapId).show();
                            wrapper.removeClass('loading-posts pcftaj-ld');
                            $this.removeClass('loading-posts');
                            $navthis.removeClass('loading-posts');
                            $(document).trigger('penci_bf_check');

                            var o = 0;
                            wrapper.find('.pwf-id-' + wrapId + ' .hentry').each(function () {
                                o++;
                                $(this).addClass('penci-ajrs-animate').attr('style', 'animation-delay:' + o / 10 + 's')
                            });
                        }
                    }
                });
            }
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
    }
});
