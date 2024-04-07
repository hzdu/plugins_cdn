(function ($) {

    'use strict';

    let isTouch = window.gemSettings.isTouch,
        isMobile = $(window).width() < 768 && /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? true : false,
        isTabletPortrait = $(window).width() === 768 && isTouch && window.matchMedia("(orientation: portrait)") ? true : false,
        isSticky = $('.single-product-content').attr('data-sticky') === 'yes' ? true : false,
        $wrapper = $('.product-gallery__grid'),
        $galleryZoom = $('.product-gallery-image.init-zoom', $wrapper),
        $galleryFancy = $('.product-gallery-image.init-fancy', $wrapper),
        $galleryFancyLink = $('.fancy-product-gallery', $galleryFancy),
        $galleryItemVideo = $('.product-gallery__grid-item.video-block', $wrapper),
        isZoom = $wrapper.attr("data-zoom") === '1',
        isFancy = $wrapper.attr("data-fancy") === '1',
        isYoutube = $galleryItemVideo.attr("data-video-type") === 'youtube',
        isVimeo = $galleryItemVideo.attr("data-video-type") === 'vimeo',
        isSelfVideo = $galleryItemVideo.attr("data-video-type") === 'self',
        isVideoAutoplay = $galleryItemVideo.attr("data-video-autoplay") === '1',
        isVideoPoster = $galleryItemVideo.attr("data-video-poster") !== '' || $galleryItemVideo.attr("data-video-poster") !== 0,

        productGalleryGridScripts = {
            // Initialization the functions
            init: () => {
                productGalleryGridScripts.default();
                productGalleryGridScripts.zoomMagnifier();
                productGalleryGridScripts.initApiVideos();
                productGalleryGridScripts.elementsColor();
            },

            // Product gallery grid default actions
            default: () => {
                let $topElements = $('.product-gallery__elements');

                setTimeout(() => {
                    $topElements.css('opacity', 1);
                    $('.product-grid-gallery-skeleton.skeleton--video').remove();
                });

                if (isTouch || isMobile) {
                    $('.product-gallery-fancy', $galleryFancy).addClass('show');
                }
            },

            // Product gallery grid zoom
            zoomMagnifier: () => {
                if (isTouch || isMobile || !isZoom) {
                    $galleryZoom.trigger('zoom.destroy');

                    $('.img-responsive', $galleryZoom).on('click', function(e) {
                        e.preventDefault();
                        $(this).parent('a.fancy-product-gallery').trigger('click');
                    });
                } else {
                    $galleryZoom.zoom({
                        duration: 300,
                        touch: false,
                        callback: function(){
                            $(this).on('click', function(e) {
                                e.preventDefault();
                                $(this).siblings('a.fancy-product-gallery').trigger('click');
                            });
                        }
                    });
                }

                //Destroy if naturalWidth < clientWidth
                let $wrap = $('.product-gallery-image');
                let wrapWidth = $wrap.width();
                $('img', $wrap).each(function (index, el) {
                    let naturalWidth = $(el).attr('width');

                    if (naturalWidth < wrapWidth) {
                        $galleryZoom.trigger('zoom.destroy');
                        $galleryZoom.removeClass('init-zoom');
                    }
                });
            },

            // Api videos init
            initApiVideos: () => {
                let stageHeight = $('.product-gallery-image', $wrapper)[0].clientHeight;
                stageHeight = stageHeight !== 0 ? stageHeight : '100%';

                let onYouTubeIframeAPIReady = () => {
                    let youtubeWrap = document.getElementById('productYoutubeVideo'),
                        youtubeVideoId = $('#productYoutubeVideo').attr('data-yt-id'),
                        youtubePlayer,
                        youtubePlayerState;

                    if (youtubeVideoId !== undefined && youtubeVideoId !== null) {
                        window.YT.ready(function () {
                            youtubePlayer = new YT.Player('productYoutubeVideo', {
                                videoId: youtubeVideoId,
                                height: stageHeight,
                                width: '100%',
                                playerVars: {
                                    'controls': 2,
                                    'loop': 1,
                                    'showinfo': 0,
                                    'autohide': 1,
                                    'iv_load_policy': 3,
                                    'rel': 0,
                                    'disablekb': 1,
                                    'modestbranding': 1,
                                    'mute': 1
                                },
                                events: {
                                    'onStateChange': function () {
                                        youtubePlayerState = youtubePlayer.getPlayerState();

                                        if (youtubePlayerState === -1) {
                                            $galleryItemVideo.removeClass('overlay');
                                        } else {
                                            $galleryItemVideo.addClass('overlay');
                                        }
                                    }
                                }
                            });
                        });
                    } else {
                        return false;
                    }

                    $(youtubeWrap).parents('.product-gallery__grid-item.video-block').css('height', stageHeight);

                    setTimeout(() => {
                        if (youtubeWrap.previousElementSibling && youtubeWrap.previousElementSibling.classList.contains('preloader')) {
                            youtubeWrap.previousElementSibling.remove();
                        }
                    });
                };

                let onVimeoIframeAPIReady = () => {
                    let vimeoWrap = document.getElementById('productVimeoVideo'),
                        vimeoVideoId = $('#productVimeoVideo').attr('data-vm-id'),
                        vimeoPlayer;

                    if (vimeoVideoId !== undefined && vimeoVideoId !== null) {
                        let options = {
                            id: vimeoVideoId,
                            height: stageHeight,
                            width: '100%',
                            loop: true,
                            muted: 1
                        };
                        vimeoPlayer = new Vimeo.Player('productVimeoVideo', options);
                        $galleryItemVideo.addClass('overlay');
                    } else {
                        return false;
                    }

                    $(vimeoWrap).css('height', stageHeight);
                    $(vimeoWrap).parents('.product-gallery__grid-item.video-block').css('height', stageHeight);

                    setTimeout(() => {
                        if (vimeoWrap.previousElementSibling && vimeoWrap.previousElementSibling.classList.contains('preloader')) {
                            vimeoWrap.previousElementSibling.remove();
                        }
                    });
                };

                let onSelfVideoAPIReady = () => {
                    let selfPlayer = document.getElementById('productSelfVideo');

                    if (selfPlayer !== undefined && selfPlayer !== null) {
                        selfPlayer.disablePictureInPicture = true;
                        selfPlayer.controls = isVideoAutoplay ? false : true;
                    }

                    if (isVideoAutoplay) {
                        $(selfPlayer).css('height', 'auto');
                        $(selfPlayer).parents('.product-gallery__grid-item.video-block').css('height', stageHeight);
                    } else if (isVideoPoster) {
                        $(selfPlayer).css('height', 'auto');
                    } else {
                        $(selfPlayer).css('height', stageHeight);
                    }

                    setTimeout(() => {
                        if (selfPlayer.previousElementSibling && selfPlayer.previousElementSibling.classList.contains('preloader')) {
                            selfPlayer.previousElementSibling.remove();
                        }
                    });
                };

                if (isYoutube) {
                    $.getScript("https://www.youtube.com/iframe_api", function () {
                        onYouTubeIframeAPIReady();
                    });
                }

                if (isVimeo) {
                    $.getScript("https://player.vimeo.com/api/player.js", function () {
                        onVimeoIframeAPIReady();
                    });
                }

                if (isSelfVideo) {
                    onSelfVideoAPIReady();
                }
            },

            // Changed elements color
            elementsColor: () => {
                if (isFancy && !isMobile && !isTouch) {
                    let svgColor = '191822FF',
                        svgBorder = 0.3;

                    if ($wrapper.attr('data-color') !== '') {
                        svgColor = $wrapper.attr('data-color').slice(1);
                        svgBorder = 0;
                    }

                    if ($galleryZoom.hasClass('init-zoom')) {
                        $.each($galleryFancy, function (i) {
                            $galleryFancy[i].style.cursor = 'url("data:image/svg+xml,%3Csvg version=\'1.1\' width=\'20\' height=\'20\' xmlns=\'http://www.w3.org/2000/svg\' xmlns:xlink=\'http://www.w3.org/1999/xlink\' x=\'0px\' y=\'0px\' viewBox=\'0 0 19 19\' style=\'enable-background:new 0 0 19 19;\' xml:space=\'preserve\'%3E%3Cstyle type=\'text/css\'%3E .st0%7Bopacity:' + svgBorder + ';fill:%23FFFFFF;%7D .st1%7Bfill:%23' + svgColor + ';%7D%0A%3C/style%3E%3Cpath class=\'st0\' d=\'M19,19h-8v-3h2.9l-4-4L12,9.9l4,4V11h3V19z M12,18h6v-6h-1v4.3l-5-5L11.3,12l5,5H12V18z M8,19H0v-8h3v2.9l4-4 L9.1,12l-4,4H8V19z M1,18h6v-1H2.7l5-5L7,11.3l-5,5V12H1V18z M7,9.1l-4-4V8H0V0h8v3H5.1l4,4L7,9.1z M2,2.7l5,5L7.7,7l-5-5H7V1H1v6h1 V2.7z M12,9.1L9.9,7l4-4H11V0h8v8h-3V5.1L12,9.1z M11.3,7L12,7.7l5-5V7h1V1h-6v1h4.3L11.3,7z\'/%3E%3Cpath class=\'st1\' d=\'M2.5,15.1v-3.6h-2v7h7v-2H3.9L8.4,12L7,10.6L2.5,15.1z M3.9,2.5h3.6v-2h-7v7h2V3.9L7,8.4L8.4,7L3.9,2.5z M10.6,12l4.5,4.5h-3.6v2h7v-7h-2v3.6L12,10.6L10.6,12z M12,8.4l4.5-4.5v3.6h2v-7h-7v2h3.6L10.6,7L12,8.4z\'/%3E%3C/svg%3E"), auto';
                        });
                    } else {
                        $.each($galleryFancyLink, function (i) {
                            $galleryFancyLink[i].style.cursor = 'url("data:image/svg+xml,%3Csvg version=\'1.1\' width=\'20\' height=\'20\' xmlns=\'http://www.w3.org/2000/svg\' xmlns:xlink=\'http://www.w3.org/1999/xlink\' x=\'0px\' y=\'0px\' viewBox=\'0 0 19 19\' style=\'enable-background:new 0 0 19 19;\' xml:space=\'preserve\'%3E%3Cstyle type=\'text/css\'%3E .st0%7Bopacity:' + svgBorder + ';fill:%23FFFFFF;%7D .st1%7Bfill:%23' + svgColor + ';%7D%0A%3C/style%3E%3Cpath class=\'st0\' d=\'M19,19h-8v-3h2.9l-4-4L12,9.9l4,4V11h3V19z M12,18h6v-6h-1v4.3l-5-5L11.3,12l5,5H12V18z M8,19H0v-8h3v2.9l4-4 L9.1,12l-4,4H8V19z M1,18h6v-1H2.7l5-5L7,11.3l-5,5V12H1V18z M7,9.1l-4-4V8H0V0h8v3H5.1l4,4L7,9.1z M2,2.7l5,5L7.7,7l-5-5H7V1H1v6h1 V2.7z M12,9.1L9.9,7l4-4H11V0h8v8h-3V5.1L12,9.1z M11.3,7L12,7.7l5-5V7h1V1h-6v1h4.3L11.3,7z\'/%3E%3Cpath class=\'st1\' d=\'M2.5,15.1v-3.6h-2v7h7v-2H3.9L8.4,12L7,10.6L2.5,15.1z M3.9,2.5h3.6v-2h-7v7h2V3.9L7,8.4L8.4,7L3.9,2.5z M10.6,12l4.5,4.5h-3.6v2h7v-7h-2v3.6L12,10.6L10.6,12z M12,8.4l4.5-4.5v3.6h2v-7h-7v2h3.6L10.6,7L12,8.4z\'/%3E%3C/svg%3E"), auto';
                        });
                    }

                    if ($('#productSelfVideo').length > 0) {
                        $('#productSelfVideo')[0].style.cursor = 'url("data:image/svg+xml,%3Csvg version=\'1.1\' width=\'20\' height=\'20\' xmlns=\'http://www.w3.org/2000/svg\' xmlns:xlink=\'http://www.w3.org/1999/xlink\' x=\'0px\' y=\'0px\' viewBox=\'0 0 19 19\' style=\'enable-background:new 0 0 19 19;\' xml:space=\'preserve\'%3E%3Cstyle type=\'text/css\'%3E .st0%7Bopacity:' + svgBorder + ';fill:%23FFFFFF;%7D .st1%7Bfill:%23' + svgColor + ';%7D%0A%3C/style%3E%3Cpath class=\'st0\' d=\'M19,19h-8v-3h2.9l-4-4L12,9.9l4,4V11h3V19z M12,18h6v-6h-1v4.3l-5-5L11.3,12l5,5H12V18z M8,19H0v-8h3v2.9l4-4 L9.1,12l-4,4H8V19z M1,18h6v-1H2.7l5-5L7,11.3l-5,5V12H1V18z M7,9.1l-4-4V8H0V0h8v3H5.1l4,4L7,9.1z M2,2.7l5,5L7.7,7l-5-5H7V1H1v6h1 V2.7z M12,9.1L9.9,7l4-4H11V0h8v8h-3V5.1L12,9.1z M11.3,7L12,7.7l5-5V7h1V1h-6v1h4.3L11.3,7z\'/%3E%3Cpath class=\'st1\' d=\'M2.5,15.1v-3.6h-2v7h7v-2H3.9L8.4,12L7,10.6L2.5,15.1z M3.9,2.5h3.6v-2h-7v7h2V3.9L7,8.4L8.4,7L3.9,2.5z M10.6,12l4.5,4.5h-3.6v2h7v-7h-2v3.6L12,10.6L10.6,12z M12,8.4l4.5-4.5v3.6h2v-7h-7v2h3.6L10.6,7L12,8.4z\'/%3E%3C/svg%3E"), auto';
                    }
                }
            },
        };

    // Run the function
    $(function () {
        productGalleryGridScripts.init();
    });

})(jQuery);
