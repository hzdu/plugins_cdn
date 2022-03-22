var cgkit_load_swiper = false;
var swiper = undefined;
var swiper2 = undefined;
function loadAttributesGallery() {

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

		var items = document.querySelectorAll('#commercegurus-pdp-gallery .cg-main-swiper .swiper-slide.less-images .swiper-lazy');
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
			  // create image slide object
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

const attributesGalleryUserInteractionEvents = ["mouseover", "keydown", "touchstart", "touchmove", "wheel"];
attributesGalleryUserInteractionEvents.forEach(function(event) {
    window.addEventListener(event, triggerAttributesGalleryScriptLoader, {
        passive: !0
    })
});

function triggerAttributesGalleryScriptLoader() {
    loadAttributesGalleryScripts();
    attributesGalleryUserInteractionEvents.forEach(function(event) {
        window.removeEventListener(event, triggerAttributesGalleryScriptLoader, {
            passive: !0
        })
    })
}

function loadAttributesGalleryScripts() {
	loadAttributesGallery();
}

function changeAttributesGalleryImages() {
	var attributes = [];
	var attr_count = 0;
	if( cgkit_attr_names != undefined && cgkit_attr_names.length > 0 ){
		attr_count = cgkit_attr_names.length;
		for( i = 0; i < attr_count; i++ ){
			var attr_inputs = document.querySelectorAll('[name="'+cgkit_attr_names[i]+'"]');
			attr_inputs.forEach(function(attr_input){
				if( attr_input.getAttribute('type') == 'radio' ) {
					if( attr_input.checked && attr_input.value != '' ){
						attributes[cgkit_attr_names[i]] = attr_input.value;
					}
				} else {
					if( attr_input.value != '' ) {
						attributes[cgkit_attr_names[i]] = attr_input.value;
					}
				}
			});
		}
		attributes = Object.assign({}, attributes);
	}
	var attr_gallery = [];
	var gallery_slug = 'default_gallery';
	if( Object.keys(attributes).length > 0 ) {
		if( cgkit_variations != undefined && cgkit_variations.length > 0 ) {
			for( var i = 0; i < cgkit_variations.length; i++ ){
				if( cgkit_variations[i].attributes != undefined ){
					var _attributes = cgkit_variations[i].attributes;
					if( cgkitIsSubset( attributes, _attributes ) ){
						attr_gallery.push(cgkit_variations[i]);
					}
				}
			}
		}
		if( cgkit_attr_gallery != undefined && cgkit_attr_gallery.length > 0 ) {
			for( var i = 0; i < cgkit_attr_gallery.length; i++ ){
				if( cgkit_attr_gallery[i].attributes != undefined ){
					var _attributes = cgkit_attr_gallery[i].attributes;
					if( cgkitIsSubset( attributes, _attributes ) ){
						attr_gallery.push(cgkit_attr_gallery[i]);
					}
				}
			}
		}
		gallery_slug = Object.values(attributes).join('_cgkit_');
	}
	if( attr_gallery.length == 0 && cgkit_attr_gallery[0] != undefined ) {
		attr_gallery.push(cgkit_attr_gallery[0]);
		gallery_slug = 'default_gallery';
	}
	if( attr_gallery.length > 0 && cgkit_gallery_template != undefined ) {
		var container = document.querySelector('#commercegurus-pdp-gallery');
		var current_slug = container.getAttribute('data-gallery-slug');
		container.style.visibility = 'visible';
		if( current_slug == gallery_slug ){
			return true;
		}

		var gallery_template = cgkit_gallery_template;
		var images = {};
		var thumbs = {};
		for( var i = 0; i < attr_gallery.length; i++ ){
			for( var image in attr_gallery[i].gallery.images ){
				if( !images.hasOwnProperty(image) ){
					images[image] = attr_gallery[i].gallery.images[image];
				}
			}
			for( var thumb in attr_gallery[i].gallery.thumbs ){
				if( !thumbs.hasOwnProperty(thumb) ){
					thumbs[thumb] = attr_gallery[i].gallery.thumbs[thumb];
				}
			}
		}
		if( cgkit_glob_gallery != undefined && gallery_slug != 'default_gallery' ) {
			for( var image in cgkit_glob_gallery.images ){
				if( !images.hasOwnProperty(image) ){
					images[image] = cgkit_glob_gallery.images[image];
				}
			}
			for( var thumb in cgkit_glob_gallery.thumbs ){
				if( !thumbs.hasOwnProperty(thumb) ){
					thumbs[thumb] = cgkit_glob_gallery.thumbs[thumb];
				}
			}
		}

		var gallery_images = '';
		var gallery_thumbs = '';
		var img_count = Object.keys(images).length;
		var image_ids = [];
		for( var image in images ){
			gallery_images += images[image];
			var image_id = image.replace('img_', '');
			image_ids.push(image_id);
		}

		var gallery_img_ids = image_ids.join(',');
		var current_img_ids = container.getAttribute('data-image-ids');
		if( current_img_ids == gallery_img_ids ){
			return true;
		}

		if( Object.keys(thumbs).length > 1 ){
			container.classList.remove('cgkit-one-slider');
			for( var thumb in thumbs ){
				gallery_thumbs += thumbs[thumb];
			}
		} else {
			container.classList.add('cgkit-one-slider');
		}

		gallery_template = gallery_template.replace(/{gallery-images}/g, gallery_images);
		gallery_template = gallery_template.replace(/{gallery-thumbs}/g, gallery_thumbs);
		gallery_template = gallery_template.replace(/{img-count}/g, img_count);
		container.innerHTML = gallery_template;
		container.setAttribute('data-gallery-slug', gallery_slug);
		container.setAttribute('data-image-ids', gallery_img_ids);
		loadAttributesGallery();
	}
}
function cgkitIsSubset(superObj, subObj){
	return Object.keys(subObj).every(ele => {
		if( typeof subObj[ele] == 'object' ) {
			return isSubset(superObj[ele], subObj[ele]);
		}
		return subObj[ele] === superObj[ele];
	});
};
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
	return ture;
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
	if( cgkit_attr_names != undefined && cgkit_attr_names.length > 0 ){
		for( i = 0; i < cgkit_attr_names.length; i++ ){
			var attr_inputs = document.querySelectorAll('[name="'+cgkit_attr_names[i]+'"]');
			attr_inputs.forEach(function(attr_input){
				attr_input.addEventListener('change', function(e){
					changeAttributesGalleryImages();
				});
			});
		}
	}
	document.addEventListener('click', function(e){
		var input = e.target;
		var clear_var = false;
		var var_form = input.closest('form.variations_form');
		if( input.classList.contains('reset_variations') ) {
			if( var_form )
				clear_var = true;
		}
		var inputp = input.closest('.swatch');
		if( input.classList.contains('swatch') || inputp ){
			if( var_form )
				clear_var = true;
		}
		var inputp = input.closest('.iconic-was-swatch');
		if( input.classList.contains('iconic-was-swatch') || inputp ){
			if( var_form )
				clear_var = true;
		}
		var inputp = input.closest('.swatch-control');
		if( input.classList.contains('swatch-control') || inputp ){
			if( var_form )
				clear_var = true;
		}
		var inputp = input.closest('.swatch-wrapper');
		if( input.classList.contains('swatch-wrapper') || inputp ){
			if( var_form )
				clear_var = true;
		}
		setTimeout(function(){
			if( clear_var ){
				changeAttributesGalleryImages();
			}
		}, 200);
	});
	window.addEventListener('resize', function(e){
		loadAttributesGallery();
		var videos2 = document.querySelectorAll('.cgkit-video-wrap video');
		videos2.forEach(function(video){
			var parent = video.closest('.cgkit-video-wrap');
			cgkitVideoResizeHeight(parent, video, video.videoWidth, video.videoHeight);
		});
		if( commercekit_pdp.pdp_gallery_layout == 'vertical-left' || commercekit_pdp.pdp_gallery_layout == 'vertical-right' ){
			cgkitResizeThumbsHeight(1);
		}
	});
	document.addEventListener('DOMContentLoaded', function(){
		changeAttributesGalleryImages();
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
}
