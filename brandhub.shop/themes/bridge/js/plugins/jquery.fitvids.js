/*jshint browser:true */
/*!
* FitVids 1.1
*
* Copyright 2013, Chris Coyier - http://css-tricks.com + Dave Rupert - http://daverupert.com
* Credit to Thierry Koblentz - http://www.alistapart.com/articles/creating-intrinsic-ratios-for-video/
* Released under the WTFPL license - http://sam.zoy.org/wtfpl/
*
*/

(function( $ ){

    'use strict';

    $.fn.fitVids = function( options ) {
        var settings = {
            customSelector: null,
            ignore: null
        };

        if(!document.getElementById('fit-vids-style')) {
            // appendStyles: https://github.com/toddmotto/fluidvids/blob/master/dist/fluidvids.js
            var head = document.head || document.getElementsByTagName('head')[0];
            var css = '.fluid-width-video-wrapper{width:100%;position:relative;padding:0;}.fluid-width-video-wrapper iframe,.fluid-width-video-wrapper object,.fluid-width-video-wrapper embed {position:absolute;top:0;left:0;width:100%;height:100%;}';
            var div = document.createElement("div");
            div.innerHTML = '<p>x</p><style id="fit-vids-style">' + css + '</style>';
            head.appendChild(div.childNodes[1]);
        }

        if ( options ) {
            $.extend( settings, options );
        }

        return this.each(function(){
            var selectors = [
                'iframe[src*="player.vimeo.com"]',
                'iframe[src*="youtube.com"]',
                'iframe[src*="youtube-nocookie.com"]',
                'iframe[src*="kickstarter.com"][src*="video.html"]',
                'object',
                'embed'
            ];

            if (settings.customSelector) {
                selectors.push(settings.customSelector);
            }

            var ignoreList = '.fitvidsignore';

            if(settings.ignore) {
                ignoreList = ignoreList + ', ' + settings.ignore;
            }

            var $allVideos = $(this).find(selectors.join(','));
            $allVideos = $allVideos.not('object object'); // SwfObj conflict patch
            $allVideos = $allVideos.not(ignoreList); // Disable FitVids on this video.

            $allVideos.each(function(){
                var $this = $(this);
                if($this.parents(ignoreList).length > 0) {
                    return; // Disable FitVids on this video.
                }
                if (this.tagName.toLowerCase() === 'embed' && $this.parent('object').length || $this.parent('.fluid-width-video-wrapper').length) { return; }

                var height,
                    width,
                    aspectRatio;

                if( typeof $this.attr( 'height' ) !== 'undefined' && typeof $this.attr( 'width' ) !== 'undefined' ) {
                    height = $this.attr( 'height' );
                    width = $this.attr( 'width' );
                    aspectRatio = height / width;
                } else {
                    if( $this.closest('.flexslider').length > 0 ){
                        if( $this.closest('ul').find('li > img').length > 0 ){
                            height = $this.closest('ul').height();
                        } else if( $this.closest('ul').find('video-wrap').length > 0 ){
                            height = $this.closest('ul').find('video-wrap').height();
                        } else {
                            height = 500; // this is a height of images from design
                        }
                        width = !isNaN(parseInt($this.closest('li').attr('width'), 10)) ? parseInt($this.closest('li').attr('width'), 10) : $this.closest('li').width();
                        aspectRatio = height / width;
                    } else if( $this.closest('.portfolio_images').length > 0 ){
                        width = $j('.portfolio_images').width();

                        if( $this.next('img').length > 0 ){
                            height = $this.next('img').height();
                        } else {
                            height = 500; // this is a height of images from design
                        }

                        aspectRatio = height / width;
                    } else if( $this.closest('.post_image').length ) { // this is for format-video post type
                        height = ( this.tagName.toLowerCase() === 'object' || ($this.attr('height') && !isNaN(parseInt($this.attr('height'), 10))) ) ? parseInt($this.attr('height'), 10) : $this.height();
                        width = !isNaN(parseInt($this.attr('width'), 10)) ? parseInt($this.attr('width'), 10) : $this.width();
                        aspectRatio = height / width;
                    } else if( $this.closest('.q_masonry_blog_post_image').length ) { // this is for format-video post type on masonry shortcode
                        height = ( this.tagName.toLowerCase() === 'object' || ($this.attr('height') && !isNaN(parseInt($this.attr('height'), 10))) ) ? parseInt($this.attr('height'), 10) : $this.height();
                        width = !isNaN(parseInt($this.attr('width'), 10)) ? parseInt($this.attr('width'), 10) : $this.width();
                        aspectRatio = height / width;
                    } else{
                        height = ( this.tagName.toLowerCase() === 'object' || ($this.attr('height') && !isNaN(parseInt($this.attr('height'), 10))) ) ? parseInt($this.attr('height'), 10) : $this.height();
                        width = !isNaN(parseInt($this.attr('width'), 10)) ? parseInt($this.attr('width'), 10) : $this.parent().width();
                        aspectRatio = height / width;
                    }
                }

                if(!$this.attr('id')){
                    var videoID = 'fitvid' + Math.floor(Math.random()*999999);
                    $this.attr('id', videoID);
                }
                $this.wrap('<div class="fluid-width-video-wrapper"></div>');
                $('.fluid-width-video-wrapper').css('padding-top', (aspectRatio*100) + "%");
            });
        });
    };

    // Internal counter for unique video names.
    $.fn.fitVids._count = 0;

// Works with either jQuery or Zepto
})( window.jQuery || window.Zepto );