var cgkit_load_swiper = false;
var swiper = undefined;
var swiper2 = undefined;
function loadGallery() {

	var cg_layout = 'horizontal';
	var is_grid_layout = false;
	var win_width  = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	if( commercekit_pdp.pdp_gallery_layout == 'vertical-left' || commercekit_pdp.pdp_gallery_layout == 'vertical-right' ){
		cg_layout = 'vertical';
		cgkitResizeThumbsHeight(0);
	} 
	if( commercekit_pdp.pdp_gallery_layout == 'horizontal' || commercekit_pdp.pdp_gallery_layout == 'vertical-left' || commercekit_pdp.pdp_gallery_layout == 'vertical-right' ){
		cgkit_load_swiper = true;
	}
	if( ( commercekit_pdp.pdp_gallery_layout == 'grid-2-4' || commercekit_pdp.pdp_gallery_layout == 'grid-3-1-2' || commercekit_pdp.pdp_gallery_layout == 'grid-1-2-2' ) && win_width <= 770 ){
		cgkit_load_swiper = true;
		is_grid_layout = false;
	}
	if( ( commercekit_pdp.pdp_gallery_layout == 'grid-2-4' || commercekit_pdp.pdp_gallery_layout == 'grid-3-1-2' || commercekit_pdp.pdp_gallery_layout == 'grid-1-2-2' ) && win_width > 770 ){
		cgkit_load_swiper = false;
		is_grid_layout = true;
	}
	var mb10 = document.querySelector('#commercegurus-pdp-gallery');
	if( mb10 ){
		mb10.classList.remove('cgkit-mb10');
		mb10.classList.remove('cgkit-layout-4');
		mb10.style.visibility = 'visible';
		var layout_class = mb10.getAttribute('data-layout-class');
		if( layout_class ){
			if( is_grid_layout ){
				if( cgkit_load_swiper ){
					mb10.classList.remove(layout_class);
					mb10.classList.add('cg-layout-horizontal');
				} else {
					mb10.classList.remove('cg-layout-horizontal');
					mb10.classList.add(layout_class);
					cgkitClearSwiperSlides();
				}
			} else {
				if( win_width <= 770 ){
					mb10.classList.remove(layout_class);
					mb10.classList.add('cg-layout-horizontal');
					cg_layout = 'horizontal';
				} else {
					mb10.classList.add(layout_class);
					mb10.classList.remove('cg-layout-horizontal');
				}
				cgkitClearSwiperSlides();
			}
		} 
	}
	if( cgkit_load_swiper ) {
		var items = document.querySelectorAll('.cg-main-swiper .swiper-slide');
		items.forEach(function(item){
			item.classList.remove('less-images');
			item.classList.remove('more-images');
		});
		var load_more = document.querySelector('.cg-main-swiper .load-more-images');
		if( load_more ){
			load_more.style.display = 'none';
			load_more.classList.add('more');
			load_more.classList.remove('less');
			load_more.innerHTML = load_more.getAttribute('data-more');
		}
		// Swiper init.
		if( cg_layout == 'vertical' ){
			// Vertical
			swiper = new Swiper(".cg-thumb-swiper", {
				lazy: true,
				preloadImages: false,
				slidesPerView: commercekit_pdp.pdp_thumbnails,
				grabCursor: true,
				cssmode: true,
				watchSlidesVisibility: true,
				watchSlidesProgress: true,
				spaceBetween: 10,
				direction: cg_layout,
			});
		} else {
			// Horizontal
			swiper = new Swiper(".cg-thumb-swiper", {
				lazy: true,
				preloadImages: false,
				threshold: 2,
				slidesPerView: commercekit_pdp.pdp_thumbnails,
				centerInsufficientSlides: true,
				grabCursor: true,
				cssmode: true,
				watchSlidesVisibility: true,
				watchSlidesProgress: true,
				direction: cg_layout,
			});
		}

		swiper2 = new Swiper(".cg-main-swiper", {
			autoHeight: true,
			lazy: {
				loadPrevNext: true,
				preloaderClass: 'cg-swiper-preloader',
				loadPrevNextAmount: 1,
			},
			preloadImages: false,
			threshold: 2,
			cssmode: true,
			spaceBetween: 0,
			navigation: {
			  nextEl: ".swiper-button-next",
			  prevEl: ".swiper-button-prev",
			},
			thumbs: {
			  swiper: swiper,
			},
			watchOverflow: true,
			observer: true,
			observeParents: true,
		});
	
		swiper2.on('slideChangeTransitionEnd', function (){
			setTimeout(cgkitPausePlayedVideos(), 200);
		});	
		
		if( cg_layout == 'vertical' ){
			swiper2.on('slideChangeTransitionStart', function() {
				swiper.slideTo(swiper2.activeIndex);
			});
			swiper.on('transitionStart', function(){
				swiper2.slideTo(swiper.activeIndex);
			});
			swiper2.on('slideChangeTransitionEnd', function() {
				cgkitResizeThumbsHeight(1);
			});
		}
	} else {
		var grid_count = 8;
		if( commercekit_pdp.pdp_gallery_layout == 'grid-3-1-2' ) {
			grid_count = 6
		}
		if( commercekit_pdp.pdp_gallery_layout == 'grid-1-2-2' ) {
			grid_count = 5
		}
		var item_count = 0;
		var items = document.querySelectorAll('.cg-main-swiper .swiper-slide');
		items.forEach(function(item){
			item_count++;
			item.classList.remove('less-images');
			item.classList.remove('more-images');
			if( item_count <= grid_count ){
				item.classList.add('less-images');
			} else {
				item.classList.add('more-images');
			}
		});
		var load_more = document.querySelector('.cg-main-swiper .load-more-images');
		if( load_more ){
			if( items.length > grid_count ){
				load_more.style.display = 'block';
			} else {
				load_more.style.display = 'none';
			}
		}

		var items = document.querySelectorAll('.cg-main-swiper .swiper-slide.less-images .swiper-lazy');
		items.forEach(function(item){
			if( !item.classList.contains('loaded') ){
				var dsrc = item.getAttribute('data-src');
				if( dsrc ){
					item.setAttribute('src', dsrc);
					item.classList.add('loaded');
				}
			}
		});
	}
	// Photoswipe init.
	var initPhotoSwipeFromDOM = function(gallerySelector) {
	  // parse slide data (url, title, size ...) from DOM elements
	  // (children of gallerySelector)
	  var parseThumbnailElements = function(el) {
		var thumbElements = el.childNodes,
			numNodes = thumbElements.length,
			items = [],
			figureEl,
			linkEl,
			size,
			item;

		for (var i = 0; i < numNodes; i++) {
		  figureEl = thumbElements[i]; // <figure> element

		  // include only element nodes
		  if (figureEl.nodeType !== 1) {
			continue;
		  }

		  linkEl = figureEl.children[0]; // <a> element

		  size = linkEl.getAttribute("data-size").split("x");

		  if( linkEl.classList.contains('cgkit-video') ){
			  // create video slide object
			  var video_html = linkEl.getAttribute('data-html');
			  video_html = video_html.replace(/&lt;/g, '<');
			  video_html = video_html.replace(/&gt;/g, '>');
			  video_html = video_html.replace(/&quot;/g, '"');
			  item = {
				html: video_html
			  }
		  } else {
			  // create slide object
			  item = {
				src: linkEl.getAttribute("href"),
				w: parseInt(size[0], 10),
				h: parseInt(size[1], 10)
			  };
	
			  if (figureEl.children.length > 1) {
				// <figcaption> content
				item.title = figureEl.children[1].innerHTML;
			  }
	
			  if (linkEl.children.length > 0) {
				// <img> thumbnail element, retrieving thumbnail url
				item.msrc = linkEl.children[0].getAttribute("src");
			  }
		  }

		  item.el = figureEl; // save link to element for getThumbBoundsFn
		  items.push(item);
		}

		return items;
	  };

	  // find nearest parent element
	  var closest = function closest(el, fn) {
		return el && (fn(el) ? el : closest(el.parentNode, fn));
	  };

	  // triggers when user clicks on thumbnail
	  var onThumbnailsClick = function(e) {
		e = e || window.event;
		e.preventDefault ? e.preventDefault() : (e.returnValue = false);

		var eTarget = e.target || e.srcElement;

		var input = e.target;
		var inputp = input.closest('.cgkit-video-play');
		if( input.classList.contains('cgkit-video-play') || inputp ){
			return;
		}

		// find root element of slide
		var clickedListItem = closest(eTarget, function(el) {
		  return el.tagName && el.tagName.toUpperCase() === "LI";
		});

		if (!clickedListItem) {
		  return;
		}

		// find index of clicked item by looping through all child nodes
		// alternatively, you may define index via data- attribute
		var clickedGallery = clickedListItem.parentNode,
			childNodes = clickedListItem.parentNode.childNodes,
			numChildNodes = childNodes.length,
			nodeIndex = 0,
			index;

		for (var i = 0; i < numChildNodes; i++) {
		  if (childNodes[i].nodeType !== 1) {
			continue;
		  }

		  if (childNodes[i] === clickedListItem) {
			index = nodeIndex;
			break;
		  }
		  nodeIndex++;
		}

		if (index >= 0 && commercekit_pdp.pdp_lightbox) {
		  // open PhotoSwipe if valid index found
		  openPhotoSwipe(index, clickedGallery);
		}
		return false;
	  };

	  // parse picture index and gallery index from URL (#&pid=1&gid=2)
	  var photoswipeParseHash = function() {
		var hash = window.location.hash.substring(1),
			params = {};

		if (hash.length < 5) {
		  return params;
		}

		var vars = hash.split("&");
		for (var i = 0; i < vars.length; i++) {
		  if (!vars[i]) {
			continue;
		  }
		  var pair = vars[i].split("=");
		  if (pair.length < 2) {
			continue;
		  }
		  params[pair[0]] = pair[1];
		}

		if (params.gid) {
		  params.gid = parseInt(params.gid, 10);
		}

		return params;
	  };

	  var openPhotoSwipe = function(
	  index,
	   galleryElement,
	   disableAnimation,
	   fromURL
	  ) {
		var pswpElement = document.querySelectorAll(".pswp")[0],
			gallery,
			options,
			items;

		items = parseThumbnailElements(galleryElement);

		// Photoswipe options.
		options = {
		  /* "showHideOpacity" uncomment this If dimensions of your small thumbnail don't match dimensions of large image */
		  //showHideOpacity:true,

		  // Buttons/elements
		  closeEl: true,
		  captionEl: true,
		  fullscreenEl: true,
		  zoomEl: true,
		  shareEl: false,
		  counterEl: false,
		  arrowEl: true,
		  preloaderEl: true,
		  // define gallery index (for URL)
		  galleryUID: galleryElement.getAttribute("data-pswp-uid"),
		  getThumbBoundsFn: function(index) {
			// See Options -> getThumbBoundsFn section of documentation for more info
			var thumbnail = items[index].el.getElementsByTagName("img")[0]; // find thumbnail
			if( !thumbnail ){
				thumbnail = items[index].el.getElementsByTagName("video")[0]; // find thumbnail
				if( !thumbnail ){
					thumbnail = items[index].el.getElementsByTagName("iframe")[0]; // find thumbnail
				}
			}
			pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
			rect = thumbnail.getBoundingClientRect();

			return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
		  }
		};

		// PhotoSwipe opened from URL
		if (fromURL) {
		  if (options.galleryPIDs) {
			// parse real index when custom PIDs are used
			// http://photoswipe.com/documentation/faq.html#custom-pid-in-url
			for (var j = 0; j < items.length; j++) {
			  if (items[j].pid == index) {
				options.index = j;
				break;
			  }
			}
		  } else {
			// in URL indexes start from 1
			options.index = parseInt(index, 10) - 1;
		  }
		} else {
		  options.index = parseInt(index, 10);
		}

		// exit if index not found
		if (isNaN(options.index)) {
		  return;
		}

		if (disableAnimation) {
		  options.showAnimationDuration = 0;
		}

		// Pass data to PhotoSwipe and initialize it
		gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
		gallery.init();

		/* Additional swiperjs/photoswipe integration - 
		1/2. UPDATE SWIPER POSITION TO THE CURRENT ZOOM_IN IMAGE (BETTER UI) */
		// photoswipe event: Gallery unbinds events
		// (triggers before closing animation)
		gallery.listen("unbindEvents", function() {
		  // The index of the current photoswipe slide
		  var getCurrentIndex = gallery.getCurrentIndex();
		  // Update position of the slider
		  if( cgkit_load_swiper ){
			  swiper2.slideTo(getCurrentIndex, 0, false);
		  }
		  // 2/2. Start swiper autoplay (on close - if swiper autoplay is true)
		  //swiper2.autoplay.start();
		});
		// 2/2. swiper autoplay stop when image in zoom mode (When lightbox is open) */
		gallery.listen('initialZoomIn', function() {
		  if( cgkit_load_swiper ) {	
			  if(swiper2.autoplay.running){
				swiper2.autoplay.stop();
			  }
		  }
		});
        gallery.listen('beforeChange', function () {
			cgkitAddPhotoSwiperEvents();
		});
        gallery.listen('afterChange', function () {
			cgkitAddPhotoSwiperEvents();
		});
        gallery.listen('close', function () {
			setTimeout(function(){
				var pswp = document.querySelector('#pswp');
				if( pswp ){
					pswp.className = 'pswp';
				}
			}, 400);
		});
		cgkitAddPhotoSwiperEvents();
	  };
	  
	  var videos2 = document.querySelectorAll('.cgkit-video-wrap video');
	  videos2.forEach(function(video){
		 video.addEventListener('loadeddata', function(e){
			 var input = e.target;
			 var parent = input.closest('.cgkit-video-wrap');
			 cgkitVideoResizeHeight(parent, input, this.videoWidth, this.videoHeight);
		 });
		 video.addEventListener('play', function(e){
			 var input = e.target;
			 var parent = input.closest('.cgkit-video-wrap');
			 cgkitVideoResizeHeight(parent, input, this.videoWidth, this.videoHeight);
		 });
		 video.addEventListener('pause', function(e){
			 var input = e.target;
			 var parent = input.closest('.cgkit-video-wrap');
			 cgkitVideoResizeHeight(parent, input, this.videoWidth, this.videoHeight);
		 });
	  });

	  // loop through all gallery elements and bind events
	  var galleryElements = document.querySelectorAll(gallerySelector);

	  for (var i = 0, l = galleryElements.length; i < l; i++) {
		galleryElements[i].setAttribute("data-pswp-uid", i + 1);
		galleryElements[i].onclick = onThumbnailsClick;
	  }

	  // Parse URL and open gallery if it contains #&pid=3&gid=1
	  var hashData = photoswipeParseHash();
	  if (hashData.pid && hashData.gid && commercekit_pdp.pdp_lightbox) {
		openPhotoSwipe(hashData.pid, galleryElements[hashData.gid - 1], true, true);
	  }
	};

	// execute above function.
	initPhotoSwipeFromDOM(".cg-psp-gallery");
	var thbImage = document.querySelector("ul.swiper-wrapper.flex-control-nav li:first-child img");
	if( thbImage ) {
		observer = new MutationObserver((changes) => {
		  changes.forEach(change => {
			  if(change.attributeName.includes('src')){
				  if( cgkit_load_swiper ) {	
					swiper2.slideTo(0, 500, false);
				  }
			  }
		  });
		});
		observer.observe(thbImage, {attributes : true});
	}

	var thbForm = document.querySelector("form.variations_form");
	if( thbForm ) {
		observer2 = new MutationObserver((changes) => {
		  changes.forEach(change => {
			  if(change.attributeName.includes('current-image')){
				  var vid = thbForm.getAttribute('current-image');
				  if( vid == '' || vid == undefined ) { 
					  if( cgkit_load_swiper ) {	
						swiper2.slideTo(0, 500, false);
					  }
				  } else {
					var thumb = document.querySelector('li.swiper-slide[data-variation-id="'+vid+'"]');
					if( thumb ){
						var index = thumb.getAttribute('data-index');
					    if( cgkit_load_swiper ) {	
							swiper2.slideTo(index, 500, false);
						}
					}
				  }
				  var thbImage2 = document.querySelector("ul.swiper-wrapper.flex-control-nav li:first-child img");
				  if( thbImage2 ) {
					  thbImage2.setAttribute('srcset', '');
					  thbImage2.setAttribute('sizes', '');
				  }
			  }
		  });
		});
		observer2.observe(thbForm, {attributes : true});
	}
	if( cg_layout == 'vertical' ){
		var mainWrap = document.querySelector('ul.swiper-wrapper.cg-psp-gallery');
		if( mainWrap ) {
			observer = new MutationObserver((changes) => {
			  changes.forEach(change => {
				  if(change.attributeName.includes('style')){
					  if( cgkit_load_swiper ) {	
						var curobj = document.querySelector('ul.swiper-wrapper.cg-psp-gallery');
						if( curobj ){
							var parent = curobj.closest('.cg-main-swiper');
							if( parent ){
								parent.style.height = curobj.offsetHeight+'px';
							}
						}
					  }
				  }
			  });
			});
			observer.observe(mainWrap, {attributes : true});
		}
	}
}

