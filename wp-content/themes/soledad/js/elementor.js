/* global PENCILOCALIZE */

(function ($) {
    "use strict";
    var ELPENCI = ELPENCI || {};

    /* General functions
     ---------------------------------------------------------------*/
    ELPENCI.general = function () {
        // Top search
        $('.pcheader-icon a.search-click').on('click', function (e) {
            var $this = $(this),
                $closet = $this.closest('.wrapper-boxed'),
                $pbcloset = $this.closest('.penci_nav_col');
            if ($closet.hasClass('header-search-style-showup')) {
                $this.next().toggleClass('active');
            } else {
                $this.next().fadeToggle();
            }
            var opentimeout = setTimeout(function () {
                $closet.find('.search-input').focus();
                if ($pbcloset.length) {
                    $pbcloset.find('.search-input').focus();
                }
            }, 200, function () {
                clearTimeout(opentimeout);
            });
            e.stopPropagation();
            return false;
        });

        $('.pcheader-icon .close-search').off().on('click', function (e) {
            $(this).closest('.show-search').fadeToggle();
            return false;
        });

        // Go to top
        $('.go-to-top, .penci-go-to-top-floating').on('click', function () {
            $('html, body').animate({scrollTop: 0}, 700);
            return false;
        });

        // Go to top button
        var $goto_button = $('.penci-go-to-top-floating');
        if ($goto_button.length) {
            $(document).on('scroll', function () {
                var y = $(this).scrollTop();
                if (y > 300) {
                    $goto_button.addClass('show-up');
                } else {
                    $goto_button.removeClass('show-up');
                }
            });
        }

        $(".penci-jump-recipe").on('click', function (e) {
            e.preventDefault();
            var id = $(this).attr("href"),
                $scroll_top = $(id).offset().top,
                $nav_height = 30;
            if ($('#navigation').length) {
                $nav_height = $('#navigation').height() + 30;
                if ($("body").hasClass('admin-bar')) {
                    $nav_height = $('#navigation').height() + 62;
                }
            }
            var $scroll_to = $scroll_top - $nav_height;
            $('html,body').animate({
                scrollTop: $scroll_to
            }, 'fast');
        });

        // Call back fitvid when click load more button on buddypress
        $('body.buddypress .activity .load-more a').on('click', function () {
            $(document).ajaxStop(function () {
                $(".container").fitVids();
            });
        });
    }

    /* Cookie Law
     ---------------------------------------------------------------*/
    ELPENCI.cookie = function () {
        var wrapCookie = '.penci-wrap-gprd-law',
            $wrapCookie = $(wrapCookie),
            classAction = 'penci-wrap-gprd-law-close',
            penciCookieName = 'penci_law_footer_new';

        if (!$wrapCookie.length) {
            return false;
        }

        var penciCookie = {
            set: function (name, value) {
                var date = new Date();
                date.setTime(date.getTime() + (31536000000));
                var expires = "; expires=" + date.toGMTString();
                document.cookie = name + "=" + value + expires + "; path=/";
            },
            read: function (name) {
                var namePre = name + "=";
                var cookieSplit = document.cookie.split(';');
                for (var i = 0; i < cookieSplit.length; i++) {
                    var cookie = cookieSplit[i];
                    while (cookie.charAt(0) == ' ') {
                        cookie = cookie.substring(1, cookie.length);
                    }
                    if (cookie.indexOf(namePre) === 0) {
                        return cookie.substring(namePre.length, cookie.length);
                    }
                }
                return null;
            },
            erase: function (name) {
                this.set(name, "", -1);
            },
            exists: function (name) {
                return (
                    this.read(name) !== null
                );
            }
        };

        $wrapCookie.removeClass('penci-close-all');
        if (!penciCookie.exists(penciCookieName) || (penciCookie.exists(penciCookieName) && 1 == penciCookie.read(penciCookieName))) {
            $wrapCookie.removeClass(classAction);
        } else {
            $wrapCookie.addClass(classAction);
        }

        $('.penci-gprd-accept, .penci-gdrd-show').on('click', function (e) {
            e.preventDefault();

            var $this = $(this),
                $parent_law = $this.closest(wrapCookie);

            $parent_law.toggleClass(classAction);

            if ($parent_law.hasClass(classAction)) {
                penciCookie.set(penciCookieName, '2');
            } else {
                penciCookie.set(penciCookieName, '1');
            }

            return false;
        });
    }

    /* Fitvids
     ---------------------------------------------------------------*/
    ELPENCI.fitvids = function () {
        // Target your .container, .wrapper, .post, etc.
        $(".container").fitVids();
    }

    /* Sticky sidebar
     ----------------------------------------------------------------*/
    ELPENCI.sticky_sidebar = function () {
        if ($().theiaStickySidebar) {
            var top_margin = 90;
            if ($('body').hasClass('admin-bar') && $('body').hasClass('penci-vernav-enable')) {
                top_margin = 62;
            } else if (!$('body').hasClass('admin-bar') && $('body').hasClass('penci-vernav-enable')) {
                top_margin = 30;
            } else if ($('body').hasClass('admin-bar') && !$('body').hasClass('penci-vernav-enable')) {
                top_margin = 122;
            }

            if ($('.penci-vc-sticky-sidebar > .penci-vc-row > .penci-vc-column').length) {
                $('.penci-vc-sticky-sidebar > .penci-vc-row > .penci-vc-column').theiaStickySidebar({
                    additionalMarginTop: top_margin,
                });
            }

            if ($('.penci-enSticky .penci-sticky-sb').length) {
                $('.penci-enSticky .penci-sticky-sb,.penci-enSticky .penci-sticky-ct').theiaStickySidebar({
                    additionalMarginTop: top_margin,
                });
            }
            $('#main.penci-main-sticky-sidebar, #sidebar.penci-sticky-sidebar').theiaStickySidebar({
                // settings
                additionalMarginTop: top_margin
            });
        } // if sticky
    }

    /* Mega menu
     ----------------------------------------------------------------*/
    ELPENCI.mega_menu = function () {
        // Hover parent
        $('#navigation ul.menu > li.penci-mega-menu').on('mouseenter', function () {
            var $this = $(this),
                $row_active = $this.find('.row-active'),
                $rowsLazy = $row_active.find('.penci-lazy');
            $row_active.fadeIn('200').css('display', 'inline-block');
            /*$rowsLazy.Lazy({
                effect: 'fadeIn',
                effectTime: 300,
                scrollDirection: 'both',
                visibleOnly : true
            });*/
            //lazySizes.init();
        });

        $('#navigation .penci-mega-child-categories a').on('mouseenter', function () {
            if (!$(this).hasClass('cat-active')) {
                var $this = $(this),
                    $row_active = $this.data('id'),
                    $parentA = $this.parent().children('a'),
                    $parent = $this.closest('.penci-megamenu'),
                    $rows = $this.closest('.penci-megamenu').find('.penci-mega-latest-posts').children('.penci-mega-row'),
                    $rowsLazy = $rows.find('.penci-lazy');
                $parentA.removeClass('cat-active');
                $this.addClass('cat-active');
                $rows.hide();
                $parent.find('.' + $row_active).fadeIn('300').css('display', 'inline-block');
                /*$rowsLazy.Lazy({
                    effect: 'fadeIn',
                    effectTime: 300,
                    scrollDirection: 'both',
                    visibleOnly : true
                });*/
                //lazySizes.init();
            }
        });
    }

    /* Mobile menu responsive
     ----------------------------------------------------------------*/
    ELPENCI.mobile_menu = function () {
        // Add indicator
        $('#sidebar-nav .menu li.menu-item-has-children > a').append('<u class="indicator"><i class="fa fa-angle-down"></i></u>');

        // Toggle menu when click show/hide menu
        $('#navigation .button-menu-mobile').on('click', function () {
            $('body').addClass('open-sidebar-nav');
            /*$( '#sidebar-nav .penci-lazy' ).Lazy({
                effect: 'fadeIn',
                effectTime: 300,
                scrollDirection: 'both'
            });*/
            //lazySizes.init();
        });

        // indicator click
        $('#sidebar-nav .menu li a .indicator').on('click', function (e) {
            if ($('body').hasClass('penci-vernav-cparent')) {
                return;
            }
            var $this = $(this);
            e.preventDefault();
            $this.children().toggleClass('fa-angle-up');
            $this.parent().next().slideToggle('fast');
        });

        $('.penci-vernav-cparent #sidebar-nav .menu li.menu-item-has-children > a').on('click', function (e) {
            var $this = $(this);
            e.preventDefault();
            $this.children().children().toggleClass('fa-angle-up');
            $this.next().slideToggle('fast');
        });

        // Close sidebar nav
        $('#close-sidebar-nav').on('click', function () {
            $('body').removeClass('open-sidebar-nav');
        });
    }

    ELPENCI.toggleMenuHumburger = function () {
        var $menuhumburger = $('.penci-menu-hbg');
        if ($menuhumburger.length) {
            var $body = $('body'),
                $button = $('.penci-vernav-toggle,.penci-menuhbg-toggle,#penci-close-hbg,.penci-menu-hbg-overlay'),
                sidebarClass = 'penci-menuhbg-open';

            // Add indicator
            $('.penci-menu-hbg .menu li.menu-item-has-children > a').append('<u class="indicator"><i class="fa fa-angle-down"></i></u>');

            // indicator click
            $('.penci-menu-hbg .menu li a .indicator').on('click', function (e) {
                if ($('body').hasClass('penci-hbg-cparent')) {
                    return;
                }
                var $this = $(this);
                e.preventDefault();
                $this.children().toggleClass('fa-angle-up');
                $this.parent().next().slideToggle('fast');
            });

            $('.penci-hbg-cparent .penci-menu-hbg .menu li.menu-item-has-children > a').on('click', function (e) {
                var $this = $(this);
                e.preventDefault();
                $this.children().children().toggleClass('fa-angle-up');
                $this.next().slideToggle('fast');
            });

            // Click to show mobile menu
            $button.on('click', function (e) {
                e.preventDefault();

                if ($body.hasClass(sidebarClass)) {
                    $body.removeClass(sidebarClass);
                    $button.removeClass('active');

                    return;
                }
                e.stopPropagation(); // Do not trigger click event on '.site' below
                $body.addClass(sidebarClass);
                $button.addClass('active');

                /*$('.penci-menu-hbg .penci-lazy').Lazy({
                    effect: 'fadeIn',
                    effectTime: 300,
                    scrollDirection: 'both'
                });*/
                //lazySizes.init();
            });

            // Scroll menu hamburger and callback lazyload
            $menuhumburger.on('scroll', function () {
                /*$('.penci-menu-hbg .penci-lazy').Lazy({
                    effect: 'fadeIn',
                    effectTime: 300,
                    scrollDirection: 'both'
                });*/
                //lazySizes.init();
            });
        }
    }

    /* Light box
     ----------------------------------------------------------------*/
    ELPENCI.lightbox = function () {
        if ($().magnificPopup) {
            $('a[data-rel^="penci-gallery-image-content"], .penci-enable-lightbox .gallery-item a').magnificPopup({
                type: 'image',
                closeOnContentClick: true,
                closeBtnInside: false,
                fixedContentPos: true,
                image: {
                    verticalFit: true,
                    titleSrc: 'data-cap'
                },
                gallery: {
                    enabled: true
                },
                zoom: {
                    enabled: true,
                    duration: 300
                }
            });

            $('a[data-rel^="penci-gallery-bground-content"]').magnificPopup({
                type: 'image',
                closeOnContentClick: true,
                closeBtnInside: false,
                fixedContentPos: true,
                image: {
                    verticalFit: true,
                },
                gallery: {
                    enabled: true
                }
            });


            // Enable lightbox videos
            $('.penci-other-layouts-lighbox').magnificPopup({
                type: 'iframe',
                mainClass: 'mfp-fade',
                fixedContentPos: true,
                closeBtnInside: false,
                closeOnContentClick: true
            });

            if ($('.penci-image-gallery').length) {
                $('.penci-image-gallery').each(function () {
                    var $this = $(this),
                        id = $this.attr('id');

                    $('#' + id + ' a').magnificPopup({
                        type: 'image',
                        closeOnContentClick: true,
                        closeBtnInside: false,
                        fixedContentPos: true,
                        image: {
                            verticalFit: true,
                            titleSrc: 'data-cap'
                        },
                        gallery: {
                            enabled: true
                        }
                    });
                });
            }

            if ($('.penci-post-gallery-container').length) {
                $('.penci-post-gallery-container').each(function () {
                    var $this = $(this),
                        id = $this.attr('id');

                    $('#' + id + ' a').magnificPopup({
                        type: 'image',
                        closeOnContentClick: true,
                        closeBtnInside: false,
                        fixedContentPos: true,
                        image: {
                            verticalFit: true,
                            titleSrc: 'data-cap'
                        },
                        gallery: {
                            enabled: true
                        }
                    });
                });
            }

        } // if magnificPopup exists
    }

    /* Masonry layout
     ----------------------------------------------------------------*/
    ELPENCI.masonry = function () {
        var $masonry_container = $('.penci-masonry, .penci-bgstyle-2 .penci-biggrid-data');
        if ($masonry_container.length) {
            $masonry_container.each(function () {
                var $this = $(this);
                $this.imagesLoaded(function () {
                    // initialize isotope
                    $this.isotope({
                        itemSelector: '.item-masonry',
                        transitionDuration: '.55s',
                        layoutMode: 'masonry'
                    });
                });
            });
        }
    }

    /* Video Background
     ----------------------------------------------------------------*/
    ELPENCI.video_background = function () {
        var $penci_videobg = $('#penci-featured-video-bg');
        if ($penci_videobg.length) {
            $($penci_videobg).each(function () {
                var $this = $(this),
                    $src = $this.data('videosrc'),
                    $startime = $this.data('starttime'),
                    $jarallaxArgs = {
                        videoSrc: $src,
                        videoStartTime: $startime,
                        videoPlayOnlyVisible: false
                    };

                jarallax($this, $jarallaxArgs);
                $('.featured-area').addClass('loaded-wait');
                setTimeout(function () {
                    $('.featured-area').addClass('loaded-animation');
                }, 1500);
            });
        }
    }

    /* Portfolio
     ----------------------------------------------------------------*/
    ELPENCI.portfolio = function () {
        var $penci_portfolio = $('.penci-portfolio');


        if ($().isotope && $penci_portfolio.length) {
            $('.penci-portfolio').each(function () {
                var $this = $(this),
                    unique_id = $(this).attr('id'),
                    DataFilter = null;

                if (typeof (portfolioDataJs) != "undefined" && portfolioDataJs !== null) {
                    for (var e in portfolioDataJs) {

                        if (portfolioDataJs[e].instanceId == unique_id) {
                            var DataFilter = portfolioDataJs[e];
                        }
                    }
                }

                $this.imagesLoaded(function () {
                    $this.isotope({
                        itemSelector: '.portfolio-item',
                        animationEngine: 'best-available',
                        animationOptions: {
                            duration: 250,
                            queue: false
                        }
                    }); // isotope

                    $this.addClass('loaded');

                    $('.portfolio-item .inner-item-portfolio').each(function () {
                        var $this = $(this);
                        $this.one('inview', function (event, isInView, visiblePartX, visiblePartY) {
                            $this.addClass('animated');
                        }); // inview
                    }); // each

                    var location = window.location.hash.toString();
                    if (location.length) {
                        location = location.replace('#', '');
                        location.match(/:/);
                        var Mlocation = location.match(/^([^:]+)/)[1];
                        location = location.replace(Mlocation + ":", "");

                        if (location.length > 1) {

                            var $termActive = $afilter.filter('[data-term="' + location + '"]'),
                                portfolioItem = $this.find('.portfolio-item'),
                                $buttonLoadMore = $this.parent().find('.penci-pagenavi-shortcode');

                            if ($termActive.length) {

                                liFilter.removeClass('active');
                                $termActive.parent().addClass('active');
                                $this.isotope({filter: '.penci-' + location});

                                var dataTerm = $termActive.data("term"),
                                    p = {};

                                DataFilter.currentTerm = dataTerm;
                                $.each(DataFilter.countByTerms, function (t, e) {
                                    p[t] = 0
                                });

                                portfolioItem.each(function (t, e) {
                                    $.each(($(e).data("terms") + "").split(" "), function (t, e) {
                                        p[e]++;
                                    })
                                });

                                var show_button = 'number' == typeof p[dataTerm] && p[dataTerm] == DataFilter.countByTerms[dataTerm];
                                if ($buttonLoadMore.length) {
                                    if (portfolioItem.length !== DataFilter.count && !show_button) {
                                        $buttonLoadMore.show();
                                    } else {
                                        $buttonLoadMore.hide();
                                    }
                                }
                            }
                        }
                    }
                }); // imagesloaded

                // Filter items when filter link is clicked
                var $filter = $this.parent().find('.penci-portfolio-filter'),
                    $afilter = $filter.find('a'),
                    liFilter = $filter.find('li');

                liFilter.on('click', function () {

                    var self = $(this),
                        term = self.find('a').data("term"),
                        selector = self.find("a").attr('data-filter'),
                        $e_dataTerm = $filter.find('a').filter('[data-term="' + term + '"]'),
                        portfolioItem = $this.find('.portfolio-item'),
                        $buttonLoadMore = $this.parent().find('.penci-pagenavi-shortcode'),
                        scrollTop = $(window).scrollTop();

                    liFilter.removeClass('active');
                    self.addClass('active');

                    $this.parent().find('.penci-ajax-more-button').attr('data-cat', term);

                    $this.isotope({filter: selector});

                    if ($e_dataTerm.length) {
                        window.location.hash = "*" == term ? "" : term;

                        $(window).scrollTop(scrollTop);
                    }

                    var p = {};
                    DataFilter.currentTerm = term;
                    $.each(DataFilter.countByTerms, function (t, e) {
                        p[t] = 0
                    });

                    portfolioItem.each(function (t, e) {
                        $.each(($(e).data("terms") + "").split(" "), function (t, e) {
                            p[e]++;
                        })
                    });

                    var show_button = 'number' == typeof p[term] && p[term] == DataFilter.countByTerms[term];
                    if ($buttonLoadMore.length) {
                        if (portfolioItem.length !== DataFilter.count && !show_button) {
                            $buttonLoadMore.show();
                        } else {
                            $buttonLoadMore.hide();
                        }
                    }

                    return false;
                });

                ELPENCI.portfolioLoadMore.loadMore($this, DataFilter);
                ELPENCI.portfolioLoadMore.infinityScroll(DataFilter);

            }); // each .penci-portfolio

        }	// end if isotope & portfolio


        var $btnLoadMore = $('.penci-plf-loadmore');
        if (!$().isotope || !$btnLoadMore.length) {
            return false;
        }
    }

    ELPENCI.portfolioLoadMore = {
        btnLoadMore: $('.penci-plf-loadmore'),
        loadMore: function ($pfl_wapper, DataFilter) {
            var self = this;
            $('body').on('click', '.penci-ajax-more-button', function (event) {
                self.actionLoadMore($(this), $pfl_wapper, DataFilter);
            });
        },
        infinityScroll: function (DataFilter) {
            var self = this,
                $handle = $('.penci-plf-loadmore'),
                $button_load = $handle.find('.penci-ajax-more-button');

            if ($handle.hasClass('penci-infinite-scroll')) {
                $(window).on('scroll', function () {

                    var hT = $button_load.offset().top,
                        hH = $button_load.outerHeight(),
                        wH = $(window).height(),
                        wS = $(this).scrollTop();

                    if ((wS > (hT + hH - wH)) && $button_load.length) {
                        var $pfl_wapper = $button_load.closest('.penci-portfolio');
                        self.actionLoadMore($button_load, $pfl_wapper, DataFilter);
                    }
                }).trigger('scroll');
            }
        },
        actionLoadMore: function ($button_load, $pfl_wapper, DataFilter) {
            if ($button_load.hasClass('loading-portfolios')) {
                return false;
            }

            $button_load.addClass('loading-portfolios');

            var mesNoMore = $button_load.data('mes_no_more'),
                mes = $button_load.data('mes');

            DataFilter.pflShowIds = [];

            $button_load.closest('.wrapper-penci-portfolio').find('.portfolio-item').each(function (t, e) {
                DataFilter.pflShowIds.push($(e).data('pflid'));
            });

            var data = {
                action: 'penci_pfl_more_post_ajax',
                datafilter: DataFilter,
                nonce: ajax_var_more.nonce
            };
            $.post(ajax_var_more.url, data, function (response) {
                if (!response.data.items) {
                    $button_load.find('.ajax-more-text').html(mesNoMore);
                    $button_load.removeClass('loading-portfolios');

                    $button_load.closest('.wrapper-penci-portfolio').find('.penci-portfolio-filter li.active').addClass('loadmore-finish');

                    setTimeout(function () {
                        $button_load.parent().parent().hide();
                        $button_load.find('.ajax-more-text').html(mes);
                    }, 1200);

                    return false;
                }

                var $wrap_content = $button_load.closest('.wrapper-penci-portfolio').find('.penci-portfolio'),
                    $data = $(response.data.items);

                $wrap_content.find('.inner-portfolio-posts').append($data);
                $wrap_content.isotope('appended', $data).imagesLoaded(function () {
                    $wrap_content.isotope('layout');
                });

                /*$('.penci-lazy').Lazy({
                    effect: 'fadeIn',
                    effectTime: 300,
                    scrollDirection: 'both'
                });*/
                //lazySizes.init();

                $(".container").fitVids();

                $('a[data-rel^="penci-gallery-image-content"]').magnificPopup({
                    type: 'image',
                    closeOnContentClick: true,
                    closeBtnInside: false,
                    fixedContentPos: true,
                    image: {
                        verticalFit: true
                    },
                    gallery: {
                        enabled: true
                    },
                    zoom: {
                        enabled: true,
                        duration: 300
                    }
                });

                $wrap_content.addClass('loaded');

                $('.portfolio-item .inner-item-portfolio').each(function () {
                    var $this = $(this);
                    $this.one('inview', function (event, isInView, visiblePartX, visiblePartY) {
                        $this.addClass('animated');
                    }); // inview
                }); // each

                $button_load.removeClass('loading-portfolios');
            });

            $.ajax({
                type: 'POST',
                dataType: 'html',
                url: ajax_var_more.url,
                data: 'datafilter=' + DataFilter + '&action=penci_pfl_more_post_ajax&nonce=' + ajax_var_more.nonce,
                success: function (data) {

                },
                error: function (jqXHR, textStatus, errorThrown) {
                }

            });

        }
    }

    /* Gallery
     ----------------------------------------------------------------*/
    ELPENCI.gallery = function () {
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
                var $this = $(this).children();
                if ($this.attr('data-cap') && !$this.hasClass('added-caption')) {
                    var $title = $this.attr('data-cap');
                    if ($title !== 'undefined') {
                        $this.children().append('<div class="caption">' + $title + '</div>');
                        $this.addClass('added-caption');
                    }

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
                            $this.children().addClass('animated');
                        }); // inview
                    }); // each
                });
            });
        }
    },

        /* Jarallax
         ----------------------------------------------------------------*/
        ELPENCI.Jarallax = function () {
            if (!$.fn.jarallax || !$('.penci-jarallax').length) {
                return false;
            }
            $('.penci-jarallax').each(function () {
                var $this = $(this),
                    $jarallaxArgs = {};

                $this.imagesLoaded({background: true}, function () {
                    jarallax($this, $jarallaxArgs);
                });

            });
        },

        /* Related Popup
         ----------------------------------------------------------------*/
        ELPENCI.RelatedPopup = function () {
            if ($('.penci-rlt-popup').length) {
                var rltpopup = $('.penci-rlt-popup'),
                    rltclose = $('.penci-rlt-popup .penci-close-rltpopup'),
                    rltlazy = rltpopup.find('.penci-lazy');

                $('body').on('inview', '.penci-flag-rlt-popup', function (event, isInView, visiblePartX, visiblePartY) {
                    if (!rltpopup.hasClass('rltpopup-notshow-again') && isInView) {
                        rltpopup.addClass('rltpopup-show-up');
                        rltclose.on("click", function (e) {
                            e.preventDefault();
                            rltpopup.removeClass('rltpopup-show-up').addClass('rltpopup-notshow-again');
                        });
                        /*rltlazy.Lazy({
                            effect: 'fadeIn',
                            effectTime: 300,
                            scrollDirection: 'both'
                        });*/
                        //lazySizes.init();
                    }
                });
                rltclose.on("click", function (e) {
                    e.preventDefault();
                    rltpopup.removeClass('rltpopup-show-up').addClass('rltpopup-notshow-again');
                });
            }
        },

        /* Share Expand
    ---------------------------------------------------------------*/
        ELPENCI.shareexpand = function () {
            var tag = $('.tags-share-box'),
                tago = tag.offset(),
                tagw = tag.outerWidth(),
                btnw = tag.find('.post-share-expand').outerWidth();

            tag.find('.new-ver-share').each(function (index) {
                var out = tagw + tago.left - btnw * 2,
                    itemw = $(this).outerWidth(),
                    itemo = $(this).offset();

                if (itemo.left + itemw < out) {
                    $(this).addClass('show');
                } else {
                    $(this).addClass('auto-hidden');
                    tag.find('.post-share-expand').addClass('showing');
                }
            });

            $('.post-share-item.post-share-expand').on('click', function (e) {
                e.preventDefault();
                var parent = $(this).closest('.post-share');
                parent.find('.auto-hidden').toggleClass('active');
                parent.toggleClass('showing-hidden');
            });

            tag.css('opacity', '1');
        },

        ELPENCI.extraFunction = {
            init: function () {
                this.counterUp();
                this.progressBar();
                this.login();
                this.register();
            },
            progressBar: function () {
                if ($('.penci-review-process').length) {
                    $('.penci-review-process').each(function () {
                        var $this = $(this),
                            $bar = $this.children(),
                            $bar_w = $bar.data('width') * 10;
                        $this.one('inview', function (event, isInView, visiblePartX, visiblePartY) {
                            $bar.animate({width: $bar_w + '%'}, 1000);
                        }); // bind inview
                    }); // each
                }

                if ($.fn.easyPieChart && $('.penci-piechart').length) {
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
            },
            counterUp: function () {
                var $counterup = $('.penci-counterup-number');

                if (!$.fn.counterUp || !$counterup.length) {
                    return false;
                }

                $counterup.each(function () {
                    var $this = $(this);

                    $this.one('inview', function (event, isInView, visiblePartX, visiblePartY) {
                        setTimeout(function () {
                            $({countNum: $this.text()}).animate(
                                {
                                    countNum: $this.attr('data-count')
                                },

                                {
                                    duration: 2000,
                                    easing: 'linear',
                                    step: function () {
                                        $this.text(Math.floor(this.countNum));
                                    },
                                    complete: function () {
                                        $this.text(this.countNum);
                                    }
                                }
                            );
                        }, $this.attr('data-delay'));

                    }); // bind inview
                });
            },
            login: function () {
                var $body = $('body'),
                    $loginform = $('.penci-loginform'),
                    $loginContainer = $loginform.parent('.penci-login-wrap');

                if ($loginform.length) {
                    $body.on('click', '.penci-user-register', function (e) {
                        e.preventDefault();

                        var $this = $(this),
                            $parent = $this.closest('.penci-login-register');

                        $parent.find('.penci-login-wrap').addClass('hidden');
                        $parent.find('.penci-register-wrap').removeClass('hidden');
                    });

                    $('#penci-user-login,#penci-user-pass').on('focus', function () {
                        $(this).removeClass('invalid');
                    });

                    $('.penci-loginform').each(function () {
                        $(this).on('submit', function (e) {
                            var $this = $(this),
                                $loginContainer = $this.parent('.penci-login-wrap'),
                                inputUsername = $this.find('#penci-user-login'),
                                inputPass = $this.find('#penci-user-pass'),
                                valUsername = inputUsername.val(),
                                valPass = inputPass.val(),
                                nonce = $this.find('.penci_form_nonce').val(),
                                gcapcha = $this.find('.g-recaptcha-response');
                            if (gcapcha.length) {
                                var captcha = gcapcha.val();
                            } else {
                                var captcha = 'noexists';
                            }

                            if (inputUsername.length > 0 && valUsername == '') {
                                inputUsername.addClass('invalid');
                                e.preventDefault();
                            }

                            if (inputPass.length > 0 && valPass == '') {
                                inputPass.addClass('invalid');
                                e.preventDefault();
                            }

                            if (valUsername == '' || valPass == '') {
                                return false;
                            }

                            $loginContainer.parent().addClass('ajax-loading');
                            $loginContainer.find('.message').slideDown().remove();

                            var data = {
                                action: 'penci_login_ajax',
                                username: valUsername,
                                password: valPass,
                                captcha: captcha,
                                security: nonce,
                                remember: $loginContainer.find('#rememberme').val()
                            };

                            $.post(ajax_var_more.url, data, function (response) {
                                $loginContainer.parent().removeClass('ajax-loading');
                                $loginContainer.append(response.data);
                                if (!response.success) {
                                    return;
                                }

                                window.location = window.location;
                            });

                            e.preventDefault();
                            return false;
                        });
                    });
                }
            },
            register: function () {
                var $body = $('body'),
                    $registerform = $('#penci-registration-form'),
                    $registerContainer = $registerform.closest('.penci-register-wrap');

                if (!$registerform.length) {
                    return false;
                }

                $body.on('click', '.penci-user-login-here', function (e) {
                    e.preventDefault();

                    var $this = $(this),
                        $parent = $this.closest('.penci-login-register');

                    $parent.find('.penci-login-wrap').removeClass('hidden');
                    $parent.find('.penci-register-wrap').addClass('hidden');

                    return false;
                });

                var $allInput = $('.penci_user_name,.penci_user_email,.penci_user_pass,.penci_user_pass_confirm');
                $allInput.on('focus', function () {
                    $(this).removeClass('invalid');
                });


                $('.penci-registration-form').each(function () {
                    $(this).on('submit', function (e) {
                        e.preventDefault();

                        var $this = $(this),
                            $registerContainer = $this.closest('.penci-register-wrap'),
                            inputUsername = $this.find('.penci_user_name'),
                            inputEmail = $this.find('.penci_user_email'),
                            $inputPass = $this.find('.penci_user_pass'),
                            $inputPassConfirm = $this.find('.penci_user_pass_confirm'),
                            valUsername = inputUsername.val(),
                            valEmail = inputEmail.val(),
                            valPass = $inputPass.val(),
                            valPassConfirm = $inputPassConfirm.val(),
                            nonce = $this.find('.penci_form_nonce').val(),
                            gcapcha = $this.find('.g-recaptcha-response');
                        if (gcapcha.length) {
                            var captcha = gcapcha.val();
                        } else {
                            var captcha = 'noexists';
                        }

                        $allInput.removeClass('invalid');

                        if (inputUsername.length > 0 && valUsername == '') {
                            inputUsername.addClass('invalid');
                            event.preventDefault();
                        }

                        if (inputEmail.length > 0 && valEmail == '') {
                            inputEmail.addClass('invalid');
                            event.preventDefault();
                        }

                        if ($inputPass.length > 0 && valPass == '') {
                            $inputPass.addClass('invalid');
                            event.preventDefault();
                        }

                        if ($inputPassConfirm.length > 0 && valPassConfirm == '') {
                            $inputPassConfirm.addClass('invalid');
                            event.preventDefault();
                        }
                        if (valUsername == '' || valEmail == '' || valPass == '' || valPassConfirm == '') {
                            return false;
                        }

                        $registerContainer.find('.message').slideDown().remove();

                        // Password does not match the confirm password
                        if (valPassConfirm !== valPass) {
                            $inputPass.addClass('invalid');
                            $inputPassConfirm.addClass('invalid');
                            $registerContainer.append(ajax_var_more.errorPass);
                            event.preventDefault();

                            return false;
                        }
                        $registerContainer.parent().addClass('ajax-loading');


                        var data = {
                            action: 'penci_register_ajax',
                            fistName: $this.find('.penci_first_name').val(),
                            lastName: $this.find('.penci_last_name').val(),
                            username: valUsername,
                            password: valPass,
                            confirmPass: valPassConfirm,
                            email: valEmail,
                            security: nonce,
                            captcha: captcha
                        };

                        $.post(ajax_var_more.url, data, function (response) {
                            $registerContainer.parent().removeClass('ajax-loading');
                            $registerContainer.append(response.data);
                            if (!response.success) {
                                return;
                            }
                            window.location = window.location;
                        });

                        event.preventDefault();
                        return false;
                    });
                });
            },
            map: function () {
                if (!$('.penci-google-map').length) {
                    return false;
                }
                $('.penci-google-map').each(function () {

                    var map = $(this),
                        Option = map.data("map_options"),
                        mapID = map.attr('id');


                    var mapTypePre = google.maps.MapTypeId.ROADMAP;
                    switch (Option.map_type) {
                        case"satellite":
                            mapTypePre = google.maps.MapTypeId.SATELLITE;
                            break;
                        case"hybrid":
                            mapTypePre = google.maps.MapTypeId.HYBRID;
                            break;
                        case"terrain":
                            mapTypePre = google.maps.MapTypeId.TERRAIN
                    }
                    var latLng = new google.maps.LatLng(-34.397, 150.644);
                    var map = new google.maps.Map(document.getElementById(mapID), {
                        zoom: parseInt(Option.map_zoom),
                        center: latLng,
                        mapTypeId: mapTypePre,
                        panControl: Option.map_pan,
                        zoomControl: Option.map_is_zoom,
                        mapTypeControl: true,
                        scaleControl: Option.map_scale,
                        streetViewControl: Option.map_street_view,
                        rotateControl: Option.map_rotate,
                        overviewMapControl: Option.map_overview,
                        scrollwheel: Option.map_scrollwheel
                    });
                    var marker = new google.maps.Marker({
                        position: latLng,
                        map: map,
                        title: Option.marker_title,
                        icon: Option.marker_img
                    });

                    if (Option.info_window) {
                        var infoWindow = new google.maps.InfoWindow({
                            content: Option.info_window
                        });

                        google.maps.event.addListener(marker, "click", function () {
                            infoWindow.open(map, marker);
                        });
                    }

                    if ('coordinates' == Option.map_using && Option.latitude && Option.longtitude) {
                        latLng = new google.maps.LatLng(Option.latitude, Option.longtitude);
                        map.setCenter(latLng);
                        marker.setPosition(latLng);
                    } else {
                        var geocoder = new google.maps.Geocoder();
                        geocoder.geocode({
                            address: Option.address
                        }, function (results) {
                            var loc = results[0].geometry.location;
                            latLng = new google.maps.LatLng(loc.lat(), loc.lng());
                            map.setCenter(latLng);
                            marker.setPosition(latLng);
                        });
                    }
                });
            },
        },

        ELPENCI.VideosList = {
            // Init the module
            init: function () {
                ELPENCI.VideosList.play();
            },
            play: function () {
                if (!$('.penci-video_playlist').length) {
                    return false;
                }
                $('.penci-video_playlist').each(function (idx, item) {
                    var $blockVideo = $(this),
                        $VideoF = $blockVideo.find('.penci-video-frame');

                    var $height = $blockVideo.find('.penci-video-nav').height(),
                        $heightTitle = $blockVideo.find('.penci-video-nav .penci-playlist-title').height()

                    $blockVideo.find('.penci-video-playlist-nav').css('height', $height - $heightTitle);
                    // Init
                    $VideoF.video();
                    ELPENCI.VideosList.updateStatus($blockVideo);

                    // Show First video and remove the loader icon
                    $VideoF.addVideoEvent('ready', function () {
                        $VideoF.css('visibility', 'visible').fadeIn();
                        $blockVideo.find('.loader-overlay').remove();
                    });
                    // Play videos
                    $blockVideo.on('click', '.penci-video-playlist-item', function () {
                        var $thisVideo = $(this),
                            frameID = $thisVideo.data('name'),
                            $thisFrame = $('#' + frameID),
                            videoSrc = $thisVideo.data('src'),
                            videoNum = $thisVideo.find('.penci-video-number').text();

                        if ($thisVideo.hasClass('is-playing')) {
                            $thisFrame.pauseVideo();
                            return;
                        }

                        // Update the number of the playing video in the title section
                        $blockVideo.find('.penci-video-playing').text(videoNum);

                        // Pause all Videos
                        $blockVideo.find('.penci-video-frame').each(function () {
                            $(this).pauseVideo().hide();
                        })

                        // If the iframe not loaded before, add it
                        if (!$thisFrame.length) {
                            // Add the loader icon
                            $blockVideo.find('.fluid-width-video-wrapper').prepend('');

                            $blockVideo.find('.fluid-width-video-wrapper').append('<iframe class="penci-video-frame" id="' + frameID + '" src="' + videoSrc + '" frameborder="0" width="100%"" height="434" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>');
                            $thisFrame = $('#' + frameID);

                            $thisFrame.video(); // reinit

                            $thisFrame.addVideoEvent('ready', function (e, $thisFrame, video_type) {
                                $thisFrame.playVideo();
                                $blockVideo.find('.loader-overlay').remove();
                            });
                        } else {
                            $thisFrame.playVideo();
                        }

                        $thisFrame.css('visibility', 'visible').fadeIn();

                        ELPENCI.VideosList.updateStatus($blockVideo);

                    });
                });
            },
            updateStatus: function ($blockVideo) {
                $blockVideo.find('.penci-video-frame').each(function () {
                    var $this = $(this),
                        $videoItem = $("[data-name='" + $this.attr('id') + "']");

                    $this.addVideoEvent('play', function () {
                        $videoItem.removeClass('is-paused').addClass('is-playing');
                    });

                    $this.addVideoEvent('pause', function () {
                        $videoItem.removeClass('is-playing').addClass('is-paused');
                    });

                    $this.addVideoEvent('finish', function () {
                        $videoItem.removeClass('is-paused is-playing');
                    });
                });
            }
        };


    /* Init functions
     ---------------------------------------------------------------*/
    $(document).ready(function () {
        ELPENCI.general();
        ELPENCI.cookie();
        $('body').trigger('penci_swiper_sliders');
        ELPENCI.fitvids();
        ELPENCI.sticky_sidebar();
        ELPENCI.mega_menu();
        ELPENCI.mobile_menu();
        ELPENCI.toggleMenuHumburger();
        ELPENCI.lightbox();
        ELPENCI.masonry();
        ELPENCI.video_background();
        ELPENCI.portfolio();
        ELPENCI.gallery();
        ELPENCI.Jarallax();
        ELPENCI.RelatedPopup();
        ELPENCI.shareexpand();
        ELPENCI.extraFunction.init();
        ELPENCI.VideosList.init();
        $(window).on('resize', function () {
            ELPENCI.sticky_sidebar();
        });
    });

    // Add space for Elementor Menu Anchor link
    $(window).on('elementor/frontend/init', function () {
        if (window.elementorFrontend) {

            

            elementorFrontend.hooks.addAction('frontend/element_ready/penci-custom-sliders.default', function ($scope) {
                ELPENCI.Jarallax();
            });

            elementorFrontend.hooks.addAction('frontend/element_ready/penci-single-share.default', function ($scope) {
                ELPENCI.shareexpand();
            });

            elementorFrontend.hooks.addAction('frontend/element_ready/penci-portfolio.default', function ($scope) {
                ELPENCI.portfolio();
            });
            
            elementorFrontend.hooks.addAction('frontend/element_ready/penci-image-gallery.default', function ($scope) {
                
                ELPENCI.masonry();
                ELPENCI.gallery();
                $('body').trigger('penci_swiper_sliders');
                var $masonry_gallery = $('.penci-post-gallery-container.masonry');
                if ($().isotope && $masonry_gallery.length) {
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
                                    $this.children().addClass('animated');
                                }); // inview
                            }); // each
                        });
                    });
                }
            });
            
            elementorFrontend.hooks.addAction('frontend/element_ready/penci-big-grid.default', function ($scope) {
                
                ELPENCI.masonry();
                $('body').trigger('penci-block-heading');
            });
            elementorFrontend.hooks.addAction('frontend/element_ready/penci-small-list.default', function ($scope) {
                
                $('body').trigger('penci_swiper_sliders');
                $('body').trigger('penci-block-heading')
                    .trigger('penci-small-list-loaded');
            });
            elementorFrontend.hooks.addAction('frontend/element_ready/penci-product-list.default', function ($scope) {
                
                $('body').trigger('penci_swiper_sliders');
            });
            
            elementorFrontend.hooks.addAction('frontend/element_ready/penci-popular-posts.default', function ($scope) {
                
                $('body').trigger('penci_swiper_sliders');
                ELPENCI.extraFunction.init();
            });

            elementorFrontend.hooks.addAction('frontend/element_ready/penci-featured-cat.default', function ($scope) {
                
                $('body').trigger('penci_swiper_sliders');
                ELPENCI.extraFunction.init();
                $('body').trigger('penci-block-heading');
            });

            elementorFrontend.hooks.addAction('frontend/element_ready/penci-latest-posts.default', function ($scope) {
                
                $('body').trigger('penci_swiper_sliders');
                ELPENCI.masonry();
                ELPENCI.extraFunction.init();
                $('body').trigger('penci-block-heading');
            });

            elementorFrontend.hooks.addAction('frontend/element_ready/penci-recent-posts.default', function ($scope) {
                
                ELPENCI.extraFunction.init();
            });
            elementorFrontend.hooks.addAction('frontend/element_ready/penci-portfolio.default', function ($scope) {
                
                ELPENCI.portfolio();
                ELPENCI.masonry();

                var $penci_portfolio = $('.penci-portfolio');
                if ($().isotope && $penci_portfolio.length) {
                    $('.penci-portfolio').each(function () {
                        var $this = $(this);
                        $this.imagesLoaded(function () {
                            $this.isotope({
                                itemSelector: '.portfolio-item',
                                animationEngine: 'best-available',
                                animationOptions: {
                                    duration: 250,
                                    queue: false
                                }
                            }); // isotope

                            $this.addClass('loaded');

                            $('.portfolio-item .inner-item-portfolio').each(function () {
                                var $this = $(this);
                                $this.one('inview', function (event, isInView, visiblePartX, visiblePartY) {
                                    $this.addClass('animated');
                                }); // inview
                            });
                        });
                    });  // each
                }
            });

            elementorFrontend.hooks.addAction('frontend/element_ready/penci-facebook-page.default', function ($scope) {
                var faceIsLoading = "", faceisLoaded = "";
                faceIsLoading || faceisLoaded || (faceIsLoading = !0, jQuery.ajax({
                    url: "https://connect.facebook.net/" + ajax_var_more.facebookLang + "/sdk.js",
                    dataType: "script",
                    cache: !0,
                    success: function () {
                        FB.init({
                            appId: "",
                            version: "v2.10",
                            xfbml: !1
                        }), faceisLoaded = !0, faceIsLoading = !1, jQuery(document).trigger("fb:sdk:loaded")
                    }
                }));
                var parse = function () {
                    $scope.find(".elementor-widget-container div").attr("data-width", $scope.width() + "px"), FB.XFBML.parse($scope[0])
                };
                faceisLoaded ? parse() : jQuery(document).on("fb:sdk:loaded", parse);
            });

            elementorFrontend.hooks.addAction('frontend/element_ready/penci-featured-sliders.default', function ($scope) {
                $('body').trigger('el_featured_slider');
            });
            elementorFrontend.hooks.addAction('frontend/element_ready/penci-custom-sliders.default', function ($scope) {
                $('body').trigger('penci_swiper_sliders');
            });
            elementorFrontend.hooks.addAction('frontend/element_ready/penci-instagram.default', function ($scope) {
               
                $('body').trigger('penci_swiper_sliders');
            });
            elementorFrontend.hooks.addAction('frontend/element_ready/penci-posts-slider.default', function ($scope) {
                
                $('body').trigger('penci_swiper_sliders');
            });
            
            elementorFrontend.hooks.addAction('frontend/element_ready/penci-custom-carousel.default', function ($scope) {
                
                $('body').trigger('penci_swiper_sliders');
            });

            elementorFrontend.hooks.addAction('frontend/element_ready/penci-counter-up.default', function ($scope) {
                ELPENCI.extraFunction.counterUp();
            });

            elementorFrontend.hooks.addAction('frontend/element_ready/penci-map.default', function ($scope) {
                ELPENCI.extraFunction.map();
            });
            elementorFrontend.hooks.addAction('frontend/element_ready/penci-news-ticker.default', function ($scope) {
                $('body').trigger('penci_swiper_sliders');
            });
            elementorFrontend.hooks.addAction('frontend/element_ready/penci-latest-tweets.default', function ($scope) {
                $('body').trigger('penci_swiper_sliders');
            });
            elementorFrontend.hooks.addAction('frontend/element_ready/penci-testimonials.default', function ($scope) {
                $('body').trigger('penci_swiper_sliders');
            });
            elementorFrontend.hooks.addAction('frontend/element_ready/penci-web-story.default', function ($scope) {
                $('body').trigger('penci_swiper_sliders');
            });
            elementorFrontend.hooks.addAction('frontend/element_ready/penci-single-related-posts.default', function ($scope) {
                $('body').trigger('penci_swiper_sliders');
            });
            elementorFrontend.hooks.addAction('frontend/element_ready/penci-media-carousel.default', function ($scope) {
                ELPENCI.lightbox();
                $('body').trigger('penci_swiper_sliders');
            });

            elementorFrontend.hooks.addAction('frontend/element_ready/penci-progress-bar.default', function ($scope) {
                ELPENCI.extraFunction.progressBar();
            });

            elementorFrontend.hooks.addAction('frontend/element_ready/penci-block-heading.default', function ($scope) {
                $('body').trigger('penci-block-heading');
            });

            elementorFrontend.hooks.addAction('frontend/element_ready/penci-image-gallery.default', function ($scope) {
                $('body').trigger('penci-image-gallery');
            });

            elementorFrontend.hooks.addAction('frontend/element_ready/penci-fullwidth-hero-overlay.default', function ($scope) {
                $('body').trigger('penci_swiper_sliders');
                ELPENCI.extraFunction.init();
            });
        }
    });

})(jQuery);	// EOF
