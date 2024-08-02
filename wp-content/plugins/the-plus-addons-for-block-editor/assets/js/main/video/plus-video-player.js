
"use strict";
!function(e,t){"function"==typeof define&&define.amd?define(t):"object"==typeof exports?module.exports=t:e.fluidvids=t()}(this,function(){"use strict";function e(e){return new RegExp("^(https?:)?//(?:"+d.players.join("|")+").*$","i").test(e)}function t(e,t){return parseInt(e,10)/parseInt(t,10)*100+"%"}function i(i){if((e(i.src)||e(i.data))&&!i.getAttribute("data-fluidvids")){var n=document.createElement("div");i.parentNode.insertBefore(n,i),i.className+=(i.className?" ":"")+"fluidvids-item",i.setAttribute("data-fluidvids","loaded"),n.className+="fluidvids",n.style.paddingTop=t(i.height,i.width),n.appendChild(i)}}function n(){var e=document.createElement("div");e.innerHTML="<p>x</p>"}var d={selector:["iframe","object"],players:["www.youtube.com","player.vimeo.com"]},r=document.head||document.getElementsByTagName("head")[0];return d.render=function(){for(var e=document.querySelectorAll(d.selector.join()),t=e.length;t--;)i(e[t])},d.init=function(e){for(var t in e)d[t]=e[t];d.render(),n()},d});

document.addEventListener("DOMContentLoaded", function() {
	tpvideoInit(document)
	lazyloadVideos(document);
})


function tpvideoInit(doc){
	if (doc.querySelectorAll('iframe').length) {
		doc.addEventListener('DOMContentLoaded', initFluidVids(doc));
		document.body.addEventListener('post-load', initFluidVids(doc));
	}

	document.addEventListener("ajaxComplete", function() {
		lazyloadVideos(document);
	});
	document.addEventListener("click", function(event) {
		if (event.target.matches('[data-mode="lazyload"] .tpgb-video-play-btn')) {
			event.preventDefault();
			var videoWrapper = event.target.closest(".ts-video-wrapper");
			if (videoWrapper) {
				playVideo(videoWrapper);
			}
		}
	});
}

function initFluidVids(doc) {
	var elements = doc.querySelectorAll('iframe:not(.pt-plus-bg-video):not(.tpgb-social-vimeo):not(.wp-block-embed-youtube iframe):not(.wp-block-embed-vimeo iframe)');
	for (var i = 0; i < elements.length; i++) {
		fluidvids.init(elements[i]);
	}
}


function playVideo(element) {
	var video = element.querySelector("video");
	var lazyload = element.querySelector(".ts-video-lazyload");
	
	if (element.dataset.grow) {
		element.style.maxWidth = "none";
	}
	var childElements = element.querySelectorAll(".tpgb-video-title, .tpgb-video-play-btn, .tpgb-video-thumb");
	childElements.forEach(function(childElement) {
		childElement.classList.add("ts-video-hidden");
	});
	if (lazyload) {
		var iframe = document.createElement("iframe"),
			videoData = lazyload.dataset;

		for (var key in videoData) {
			iframe.setAttribute(key, videoData[key]);
		}
		lazyload.parentNode.insertBefore(iframe, lazyload.nextSibling);
	}
	if (video) {
		video.play();
	}
}

function lazyloadVideos(doc) {
	var elements = doc.querySelectorAll('.ts-video-wrapper[data-inview-lazyload]');
	for (var i = 0; i < elements.length; i++) {
		elements[i].addEventListener("inview", function(event) {
			if (event.detail.isInViewport) {
				playVideo(event.target);
			}
		}, {
			once: true
		});
	}
}

