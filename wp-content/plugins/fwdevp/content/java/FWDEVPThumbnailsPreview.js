/**
 * Easy Video Player PACKAGED v8.3
 * Thumbnail preview plugin.
 *
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © 2006 All Rights Reserved.
 */
(function (window){
var FWDEVPThumbnailsPreview = function(
		controller
		){

		'use strict';

		var _s = this;
		var prototype = FWDEVPThumbnailsPreview.prototype;
		
		_s.main = controller.prt;
		_s.vtt_ar;
		_s.cWidth = controller._d.thumbnailsPreviewWidth;
		_s.cHeight = controller._d.thumbnailsPreviewHeight;
		_s.bkColor =  controller._d.thumbnailsPreviewBackgroundColor;
		_s.borderColor = controller._d.thumbnailsPreviewBorderColor;
		_s.labelBkColor = controller._d.thumbnailsPreviewLabelBackgroundColor;
		_s.labelFontColor = controller._d.thumbnailsPreviewLabelFontColor;
		_s.duration;
		_s.borderSize = 1;
		_s.pointerOffsetX = 0;
		
		_s.isLoaded_bl = false;
		_s.isLoaded_bl = false;
		_s.isMobile_bl = FWDEVPUtils.isMobile;
	
	
		//##########################################//
		/* initialize _s */
		//##########################################//
		_s.init = function(){
			_s.style().zIndex = 9999;
			_s.setOverflow("visible");
			_s.style().pointerEvents = 'none';
			_s.setBkColor(_s.borderColor);
			
			_s.mainHolder_do = new FWDEVPDO("div");
			_s.mainHolder_do.setBkColor(_s.bkColor);
			_s.mainHolder_do.setX(_s.borderSize);
			_s.mainHolder_do.setY(_s.borderSize);
			_s.addChild(_s.mainHolder_do);
			
			_s.pointerHolder_do = new FWDEVPDO("div");
			_s.pointerHolder_do.setOverflow('visible');
			_s.addChild(_s.pointerHolder_do);
			
			_s.text_do = new FWDEVPDO("div");
			_s.text_do.hasT3D = false;
			_s.text_do.hasT2D = false;
			_s.text_do.setBackfaceVisibility();
			_s.text_do.setDisplay("inline-block");
			_s.text_do.style().fontFamily = "Arial";
			_s.text_do.style().fontSize= "12px";
			_s.text_do.setBkColor(_s.labelBkColor);
			_s.text_do.style().color = _s.labelFontColor;
			_s.text_do.style().whiteSpace= "nowrap";
			_s.text_do.style().fontSmoothing = "antialiased";
			_s.text_do.style().webkitFontSmoothing = "antialiased";
			_s.text_do.style().textRendering = "optimizeLegibility";
			_s.text_do.style().padding = "6px";
			_s.text_do.style().paddingTop = "4px";
			_s.text_do.style().paddingBottom = "4px";
			_s.text_do.screen.className = 'fwdevp-thubnails-preview-text';
			_s.pointerHolder_do.addChild(_s.text_do);
			
			_s.pointer_do = new FWDEVPDO("div");
			_s.pointer_do.setBkColor(_s.labelBkColor);
	
			_s.pointer_do.screen.style = "border: 4px solid transparent; border-top-color: " + _s.borderColor + ";";
			_s.pointer_do.setWidth(0);
			_s.pointerHolder_do.addChild(_s.pointer_do);
		
			_s.hide();
			_s.setAlpha(0);
			_s.setVisible(false);
			_s.setY(-100);
			_s.updateSize();
		};

		_s.updateSize = function(){
			_s.tW = _s.cWidth;
			_s.tH = _s.cHeight;

			if(_s.videoType == FWDEVPlayer.VIDEO || _s.videoType == FWDEVPlayer.HLS_JS){
				_s.tH = Math.round(_s.videoH * (_s.tW/_s.videoW));
				_s.setupCanvas();
			}
			
			_s.setWidth(_s.tW + _s.borderSize * 2);
			_s.setHeight(_s.tH + _s.borderSize * 2);
			_s.mainHolder_do.setWidth(_s.tW);
			_s.mainHolder_do.setHeight(_s.tH);
		}

		// Video.
		_s.setupVideo = function(){
			if(!_s.video_el){
				_s.video_el = document.createElement("video");
				_s.video_el.muted = true;
				_s.video_el.WebKitPlaysInline = true;
				_s.video_el.playsinline = true;
				_s.video_el.setAttribute("playsinline", "");
				_s.video_el.setAttribute("webkit-playsinline", "");
			} 
			_s.video_el.src = _s.videoSource;
		}

		_s.destroyHLS = function(){
			if(_s.hlsJS){
				_s.hlsJS.destroy();
				_s.hlsJS = null;
			}
		}

		// Canvas.
		_s.setupCanvas = function(){
			if(_s.canvas) return;
			_s.canvas_do = new FWDEVPDO("canvas");
			_s.canvas = _s.canvas_do.screen;
			_s.ctx = _s.canvas.getContext("2d");
			_s.canvas_do.style().backroundColor = '#FF0000';
			_s.canvas_do.setWidth(_s.tW);
			_s.canvas_do.setHeight(_s.tH);
			_s.canvas.width = _s.tW;
			_s.canvas.height = _s.tH;
			_s.mainHolder_do.addChild(_s.canvas_do);
		}

		_s.startToDraw =  function(){
			var prm = _s.video_el.play();
			if(prm !== undefined) {
			    prm.then(function(){}, function(){});
			}
			_s.stopToDraw();
			_s.dr = setInterval(_s.videoDraw, 30);
		}

		_s.stopToDraw =  function(){
			if(_s.video_el) _s.video_el.pause();
			clearInterval(_s.dr);
		}
		
		_s.videoDraw = function(){
			_s.ctx.drawImage(_s.video_el, 0, 0, _s.tW, _s.tH);
		}

		
		// Vtt.
		_s.stopToLoad = function(){
			if(_s.xhr != null){
				try{_s.xhr.abort();}catch(e){}
				_s.xhr.onreadystatechange = null;
				_s.xhr.onerror = null;
				_s.xhr = null;
			}
			_s.isLoaded_bl = false;
			_s.canvas = null;
		};
	
		_s.load = function(path, videoType, videoSource, video){
			if(path == 'auto'){
				_s.isAuto = true;
				_s.videoType = videoType;
				_s.videoSource = videoSource;
				_s.videoW = video.videoWidth;
				_s.videoH = video.videoHeight;
			
				if(_s.videoType == FWDEVPlayer.VIDEO){
					_s.setupVideo();
				}else if(_s.videoType == FWDEVPlayer.HLS_JS){
					_s.setupVideo();
					if(window['Hls']){
						_s.hlsJS = new Hls();
						_s.hlsJS.loadSource(_s.videoSource);
						_s.hlsJS.attachMedia(_s.video_el);
						_s.hlsJS.on(Hls.Events.MANIFEST_PARSED,function(e){
							_s.updateSize();
						});
					}
				}
				
				_s.updateSize();
				_s.positionPointer();
				_s.add();
				_s.setLabel('00:00', 0);
			}else{
				_s.isAuto = false;
				_s.vtt_ar = [];
				_s.sourceURL_str = path;
				_s.prevSourceURL_str = _s.sourceURL_str;
				_s.xhr = new XMLHttpRequest();
				_s.xhr.onreadystatechange = _s.onLoad;
				_s.xhr.onerror = _s.onError;
				
				try{
					_s.xhr.open("get", _s.sourceURL_str + "?rand=" + parseInt(Math.random() * 99999999), true);
					_s.xhr.send();
				}catch(e){
					var message = e;
					if(e){if(e.message)message = e.message;}
				}
			}
		}
		
		_s.onLoad = function(e){
			var response;
			if(_s.xhr.readyState == 4){
				if(_s.xhr.status == 404){
					_s.dispatchEvent(FWDEVPData.LOAD_ERROR, {text:"Thumbnails preview .vtt file not found: <font color='#FF0000'>" + _s.sourceURL_str + "</font>"});
				}else if(_s.xhr.status == 408){
					_s.dispatchEvent(FWDEVPData.LOAD_ERROR, {text:"Loadiong thumbnails preview .vtt file file file request load timeout!"});
				}else if(_s.xhr.status == 200){
					_s.vtt_txt = _s.xhr.responseText;
					_s.parseVtt(_s.vtt_txt);
					_s.updateSize();
					_s.positionPointer();
					_s.add();
					_s.setLabel('00:00', 0);
				}
			}
			
			_s.dispatchEvent(FWDEVPThumbnailsPreview.LOAD_COMPLETE);
		};
		
		_s.onError = function(e){
			try{
				if(window.console) console.log(e);
				if(window.console) console.log(e.message);
			}catch(e){};
			_s.dispatchEvent(FWDEVPThumbnailsPreview.LOAD_ERROR, {text:"Error loading thumbnails preview .vtt file : <font color='#FF0000'>" + _s.sourceURL_str + "</font>."});
		};

		
		//##########################################//
		/* set label */
		//##########################################//
		_s.setLabel = function(label, duration, x){
			
			if(label === undefined ) return;
			if(x !== undefined)_s.pointerOffsetX = x;
			
			var imgSrc = "";

			if(_s.isAuto){
				if(_s.videoType == FWDEVPlayer.VIDEO || _s.videoType == FWDEVPlayer.HLS_JS){
					_s.video_el.currentTime = duration;
				}
			}else if(_s.vtt_ar){
				for(var i=0; i<_s.vtt_ar.length; i++){
					var start = _s.vtt_ar[i].startDuration;
					var end = _s.vtt_ar[i].endDuration;
					if(start <= duration  && end > duration ){
						imgSrc = _s.vtt_ar[i].imagePath;
						if(imgSrc != _s.prevImgSrc){
							_s.mainHolder_do.style().background = 'url("' +imgSrc + '") no-repeat center center';
							_s.mainHolder_do.style().backgroundSize = "cover";
							_s.prevImgSrc = imgSrc;
						}
						break;
					};
				}
			}
			
			_s.text_do.setInnerHTML(label);
			_s.positionPointer();
			setTimeout(function(){
				if(_s == null) return;
				_s.pointerHolder_do.setWidth(_s.text_do.getWidth());
				_s.pointerHolder_do.setHeight(_s.text_do.getHeight());
				_s.positionPointer();
			},50);
		};
		
		_s.positionPointer = function(){
			var finalX;
			var finalY;

			finalX = parseInt((_s.w - _s.text_do.getWidth())/2) + _s.pointerOffsetX;
			finalY = _s.h - _s.text_do.getHeight();
			_s.pointer_do.setX(parseInt( _s.text_do.getWidth() - 8)/2);
			_s.pointer_do.setY(_s.text_do.getHeight());
			_s.pointerHolder_do.setX(finalX);
			_s.pointerHolder_do.setY(finalY - _s.borderSize);
		};
		
		
		//##########################################//
		/* parse vtt file */
		//##########################################//
		_s.parseVtt = function(file_str){
			 _s.isLoaded_bl = true;
			 function strip(s) {
				if(s ==  undefined) return "";
		        return s.replace(/^\s+|\s+$/g,"");
		     }
			 
			file_str = file_str.replace(/\r\n|\r|\n/g, '\n');
			file_str = strip(file_str);
		    var srt_ = file_str.split('\n\n');
		    
		    var cont = 0;
			
		    for(var s in srt_) {
		        var st = srt_[s].split('\n');
		        if(st.length >=2) {
		            //define variable type as Object
		            _s.vtt_ar[cont] = {};
		            _s.vtt_ar[cont].start = strip(st[0].split(' --> ')[0]);
		            _s.vtt_ar[cont].end = strip(st[0].split(' --> ')[1]);
					_s.vtt_ar[cont].imagePath = strip(st[1]);
		            _s.vtt_ar[cont].startDuration = FWDEVPUtils.formatTimeWithMiliseconds(_s.vtt_ar[cont].start);
		            _s.vtt_ar[cont].endDuration = FWDEVPUtils.formatTimeWithMiliseconds(_s.vtt_ar[cont].end);
		        }
		        cont++;
		    }
			_s.vtt_ar.splice(0,1);
		};
		

		//################################################//
		/* Add remove from DOM */
		//################################################//
		_s.add = function(){
			if(controller.contains(_s)) controller.removeChild(_s);
			controller.addChild(_s);
		}
		
		_s.remove =  function(){
			_s.pointerOffsetX = 0;
			_s.destroyHLS();
			_s.stopToDraw();
			_s.stopToLoad();
			_s.hide();
			if(controller.contains(_s)) controller.removeChild(_s);
			if(_s.ctx){
				_s.ctx.clearRect(0, 0, _s.tW, _s.tH);
			}
		}
		

		//################################################//
		/* Hide and show */
		//################################################//
		_s.show = function(animate){
			if(!controller.contains(_s)) return;
			//_s.add();
			_s.duration = controller.prt.totalTimeInSeconds;
			if(!_s.duration) return;
			_s.isShowed_bl = true;
			if(_s.videoType == FWDEVPlayer.VIDEO || _s.videoType == FWDEVPlayer.HLS_JS){
				_s.startToDraw();
			}
			clearTimeout(_s.hideWithDelayId_to);
			FWDAnimation.killTweensOf(_s);
			clearTimeout(_s.showWithDelayId_to);
			_s.showWithDelayId_to = setTimeout(_s.showFinal, 100);
		};
		
		_s.showFinal = function(){
			_s.setVisible(true);
			FWDAnimation.to(_s, .4, {alpha:1, onComplete:function(){_s.setVisible(true);}, ease:Quart.easeOut});
		};

		_s.hide = function(){
			if(!controller.contains(_s)) return;
			if(!_s.isShowed_bl) return;
			if(_s.videoType == FWDEVPlayer.VIDEO){
				_s.stopToDraw();
			}
			clearTimeout(_s.hideWithDelayId_to);
			_s.hideWithDelayId_to = setTimeout(function(){
				clearTimeout(_s.showWithDelayId_to);
				FWDAnimation.killTweensOf(_s);
				_s.setVisible(false);
				_s.isShowed_bl = false;	
				_s.setAlpha(0);
			}, 100);
			
		};
	
		
		_s.init();
	};
	
	
	/* set prototype */
	FWDEVPThumbnailsPreview.setPrototype = function(){
		FWDEVPThumbnailsPreview.prototype = null;
		FWDEVPThumbnailsPreview.prototype = new FWDEVPDO("div");
	};
	
	FWDEVPThumbnailsPreview.LOAD_ERROR = 'loadError';
	FWDEVPThumbnailsPreview.LOAD_COMPLETE = 'loadComplete';
	FWDEVPThumbnailsPreview.START_TO_SCRUB = "startToScrub";
	FWDEVPThumbnailsPreview.SCRUB = "scrub";
	FWDEVPThumbnailsPreview.STOP_TO_SCRUB = "stopToScrub";
	FWDEVPThumbnailsPreview.prototype = null;
	window.FWDEVPThumbnailsPreview = FWDEVPThumbnailsPreview;
}(window));