const galleryUserInteractionEvents = ["mouseover", "keydown", "touchstart", "touchmove", "wheel"];
galleryUserInteractionEvents.forEach(function(event) {
    window.addEventListener(event, triggerGalleryScriptLoader, {
        passive: !0
    })
});

function triggerGalleryScriptLoader() {
    loadGalleryScripts();
    galleryUserInteractionEvents.forEach(function(event) {
        window.removeEventListener(event, triggerGalleryScriptLoader, {
            passive: !0
        })
    })
}

function loadGalleryScripts() {
	loadGallery();
}
function cgkitPausePlayedVideos(){
	var cgkit_videos = document.querySelectorAll('.swiper-slide-prev video, .swiper-slide-next video');
	cgkit_videos.forEach(function(cgkit_video){
		var parent = cgkit_video.closest('.cgkit-video-wrap');
		if( parent ){
			var iconPlay = parent.querySelector('svg.play');
			var iconPause = parent.querySelector('svg.pause');
			if( iconPlay && iconPause ){
				iconPlay.style.display = 'block';
				iconPause.style.display = 'none';
				cgkit_video.pause();
			}
		}
	});
	cgkit_video2 = document.querySelector('.swiper-slide-active video');
	if( cgkit_video2 ){
		if( cgkit_video2.classList.contains('cgkit-autoplay') ){
			var parent = cgkit_video2.closest('.cgkit-video-wrap');
			if( parent ){
				var iconPlay = parent.querySelector('svg.play');
				var iconPause = parent.querySelector('svg.pause');
				if( iconPlay && iconPause ){
					iconPlay.style.display = 'none';
					iconPause.style.display = 'block';
					cgkit_video2.play();
				}
			}
		}
	}
}
function cgkitVideoTogglePlay(parent){
	var video = parent.querySelector('video');
	var iconPlay = parent.querySelector('svg.play');
	var iconPause = parent.querySelector('svg.pause');
	if( video && iconPlay && iconPause ){
		if( video.paused ) {
			iconPlay.style.display = 'none';
			iconPause.style.display = 'block';
			video.play();
		} else {
			iconPlay.style.display = 'block';
			iconPause.style.display = 'none';
			video.pause();
		}
	}
	var videoIcon = parent.querySelector('.cgkit-play');
	if( videoIcon ){
		videoIcon.classList.remove('not-autoplay');
	}
}
function cgkitVideoResizeHeight(parent, input, videoWidth, videoHeight){
	if( input.style.display != 'none' ){
		var pswp = input.closest('div.pswp__scroll-wrap');
		if( pswp ){
			var parentHeight = parent.offsetHeight;
			var parentWidth = ( parentHeight / videoHeight ) * videoWidth;
			parent.style.width = parentWidth+'px';
			input.style.width = parentWidth+'px';
		} else {
			var parentWidth = parent.offsetWidth;
			var parentHeight = ( parentWidth / videoWidth ) * videoHeight;
			parent.style.height = parentHeight+'px';
			input.style.height = parentHeight+'px';
			var activeSlide = parent.closest('li.swiper-slide.swiper-slide-active');
			if( activeSlide ){
				document.querySelector('#cgkit-pdp-gallery-outside').click();
			}
		}
	}
}
function cgkitResizeThumbsHeight(active){
	return true;
	var win_width  = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	if( win_width <= 770 ){
		return;
	}
	var thumbs = document.querySelector('.cg-thumb-swiper');
	var thumb_limit = commercekit_pdp.pdp_thumbnails;
	var thumb_count = 0;
	var total_height = 0;
	if( active ){
		var item = document.querySelector('.cg-thumb-swiper .swiper-slide.swiper-slide-active');
		if( item ){
			var oitem = item;
			var previus = false;
			do {
				thumb_count++;
				total_height += item.offsetHeight;
				var nitem = item.nextElementSibling;
				if( nitem && !previus ){
					item = nitem;
				} else {
					if( !previus ){
						item = oitem;
					}
					var pitem = item.previousElementSibling;
					if( pitem ){
						item = pitem;
						previus = true;
					}
				}
			} while ( thumb_count < thumb_limit );		
		}
	} else {
		var items = document.querySelectorAll('.cg-thumb-swiper .swiper-slide');
		items.forEach(function(item){
			thumb_count++;
			if( thumb_count <= thumb_limit ){
				total_height += item.offsetHeight;
			}
		});
	}
	if( thumbs && total_height ){
		var margin_height = ( thumb_limit - 1 ) * 10;
		thumbs.style.height = (total_height+margin_height)+'px';
	}
}
function cgkitAddPhotoSwiperEvents(){
	var video2 = document.querySelector('.pswp__scroll-wrap .cgkit-video-wrap video');
	if( video2 ){
		var parent2 = video2.closest('.cgkit-video-wrap');
		cgkitVideoResizeHeight(parent2, video2, video2.videoWidth, video2.videoHeight);
	}
	var videos2 = document.querySelectorAll('.pswp__scroll-wrap .cgkit-video-wrap video');
	videos2.forEach(function(video){
		video.addEventListener('loadeddata', function(e){
			var input = e.target;
			var parent = input.closest('.cgkit-video-wrap');
			cgkitVideoResizeHeight(parent, input, this.videoWidth, this.videoHeight);
		});
		video.addEventListener('play', function(e){
			var input = e.target;
			var parent = input.closest('.cgkit-video-wrap');
			cgkitVideoResizeHeight(parent, input, this.videoWidth, this.videoHeight);
		});
		video.addEventListener('pause', function(e){
			var input = e.target;
			var parent = input.closest('.cgkit-video-wrap');
			cgkitVideoResizeHeight(parent, input, this.videoWidth, this.videoHeight);
		});
	});
}
function cgkitClearSwiperSlides(){
	if( swiper != undefined && swiper2 != undefined ){
		swiper.destroy();
		swiper2.destroy();
		swiper = undefined;
		swiper2 = undefined;
		var swpwraps = document.querySelectorAll('#commercegurus-pdp-gallery ul.swiper-wrapper');
		swpwraps.forEach(function(swpwrap){
			swpwrap.removeAttribute('style');
		});
		var swpslds = document.querySelectorAll('#commercegurus-pdp-gallery li.swiper-slide');
		swpslds.forEach(function(swpsld){
			swpsld.removeAttribute('style');
		});
	}   
}
if( document.querySelector('#commercegurus-pdp-gallery') ){
	window.addEventListener('resize', function(e){
		loadGallery();
		var videos2 = document.querySelectorAll('.cgkit-video-wrap video');
		videos2.forEach(function(video){
			var parent = video.closest('.cgkit-video-wrap');
			cgkitVideoResizeHeight(parent, video, video.videoWidth, video.videoHeight);
		});
		if( commercekit_pdp.pdp_gallery_layout == 'vertical-left' || commercekit_pdp.pdp_gallery_layout == 'vertical-right' ){
			cgkitResizeThumbsHeight(1);
		}
	});
	document.addEventListener('click', function(e){
		var input = e.target;
		if( input.classList.contains('load-more-images') ){
			if( input.classList.contains('more') ){
				input.classList.remove('more');
				input.classList.add('less');
				input.innerHTML = input.getAttribute('data-less');
				var items = document.querySelectorAll('.cg-main-swiper .swiper-slide.more-images .swiper-lazy');
				items.forEach(function(item){
					if( !item.classList.contains('loaded') ){
						var dsrc = item.getAttribute('data-src');
						if( dsrc ){
							item.setAttribute('src', dsrc);
							item.classList.add('loaded');
						}
					}
				});
				var items = document.querySelectorAll('.cg-main-swiper .swiper-slide.more-images');
				items.forEach(function(item){
					item.style.display = 'block';
				});
			} else {
				input.classList.add('more');
				input.classList.remove('less');
				input.innerHTML = input.getAttribute('data-more');
				var items = document.querySelectorAll('.cg-main-swiper .swiper-slide.more-images');
				items.forEach(function(item){
					item.style.display = 'none';
				});
				document.querySelector('#commercegurus-pdp-gallery').scrollIntoView({block:'end'});
			}
		}
	});
	document.addEventListener('click', function(e){
		var input = e.target;
		var inputp = input.closest('.cgkit-video-play');
		if( input.classList.contains('cgkit-video-play') || inputp ){
			if( inputp ){
				input = inputp;
			}
			e.preventDefault();
			e.stopPropagation();
			var parent = input.closest('.cgkit-video-wrap');
			var image = parent.querySelector('img');
			var video = parent.querySelector('video');
			if( image && video ){
				image.style.display = 'none';
				video.style.display = 'block';
			}
			cgkitVideoTogglePlay(parent);
			return false;
		}
	});
	var cgkit_var_image = false;
	var thbImage2 = document.querySelector("ul.swiper-wrapper.flex-control-nav li:first-child img");
	if( thbImage2 ) {
		observer2 = new MutationObserver((changes) => {
		  changes.forEach(change => {
			  if(change.attributeName.includes('src')){
				  if( !cgkit_var_image ){
					loadGallery();
					cgkit_var_image = true;
				  }
			  }
		  });
		});
		observer2.observe(thbImage2, {attributes : true});
	}
	var thbImage3 = document.querySelector("ul.swiper-wrapper.cg-psp-gallery li:first-child img");
	if( thbImage3 ) {
		observer3 = new MutationObserver((changes) => {
		  changes.forEach(change => {
			  if(change.attributeName.includes('src')){
				  if( !cgkit_var_image ){
					loadGallery();
					cgkit_var_image = true;
				  }
			  }
		  });
		});
		observer3.observe(thbImage3, {attributes : true});
	}
	var thbImage4 = document.querySelector("form.variations_form");
	if( thbImage4 ) {
		observer4 = new MutationObserver((changes) => {
		  changes.forEach(change => {
			  if(change.attributeName.includes('current-image')){
				  if( !cgkit_var_image ){
					loadGallery();
					cgkit_var_image = true;
				  }
			  }
		  });
		});
		observer4.observe(thbImage4, {attributes : true});
	}
}
