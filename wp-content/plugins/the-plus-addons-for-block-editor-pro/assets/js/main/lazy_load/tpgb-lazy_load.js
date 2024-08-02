"use strict";
function onDocumentLoaded(cb){
	if (/comp|inter|loaded/.test(document.readyState)) {
		cb()
	} else {
		document.addEventListener('DOMContentLoaded', cb, false)
	}
}

onDocumentLoaded(() => {
	if (document.querySelector('img.tpgb-lazyload')) {
		tpgb_lazy_load()	
	}
	var lazyBackgrounds = [].slice.call(document.querySelectorAll(".lazy-background"));

	  if (lazyBackgrounds && "IntersectionObserver" in window && "IntersectionObserverEntry" in window && "intersectionRatio" in window.IntersectionObserverEntry.prototype) {
		let lazyBackgroundObserver = new IntersectionObserver(function(entries, observer) {
		  entries.forEach(function(entry) {
			if (entry.isIntersecting) {
			  entry.target.classList.remove("lazy-background");
			  lazyBackgroundObserver.unobserve(entry.target);
			}
		  });
		});

		lazyBackgrounds.forEach(function(lazyBackground) {
		  lazyBackgroundObserver.observe(lazyBackground);
		});
	  }
});

let lz = null

const tpgb_lazy_load = () => {
	if (lz) {
		lz.update()
		return
	}
	var lazy_enter = function ( e ) {
		e.classList.add('tpgb-lazy-start');
	};
	var lazy_loading = function ( e ) {
		e.classList.remove('tpgb-lazy-start');
		e.classList.add('tpgb-lazy-loading');
	};
	var lazy_loaded = function ( e ) {
		e.classList.remove('tpgb-lazy-loading');
		e.classList.add('tpgb-lazy-loaded');
		delete e.dataset.srcset;
	};
	
	lz = new LazyLoad({
		elements_selector: "img.tpgb-lazyload",
		callback_enter: lazy_enter,
		callback_loading: lazy_loading,
		callback_loaded: lazy_loaded,
	});
	
}