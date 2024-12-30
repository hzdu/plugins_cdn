jQuery(document).ready(function ($) {
    function penciGetsListData() {
        var nav = [];
        $('.elementor-widget-penci-small-list').each(function () {
            var elID = $(this).data('id');
            if ($(this).find('.pcflx-nav').length > 0) {
                var maxnum = $(this).find('.pcflx li.all a').attr('data-maxp');
                if (parseInt(maxnum) <= 1) {
                    $(this).find('.pcflx-nav .pcaj-nav-link').addClass('disable');
                }
            }
            if($(this).find('.penci-ajax-more').length) {
                nav[elID] = $(this).find('.penci-ajax-more').prop('outerHTML');
            }
        });

        jQuery('body').on('click', '.penci-wrapper-smalllist .pc-ajaxfil-link', function (event) {
            event.preventDefault();
            if (!$(this).hasClass('loading-posts')) {
                var $this = $(this),
                    parentID = $(this).closest('.elementor-widget-penci-small-list').data('id'),
                    $navthis = $this,
                    wrapId = $this.data('id') ? $this.data('id') : 'default',
                    parentclass = $(this).closest('.pcnav-lgroup'),
                    wrapper = $(this).closest('.penci-wrapper-smalllist').find('.penci-smalllist-wrapper'),
                    tag = $this.data('tag'),
                    cat = $this.data('cat'),
                    author = $this.data('author'),
                    navlink = false,
                    prev,
                    pagednum = parseInt($this.attr('data-paged')),
                    curpaged = pagednum,
                    $wrap_content_id = wrapper.find('.pwsl-id-' + wrapId);

                var OBjBlockData = penciGetOBjBlockData(parentclass.data('blockid')),
                    dataFilter = OBjBlockData.atts_json ? JSON.parse(OBjBlockData.atts_json) : OBjBlockData.atts_json;

                wrapper.addClass('loading-posts pcftaj-ld');
                $this.addClass('loading-posts');

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
                    wrapper.find('.pcsl-wrapper').hide();
                    wrapper.find('.pwsl-id-' + wrapId).show();
                    wrapper.removeClass('loading-posts pcftaj-ld');
                    $this.removeClass('loading-posts');
                    $navthis.removeClass('loading-posts');
                    $('body').trigger( 'penci_swiper_sliders' );

                    var maxp = undefined;
                    if (wrapId == 'default') {
                        maxp = $(this).attr('data-maxp');
                    }

                    if (curpaged <= 1) {
                        parentclass.find('.pc-ajaxfil-link.prev').addClass('disable');
                    } else {
                        parentclass.find('.pc-ajaxfil-link.prev').removeClass('disable');
                    }

                    if ($wrap_content_id.hasClass('pc-nomorepost') || parseInt(maxp) <= 1) {
                        parentclass.find('.pc-ajaxfil-link.next').addClass('disable');
                    } else {
                        parentclass.find('.pc-ajaxfil-link.next').removeClass('disable');
                    }

                    var o = 0;
                    $wrap_content_id.find('.pcsl-item').each(function () {
                        if ( $(this).hasClass('swiper-slide') ) {
                            return;
                        }
                        o++;
                        $(this).addClass('penci-ajrs-animate').attr('style', 'animation-delay:' + o / 10 + 's')
                    });

                } else {

                    var data = {
                        action: 'penci_more_slist_post_ajax',
                        datafilter: dataFilter,
                        id: wrapId,
                        tag: tag,
                        cat: cat,
                        author: author,
                        pagednum: pagednum,
                        nonce: pcslist_ajax.nonce,
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
                                    wrapper.find('.pwsl-id-' + wrapId).remove();
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


                                $this.attr('data-paged', data_paded);

                                wrapper.append(data);

                                if ($('.pwsl-id-' + wrapId).hasClass('pc-nomorepost')) {
                                    parentclass.find('.pc-ajaxfil-link.next').addClass('disable');
                                } else {
                                    parentclass.find('.pc-ajaxfil-link.next').removeClass('disable');
                                }

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

                                if (nav[parentID] !== undefined) {
                                    wrapper.find('.pwsl-id-' + wrapId).append($(nav[parentID]));
                                    wrapper.find('.pwsl-id-' + wrapId + ' .penci-ajax-more .penci-ajax-more-button')
                                        .removeAttr('data-cat')
                                        .removeAttr('data-tag')
                                        .removeAttr('data-author');
                                    if (cat) {
                                        wrapper.find('.pwsl-id-' + wrapId + ' .penci-ajax-more .penci-ajax-more-button').attr('data-cat', cat);
                                    }
                                    if (tag) {
                                        wrapper.find('.pwsl-id-' + wrapId + ' .penci-ajax-more .penci-ajax-more-button').attr('data-tag', tag);
                                    }
                                    if (author) {
                                        wrapper.find('.pwsl-id-' + wrapId + ' .penci-ajax-more .penci-ajax-more-button').attr('data-author', author);
                                    }
                                    wrapper.find('.pwsl-id-' + wrapId + ' .penci-ajax-more .penci-ajax-more-button').attr('data-pagednum', data_paded + 1);
                                }

                                wrapper.find('.pcsl-wrapper').hide();
                                wrapper.find('.pwsl-id-' + wrapId).show();
                                wrapper.removeClass('loading-posts pcftaj-ld');
                                $this.removeClass('loading-posts');
                                $navthis.removeClass('loading-posts');

                                var o = 0;
                                wrapper.find('.pwsl-id-' + wrapId + ' .pcsl-item').each(function () {
                                    o++;
                                    $(this).addClass('penci-ajrs-animate').attr('style', 'animation-delay:' + o / 10 + 's')
                                });
                                $(document).trigger('pajax-tab-loaded');
                                $(document).trigger('penci_bf_check');
                            } else {
                                wrapper.find('.pcsl-wrapper').hide();
                                wrapper.append('<div class="penci-smalllist pcsl-wrapper pwsl-id-' + wrapId + '"></div>');
                                wrapper.find('.pwsl-id-' + wrapId).append('<div class="pcajx-nopost"><span>No post found !</span></div>');
                                wrapper.find('.pwsl-id-' + wrapId).show();
                                wrapper.removeClass('loading-posts pcftaj-ld');
                                $this.removeClass('loading-posts');
                                $navthis.removeClass('loading-posts');
                            }
                        }
                    });
                }
            }
        });
    }

    function penciGetOBjBlockData($blockID) {
        var $obj = new penciBlock();

        jQuery.each(penciBlocksArray, function (index, block) {

            if (block.blockID === $blockID) {
                $obj = penciBlocksArray[index];
            }
        });

        return $obj;
    }

    penciGetsListData();

    $('body').on('penci-small-list-loaded', function () {
        penciGetsListData();
    });
});
