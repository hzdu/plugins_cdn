/* global penciBlock */
/* global penciBlocksArray */
jQuery(document).ready(function ($) {
    var nav = [];
    $('.penci-latest-posts-sc').each(function () {
        var elID = $(this).attr('id');
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
    jQuery('body').on('click', '.penci-latest-posts-sc .pc-ajaxfil-link', function (event) {
        event.preventDefault();
        if (!$(this).hasClass('loading-posts')) {
            var $this = $(this),
                $navthis = $this,
                parentID = $(this).closest('.penci-latest-posts-sc').attr('id'),
                parentclass = $(this).closest('.pcnav-lgroup'),
                wrapper = $(this).closest('.penci-latest-posts-sc').find('.penci-wrapper-posts-ajax'),
                wrapId = $this.data('id'),
                layout = parentclass.data('layout'),
                ppp = parentclass.data('number'),
                offset = parentclass.attr('data-offset'),
                exclude = parentclass.data('exclude'),
                from = parentclass.data('from'),
                comeFrom = parentclass.data('come_from'),
                mixed = parentclass.data('mixed'),
                query = parentclass.data('query'),
                infeedads = parentclass.data('infeedads'),
                number = parentclass.data('number'),
                query_type = parentclass.data('query_type'),
                archivetype = parentclass.data('archivetype'),
                archivevalue = parentclass.data('archivevalue'),
                tag = $this.data('tag'),
                cat = $this.data('cat'),
                author = $this.data('author'),
                template = parentclass.data('template'),
                navlink = false,
                prev,
                pagednum = parseInt($this.attr('data-paged')),
                curpaged = pagednum,
                cols = wrapper.find('.pwid-default > ul').attr('data-cols'),
                tcols = wrapper.find('.pwid-default > ul').attr('data-tcols'),
                mcols = wrapper.find('.pwid-default > ul').attr('data-mcols'),
                $wrap_content_id = wrapper.find('.pwid-' + wrapId);


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

            if (wrapId === 'default' && !navlink) {
                wrapper.find('.penci-wrapper-posts-content').hide();
                wrapper.find('.pwid-default').show();
                wrapper.removeClass('loading-posts pcftaj-ld');
                $this.removeClass('loading-posts');
                $navthis.removeClass('loading-posts');

                var maxp = $(this).attr('data-maxp');

                if (curpaged <= 1) {
                    parentclass.find('.pc-ajaxfil-link.prev').addClass('disable');
                } else {
                    parentclass.find('.pc-ajaxfil-link.prev').removeClass('disable');
                }

                if ($wrap_content_id.find('.pc-nomorepost').length || maxp <= 1) {
                    parentclass.find('.pc-ajaxfil-link.next').addClass('disable');
                } else {
                    parentclass.find('.pc-ajaxfil-link.next').removeClass('disable');
                }

                var o = 0;
                $wrap_content_id.find('.list-post,.grid-style,.grid-masonry').each(function () {
                    o++;
                    $(this).addClass('penci-ajrs-animate').attr('style', 'animation-delay:' + o / 10 + 's')
                });
            } else if ($wrap_content_id.length && !navlink) {
                wrapper.find('.penci-wrapper-posts-content').hide();
                $wrap_content_id.show();
                wrapper.removeClass('loading-posts pcftaj-ld');
                $this.removeClass('loading-posts');
                $navthis.removeClass('loading-posts');

                if (curpaged <= 1) {
                    parentclass.find('.pc-ajaxfil-link.prev').addClass('disable');
                } else {
                    parentclass.find('.pc-ajaxfil-link.prev').removeClass('disable');
                }

                if ($wrap_content_id.find('.pc-nomorepost').length) {
                    parentclass.find('.pc-ajaxfil-link.next').addClass('disable');
                } else {
                    parentclass.find('.pc-ajaxfil-link.next').removeClass('disable');
                }

                var o = 0;
                $wrap_content_id.find('.list-post,.grid-style,.grid-masonry').each(function () {
                    o++;
                    $(this).addClass('penci-ajrs-animate').attr('style', 'animation-delay:' + o / 10 + 's')
                });
            } else {

                var OBjBlockData = penciGetOBjBlockData(parentclass.data('blockid')),
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
                    number: number,
                    infeedads: infeedads,
                    query_type: query_type,
                    archivetype: archivetype,
                    archivevalue: archivevalue,
                    tag: tag,
                    cat: cat,
                    author: author,
                    pagednum: pagednum,
                    qtype: 'ajaxtab',
                    nonce: pclatest_ajax.nonce,
                };


                $.ajax({
                    type: "POST",
                    dataType: "html",
                    url: ajax_var_more.url,
                    data: data,
                    success: function (data) {

                        var data_offset = parseInt(offset) + ppp,
                            data_paded = curpaged,
                            $wrap_content,
                            $check_class = false,
                            $check_masonry = false;

                        if (wrapper.find('.penci-wrapper-posts-content .penci-wrapper-data').hasClass('penci-grid')) {
                            $check_class = true;
                        }

                        if (wrapper.find('.penci-wrapper-posts-content .penci-wrapper-data').hasClass('masonry')) {
                            $check_masonry = true;
                        }

                        if (navlink) {
                            wrapper.find('.pwid-' + wrapId).remove();
                            data_paded = curpaged + 1;
                        }

                        if (prev) {
                            data_paded = curpaged - 1;
                        }

                        if ($check_class) {
                            wrapper.append('<div class="penci-wrapper-posts-content pwcustom pwid-' + wrapId + '"><ul data-cols="'+cols+'" data-tcols="'+tcols+'" data-mcols="'+mcols+'" class="penci-wrapper-data penci-grid penci-shortcode-render"></ul></div>');
                        } else if ($check_masonry) {
                            wrapper.append('<div class="penci-wrapper-posts-content pwcustom pwid-' + wrapId + '"><div class="penci-wrap-masonry"><div data-cols="'+cols+'" data-tcols="'+tcols+'" data-mcols="'+mcols+'" class="penci-wrapper-data masonry penci-masonry"></div></div></div>');
                        } else {
                            wrapper.append('<div class="penci-wrapper-posts-content pwcustom pwid-' + wrapId + '"><div class="penci-wrapper-data"></div></div>');
                        }

                        $wrap_content = wrapper.find('.pwid-' + wrapId + ' .penci-wrapper-data');

                        if (data) {
                            $this.attr('data-paged', data_paded);
                            $this.attr('data-offset', data_offset);

                            if (data_paded <= 1) {
                                parentclass.find('.pc-ajaxfil-link.prev').addClass('disable');
                            } else {
                                parentclass.find('.pc-ajaxfil-link.prev').removeClass('disable');
                            }

                            if (layout === 'masonry' || layout === 'masonry-2') {
                                var $data = $(data);
                                $wrap_content.append($data).imagesLoaded(function () {
                                    $wrap_content.isotope({
                                        itemSelector: '.item-masonry',
                                        transitionDuration: '.55s',
                                        layoutMode: 'masonry'
                                    });
                                });

                                $(".container").fitVids();

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

                            } else {
                                var $data = $(data);
                                $wrap_content.append($data);

                                $(".container").fitVids();

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
                            }

                            if ($('.pwid-' + wrapId ).find('.pc-nomorepost').length) {
                                parentclass.find('.pc-ajaxfil-link.next').addClass('disable');
                            } else {
                                parentclass.find('.pc-ajaxfil-link.next').removeClass('disable');
                            }

                            if (nav[parentID] !== undefined) {
                                wrapper.find('.pwid-' + wrapId).append($(nav[parentID]));

                                wrapper.find('.pwid-' + wrapId + ' .penci-ajax-more .penci-ajax-more-button')
                                    .removeAttr('data-cat')
                                    .removeAttr('data-tag')
                                    .removeAttr('data-author');

                                if (cat) {
                                    wrapper.find('.pwid-' + wrapId + ' .penci-ajax-more .penci-ajax-more-button').attr('data-cat', cat);
                                }
                                if (tag) {
                                    wrapper.find('.pwid-' + wrapId + ' .penci-ajax-more .penci-ajax-more-button').attr('data-tag', tag);
                                }
                                if (author) {
                                    wrapper.find('.pwid-' + wrapId + ' .penci-ajax-more .penci-ajax-more-button').attr('data-author', author);
                                }
                                wrapper.find('.pwid-' + wrapId + ' .penci-ajax-more .penci-ajax-more-button').attr('data-offset', number);
                            }

                            wrapper.find('.penci-wrapper-posts-content').hide();
                            wrapper.find('.pwid-' + wrapId).show();
                            wrapper.removeClass('loading-posts pcftaj-ld');
                            $this.removeClass('loading-posts');
                            $navthis.removeClass('loading-posts');
                            var o = 0;
                            wrapper.find('.pwid-' + wrapId + ' .list-post, .pwid-' + wrapId + ' .grid-style, .pwid-' + wrapId + ' .grid-masonry').each(function () {
                                o++;
                                $(this).addClass('penci-ajrs-animate').attr('style', 'animation-delay:' + o / 10 + 's')
                            });
                            $(document).trigger('pcajax_loaded');
                            $(document).trigger('penci_bf_check');
                        } else {
                            wrapper.find('.penci-wrapper-posts-content').hide();
                            wrapper.find('.pwid-' + wrapId).show();
                            wrapper.find('.pwid-' + wrapId).append('<div class="pcajx-nopost"><span>No post found !</span></div>');
                            wrapper.removeClass('loading-posts pcftaj-ld');
                            $this.removeClass('loading-posts');
                            $navthis.removeClass('loading-posts');
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.log(jqXHR + " :: " + textStatus + " :: " + errorThrown);
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
