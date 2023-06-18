/**
 * Easy Video Player PACKAGED v9.1
 * Advertising button.
 *
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © 2006 All Rights Reserved.
 */
(function (window){

var FWDEVPAdsButton = function(
			prt,
			icon_img,
			iconOverPath_str,
			text_str,
			position_str,
			borderColorN_str,
			borderColorS_str,
			adsBackgroundPath_str,
			textNormalColor,
			textSelectedColor,
			useHEX,
		    nBC,
		    sBC
		){

		'use strict';
		
		var _s = this;
		var prototype = FWDEVPAdsButton.prototype;
		
		_s.icon_img = icon_img;
		
		_s.useHEX = useHEX; 
		_s.nBC = nBC;
		_s.sBC = sBC;
		
		_s.borderNColor_str = borderColorN_str;
		_s.borderSColor_str = borderColorS_str;
		_s.adsBackgroundPath_str = adsBackgroundPath_str;
		_s.position_str = position_str;
		_s.textNormalColor_str = textNormalColor;
		_s.textSelectedColor_str = textSelectedColor;
		_s.text_str = text_str;
		_s.iconOverPath_str = iconOverPath_str;
		_s.totalWidth = 215;
		_s.totalHeight = 64;
		_s.fontSize = 12;
		
		_s.isMobile_bl = FWDEVPUtils.isMobile;
		_s.hasPointerEvent_bl = FWDEVPUtils.hasPointerEvent;
		
	
		//##########################################//
		/* initialize _s */
		//##########################################//
		_s.init = function(){
			_s.setOverflow("visible");
			_s.setupMainContainers();
			_s.hide(false, true);
		};

		
		//##########################################//
		/* setup main containers */
		//##########################################//
		_s.setupMainContainers = function(){
			
			_s.main_do = new FWDEVPDO("div");
			_s.main_do.hasT3D = false;
			_s.main_do.hasT2D = false;
			_s.main_do.setBackfaceVisibility();
			
			_s.bk_do = new FWDEVPDO("div");
			_s.bk_do.style().background = "url('" + _s.adsBackgroundPath_str + "')";

		
			_s.text_do = new FWDEVPDO("div");
			_s.text_do.hasT3D = false;
			_s.text_do.hasT2D = false;
			_s.text_do.screen.className = 'fwdevp-skip';
			_s.text_do.setBackfaceVisibility();
			_s.text_do.setOverflow("visible");
			_s.text_do.style().display = "inline";
			_s.text_do.style().fontFamily = "Arial";
			_s.text_do.style().fontSize= "22px";
			_s.text_do.style().whiteSpace= "nowrap";
			_s.text_do.style().color = _s.textNormalColor_str;
			_s.text_do.style().fontSmoothing = "antialiased";
			_s.text_do.style().webkitFontSmoothing = "antialiased";
			_s.text_do.style().textRendering = "optimizeLegibility";
			
			
			_s.thumbHolder_do = new FWDEVPDO("div");
			_s.thumbHolder_do.setWidth(_s.totalHeight - 8);
			_s.thumbHolder_do.setHeight(_s.totalHeight - 8);
			_s.thumbHolder_do.setX(_s.totalWidth - _s.thumbHolder_do.w - 4);
			_s.thumbHolder_do.setY(4);
			
			_s.border_do = new FWDEVPDO("div");
			_s.border_do.style().border = "1px solid " + _s.borderNColor_str + "";
			_s.border_do.setButtonMode(true);
			_s.main_do.setWidth(_s.totalWidth);
			_s.main_do.setHeight(_s.totalHeight);
			_s.bk_do.setWidth(_s.totalWidth);
			_s.bk_do.setHeight(_s.totalHeight);
			if(_s.position_str == "left"){
				_s.border_do.setX(-1);
				_s.border_do.setWidth(_s.totalWidth - 1);
				_s.border_do.setHeight(_s.totalHeight -2);
			}else{
				_s.border_do.setWidth(_s.totalWidth);
				_s.border_do.setHeight(_s.totalHeight -2);
			}
			_s.setWidth(_s.totalWidth);
			_s.setHeight(_s.totalHeight);
			
			if(_s.useHEX){
				_s.icon_do = new FWDEVPDO("div");
				_s.icon_do.setWidth(_s.icon_img.width);
				_s.icon_do.setHeight(_s.icon_img.height);
				_s.icon_do_canvas = FWDEVPUtils.getCanvasWithModifiedColor(_s.icon_img, _s.nBC).canvas;
				_s.icon_do.screen.appendChild(_s.icon_do_canvas);
			}else{
				_s.icon_do = new FWDEVPDO("img");
				_s.icon_do.setScreen(_s.icon_img);
				_s.icon_do.setWidth(_s.icon_img.width);
				_s.icon_do.setHeight(_s.icon_img.height);
			}
			
			_s.iconS_img =  new Image();
			_s.iconS_img.src = _s.iconOverPath_str;
			
			if(_s.useHEX){
				_s.iconS_do = new FWDEVPDO("div");
				_s.iconS_do.setWidth(_s.icon_do.w);
				_s.iconS_do.setHeight(_s.icon_do.h);
				_s.iconS_img.onload = function(){
					_s.iconS_do_canvas = FWDEVPUtils.getCanvasWithModifiedColor(_s.iconS_img, _s.sBC).canvas;
					_s.iconS_do.screen.appendChild(_s.iconS_do_canvas);
				}
			}else{
				_s.iconS_do = new FWDEVPDO("img");
				_s.iconS_do.setScreen(_s.iconS_img);
				_s.iconS_do.setWidth(_s.icon_do.w);
				_s.iconS_do.setHeight(_s.icon_do.h);
			}
			
			_s.iconS_do.setAlpha(0);
		
			_s.main_do.addChild(_s.bk_do);
			_s.main_do.addChild(_s.text_do);
			_s.main_do.addChild(_s.thumbHolder_do);
			_s.main_do.addChild(_s.icon_do);
			_s.main_do.addChild(_s.iconS_do);
			_s.main_do.addChild(_s.border_do);
			
			if(FWDEVPUtils.isIEAndLessThen9){
				_s.dumy_do = new FWDEVPDO("div");
				_s.dumy_do.setBkColor("#00FF00");
				_s.dumy_do.setAlpha(.0001);
				_s.dumy_do.setWidth(_s.totalWidth);
				_s.dumy_do.setHeight(_s.totalHeight);
				_s.dumy_do.setButtonMode(true);
				_s.main_do.addChild(_s.dumy_do);
			}
			
			_s.addChild(_s.main_do);
			_s.updateText(_s.text_str);
			
			if(_s.hasPointerEvent_bl){
				_s.screen.addEventListener("pointerup", _s.onMUP);
				_s.screen.addEventListener("pointerover", _s.onMOV);
				_s.screen.addEventListener("pointerout", _s.onMOU);
			}else if(_s.screen.addEventListener){	
				if(!_s.isMobile_bl){
					_s.screen.addEventListener("mouseover", _s.onMOV);
					_s.screen.addEventListener("mouseout", _s.onMOU);
					_s.screen.addEventListener("mouseup", _s.onMUP);
				}
				_s.screen.addEventListener("touchend", _s.onMUP);
			}
			
		};
		
		_s.onMOV = function(e){
			if(!e.pointerType || e.pointerType == e.MSPOINTER_TYPE_MOUSE || e.pointerType == "mouse"){
				_s.setSelectedState();
			}
		};
			
		_s.onMOU = function(e){
			if(!e.pointerType || e.pointerType == e.MSPOINTER_TYPE_MOUSE || e.pointerType == "mouse"){
				_s.setNormalState();
			}
		};
		
		_s.onMUP = function(e){
			if(e.preventDefault) e.preventDefault();
			if(e.button == 2 || !_s.isShowed_bl) return;
			_s.dispatchEvent(FWDEVPAdsButton.MOUSE_UP);
		};

		
		//#####################################//
		/* Update text */
		//#####################################//
		_s.updateText = function(text){
			var totalWidth;
			_s.text_do.setInnerHTML(text);

			setTimeout(function(){
				totalWidth = _s.text_do.getWidth() + 8 + _s.iconS_do.w;
				_s.text_do.setX(parseInt(_s.totalWidth - totalWidth)/2);
				_s.text_do.setY(parseInt((_s.totalHeight - _s.text_do.getHeight())/2) + 2);
				_s.icon_do.setX(_s.text_do.x + totalWidth - _s.iconS_do.w);
				_s.icon_do.setY(parseInt((_s.totalHeight - _s.iconS_do.h)/2) + 2);
				_s.iconS_do.setX(_s.text_do.x + totalWidth - _s.iconS_do.w);
				_s.iconS_do.setY(parseInt((_s.totalHeight - _s.iconS_do.h)/2) + 2);
			}, 50);
		};


		//Resize button.
		_s.prvW;
		_s.resize = function(){
			if(!_s.isShowed_bl) return;
			
			var mbl;
			var tt = _s.totalWidth;
			 _s.prvW = prt.sW;
			 if(prt.sW < 600) mbl = true;

			if(mbl){
				_s.totalWidth = 64;
				tt = 64;	
			}else{
				_s.totalWidth = 215;
				tt = 215;
			}

			if(!_s.isShWithDl){
				if(_s.position_str == "right"){
					_s.main_do.setX(-_s.totalWidth);
				}
			}


			if(mbl){
				_s.text_do.setVisible(false);
				_s.icon_do.setX(Math.round((tt - _s.iconS_do.w)/2) - 1);
				_s.icon_do.setY(Math.round((_s.totalHeight - _s.iconS_do.h)/2));
			}else{
				_s.text_do.setVisible(true);
				_s.icon_do.setX(_s.text_do.x + _s.text_do.getWidth() + 8 + _s.iconS_do.w - _s.iconS_do.w);
				_s.icon_do.setY(parseInt((_s.totalHeight - _s.iconS_do.h)/2) + 2);
			}

			_s.iconS_do.setX(_s.icon_do.x);
			_s.iconS_do.setY(_s.icon_do.y);
			_s.setWidth(tt);
			_s.main_do.setWidth(tt);
			_s.bk_do.setWidth(tt);
			_s.border_do.setWidth(tt - 1);
			
		}

		
		//####################################//
		/* Set normal / selected state */
		//####################################//
		_s.setNormalState = function(){
			FWDAnimation.to(_s.iconS_do, .5, {alpha:0, ease:Expo.easeOut});	
			FWDAnimation.to(_s.text_do.screen, .5, {css:{color:_s.textNormalColor_str}, ease:Expo.easeOut});	
			FWDAnimation.to(_s.border_do.screen, .5, {css:{borderColor:_s.borderNColor_str}, ease:Expo.easeOut});	
		};
		
		_s.setSelectedState = function(){
			FWDAnimation.to(_s.iconS_do, .5, {alpha:1, ease:Expo.easeOut});	
			FWDAnimation.to(_s.text_do.screen, .5, {css:{color:_s.textSelectedColor_str}, ease:Expo.easeOut});	
			FWDAnimation.to(_s.border_do.screen, .5, {css:{borderColor:_s.borderSColor_str}, ease:Expo.easeOut});	
		};
	
		_s.show = function(animate){
			if(_s.isShowed_bl) return;
			_s.isShowed_bl = true;
			_s.isShWithDl = true;
			_s.resize();
			
			setTimeout(function(){
				_s.isShWithDl = false;
			}, 500);
			_s.setVisible(true);
			
			FWDAnimation.killTweensOf(_s.main_do);
			if(animate && !_s.isMobile_bl){
				if(_s.position_str == "left"){
					FWDAnimation.to(_s.main_do, .8, {x:0, delay:.8, ease:Expo.easeInOut});
				}else{
					FWDAnimation.to(_s.main_do, .8, {x:-_s.totalWidth + 1, delay:.8,  ease:Expo.easeInOut});
				}
			}else{
				if(_s.position_str == "left"){
					_s.main_do.setX(0);
				}else{
					_s.main_do.setX(-_s.totalWidth);
				}
			}
		};	
			
		_s.hide = function(animate, overwrite){
			if(!_s.isShowed_bl && !overwrite) return;
			_s.isShowed_bl = false;
			_s.isShWithDl = true;
			_s.hasThumbanil_bl = false;
			
			FWDAnimation.killTweensOf(_s.main_do);
			if(animate && !_s.isMobile_bl){
				if(_s.position_str == "left"){
					FWDAnimation.to(_s.main_do, .8, {x:-_s.totalWidth, ease:Expo.easeInOut, onComplete:_s.hideCompleteHandler});
				}else{
					FWDAnimation.to(_s.main_do, .8, {x:0, ease:Expo.easeInOut, onComplete:_s.hideCompleteHandler});
				}
			}else{
				if(_s.position_str == "left"){
					_s.main_do.setX(-_s.totalWidth);
				}else{
					_s.main_do.setX(0);
				} 
				_s.hideCompleteHandler();
			}
		};
		
		_s.hideCompleteHandler = function(){
			if(_s.smallImage_img){
				_s.smallImage_img.onload = null;
				_s.smallImage_img.src = "";
				FWDAnimation.killTweensOf(_s.icon_do);
			}
			if(_s.main_do.alpha != 1) _s.main_do.setAlpha(1);
			_s.thumbHolder_do.setVisible(false);
			_s.setVisible(false);
		};
		
		
		//###########################################//
		/* hide / show  opacity */
		//###########################################//
		_s.hideWithOpacity = function(){
			if(!FWDEVPUtils.isIEAndLessThen9){
				FWDAnimation.to(_s.main_do, .8, {alpha:.5});
			}
		};
		
		_s.showWithOpacity = function(){
			if(!FWDEVPUtils.isIEAndLessThen9){
				FWDAnimation.to(_s.main_do, .8, {alpha:1});
			}
		};
		
		//##########################################//
		/* Update HEX color of a canvaas */
		//##########################################//
		_s.updateHEXColors = function(nBC, sBC){
			FWDEVPUtils.changeCanvasHEXColor(_s.icon_img, _s.icon_do_canvas, nBC);
			FWDEVPUtils.changeCanvasHEXColor(_s.iconS_img, _s.iconS_do_canvas, sBC);
			_s.text_do.style().color = nBC;
			
			_s.borderNColor_str = nBC;
			_s.borderSColor_str = sBC;
			_s.border_do.style().border = "1px solid " + _s.borderNColor_str + "";
		}
			
		
		_s.init();
	};
	
	/* set prototype */
	FWDEVPAdsButton.setPrototype = function(){
		FWDEVPAdsButton.prototype = null;
		FWDEVPAdsButton.prototype = new FWDEVPDO("div");
	};
	
	FWDEVPAdsButton.CLICK = "onClick";
	FWDEVPAdsButton.MOUSE_OVER = "onMOV";
	FWDEVPAdsButton.SHOW_TOOLTIP = "showTooltip";
	FWDEVPAdsButton.MOUSE_OUT = "onMOU";
	FWDEVPAdsButton.MOUSE_UP = "onMouseDown";
	
	FWDEVPAdsButton.prototype = null;
	window.FWDEVPAdsButton = FWDEVPAdsButton;
}(window));﻿/**
 * Easy Video Player PACKAGED v9.1
 * Advertising info window.
 *
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © 2006 All Rights Reserved.
 */
(function (window){

var FWDEVPAdsStart = function(
			position_str,
			borderColorN_str,
			borderColorS_str,
			adsBackgroundPath_str,
			timeColor_str
		){

		'use strict';
		
		var _s = this;
		var prototype = FWDEVPAdsStart.prototype;
		
		_s.borderNColor_str = borderColorN_str;
		_s.borderSColor_str = borderColorS_str;
		_s.adsBackgroundPath_str = adsBackgroundPath_str;
		_s.position_str = position_str;
		_s.timeColor_str = timeColor_str;
		
		_s.totalWidth = 215;
		_s.totalHeight = 64;
		_s.fontSize = 12;
		
		_s.isMobile_bl = FWDEVPUtils.isMobile;
		_s.hasPointerEvent_bl = FWDEVPUtils.hasPointerEvent;
		
	
		//##########################################//
		/* initialize _s */
		//##########################################//
		_s.init = function(){
			_s.setOverflow("visible");
			_s.setupMainContainers();
			_s.hide(false, true);
		};
		

		//##########################################//
		/* setup main containers */
		//##########################################//
		_s.setupMainContainers = function(){
			
			_s.main_do = new FWDEVPDO("div");
			_s.main_do.hasT3D = false;
			_s.main_do.hasT2D = false;
			_s.main_do.setBackfaceVisibility();
			
			_s.bk_do = new FWDEVPDO("div");
			_s.bk_do.style().background = "url('" + _s.adsBackgroundPath_str + "')";
			
			_s.text_do = new FWDEVPDO("div");
			_s.text_do.hasT3D = false;
			_s.text_do.hasT2D = false;
			_s.text_do.screen.className = 'fwdevp-ads';
			_s.text_do.setBackfaceVisibility();
			_s.text_do.style().fontFamily = "Arial";
			_s.text_do.style().fontSize= "12px";
			_s.text_do.style().lineHeight = "18px";
			_s.text_do.style().textAlign = "center";
			_s.text_do.style().color = _s.timeColor_str;
			_s.text_do.setInnerHTML("...");
			
			_s.thumbHolder_do = new FWDEVPDO("div");
			_s.thumbHolder_do.setWidth(_s.totalHeight - 8);
			_s.thumbHolder_do.setHeight(_s.totalHeight - 8);
			_s.thumbHolder_do.setX(_s.totalWidth - _s.thumbHolder_do.w - 4);
			_s.thumbHolder_do.setY(4);
			
			_s.border_do = new FWDEVPDO("div");
			_s.border_do.style().border = "1px solid " + _s.borderNColor_str + "";
		
			_s.main_do.setWidth(_s.totalWidth);
			_s.main_do.setHeight(_s.totalHeight);
			_s.bk_do.setWidth(_s.totalWidth);
			_s.bk_do.setHeight(_s.totalHeight);
			if(_s.position_str == "left"){
				_s.border_do.setX(-1);
				_s.border_do.setWidth(_s.totalWidth - 1);
				_s.border_do.setHeight(_s.totalHeight -2);
			}else{
				_s.border_do.setWidth(_s.totalWidth);
				_s.border_do.setHeight(_s.totalHeight -2);
			}
			_s.setWidth(_s.totalWidth);
			_s.setHeight(_s.totalHeight);
		
			_s.main_do.addChild(_s.bk_do);
			_s.main_do.addChild(_s.text_do);
			_s.main_do.addChild(_s.thumbHolder_do);
			_s.main_do.addChild(_s.border_do);
			
			_s.addChild(_s.main_do);
		};
		

		//#####################################//
		/* load thumbnail */
		//#####################################//
		_s.loadThumbnail = function(path){
			_s.hasThumbanil_bl = true;
			if(!_s.thumbnail_do){
				_s.thumbnail_do = new FWDEVPDO("img");
				_s.smallImage_img = new Image();
			}
			
			_s.thumbHolder_do.setVisible(true);
			_s.smallImage_img.onload = _s.onSmallImageLoad;
			_s.smallImage_img.src = path;
		};
		
		_s.onSmallImageLoad = function(){
			_s.smallImageOriginalW = _s.smallImage_img.width;
			_s.smallImageOriginalH = _s.smallImage_img.height;
			_s.thumbnail_do.setScreen(_s.smallImage_img);
			_s.thumbHolder_do.addChild(_s.thumbnail_do);
			
			var scaleX = _s.thumbHolder_do.w/_s.smallImageOriginalW;
			var scaleY = _s.thumbHolder_do.h/_s.smallImageOriginalH;
			var totalScale = 0;
			
			if(scaleX >= scaleY){
				totalScale = scaleX;
			}else if(scaleX <= scaleY){
				totalScale = scaleY;
			}
			
			_s.thumbnail_do.setWidth(Math.round(_s.smallImageOriginalW * totalScale));
			_s.thumbnail_do.setHeight(Math.round(_s.smallImageOriginalH * totalScale));
			_s.thumbnail_do.setX(Math.round((_s.thumbHolder_do.w - _s.thumbnail_do.w)/2));
			_s.thumbnail_do.setY(Math.round((_s.thumbHolder_do.h - _s.thumbnail_do.h)/2));
			_s.thumbnail_do.setAlpha(0);
			FWDAnimation.to(_s.thumbnail_do, .8, {alpha:1});
		};
		

		//#####################################//
		/* Update text */
		//#####################################//
		_s.updateText = function(text){
			_s.text_do.setInnerHTML(text);
			
			if(_s.hasThumbanil_bl){
				_s.text_do.setX(16);
				_s.text_do.setWidth(_s.totalWidth - _s.totalHeight - 26);
			}else{
				_s.text_do.setX(8);
				_s.text_do.setWidth(_s.totalWidth - 16);
			}
			
			_s.text_do.setY(parseInt((_s.totalHeight - _s.text_do.getHeight())/2));
		};
	

		//#####################################//
		/* show / hide */
		//#####################################//
		_s.show = function(animate){
			if(_s.isShowed_bl) return;
			
			_s.isShowed_bl = true;
			_s.setVisible(true);
			
			FWDAnimation.killTweensOf(_s.main_do);
			if(animate && !_s.isMobile_bl){
				if(_s.position_str == "left"){
					FWDAnimation.to(_s.main_do, .8, {x:0, delay:.2, ease:Expo.easeInOut});
				}else{
					FWDAnimation.to(_s.main_do, .8, {x:-_s.totalWidth + 1, delay:.2,  ease:Expo.easeInOut});
				}
			}else{
				if(_s.position_str == "left"){
					_s.main_do.setX(0);
				}else{
					_s.main_do.setX(-_s.totalWidth);
				}
			}
		};	
			
		_s.hide = function(animate, overwrite){
			if(!_s.isShowed_bl && !overwrite) return;
			
			_s.isShowed_bl = false;
			_s.hasThumbanil_bl = false;
			
			FWDAnimation.killTweensOf(_s.main_do);
			if(animate && !_s.isMobile_bl){
				if(_s.position_str == "left"){
					FWDAnimation.to(_s.main_do, .8, {x:-_s.totalWidth, ease:Expo.easeInOut, onComplete:_s.hideCompleteHandler});
				}else{
					FWDAnimation.to(_s.main_do, .8, {x:0, ease:Expo.easeInOut, onComplete:_s.hideCompleteHandler});
				}
			}else{
				if(_s.position_str == "left"){
					_s.main_do.setX(-_s.totalWidth);
				}else{
					_s.main_do.setX(0);
				} 
				_s.hideCompleteHandler();
			}
		};
		
		_s.hideCompleteHandler = function(){
			if(_s.smallImage_img){
				_s.smallImage_img.onload = null;
				_s.smallImage_img.src = "";
				FWDAnimation.killTweensOf(_s.thumbnail_do);
			}
			
			if(_s.main_do.alpha != 1) _s.main_do.setAlpha(1);
			_s.thumbHolder_do.setVisible(false);
			_s.setVisible(false);
		};
		
		
		//###########################################//
		/* hide / show  opacity */
		//###########################################//
		_s.hideWithOpacity = function(){
			if(!FWDEVPUtils.isIEAndLessThen9){
				FWDAnimation.to(_s.main_do, .8, {alpha:.5});
			}
		};
		
		_s.showWithOpacity = function(){
			if(!FWDEVPUtils.isIEAndLessThen9){
				FWDAnimation.to(_s.main_do, .8, {alpha:1});
			}
		};
		
		_s.init();
	};
	
	/* set prototype */
	FWDEVPAdsStart.setPrototype = function(){
		FWDEVPAdsStart.prototype = null;
		FWDEVPAdsStart.prototype = new FWDEVPDO("div");
	};
	
	FWDEVPAdsStart.CLICK = "onClick";
	FWDEVPAdsStart.MOUSE_OVER = "onMouseOver";
	FWDEVPAdsStart.SHOW_TOOLTIP = "showTooltip";
	FWDEVPAdsStart.MOUSE_OUT = "onMouseOut";
	FWDEVPAdsStart.MOUSE_UP = "onMouseDown";
	
	FWDEVPAdsStart.prototype = null;
	window.FWDEVPAdsStart = FWDEVPAdsStart;
}(window));﻿/**
 * Easy Video Player PACKAGED v9.1
 * Annotation item.
 *
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © 2006 All Rights Reserved.
 */
(function (window){

var FWDEVPAnnotation = function(props_obj){

		'use strict';
		
		var _s = this;
		var prototype = FWDEVPAnnotation.prototype;
		
		_s.id = props_obj.id;
		_s.startTime = props_obj.start;
		_s.endTime = props_obj.end;
		_s.htmlContent_str = props_obj.content;
		_s.left = props_obj.left;
		_s.top = props_obj.top;
		_s.showCloseButton_bl = props_obj.showCloseButton_bl;
		_s.clickSource = props_obj.clickSource;
		_s.clickSourceTarget = props_obj.clickSourceTarget;
		_s.closeButtonNpath = props_obj.closeButtonNpath;
		_s.closeButtonSPath = props_obj.closeButtonSPath;
		_s.normalStateClass = props_obj.normalStateClass;
		_s.selectedStateClass = props_obj.selectedStateClass;
		_s.showAnnotationsPositionTool_bl = props_obj.showAnnotationsPositionTool_bl;
		_s.prt = props_obj.prt;
		_s.curX = _s.left;
		_s.curY = _s.top;
		
		_s.handPath_str = props_obj.handPath_str;
		_s.grabPath_str = props_obj.grabPath_str;
		
	
		//##########################################//
		/* initialize _s */
		//##########################################//
		_s.init = function(){
			_s.setOverflow("visible");
			_s.setAlpha(0);
			_s.setVisible(false);
			
			if(FWDEVPUtils.hasTransform2d){
				_s.style().transformOrigin = "0% 0%";
			}
			
			_s.screen.innerHTML = _s.htmlContent_str;
			_s.screen.className = _s.normalStateClass;
			_s.setBackfaceVisibility();
			_s.style().fontSmoothing = "antialiased";
			_s.style().webkitFontSmoothing = "antialiased";
			_s.style().textRendering = "optimizeLegibility";
			
			_s.dummy_do = new FWDEVPDO("div");
			_s.dummy_do.style().width = "100%";
			_s.dummy_do.style().height = "100%";
			_s.addChild(_s.dummy_do);
		
			setTimeout(function(){
				_s.w = _s.getWidth();
				_s.h = _s.getHeight();
			}, 100);
			
			if(_s.showCloseButton_bl && !_s.showAnnotationsPositionTool_bl){
				FWDEVPSimpleSizeButton.setPrototype();
				_s.closeButton_do = new FWDEVPSimpleSizeButton(
						_s.closeButtonNpath, 
						_s.closeButtonSPath,
						21,
						21
						);
			    _s.closeButton_do.setScale2(0);
				_s.closeButton_do.addListener(FWDEVPSimpleSizeButton.CLICK, _s.closeClickButtonCloseHandler);
				_s.closeButton_do.style().position = "absolute";
				_s.addChild(_s.closeButton_do);
			}
			
			if(_s.showAnnotationsPositionTool_bl){
				_s.info_do = new FWDEVPDO("div");
				_s.info_do.style().backgroundColor = "#FFFFFF";
				_s.info_do.style().boxShadow = "2px 2px 2px #888888;";
				
				_s.info_do.style().fontSmoothing = "antialiased";
				_s.info_do.style().webkitFontSmoothing = "antialiased";
				_s.info_do.style().textRendering = "optimizeLegibility";
				_s.addChild(_s.info_do);
				
				setTimeout(function(){
					_s.info_do.screen.innerHTML = "<div style='padding:4px; maring:4px; color:#000000'> _d-left=" + Math.round(_s.curX * _s.prt.scaleInverse)  + "</div><div style='padding:4px; margin:4px; color:#000000;'> _d-top=" + Math.round(_s.curY * _s.prt.scaleInverse)  + "</div>";
					
					_s.setX(Math.round(_s.curX * _s.prt.scale));
					_s.setY(Math.round(_s.curY * _s.prt.scale));
				}, 100)
				if(_s.isMobile_bl){
				if(_s.hasPointerEvent_bl){
						_s.screen.addEventListener("pointerdown", _s.onMD);
					}else{
						_s.screen.addEventListener("touchdown", _s.onMD);
					}
				}else{
					if(window.addEventListener){
						_s.screen.addEventListener("mousedown", _s.onMD);		
					}
				}
				_s.style().cursor = 'url(' + _s.handPath_str + '), default';
			}
		
			if(_s.clickSource && !_s.showAnnotationsPositionTool_bl){
				_s.dummy_do.setButtonMode(true);
				_s.dummy_do.screen.addEventListener("click", _s.onCLK);
				_s.dummy_do.screen.addEventListener("mouseover", _s.onMOV);
				_s.dummy_do.screen.addEventListener("mouseout", _s.onMOU);
			}
			
			
		};
		
		_s.onMD =  function(e){
			if(e.preventDefault) e.preventDefault();
			
			_s.style().cursor = 'url(' + _s.grabPath_str + '), default';
			_s.prt.addChild(_s);
			
			var viewportMouseCoordinates = FWDEVPUtils.getViewportMouseCoordinates(e);	
			_s.startX = viewportMouseCoordinates.screenX - _s.prt.getGlobalX();
			_s.startY = viewportMouseCoordinates.screenY - _s.prt.getGlobalY();
			_s.curX = _s.x;
			_s.curY = _s.y;
		
			if(_s.isMobile_bl){
				if(_s.hasPointerEvent_bl){
					window.addEventListener("pointermove", _s.onMMV);
					window.addEventListener("pointerup", _s.onMUP);
				}else{
					window.addEventListener("touchmove", _s.onMMV);
					window.addEventListener("touchend", _s.onMUP);
				}
			}else{
				if(window.addEventListener){
					window.addEventListener("mousemove", _s.onMMV);
					window.addEventListener("mouseup", _s.onMUP);		
				}
			}
		};
		
		_s.onMMV = function(e){
			if(e.preventDefault) e.preventDefault();
			
			var viewportMouseCoordinates = FWDEVPUtils.getViewportMouseCoordinates(e);	
			_s.localX = viewportMouseCoordinates.screenX - _s.prt.getGlobalX();
			_s.localY = viewportMouseCoordinates.screenY - _s.prt.getGlobalY();
			
			_s.curX = _s.x;
			_s.curY = _s.y;
			_s.curX += (_s.localX - _s.startX);
			_s.curY += (_s.localY - _s.startY);
			
			_s.setX(_s.curX);
			_s.setY(_s.curY);
			_s.startX = viewportMouseCoordinates.screenX - _s.prt.getGlobalX();
			_s.startY = viewportMouseCoordinates.screenY - _s.prt.getGlobalY();
			
			_s.info_do.screen.innerHTML = "<div style='padding:4px; maring:4px; color:#000000'> _d-left=" + Math.round(_s.curX * _s.prt.scaleInverse)  + "</div><div style='padding:4px; margin:4px; color:#000000;'> _d-top=" + Math.round(_s.curY * _s.prt.scaleInverse)  + "</div>";
		};
		
		_s.onMUP = function(e){
			_s.style().cursor = 'url(' + _s.handPath_str + '), default';
			if(_s.isMobile_bl){
				if(_s.hasPointerEvent_bl){
					window.removeEventListener("pointermove", _s.onMMV);
					window.removeEventListener("pointerup", _s.onMUP);
				}else{
					window.removeEventListener("touchmove", _s.onMMV);
					window.removeEventListener("touchend", _s.onMUP);
				}
			}else{
				if(window.removeEventListener){
					window.removeEventListener("mousemove", _s.onMMV);
					window.removeEventListener("mouseup", _s.onMUP);		
				}
			}
		};
		
		_s.onMOV = function(e){
			_s.setSelectedAtate();
		};
		
		_s.onMOU = function(e){
			_s.setNormalState();
		};
		
		_s.onCLK = function(){
			if(_s.clickSource.indexOf("http") != -1){
				window.open(_s.clickSource, _s.target);
			}else{
				eval(_s.clickSource);
			}
		};
		
		_s.closeClickButtonCloseHandler = function(){
			_s.hide();
			_s.isClosed_bl = true;
		};
	
		_s.show = function(){
			if(_s.isShowed_bl || _s.isClosed_bl) return;
			_s.isShowed_bl = true;
			_s.setVisible(true);
			FWDAnimation.killTweensOf(_s);
			FWDAnimation.to(_s, .8, {alpha:1, ease:Quint.easeOut});
			if(_s.closeButton_do) FWDAnimation.to(_s.closeButton_do, .8, {scale:1, delay:.2, ease:Elastic.easeOut});
		};
		
		_s.hide = function(){
			if(!_s.isShowed_bl) return;
			FWDAnimation.killTweensOf(_s);
			_s.isShowed_bl = false;
			_s.setVisible(false);
			_s.setAlpha(0);
			if(_s.closeButton_do){
				FWDAnimation.killTweensOf(_s.closeButton_do);
				_s.closeButton_do.setScale2(0);
			}
		};
		
		_s.setNormalState = function(){
			if(!_s.selectedStateClass) return;
			FWDAnimation.to(_s.screen, .8, {className:_s.normalStateClass, ease:Quint.easeOut});
		};
		
		_s.setSelectedAtate = function(){
			if(!_s.selectedStateClass) return;
			FWDAnimation.to(_s.screen, .8, {className:_s.selectedStateClass, ease:Quint.easeOut});
		};
		
		_s.init();
	};
	
	/* set prototype */
	FWDEVPAnnotation.setPrototype = function(){
		FWDEVPAnnotation.prototype = null;
		FWDEVPAnnotation.prototype = new FWDEVPDO("div", 0, 0, 1);
	};
	
	
	FWDEVPAnnotation.prototype = null;
	window.FWDEVPAnnotation = FWDEVPAnnotation;
}(window));﻿/**
 * Easy Video Player PACKAGED v9.1
 * Annotations manager.
 *
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © 2006 All Rights Reserved.
 */
(function (window){

var FWDEVPAnnotations = function(prt, _d){

		'use strict';
		
		var _s = this;
		var prototype = FWDEVPAnnotations.prototype;
		
		_s.source_ar = _d.annotations_ar;
		_s.ann_ar = [];
		_s.totalAnnotations = _s.source_ar.length;
		_s.showAnnotationsPositionTool_bl = _d.showAnnotationsPositionTool_bl;
	

		//##########################################//
		/* initialize _s */
		//##########################################//
		_s.init = function(){
			_s.setOverflow("visible");
			_s.setupAnnotations();
		};

		
		//##########################################//
		/* setup text containers */
		//##########################################//
		_s.setupAnnotations = function(){
			
			for(var i=0; i<_s.totalAnnotations; i++){
				
				FWDEVPAnnotation.setPrototype();
				var ann = new FWDEVPAnnotation({
					id:i,
					start:_s.source_ar[i].start,
					end:_s.source_ar[i].end,
					left:_s.source_ar[i].left,
					top:_s.source_ar[i].top,
					clickSource:_s.source_ar[i].clickSource,
					clickSourceTarget:_s.source_ar[i].clickSourceTarget,
					content:_s.source_ar[i].content,
					showCloseButton_bl:_s.source_ar[i].showCloseButton_bl,
					closeButtonNpath:_d.annotationAddCloseNPath_str,
					closeButtonSPath:_d.annotationAddCloseSPath_str,
					normalStateClass:_s.source_ar[i].normalStateClass,
					selectedStateClass:_s.source_ar[i].selectedStateClass,
					showAnnotationsPositionTool_bl:_s.showAnnotationsPositionTool_bl,
					prt:_s,
					handPath_str:_d.handPath_str,
					grabPath_str:_d.grabPath_str
				}) 
				
				_s.ann_ar[i] = ann;
				
				_s.addChild(ann);
			}	
		};
		
		_s.update = function(duration){
			
			if(_s.totalAnnotations == 0 || duration == 0) return;
			var annotation;
			
			for(var i=0; i<_s.totalAnnotations; i++){
				annotation = _s.ann_ar[i];
				if(duration <0){
					annotation.hide();
				}else if(duration >= annotation.startTime && duration <= annotation.endTime){
					annotation.show();
					_s.position();
				}else{
					annotation.hide();
				}
			}	
		
		};
		
		
		_s.position = function(animate){
			
			var selfScale = prt.sW/prt.maxWidth;
			_s.setX(Math.round((prt.sW - (selfScale * prt.maxWidth))/2));
			_s.setY(Math.round((prt.tempVidStageHeight - (selfScale * prt.maxHeight))/2));
			
			_s.scale = prt.sW/prt.maxWidth;
			_s.scaleY = _s.scale;
			_s.scaleX = _s.scale;
			
			_s.scaleInverse = prt.maxWidth/prt.sW;
			
			if(_s.showAnnotationsPositionTool_bl) return;
			for(var i=0; i<_s.totalAnnotations; i++){
				var ann_do = _s.ann_ar[i];
				
				var finalX = 0;
				var finalY = 0;
				
				ann_do.setScale2(_s.scale);
			
				ann_do.finalX = Math.floor(ann_do.left * _s.scaleX);
				ann_do.finalY = Math.floor(ann_do.top * _s.scaleY);
				
				if(ann_do.closeButton_do){
					ann_do.closeButton_do.setWidth(ann_do.closeButton_do.buttonWidth * _s.scaleInverse);
					ann_do.closeButton_do.setHeight(ann_do.closeButton_do.buttonHeight * _s.scaleInverse);
					ann_do.closeButton_do.n_do.setWidth(ann_do.closeButton_do.buttonWidth * _s.scaleInverse);
					ann_do.closeButton_do.n_do.setHeight(ann_do.closeButton_do.buttonHeight * _s.scaleInverse);
					ann_do.closeButton_do.s_do.setWidth(ann_do.closeButton_do.buttonWidth * _s.scaleInverse);
					ann_do.closeButton_do.s_do.setHeight(ann_do.closeButton_do.buttonHeight * _s.scaleInverse);
					ann_do.closeButton_do.setX(Math.floor(ann_do.getWidth() - ((ann_do.closeButton_do.w/2))));
					ann_do.closeButton_do.setY(Math.floor(-(ann_do.closeButton_do.h/2)));
				}
				
				if(ann_do.prevFinalX != ann_do.finalX){
					if(animate){
						FWDAnimation.to(ann_do, .8, {x:ann_do.finalX, ease:Expo.easeInOut});
					}else{
						ann_do.setX(ann_do.finalX);
					}
					
				}
			
				if(ann_do.prevFinalY != ann_do.finalY){
					if(animate){
						FWDAnimation.to(ann_do, .8, {y:ann_do.finalY, ease:Expo.easeInOut});
					}else{
						ann_do.setY(ann_do.finalY);
					}
				}
				
				ann_do.prevFinalX = ann_do.finalX;
				ann_do.prevFinalY = ann_do.finalY
			
			}

			
		};
	
		_s.init();
	};
	
	
	/* set prototype */
	FWDEVPAnnotations.setPrototype = function(){
		FWDEVPAnnotations.prototype = null;
		FWDEVPAnnotations.prototype = new FWDEVPDO("div", "absolute");
	};
	
	
	FWDEVPAnnotations.prototype = null;
	window.FWDEVPAnnotations = FWDEVPAnnotations;
}(window));/**
 * Easy Video Player PACKAGED v9.1
 * Audio screen.
 *
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © 2006 All Rights Reserved.
 */
(function(window){
	
	var FWDEVPAudioScreen = function(prt, volume){

		'use strict';
		
		var _s = this;
		var prototype = FWDEVPAudioScreen.prototype;
	
		_s.audio_el = null;
	
		_s.sourcePath_str = null;
		
		_s.lastPercentPlayed = 0;
		_s.volume = volume;
		_s.curDuration = 0;
		_s.countNormalMp3Errors = 0;
		_s.countShoutCastErrors = 0;
		_s.maxShoutCastCountErrors = 5;
		_s.maxNormalCountErrors = 1;
		_s.testShoutCastId_to;
		
		_s.audioVisualizerLinesColor_str = FWDEVPUtils.hexToRgb(prt._d.audioVisualizerLinesColor_str);
		_s.audioVisualizerCircleColor_str = FWDEVPUtils.hexToRgb(prt._d.audioVisualizerCircleColor_str);
		_s.hasError_bl = true;
		_s.isStopped_bl = true;
		
		

		//###############################################//
		/* init */
		//###############################################//
		_s.init = function(){
			_s.setupAudio();
		};

		
		//##############################################//
		/* Resize and position */
		//##############################################//
		_s.resizeAndPosition = function(width, height){
			if(width){
				_s.sW = width;
				_s.sH = height;
			}
			
			_s.setWidth(_s.sW);
			_s.setHeight(_s.sH);
			_s.resizeSpectrumCanvas()
		};

	
		//###############################################//
		/* Setup audio element */
		//##############################################//
		_s.setupAudio = function(){
			if(_s.audio_el == null){
				_s.audio_el = document.createElement("audio");
				_s.screen.appendChild(_s.audio_el);
				_s.audio_el.controls = false;
				_s.audio_el.preload = "auto";
				_s.audio_el.volume = _s.volume;
				if(!FWDEVPUtils.isLocal) _s.audio_el.crossOrigin = "*";
				_s.setPlaybackRate(prt._d.defaultPlaybackRate_ar[prt._d.startAtPlaybackIndex]);
			}
			
			_s.audio_el.addEventListener("error", _s.errorHandler);
			_s.audio_el.addEventListener("canplay", _s.safeToBeControlled);
			_s.audio_el.addEventListener("canplaythrough", _s.safeToBeControlled);
			_s.audio_el.addEventListener("progress", _s.updateProgress);
			_s.audio_el.addEventListener("timeupdate", _s.updateAudio);
			_s.audio_el.addEventListener("pause", _s.pauseHandler);
			_s.audio_el.addEventListener("play", _s.playHandler);
			_s.audio_el.addEventListener("ended", _s.endedHandler);
		};
		
		_s.destroyAudio = function(){
			if(_s.audio_el){
				_s.audio_el.removeEventListener("error", _s.errorHandler);
				_s.audio_el.removeEventListener("canplay", _s.safeToBeControlled);
				_s.audio_el.removeEventListener("canplaythrough", _s.safeToBeControlled);
				_s.audio_el.removeEventListener("progress", _s.updateProgress);
				_s.audio_el.removeEventListener("timeupdate", _s.updateAudio);
				_s.audio_el.removeEventListener("pause", _s.pauseHandler);
				_s.audio_el.removeEventListener("play", _s.playHandler);
				_s.audio_el.removeEventListener("ended", _s.endedHandler);
				_s.audio_el.removeEventListener("waiting", _s.startToBuffer);
				_s.audio_el.removeEventListener("playing", _s.stopToBuffer);
				_s.audio_el.src = "";
				_s.audio_el.load();
			}
		};
		
		_s.startToBuffer = function(overwrite){
			_s.dispatchEvent(FWDEVPVideoScreen.START_TO_BUFFER);
		};
		
		_s.stopToBuffer = function(){
			_s.dispatchEvent(FWDEVPVideoScreen.STOP_TO_BUFFER);
		};
		
		_s.togglePlayPause = function(){
			if(_s == null) return;
			if(!_s.isSafeToBeControlled_bl) return;
			if(_s.isPlaying_bl){
				_s.pause();
			}else{
				_s.play();
			}
		};

		
		//##########################################//
		/* Video error handler. */
		//##########################################//
		_s.errorHandler = function(e){
			if(_s.sourcePath_str == null || _s.sourcePath_str == undefined) return;
			
			if(_s.isNormalMp3_bl && _s.countNormalMp3Errors <= _s.maxNormalCountErrors){
				_s.stop();
				_s.testShoutCastId_to = setTimeout(_s.play, 200);
				_s.countNormalMp3Errors ++;
				return;
			}
			
			if(_s.isShoutcast_bl && _s.countShoutCastErrors <= _s.maxShoutCastCountErrors && _s.audio_el.networkState == 0){
				_s.testShoutCastId_to = setTimeout(_s.play, 200);
				_s.countShoutCastErrors ++;
				return;
			}
			
			var error_str;
			_s.hasError_bl = true;
			_s.stop();
			
			if(_s.audio_el.networkState == 0){
				error_str = "Error - networkState = 0";
			}else if(_s.audio_el.networkState == 1){
				error_str = "Error - networkState = 1";
			}else if(_s.audio_el.networkState == 2){
				error_str = "Error networkState = 2";
			}else if(_s.audio_el.networkState == 3){
				error_str = "Source not found";
			}else{
				error_str = e;
			}
			
			if(window.console) window.console.log(_s.audio_el.networkState);
			
			_s.dispatchEvent(FWDEVPAudioScreen.ERROR, {text:error_str });
		};
		

		//##############################################//
		/* Set path */
		//##############################################//
		_s.setSource = function(sourcePath){
			
			_s.sourcePath_str = sourcePath;
			
			clearTimeout(_s.testShoutCastId_to);
		
			if(_s.sourcePath_str.indexOf(";") != -1){
				_s.isShoutcast_bl = true;
				_s.countShoutCastErrors = 0;
			}else{
				_s.isShoutcast_bl = false;
			}
			
			if(_s.sourcePath_str.indexOf(";") == -1){
				_s.isNormalMp3_bl = true;
				_s.countNormalMp3Errors = 0;
			}else{
				_s.isNormalMp3_bl = false;
			}
			
			_s.lastPercentPlayed = 0;
		};

	
		//##########################################//
		/* Play / pause / stop methods */
		//##########################################//
		_s.play = function(overwrite){
			if(_s.isStopped_bl){
				_s.isPlaying_bl = false;
				_s.hasError_bl = false;
				_s.allowScrubing_bl = false;
				_s.isStopped_bl = false;
				_s.setupAudio();
				_s.audio_el.src = _s.sourcePath_str;
				_s.play();
				_s.setVisible(true);
			}else if(!_s.audio_el.ended || overwrite){
				try{
					_s.isPlaying_bl = true;
					_s.hasPlayedOnce_bl = true;
					_s.audio_el.play();
					
					if(FWDEVPUtils.isIE) _s.dispatchEvent(FWDEVPAudioScreen.PLAY);
				}catch(e){};
			}
		};
		
		_s.resume = function(){
			if(_s.isStopped_bl) return;
			_s.play();
		};

		_s.pause = function(){
			if(_s == null) return;
			if(_s.audio_el == null) return;
			if(!_s.audio_el.ended){
				_s.audio_el.pause();
				_s.isPlaying_bl = false;
				if(FWDEVPUtils.isIE) _s.dispatchEvent(FWDEVPAudioScreen.PAUSE);
			}
		};
		
		_s.pauseHandler = function(){
			if(_s.allowScrubing_bl) return;
			_s.stopSpectrum();
			_s.dispatchEvent(FWDEVPAudioScreen.PAUSE);
		};
		
		_s.playHandler = function(){
			if(_s.allowScrubing_bl) return;
			if(!_s.isStartEventDispatched_bl){
				_s.dispatchEvent(FWDEVPAudioScreen.START);
				_s.isStartEventDispatched_bl = true;
			}
		
			_s.startSpectrum();
			_s.dispatchEvent(FWDEVPAudioScreen.PLAY);
		};
		
		_s.endedHandler = function(){
			_s.dispatchEvent(FWDEVPAudioScreen.PLAY_COMPLETE);
		};
		
		_s.stop = function(overwrite){
			
			if((_s == null || _s.audio_el == null || _s.isStopped_bl) && !overwrite) return;
			_s.isPlaying_bl = false;
			_s.isStopped_bl = true;
			_s.hasPlayedOnce_bl = true;
			_s.isSafeToBeControlled_bl = false;
			_s.isStartEventDispatched_bl = false;
			_s.setVisible(false);
			clearTimeout(_s.testShoutCastId_to);
			_s.stopToUpdateSubtitles();
			_s.stopSpectrum();
			_s.audio_el.pause();
			_s.destroyAudio();
			_s.dispatchEvent(FWDEVPAudioScreen.STOP);
			_s.dispatchEvent(FWDEVPAudioScreen.LOAD_PROGRESS, {percent:0});
			_s.dispatchEvent(FWDEVPAudioScreen.UPDATE_TIME, {curTime:"00:00" , totalTime:"00:00"});
		};


		//###########################################//
		/* Check if audio is safe to be controlled */
		//###########################################//
		_s.safeToBeControlled = function(){
			if(!_s.isSafeToBeControlled_bl){
				_s.hasHours_bl = Math.floor(_s.audio_el.duration / (60 * 60)) > 0;
				_s.isPlaying_bl = true;
				_s.isSafeToBeControlled_bl = true;
				_s.startToUpdateSubtitles();
				_s.dispatchEvent(FWDEVPAudioScreen.SAFE_TO_SCRUBB);
				_s.dispatchEvent(FWDEVPAudioScreen.SAFE_TO_UPDATE_VOLUME);
			}
		};
	

		//###########################################//
		/* Update progress */
		//##########################################//
		_s.updateProgress = function(){
			var buffered;
			var percentLoaded = 0;
			
			if(_s.audio_el.buffered.length > 0){
				buffered = _s.audio_el.buffered.end(_s.audio_el.buffered.length - 1);
				percentLoaded = buffered.toFixed(1)/_s.audio_el.duration.toFixed(1);
				if(isNaN(percentLoaded) || !percentLoaded) percentLoaded = 0;
			}
			
			if(percentLoaded == 1) _s.audio_el.removeEventListener("progress", _s.updateProgress);
			
			_s.dispatchEvent(FWDEVPAudioScreen.LOAD_PROGRESS, {percent:percentLoaded});
		};

		
		//##############################################//
		/* Update audio */
		//#############################################//
		_s.updateAudio = function(){
			var percentPlayed; 
			if (!_s.allowScrubing_bl) {
				percentPlayed = _s.audio_el.currentTime /_s.audio_el.duration;
				_s.dispatchEvent(FWDEVPAudioScreen.UPDATE, {percent:percentPlayed});
			}
			
			var totalTime = FWDEVPUtils.formatTime(Math.round(_s.audio_el.duration));
			var curTime = FWDEVPUtils.formatTime(Math.round(_s.audio_el.currentTime));
			
			
			if(!isNaN(_s.audio_el.duration)){
				_s.dispatchEvent(FWDEVPAudioScreen.UPDATE_TIME, {curTime: curTime, totalTime:totalTime, seconds:_s.audio_el.currentTime, totalTimeInSeconds:_s.audio_el.duration});
			}else{
				_s.dispatchEvent(FWDEVPAudioScreen.UPDATE_TIME, {curTime:"00:00" , totalTime:"00:00", seconds:_s.audio_el.currentTime});
			}
			_s.lastPercentPlayed = percentPlayed;
			_s.curDuration = curTime;
		};

		
		//###############################################//
		/* Scrub */
		//###############################################//
		_s.startToScrub = function(){
			_s.allowScrubing_bl = true;
		};
		
		_s.stopToScrub = function(){
			_s.allowScrubing_bl = false;
		};
		
		_s.scrubbAtTime = function(duration){
			_s.audio_el.currentTime = duration;
			var totalTime = FWDEVPUtils.formatTime(_s.audio_el.duration);
			var curTime = FWDEVPUtils.formatTime(_s.audio_el.currentTime);
			_s.dispatchEvent(FWDEVPVideoScreen.UPDATE_TIME, {curTime: curTime, totalTime:totalTime});
		};
		
		_s.scrub = function(percent, e){
			if(_s.audio_el == null || !_s.audio_el.duration) return;
			if(e) _s.startToScrub();
			try{
				_s.audio_el.currentTime = _s.audio_el.duration * percent;
				var totalTime = FWDEVPUtils.formatTime(_s.audio_el.duration);
				var curTime = FWDEVPUtils.formatTime(_s.audio_el.currentTime);
				_s.dispatchEvent(FWDEVPAudioScreen.UPDATE_TIME, {curTime: curTime, totalTime:totalTime});
			}catch(e){}
		};

		
		//###############################################//
		/* replay */
		//###############################################//
		_s.replay = function(){
			_s.scrub(0);
			_s.play();
		};
		

		//###############################################//
		/* Volume */
		//###############################################//
		_s.setVolume = function(vol){
			
			if(vol != undefined) _s.volume = vol;
		
			if(_s.audio_el) _s.audio_el.volume = _s.volume;
		};
		
		_s.setPlaybackRate = function(rate){
			if(!_s.audio_el) return;
			if(rate == 0.25) rate = "0.5";
			
			_s.audio_el.defaultPlaybackRate = rate;
			_s.audio_el.playbackRate = rate;
		}
		

		//##################################################//
		/* Subtitles */
		//##################################################//
		_s.stopToUpdateSubtitles = function(){
			clearInterval(_s.startToUpdateSubtitleId_int);	
		}
		
		_s.startToUpdateSubtitles = function(){
			clearInterval(_s.startToUpdateSubtitleId_int);
			_s.startToUpdateSubtitleId_int = setInterval(_s.updateSubtitleHandler, 10);
		}
		
		_s.updateSubtitleHandler = function(){
			_s.dispatchEvent(FWDEVPAudioScreen.UPDATE_SUBTITLE, {curTime:_s.audio_el.currentTime});
		}
		

		//####################################################//
		/* Spectrum visualizer */
		//###################################################//
		_s.setupSpectrum = function(){
			if(prt.useWithoutVideoScreen_bl) return;
			var audioContextTest = window.AudioContext || window.webkitAudioContext;
			if(_s.canvas_do || !audioContextTest) return;
			if(FWDEVPAudioScreen.countAudioContext > 3) return;
			FWDEVPAudioScreen.countAudioContext ++;
			_s.canvas_do = new FWDEVPDO("canvas");
			
			_s.addChild(_s.canvas_do);
			
			_s.canvas = _s.canvas_do.screen;
			_s.ctx = _s.canvas.getContext("2d");
			
			_s.resizeSpectrumCanvas();
			
			if(!audioContextTest) return;
			_s.context = new audioContextTest();
			_s.analyser = _s.context.createAnalyser();
			// route audio playback
			_s.source = _s.context.createMediaElementSource(_s.audio_el);
			_s.source.connect(_s.analyser);
			_s.analyser.connect(_s.context.destination);
			
			_s.fbc_array = new Uint8Array(_s.analyser.frequencyBinCount);
			_s.renderSpectrum();
		}
		
		_s.resizeSpectrumCanvas =  function(){
			if(!_s.canvas_do) return;
			_s.canvas_do.setWidth(_s.sW);
			_s.canvas_do.setHeight(_s.sH);
			_s.canvas.width  = _s.sW;
			_s.canvas.height = _s.sH;
		}
		
		
		// give vars an initial real value to validate
		_s.bars = 200;
		if(FWDEVPUtils.isMobile) _s.bars = 100;
		_s.react_x = 0;
		_s.react_y = 0;
		_s.radius = 0;
		_s.deltarad = 0;
		_s.shockwave = 0;
		_s.rot = 0;
		_s.intensity = 0;
		_s.isSeeking = 0;
		_s.center_x;
		_s.center_y;
		
		
		_s.renderSpectrum = function() {
			if(!_s.canvas_do) return;
			_s.resizeSpectrumCanvas(); // for some reason i have to resize the _s.canvas every update or else the framerate decreases over time
						
			var grd = _s.ctx.createLinearGradient(0, 0, 0, _s.canvas.height);
			grd.addColorStop(0, "rgba(0, 0, 0, 1)");
			grd.addColorStop(1, "rgba(0, 0, 0, 1)");

			_s.ctx.fillStyle = grd;
			_s.ctx.fillRect(0, 0, _s.canvas.width, _s.canvas.height);
			
			_s.ctx.fillStyle = "rgba(255, 255, 255, " + (_s.intensity * 0.0000125 - 0.4) + ")";
			_s.ctx.fillRect(0, 0, _s.canvas.width, _s.canvas.height);
				
			_s.rot = _s.rot + _s.intensity * 0.0000001;
				
			_s.react_x = 0;
			_s.react_y = 0;
						
			_s.intensity = 0;
						
			_s.analyser.getByteFrequencyData(_s.fbc_array);
			
			for (var i = 0; i < _s.bars; i++) {
				var rads = Math.PI * 2 / _s.bars;
								
				var bar_x = _s.center_x;
				var bar_y = _s.center_y;
			
				var limit =  _s.sH/3;
				if(isNaN(limit)) limit = 10;
				var bar_height = Math.round(_s.fbc_array[i]/256 * limit)
				
				var bar_width = Math.round(bar_height * 0.02);
								
				var bar_x_term = _s.center_x + Math.cos(rads * i + _s.rot) * (_s.radius + bar_height);
				var bar_y_term = _s.center_y + Math.sin(rads * i + _s.rot) * (_s.radius + bar_height);
								
				_s.ctx.save();
				
				var lineColor = _s.audioVisualizerLinesColor_str;
								
				_s.ctx.strokeStyle = lineColor;
				_s.ctx.lineWidth = bar_width;
				_s.ctx.beginPath();
				_s.ctx.moveTo(bar_x, bar_y);
				_s.ctx.lineTo(bar_x_term, bar_y_term);
				_s.ctx.stroke();
							
				_s.react_x += Math.cos(rads * i + _s.rot) * (_s.radius + bar_height);
				_s.react_y += Math.sin(rads * i + _s.rot) * (_s.radius + bar_height);
							
				_s.intensity += bar_height;
			}
						
			_s.center_x = _s.canvas.width / 2 - (_s.react_x * 0.007);
			_s.center_y = _s.canvas.height / 2 - (_s.react_y * 0.007);
						
			var radius_old = _s.radius;
			_s.radius =  25 + (_s.intensity * 0.002);
			_s.deltarad = _s.radius - radius_old;
						
			_s.ctx.fillStyle = _s.audioVisualizerCircleColor_str;
			_s.ctx.beginPath();
			_s.ctx.arc(_s.center_x, _s.center_y, _s.radius + 2, 0, Math.PI * 2, false);
			_s.ctx.fill();
			
			// shockwave effect			
			_s.shockwave += 60;
						
			_s.ctx.lineWidth = 15;
			_s.ctx.strokeStyle = _s.audioVisualizerCircleColor_str;
			_s.ctx.beginPath();
			_s.ctx.arc(_s.center_x, _s.center_y, _s.shockwave + _s.radius, 0, Math.PI * 2, false);
			_s.ctx.stroke();
						
						
			if (_s.deltarad > 15) {
				_s.shockwave = 0;
				
				_s.ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
				_s.ctx.fillRect(0, 0, _s.canvas.width, _s.canvas.height);
				
				_s.rot = _s.rot + 0.4;
			}
			
			_s.startSpectrum();
			
		}
		
		_s.startSpectrum = function(){
			if(!_s.canvas_do) return;
			_s.stopSpectrum();
			_s.spectrumAnimationFrameId = window.requestAnimationFrame(_s.renderSpectrum);
		}
		
		_s.stopSpectrum = function(){
			if(!_s.canvas_do) return;
			cancelAnimationFrame(_s.spectrumAnimationFrameId);
		}
		

	
		_s.init();
	};


	/* set prototype */
	FWDEVPAudioScreen.setPrototype = function(){
		FWDEVPAudioScreen.prototype = new FWDEVPDO("div");
	};
	
	FWDEVPAudioScreen.UPDATE_SUBTITLE = "updateSubtitle";
	FWDEVPAudioScreen.countAudioContext = 0;
	FWDEVPAudioScreen.ERROR = "error";
	FWDEVPAudioScreen.UPDATE = "update";
	FWDEVPAudioScreen.UPDATE = "update";
	FWDEVPAudioScreen.UPDATE_TIME = "updateTime";
	FWDEVPAudioScreen.SAFE_TO_SCRUBB = "safeToControll";
	FWDEVPAudioScreen.SAFE_TO_UPDATE_VOLUME = "safeToUpdateVolume";
	FWDEVPAudioScreen.LOAD_PROGRESS = "loadProgress";
	FWDEVPAudioScreen.START = "start";
	FWDEVPAudioScreen.PLAY = "play";
	FWDEVPAudioScreen.PAUSE = "pause";
	FWDEVPAudioScreen.STOP = "stop";
	FWDEVPAudioScreen.PLAY_COMPLETE = "playComplete";



	window.FWDEVPAudioScreen = FWDEVPAudioScreen;

}(window));/**
 * Easy Video Player PACKAGED v9.1
 * Complex button.
 *
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © 2006 All Rights Reserved.
 */
(function (){
	
	var FWDEVPComplexButton = function(
			n1Img, 
			s1Path, 
			n2Img, 
			s2Path, 
			disptachMainEvent_bl,
			useHEX,
		    nBC,
		    sBC,
			iconCSSString, 
			icon2CSSString, 
			normalCalssName,
			selectedCalssName
		){

		'use strict';
		
		var _s = this;
		var prototype = FWDEVPComplexButton.prototype;
		
		_s.iconCSSString = iconCSSString;
		_s.icon2CSSString = icon2CSSString;
		_s.normalCalssName = normalCalssName;
		_s.selectedCalssName = selectedCalssName;
		
		_s.n1Img = n1Img;
		_s.s1Path_str = s1Path;
		_s.n2Img = n2Img;
		_s.s2Path_str = s2Path;
		
		if(_s.n1Img){
			_s.buttonWidth = _s.n1Img.width;
			_s.buttonHeight = _s.n1Img.height;
		}
		
		_s.useHEX = useHEX;
		_s.nBC = nBC;
		_s.sBC = sBC;

		_s.currentState = 1;
		_s.disptachMainEvent_bl = disptachMainEvent_bl;
		_s.isMobile_bl = FWDEVPUtils.isMobile;
		_s.hasPointerEvent_bl = FWDEVPUtils.hasPointerEvent;
		_s.allowToCreateSecondButton_bl = !_s.isMobile_bl || _s.hasPointerEvent_bl;
		_s.useFontAwesome_bl = Boolean(_s.iconCSSString);
		

		//##########################################//
		/* initialize _s */
		//##########################################//
		_s.init = function(){
			_s.hasT2D = false;
			_s.setButtonMode(true);
			_s.setWidth(_s.buttonWidth);
			_s.setHeight(_s.buttonHeight);
			_s.setupMainContainers();
			_s.secondButton_do.setVisible(false);
			_s.setNormalState();
		};
		

		//##########################################//
		/* setup main containers */
		//##########################################//
		_s.setupMainContainers = function(){
			if(_s.useFontAwesome_bl){
				_s.firstButton_do = new FWDEVPDO("div");
				_s.n1_do = new FWDEVPDO("div");	
				_s.n1_do.hasT3D = false;
				_s.n1_do.hasT2D = false;
				_s.n1_do.setInnerHTML(_s.iconCSSString);
				_s.firstButton_do.addChild(_s.n1_do);
				
				
				//Second button
				_s.secondButton_do = new FWDEVPDO("div");
				_s.n2_do = new FWDEVPDO("div");	
				_s.n2_do.hasT3D = false;
				_s.n2_do.hasT2D = false;
				_s.n2_do.setInnerHTML(_s.icon2CSSString);
				_s.secondButton_do.addChild(_s.n2_do);
				
				_s.setFinalSize();
				
			}else{
			
				_s.firstButton_do = new FWDEVPDO("div");
				_s.firstButton_do.setWidth(_s.buttonWidth);
				_s.firstButton_do.setHeight(_s.buttonHeight);
				
				if(_s.useHEX){
					_s.n1_do = new FWDEVPDO("div");
					_s.n1_do.setWidth(_s.buttonWidth);
					_s.n1_do.setHeight(_s.buttonHeight);
					_s.n1_sdo_canvas = FWDEVPUtils.getCanvasWithModifiedColor(_s.n1Img, _s.nBC).canvas;
					_s.n1_do.screen.appendChild(_s.n1_sdo_canvas);			
				}else{
					_s.n1_do = new FWDEVPDO("img");	
					_s.n1_do.setScreen(_s.n1Img);
				}
				_s.n1_do.setAlpha(1);
				_s.firstButton_do.addChild(_s.n1_do);
				
				if(_s.allowToCreateSecondButton_bl){
					
					_s.s1_img = new Image();
					_s.s1_img.src = _s.s1Path_str;
					
					if(_s.useHEX){
						_s.s1_do = new FWDEVPDO("div");
						_s.s1_do.setWidth(_s.buttonWidth);
						_s.s1_do.setHeight(_s.buttonHeight);
						_s.s1_img.onload = function(){
							_s.s1_do_canvas = FWDEVPUtils.getCanvasWithModifiedColor(_s.s1_img, _s.sBC).canvas;
							_s.s1_do.screen.appendChild(_s.s1_do_canvas);
						}
						_s.s1_do.setAlpha(0);
					}else{
						_s.s1_do = new FWDEVPDO("img");
						_s.s1_do.setScreen(_s.s1_img);
						_s.s1_do.setWidth(_s.buttonWidth);
						_s.s1_do.setHeight(_s.buttonHeight);
						_s.s1_do.setAlpha(0);
					}
					_s.firstButton_do.addChild(_s.s1_do);
				}
							
				//Second button
				_s.secondButton_do = new FWDEVPDO("div");
				_s.secondButton_do.setWidth(_s.buttonWidth);
				_s.secondButton_do.setHeight(_s.buttonHeight);
				
				if(_s.useHEX){
					_s.n2_do = new FWDEVPDO("div");
					_s.n2_do.setWidth(_s.buttonWidth);
					_s.n2_do.setHeight(_s.buttonHeight);
					_s.n2_sdo_canvas = FWDEVPUtils.getCanvasWithModifiedColor(_s.n2Img, _s.nBC).canvas;
					_s.n2_do.screen.appendChild(_s.n2_sdo_canvas);			
				}else{
					_s.n2_do = new FWDEVPDO("img");	
					_s.n2_do.setScreen(_s.n2Img);
				}
				_s.n2_do.setAlpha(1);
				_s.secondButton_do.addChild(_s.n2_do);
				
				if(_s.allowToCreateSecondButton_bl){
					
					_s.s2_img = new Image();
					_s.s2_img.src = _s.s2Path_str;
					
					if(_s.useHEX){
						_s.s2_do = new FWDEVPDO("div");
						_s.s2_do.setWidth(_s.buttonWidth);
						_s.s2_do.setHeight(_s.buttonHeight);
						_s.s2_img.onload = function(){
							_s.s2_do_canvas = FWDEVPUtils.getCanvasWithModifiedColor(_s.s2_img, _s.sBC).canvas;
							_s.s2_do.screen.appendChild(_s.s2_do_canvas);
						}
						_s.s2_do.setAlpha(0);
					}else{
						_s.s2_do = new FWDEVPDO("img");
						_s.s2_do.setScreen(_s.s2_img);
						_s.s2_do.setWidth(_s.buttonWidth);
						_s.s2_do.setHeight(_s.buttonHeight);
						_s.s2_do.setAlpha(0);
					}
					_s.secondButton_do.addChild(_s.s2_do);
				}	
			}
			
			_s.addChild(_s.secondButton_do);
			_s.addChild(_s.firstButton_do);
			
			if(_s.hasPointerEvent_bl){
				_s.screen.addEventListener("pointerup", _s.onMUP);
				_s.screen.addEventListener("pointerover", _s.onMOV);
				_s.screen.addEventListener("pointerout", _s.onMOU);
			}else if(_s.screen.addEventListener){	
				if(!_s.isMobile_bl){
					_s.screen.addEventListener("mouseover", _s.onMOV);
					_s.screen.addEventListener("mouseout", _s.onMOU);
					_s.screen.addEventListener("mouseup", _s.onMUP);
				}
				_s.screen.addEventListener("toustart", _s.onDown);
				_s.screen.addEventListener("touchend", _s.onMUP);
			}
		};
		
		_s.onMOV = function(e, animate){
			if(_s.isDisabled_bl || _s.isSelectedState_bl) return;
			if(!e.pointerType || e.pointerType == e.MSPOINTER_TYPE_MOUSE || e.pointerType == "mouse"){
				_s.dispatchEvent(FWDEVPComplexButton.MOUSE_OVER, {e:e});
				_s.dispatchEvent(FWDEVPComplexButton.SHOW_TOOLTIP, {e:e});
				_s.setSelectedState(true);
			}
		};
			
		_s.onMOU = function(e){
			if(_s.isDisabled_bl || !_s.isSelectedState_bl) return;
			if(!e.pointerType || e.pointerType == e.MSPOINTER_TYPE_MOUSE || e.pointerType == "mouse"){
				_s.setNormalState(true);
				_s.dispatchEvent(FWDEVPComplexButton.MOUSE_OUT);
			}
		};
		
		_s.onDown = function(e){
			if(e.preventDefault) e.preventDefault();
		};
	
		_s.onMUP = function(e){
			if(_s.isDisabled_bl || e.button == 2) return;
			if(e.preventDefault) e.preventDefault();
			if(!_s.isMobile_bl) _s.onMOV(e, false);
			if(_s.disptachMainEvent_bl) _s.dispatchEvent(FWDEVPComplexButton.MOUSE_UP, {e:e});
		};
		
		_s.checkCount = 0;
		_s.setFinalSize = function(){
			
			clearInterval(_s.checkId_int);
			_s.lastWidth = _s.n1_do.screen.firstChild.offsetWidth;
			if(_s.checkCount > 5) return;
			_s.checkCount ++;
				
			_s.checkId_int = setInterval(function(){
				_s.setFinalSize();
			},100);
			
			if(_s.prevWidth == _s.lastWidth || _s.lastWidth == 0) return;
			var maxWidth = Math.max(_s.n1_do.screen.firstChild.offsetWidth, _s.n2_do.screen.firstChild.offsetWidth); 
			var maxHeight = Math.max(_s.n1_do.screen.offsetHeight, _s.n2_do.screen.firstChild.offsetHeight); 
			_s.buttonWidth = maxWidth;
			_s.buttonHeight = maxHeight;
			
			_s.setWidth(maxWidth);
			_s.setHeight(maxHeight);
			_s.firstButton_do.setWidth(_s.w);
			_s.firstButton_do.setHeight(_s.h);
			_s.secondButton_do.setWidth(_s.w);
			_s.secondButton_do.setHeight(_s.h);
			
			_s.n1_do.setX(Math.round((maxWidth - _s.n1_do.getWidth())/2));
			_s.n1_do.setY(Math.round((maxHeight - _s.n1_do.getHeight())/2) + 1);
			_s.n2_do.setX(Math.round((maxWidth - _s.n2_do.getWidth())/2));
			_s.n2_do.setY(Math.round((maxHeight - _s.n2_do.getHeight())/2) + 1);
		
		
			_s.prevWidth = _s.lastWidth;
		}
		

		//##############################//
		/* toggle button */
		//#############################//
		_s.toggleButton = function(){
			if(_s.currentState == 1){
				_s.firstButton_do.setVisible(false);
				_s.secondButton_do.setVisible(true);
				_s.currentState = 0;
				_s.dispatchEvent(FWDEVPComplexButton.FIRST_BUTTON_CLICK);
			}else{
				_s.firstButton_do.setVisible(true);
				_s.secondButton_do.setVisible(false);
				_s.currentState = 1;
				_s.dispatchEvent(FWDEVPComplexButton.SECOND_BUTTON_CLICK);
			}
		};
		

		//##############################//
		/* set second buttons state */
		//##############################//
		_s.setButtonState = function(state){
			if(state == 1){
				_s.firstButton_do.setVisible(true);
				_s.secondButton_do.setVisible(false);
				_s.currentState = 1; 
			}else{
				_s.firstButton_do.setVisible(false);
				_s.secondButton_do.setVisible(true);
				_s.currentState = 0; 
			}
			
		};
		
		//###############################//
		/* set normal state */
		//################################//
		_s.setNormalState = function(animate){
			if(_s.isMobile_bl && !_s.hasPointerEvent_bl && !_s.useFontAwesome_bl) return;
			_s.isSelectedState_bl = false;
			FWDAnimation.killTweensOf(_s.s1_do);
			FWDAnimation.killTweensOf(_s.s2_do);
				
			if(_s.useFontAwesome_bl){
				FWDAnimation.killTweensOf(_s.n1_do.screen);
				FWDAnimation.killTweensOf(_s.n2_do.screen);
					
				if(animate){
					FWDAnimation.to(_s.n1_do.screen, .8, {className:_s.normalCalssName, ease:Expo.easeOut});	
					FWDAnimation.to(_s.n2_do.screen, .8, {className:_s.normalCalssName, ease:Expo.easeOut});
				}else{
					_s.n1_do.screen.className = _s.normalCalssName;
					_s.n2_do.screen.className = _s.normalCalssName;
				}
			}else{
				FWDAnimation.to(_s.s1_do, .5, {alpha:0, ease:Expo.easeOut});	
				FWDAnimation.to(_s.s2_do, .5, {alpha:0, ease:Expo.easeOut});
			}
		};
		
		_s.setSelectedState = function(animate){
			_s.isSelectedState_bl = true;
			FWDAnimation.killTweensOf(_s.s1_do);
			FWDAnimation.killTweensOf(_s.s2_do);
			
			if(_s.useFontAwesome_bl){
				
					FWDAnimation.killTweensOf(_s.n1_do.screen);
					FWDAnimation.killTweensOf(_s.n2_do.screen);
					if(animate){
						FWDAnimation.to(_s.n1_do.screen, .8, {className:_s.selectedCalssName, ease:Expo.easeOut});	
						FWDAnimation.to(_s.n2_do.screen, .8, {className:_s.selectedCalssName, ease:Expo.easeOut});	
					}else{
						_s.n1_do.screen.className = _s.selectedCalssName;
						_s.n2_do.screen.className = _s.selectedCalssName;
					}
			}else{
				
				FWDAnimation.to(_s.s1_do, .5, {alpha:1, delay:.1, ease:Expo.easeOut});
				FWDAnimation.to(_s.s2_do, .5, {alpha:1, delay:.1, ease:Expo.easeOut});
			}
		};
		
		_s.disable = function(){
			if(_s.isDisabled_bl) return;
			_s.isDisabled_bl = true;
			_s.setButtonMode(false);
			FWDAnimation.killTweensOf(_s);
			FWDAnimation.to(_s, .6, {alpha:.4});
			_s.setNormalState();
		};
		
		_s.enable = function(){
			if(!_s.isDisabled_bl) return;
			_s.isDisabled_bl = false;
			_s.setButtonMode(true);
			FWDAnimation.killTweensOf(_s);
			FWDAnimation.to(_s, .6, {alpha:1});
		};

		
		//##########################################//
		/* Update HEX color of a canvaas */
		//##########################################//
		_s.updateHEXColors = function(nBC, sBC){
			FWDEVPUtils.changeCanvasHEXColor(_s.n1Img, _s.n1_sdo_canvas, nBC);
			FWDEVPUtils.changeCanvasHEXColor(_s.s1_img, _s.s1_do_canvas, sBC);
			FWDEVPUtils.changeCanvasHEXColor(_s.n2Img, _s.n2_sdo_canvas, nBC);
			FWDEVPUtils.changeCanvasHEXColor(_s.s2_img, _s.s2_do_canvas, sBC);
		}
		
		_s.init();
	};
	
	
	/* set prototype */
	FWDEVPComplexButton.setPrototype = function(){
		FWDEVPComplexButton.prototype = new FWDEVPDO("div");
	};
	
	FWDEVPComplexButton.FIRST_BUTTON_CLICK = "onFirstClick";
	FWDEVPComplexButton.SECOND_BUTTON_CLICK = "secondButtonOnClick";
	FWDEVPComplexButton.MOUSE_OVER = "onMOV";
	FWDEVPComplexButton.MOUSE_OUT = "onMOU";
	FWDEVPComplexButton.MOUSE_UP = "onMUP";
	FWDEVPComplexButton.CLICK = "onClick";
	FWDEVPComplexButton.SHOW_TOOLTIP = "showTooltip";
	
	FWDEVPComplexButton.prototype = null;
	window.FWDEVPComplexButton = FWDEVPComplexButton;
}(window));/**
 * Easy Video Player PACKAGED v9.1
 * Right click context menu.
 *
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © 2006 All Rights Reserved.
 */
(function (){
	
	var FWDEVPContextMenu = function(prt, _d){

		'use strict';
		
		var _s = this;
		var prototype = FWDEVPContextMenu.prototype;
		_s.prt = prt;
		
		_s.buttonsTest_ar = ['copy_url', 'copy_url_time', 'fullscreen'];
		_s.itemsLabels_ar = ['Copy video URL', 'Copy video URL at current time', 'Fullscreen/Normalscreen'];
		_s.items_ar = [];
		_s.spacers_ar = [];
	
	
		_s.backgroundColor_str = _d.contextMenuBackgroundColor_str;
		_s.borderColor_str = _d.contextMenuBorderColor_str;
		_s.spacerColor_str = _d.contextMenuSpacerColor_str;
		_s.itemNormalColor_str = _d.contextMenuItemNormalColor_str;
		_s.itemSelectedColor_str = _d.contextMenuItemSelectedColor_str;
		_s.itemDisabledColor_str = _d.contextMenuItemDisabledColor_str;
		_s.draggingMode_str = _d.startDraggingMode_str;
		_s.link_str = _d.link_str;
		
		_s.borderRadius = 0;
		_s.totalWidth = 400;
		_s.totalHeight = 400;
		_s.sapaceBetweenButtons = 7;
		_s.padding = 6;
		
		_s.inverseNextAndPrevRotation_bl = _d.inverseNextAndPrevRotation_bl;
		_s.showScriptDeveloper_bl = _d.showScriptDeveloper_bl;
		_s.show_bl = false;
		
		_s.init = function(){
			
			if(_s.itemsLabels_ar && _d.contextMenuType == 'default'){
				_s.show_bl = true;
				_s.setWidth(_s.totalWidth);
				_s.setHeight(_s.totalHeight);
				_s.setBkColor(_s.backgroundColor_str);
				_s.style().borderColor = _s.borderColor_str;
				_s.style().borderStyle = "solid";
				_s.style().borderRadius = _s.borderRadius + "px";
				_s.style().borderWidth = "1px";
				_s.setVisible(false);
				_s.setY(-2000);
				_s.prt.main_do.addChild(_s);
				
				_s.setupLabels();	
				_s.setupDeveloperButton();
				_s.setupSpacers();
				_s.disable();
				_s.getMaxWidthResizeAndPositionId_to = setTimeout(_s.getMaxWidthResizeAndPosition, 200);
			}
			
			if(_d.contextMenuType != 'none'){
				_s.addContextEvent();
			}
		};
		

		_s.copyText = function(str){
		 	var el = document.createElement('textarea');
		 	el.value = str;
		  	document.body.appendChild(el);
		  	el.select();
		  	document.execCommand('copy');
		  	document.body.removeChild(el);
		};
		

		//##########################################//
		/* Setup context items. */
		//##########################################//
		_s.setupLabels = function(){
			var len = _s.buttonsTest_ar.length;
			var res;
			var label1_str = "";
			var label2_str = "";
			
			if(!_s.itemsLabels_ar) return;
			
			for(var i=0; i<len; i++){
				res = _s.buttonsTest_ar[i];	
				if(res == "copy_url"){
					label1_str = _s.itemsLabels_ar[i];
					FWDEVPContextMenuButton.setPrototype();
					_s.copyURL_do = new FWDEVPContextMenuButton(label1_str, undefined, _s.itemNormalColor_str, _s.itemSelectedColor_str, _s.itemDisabledColor_str);
					_s.items_ar.push(_s.copyURL_do);
					_s.copyURL_do.addListener(FWDEVPContextMenuButton.MOUSE_DOWN, _s.copyURLHandler);
					_s.addChild(_s.copyURL_do);
				}else if(res == "copy_url_time"){
					label1_str = _s.itemsLabels_ar[i];
					FWDEVPContextMenuButton.setPrototype();
					_s.copyURLTime_do = new FWDEVPContextMenuButton(label1_str, undefined, _s.itemNormalColor_str, _s.itemSelectedColor_str, _s.itemDisabledColor_str);
					_s.items_ar.push(_s.copyURLTime_do);
					_s.copyURLTime_do.addListener(FWDEVPContextMenuButton.MOUSE_DOWN, _s.copyURLAtTimeHandler);
					_s.addChild(_s.copyURLTime_do);
				}else if(res == "fullscreen"){
					if(_d.showFullScreenButton_bl){
						var str =  _s.itemsLabels_ar[i];
						label1_str = str.substr(0, str.indexOf("/"));
						label2_str = str.substr(str.indexOf("/") + 1);
						
						FWDEVPContextMenuButton.setPrototype();
						_s.fullScreenButton_do = new FWDEVPContextMenuButton(label1_str, label2_str, _s.itemNormalColor_str, _s.itemSelectedColor_str, _s.itemDisabledColor_str);
						_s.items_ar.push(_s.fullScreenButton_do);
						_s.fullScreenButton_do.addListener(FWDEVPContextMenuButton.MOUSE_DOWN, _s.fullScreenStartHandler);
						_s.addChild(_s.fullScreenButton_do);
					}
				}
			}
		};
		
		_s.setupDeveloperButton = function(){
			if(_s.showScriptDeveloper_bl){
				if(!_s.itemsLabels_ar) _s.itemsLabels_ar = [];
				_s.itemsLabels_ar.push("&#0169; made by FWD");
				label1_str = "&#0169; made by FWD";
				FWDEVPContextMenuButton.setPrototype();
				_s.developerButton_do = new FWDEVPContextMenuButton(label1_str, undefined, _s.itemNormalColor_str, _s.itemSelectedColor_str, _s.itemDisabledColor_str);
				_s.developerButton_do.isDeveleper_bl = true;
				_s.items_ar.push(_s.developerButton_do);
				_s.addChild(_s.developerButton_do);

			}
		};
		
		_s.copyURLAtTimeHandler = function(e){
			var curTime = prt.curTime;
			if(curTime.length == 5) curTime = '00:' + curTime;
			var time_ar = String(curTime).split(':');
			for(var i=0; i<time_ar.length; i++){
				if(time_ar[i] == '00') time_ar[i] = '0';
			}
			var args = FWDEVPUtils.getHashUrlArgs(window.location.hash);
			var href = location.href;
			href = href.replace(/&evpi=.*/i, '');
			href = href.replace(/&t=.*/i, '');
			
			if(location.href.indexOf('?') == -1){
				if(FWDEVPlayer.instaces_ar.length > 1){
					curTime = href + '?&evpi=' + prt.instanceName_str;
				}else{
					curTime = href + '?';
				}
			}else{
				if(FWDEVPlayer.instaces_ar.length > 1){
					curTime = href + '&evpi=' + prt.instanceName_str;
				}else{
					curTime = href;
				}
			}

			if(curTime.indexOf('t=') == -1) curTime = curTime + '&t=' + time_ar[0] +'h' + time_ar[1] +'m' + time_ar[2] +'s';
			_s.copyText(curTime);
			_s.removeMenuId_to = setTimeout(_s.removeFromDOM, 150);
		};
		
		
		_s.copyURLHandler = function(e){
			_s.copyText(location.href);
			_s.removeMenuId_to = setTimeout(_s.removeFromDOM, 150);
		};

		//full screen.
		_s.fullScreenStartHandler = function(e){
			if(_s.fullScreenButton_do.currentState == 0){
				prt.goFullScreen();
			}else if(_s.fullScreenButton_do.currentState == 1){
				prt.goNormalScreen();
			}
			_s.fullScreenButton_do.onMOU();
		};
		
		_s.updateFullScreenButton = function(currentState){
			if(!_s.fullScreenButton_do) return;
			if(currentState == 0){
				_s.fullScreenButton_do.setButtonState(0);
			}else{
				_s.fullScreenButton_do.setButtonState(1);
			}
			_s.removeMenuId_to = setTimeout(_s.removeFromDOM, 150);
		};
		
		
		//########################################//
		/* setup sapcers */
		//########################################//
		_s.setupSpacers = function(){
			var totalSpacers = _s.items_ar.length - 1;
			var spacer_sdo;
			
			for(var i=0; i<totalSpacers; i++){
				spacer_sdo = new FWDEVPDO("div");
				_s.spacers_ar[i] = spacer_sdo;
				spacer_sdo.setHeight(1);
				spacer_sdo.setBkColor(_s.spacerColor_str);
				_s.addChild(spacer_sdo);
			};
		};
		

		//########################################//
		/* Get max width and position */
		//#######################################//
		_s.getMaxWidthResizeAndPosition = function(){
			var totalItems = _s.items_ar.length;
			var item_do;
			var spacer;
			var finalX;
			var finalY;
			_s.totalWidth = 0;
			_s.totalHeight = 0;
			for(var i=0; i<totalItems; i++){
				item_do = _s.items_ar[i];
				if(item_do.getMaxTextWidth() > _s.totalWidth) _s.totalWidth = item_do.getMaxTextWidth();
			};
			
			for(var i=0; i<totalItems; i++){
				spacer = _s.spacers_ar[i - 1];
				item_do = _s.items_ar[i];
				item_do.setX(_s.padding);
				item_do.setY(10 + (i * (item_do.totalHeight + _s.sapaceBetweenButtons)) - _s.padding);
				
				if(spacer){
					spacer.setWidth(_s.totalWidth + 2);
					spacer.setX(_s.padding);
					spacer.setY(parseInt(item_do.getY() - _s.sapaceBetweenButtons/2) - 1);
				};
				
				
				item_do.setWidth(_s.totalWidth + 2);
				item_do.centerText();
			}
			
			_s.totalHeight = item_do.getY() + item_do.totalHeight + 2;
			
			_s.setWidth(_s.totalWidth + _s.padding * 2 + 4);
			_s.setHeight(_s.totalHeight);
			
			_s.setVisible(true);
			_s.removeMenuId_to = setTimeout(_s.removeFromDOM, 150);
		};
		

		//##########################################//
		/* Add context events. */
		//##########################################//
		_s.addContextEvent = function(){
			if(_s.prt.main_do.screen.addEventListener){
				_s.prt.main_do.screen.addEventListener("contextmenu", _s.contextMenuHandler);
			}else{
				_s.prt.main_do.screen.attachEvent("oncontextmenu", _s.contextMenuHandler);
			}
		};
		
		_s.contextMenuHandler = function(e){
			if(!_s.show_bl && _d.contextMenuType != 'none'){
				if(e.preventDefault){
					e.preventDefault();
				}else{
					return false;
				}
				return;
			}
			clearTimeout(_s.removeMenuId_to);
			_s.prt.main_do.addChild(_s);

			_s.positionButtons(e);
			_s.setAlpha(0);
			FWDAnimation.to(_s, .4, {alpha:1, ease:Quart.easeOut});
			window.addEventListener("mousedown", _s.onMD);
			window.addEventListener("mouseup", _s.onMD);
			
			if(e.preventDefault){
				e.preventDefault();
			}else{
				return false;
			}
		};
		
		_s.onMD = function(e){
			var viewportMouseCoordinates = FWDEVPUtils.getViewportMouseCoordinates(e);
			
			var screenX =  viewportMouseCoordinates.screenX;
			var screenY =  viewportMouseCoordinates.screenY;
			
			
			if(!FWDEVPUtils.hitTest(_s.screen, screenX, screenY)){
				
				window.removeEventListener("mousedown", _s.onMD);
				window.removeEventListener("mouseup", _s.onMD);
				
				_s.removeMenuId_to = setTimeout(_s.removeFromDOM, 150);
			}
		};
	

		//####################################//
		/* position buttons */
		//####################################//
		_s.positionButtons = function(e){
		
			var viewportMouseCoordinates = FWDEVPUtils.getViewportMouseCoordinates(e);
			var parentWidth = _s.prt.main_do.getWidth();
			var parentHeight = _s.prt.main_do.getHeight();
		
			var localX = viewportMouseCoordinates.screenX - _s.prt.main_do.getGlobalX();
			var localY = viewportMouseCoordinates.screenY - _s.prt.main_do.getGlobalY();
			var finalX = localX - 2;
			var finalY = localY - 2;
			_s.totalWidth = _s.getWidth();
			_s.totalHeight = _s.getHeight();
			
			if(finalX + _s.totalWidth > parentWidth - 2) finalX = localX - _s.totalWidth;
			if(finalX < 0) finalX = parseInt((parentWidth - _s.totalWidth)/2);
			if(finalX < 0) finalX = 0;
			
			if(finalY + _s.totalHeight > parentHeight - 2) finalY = localY - _s.totalHeight;
			if(finalY < 0) finalY = parseInt((parentHeight - _s.totalHeight)/2);
			if(finalY < 0) finalY = 0;
	
			_s.setX(finalX);
			_s.setY(finalY);			
		};
		

		//########################################//
		/* disable / enable */
		//########################################//
		_s.disable = function(){
			if(_s.copyURL_do) _s.copyURL_do.disable();
			if(_s.copyURLTime_do) _s.copyURLTime_do.disable();
			
		};
		
		_s.enable = function(){
			if(_s.copyURL_do) _s.copyURL_do.enable();
			if(_s.copyURLTime_do) _s.copyURLTime_do.enable();
		};
		

		//######################################//
		/* remove from DOM */
		//######################################//
		_s.removeFromDOM = function(){
			_s.setX(-5000);
		};
		
		_s.init();
	};
	
	FWDEVPContextMenu.setPrototype = function(){
		FWDEVPContextMenu.prototype = new FWDEVPDO("div");
	};
	
	
	FWDEVPContextMenu.prototype = null;
	window.FWDEVPContextMenu = FWDEVPContextMenu;
	
}(window));
/**
 * Easy Video Player PACKAGED v9.1
 * Context menu button.
 *
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © 2006 All Rights Reserved.
 */
(function (){
	
	var FWDEVPContextMenuButton = function(
			label1, 
			label2, 
			normalColor,
			selectedColor,
			disabledColor,
			padding
		){

		'use strict';
		
		var _s = this;
		var prototype = FWDEVPContextMenuButton.prototype;
		
		_s.label1_str = label1;
		_s.label2_str = label2;
		_s.nBC = normalColor;
		_s.sBC = selectedColor;
		_s.disabledColor_str = disabledColor;
		
		_s.totalWidth = 400;
		_s.totalHeight = 20;
		
		_s.isMobile_bl = FWDEVPUtils.isMobile;
		_s.currentState = 1;
		_s.showSecondButton_bl = label2 != undefined;
		
		//##########################################//
		/* initialize _s */
		//##########################################//
		_s.init = function(){
			_s.setBackfaceVisibility();
			_s.setButtonMode(true);
			_s.setupMainContainers();
			_s.setWidth(_s.totalWidth);
			_s.setHeight(_s.totalHeight);
			_s.setButtonState(0);
		};
		
		//##########################################//
		/* setup main containers */
		//##########################################//
		_s.setupMainContainers = function(){
			
			_s.text1_sdo = new FWDEVPDO("div");
			_s.text1_sdo.setBackfaceVisibility();
			_s.text1_sdo.setDisplay("inline-block");
			_s.text1_sdo.style().fontFamily = "Arial";
			_s.text1_sdo.style().fontSize= "12px";
			_s.text1_sdo.style().color = _s.nBC;
			_s.text1_sdo.style().fontSmoothing = "antialiased";
					_s.text1_sdo.setInnerHTML(_s.label1_str);
			_s.addChild(_s.text1_sdo);
			
			if(_s.showSecondButton_bl){
				_s.text2_sdo = new FWDEVPDO("div");
				_s.text2_sdo.setBackfaceVisibility();
				_s.text2_sdo.setDisplay("inline-block");
				_s.text2_sdo.style().fontFamily = "Arial";
				_s.text2_sdo.style().fontSize= "12px";
				_s.text2_sdo.style().color = _s.nBC;
				_s.text2_sdo.style().fontSmoothing = "antialiased";
				_s.text2_sdo.setInnerHTML(_s.label2_str);
				_s.addChild(_s.text2_sdo);
			}
			
			_s.dumy_sdo = new FWDEVPDO("div");
			if(FWDEVPUtils.isIE){
				_s.dumy_sdo.setBkColor("#FF0000");
				_s.dumy_sdo.setAlpha(0);
			};
			_s.addChild(_s.dumy_sdo);
			
			if(_s.isMobile_bl){
				_s.screen.addEventListener("touchstart", _s.onMD);
			}else if(_s.screen.addEventListener){
				_s.screen.addEventListener("mouseover", _s.onMOV);
				_s.screen.addEventListener("mouseout", _s.onMOU);
				_s.screen.addEventListener("mousedown", _s.onMD);
				_s.screen.addEventListener("click", _s.onCLK);
			}
		};
		
		_s.onMOV = function(animate){
			if(_s.isDisabled_bl) return;
			FWDAnimation.killTweensOf(_s.text1_sdo);
			if(animate){
				FWDAnimation.to(_s.text1_sdo.screen, .5, {css:{color:_s.sBC}, ease:Expo.easeOut});
				if(_s.showSecondButton_bl) FWDAnimation.to(_s.text2_sdo.screen, .5, {css:{color:_s.sBC}, ease:Expo.easeOut});
			}else{
				_s.text1_sdo.style().color = _s.sBC;
				if(_s.showSecondButton_bl){
					FWDAnimation.killTweensOf(_s.text2_sdo);
					_s.text2_sdo.style().color = _s.sBC;
				}
			}
			_s.dispatchEvent(FWDEVPContextMenuButton.MOUSE_OVER);
		};
			
		_s.onMOU = function(e){
			if(_s.isDisabled_bl) return;
			FWDAnimation.killTweensOf(_s.text1_sdo);
			FWDAnimation.to(_s.text1_sdo.screen, .5, {css:{color:_s.nBC}, ease:Expo.easeOut});
			
			if(_s.showSecondButton_bl){
				FWDAnimation.killTweensOf(_s.text2_sdo);
				FWDAnimation.to(_s.text2_sdo.screen, .5, {css:{color:_s.nBC}, ease:Expo.easeOut});
			}
			_s.dispatchEvent(FWDEVPContextMenuButton.MOUSE_OUT);
		};
		
		_s.onCLK = function(e){
			if(_s.isDeveleper_bl){
				window.open("http://www.webdesign-flash.ro", "_blank");
				return;
			}
			if(_s.isDisabled_bl) return;
			if(e.preventDefault) e.preventDefault();
			_s.dispatchEvent(FWDEVPContextMenuButton.CLICK);
		};
		
		_s.onMD = function(e){
			if(_s.isDisabled_bl) return;
			if(e.preventDefault) e.preventDefault();
			_s.dispatchEvent(FWDEVPContextMenuButton.MOUSE_DOWN, {e:e});
		};
		
		//##############################//
		/* toggle button */
		//#############################//
		_s.toggleButton = function(){
			if(!_s.showSecondButton_bl ) return;
			if(_s.currentState == 1){
				_s.text1_sdo.setVisible(true);
				_s.text2_sdo.setVisible(false);
				_s.currentState = 0;
				_s.dispatchEvent(FWDEVPContextMenuButton.FIRST_BUTTON_CLICK);
			}else{
				_s.text1_sdo.setVisible(false);
				_s.text2_sdo.setVisible(true);
				_s.currentState = 1;
				_s.dispatchEvent(FWDEVPContextMenuButton.SECOND_BUTTON_CLICK);
			}
		};
		
		//##############################//
		/* set second buttons state */
		//##############################//
		_s.setButtonState = function(state){
			if(state == 0){
				_s.text1_sdo.setVisible(true);
				if(_s.showSecondButton_bl) _s.text2_sdo.setVisible(false);
				_s.currentState = 0;
			}else if(state == 1){
				_s.text1_sdo.setVisible(false);
				if(_s.showSecondButton_bl) _s.text2_sdo.setVisible(true);
				_s.currentState = 1;
			}
		};		

		//##########################################//
		/* center text */
		//##########################################//
		_s.centerText = function(){
			_s.dumy_sdo.setWidth(_s.totalWidth);
			_s.dumy_sdo.setHeight(_s.totalHeight);
			if(FWDEVPUtils.isIEAndLessThen9){
				_s.text1_sdo.setY(Math.round((_s.totalHeight - _s.text1_sdo.getHeight())/2) - 1);
				if(_s.showSecondButton_bl) _s.text2_sdo.setY(Math.round((_s.totalHeight - _s.text2_sdo.getHeight())/2) - 1);
			}else{
				_s.text1_sdo.setY(Math.round((_s.totalHeight - _s.text1_sdo.getHeight())/2));
				if(_s.showSecondButton_bl) _s.text2_sdo.setY(Math.round((_s.totalHeight - _s.text2_sdo.getHeight())/2));
			}
			_s.text1_sdo.setHeight(_s.totalHeight + 2);
			if(_s.showSecondButton_bl) _s.text2_sdo.setHeight(_s.totalHeight + 2);
		};
		
		//###############################//
		/* get max text width */
		//###############################//
		_s.getMaxTextWidth = function(){
			var w1 = _s.text1_sdo.getWidth();
			var w2 = 0;
			if(_s.showSecondButton_bl) w2 = _s.text2_sdo.getWidth();
			return Math.max(w1, w2);
		};
		
		//##############################//
		/* disable /enable button */
		//##############################//
		_s.disable = function(){
			_s.isDisabled_bl = true;
			FWDAnimation.killTweensOf(_s.text1_sdo);
			FWDAnimation.to(_s.text1_sdo.screen, .5, {css:{color:_s.disabledColor_str}, ease:Expo.easeOut});
			_s.setButtonMode(false);
		};
		
		_s.enable = function(){
			_s.isDisabled_bl = false;
			FWDAnimation.killTweensOf(_s.text1_sdo);
			FWDAnimation.to(_s.text1_sdo.screen, .5, {css:{color:_s.nBC}, ease:Expo.easeOut});
			_s.setButtonMode(true);
		};
		
		_s.init();
	};
	
	/* set prototype */
	FWDEVPContextMenuButton.setPrototype = function(){
		FWDEVPContextMenuButton.prototype = new FWDEVPDO("div");
	};
	
	FWDEVPContextMenuButton.FIRST_BUTTON_CLICK = "onFirstClick";
	FWDEVPContextMenuButton.SECOND_BUTTON_CLICK = "secondButtonOnClick";
	FWDEVPContextMenuButton.MOUSE_OVER = "onMOV";
	FWDEVPContextMenuButton.MOUSE_OUT = "onMOU";
	FWDEVPContextMenuButton.MOUSE_DOWN = "onMD";
	FWDEVPContextMenuButton.CLICK = "onCLK";
	
	FWDEVPContextMenuButton.prototype = null;
	window.FWDEVPContextMenuButton = FWDEVPContextMenuButton;
}(window));/**
 * Easy Video Player PACKAGED v9.1
 * Control bar.
 *
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © 2006 All Rights Reserved.
 */
(function(){
	
	var FWDEVPController = function(
			_d,
			prt
		){

		'use strict';
		
		var _s = this;
		_s.prt = prt;
		var prototype = FWDEVPController.prototype;
		_s._d = _d;
		_s.bkLeft_img = _d.bkLeft_img;
		_s.bkRight_img = _d.bkRight_img;
		_s.playN_img = _d.playN_img;
		_s.playS_img = _d.playS_img;
		_s.pauseN_img = _d.pauseN_img;
		_s.pauseS_img = _d.pauseS_img;
		_s.mainScrubberBkLeft_img = _d.mainScrubberBkLeft_img;
		_s.mainScrubberBkRight_img = _d.mainScrubberBkRight_img;
		_s.mainScrubberDragLeft_img = _d.mainScrubberDragLeft_img;
		_s.mainScrubberDragLeftSource = _d.mainScrubberDragLeft_img.src;
		_s.mainScrubberLine_img = _d.mainScrubberLine_img;
		_s.volumeScrubberBkLeft_img = _d.volumeScrubberBkLeft_img;
		_s.volumeScrubberBkRight_img = _d.volumeScrubberBkRight_img;
		_s.volumeScrubberDragLeft_img = _d.volumeScrubberDragLeft_img;
		_s.volumeScrubberLine_img = _d.volumeScrubberLine_img;
		_s.volumeN_img = _d.volumeN_img;
		_s.volumeS_img = _d.volumeS_img;
		_s.volumeD_img = _d.volumeD_img;
		_s.progressLeft_img = _d.progressLeft_img;
		_s.ytbQualityN_img = _d.ytbQualityN_img;
		_s.ytbQualityS_img = _d.ytbQualityS_img;
		_s.ytbQualityD_img = _d.ytbQualityD_img;
		_s.shareN_img = _d.shareN_img;
		_s.subtitleN_img = _d.subtitleNPath_img;
		_s.facebookS_img = _d.facebookS_img;
		_s.fullScreenN_img = _d.fullScreenN_img;
		_s.fullScreenS_img = _d.fullScreenS_img;
		_s.normalScreenN_img = _d.normalScreenN_img;
		_s.normalScreenS_img = _d.normalScreenS_img;
		_s.embedN_img = _d.embedN_img;
		_s.showSubtitileByDefault_bl = _d.showSubtitileByDefault_bl;
		
		_s.buttons_ar = [];

		_s.isMainScrubberOnTop_bl = true;
		_s.bkMiddlePath_str = _d.bkMiddlePath_str;
		_s.mainScrubberBkMiddlePath_str = _d.mainScrubberBkMiddlePath_str;
		_s.volumeScrubberBkMiddlePath_str = _d.volumeScrubberBkMiddlePath_str;
		_s.mainScrubberDragMiddlePath_str = _d.mainScrubberDragMiddlePath_str;
		_s.volumeScrubberDragMiddlePath_str = _d.volumeScrubberDragMiddlePath_str;
		_s.timeColor_str = _d.timeColor_str;
		_s.progressMiddlePath_str = _d.progressMiddlePath_str;
		_s.youtubeQualityButtonNormalColor_str = _d.youtubeQualityButtonNormalColor_str;
		_s.youtubeQualityButtonSelectedColor_str = _d.youtubeQualityButtonSelectedColor_str;
		_s.youtubeQualityArrowPath_str = _d.youtubeQualityArrowPath_str;
		_s.controllerBkPath_str = _d.controllerBkPath_str;
		_s.ytbQualityButtonPointerPath_str = _d.ytbQualityButtonPointerPath_str;
		_s.subtitleSPath_str = _d.subtitleSPath_str;

		_s.mainScrubberOffestTop = _d.mainScrubberOffestTop;
		_s.totalYtbButtons = 0;
		_s.sW = 0;
		_s.sH = _d.controllerHeight;
		_s.scrubbersBkLeftAndRightWidth = _s.mainScrubberBkLeft_img.width;
		_s.mainScrubberWidth = 0;
		_s.mainScrubberMinWidth = 100;
		_s.volumeScrubberWidth = _d.volumeScrubberWidth;
		_s.scrubbersHeight = _s.mainScrubberBkLeft_img.height;
		_s.mainScrubberDragLeftWidth = _s.mainScrubberDragLeft_img.width;
		_s.scrubbersOffsetWidth = _d.scrubbersOffsetWidth;
		_s.volumeScrubberOffsetRightWidth = _d.volumeScrubberOffsetRightWidth;
		_s.volume = _d.volume;
		_s.lastVolume = _s.volume;
		_s.startSpaceBetweenButtons = _d.startSpaceBetweenButtons;
		_s.spaceBetweenButtons = _d.spaceBetweenButtons;
		_s.percentPlayed = 0;
		_s.percentLoaded = 0;
		_s.lastTimeLength = 0;
		_s.pointerWidth = 8;
		_s.pointerHeight = 5;
		_s.timeOffsetLeftWidth = _d.timeOffsetLeftWidth;
		_s.timeOffsetRightWidth = _d.timeOffsetRightWidth;
		
		_s.useHEX = _d.useHEX; 
		_s.nBC = _d.nBC;
		_s.sBC = _d.sBC;

		_s.showFullScreenButton_bl = _d.showFullScreenButton_bl;
		_s.showYoutubeQualityButton_bl = _d.showYoutubeQualityButton_bl;
		_s.showSubtitleButton_bl = _d.showSubtitleButton_bl;
		_s.showShareButton_bl = _d.showShareButton_bl;
		_s.showVolumeScrubber_bl = _d.showVolumeScrubber_bl;
		_s.allowToChangeVolume_bl = true;
		_s.showTime_bl = _d.showTime_bl;
		_s.showVolumeButton_bl = _d.showVolumeButton_bl;
		_s.showRewindButton_bl = _d.showRewindButton_bl;
		_s.showControllerWhenVideoIsStopped_bl = _d.showControllerWhenVideoIsStopped_bl;
		_s.showDownloadVideoButton_bl = _d.showDownloadVideoButton_bl;
		_s.showEmbedButton_bl = _d.showEmbedButton_bl;
		_s.showPlaybackRateButton_bl = _d.showPlaybackRateButton_bl;
		_s.useVectorIcons_bl = _d.useVectorIcons_bl
		_s.isShowed_bl = true;
		_s.areYtbQualityButtonsShowed_bl = true;
		_s.repeatBackground_bl = _d.repeatBackground_bl;
		_s.isMobile_bl = FWDEVPUtils.isMobile;
		_s.hasPointerEvent_bl = FWDEVPUtils.hasPointerEvent;


		//##########################################//
		/* initialize this */
		//##########################################//
		_s.init = function(){
			_s.setOverflow("visible");
			_s.mainHolder_do = new FWDEVPDO("div");
			_s.mainHolder_do.style().cursor = 'default';
			if(_d.useAToB) _s.setupATB();
			
			if(_s.repeatBackground_bl){
				_s.bk_do = new FWDEVPDO("div"); 
				_s.bk_do.style().background = "url('" + _s.controllerBkPath_str +  "')";
			}else{
				_s.bk_do = new FWDEVPDO("img");
				var img = new Image();
				img.src = _s.controllerBkPath_str;
				_s.bk_do.setScreen(img);	
			}
			_s.mainHolder_do.addChild(_s.bk_do);
			
			_s.mainHolder_do.setOverflow("visible");
		
			_s.addChild(_s.mainHolder_do);
			if(_s.showYoutubeQualityButton_bl){
				_s.ytbQuality_ar = ["hd4320", "hd2880","hd2160", "hd1440", "highres", "hd1080", "hd720", "large", "medium", "small", "tiny"];
				_s.ytbButtons_ar = [];
				_s.totalYtbButtons = _s.ytbQuality_ar.length;
				_s.setupYtbButtons();
			}
		
			_s.setupPlayPauseButton();
			if(_s.showRewindButton_bl) _s.setupRewindButton();
			_s.setupMainScrubber();
			if(_s.showTime_bl) _s.setupTime();
			if(_s.showVolumeButton_bl) _s.setupVolumeButton();
			
			if(_s.showVolumeScrubber_bl) _s.setupVolumeScrubber();
			if(_s.showPlaybackRateButton_bl) _s.setupPlaybackRateButton();
			if(_s.showYoutubeQualityButton_bl) _s.setupYoutubeQualityButton();
			if(_s.showSubtitleButton_bl) _s.setupSubtitleButton();
			if(_s.showShareButton_bl) _s.setupShareButton();
			if(_s.showEmbedButton_bl) _s.setupEmbedButton();
			if(_d.useAToB) _s.setupAtbButton();
			if(_s.showDownloadVideoButton_bl) _s.setupDownloadButton();
			if(_d.showChromecastButton_bl) _s.setupChromecastButton();
			if(_d.showAudioTracksButton_bl) _s.setupAudioTracksButton();
			_s.setupVrButton();
			if(_s.showFullScreenButton_bl) _s.setupFullscreenButton();
			
			if(!_s.isMobile_bl) _s.setupDisable();
			_s.hide(false, true);
			if(_s.showControllerWhenVideoIsStopped_bl) _s.show(true);
		};
		
		
		//###########################################//
		// Resize and position _s...
		//###########################################//
		_s.resizeAndPosition = function(){
			_s.sW = prt.sW;
			_s.positionButtons();
			_s.setY(prt.sH - _s.sH);
			_s.hideQualityButtons(false);
			
			if(_s.ytbButtonsHolder_do){
				FWDAnimation.killTweensOf(_s.ytbButtonsHolder_do);
				_s.ytbButtonsHolder_do.setY(prt.sH);
			}
			
			if(_s.subtitlesButtonsHolder_do){
				FWDAnimation.killTweensOf(_s.subtitlesButtonsHolder_do);
				_s.subtitlesButtonsHolder_do.setY(prt.sH);
			}
			
			if(_s.playbackRatesButtonsHolder_do){
				FWDAnimation.killTweensOf(_s.playbackRatesButtonsHolder_do);
				_s.playbackRatesButtonsHolder_do.setY(prt.sH);
			}

			if(_s.ATBButtonsHolder_do){
				FWDAnimation.killTweensOf(_s.ATBButtonsHolder_do);
				_s.ATBButtonsHolder_do.setY(prt.sH);
			}

			_s.positionAdsLines();
		};
		

		//##############################//
		/* Position buttons */
		//##############################//
		_s.positionButtons = function(){
			if(!_s.sW) return;

			var button;
			var prevButton;
			var totalButtonsWidth = 0;
			var hasTime_bl = _s.showTime_bl;
			var hasVolumeScrubber_bl = _s.volumeScrubber_do;
			
			_s.mainHolder_do.setWidth(_s.sW);
			_s.mainHolder_do.setHeight(_s.sH);
			_s.setWidth(_s.sW);
			_s.setHeight(_s.sH);

			var buttonsCopy_ar = [];
			for (var i=0; i < _s.buttons_ar.length; i++) {
				buttonsCopy_ar[i] = _s.buttons_ar[i];
			}
			
			if(prt.videoType_str == FWDEVPlayer.VIMEO && !_d.showDefaultControllerForVimeo_bl){
				_s.setX(-5000);
			}else{
				_s.setX(0);
			}
			
			_s.mainScrubberWidth = _s.sW - _s.startSpaceBetweenButtons * 2;
			for (var i=0; i < buttonsCopy_ar.length; i++) {
				button = buttonsCopy_ar[i];
				if(button != _s.mainScrubber_do){
					_s.mainScrubberWidth -= button.w + _s.spaceBetweenButtons;
				}
			};
			
			var testLegnth = 3;
			if(_s.hasYtbButton_bl) testLegnth = 4;

			var cnt = 0;
			while(_s.mainScrubberWidth < _s.mainScrubberMinWidth && cnt < 10){

				_s.mainScrubberWidth = _s.sW - _s.startSpaceBetweenButtons * 2;
				
				if(_s.volumeScrubber_do && FWDEVPUtils.indexOfArray(buttonsCopy_ar, _s.volumeScrubber_do) != -1){
					buttonsCopy_ar.splice(FWDEVPUtils.indexOfArray(buttonsCopy_ar, _s.volumeScrubber_do), 1);
					hasVolumeScrubber_bl = false;
					_s.volumeScrubber_do.setX(-1000);
				}else if(_s.time_do && FWDEVPUtils.indexOfArray(buttonsCopy_ar, _s.time_do) != -1){
					buttonsCopy_ar.splice(FWDEVPUtils.indexOfArray(buttonsCopy_ar, _s.time_do), 1);
					_s.time_do.setX(-1000);
					hasTime_bl = false;
				}else if(_s.volumeButton_do && FWDEVPUtils.indexOfArray(buttonsCopy_ar, _s.volumeButton_do) != -1){
					buttonsCopy_ar.splice(FWDEVPUtils.indexOfArray(buttonsCopy_ar, _s.volumeButton_do), 1);
					_s.volumeButton_do.setX(-1000);
				}else if(_s.atbButton_do && FWDEVPUtils.indexOfArray(buttonsCopy_ar, _s.atbButton_do) != -1){
					buttonsCopy_ar.splice(FWDEVPUtils.indexOfArray(buttonsCopy_ar, _s.atbButton_do), 1);
					_s.atbButton_do.setX(-1000);
				}else if(_s.subtitleButton_do && FWDEVPUtils.indexOfArray(buttonsCopy_ar, _s.subtitleButton_do) != -1){
					buttonsCopy_ar.splice(FWDEVPUtils.indexOfArray(buttonsCopy_ar, _s.subtitleButton_do), 1);
					_s.subtitleButton_do.setX(-1000);
				}else if(_s.shareButton_do && FWDEVPUtils.indexOfArray(buttonsCopy_ar, _s.shareButton_do) != -1){
					buttonsCopy_ar.splice(FWDEVPUtils.indexOfArray(buttonsCopy_ar, _s.shareButton_do), 1);
					_s.shareButton_do.setX(-1000);
				}else if(_s.embedButton_do && FWDEVPUtils.indexOfArray(buttonsCopy_ar, _s.embedButton_do) != -1){
					buttonsCopy_ar.splice(FWDEVPUtils.indexOfArray(buttonsCopy_ar, _s.embedButton_do), 1);
					_s.embedButton_do.setX(-1000);
				}
				
				var totalButtons = buttonsCopy_ar.length;
				
				for (var i=0; i < totalButtons; i++) {
					button = buttonsCopy_ar[i];
					if(button != _s.mainScrubber_do){
						_s.mainScrubberWidth -=  button.w + _s.spaceBetweenButtons;
					}
				};
				cnt++;	
			};

			
			if(hasTime_bl) _s.mainScrubberWidth -= _s.timeOffsetLeftWidth * 2;
			if(hasVolumeScrubber_bl)  _s.mainScrubberWidth -= _s.volumeScrubberOffsetRightWidth;
			
			for (var i=0; i < buttonsCopy_ar.length; i++) {
				button = buttonsCopy_ar[i];
				
				if(i == 0){
					button.setX(_s.startSpaceBetweenButtons + _d.pushBtns);
					button.setY(parseInt((_s.sH - button.h)/2));
				}else if(button == _s.mainScrubber_do){
					prevButton = buttonsCopy_ar[i - 1];
					FWDAnimation.killTweensOf(_s.mainScrubber_do);
					_s.mainScrubber_do.setX(prevButton.x + prevButton.w + _s.spaceBetweenButtons);
					_s.mainScrubber_do.setY(parseInt((_s.sH - _s.scrubbersHeight)/2));
					_s.mainScrubber_do.setWidth(_s.mainScrubberWidth + 1);
					_s.mainScrubberBkMiddle_do.setWidth(_s.mainScrubberWidth - _s.scrubbersBkLeftAndRightWidth * 2);
					_s.mainScrubberBkRight_do.setX(_s.mainScrubberWidth - _s.scrubbersBkLeftAndRightWidth);
					_s.mainScrubberDragMiddle_do.setWidth(_s.mainScrubberWidth - _s.scrubbersBkLeftAndRightWidth - _s.scrubbersOffsetWidth);
				}else if(button == _s.time_do){
					prevButton = buttonsCopy_ar[i - 1];
					button.setX(prevButton.x + prevButton.w + _s.spaceBetweenButtons + _s.timeOffsetLeftWidth);
					var timeOffset = 0;
					if(_s.isLive) timeOffset = 2;
					button.setY(parseInt((_s.sH - button.h)/2) + timeOffset);
				}else if(button == _s.volumeButton_do && hasTime_bl){
					prevButton = buttonsCopy_ar[i - 1];
					button.setX(prevButton.x + prevButton.w + _s.spaceBetweenButtons + _s.timeOffsetRightWidth);
					button.setY(parseInt((_s.sH - button.h)/2));
				}else{
					prevButton = buttonsCopy_ar[i - 1];
					if(hasVolumeScrubber_bl && prevButton == _s.volumeScrubber_do){
						button.setX(prevButton.x + prevButton.w + _s.spaceBetweenButtons + _s.volumeScrubberOffsetRightWidth);
					}else{
						button.setX(prevButton.x + prevButton.w + _s.spaceBetweenButtons);
					}
					button.setY(parseInt((_s.sH - button.h)/2));
				}
			};	
		
			
			if(_s.disable_do){
				_s.disable_do.setWidth(_s.sW);
				_s.disable_do.setHeight(_s.sH);
			}
			
			if(_s.bk_do){
				_s.bk_do.setWidth(_s.sW);
				_s.bk_do.setHeight(_s.sH);
			}

			if(_s.isShowed_bl){
				_s.isMainScrubberOnTop_bl = false;
			}else{
				_s.isMainScrubberOnTop_bl = true;
				_s.positionScrollBarOnTopOfTheController();
			}
			
			if(_s.progressMiddle_do) _s.progressMiddle_do.setWidth(_s.mainScrubberWidth - _s.scrubbersBkLeftAndRightWidth - _s.scrubbersOffsetWidth);
			_s.updateMainScrubber(_s.percentPlayed);
			_s.updatePreloaderBar(_s.percentLoaded);

			if(_s.atb) _s.atb.resize();
		};
		
		_s.positionScrollBarOnTopOfTheController = function(){
		
			if(prt.isStopped_bl) return;
			_s.mainScrubberWidth = _s.sW;
			_s.updatePreloaderBar(_s.percentLoaded);
			
			_s.mainScrubber_do.setWidth(_s.mainScrubberWidth + 1);
			_s.mainScrubberBkMiddle_do.setWidth(_s.mainScrubberWidth - _s.scrubbersBkLeftAndRightWidth * 2);
			_s.mainScrubberBkRight_do.setX(_s.mainScrubberWidth - _s.scrubbersBkLeftAndRightWidth);
			_s.mainScrubberDragMiddle_do.setWidth(_s.mainScrubberWidth - _s.scrubbersBkLeftAndRightWidth - _s.scrubbersOffsetWidth);
			
			FWDAnimation.killTweensOf(_s.mainScrubber_do);
			_s.mainScrubber_do.setX(0);
			var offset = 0;
			if(_s.atb && _s.atb.isShowed_bl) offset = _s.sH + 1;
			if(_d.showScrubberWhenControllerIsHidden_bl){
				if(_s.isMainScrubberOnTop_bl || _s.isShowed_bl){
					_s.mainScrubber_do.setY(- _s.mainScrubberOffestTop - offset);
				}else if(_s.mainScrubber_do.y != - _s.mainScrubberOffestTop && !_s.isLive){
					FWDAnimation.to(_s.mainScrubber_do, .8, {y:- _s.mainScrubberOffestTop - offset, ease:Expo.easeOut});
				}
			}
		
		};
		
		
		//###############################//
		/* setup disable */
		//##############################//
		_s.setupDisable = function(){
			_s.disable_do = new FWDEVPDO("div");
			if(FWDEVPUtils.isIE){
				_s.disable_do.setBkColor("#FFFFFF");
				_s.disable_do.setAlpha(0);
			}
		};
		
		
		//##########################################//
		/* Setup thumbnails preview */
		//##########################################//
		_s.setupThumbnailsPreview =  function(){
			if(_s.thumbnailsPreview_do){
				return;
			}
			FWDEVPThumbnailsPreview.setPrototype();
			_s.thumbnailsPreview_do = new FWDEVPThumbnailsPreview(_s);
			_s.thumbnailsPreview_do.addListener(FWDEVPData.LOAD_ERROR, function(e){
				_s.dispatchEvent(FWDEVPData.LOAD_ERROR, {text:e.text});
			});
		}


		//##########################################//
		/* Setup a to b button */
		//##########################################//
		_s.setupATB = function(){
			FWDEVPATB.setPrototype();
			_s.atb = new FWDEVPATB(_s);
			_s.mainHolder_do.addChild(_s.atb);
			_s.atb.addListener(FWDEVPATB.START_TO_SCRUB, _s.atbStartToScrub);
			_s.atb.addListener(FWDEVPATB.STOP_TO_SCRUB, _s.atbStopToScrub);
		}

		_s.atbStartToScrub = function(){
			prt.showDisable();
		}

		_s.atbStopToScrub = function(){
			prt.hideDisable();
		}

		_s.setupAtbButton = function(){
			if(_s.useVectorIcons_bl){
				FWDEVPSimpleButton.setPrototype();
				FWDEVPUtils.smpBtnNPos();
				var ic = prt.fontIcon +' ' + prt.fontIcon + '-AB';
				_s.atbButton_do = new FWDEVPSimpleButton(
						undefined, undefined, undefined, true, undefined, undefined, undefined,
						"<span class='" + ic + "'></span>",
						undefined,
						"EVPMainButtonsNormalState",
						"EVPMainButtonsSelectedState"
				);
			}else{
				FWDEVPSimpleButton.setPrototype();
				_s.atbButton_do = new FWDEVPSimpleButton(
						_d.atbNPath_img,
						_d.atbSPath_str,
						undefined,
						true,
						_s.useHEX,
						_s.nBC,
						_s.sBC
				);
			}

			_s.atbButton_do.screen.className = "fwdevp-atob-button";
			
			_s.atbButton_do.setX(-5000);
			_s.buttons_ar.push(_s.atbButton_do);
			_s.atbButton_do.setY(parseInt((_s.sH - _s.atbButton_do.h)/2));
			var checkIconInterval = setInterval(function(){
				if(_s.atbButton_do.buttonHeight > 0){
					clearInterval(checkIconInterval);
					_s.atbButton_do.setY(parseInt((_s.sH - _s.atbButton_do.buttonHeight)/2));
				}
			}, 50);	
			_s.atbButton_do.addListener(FWDEVPSimpleButton.MOUSE_UP, _s.atbButtonMouseUpHandler);
			_s.mainHolder_do.addChild(_s.atbButton_do);
		};
		
		
		_s.atbButtonMouseUpHandler = function(){
			if(_s.atbButton_do.isSelected){
				_s.atbButton_do.doNotallowToSetNormal = false;
				_s.atbButton_do.isSelected = false;
				_s.atb.hide(true);
			}else{
				_s.atbButton_do.isSelected = true;
				_s.atbButton_do.doNotallowToSetNormal = true;
				_s.atbButton_do.setSelectedState();
				_s.atb.show(true);
			}
			
		};

		_s.disableAtbButton = function(){
			if(_s.atbButton_do) _s.atbButton_do.disable();
		};
		
		_s.enableAtbButton = function(){
		
			if(_s.atbButton_do) _s.atbButton_do.enable();
		};
		

		//##########################################//
		/* Setup playback rate button */
		//##########################################//
		_s.playbackRatesSource_ar = _d.defaultPlaybackRate_ar;
		_s.playbackRateButtons_ar = [];
		_s.totalPlaybackRateButtons = 6;
		_s.arePlaybackRateButtonsShowed_bl = true;
		if(!_s.showPlaybackRateButton_bl) _s.arePlaybackRateButtonsShowed_bl = false;
		
		_s.setupPlaybackRateButton = function(){
			if(_s.useVectorIcons_bl){
				FWDEVPSimpleButton.setPrototype();
				FWDEVPUtils.smpBtnNPos();
				var ic = prt.fontIcon + ' ' + prt.fontIcon + '-watch-later';
				_s.playbackRateButton_do = new FWDEVPSimpleButton(
						undefined, undefined, undefined, true, undefined, undefined, undefined,
						"<span class='" + ic + "'></span>",
						undefined,
						"EVPMainButtonsNormalState",
						"EVPMainButtonsSelectedState"
				);
				
			}else{
				FWDEVPSimpleButton.setPrototype();
				_s.playbackRateButton_do = new FWDEVPSimpleButton(_d.playbackRateNPath_img,
															 _d.playbackRateSPath_str, 
															 undefined, 
															 true,
															 _s.useHEX,
															 _s.nBC,
															 _s.sBC);
			}
			
			_s.playbackRateButton_do.screen.className = "fwdevp-playbakrate-button";
			_s.buttons_ar.push(_s.playbackRateButton_do);
			_s.playbackRateButton_do.setY(parseInt((_s.sH - _s.playbackRateButton_do.h)/2));
			_s.playbackRateButton_do.addListener(FWDEVPSimpleButton.MOUSE_UP, _s.playbackRateButtonMouseUpHandler);
			_s.mainHolder_do.addChild(_s.playbackRateButton_do);
			
			_s.disablePlaybackRateButton();
			_s.setupPlaybackRateButtons();
			
		}
		
		_s.playbackRateButtonMouseUpHandler = function(){
			if(_s.arePlaybackRateButtonsShowed_bl){
				_s.hidePlaybackRateButtons(true);
			}else{
				_s.showPlaybackRateButtons(true);
			}
		};
		
		_s.disablePlaybackRateButton = function(){
			if(_s.playbackRateButton_do) _s.playbackRateButton_do.disable();
		};
		
		_s.enablePlaybackRateButton = function(){
			if(_s.playbackRateButton_do) _s.playbackRateButton_do.enable();
		};
		
		
		
		_s.removePlaybackRateButton = function(){
			if(!_s.playbackRateButton_do) return;
			if(FWDEVPUtils.indexOfArray(_s.buttons_ar, _s.playbackRateButton_do) != -1){
				_s.buttons_ar.splice(FWDEVPUtils.indexOfArray(_s.buttons_ar, _s.playbackRateButton_do), 1);
				_s.playbackRateButton_do.setX(-300);
				_s.positionButtons();
			}
		};
		
		_s.addPlaybackRateButton = function(){
			if(!_s.playbackRateButton_do) return;
			
			if(FWDEVPUtils.indexOfArray(_s.buttons_ar, _s.playbackRateButton_do) == -1){
				if(_s.ytbQualityButton_do && FWDEVPUtils.indexOfArray(_s.buttons_ar, _s.ytbQualityButton_do) != -1){
					_s.buttons_ar.splice(FWDEVPUtils.indexOfArray(_s.buttons_ar, _s.ytbQualityButton_do), 0, _s.playbackRateButton_do);
				}else if(_s.subtitleButton_do && FWDEVPUtils.indexOfArray(_s.buttons_ar, _s.subtitleButton_do) != -1){
					_s.buttons_ar.splice(FWDEVPUtils.indexOfArray(_s.buttons_ar, _s.subtitleButton_do), 0, _s.playbackRateButton_do);
				}else if(_s.shareButton_do && FWDEVPUtils.indexOfArray(_s.buttons_ar, _s.shareButton_do) != -1){
					_s.buttons_ar.splice(FWDEVPUtils.indexOfArray(_s.buttons_ar, _s.shareButton_do), 0, _s.playbackRateButton_do);
				}else if(_s.fullScreenButton_do && FWDEVPUtils.indexOfArray(_s.buttons_ar, _s.fullScreenButton_do) != -1){
					_s.buttons_ar.splice(FWDEVPUtils.indexOfArray(_s.buttons_ar, _s.fullScreenButton_do), 0, _s.playbackRateButton_do);
				}else{
					_s.buttons_ar.splice(_s.buttons_ar.length, 0, _s.playbackRateButton_do);
				}
				_s.positionButtons();
			}
		};


		//###################################################//
		/* Setup VR button */
		//###################################################//
		_s.setupVrButton = function(){
			if(_s.useVectorIcons_bl){
				FWDEVPSimpleButton.setPrototype();
				FWDEVPUtils.smpBtnNPos();
				var ic = prt.fontIcon + ' ' + prt.fontIcon + '-vr';
				_s.vrButton_do = new FWDEVPSimpleButton(
						undefined, undefined, undefined, true, undefined, undefined, undefined,
						"<span class='" + ic + "'></span>",
						undefined,
						"EVPMainButtonsNormalState",
						"EVPMainButtonsSelectedState"
				);
				
			}else{
				FWDEVPSimpleButton.setPrototype();
				_s.vrButton_do = new FWDEVPSimpleButton(_d.vr_img,
															 _d.vrSPath_img, 
															 undefined, 
															 true,
															 _s.useHEX,
															 _s.nBC,
															 _s.sBC);
			}
			
			_s.vrButton_do.screen.className = "fwdevp-vr-button";
			_s.vrButton_do.setY(parseInt((_s.sH - _s.vrButton_do.h)/2));
			_s.vrButton_do.addListener(FWDEVPSimpleButton.MOUSE_UP, _s.vrButtonMouseUpHandler);
			_s.vrButton_do.setX(-3000);
			_s.mainHolder_do.addChild(_s.vrButton_do);
			
			_s.disableVrButton();
		}
		
		_s.vrButtonMouseUpHandler = function(){
			_s.dispatchEvent(FWDEVPController.VR);
		};
		
		_s.disableVrButton = function(){
			if(_s.vrButton_do) _s.vrButton_do.disable();
		};
		
		_s.enableVrButton = function(){
			if(_s.vrButton_do) _s.vrButton_do.enable();
		};
		
		_s.removeVrButton = function(){
			if(!_s.vrButton_do) return;
			if(FWDEVPUtils.indexOfArray(_s.buttons_ar, _s.vrButton_do) != -1){
				_s.buttons_ar.splice(FWDEVPUtils.indexOfArray(_s.buttons_ar, _s.vrButton_do), 1);
				_s.vrButton_do.setX(-3000);
				_s.positionButtons();
			}
		};
		
		_s.addVrButton = function(){
			if(!_s.vrButton_do) return;
			
			_s.disableVrButton();

			if(FWDEVPUtils.indexOfArray(_s.buttons_ar, _s.vrButton_do) == -1){
				if(_s.fullScreenButton_do && FWDEVPUtils.indexOfArray(_s.buttons_ar, _s.fullScreenButton_do) != -1){
					_s.buttons_ar.splice(FWDEVPUtils.indexOfArray(_s.buttons_ar, _s.fullScreenButton_do), 0, _s.vrButton_do);
				}else{
					_s.buttons_ar.splice(_s.buttons_ar.length, 0, _s.vrButton_do);
				}
				_s.positionButtons();
			}
		};


		
		//###################################################//
		/* Setup PlaybackRatebuttons */
		//###################################################//
		_s.updatePlaybackRateButtons = function(playbackRates, playbackRateIndex){
			if(!_s.playbackRateButton_do) return;
			_s.positionAndResizePlaybackRateButtons(playbackRates);
			setTimeout(function(){
				_s.disablePlaybackRateButtons(playbackRateIndex);
			},65);
			_s.prevplaybackRateIndex = playbackRateIndex;
		};	
		
		_s.setupPlaybackRateButtons = function(){
			
			_s.playbackRatesButtonsHolder_do = new FWDEVPDO("div");
			_s.playbackRatesButtonsHolder_do.setOverflow("visible");
			
			if(_s.repeatBackground_bl){
				_s.playbackRatesButtonsHolder_do.style().background = "url('" + _s.controllerBkPath_str +  "')";
			}else{
				_s.playbackRatesButtonsBackground_do = new FWDEVPDO("img");
				var img = new Image();
				img.src = _s.controllerBkPath_str;
				_s.playbackRatesButtonsBackground_do.setScreen(img);
				_s.playbackRatesButtonsHolder_do.addChild(_s.playbackRatesButtonsBackground_do);
			}
			
			_s.playbackRatesButtonsHolder_do.setX(300);
			_s.playbackRatesButtonsHolder_do.setY(-300);
			prt.main_do.addChild(_s.playbackRatesButtonsHolder_do, 0);
			
			var img = new Image();
			img.src = _s.ytbQualityButtonPointerPath_str;
			_s.playbackRatesPonter_do = new FWDEVPDO("img");
			_s.playbackRatesPonter_do.setScreen(img);
			_s.playbackRatesPonter_do.setWidth(_s.pointerWidth);
			_s.playbackRatesPonter_do.setHeight(_s.pointerHeight);
			_s.playbackRatesButtonsHolder_do.addChild(_s.playbackRatesPonter_do);
	
			
			var img = new Image();
			img.src = _s.youtubeQualityArrowPath_str;
			_s.playbackRateQualityArrow_do = new FWDEVPDO("img");
			_s.playbackRateQualityArrow_do.setScreen(img);
			_s.playbackRateQualityArrow_do.setX(16);
			_s.playbackRateQualityArrow_do.setWidth(5);
			_s.playbackRateQualityArrow_do.setHeight(7);
			_s.playbackRatesButtonsHolder_do.addChild(_s.playbackRateQualityArrow_do);
			
			var btn;
			
			for(var i=0; i<_s.totalPlaybackRateButtons; i++){
				FWDEVPYTBQButton.setPrototype();
				btn = new FWDEVPYTBQButton("no source", 
						_s.youtubeQualityButtonNormalColor_str, 
						_s.youtubeQualityButtonSelectedColor_str,
						undefined,
						i);
				
				btn.addListener(FWDEVPYTBQButton.MOUSE_OVER, _s.plbkQualityOver);
				btn.addListener(FWDEVPYTBQButton.MOUSE_OUT, _s.plbkQualityOut);
				btn.addListener(FWDEVPYTBQButton.CLICK, _s.plbkQualityClick);
				_s.playbackRateButtons_ar[i] = btn;
				_s.playbackRatesButtonsHolder_do.addChild(btn);
			}
			_s.positionAndResizePlaybackRateButtons(_s.playbackRatesSource_ar);
			_s.hidePlaybackRateButtons(false);
		};
		
		_s.plbkQualityOver = function(e){
			_s.setPlaybackRateArrowPosition(e.target);
		};
		
		_s.plbkQualityOut = function(e){
			_s.setPlaybackRateArrowPosition(undefined);
		};
		
		_s.plbkQualityClick = function(e){
			_s.startAtPlaybackRate = e.id;
			_s.disablePlaybackRateButtons(_s.startAtPlaybackRate);
			_s.hidePlaybackRateButtons(true);
			_s.dispatchEvent(FWDEVPController.CHANGE_PLAYBACK_RATES, {rate:_s.playbackRatesSource_ar[e.id]});
		};
	
		_s.positionAndResizePlaybackRateButtons = function(ar){
			if(!ar) return;
			
			var totalButtons = ar.length;
			if(_s.prevplaybackRatesQualityButtonsLength == totalButtons) return;
			_s.prevplaybackRatesQualityButtonsLength = totalButtons;
			var btn;
			var startY = 12;
			var offsetY = 4;
			var addToTotalH = 6;
			var totalWidth = 0;
			var totalHeight = 0;

			if(prt.sH < 350){
				startY = 6;
				offsetY = 0;
				addToTotalH = 4;
			}
			
			for(var i=0; i<totalButtons; i++){
				var btn = _s.playbackRateButtons_ar[i];
				if(ar[i] == 1){
					btn.updateText("normal");
				}else{
					btn.updateText(ar[i]);
				}
				
				btn.setFinalSize();
			}
			
			setTimeout(function(){
				for(var i=0; i<totalButtons; i++){
					var btn = _s.playbackRateButtons_ar[i];
					if(i < totalButtons){
						btn.setX(9);
						if(btn.w > totalWidth) totalWidth = btn.w;
						btn.setY(startY);
						startY += btn.h + offsetY;
					}else{
						if(btn.x != -3000) btn.setX(-3000);
					}
				}
				
				totalWidth += 20;

				for(var i=0; i<totalButtons; i++){
					var btn = _s.playbackRateButtons_ar[i];
					if(btn.dumy_do.w < totalWidth){
						btn.setWidth(totalWidth);
						btn.dumy_do.setWidth(totalWidth);
					}
				}
				
				totalHeight = startY + addToTotalH;
				_s.playbackRatesPonter_do.setX(parseInt((totalWidth - _s.playbackRatesPonter_do.w)/2));
				_s.playbackRatesPonter_do.setY(totalHeight);
				if(_s.playbackRatesButtonsBackground_do){	
					_s.playbackRatesButtonsBackground_do.setWidth(totalWidth);
					_s.playbackRatesButtonsBackground_do.setHeight(totalHeight);
				}
				_s.playbackRatesButtonsHolder_do.setWidth(totalWidth);
				_s.playbackRatesButtonsHolder_do.setHeight(totalHeight);
			}, 60);
		};
		
		_s.disablePlaybackRateButtons = function(index){
			for(var i=0; i<_s.totalPlaybackRateButtons; i++){
				var btn = _s.playbackRateButtons_ar[i];
				if(i == index){
					FWDAnimation.killTweensOf(_s.playbackRateQualityArrow_do);
					_s.playbackRateQualityArrow_do.setY(btn.y + parseInt((btn.h - _s.playbackRateQualityArrow_do.h)/2) - 1);
					btn.disable();
					_s.playbackRateDisabledButton_do = btn;
				}else{
					btn.enable();
				}
			}
		};
		
		_s.setPlaybackRateArrowPosition = function(target){
			var curY = 0;
			if(!target){
				curY = _s.playbackRateDisabledButton_do.y + parseInt((_s.playbackRateDisabledButton_do.h - _s.playbackRateQualityArrow_do.h)/2 - 1);
			}else{
				curY = target.y + parseInt((target.h - _s.playbackRateQualityArrow_do.h)/2 - 1);
			}
			FWDAnimation.killTweensOf(_s.playbackRateQualityArrow_do);
			FWDAnimation.to(_s.playbackRateQualityArrow_do, .6, {y:curY, delay:.1, ease:Expo.easeInOut});
		};
		
		_s.showPlaybackRateButtons = function(animate){
			if(_s.arePlaybackRateButtonsShowed_bl) return;
			_s.hideQualityButtons();
			_s.arePlaybackRateButtonsShowed_bl = true;
			var finalX = parseInt(_s.playbackRateButton_do.x + (parseInt(_s.playbackRateButton_do.w - _s.playbackRatesButtonsHolder_do.w)/2));
			var finalY = parseInt(prt.sH - _s.sH - _s.playbackRatesButtonsHolder_do.h - 6);
			
			if(_s.hasPointerEvent_bl){
				window.addEventListener("pointerdown", _s.hideplaybackRatesButtonsHandler);
			}else{
				if(!_s.isMobile_bl){
					window.addEventListener("mousedown", _s.hideplaybackRatesButtonsHandler);
				}
				window.addEventListener("touchstart", _s.hideplaybackRatesButtonsHandler);
			}
			
			_s.playbackRatesButtonsHolder_do.setX(finalX);
		
			if(animate){
				FWDAnimation.to(_s.playbackRatesButtonsHolder_do, .6, {y:finalY, ease:Expo.easeInOut});
			}else{
				FWDAnimation.killTweensOf(_s.playbackRatesButtonsHolder_do);
				_s.playbackRatesButtonsHolder_do.setY(finalY);
			}
		};
	
		_s.hidePlaybackRateButtons = function(animate){
			if(!_s.arePlaybackRateButtonsShowed_bl || !_s.showPlaybackRateButton_bl) return;
			_s.arePlaybackRateButtonsShowed_bl = false;
			if(animate){
				FWDAnimation.to(_s.playbackRatesButtonsHolder_do, .6, {y:prt.sH, ease:Expo.easeInOut});
			}else{
				FWDAnimation.killTweensOf(_s.playbackRatesButtonsHolder_do);
				_s.playbackRatesButtonsHolder_do.setY(prt.sH);
			}
			
			
			if(_s.hasPointerEvent_bl){
				window.removeEventListener("pointerdown", _s.hideplaybackRatesButtonsHandler);
			}else{
				if(!_s.isMobile_bl){
					window.removeEventListener("mousedown", _s.hideplaybackRatesButtonsHandler);
				}
				window.removeEventListener("touchstart", _s.hideplaybackRatesButtonsHandler);
			}
		};
		
		_s.hideplaybackRatesButtonsHandler = function(e){
			var vc = FWDEVPUtils.getViewportMouseCoordinates(e);	
			if(FWDEVPUtils.hitTest(_s.playbackRateButton_do.screen, vc.screenX, vc.screenY)
			   || FWDEVPUtils.hitTest(_s.playbackRatesButtonsHolder_do.screen, vc.screenX, vc.screenY)){
				return;
			}
			_s.hidePlaybackRateButtons(true);
		};
		

		//################################################//
		/* Setup main scrubber */
		//################################################//
		_s.setupAdsLines = function(linesAr){

			if(_s.createdAdsOnce_bl || !linesAr || (linesAr && linesAr.length == 0)) return;
		
			_s.resetsAdsLines(false);
			
			if(!_s.linesHolder_do){
				_s.linesHolder_do = new FWDEVPDO("div");
				_s.linesHolder_do.setOverflow("visible");
				_s.mainScrubber_do.addChild(_s.linesHolder_do);
			}
			_s.createdAdsOnce_bl = true;
			_s.lines_ar = linesAr;
			
			if(_s.lines_ar){
				var line;
				_s.line_ar = [];
				for(var i=0; i<_s.lines_ar.length; i++){
					line = new FWDEVPDO("div");
					line.style().background = "url('" + _d.adLinePat_str + "') repeat-x";
					line.timeStart = linesAr[i].timeStart;
					line.setWidth(2);
					line.setHeight(_s.mainScrubberDragLeft_img.height);
					line.isUsed_bl = false;
					line.isShowed_bl = false;
					line.setAlpha(0);
					_s.line_ar[i] = line;
					_s.linesHolder_do.addChild(line);
					if(_s.lines_ar[i]['timeStart'] == 0) line.setWidth(0);
				}
			}
			_s.totalDuration = 0;
		};
		
		_s.hideAdsLines = function(){
			if(!_s.line_ar) return;
			
			if(_s.linesHolder_do) _s.linesHolder_do.setX(-5000);	
			if(_s.line_ar){
				for(var i=0; i<_s.line_ar.length; i++){
					var line = _s.line_ar[i];
					FWDAnimation.killTweensOf(line)
					line.setAlpha(0);
					line.isShowed_bl = false;
				}
			}
			
		}
		
		_s.positionAdsLines = function(totalDuration){
			
			if(!_s.linesHolder_do || !_s.line_ar) return;
			
			if(totalDuration) _s.totalDuration = totalDuration;
			if(_s.isAdd){
				_s.linesHolder_do.setX(-5000);
			}else{
				_s.linesHolder_do.setX(0);
			}
			
			
			if(_s.line_ar){
				var line;
			
				for(var i=0; i<_s.line_ar.length; i++){
					line = _s.line_ar[i];
					
					var lineX = Math.round((line.timeStart/_s.totalDuration) * _s.mainScrubberWidth) - 1;
					
					if(lineX == Infinity) lineX = 0;
					if(isNaN(lineX)) lineX = 0;
					if(lineX < 0) lineX = 0;
					line.setX(lineX);
					
					if(!line.isUsed_bl && _s.totalDuration != 0 && !line.isShowed_bl){
						FWDAnimation.to(line, 1, {alpha:1, ease:Expo.easeOut});
						line.isShowed_bl = true;
					}
				}
			}
		}
		
		_s.resetsAdsLines = function(s){
			if(_s.line_ar){
				for(var i=0; i<_s.line_ar.length; i++){
					FWDAnimation.killTweensOf(_s.line_ar[i]);
					_s.linesHolder_do.removeChild(_s.line_ar[i]);
				}
			}
			if(_s.linesHolder_do) _s.linesHolder_do.setX(-5000);
			if(s) _s.line_ar = null;
		}
		

		//###############################################//
		/* Set is live */
		//###############################################//
		_s.setIsLive = function(isLive){
			_s.isLive = isLive;
			if(isLive){
				if(!_s.mainScrubber_do.contains(_s.live_do)){
					_s.mainScrubber_do.setAlpha(.2);
					_s.mainHolder_do.addChild(_s.live_do);
					setTimeout(function(){
							_s.live_do.setX(4);
							_s.live_do.setY(- _s.live_do.getHeight() - 4);
					}, 100)
					_s.disableMainScrubber();
				}
			}else{
				if(_s.mainHolder_do.contains(_s.live_do)){
					_s.mainHolder_do.removeChild(_s.live_do);
					_s.mainScrubber_do.setAlpha(1);
					
					_s.enableMainScrubber();
				}
			}
		}
	
		//################################################//
		/* Setup main scrubber */
		//################################################//
		_s.setupMainScrubber = function(){
			//setup background bar
			_s.mainScrubber_do = new FWDEVPDO("div");
			_s.mainScrubber_do.screen.className = "fwdevp-main-scrubber";
			_s.mainScrubber_do.setHeight(_s.scrubbersHeight);
			
			_s.mainScrubberBkLeft_do = new FWDEVPDO("img");
			_s.mainScrubberBkLeft_do.setScreen(_s.mainScrubberBkLeft_img);
			
			_s.mainScrubberBkRight_do = new FWDEVPDO("img");
			_s.mainScrubberBkRight_do.setScreen(_s.mainScrubberBkRight_img);
			
			var middleImage = new Image();
			middleImage.src = _s.mainScrubberBkMiddlePath_str;
			
			_s.mainScrubberBkMiddle_do = new FWDEVPDO("div");	
			_s.mainScrubberBkMiddle_do.style().background = "url('" + _s.mainScrubberBkMiddlePath_str + "') repeat-x";
			
			_s.mainScrubberBkMiddle_do.setHeight(_s.scrubbersHeight);
			_s.mainScrubberBkMiddle_do.setX(_s.scrubbersBkLeftAndRightWidth);
			
			//setup progress bar
			_s.mainProgress_do = new FWDEVPDO("div");
			_s.mainProgress_do.setHeight(_s.scrubbersHeight);
		
			_s.progressLeft_do = new FWDEVPDO("img");
			_s.progressLeft_do.setScreen(_s.progress);
			
			middleImage = new Image();
			middleImage.src = _s.progressMiddlePath_str;
			
			_s.progressMiddle_do = new FWDEVPDO("div");	
			_s.progressMiddle_do.style().background = "url('" + _s.progressMiddlePath_str + "') repeat-x";
		
			_s.progressMiddle_do.setHeight(_s.scrubbersHeight);
			_s.progressMiddle_do.setX(_s.mainScrubberDragLeftWidth);
			
			//setup darg bar.
			_s.mainScrubberDrag_do = new FWDEVPDO("div");
			_s.mainScrubberDrag_do.setHeight(_s.scrubbersHeight);
		
			
			if(_s.useHEX){
				_s.mainScrubberDragLeft_do = new FWDEVPDO("div");
				_s.mainScrubberDragLeft_do.setWidth(_s.mainScrubberDragLeft_img.width + 20);
				_s.mainScrubberDragLeft_do.setHeight(_s.mainScrubberDragLeft_img.height + 20);
				_s.mainScrubberDragLeft_canvas = FWDEVPUtils.getCanvasWithModifiedColor(_s.mainScrubberDragLeft_img, _s.nBC).canvas;
				_s.mainScrubberDragLeft_do.screen.appendChild(_s.mainScrubberDragLeft_canvas);	
			}else{
				_s.mainScrubberDragLeft_do = new FWDEVPDO("img");
				_s.mainScrubberDragLeft_do.setScreen(_s.mainScrubberDragLeft_img);
			}
			
			_s.mainScrubberMiddleImage = new Image();
			_s.mainScrubberMiddleImage.src = _s.mainScrubberDragMiddlePath_str;
			_s.volumeScrubberDragMiddle_do = new FWDEVPDO("div");
			
			if(_s.useHEX){
				_s.mainScrubberDragMiddle_do = new FWDEVPDO("div");
				_s.mainScrubberMiddleImage.onload = function(){
					var testCanvas = FWDEVPUtils.getCanvasWithModifiedColor(_s.mainScrubberMiddleImage, _s.nBC, true);
					_s.mainSCrubberMiddleCanvas = testCanvas.canvas;
					_s.mainSCrubberDragMiddleImageBackground = testCanvas.image;
					_s.mainScrubberDragMiddle_do.style().background = "url('" + _s.mainSCrubberDragMiddleImageBackground.src + "') repeat-x";
					setTimeout(function(){
						_s.volumeScrubberDragMiddle_do.style().background = "url('" + _s.mainSCrubberDragMiddleImageBackground.src + "') repeat-x";
					},50)
				}
			}else{
				_s.mainScrubberDragMiddle_do = new FWDEVPDO("div");	
				_s.mainScrubberDragMiddle_do.style().background = "url('" + _s.mainScrubberDragMiddlePath_str + "') repeat-x";
			}
			
		
			_s.mainScrubberDragMiddle_do.setHeight(_s.scrubbersHeight);
			_s.mainScrubberDragMiddle_do.setX(_s.mainScrubberDragLeftWidth);
			
			_s.mainScrubberBarLine_do = new FWDEVPDO("img");
			_s.mainScrubberBarLine_do.setScreen(_s.mainScrubberLine_img);
			_s.mainScrubberBarLine_do.setAlpha(0);
			_s.mainScrubberBarLine_do.hasT3D = false;
			_s.mainScrubberBarLine_do.hasT2D = false;
			
			_s.buttons_ar.push(_s.mainScrubber_do);
			
			
			_s.live_do = new FWDEVPDO("div");
			_s.live_do.hasT3D = false;
			_s.live_do.hasT2D = false;
			_s.live_do.setBackfaceVisibility();
			_s.live_do.style().fontFamily = "Arial";
			_s.live_do.style().fontSize= "12px";
			_s.live_do.style().whiteSpace= "nowrap";
			_s.live_do.style().textAlign = "center";
			_s.live_do.style().padding = "4px";
			_s.live_do.style().paddingLeft = "6px";
			_s.live_do.style().paddingRIght = "6px";
			_s.live_do.style().color = "#FFFFFF";
			_s.live_do.style().fontSmoothing = "antialiased";
			_s.live_do.style().webkitFontSmoothing = "antialiased";
			_s.live_do.style().textRendering = "optimizeLegibility";
			_s.live_do.style().backgroundColor = "rgba(255,0,0,0.8)";
			_s.live_do.setInnerHTML("&#x25C9; LIVE");
			
			
			//add all children
			_s.mainScrubber_do.addChild(_s.mainScrubberBkLeft_do);
			_s.mainScrubber_do.addChild(_s.mainScrubberBkMiddle_do);
			_s.mainScrubber_do.addChild(_s.mainScrubberBkRight_do);
			_s.mainScrubber_do.addChild(_s.mainScrubberBarLine_do);
			_s.mainScrubberDrag_do.addChild(_s.mainScrubberDragLeft_do);
			_s.mainScrubberDrag_do.addChild(_s.mainScrubberDragMiddle_do);
			_s.mainProgress_do.addChild(_s.progressLeft_do);
			_s.mainProgress_do.addChild(_s.progressMiddle_do);
			_s.mainScrubber_do.addChild(_s.mainProgress_do);
			_s.mainScrubber_do.addChild(_s.mainScrubberDrag_do);
			_s.mainScrubber_do.addChild(_s.mainScrubberBarLine_do);
			_s.mainHolder_do.addChild(_s.mainScrubber_do);
			
		
			if(!_s.disableVideoScrubber_bl){
				if(_s.hasPointerEvent_bl){
					_s.mainScrubber_do.screen.addEventListener("pointerover", _s.mainScrubberOnOverHandler);
					_s.mainScrubber_do.screen.addEventListener("pointerout", _s.mainScrubberOnOutHandler);
					_s.mainScrubber_do.screen.addEventListener("pointerdown", _s.mainScrubberOnDownHandler);
				}else if(_s.screen.addEventListener){	
					if(!_s.isMobile_bl){
						_s.mainScrubber_do.screen.addEventListener("mouseover", _s.mainScrubberOnOverHandler);
						_s.mainScrubber_do.screen.addEventListener("mouseout", _s.mainScrubberOnOutHandler);
						_s.mainScrubber_do.screen.addEventListener("mousemove", _s.updateTooltipOnMove);
						_s.mainScrubber_do.screen.addEventListener("mousedown", _s.mainScrubberOnDownHandler);
					}
					_s.mainScrubber_do.screen.addEventListener("touchstart", _s.mainScrubberOnDownHandler);
				}
			}
			
			_s.disableMainScrubber();
			_s.updateMainScrubber(0);

			FWDEVPScrubberToolip.setPrototype();
			_s.ttm = new FWDEVPScrubberToolip(_s.mainScrubber_do, _d.scrubbersToolTipLabelBackgroundColor, _d.scrubbersToolTipLabelFontColor);
			_s.addChild(_s.ttm);

		};

		_s.updateToolTip = function(localX, percentScrubbed){
			if(!_d.showMainScrubberToolTipLabel_bl) return;
			if(prt.isCasting){
				_s.ttm.setLabel(FWDEVPUtils.formatTime(Math.round(prt.cc.getDuration() * percentScrubbed)));
			}else{
				_s.ttm.setLabel(FWDEVPUtils.formatTime(Math.round(prt.totalDuration * percentScrubbed)));
			}
			_s.ttm.setX(Math.round(_s.mainScrubber_do.x + localX - _s.ttm.getWidth()/2) + 1);
			_s.ttm.setY(_s.mainScrubber_do.y - _s.ttm.h - 2);
		}
		
		_s.updateThumbnailsPreview = function(localX, percentScrubbed){
			if(!_d.thumbnailsPreview || !_s.thumbnailsPreview_do) return;
			
			var x = Math.round(_s.mainScrubber_do.x + localX - _s.thumbnailsPreview_do.getWidth()/2) + 1;
			var pointerOffsetX = 0;

			if(x < 1){
				pointerOffsetX = x;
				x = 1;
			}else if(x > _s.sW - _s.thumbnailsPreview_do.w - 1){
				pointerOffsetX = x - _s.sW + _s.thumbnailsPreview_do.w;
				x = _s.sW - _s.thumbnailsPreview_do.w - 1;
			}
			_s.thumbnailsPreview_do.setLabel(FWDEVPUtils.formatTime(Math.round(prt.totalDuration * percentScrubbed)), Math.round(prt.totalDuration * percentScrubbed), pointerOffsetX);
			_s.thumbnailsPreview_do.setX(x);
			_s.thumbnailsPreview_do.setY(_s.mainScrubber_do.y - _s.thumbnailsPreview_do.h - 2);
		}

		_s.updateTooltipOnMove = function(e){
			if(_s.isMainScrubberDisabled_bl) return;
			var viewportMouseCoordinates = FWDEVPUtils.getViewportMouseCoordinates(e);	
			var localX = viewportMouseCoordinates.screenX - _s.mainScrubber_do.getGlobalX();
			
			if(localX < 0){
				localX = 0;
			}else if(localX > _s.mainScrubberWidth - _s.scrubbersOffsetWidth){
				localX = _s.mainScrubberWidth - _s.scrubbersOffsetWidth;
			}
			var percentScrubbed = localX/_s.mainScrubberWidth;
			_s.updateToolTip(localX, percentScrubbed);
			_s.updateThumbnailsPreview(localX, percentScrubbed);
		}
		
		_s.mainScrubberOnOverHandler =  function(e){
			if(_s.isMainScrubberDisabled_bl) return;

			if(_d.tempShowMainScrubberToolTipLabel_bl) _s.ttm.show();
			if(_d.thumbnailsPreview && _s.thumbnailsPreview_do && _s.sW > 300) _s.thumbnailsPreview_do.show();

			var viewportMouseCoordinates = FWDEVPUtils.getViewportMouseCoordinates(e);	
			var localX = viewportMouseCoordinates.screenX - _s.mainScrubber_do.getGlobalX();
			
			if(localX < 0){
				localX = 0;
			}else if(localX > _s.mainScrubberWidth - _s.scrubbersOffsetWidth){
				localX = _s.mainScrubberWidth - _s.scrubbersOffsetWidth;
			}
			var percentScrubbed = localX/_s.mainScrubberWidth;

			_s.updateToolTip(localX, percentScrubbed);
			_s.updateThumbnailsPreview(localX, percentScrubbed);
		};
		
		_s.mainScrubberOnOutHandler =  function(e){
			if(!_s.isMainScrubberScrubbing_bl){
				if(_s.ttm) _s.ttm.hide();
				if(_s.thumbnailsPreview_do) _s.thumbnailsPreview_do.hide();
			}
		};
		
		_s.mainScrubberOnDownHandler =  function(e){
			if(_s.isMainScrubberDisabled_bl || e.button == 2) return;
			if(e.preventDefault) e.preventDefault();
			_s.isMainScrubberScrubbing_bl = true;
			var viewportMouseCoordinates = FWDEVPUtils.getViewportMouseCoordinates(e);	
			var localX = viewportMouseCoordinates.screenX - _s.mainScrubber_do.getGlobalX();
			
			if(localX < 0){
				localX = 0;
			}else if(localX > _s.mainScrubberWidth - _s.scrubbersOffsetWidth){
				localX = _s.mainScrubberWidth - _s.scrubbersOffsetWidth;
			}
			var percentScrubbed = localX/_s.mainScrubberWidth;
		
			if(_s.disable_do) _s.addChild(_s.disable_do);
			if(_d.tempShowMainScrubberToolTipLabel_bl) _s.ttm.show();
			if(_d.thumbnailsPreview && _s.thumbnailsPreview_do && _s.sW > 300) _s.thumbnailsPreview_do.show();
			_s.updateToolTip(localX, percentScrubbed);
			_s.updateThumbnailsPreview(localX, percentScrubbed);
			_s.updateMainScrubber(percentScrubbed);

			_s.dispatchEvent(FWDEVPController.START_TO_SCRUB);
			_s.dispatchEvent(FWDEVPController.SCRUB, {percent:percentScrubbed});
			
			if(_s.hasPointerEvent_bl){
				window.addEventListener("pointermove", _s.mainScrubberMoveHandler);
				window.addEventListener("pointerup", _s.mainScrubberEndHandler);
			}else{
				window.addEventListener("mousemove", _s.mainScrubberMoveHandler);
				window.addEventListener("mouseup", _s.mainScrubberEndHandler);		
				window.addEventListener("touchmove", _s.mainScrubberMoveHandler, {passive:false});
				window.addEventListener("touchend", _s.mainScrubberEndHandler);
			}
		};
		
		_s.mainScrubberMoveHandler = function(e){
			if(e.preventDefault) e.preventDefault();
			var viewportMouseCoordinates = FWDEVPUtils.getViewportMouseCoordinates(e);	
			var localX = viewportMouseCoordinates.screenX - _s.mainScrubber_do.getGlobalX();
			
			if(localX < 0){
				localX = 0;
			}else if(localX > _s.mainScrubberWidth - _s.scrubbersOffsetWidth){
				localX = _s.mainScrubberWidth - _s.scrubbersOffsetWidth;
			}
			
			var percentScrubbed = localX/_s.mainScrubberWidth;
			_s.updateToolTip(localX, percentScrubbed);
			_s.updateThumbnailsPreview(localX, percentScrubbed);
			_s.updateMainScrubber(percentScrubbed);
			_s.dispatchEvent(FWDEVPController.SCRUB, {percent:percentScrubbed});
		};
		
		_s.mainScrubberEndHandler = function(e){
			_s.isMainScrubberScrubbing_bl = false;
			if(_s.disable_do){
				if(_s.contains(_s.disable_do)) _s.removeChild(_s.disable_do);
			}
			
			if(e){
				var wp = FWDEVPUtils.getViewportMouseCoordinates(e);
				if(!FWDEVPUtils.hitTest(_s.mainScrubber_do.screen, wp.screenX, wp.screenY)){
					if(_s.ttm) _s.ttm.hide();
					if(_s.thumbnailsPreview_do) _s.thumbnailsPreview_do.hide();
				}else{
					window.addEventListener("mousemove", _s.checkTm2OnMove);
				}
			}
			_s.dispatchEvent(FWDEVPController.STOP_TO_SCRUB);
			if(_s.hasPointerEvent_bl){
				window.removeEventListener("pointermove", _s.mainScrubberMoveHandler);
				window.removeEventListener("pointerup", _s.mainScrubberEndHandler);
			}else{
				window.removeEventListener("mousemove", _s.mainScrubberMoveHandler);
				window.removeEventListener("mouseup", _s.mainScrubberEndHandler);		
				window.removeEventListener("touchmove", _s.mainScrubberMoveHandler);
				window.removeEventListener("touchend", _s.mainScrubberEndHandler);
			}
		};

		 _s.checkTm2OnMove = function(e){
			var wp = FWDEVPUtils.getViewportMouseCoordinates(e);
			if(!FWDEVPUtils.hitTest(_s.mainScrubber_do.screen, wp.screenX, wp.screenY)){
				if(_s.ttm) _s.ttm.hide();
				if(_s.thumbnailsPreview_do) _s.thumbnailsPreview_do.hide();
				window.removeEventListener("mousemove", _s.checkTm2OnMove);
			}
		 }
		
		_s.disableMainScrubber = function(){
			if(!_s.mainScrubber_do) return;
			_s.isMainScrubberDisabled_bl = true;
			_s.mainScrubber_do.setButtonMode(false);
			_s.mainScrubberEndHandler();
			_s.mainScrubberOnOutHandler();
			_s.updateMainScrubber(0);
			_s.updatePreloaderBar(0);
		};
		
		
		_s.enableMainScrubber = function(){
			if(!_s.mainScrubber_do || _s.isLive) return;
			_s.isMainScrubberDisabled_bl = false;
			_s.mainScrubber_do.setButtonMode(true);
		};
		
		_s.updateMainScrubber = function(percent){
			if(!_s.mainScrubber_do) return;
			if(_s.isLive) percent = 0;
			
			var finalWidth = parseInt(percent * _s.mainScrubberWidth); 
			if(isNaN(finalWidth)) return;
			
			_s.percentPlayed = percent;
			if(!FWDEVPlayer.hasHTML5Video && finalWidth >= _s.mainProgress_do.w) finalWidth = _s.mainProgress_do.w;
			
			if(finalWidth < 1 && _s.isMainScrubberLineVisible_bl){
				_s.isMainScrubberLineVisible_bl = false;
				FWDAnimation.to(_s.mainScrubberBarLine_do, .5, {alpha:0});
			}else if(finalWidth > 1 && !_s.isMainScrubberLineVisible_bl){
				_s.isMainScrubberLineVisible_bl = true;
				FWDAnimation.to(_s.mainScrubberBarLine_do, .5, {alpha:1});
			}
			_s.mainScrubberDrag_do.setWidth(finalWidth);
			if(finalWidth > _s.mainScrubberWidth - _s.scrubbersOffsetWidth) finalWidth = _s.mainScrubberWidth - _s.scrubbersOffsetWidth;
			FWDAnimation.to(_s.mainScrubberBarLine_do, .8, {x:finalWidth + 1, ease:Expo.easeOut});
		};
		
		_s.updatePreloaderBar = function(percent){
			if(!_s.mainProgress_do) return;
			if(_s.isLive) percent = 0;
			
			_s.percentLoaded = percent;
			var finalWidth = parseInt(Math.max(0,_s.percentLoaded * _s.mainScrubberWidth)); 
			
			if(_s.percentLoaded >= 0.98){
				_s.mainProgress_do.setY(-30);
			}else if(_s.mainProgress_do.y != 0 && _s.percentLoaded!= 1){
				_s.mainProgress_do.setY(0);
			}
			if(finalWidth > _s.mainScrubberWidth - _s.scrubbersOffsetWidth) finalWidth = Math.max(0,_s.mainScrubberWidth - _s.scrubbersOffsetWidth);
			if(finalWidth < 0) finalWidth = 0;
			_s.mainProgress_do.setWidth(finalWidth);
		};
		

		//################################################//
		/* Setup play button */
		//################################################//
		_s.setupPlayPauseButton = function(){
			if(_s.useVectorIcons_bl){
				FWDEVPComplexButton.setPrototype();
				FWDEVPUtils.cmpBtnNPos();
				var ic1 = prt.fontIcon + ' ' + prt.fontIcon + '-play';
				var ic2 = prt.fontIcon + ' ' + prt.fontIcon + '-pause';
				_s.playPauseButton_do = new FWDEVPComplexButton(0, 0, 0, 0, true, 0, 0, 0,
					"<span class='" + ic1 + "'></span>",
					"<span class='" + ic2 + "'></span>",
					"EVPMainButtonsNormalState",
					"EVPMainButtonsSelectedState"
				);
			}else{
				FWDEVPComplexButton.setPrototype();
				_s.playPauseButton_do = new FWDEVPComplexButton(
						_s.playN_img,
						_d.playSPath_str,
						_s.pauseN_img,
						_d.pauseSPath_str,
						true,
						_s.useHEX,
						_s.nBC,
						_s.sBC
				);
			}

			_s.playPauseButton_do.screen.className = "fwdevp-play-pause-button";
			
			_s.buttons_ar.push(_s.playPauseButton_do);
			_s.playPauseButton_do.setY(parseInt((_s.sH - _s.playPauseButton_do.buttonHeight)/2));
			_s.playPauseButton_do.addListener(FWDEVPComplexButton.MOUSE_UP, _s.playButtonMouseUpHandler);
			_s.mainHolder_do.addChild(_s.playPauseButton_do);
		};
		
		_s.showPlayButton = function(){
			if(!_s.playPauseButton_do || (!_d.showDefaultControllerForVimeo_bl && prt.videoType_str == FWDEVPlayer.VIMEO)) return;
			_s.playPauseButton_do.setButtonState(1);
		};
		
		_s.showPauseButton = function(){
			if(!_s.playPauseButton_do ||  (!_d.showDefaultControllerForVimeo_bl && prt.videoType_str == FWDEVPlayer.VIMEO)) return;
			_s.playPauseButton_do.setButtonState(0);
		};
		
		_s.playButtonMouseUpHandler = function(){
			if(_s.playPauseButton_do.currentState == 0){
				_s.dispatchEvent(FWDEVPController.PAUSE);
			}else{
				_s.dispatchEvent(FWDEVPController.PLAY);
			}
		};
		

		//##########################################//
		/* Setup embed button */
		//#########################################//
		_s.setupEmbedButton = function(){
			
			if(_s.useVectorIcons_bl){			
				FWDEVPSimpleButton.setPrototype();
				FWDEVPUtils.smpBtnNPos();
				var ic = prt.fontIcon + ' ' + prt.fontIcon + '-embed';
				_s.embedButton_do = new FWDEVPSimpleButton(
						undefined, undefined, undefined, true, undefined, undefined, undefined,
						"<span class='" + ic + "'></span>",
						undefined,
						"EVPMainButtonsNormalState",
						"EVPMainButtonsSelectedState"
				);
			}else{
				FWDEVPSimpleButton.setPrototype();
				_s.embedButton_do = new FWDEVPSimpleButton(_s.embedN_img,
														 _d.embedPathS_str, 
														 undefined, 
														 true,
														 _s.useHEX,
														 _s.nBC,
														 _s.sBC);
				
			}

			_s.embedButton_do.screen.className = "fwdevp-embed-button";				
			_s.embedButton_do.addListener(FWDEVPSimpleButton.MOUSE_UP, _s.embedButtonOnMouseUpHandler);
			_s.embedButton_do.setY(parseInt((_s.sH - _s.embedButton_do.h)/2));
			_s.buttons_ar.push(_s.embedButton_do);
			_s.mainHolder_do.addChild(_s.embedButton_do);
		};
	
		_s.embedButtonOnMouseUpHandler = function(){
			_s.dispatchEvent(FWDEVPController.SHOW_EMBED_WINDOW);
		};
		

		//###################################################//
		/* Setup youtube quality buttons */
		//###################################################//
		_s.setupYtbButtons = function(){
			_s.ytbButtonsHolder_do = new FWDEVPDO("div");
			_s.ytbButtonsHolder_do.setOverflow("visible");
			if(_s.repeatBackground_bl){
				_s.ytbButtonsHolder_do.style().background = "url('" + _s.controllerBkPath_str +  "')";
			}else{
				_s.ytbButtonBackground_do = new FWDEVPDO("img");
				var img = new Image();
				img.src = _s.controllerBkPath_str;
				_s.ytbButtonBackground_do.setScreen(img);
				_s.ytbButtonsHolder_do.addChild(_s.ytbButtonBackground_do);
			}
			
			_s.ytbButtonsHolder_do.setX(300);
			_s.ytbButtonsHolder_do.setY(-300);
			prt.main_do.addChild(_s.ytbButtonsHolder_do, 0);
			
			var img = new Image();
			img.src = _s.ytbQualityButtonPointerPath_str;
			_s.pointer_do = new FWDEVPDO("img");
			_s.pointer_do.setScreen(img);
			_s.pointer_do.setWidth(_s.pointerWidth);
			_s.pointer_do.setHeight(_s.pointerHeight);
			_s.ytbButtonsHolder_do.addChild(_s.pointer_do);
			
			var img = new Image();
			img.src = _s.youtubeQualityArrowPath_str;
			_s.qualityArrow_do = new FWDEVPDO("img");
			_s.qualityArrow_do.setScreen(img);
			_s.qualityArrow_do.setX(16);
			_s.qualityArrow_do.setWidth(5);
			_s.qualityArrow_do.setHeight(7);
	
			var btn;
			
			for(var i=0; i<_s.totalYtbButtons; i++){
				FWDEVPYTBQButton.setPrototype();
				btn = new FWDEVPYTBQButton(_s.ytbQuality_ar[i], 
						_s.youtubeQualityButtonNormalColor_str, 
						_s.youtubeQualityButtonSelectedColor_str,
						_d.hdPath_str,
						i);
				btn.addListener(FWDEVPYTBQButton.MOUSE_OVER, _s.ytbQualityOver);
				btn.addListener(FWDEVPYTBQButton.MOUSE_OUT, _s.ytbQualityOut);
				btn.addListener(FWDEVPYTBQButton.CLICK, _s.ytbQualityClick);
				_s.ytbButtons_ar[i] = btn;
				_s.ytbButtonsHolder_do.addChild(btn);
				
			}
			_s.ytbButtonsHolder_do.addChild(_s.qualityArrow_do);
			_s.hideQualityButtons(false);
		};
		
		_s.ytbQualityOver = function(e){
			_s.setYtbQualityArrowPosition(e.target);
		};
		
		_s.ytbQualityOut = function(e){
			_s.setYtbQualityArrowPosition(undefined);
		};
		
		_s.ytbQualityClick = function(e){
			_s.hideQualityButtons(true);
			_s.dispatchEvent(FWDEVPController.CHANGE_YOUTUBE_QUALITY, {quality:e.target.label_str, id:e.id});
		};
		
		_s.positionAndResizeYtbQualityButtons = function(ar){
			if(!ar) return;
			var totalButtons = ar.length;
			
			var btn;
			var startY = 12;
			var offsetY = 4;
			var addToTotalH = 6;
			var totalWidth = 0;
			var totalHeight = 0;
			
			if(_s.prevQuality_ar){
				if(JSON.stringify(ar) == JSON.stringify(_s.prevQuality_ar)){
					return;
				}
			}
			
			_s.prevQuality_ar = ar;

			if(prt.sH < 350){
				startY = 6;
				offsetY = 0;
				addToTotalH = 4;
			}

			for(var i=0; i<totalButtons; i++){
				btn = _s.ytbButtons_ar[i];
				btn.updateText(ar[i]);
				btn.setFinalSize();
			}
			
			setTimeout(function(){
				for(var i=0; i<_s.totalYtbButtons; i++){
					btn = _s.ytbButtons_ar[i];
					if(i < totalButtons){
						btn.setX(9);
						if(btn.w > totalWidth) totalWidth = btn.w;
						btn.setY(startY);
						startY += btn.h + offsetY;
					}else{
						if(btn.x != -10000) btn.setX(-10000);
					}
				}
				totalWidth += 20;
				for(var i=0; i<_s.totalYtbButtons; i++){
					btn = _s.ytbButtons_ar[i];
					if(btn.dumy_do.w < totalWidth){
						btn.setWidth(totalWidth);
						btn.dumy_do.setWidth(totalWidth);
					}
				}
			
				totalHeight = startY + addToTotalH;
				_s.pointer_do.setX(parseInt((totalWidth - _s.pointer_do.w)/2));

				_s.pointer_do.setY(totalHeight);
				if(_s.ytbButtonBackground_do){
					_s.ytbButtonBackground_do.setWidth(totalWidth);
					_s.ytbButtonBackground_do.setHeight(totalHeight);
				}
				_s.ytbButtonsHolder_do.setWidth(totalWidth);
				_s.ytbButtonsHolder_do.setHeight(totalHeight);
			}, 60);
		};
		
		_s.disableQualityButtons = function(curQualityLevel, btnId){
			_s.showHDIcon(curQualityLevel);
			
			for(var i=0; i<_s.totalYtbButtons; i++){
				var btn = _s.ytbButtons_ar[i];
			
				if(btn.label_str == curQualityLevel
					|| btn.id === btnId){
					FWDAnimation.killTweensOf(_s.qualityArrow_do);

					if(btnId !== undefined){
						if(btn.id === btnId){
							_s.showHDIcon(_s.ytbButtons_ar[btnId].label_str)
						}
					}

					if(btn.y != 0){
						_s.qualityArrow_do.setY(btn.y + Math.round((btn.h - _s.qualityArrow_do.h)/2));
						_s.ytbDisabledButton_do = btn;
					}
					
					btn.disable();
				}else{
					btn.enable();
				}
			}
		};

		_s.showHDIcon = function(curQualityLevel){
			if(curQualityLevel == "highres"
				|| curQualityLevel == "hd720" 
			    || curQualityLevel == "hd1080"
			 	|| curQualityLevel == "hd1440" 
			 	|| curQualityLevel == "hd2160"
			 	|| curQualityLevel == "hd2880"
			){
				_s.ytbQualityButton_do.showDisabledState();
			}else{
				_s.ytbQualityButton_do.hideDisabledState();
			}
			
		}
		
		_s.setYtbQualityArrowPosition = function(target){
			var curY = 0;
			if(!target){
				curY = _s.ytbDisabledButton_do.y + Math.round((_s.ytbDisabledButton_do.h - _s.qualityArrow_do.h)/2);
			}else{
				curY = target.y + Math.round((target.h - _s.qualityArrow_do.h)/2);
			}
			
			FWDAnimation.killTweensOf(_s.qualityArrow_do);
			FWDAnimation.to(_s.qualityArrow_do, .6, {y:curY, delay:.1, ease:Expo.easeInOut});
		};
		
		_s.showQualityButtons = function(animate){
			if(_s.areYtbQualityButtonsShowed_bl || !_s.showYoutubeQualityButton_bl) return;
			_s.hideSubtitleButtons();
			_s.areYtbQualityButtonsShowed_bl = true;
			var finalX = parseInt(_s.ytbQualityButton_do.x + (parseInt(_s.ytbQualityButton_do.w - _s.ytbButtonsHolder_do.w)/2));
			var finalY = parseInt(prt.sH - _s.sH - _s.ytbButtonsHolder_do.h - 6);
			
			if(window.hasPointerEvent_bl){
				window.addEventListener("pointerdown", _s.hideQualityButtonsHandler);
			}else{
				if(!_s.isMobile_bl){
					window.addEventListener("mousedown", _s.hideQualityButtonsHandler);
				}
				window.addEventListener("touchstart", _s.hideQualityButtonsHandler);
			}
			
			_s.ytbButtonsHolder_do.setX(finalX);
		
			if(animate){
				FWDAnimation.to(_s.ytbButtonsHolder_do, .6, {y:finalY, ease:Expo.easeInOut});
			}else{
				FWDAnimation.killTweensOf(_s.ytbButtonsHolder_do);
				_s.ytbButtonsHolder_do.setY(finalY);
			}
		};
	
		_s.hideQualityButtons = function(animate){
			if(!_s.areYtbQualityButtonsShowed_bl || !_s.showYoutubeQualityButton_bl) return;
			_s.areYtbQualityButtonsShowed_bl = false;
			if(animate){
				FWDAnimation.to(_s.ytbButtonsHolder_do, .6, {y:prt.sH, ease:Expo.easeInOut});
			}else{
				FWDAnimation.killTweensOf(_s.ytbButtonsHolder_do);
				_s.ytbButtonsHolder_do.setY(prt.sH);
			}
			
			if(window.hasPointerEvent_bl){
				window.removeEventListener("pointerdown", _s.hideQualityButtonsHandler);
			}else{
				if(!_s.isMobile_bl){
					window.removeEventListener("mousedown", _s.hideQualityButtonsHandler);
				}
				window.removeEventListener("touchstart", _s.hideQualityButtonsHandler);
			}
		};
		
		
		//##########################################//
		/* Setup youtube quality button */
		//##########################################//
		_s.setupYoutubeQualityButton = function(){
			
			if(_s.useVectorIcons_bl){
				FWDEVPSimpleButton.prototype = new FWDEVPDO("div");
				var ic = prt.fontIcon + ' ' + prt.fontIcon + '-settings';
				_s.ytbQualityButton_do = new FWDEVPSimpleButton(
						undefined, undefined, undefined, true, undefined, undefined, undefined,
						"<span class='" + ic + "'></span>",
						_d.hdIcn,
						"EVPMainButtonsNormalState",
						"EVPMainButtonsSelectedState"
				);
			}else{
				FWDEVPSimpleButton.prototype = new FWDEVPDO("div");
				_s.ytbQualityButton_do = new FWDEVPSimpleButton(
						_s.ytbQualityN_img,
						_d.ytbQualitySPath_str,
						_d.ytbQualityDPath_str,
						true,
						_s.useHEX,
						_s.nBC,
						_s.sBC
				);
			}

			_s.ytbQualityButton_do.screen.className = "fwdevp-quality-button";
		
			_s.ytbQualityButton_do.setX(-3000);
			_s.ytbQualityButton_do.setY(parseInt((_s.sH - _s.ytbQualityButton_do.h)/2));
			_s.ytbQualityButton_do.addListener(FWDEVPSimpleButton.MOUSE_UP, _s.ytbQualityMouseUpHandler);
			_s.mainHolder_do.addChild(_s.ytbQualityButton_do);
		};
		
		_s.ytbQualityMouseUpHandler = function(){
			if(_s.areYtbQualityButtonsShowed_bl){
				_s.hideQualityButtons(true);
			}else{
				_s.showQualityButtons(true);
			}
		};
		
		_s.hideQualityButtonsHandler = function(e){
			var vc = FWDEVPUtils.getViewportMouseCoordinates(e);	
			if(FWDEVPUtils.hitTest(_s.ytbQualityButton_do.screen, vc.screenX, vc.screenY)
			   || FWDEVPUtils.hitTest(_s.ytbButtonsHolder_do.screen, vc.screenX, vc.screenY)){
				return;
			}
			_s.hideQualityButtons(true);
		};
		
		_s.addYtbQualityButton = function(){
		
			if(_s.hasYtbButton_bl || !_s.showYoutubeQualityButton_bl) return;
			_s.hasYtbButton_bl = true;
			if(_s.shareButton_do && FWDEVPUtils.indexOfArray(_s.buttons_ar, _s.shareButton_do) != -1){
				_s.buttons_ar.splice(FWDEVPUtils.indexOfArray(_s.buttons_ar, _s.shareButton_do), 0, _s.ytbQualityButton_do);
			}else if(_s.fullScreenButton_do && FWDEVPUtils.indexOfArray(_s.buttons_ar, _s.fullScreenButton_do) != -1){
				_s.buttons_ar.splice(FWDEVPUtils.indexOfArray(_s.buttons_ar, _s.fullScreenButton_do), 0, _s.ytbQualityButton_do);
			}else{
				_s.buttons_ar.splice(_s.buttons_ar.length, 0, _s.ytbQualityButton_do);
			}
			
			_s.ytbQualityButton_do.disable();
			_s.ytbQualityButton_do.rotation = 0;
			_s.ytbQualityButton_do.setRotation(_s.ytbQualityButton_do.rotation);
			_s.ytbQualityButton_do.hideDisabledState();
			_s.hideQualityButtons(false);
			
			_s.positionButtons();
		};
		
		_s.removeYtbQualityButton = function(){
			if(!_s.hasYtbButton_bl || !_s.showYoutubeQualityButton_bl) return;
			_s.hasYtbButton_bl = false;
			if(_s.volumeScrubber_do && FWDEVPUtils.indexOfArray(_s.buttons_ar, _s.ytbQualityButton_do) != -1){
				_s.buttons_ar.splice(FWDEVPUtils.indexOfArray(_s.buttons_ar, _s.ytbQualityButton_do), 1);
			}
			
			_s.ytbQualityButton_do.setX(-3000);
			_s.ytbQualityButton_do.hideDisabledState();
			_s.hideQualityButtons(false);
			_s.positionButtons();
		};
		
		_s.updateQuality = function(qualityLevels, curQualityLevel, id){
		
			if(!_s.hasYtbButton_bl || !_s.showYoutubeQualityButton_bl || prt.isAdd_bl) return;

			_s.positionAndResizeYtbQualityButtons(qualityLevels);

			setTimeout(function(){
				_s.disableQualityButtons(curQualityLevel, id);
			},65);
			
		};	
		
		_s.enableQualtyButton = function(){
			if(_s.ytbQualityButton_do) _s.ytbQualityButton_do.enable();
		}
		
		_s.disableQualtyButton = function(){
			if(_s.ytbQualityButton_do) _s.ytbQualityButton_do.disable();
		}
		

		//##########################################//
		/* Setup subtitle button */
		//##########################################//
		_s.showSubtitleButton_bl
		_s.subtitlesSource_ar = _d.subtitles_ar;
		_s.subtitleButtons_ar = [];
		_s.totalSubttleButtons = 10;
		
		_s.setupSubtitleButton = function(){
			if(_s.useVectorIcons_bl){
				FWDEVPComplexButton.setPrototype();
				FWDEVPUtils.cmpBtnNPos();
				var ic1 = prt.fontIcon + ' ' + prt.fontIcon + '-CC';
				var ic2 = prt.fontIcon + ' ' + prt.fontIcon + '-CC-off';
				_s.subtitleButton_do = new FWDEVPComplexButton(0, 0, 0, 0, true, 0, 0, 0,
					"<span class='" + ic1 + "'></span>",
					"<span class='" + ic2 + "'></span>",
					"EVPMainButtonsNormalState",
					"EVPMainButtonsSelectedState"
				);
			}else{
				FWDEVPComplexButton.setPrototype();
				_s.subtitleButton_do = new FWDEVPComplexButton(
						_d.showSubtitleNPath_img,
						_d.showSubtitleSPath_str,
						_d.hideSubtitleNPath_img,
						_d.hideSubtitleSPath_str,
						true,
						_s.useHEX,
						_s.nBC,
						_s.sBC
				);
			}

			_s.subtitleButton_do.screen.className = "fwdevp-subtitle-button";
			
			_s.subtitleButton_do.setX(-10000);
			_s.buttons_ar.push(_s.subtitleButton_do);
			_s.subtitleButton_do.setY(parseInt((_s.sH - _s.subtitleButton_do.h)/2));
			_s.subtitleButton_do.addListener(FWDEVPComplexButton.MOUSE_UP, _s.subtitleButtonMouseUpHandler);
			_s.mainHolder_do.addChild(_s.subtitleButton_do);
			
			_s.setupSubtitleButtons();
			
			if(location.protocol.indexOf("file:") != -1) _s.disableSubtitleButton();
			
			if(prt.subtitle_do.showSubtitileByDefault_bl) _s.subtitleButton_do.setButtonState(0);
		}
		
		_s.subtitleButtonMouseUpHandler = function(){
			if(_s.areSubtitleButtonsShowed_bl){
				_s.hideSubtitleButtons(true);
			}else{
				_s.showSubtitleButtons(true);
			}
		};
		
		_s.disableSubtitleButton = function(){
			if(_s.subtitleButton_do) _s.subtitleButton_do.disable();
		};
		
		_s.enableSubtitleButton = function(){
			if(_s.subtitleButton_do) _s.subtitleButton_do.enable();
		};
		

		//###################################################//
		/* Setup subtitlebuttons */
		//###################################################//
		_s.updateSubtitleButtons = function(subtitles, subtitleIndex){

			if(!_s.subtitleButton_do) return;
			_s.subtitleButton_do.enable();
			_s.positionAndResizeSubtitleButtons(subtitles);
			setTimeout(function(){
				subtitleIndex = _s.subtitlesSource_ar.length - 1 - subtitleIndex;
				_s.disableSubtitleButtons(subtitleIndex);
			},65);
			_s.prevSubtitleIndex = subtitleIndex;
		};	
		
		_s.setupSubtitleButtons = function(){

			_s.subtitlesButtonsHolder_do = new FWDEVPDO("div");
			_s.subtitlesButtonsHolder_do.setOverflow("visible");
			if(_s.repeatBackground_bl){
				_s.subtitlesButtonsHolder_do.style().background = "url('" + _s.controllerBkPath_str +  "')";
			}else{
				_s.subtitlesButtonsBackground_do = new FWDEVPDO("img");
				var img = new Image();
				img.src = _s.controllerBkPath_str;
				_s.subtitlesButtonsBackground_do.setScreen(img);
				_s.subtitlesButtonsHolder_do.addChild(_s.subtitlesButtonsBackground_do);
			}
			
			_s.subtitlesButtonsHolder_do.setX(300);
			_s.subtitlesButtonsHolder_do.setY(-300);
			prt.main_do.addChild(_s.subtitlesButtonsHolder_do, 0);
			
			var img = new Image();
			img.src = _s.ytbQualityButtonPointerPath_str;
			_s.subtitlesPonter_do = new FWDEVPDO("img");
			_s.subtitlesPonter_do.setScreen(img);
			_s.subtitlesPonter_do.setWidth(_s.pointerWidth);
			_s.subtitlesPonter_do.setHeight(_s.pointerHeight);
			_s.subtitlesButtonsHolder_do.addChild(_s.subtitlesPonter_do);
	
			
			var img = new Image();
			img.src = _s.youtubeQualityArrowPath_str;
			_s.subtitleQualityArrow_do = new FWDEVPDO("img");
			_s.subtitleQualityArrow_do.setScreen(img);
			_s.subtitleQualityArrow_do.setX(16);
			_s.subtitleQualityArrow_do.setWidth(5);
			_s.subtitleQualityArrow_do.setHeight(7);
			_s.subtitlesButtonsHolder_do.addChild(_s.subtitleQualityArrow_do);
			
			var btn;
			
			for(var i=0; i<_s.totalSubttleButtons; i++){
				FWDEVPYTBQButton.setPrototype();
				btn = new FWDEVPYTBQButton("no source", 
						_s.youtubeQualityButtonNormalColor_str, 
						_s.youtubeQualityButtonSelectedColor_str,
						_d.hdPath_str,
						i);
				
				btn.addListener(FWDEVPYTBQButton.MOUSE_OVER, _s.sbtQualityOver);
				btn.addListener(FWDEVPYTBQButton.MOUSE_OUT, _s.sbtQualityOut);
				btn.addListener(FWDEVPYTBQButton.CLICK, _s.sbtQualityClick);
				_s.subtitleButtons_ar[i] = btn;
				_s.subtitlesButtonsHolder_do.addChild(btn);
			}
			_s.hideSubtitleButtons(false);
		};
		
		_s.sbtQualityOver = function(e){
			_s.setSubtitleArrowPosition(e.target);
		};
		
		_s.sbtQualityOut = function(e){
			_s.setSubtitleArrowPosition(undefined);
		};
		
		_s.sbtQualityClick = function(e){
			_s.startAtSubtitle = e.id;
			_s.disableSubtitleButtons(_s.startAtSubtitle);
			_s.hideSubtitleButtons(true);
			_s.dispatchEvent(FWDEVPController.CHANGE_SUBTITLE, {id:_s.subtitlesSource_ar.length -1 - e.id});
		};


		_s.positionAndResizeSubtitleButtons = function(ar){

			if(!ar) return;
			
			var totalButtons = ar.length;
			if(_s.prevSubtitlesQualityButtonsLength == totalButtons) return;
			_s.prevSubtitlesQualityButtonsLength = totalButtons;
			var btn;
			var startY = 12;
			var offsetY = 4;
			var addToTotalH = 6;
			var totalWidth = 0;
			var totalHeight = 0;

			if(prt.sH < 350){
				startY = 6;
				offsetY = 0;
				addToTotalH = 4;
			}

			for(var i=0; i<totalButtons; i++){
				btn = _s.subtitleButtons_ar[i];
				btn.updateText(ar[i]["label"]);
				btn.setFinalSize();
			}
			
			setTimeout(function(){
				for(var i=0; i<_s.totalSubttleButtons; i++){
					btn = _s.subtitleButtons_ar[i];
					if(i < totalButtons){
						btn.setX(9);
						if(btn.w > totalWidth) totalWidth = btn.w;
						btn.setY(startY);
						startY += btn.h + offsetY;
					}else{
						if(btn.x != -10000) btn.setX(-10000);
					}
				}

				totalWidth += 20;

				for(var i=0; i<_s.totalSubttleButtons; i++){
					btn = _s.subtitleButtons_ar[i];
					if(btn.dumy_do.w < totalWidth){
						btn.setWidth(totalWidth);
						btn.dumy_do.setWidth(totalWidth);
					}
				}
				
				totalHeight = startY + addToTotalH;
				_s.subtitlesPonter_do.setX(parseInt((totalWidth - _s.subtitlesPonter_do.w)/2));
				_s.subtitlesPonter_do.setY(totalHeight);
				if(_s.subtitlesButtonsBackground_do){	
					_s.subtitlesButtonsBackground_do.setWidth(totalWidth);
					_s.subtitlesButtonsBackground_do.setHeight(totalHeight);
				}
				_s.subtitlesButtonsHolder_do.setWidth(totalWidth);
				_s.subtitlesButtonsHolder_do.setHeight(totalHeight);
			}, 60);
		};
		
		_s.disableSubtitleButtons = function(index){

			for(var i=0; i<_s.totalSubttleButtons; i++){
				var btn = _s.subtitleButtons_ar[i];
				if(i == index){
					FWDAnimation.killTweensOf(_s.subtitleQualityArrow_do);
					_s.subtitleQualityArrow_do.setY(btn.y + parseInt((btn.h - _s.subtitleQualityArrow_do.h)/2) + 1);
					btn.disable();
					_s.subtitleDisabledButton_do = btn;
				}else{
					btn.enable();
				}
			}
			
			if(_s.subtitlesSource_ar.length -1 - index == 0){
				_s.subtitleButton_do.setButtonState(0);
			}else{
				_s.subtitleButton_do.setButtonState(1);
			}
		};
		
		_s.setSubtitleArrowPosition = function(target){

			var curY = 0;
			if(!target){
				curY = _s.subtitleDisabledButton_do.y + parseInt((_s.subtitleDisabledButton_do.h - _s.subtitleQualityArrow_do.h)/2) - 1;
			}else{
				curY = target.y + parseInt((target.h - _s.subtitleQualityArrow_do.h)/2) - 1;
			}
			FWDAnimation.killTweensOf(_s.subtitleQualityArrow_do);
			FWDAnimation.to(_s.subtitleQualityArrow_do, .6, {y:curY, delay:.1, ease:Expo.easeInOut});
		};
		
		_s.showSubtitleButtons = function(animate){
		
			if(_s.areSubtitleButtonsShowed_bl) return;
			_s.hideQualityButtons();
			_s.areSubtitleButtonsShowed_bl = true;
			var finalX = parseInt(_s.subtitleButton_do.x + (parseInt(_s.subtitleButton_do.w - _s.subtitlesButtonsHolder_do.w)/2));
			var finalY = parseInt(prt.sH - _s.sH - _s.subtitlesButtonsHolder_do.h - 6);
			
			if(_s.hasPointerEvent_bl){
				window.addEventListener("pointerdown", _s.hideSubtitlesButtonsHandler);
			}else{
				if(!_s.isMobile_bl){
					window.addEventListener("mousedown", _s.hideSubtitlesButtonsHandler);
				}
				window.addEventListener("touchstart", _s.hideSubtitlesButtonsHandler);
			}
			
			_s.subtitlesButtonsHolder_do.setX(finalX);
		
			if(animate){
				FWDAnimation.to(_s.subtitlesButtonsHolder_do, .6, {y:finalY, ease:Expo.easeInOut});
			}else{
				FWDAnimation.killTweensOf(_s.subtitlesButtonsHolder_do);
				_s.subtitlesButtonsHolder_do.setY(finalY);
			}
		};
	
		_s.hideSubtitleButtons = function(animate){
			if(!_s.areSubtitleButtonsShowed_bl || !_s.showSubtitleButton_bl) return;
			_s.areSubtitleButtonsShowed_bl = false;
			if(animate){
				FWDAnimation.to(_s.subtitlesButtonsHolder_do, .6, {y:prt.sH, ease:Expo.easeInOut});
			}else{
				FWDAnimation.killTweensOf(_s.subtitlesButtonsHolder_do);
				_s.subtitlesButtonsHolder_do.setY(prt.sH);
			}
			
			if(_s.hasPointerEvent_bl){
				window.removeEventListener("pointerdown", _s.hideSubtitlesButtonsHandler);
			}else{
				if(!_s.isMobile_bl){
					window.removeEventListener("mousedown", _s.hideSubtitlesButtonsHandler);
				}
				window.removeEventListener("touchstart", _s.hideSubtitlesButtonsHandler);
			}
		};
		
		_s.hideSubtitlesButtonsHandler = function(e){
			var vc = FWDEVPUtils.getViewportMouseCoordinates(e);	
			if(FWDEVPUtils.hitTest(_s.subtitleButton_do.screen, vc.screenX, vc.screenY)
			   || FWDEVPUtils.hitTest(_s.subtitlesButtonsHolder_do.screen, vc.screenX, vc.screenY)){
				return;
			}
			_s.hideSubtitleButtons(true);
		};
		
	
		//##########################################//
		/* Setup facebook button */
		//##########################################//
		_s.setupRewindButton = function(){
			if(_s.useVectorIcons_bl){				
				FWDEVPSimpleButton.setPrototype();
				FWDEVPUtils.smpBtnNPos();
				var ic = prt.fontIcon + ' ' + prt.fontIcon + '-10';
				_s.rewindButton_do = new FWDEVPSimpleButton(
						undefined, undefined, undefined, true, undefined, undefined, undefined,
						"<span class='" + ic + "'></span>",
						undefined,
						"EVPMainButtonsNormalState",
						"EVPMainButtonsSelectedState"
				);
			}else{
				FWDEVPSimpleButton.setPrototype();
				_s.rewindButton_do = new FWDEVPSimpleButton(
						_d.rewindN_img,
						_d.rewindSPath_str,
						undefined,
						true,
						_s.useHEX,
						_s.nBC,
						_s.sBC
				);
			}

			_s.rewindButton_do.screen.className = "fwdevp-rewind-button";

			
			_s.buttons_ar.push(_s.rewindButton_do);
			_s.rewindButton_do.setY(parseInt((_s.sH - _s.rewindButton_do.h)/2));
			_s.rewindButton_do.addListener(FWDEVPSimpleButton.MOUSE_UP, _s.rewindButtonMouseUpHandler);
			_s.mainHolder_do.addChild(_s.rewindButton_do);
		};
		
	
		_s.rewindButtonMouseUpHandler = function(){
			_s.dispatchEvent(FWDEVPController.REWIND);
		};
		
		_s.disableRewindButton = function(){
			if(_s.rewindButton_do) _s.rewindButton_do.disable();
		}
		
		_s.enableRewindButton = function(){
			if(_s.rewindButton_do) _s.rewindButton_do.enable();
		}
	

		//##########################################//
		/* Setup facebook button */
		//##########################################//
		_s.setupShareButton = function(){
			
			if(_s.useVectorIcons_bl){
				FWDEVPSimpleButton.setPrototype();
				FWDEVPUtils.smpBtnNPos();
				var ic = prt.fontIcon + ' ' + prt.fontIcon + '-share';
				_s.shareButton_do = new FWDEVPSimpleButton(
						undefined, undefined, undefined, true, undefined, undefined, undefined,
						"<span class='" + ic + "'></span>",
						undefined,
						"EVPMainButtonsNormalState",
						"EVPMainButtonsSelectedState"
				);
			}else{
				FWDEVPSimpleButton.setPrototype();
				_s.shareButton_do = new FWDEVPSimpleButton(
						_s.shareN_img,
						_d.shareSPath_str,
						undefined,
						true,
						_s.useHEX,
						_s.nBC,
						_s.sBC
				);
			}

			_s.shareButton_do.screen.className = "fwdevp-share-button";
			_s.buttons_ar.push(_s.shareButton_do);
			_s.shareButton_do.setY(parseInt((_s.sH - _s.shareButton_do.h)/2));
			_s.shareButton_do.addListener(FWDEVPSimpleButton.MOUSE_UP, _s.facebookButtonMouseUpHandler);
			_s.mainHolder_do.addChild(_s.shareButton_do);
		};
		
	
		_s.facebookButtonMouseUpHandler = function(){
			_s.dispatchEvent(FWDEVPController.SHARE);
		};
		

		//##########################################//
		/* Setup download button */
		//#########################################//
		_s.setupDownloadButton = function(){
			if(_s.useVectorIcons_bl){
				FWDEVPSimpleButton.setPrototype();
				FWDEVPUtils.smpBtnNPos();
				var ic = prt.fontIcon + ' ' + prt.fontIcon + '-download';
				_s.downloadButton_do = new FWDEVPSimpleButton(
						undefined, undefined, undefined, true, undefined, undefined, undefined,
						"<span class='" + ic + "'></span>",
						undefined,
						"EVPMainButtonsNormalState",
						"EVPMainButtonsSelectedState"
				);
			}else{
				FWDEVPSimpleButton.setPrototype();
				_s.downloadButton_do = new FWDEVPSimpleButton(_d.downloadN_img, _d.downloadSPath_str, undefined, true, _s.useHEX,
						_s.nBC,
						_s.sBC);
			}

			_s.downloadButton_do.screen.className = "fwdevp-download-button";

			_s.downloadButton_do.addListener(FWDEVPSimpleButton.MOUSE_UP, _s.downloadButtonOnMouseUpHandler);
			_s.buttons_ar.push(_s.downloadButton_do);
			_s.mainHolder_do.addChild(_s.downloadButton_do); 
		};
		
		_s.downloadButtonShowToolTipHandler = function(e){};
		
		_s.downloadButtonOnMouseUpHandler = function(){
			_s.dispatchEvent(FWDEVPController.DOWNLOAD_VIDEO);
		};


		//###################################################//
		/* Setup audio traks button */
		//###################################################//
		_s.setupAudioTracksButton = function(){
			if(_s.useVectorIcons_bl){
				FWDEVPSimpleButton.setPrototype();
				var ic = prt.fontIcon +' ' + prt.fontIcon + '-headephone';
				_s.atButton_do = new FWDEVPSimpleButton(
						undefined, undefined, undefined, true, undefined, undefined, undefined,
						"<div class='table-fwdevp-button'><span class='table-cell-fwdevp-button " + ic + "'></span></div>",
						undefined,
						"EVPMainButtonsNormalState",
						"EVPMainButtonsSelectedState"
				);
				_s.atButton_do.screen.className = "fwduvp-audio-tracks-button vector";
			}else{
				FWDEVPSimpleButton.setPrototype();
				_s.atButton_do = new FWDEVPSimpleButton(_d.at_img,
															 _d.atSPath_img, 
															 undefined, 
															 true,
															 _s.useHEX,
															 _s.nBC,
															 _s.sBC);
				_s.atButton_do.screen.className = "fwduvp-audio-tracks-button";
			}

			var checkIconInterval = setInterval(function(){
				if(_s.atButton_do.buttonHeight > 0){
					clearInterval(checkIconInterval);
					_s.atButton_do.setY(parseInt((_s.sH - _s.atButton_do.buttonHeight)/2));
				}
			}, 50);
			
			_s.atButton_do.screen.className = 'fwduvp-audio-tracks-button';
			_s.atButton_do.setY(parseInt((_s.sH - _s.atButton_do.h)/2));
			_s.atButton_do.addListener(FWDEVPSimpleButton.MOUSE_UP, _s.atButtonMouseUpHandler);
			_s.atButton_do.setX(-3000);
			_s.mainHolder_do.addChild(_s.atButton_do);

			_s.setupATBButtons();
			_s.disableAtButton();

			_s.ATBButtonsHolder_do.setX(-8000);
		}
		
		_s.atButtonMouseUpHandler = function(){
			if(_s.areATBButtonsShowed_bl){
				_s.hideATBButtons(true);
			}else{
				_s.showATBButtons(true);
			}
		};
		
		_s.disableAtButton = function(){
			if(_s.atButton_do) _s.atButton_do.disable();
		};
		
		_s.enableAtButton = function(){
			if(_s.atButton_do) _s.atButton_do.enable();
		};
			
		_s.addAtButton = function(){
			if(!_s.atButton_do) return;
			_s.disableAtButton();
			
			if(FWDEVPUtils.indexOfArray(_s.buttons_ar, _s.atButton_do) == -1){
				if(_s.ytbQualityButton_do && FWDEVPUtils.indexOfArray(_s.buttons_ar, _s.ytbQualityButton_do) != -1){
					var indexToAdd = FWDEVPUtils.indexOfArray(_s.buttons_ar, _s.ytbQualityButton_do)
					_s.buttons_ar.splice(indexToAdd, 0, _s.atButton_do);
				}else if(_s.fullScreenButton_do && FWDEVPUtils.indexOfArray(_s.buttons_ar, _s.fullScreenButton_do) != -1){
					var indexToAdd = FWDEVPUtils.indexOfArray(_s.buttons_ar, _s.fullScreenButton_do);
					_s.buttons_ar.splice(indexToAdd, 0, _s.atButton_do);
				}else{
					_s.buttons_ar.splice(_s.buttons_ar.length,0, _s.atButton_do);
				}
				_s.positionButtons();
			}
		}

		_s.removeAtButton = function(){
			if(!_s.atButton_do) return;
		
			if(FWDEVPUtils.indexOfArray(_s.buttons_ar, _s.atButton_do) != -1){
				_s.buttons_ar.splice(FWDEVPUtils.indexOfArray(_s.buttons_ar, _s.atButton_do), 1);
				_s.atButton_do.setX(-300);
				_s.positionButtons();
			}
		};


		//###################################################//
		/* Setup audio tracks buttons. */
		//###################################################//
		_s.totalATBButtons = 10;
		_s.areATBButtonsShowed_bl = false;
		_s.updateATBButtons = function(ATB, ATBIndex){
			if(!_s.atButton_do) return;
		
			_s.ATBSource_ar = ATB;

			_s.positionAndResizeATBButtons(ATB);
			
			setTimeout(function(){
				ATBIndex = _s.ATBSource_ar.length - 1 - ATBIndex;
				_s.disableATBButtons(ATBIndex);
			},65);
			_s.prevATBIndex = ATBIndex;
		};	
		
		_s.setupATBButtons = function(){

			_s.ATBButtons_ar = [];
			_s.ATBButtonsHolder_do = new FWDEVPDO("div");
			_s.ATBButtonsHolder_do.setOverflow("visible");
			if(_s.repeatBackground_bl){
				_s.ATBButtonsHolder_do.screen.style.background = "url('" + _s.controllerBkPath_str +  "')";
			}else{
				_s.ATBButtonsBackground_do = new FWDEVPDO("img");
				var img = new Image();
				img.src = _s.controllerBkPath_str;
				_s.ATBButtonsBackground_do.setScreen(img);
				_s.ATBButtonsHolder_do.addChild(_s.ATBButtonsBackground_do);
			}
			
			_s.ATBButtonsHolder_do.setX(300);
			_s.ATBButtonsHolder_do.setY(-300);
			prt.main_do.addChild(_s.ATBButtonsHolder_do, 0);
			
			var img = new Image();
			img.src = _s.ytbQualityButtonPointerPath_str;
			_s.ATBPonter_do = new FWDEVPDO("img");
			_s.ATBPonter_do.setScreen(img);
			_s.ATBPonter_do.setWidth(_s.pointerWidth);
			_s.ATBPonter_do.setHeight(_s.pointerHeight);
			_s.ATBButtonsHolder_do.addChild(_s.ATBPonter_do);
	
			var img = new Image();
			img.src = _s.youtubeQualityArrowPath_str;
			_s.ABTQualityArrow_do = new FWDEVPDO("img");
			_s.ABTQualityArrow_do.setScreen(img);
			_s.ABTQualityArrow_do.setX(7);
			_s.ABTQualityArrow_do.setWidth(5);
			_s.ABTQualityArrow_do.setHeight(7);
			_s.ATBButtonsHolder_do.addChild(_s.ABTQualityArrow_do);
					
			for(var i=0; i<_s.totalATBButtons; i++){
				FWDEVPYTBQButton.setPrototype();
				var btn = new FWDEVPYTBQButton("no source", 
						_s.youtubeQualityButtonNormalColor_str, 
						_s.youtubeQualityButtonSelectedColor_str,
						_d.hdPath_str,
						i);
				
				btn.addListener(FWDEVPYTBQButton.MOUSE_OVER, _s.ATBQualityOver);
				btn.addListener(FWDEVPYTBQButton.MOUSE_OUT, _s.ATBQualityOut);
				btn.addListener(FWDEVPYTBQButton.CLICK, _s.ATBQualityClick);
				_s.ATBButtons_ar[i] = btn;
				_s.ATBButtonsHolder_do.addChild(btn);
			}
			_s.hideATBButtons(false);
		};
		
		_s.ATBQualityOver = function(e){
			_s.setATBArrowPosition(e.target);
		};
		
		_s.ATBQualityOut = function(e){
			_s.setATBArrowPosition(undefined);
		};
		
		_s.ATBQualityClick = function(e){
			_s.startAtATB = e.id;
			
			_s.disableATBButtons(_s.startAtATB);
			_s.hideATBButtons(true);
			
			_s.dispatchEvent(FWDEVPController.CHANGE_AUDIO_TRACKS, {id:_s.ATBSource_ar.length -1 - e.id});
		};
		
		_s.positionAndResizeATBButtons = function(ar){
			if(!ar) return;
			
			var totalButtons = ar.length;

			if(_s.prevATBButtonsLength == totalButtons) return;
			_s.prevATBButtonsLength = totalButtons;

			var btn;
			var startY = 5;
			var totalWidth = 0;
			var totalHeight = 0;

			for(var i=0; i<totalButtons; i++){
				btn = _s.ATBButtons_ar[i];
				btn.updateText(ar[i]["label"]);
				btn.setFinalSize();
			}

			setTimeout(function(){
				for(var i=0; i<_s.totalATBButtons; i++){
					btn = _s.ATBButtons_ar[i];
					if(i < totalButtons){
						if(btn.x != 0) btn.setX(0);
						if(btn.w > totalWidth) totalWidth = btn.w;
						btn.setY(startY);
						startY += btn.h;
					}else{
						if(btn.x != -3000) btn.setX(-3000);
					}
				}
				
				for(var i=0; i<_s.totalATBButtons; i++){
					btn = _s.ATBButtons_ar[i];
					if(btn.dumy_do.w < totalWidth){
						btn.setWidth(totalWidth);
						btn.dumy_do.setWidth(totalWidth);
					}
				}
				
				totalHeight = startY + 5;

				_s.ATBPonter_do.setX(parseInt((totalWidth - _s.ATBPonter_do.w)/2));
				_s.ATBPonter_do.setY(totalHeight);
				if(_s.ATBButtonsBackground_do){	
					_s.ATBButtonsBackground_do.setWidth(totalWidth);
					_s.ATBButtonsBackground_do.setHeight(totalHeight);
				}
				_s.ATBButtonsHolder_do.setWidth(totalWidth);
				_s.ATBButtonsHolder_do.setHeight(totalHeight);
			}, 60);
		};
		
		_s.disableATBButtons = function(index){
			for(var i=0; i<_s.totalATBButtons; i++){
				var btn = _s.ATBButtons_ar[i];
				if(i == index){
					FWDAnimation.killTweensOf(_s.ABTQualityArrow_do);
					_s.ABTQualityArrow_do.setY(btn.y + parseInt((btn.h - _s.ABTQualityArrow_do.h)/2) + 1);
					btn.disable();
					_s.ABTDisabledButton_do = btn;
				}else{
					btn.enable();
				}
			}
		};
		
		_s.setATBArrowPosition = function(target){
			var curY = 0;
			if(!target){
				curY = _s.ABTDisabledButton_do.y + parseInt((_s.ABTDisabledButton_do.h - _s.ABTQualityArrow_do.h)/2);
			}else{
				curY = target.y + parseInt((target.h - _s.ABTQualityArrow_do.h)/2);
			}
			FWDAnimation.killTweensOf(_s.ABTQualityArrow_do);
			FWDAnimation.to(_s.ABTQualityArrow_do, .6, {y:curY, delay:.1, ease:Expo.easeInOut});
		};
		
		_s.showATBButtons = function(animate){
			if(_s.areATBButtonsShowed_bl) return;
			_s.hideATBButtons();
			_s.areATBButtonsShowed_bl = true;
			var finalX = parseInt(_s.atButton_do.x + (parseInt(_s.atButton_do.w - _s.ATBButtonsHolder_do.w)/2));
			var finalY = parseInt(prt.tempVidStageHeight - _s.sH - _s.ATBButtonsHolder_do.h - 6);
			
			if(_s.hasPointerEvent_bl){
				window.addEventListener("pointerdown", _s.hideATBsButtonsHandler);
			}else{
				if(!_s.isMbl){
					window.addEventListener("mousedown", _s.hideATBsButtonsHandler);
				}
				window.addEventListener("touchstart", _s.hideATBsButtonsHandler);
			}
			
			_s.ATBButtonsHolder_do.setX(finalX);
		
			if(animate){
				FWDAnimation.to(_s.ATBButtonsHolder_do, .6, {y:finalY, ease:Expo.easeInOut});
			}else{
				FWDAnimation.killTweensOf(_s.ATBButtonsHolder_do);
				_s.ATBButtonsHolder_do.setY(finalY);
			}
		};

	
		_s.hideATBButtons = function(animate){
			if(!_s.areATBButtonsShowed_bl || !_s.ATBButtonsHolder_do) return;
			
			_s.areATBButtonsShowed_bl = false;
			if(animate){
				FWDAnimation.to(_s.ATBButtonsHolder_do, .6, {y:prt.sH, ease:Expo.easeInOut});
			}else{
				FWDAnimation.killTweensOf(_s.ATBButtonsHolder_do);
				_s.ATBButtonsHolder_do.setY(prt.sH);
			}

			if(_s.hasPointerEvent_bl){
				window.removeEventListener("pointerdown", _s.hideATBsButtonsHandler);
			}else{
				if(!_s.isMbl){
					window.removeEventListener("mousedown", _s.hideATBsButtonsHandler);
				}
				window.removeEventListener("touchstart", _s.hideATBsButtonsHandler);
			}
		};
		
		_s.hideATBsButtonsHandler = function(e){
			var vc = FWDEVPUtils.getViewportMouseCoordinates(e);	
			if(FWDEVPUtils.hitTest(_s.atButton_do.screen, vc.screenX, vc.screenY)
			   || FWDEVPUtils.hitTest(_s.ATBButtonsHolder_do.screen, vc.screenX, vc.screenY)){
				return;
			}
			_s.hideATBButtons(true);
		};


		//##########################################//
		/* Setup chromecast button */
		//##########################################//
		_s.setupChromecastButton = function(){
			if(_s.useVectorIcons_bl){
				FWDEVPComplexButton.setPrototype();
				FWDEVPUtils.cmpBtnNPos();
				var ic1 = prt.fontIcon + ' ' + prt.fontIcon + '-cast';
				var ic2 = prt.fontIcon + ' ' + prt.fontIcon + '-uncast';
				_s.ccBtn_do = new FWDEVPComplexButton(0, 0, 0, 0, true, 0, 0, 0,
					"<span class='" + ic1 + "'></span>",
					"<span class='" + ic2 + "'></span>",
					"EVPMainButtonsNormalState cast",
					"EVPMainButtonsSelectedState cast"
				);
			}else{
				FWDEVPComplexButton.setPrototype();
				_s.ccBtn_do = new FWDEVPComplexButton(
					_d.castN_img,
					_d.castSPath_str,
					_d.uncastN_img,
					_d.uncastSPath_str,
					true,
					_s.useHEX,
					_s.nBC,
					_s.sBC
				);
			}

			_s.ccBtn_do.screen.className = "fwdevp-translation-button";

			_s.ccBtn_do.addListener(FWDEVPComplexButton.MOUSE_UP, _s.chormecastMouseUpHandler);
			_s.ccBtn_do.setY(100);
			_s.mainHolder_do.addChild(_s.ccBtn_do);
		}

		_s.chormecastMouseUpHandler = function(){
			if(_s.ccBtn_do.currentState == 0){
				_s.dispatchEvent(FWDEVPController.UNCAST);
			}else{
				_s.dispatchEvent(FWDEVPController.CAST);
			}
		}
		
		_s.removeCCButton = function(){
			if(!_s.ccBtn_do) return;
			if(FWDEVPUtils.indexOfArray(_s.buttons_ar, _s.ccBtn_do) != -1){
				_s.buttons_ar.splice(FWDEVPUtils.indexOfArray(_s.buttons_ar, _s.ccBtn_do), 1);
				_s.ccBtn_do.setX(-5000);
				_s.ccBtn_do.setY(parseInt((_s.sH - _s.ccBtn_do.buttonHeight)/2));
				_s.positionButtons();
			}
		};
		
		_s.addCCButton = function(){
			if(!_s.ccBtn_do) return;
			
			if(FWDEVPUtils.indexOfArray(_s.buttons_ar, _s.ccBtn_do) == -1){
				if(_s.vrButton_do && FWDEVPUtils.indexOfArray(_s.buttons_ar, _s.vrButton_do) != -1){
					_s.buttons_ar.splice(FWDEVPUtils.indexOfArray(_s.buttons_ar, _s.vrButton_do), 0, _s.ccBtn_do);
				}else if(_s.fullScreenButton_do && FWDEVPUtils.indexOfArray(_s.buttons_ar, _s.fullScreenButton_do) != -1){
					_s.buttons_ar.splice(FWDEVPUtils.indexOfArray(_s.buttons_ar, _s.fullScreenButton_do), 0, _s.ccBtn_do);
				}else{
					_s.buttons_ar.splice(_s.buttons_ar.length, 0, _s.ccBtn_do);
				}
				_s.positionButtons();
			}
		};
	

		//##########################################//
		/* Setup fullscreen button */
		//##########################################//
		_s.setupFullscreenButton = function(){
			
			if(_s.useVectorIcons_bl){
				FWDEVPComplexButton.setPrototype();
				FWDEVPUtils.cmpBtnNPos();
				var ic1 = prt.fontIcon + ' ' + prt.fontIcon + '-fullscreen';
				var ic2 = prt.fontIcon + ' ' + prt.fontIcon + '-normalscreen';
				_s.fullScreenButton_do = new FWDEVPComplexButton(0, 0, 0, 0, true, 0, 0, 0,
					"<span class='" + ic1 + "'></span>",
					"<span class='" + ic2 + "'></span>",
					"EVPMainButtonsNormalState",
					"EVPMainButtonsSelectedState"
				);
			}else{
				FWDEVPComplexButton.setPrototype();
				_s.fullScreenButton_do = new FWDEVPComplexButton(
					_s.fullScreenN_img,
					_d.fullScreenSPath_str,
					_s.normalScreenN_img,
					_d.normalScreenSPath_str,
					true,
					_s.useHEX,
					_s.nBC,
					_s.sBC
				);
			}

			_s.fullScreenButton_do.screen.className = "fwdevp-fullscreen-button";

			_s.buttons_ar.push(_s.fullScreenButton_do);
			_s.fullScreenButton_do.setY(parseInt((_s.sH - _s.fullScreenButton_do.buttonHeight)/2));
			_s.fullScreenButton_do.addListener(FWDEVPComplexButton.MOUSE_UP, _s.fullScreenButtonMouseUpHandler);
			_s.mainHolder_do.addChild(_s.fullScreenButton_do);
		};
		
		_s.showFullScreenButton = function(){
			if(!_s.fullScreenButton_do) return;
			_s.fullScreenButton_do.setButtonState(1);
		};
		
		_s.showNormalScreenButton = function(){
			if(!_s.fullScreenButton_do) return;
			_s.fullScreenButton_do.setButtonState(0);
		};
		
		_s.setNormalStateToFullScreenButton = function(){
			if(!_s.fullScreenButton_do) return;
			_s.fullScreenButton_do.setNormalState(true);
			_s.hideQualityButtons(false);
		};
		
		_s.fullScreenButtonMouseUpHandler = function(){
			
			if(_s.fullScreenButton_do.currentState == 1){
				_s.dispatchEvent(FWDEVPController.FULL_SCREEN);
			}else{
				_s.dispatchEvent(FWDEVPController.NORMAL_SCREEN);
			}
		};

		
		//########################################//
		/* Setup time*/
		//########################################//
		_s.setupTime = function(){
			_s.time_do = new FWDEVPDO("div");
			_s.time_do.hasT3D = false;
			_s.time_do.hasT2D = false;
			_s.time_do.setBackfaceVisibility();
			_s.time_do.screen.className = 'fwdevp-time';
			_s.time_do.style().fontFamily = "Arial";
			_s.time_do.style().fontSize= "12px";
			_s.time_do.style().whiteSpace= "nowrap";
			_s.time_do.style().textAlign = "center";
			_s.time_do.style().color = _s.timeColor_str;
			_s.time_do.style().fontSmoothing = "antialiased";
			_s.time_do.style().webkitFontSmoothing = "antialiased";
			_s.time_do.style().textRendering = "optimizeLegibility";	
			_s.mainHolder_do.addChild(_s.time_do);
			_s.updateTime("00:00/00:00");
			_s.buttons_ar.push(_s.time_do);
		};
		
		_s.updateTime = function(time){
			if(!_s.time_do) return;
			if(_s.isLive) time = time.substr(0, time.indexOf("/"));
			_s.time_do.setInnerHTML(time);
			
			if(_s.lastTimeLength != time.length){
				_s.time_do.w = _s.time_do.getWidth();
				_s.positionButtons();
				setTimeout(function(){
					_s.time_do.w = _s.time_do.getWidth();
					_s.time_do.h = _s.time_do.getHeight();
					
					_s.positionButtons();
				}, 50);
				_s.lastTimeLength = time.length;
			}
		};
		

		//##########################################//
		/* Setup volume button */
		//#########################################//
		_s.setupVolumeButton = function(){
			if(_s.useVectorIcons_bl){
				FWDEVPVolumeButton.setPrototype();
				FWDEVPVolumeButton.prototype.hasT3D = false;
				FWDEVPVolumeButton.prototype.hasT2D = false;
				var ic1 = prt.fontIcon + ' ' + prt.fontIcon + '-sound';
				var ic2 = prt.fontIcon + ' ' + prt.fontIcon + '-sound-off';
				_s.volumeButton_do = new FWDEVPVolumeButton(undefined, undefined, undefined, undefined, undefined, undefined,
					"<span class='" + ic1 + "'></span>",
					"<span class='" + ic2 + "'></span>",
					"EVPMainButtonsNormalState",
					"EVPMainButtonsSelectedState"
				);
			}else{
				FWDEVPVolumeButton.setPrototype();
				_s.volumeButton_do = new FWDEVPVolumeButton(_s.volumeN_img, _d.volumeSPath_str, _d.volumeDPath_str,
						_s.useHEX,
						_s.nBC,
						_s.sBC);
			}

			_s.volumeButton_do.screen.className = "fwdevp-volume-button";
			_s.volumeButton_do.addListener(FWDEVPVolumeButton.MOUSE_UP, _s.volumeOnMouseUpHandler);
			_s.volumeButton_do.setX(-10000);
			_s.volumeButton_do.setY(parseInt((_s.sH - _s.volumeButton_do.h)/2));
			_s.buttons_ar.push(_s.volumeButton_do);
			_s.mainHolder_do.addChild(_s.volumeButton_do); 
			if(!_s.allowToChangeVolume_bl) _s.volumeButton_do.disable();
			if(_s.volume == 0) _s.volumeButton_do.setDisabledState();
		};
		
		_s.volumeOnMouseUpHandler = function(){
			var vol = _s.lastVolume;
			
			if(_s.muted){
				vol = _s.lastVolume;
				_s.muted = false;
			}else{
				vol = 0;
				_s.muted = true;
			};
			_s.updateVolume(vol);
		};
		

		//################################################//
		/* Setup volume scrubber */
		//################################################//
		_s.setupVolumeScrubber = function(){
			//setup background bar
			_s.volumeScrubber_do = new FWDEVPDO("div");
			_s.volumeScrubber_do.screen.className = "fwdevp-volume-scrubber";
			_s.volumeScrubber_do.setHeight(_s.scrubbersHeight);
			
			_s.volumeScrubberBkLeft_do = new FWDEVPDO("img");
			_s.volumeScrubberBkLeft_do.setScreen(_s.volumeScrubberBkLeft_img);
			
			_s.volumeScrubberBkRight_do = new FWDEVPDO("img");
			_s.volumeScrubberBkRight_do.setScreen(_s.volumeScrubberBkRight_img);
			
			var middleImage = new Image();
			middleImage.src = _s.volumeScrubberBkMiddlePath_str;
			
			_s.volumeScrubberBkMiddle_do = new FWDEVPDO("div");	
			_s.volumeScrubberBkMiddle_do.style().background = "url('" + _s.volumeScrubberBkMiddlePath_str + "') repeat-x";
				
			_s.volumeScrubberBkMiddle_do.setHeight(_s.scrubbersHeight);
			_s.volumeScrubberBkMiddle_do.setX(_s.scrubbersBkLeftAndRightWidth);
			
			//setup darg bar.
			_s.volumeScrubberDrag_do = new FWDEVPDO("div");
			_s.volumeScrubberDrag_do.setHeight(_s.scrubbersHeight);
		
			if(_s.useHEX){
				_s.volumeScrubberDragLeft_do = new FWDEVPDO("div");
				_s.volumeScrubberDragLeft_do.setWidth(_s.volumeScrubberDragLeft_img.width);
				_s.volumeScrubberDragLeft_do.setHeight(_s.volumeScrubberDragLeft_img.height);
				_s.volumeScrubberDragLeft_canvas = FWDEVPUtils.getCanvasWithModifiedColor(_s.volumeScrubberDragLeft_img, _s.nBC).canvas;
				_s.volumeScrubberDragLeft_do.screen.appendChild(_s.volumeScrubberDragLeft_canvas);	
			}else{
				_s.volumeScrubberDragLeft_do = new FWDEVPDO("img");
				_s.volumeScrubberDragLeft_do.setScreen(_s.volumeScrubberDragLeft_img);
			}
			
			if(!_s.useHEX){
				_s.volumeScrubberDragMiddle_do = new FWDEVPDO("div");	
				_s.volumeScrubberDragMiddle_do.style().background = "url('" + _s.volumeScrubberDragMiddlePath_str + "') repeat-x";
			}
			
			_s.volumeScrubberDragMiddle_do.setHeight(_s.scrubbersHeight);
			_s.volumeScrubberDragMiddle_do.setX(_s.mainScrubberDragLeftWidth);
		
			_s.volumeScrubberBarLine_do = new FWDEVPDO("img");
			_s.volumeScrubberBarLine_do.setScreen(_s.volumeScrubberLine_img);
			
			_s.volumeScrubberBarLine_do.setAlpha(0);
			_s.volumeScrubberBarLine_do.hasT3D = false;
			_s.volumeScrubberBarLine_do.hasT2D = false;
			
			_s.volumeScrubber_do.setWidth(_s.volumeScrubberWidth);
			_s.volumeScrubberBkMiddle_do.setWidth(_s.volumeScrubberWidth - _s.scrubbersBkLeftAndRightWidth * 2);
			_s.volumeScrubberBkRight_do.setX(_s.volumeScrubberWidth - _s.scrubbersBkLeftAndRightWidth);
			_s.volumeScrubberDragMiddle_do.setWidth(_s.volumeScrubberWidth - _s.scrubbersBkLeftAndRightWidth - _s.scrubbersOffsetWidth);
			
			//add all children
			_s.volumeScrubber_do.addChild(_s.volumeScrubberBkLeft_do);
			_s.volumeScrubber_do.addChild(_s.volumeScrubberBkMiddle_do);
			_s.volumeScrubber_do.addChild(_s.volumeScrubberBkRight_do);
			_s.volumeScrubber_do.addChild(_s.volumeScrubberBarLine_do);
			_s.volumeScrubberDrag_do.addChild(_s.volumeScrubberDragLeft_do);
			_s.volumeScrubberDrag_do.addChild(_s.volumeScrubberDragMiddle_do);
			_s.volumeScrubber_do.addChild(_s.volumeScrubberDrag_do);
			_s.volumeScrubber_do.addChild(_s.volumeScrubberBarLine_do);
			
			_s.buttons_ar.push(_s.volumeScrubber_do);
			
			_s.mainHolder_do.addChild(_s.volumeScrubber_do);
		
			if(!_s.disableVideoScrubber_bl){
				if(_s.hasPointerEvent_bl){
					_s.volumeScrubber_do.screen.addEventListener("pointerover", _s.volumeScrubberOnOverHandler);
					_s.volumeScrubber_do.screen.addEventListener("pointerout", _s.volumeScrubberOnOutHandler);
					_s.volumeScrubber_do.screen.addEventListener("pointerdown", _s.volumeScrubberOnDownHandler);
				}else if(_s.screen.addEventListener){	
					if(!_s.isMobile_bl){
						_s.volumeScrubber_do.screen.addEventListener("mouseover", _s.volumeScrubberOnOverHandler);
						_s.volumeScrubber_do.screen.addEventListener("mouseout", _s.volumeScrubberOnOutHandler);
						_s.volumeScrubber_do.screen.addEventListener("mousedown", _s.volumeScrubberOnDownHandler);
						_s.volumeScrubber_do.screen.addEventListener("click", _s.volumeScrubberOnDownHandler);
					}
					_s.volumeScrubber_do.screen.addEventListener("touchstart", _s.volumeScrubberOnDownHandler);
				}
			}

			if(_d.showMainScrubberToolTipLabel_bl){
				FWDEVPScrubberToolip.setPrototype();
				_s.ttm2 = new FWDEVPScrubberToolip(_s.volumeScrubber_do, _d.scrubbersToolTipLabelBackgroundColor, _d.scrubbersToolTipLabelFontColor, '10');
				_s.addChild(_s.ttm2);
			}
			
			_s.enableVolumeScrubber();
			_s.updateVolumeScrubber(_s.volume);
		};

		_s.updateVolumeToolTip = function(){
			if(!_d.showMainScrubberToolTipLabel_bl) return;
			_s.ttm2.setLabel(Math.round(_s.volume * 100));
			var x =  _s.volumeScrubber_do.x
			x = Math.round(x + (_s.volume * _s.volumeScrubberWidth) - _s.ttm2.getWidth()/2);
			_s.ttm2.setX(x);
			_s.ttm2.setY(_s.volumeScrubber_do.y - _s.ttm2.h - 2);
		}
		
		_s.volumeScrubberOnOverHandler =  function(e){
			if(_s.isVolumeScrubberDisabled_bl) return;
			if(_d.showMainScrubberToolTipLabel_bl) _s.ttm2.show();
			_s.updateVolumeToolTip();
		};
		
		_s.volumeScrubberOnOutHandler =  function(e){
			if(_s.isVolumeScrubberDisabled_bl) return;
			if(!_s.isVolumeScrubberScrubbing_bl){
				if(_s.ttm2) _s.ttm2.hide();
			}
		};
		
		_s.volumeScrubberOnDownHandler =  function(e){
			if(_s.isVolumeScrubberDisabled_bl || e.button == 2) return;
			if(e.preventDefault) e.preventDefault();
			var viewportMouseCoordinates = FWDEVPUtils.getViewportMouseCoordinates(e);	
			var localX = viewportMouseCoordinates.screenX - _s.volumeScrubber_do.getGlobalX();
			
			if(localX < 0){
				localX = 0;
			}else if(localX > _s.volumeScrubberWidth - _s.scrubbersOffsetWidth){
				localX = _s.volumeScrubberWidth - _s.scrubbersOffsetWidth;
			}
			var percentScrubbed = localX/(_s.volumeScrubberWidth - _s.scrubbersOffsetWidth);
			
			_s.isVolumeScrubberScrubbing_bl = true;
			_s.updateVolume(percentScrubbed);
			if(_d.showMainScrubberToolTipLabel_bl) _s.ttm2.show();
			if(_s.disable_do) _s.addChild(_s.disable_do);
			_s.lastVolume = percentScrubbed;
			_s.updateVolume(percentScrubbed);
			_s.updateVolumeToolTip();
			
			if(_s.hasPointerEvent_bl){
				window.addEventListener("pointermove", _s.volumeScrubberMoveHandler);
				window.addEventListener("pointerup", _s.volumeScrubberEndHandler);
			}else{
				window.addEventListener("mousemove", _s.volumeScrubberMoveHandler);
				window.addEventListener("mouseup", _s.volumeScrubberEndHandler);		
				window.addEventListener("touchmove", _s.volumeScrubberMoveHandler, {passie:false});
				window.addEventListener("touchend", _s.volumeScrubberEndHandler);
			}	
			_s.dispatchEvent(FWDEVPlayer.START_TO_SCRUB);
		};
		
		_s.volumeScrubberMoveHandler = function(e){
			if(_s.isVolumeScrubberDisabled_bl) return;
			if(e.preventDefault) e.preventDefault();
			var viewportMouseCoordinates = FWDEVPUtils.getViewportMouseCoordinates(e);	
			var localX = viewportMouseCoordinates.screenX - _s.volumeScrubber_do.getGlobalX();
			
			if(localX < 0){
				localX = 0;
			}else if(localX > _s.volumeScrubberWidth - _s.scrubbersOffsetWidth){
				localX = _s.volumeScrubberWidth - _s.scrubbersOffsetWidth;
			}
			var percentScrubbed = localX/(_s.volumeScrubberWidth - _s.scrubbersOffsetWidth);
			
			_s.lastVolume = percentScrubbed;
			_s.updateVolume(percentScrubbed);
			_s.updateVolumeToolTip();
		};
		
		_s.volumeScrubberEndHandler = function(e){
			_s.isVolumeScrubberScrubbing_bl = false;
			if(_s.disable_do){
				if(_s.contains(_s.disable_do)) _s.removeChild(_s.disable_do);
			}
			if(e){
				var wp = FWDEVPUtils.getViewportMouseCoordinates(e);
				if(!FWDEVPUtils.hitTest(_s.volumeScrubber_do.screen, wp.screenX, wp.screenY)){
					if(_s.ttm2) _s.ttm2.hide();
				}else{
					window.addEventListener("mousemove", _s.checkTmOnMove);
				}
			}
			if(_s.hasPointerEvent_bl){
				window.removeEventListener("pointermove", _s.volumeScrubberMoveHandler);
				window.removeEventListener("pointerup",  _s.volumeScrubberEndHandler);
			}else{
				window.removeEventListener("mousemove", _s.volumeScrubberMoveHandler);
				window.removeEventListener("mouseup",  _s.volumeScrubberEndHandler);		
				window.removeEventListener("touchmove", _s.volumeScrubberMoveHandler, {passie:false});
				window.removeEventListener("touchend", _s.volumeScrubberEndHandler);
			}
			_s.dispatchEvent(FWDEVPlayer.STOP_TO_SCRUB);
		};

		 _s.checkTmOnMove = function(e){
			var wp = FWDEVPUtils.getViewportMouseCoordinates(e);
			if(!FWDEVPUtils.hitTest(_s.volumeScrubber_do.screen, wp.screenX, wp.screenY)){
				if(_s.ttm) _s.ttm2.hide();
				window.removeEventListener("mousemove", _s.checkTmOnMove);
			}
		 }
		
		_s.disableVolumeScrubber = function(){
			_s.isVolumeScrubberDisabled_bl = true;
			_s.volumeScrubber_do.setButtonMode(false);
			_s.volumeScrubberEndHandler();
		};
		
		_s.enableVolumeScrubber = function(){
			_s.isVolumeScrubberDisabled_bl = false;
			_s.volumeScrubber_do.setButtonMode(true);
		};
		
		_s.updateVolumeScrubber = function(percent){
			if(!_s.showVolumeScrubber_bl) return;
			var finalWidth = parseInt(percent * _s.volumeScrubberWidth); 
			_s.volumeScrubberDrag_do.setWidth(finalWidth);
			
			if(finalWidth < 1 && _s.isVolumeScrubberLineVisible_bl){
				_s.isVolumeScrubberLineVisible_bl = false;
				FWDAnimation.to(_s.volumeScrubberBarLine_do, .5, {alpha:0});
			}else if(finalWidth > 1 && !_s.isVolumeScrubberLineVisible_bl){
				_s.isVolumeScrubberLineVisible_bl = true;
				FWDAnimation.to(_s.volumeScrubberBarLine_do, .5, {alpha:1});
			}
			
			if(finalWidth > _s.volumeScrubberWidth - _s.scrubbersOffsetWidth) finalWidth = _s.volumeScrubberWidth - _s.scrubbersOffsetWidth;
			FWDAnimation.to(_s.volumeScrubberBarLine_do, .8, {x:finalWidth + 1, ease:Expo.easeOut});
		};
		
		_s.updateVolume = function(volume, preventEvent){
			if(!_s.showVolumeScrubber_bl) return;
			_s.volume = volume;
			if(_s.volume <= 0.000001){
				_s.muted = true;
				_s.volume = 0;
			}else if(_s.voume >= 1){
				_s.muted = false;
				_s.volume = 1;
			}else{
				_s.muted = false;
			}
			
			if(_s.volume == 0){
				if(_s.volumeButton_do) _s.volumeButton_do.setDisabledState();
			}else{
				if(_s.volumeButton_do) _s.volumeButton_do.setEnabledState();
			}
			
			if(_s.volumeScrubberBarLine_do) _s.updateVolumeScrubber(_s.volume);
			if(!preventEvent) _s.dispatchEvent(FWDEVPController.CHANGE_VOLUME, {percent:_s.volume});
		};
		
		_s.mute = function(){
			_s.updateVolume();
		}
	
		
		//###################################//
		/* show / hide */
		//###################################//
		_s.show = function(animate){
			if(_s.isShowed_bl) return;
			_s.isShowed_bl = true;
			if(animate){
				FWDAnimation.to(_s.mainHolder_do, .8, {y:0, ease:Expo.easeInOut});
			}else{
				FWDAnimation.killTweensOf(_s.mainHolder_do);
				_s.mainHolder_do.setY(0);
			}
			setTimeout(function(){
				_s.positionButtons();
				_s.style().pointerEvents = 'auto';
			}, 200);
		};
		
		_s.hide = function(animate, hideForGood){
			if(!_s.isShowed_bl && !hideForGood) return;
			_s.isShowed_bl = false;
			var offsetY = 0;
			if(hideForGood) offsetY = _s.mainScrubberOffestTop;

			if(_s.atb && _s.atb.isShowed_bl) offsetY += _s.h + 1;
			if(animate){
				FWDAnimation.to(_s.mainHolder_do, .8, {y:_s.sH + offsetY, ease:Expo.easeInOut});
			}else{
				FWDAnimation.killTweensOf(_s.mainHolder_do);
				_s.mainHolder_do.setY(_s.sH + offsetY);
			}
			_s.style().pointerEvents = 'none';
			_s.hideQualityButtons(true);
			_s.hidePlaybackRateButtons(true);
			_s.hideSubtitleButtons(true);
		};
		
		
		_s.mainScrubberDragMiddleAddPath_str = _d.mainScrubberDragMiddleAddPath_str;
		_s.updateHexColorForScrubber = function(isAdd){
			if(isAdd){
				_s.isAdd = true;
				_s.mainScrubberDragMiddle_do.style().background = "url('" + _s.mainScrubberDragMiddleAddPath_str + "') repeat-x";
				_s.mainScrubberDragLeft_do.screen.src = _d.mainScrubberDragLeftAddPath_str;
			}else{
				_s.isAdd = false;
				if(_s.useHEX && _s.mainSCrubberMiddleCanvas){
					var newCenterImage = FWDEVPUtils.changeCanvasHEXColor(_s.mainScrubberMiddleImage, _s.mainSCrubberMiddleCanvas, _s.nBC, true);
					_s.mainScrubberDragMiddle_do.style().background = "url('" + newCenterImage.src + "') repeat-x";
				}else{
					_s.mainScrubberDragMiddle_do.style().background = "url('" + _s.mainScrubberDragMiddlePath_str + "') repeat-x";
					_s.mainScrubberDragLeft_do.screen.src = _s.mainScrubberDragLeftSource;
				}
			}
		}

		_s.updateHEXColors = function(nBC, sBC){
		 	_s.nBC = nBC;
            _s.sBC = sBC;
		}
		
	
		_s.init();
	};
	
	
	/* set prototype */
	FWDEVPController.setPrototype = function(){
		FWDEVPController.prototype = new FWDEVPDO("div");
	};
	
	FWDEVPController.VR = 'vr';
	FWDEVPController.CAST = 'cast';
	FWDEVPController.UNCAST = 'uncast';
	FWDEVPController.REWIND = "rewind";
	FWDEVPController.DOWNLOAD_VIDEO = "downloadVideo";
	FWDEVPController.SHOW_SUBTITLE = "showSubtitle";
	FWDEVPController.HIDE_SUBTITLE = "hideSubtitle";
	FWDEVPController.SHARE = "share";
	FWDEVPController.FULL_SCREEN = "fullScreen";
	FWDEVPController.NORMAL_SCREEN = "normalScreen";
	FWDEVPController.PLAY = "play";
	FWDEVPController.PAUSE = "pause";
	FWDEVPController.START_TO_SCRUB = "startToScrub";
	FWDEVPController.SCRUB = "scrub";
	FWDEVPController.STOP_TO_SCRUB = "stopToScrub";
	FWDEVPController.CHANGE_VOLUME = "changeVolume";
	FWDEVPController.CHANGE_YOUTUBE_QUALITY = "changeYoutubeQuality";
	FWDEVPController.SHOW_EMBED_WINDOW = "showEmbedWindow";
	FWDEVPController.CHANGE_SUBTITLE = "changeSubtitle";
	FWDEVPController.CHANGE_PLAYBACK_RATES = "changePlaybackRates";
	FWDEVPController.CHANGE_AUDIO_TRACKS = 'changeAudioTracks';
	
	FWDEVPController.prototype = null;
	window.FWDEVPController = FWDEVPController;
	
}(window));/**
 * Easy Video Player PACKAGED v9.1
 * Data.
 *
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © 2006 All Rights Reserved.
 */
(function(window){
	
	var FWDEVPData = function(props, playListElement, root){

		'use strict';
		
		var _s = this;
		var prototype = FWDEVPData.prototype;
		
		_s.props = props;
		_s.skinPaths_ar = [];
		_s.images_ar = [];
		_s.controllerHeight = 0;
		_s.countLoadedSkinImages = 0;
		_s.volume = 1;
		_s.controllerHideDelay = 0;
		_s.startSpaceBetweenButtons = 0;
		_s.spaceBetweenButtons = 0;
		_s.scrubbersOffsetWidth = 0;
		_s.volumeScrubberOffsetRightWidth = 0;
		_s.timeOffsetLeftWidth = 0;
		_s.timeOffsetTop = 0;
		_s.logoMargins = 0;
		_s.embedWindowCloseButtonMargins = 0;
		_s.loadImageId_to;
		_s.dispatchLoadSkinCompleteWithDelayId_to;
		_s.allowToChangeVolume_bl = true;
		_s.isMobile_bl = FWDEVPUtils.isMobile;
		_s.hasPointerEvent_bl = FWDEVPUtils.hasPointerEvent;
	

		//###################################//
		/*init*/
		//###################################//
		_s.init = function(){
			_s.parseProperties();
		};
		

		//#############################################//
		// parse properties.
		//#############################################//
		_s.parseProperties = function(){
			
			_s.useHEX = _s.props.useHEXColorsForSkin; 
			_s.useHEX = _s.useHEX == "yes" ? true : false;
			if(location.protocol.indexOf("file:") != -1) _s.useHEX = false;
			
			_s.mainFolderPath_str = _s.props.mainFolderPath;
			if(!_s.mainFolderPath_str){
				setTimeout(function(){
					if(_s == null) return;
					errorMessage_str = "The <font color='#FF0000'>mainFolderPath</font> property is not defined in the constructor function!";
					_s.dispatchEvent(FWDEVPData.LOAD_ERROR, {text:errorMessage_str});
				}, 50);
				return;
			}
			
			if((_s.mainFolderPath_str.lastIndexOf("/") + 1) != _s.mainFolderPath_str.length){
				_s.mainFolderPath_str += "/";
			}
			
			_s.sknPth = _s.props.skinPath;
			if(!_s.sknPth){
				setTimeout(function(){
					if(_s == null) return;
					errorMessage_str = "The <font color='#FF0000'>skinPath</font> property is not defined in the constructor function!";
					_s.dispatchEvent(FWDEVPData.LOAD_ERROR, {text:errorMessage_str});
				}, 50);
				return;
			}
			
			if((_s.sknPth.lastIndexOf("/") + 1) != _s.sknPth.length){
				_s.sknPth += "/";
			}
			
			_s.sknPth = _s.mainFolderPath_str + _s.sknPth;
			_s.flashPath_str = _s.mainFolderPath_str + "flashlsChromeless.swf";
			_s.flashCopyToCBPath_str = _s.mainFolderPath_str + "cb.swf";
			_s.sendToAFriendPath_str = _s.mainFolderPath_str + "sendMailToAFriend.php"; 
			_s.videoDownloaderPath_str = _s.mainFolderPath_str  + "downloader.php";
			_s.mailPath_str = _s.mainFolderPath_str  + "sendMail.php";
			_s.hlsPath_str = _s.mainFolderPath_str  + "java/hls.js";
			_s.dashPath_str = _s.mainFolderPath_str  + "java/dash.all.min.js";
			_s.threeJsPath_str = _s.mainFolderPath_str  + "java/three.js";
			_s.threeJsControlsPath_str = _s.mainFolderPath_str  + "java/threeControled.js";

			_s.isDark = true;
			if(_s.sknPth.indexOf('dark') == -1){
				_s.isDark = false;
			}

			_s.timeColor_str = _s.props.timeColor || "#FF0000";
			
			_s.privateVideoPassword_str = _s.props.privateVideoPassword;
			
			_s.adsVideoSourcePath_str = _s.props.adsVideoSourcePath;
			_s.adsPageToOpenURL_str = _s.props.adsPageToOpenURL;
			_s.adsPageToOpenTarget_str = _s.props.adsPageToOpenTarget || "_blank";
			_s.adsThumbnailPath_str = _s.props.adsThumbnailPath;
		
			_s.youtubeQualityButtonNormalColor_str = _s.props.youtubeQualityButtonNormalColor || "#FF0000";
			_s.youtubeQualityButtonSelectedColor_str = _s.props.youtubeQualityButtonSelectedColor || "#FF0000";
			_s.posterBackgroundColor_str = _s.props.posterBackgroundColor || "transparent";
			
			_s.logoPosition_str = _s.props.logoPosition || "topleft";
			_s.logoPosition_str = String(_s.logoPosition_str).toLowerCase();
			var test = _s.logoPosition_str == "topleft" 
					   || _s.logoPosition_str == "topright"
					   || _s.logoPosition_str == "bottomleft"
					   || _s.logoPosition_str == "bottomright";
						   
			if(!test) _s.logoPosition_str = "topleft";
			
			_s.adsButtonsPosition_str = _s.props.adsButtonsPosition || "left";
			_s.adsButtonsPosition_str = String(_s.adsButtonsPosition_str).toLowerCase();
			test = _s.adsButtonsPosition_str == "left" 
					   || _s.adsButtonsPosition_str == "right";
					 	   
			if(!test) _s.adsButtonsPosition_str = "left";
			
			
			_s.rightClickContextMenu_str = _s.props.rightClickContextMenu || "developer";
			test = _s.rightClickContextMenu_str == "developer" 
				   || _s.rightClickContextMenu_str == "disabled"
				   || _s.rightClickContextMenu_str == "default";
			if(!test) _s.rightClickContextMenu_str = "developer";
			
			_s.logoLink_str = _s.props.logoLink || "none";
			_s.skipToVideoButtonText_str = _s.props.skipToVideoButtonText || "not defined";
			
			_s.skipToVideoText_str = _s.props.skipToVideoText;
			
			_s.shareAndEmbedTextColor_str = _s.props.shareAndEmbedTextColor || "#FF0000";
			_s.inputBackgroundColor_str = _s.props.inputBackgroundColor || "#FF0000";
			_s.borderColor_str = _s.props.borderColor || "#FF0000";
			_s.inputColor_str = _s.props.inputColor || "#FF0000";
			_s.secondaryLabelsColor_str = _s.props.secondaryLabelsColor || "#FF0000"; 
			_s.mainLabelsColor_str = _s.props.mainLabelsColor || "#FF0000"; 
			_s.adsTextNormalColor = _s.props.adsTextNormalColor || "#FF0000";
			_s.adsTextSelectedColor = _s.props.adsTextSelectedColor || "#FF0000";
			_s.adsBorderNormalColor_str = _s.props.adsBorderNormalColor || "#FF0000";
			_s.adsBorderSelectedColor_str = _s.props.adsBorderSelectedColor || "#FF0000";
			
			_s.nBC = _s.props.normalHEXButtonsColor || "#FFFFFF";
			//_s.sBC = _s.props.selectedHEXButtonsColor || "#999999";

			if(_s.sknPth.indexOf('dark') != -1){
				_s.sBC = '#FFFFFF';
			}else{
				_s.sBC = '#000000';
			}
		
			_s.volume = _s.props.volume;
			if(_s.volume == undefined) _s.volume = 1;
			if(isNaN(_s.volume)) volume = 1;
			
			if(_s.volume > 1){
				_s.volume = 1;
			}else if(_s.volume <=0){
				_s.volume = 0;
			}
			
			_s.audioVisualizerLinesColor_str = _s.props.audioVisualizerLinesColor || "#0099FF";
			_s.audioVisualizerCircleColor_str = _s.props.audioVisualizerCircleColor || "#00FF00";
			
			_s.controllerHeight = _s.props.controllerHeight || 50;
			_s.startSpaceBetweenButtons = _s.props.startSpaceBetweenButtons || 0;
			_s.controllerHideDelay = _s.props.controllerHideDelay || 2;
			_s.controllerHideDelay *= 1000;
			_s.spaceBetweenButtons = _s.props.spaceBetweenButtons || 0;
			_s.scrubbersOffsetWidth = _s.props.scrubbersOffsetWidth || 0;
			_s.volumeScrubberOffsetRightWidth = _s.props.volumeScrubberOffsetRightWidth || 0;
			_s.timeOffsetLeftWidth = _s.props.timeOffsetLeftWidth || 0;
			_s.timeOffsetRightWidth = _s.props.timeOffsetRightWidth || 0;
			_s.timeOffsetTop = _s.props.timeOffsetTop || 0;
			_s.embedWindowCloseButtonMargins = _s.props.embedWindowCloseButtonMargins || 0;
			_s.logoMargins = _s.props.logoMargins || 0;
			_s.mainScrubberOffestTop = _s.props.mainScrubberOffestTop || 0;
			_s.volumeScrubberWidth = _s.props.volumeScrubberWidth || 10;
			if(_s.volumeScrubberWidth > 200) _s.volumeScrubberWidth = 200;
			_s.timeToHoldAds = 4;

			_s.greenScreenTolerance = _s.props.greenScreenTolerance || 200;
			
			
			if(_s.isMobile_bl) _s.allowToChangeVolume_bl = false;
			
			_s.showContextMenu_bl = _s.props.showContextMenu; 
			_s.showContextMenu_bl = _s.showContextMenu_bl == "no" ? false : true;
			
			_s.showDefaultControllerForVimeo_bl = _s.props.showDefaultControllerForVimeo; 
			_s.showDefaultControllerForVimeo_bl = _s.showDefaultControllerForVimeo_bl == "yes" ? true : false;

			_s.showScrubberWhenControllerIsHidden_bl = _s.props.showScrubberWhenControllerIsHidden; 
			_s.showScrubberWhenControllerIsHidden_bl = _s.showScrubberWhenControllerIsHidden_bl == "no" ? false : true;

			_s.addKeyboardSupport_bl = _s.props.addKeyboardSupport; 
			_s.addKeyboardSupport_bl = _s.addKeyboardSupport_bl == "no" ? false : true;
			
			_s.autoPlay_bl = _s.props.autoPlay; 
			_s.autoPlay_bl = _s.autoPlay_bl == "yes" ? true : false;
			_s.autoPlayText = _s.props.autoPlayText;
		
			_s.scrubAtTimeAtFirstPlay = _s.props.scrubAtTimeAtFirstPlay || "00:00:00";
			_s.scrubAtTimeAtFirstPlay = FWDEVPUtils.getSecondsFromString(_s.scrubAtTimeAtFirstPlay);
			
			_s.loop_bl = _s.props.loop;
			_s.loop_bl = _s.loop_bl == "yes" ? true : false;
			
			_s.showSkipButton_bl = true;
			
			_s.showLogo_bl = _s.props.showLogo; 
			_s.showLogo_bl = _s.showLogo_bl == "yes" ? true : false;
			
			
			_s.showRewindButton_bl = _s.props.showRewindButton; 
			_s.showRewindButton_bl = _s.showRewindButton_bl == "yes" ? true : false;

			_s.clsLghtbPlayFinish = _s.props.closeLightBoxWhenPlayComplete; 
			_s.clsLghtbPlayFinish = _s.clsLghtbPlayFinish == "yes" ? true : false;
			
			_s.openDownloadLinkOnMobile_bl = _s.props.openDownloadLinkOnMobile; 
			_s.openDownloadLinkOnMobile_bl = _s.openDownloadLinkOnMobile_bl == "yes" ? true : false;
			
			_s.thumbnailsPreview = _s.props.thumbnailsPreview || false;
			
			_s.thumbnailsPreviewWidth = _s.props.thumbnailsPreviewWidth || 300
			_s.thumbnailsPreviewHeight = _s.props.thumbnailsPreviewHeight || 168
			_s.thumbnailsPreviewBackgroundColor =  _s.props.thumbnailsPreviewBackgroundColor || "#000";
			_s.thumbnailsPreviewBorderColor =	_s.props.thumbnailsPreviewBorderColor || "#333";
			_s.thumbnailsPreviewLabelBackgroundColor =	_s.props.thumbnailsPreviewLabelBackgroundColor || "#FFF";
			_s.thumbnailsPreviewLabelFontColor =	_s.props.thumbnailsPreviewLabelFontColor || "#000";

			_s.contextMenuBackgroundColor_str = _s.props.contextMenuBackgroundColor || "#000000";
			_s.contextMenuBorderColor_str = _s.props.contextMenuBorderColor || "#FF0000";
			_s.contextMenuSpacerColor_str = _s.props.contextMenuSpacerColor || "#FF0000";
			_s.contextMenuItemNormalColor_str = _s.props.contextMenuItemNormalColor || "#FF0000";
			_s.contextMenuItemSelectedColor_str = _s.props.contextMenuItemSelectedColor || "#FF0000";
			_s.contextMenuItemDisabledColor_str = _s.props.contextMenuItemDisabledColor || "#FF0000";
		
			//loggin
			_s.playVideoOnlyWhenLoggedIn_bl = _s.props.playVideoOnlyWhenLoggedIn; 
			_s.playVideoOnlyWhenLoggedIn_bl = _s.playVideoOnlyWhenLoggedIn_bl == "yes" ? true : false;
			
			_s.isLoggedIn_bl = _s.props.isLoggedIn; 
			_s.isLoggedIn_bl = _s.isLoggedIn_bl == "yes" ? true : false;
			
			_s.useVectorIcons_bl = _s.props.useVectorIcons; 
			_s.useVectorIcons_bl = _s.useVectorIcons_bl == "yes" ? true : false;
					
			_s.loggedInMessage_str = _s.props.loggedInMessage || "Only loggedin users can view this video";
					
			_s.hideLogoWithController_bl = _s.props.hideLogoWithController; 
			_s.hideLogoWithController_bl = _s.hideLogoWithController_bl == "yes" ? true : false;
			
			_s.showDefaultControllerForVimeo_bl = _s.props.showDefaultControllerForVimeo; 
			_s.showDefaultControllerForVimeo_bl = _s.showDefaultControllerForVimeo_bl == "yes" ? true : false;
			
			_s.aopwSource = _s.props.aopwSource; 
			_s.aopwBorderSize = _s.props.aopwBorderSize || 0; 
			_s.aopwTitle = _s.props.aopwTitle || "Advertisement";
			_s.aopwTitleColor_str = _s.props.aopwTitleColor || "#FFFFFF"; 
			
			_s.openerAlignment_str = _s.props.openerAlignment;
			_s.openerEqulizerOffsetTop = _s.props.openerEqulizerOffsetTop || 0;
			_s.openerEqulizerOffsetLeft = _s.props.openerEqulizerOffsetLeft || 0;
			
			_s.showOpener_bl = _s.props.showOpener; 
			_s.showOpener_bl = _s.showOpener_bl == "yes" ? true : false;
			
			_s.showOpenerPlayPauseButton_bl = _s.props.showOpenerPlayPauseButton;
			_s.showOpenerPlayPauseButton_bl = _s.showOpenerPlayPauseButton_bl == "yes" ? true : false;
			
			_s.animate_bl = _s.props.animatePlayer; 
			_s.animate_bl = _s.animate_bl == "yes" ? true : false;

			_s.contextMenuType = _s.props.contextMenuType || 'default';
			
			_s.useAToB = _s.props.useAToB == "yes" ? true : false;
			_s.playsinline = _s.props.playsinline == "yes" ? true : false;
		
			_s.atbTimeBackgroundColor = _s.props.atbTimeBackgroundColor || "transparent";
			_s.atbTimeTextColorNormal = _s.props.atbTimeTextColorNormal ||  "#888888";
			_s.atbTimeTextColorSelected = _s.props.atbTimeTextColorSelected || "#FFFFFF";
			_s.atbButtonTextNormalColor = _s.props.atbButtonTextNormalColor || "#888888";
			_s.atbButtonTextSelectedColor = _s.props.atbButtonTextSelectedColor || "#FFFFFF";
			_s.atbButtonBackgroundNormalColor = _s.props.atbButtonBackgroundNormalColor || "#FFFFFF";
			_s.atbButtonBackgroundSelectedColor = _s.props.atbButtonBackgroundSelectedColor || "#000000";

			_s.scrubbersToolTipLabelBackgroundColor = _s.props.scrubbersToolTipLabelBackgroundColor || "#FFFFFF";
			_s.scrubbersToolTipLabelFontColor  = _s.props.scrubbersToolTipLabelFontColor || "#000000";
			
			_s.showMainScrubberToolTipLabel_bl = _s.props.showMainScrubberToolTipLabel;
			_s.showMainScrubberToolTipLabel_bl = _s.showMainScrubberToolTipLabel_bl == "yes" ? true : false;
			
			_s.aopwWidth = _s.props.aopwWidth || 200; 
			_s.aopwHeight = _s.props.aopwHeight || 200; 
			if(_s.aopwSource && String(_s.aopwSource.length) > 5){
				_s.showAopwWindow_bl = true;
			}else{
				_s.showAopwWindow_bl = false;
			}
			
			_s.fillEntireScreenWithPoster_bl = _s.props.fillEntireScreenWithPoster; 
			_s.fillEntireScreenWithPoster_bl = _s.fillEntireScreenWithPoster_bl == "yes" ? true : false;

			_s.fillEntireposterScreen = _s.props.fillEntireposterScreen; 
			_s.fillEntireposterScreen = _s.fillEntireposterScreen == "yes" ? true : false;
			
			_s.startAtTime = _s.props.startAtTime;
			if(_s.startAtTime == "00:00:00" || !FWDEVPUtils.checkTime(_s.startAtTime)) _s.startAtTime = undefined;
			
			_s.stopAtTime = _s.props.stopAtTime;
			if(_s.stopAtTime == "00:00:00" || !FWDEVPUtils.checkTime(_s.stopAtTime)) _s.stopAtTime = undefined;
		
			_s.showPoster_bl = _s.props.showPoster; 
			_s.showPoster_bl = _s.showPoster_bl == "yes" ? true : false;

			_s.pushBtns = _s.props.pushBtns || 0;
			
			_s.showVolumeScrubber_bl = _s.props.showVolumeScrubber; 
			_s.showVolumeScrubber_bl = _s.showVolumeScrubber_bl == "no" ? false : true;
			
			_s.showVolumeButton_bl = _s.props.showVolumeButton; 
			_s.showVolumeButton_bl = _s.showVolumeButton_bl == "no" ? false : true;
			
			_s.showControllerWhenVideoIsStopped_bl = _s.props.showControllerWhenVideoIsStopped; 
			_s.showControllerWhenVideoIsStopped_bl = _s.showControllerWhenVideoIsStopped_bl == "yes" ? true : false;
			
			_s.showTime_bl = _s.props.showTime; 
			_s.showTime_bl = _s.showTime_bl == "no" ? false : true;
			
			_s.showAnnotationsPositionTool_bl = _s.props.showAnnotationsPositionTool; 
			_s.showAnnotationsPositionTool_bl = _s.showAnnotationsPositionTool_bl == "yes" ? true : false;
			
			_s.showDownloadVideoButton_bl = _s.props.showDownloadButton; 
			_s.showDownloadVideoButton_bl = _s.showDownloadVideoButton_bl == "yes" ? true : false;
			
			_s.showFullScreenButton_bl = _s.props.showFullScreenButton; 
			_s.showFullScreenButton_bl = _s.showFullScreenButton_bl == "no" ? false : true;

			_s.showChromecastButton_bl = _s.props.showChromecastButton; 
			_s.showChromecastButton_bl = _s.showChromecastButton_bl == "yes" ? true : false;
			if(!FWDEVPUtils.isChrome || FWDEVPUtils.isLocal || location.href.indexOf("https:") == -1) _s.showChromecastButton_bl = false;
			if(FWDEVPlayer.ccButton)  _s.showChromecastButton_bl =  false; 
			if(_s.showChromecastButton_bl) FWDEVPlayer.ccButton = true;

			_s.show360DegreeVideoVrButton_bl = _s.props.show360DegreeVideoVrButton; 
			_s.show360DegreeVideoVrButton_bl = _s.show360DegreeVideoVrButton_bl == "yes" ? true : false;

			_s.executeCuepointsOnlyOnce_bl = _s.props.executeCuepointsOnlyOnce; 
			_s.executeCuepointsOnlyOnce_bl = _s.executeCuepointsOnlyOnce_bl == "yes" ? true : false;
			
			if(_s.showAnnotationsPositionTool_bl) _s.showFullScreenButton_bl = false;

			_s.goFullScreenOnPlay_bl = _s.props.goFullScreenOnButtonPlay; 
			_s.goFullScreenOnPlay_bl = _s.goFullScreenOnPlay_bl == "yes" ? true : false;
			
			_s.repeatBackground_bl = _s.props.repeatBackground; 
			_s.repeatBackground_bl = _s.repeatBackground_bl == "no" ? false : true;
			
			_s.showShareButton_bl = _s.props.showShareButton; 
			_s.showShareButton_bl = _s.showShareButton_bl == "no" ? false : true;
			
			_s.showEmbedButton_bl = _s.props.showEmbedButton; 
			_s.showEmbedButton_bl = _s.showEmbedButton_bl == "no" ? false : true;
			
			_s.showController_bl = _s.props.showController; 
			_s.showController_bl = _s.showController_bl == "no" ? false : true;
			
			_s.fillEntireVideoScreen_bl = _s.props.fillEntireVideoScreen; 
			_s.fillEntireVideoScreen_bl = _s.fillEntireVideoScreen_bl == "yes" ? true : false;
														    
			_s.showSubtitileByDefault_bl = _s.props.showSubtitleByDefault; 
			_s.showSubtitileByDefault_bl = _s.showSubtitileByDefault_bl == "no" ? false : true;

			_s.showYoutubeRelAndInfo_bl = _s.props.showYoutubeRelAndInfo; 
			_s.showYoutubeRelAndInfo_bl = _s.showYoutubeRelAndInfo_bl == "yes" ? true : false;

			_s.useResumeOnPlay_bl = _s.props.useResumeOnPlay; 
			_s.useResumeOnPlay_bl = _s.useResumeOnPlay_bl == "yes" ? true : false;
			
			_s.showPopupAdsCloseButton_bl = _s.props.showPopupAdsCloseButton; 
			_s.showPopupAdsCloseButton_bl = _s.showPopupAdsCloseButton_bl == "no" ? false : true;
			
			_s.showSubtitleButton_bl = _s.props.showSubtitleButton;
			_s.showSubtitleButton_bl = _s.showSubtitleButton_bl == "no" ? false : true;
			
			_s.useChromeless_bl = _s.props.useChromeless;
			_s.useChromeless_bl = _s.useChromeless_bl == "yes" ? true : false;

			_s.stickyOnScrollShowOpener_bl = _s.props.stickyOnScrollShowOpener; 
			_s.stickyOnScrollShowOpener_bl = _s.stickyOnScrollShowOpener_bl == "yes" ? true : false;

			_s.hasAds_bl = _s.adsVideoSourcePath_str;
			_s.hasAds_bl = _s.hasAds_bl == "none" ? false : true;
			if(!_s.adsVideoSourcePath_str) _s.hasAds_bl = false;
		
			_s.openNewPageAtTheEndOfTheAds_bl =  _s.props.openNewPageAtTheEndOfTheAds;
			_s.openNewPageAtTheEndOfTheAds_bl = _s.openNewPageAtTheEndOfTheAds_bl == "yes" ? true : false;
			
			_s.vastXML = _s.props.vastSource;
			if(_s.vastXML && FWDEVPUtils.isIMA(_s.vastXML)){
				_s.imaURL = _s.vastXML;
				_s.vastXML = undefined;
			}
			_s.vastLinearStartTime = _s.props.vastLinearStartTime || "00:00:00";
			_s.vastNonLinearStartTime = _s.props.vastNonLinearStartTime || "00:00:00";
			_s.vastClickTroughTarget = _s.props.vastClickTroughTarget || "_blank";
			
			_s.redirectURL = _s.props.redirectURL;
			if(_s.redirectURL != undefined && _s.redirectURL.length < 4) _s.redirectURL = undefined;
			_s.redirectTarget = _s.props.redirectTarget || "_self";
			if(_s.redirectTarget != "_self" 
				&& _s.redirectTarget != "_blank" 
				&& _s.redirectTarget != "_parent"
			){
				_s.redirectTarget = "_blank";
			}
		
			_s.showYoutubeQualityButton_bl = _s.props.showQualityButton;
			_s.showYoutubeQualityButton_bl = _s.showYoutubeQualityButton_bl == "no" ? false : true;

			_s.showAudioTracksButton_bl = _s.props.showAudioTracksButton; 
			_s.showAudioTracksButton_bl = _s.showAudioTracksButton_bl == "no" ? false : true;
			
			_s.showPlaybackRateButton_bl = _s.props.showPlaybackRateButton;
			_s.showPlaybackRateButton_bl = _s.showPlaybackRateButton_bl == "yes" ? true : false;
			
			_s.defaultPlaybackRate_str = _s.props.defaultPlaybackRate;
			_s.defaultPlaybackRate_ar = ["0.25", "0.5", "1", "1.25", "1.5", "2"];
			_s.startAtPlaybackIndex = 3;
			_s.defaultPlaybackRate_ar.reverse();
			var found_bl = false;
			for(var i=0; i<_s.defaultPlaybackRate_ar.length; i++){
				if(_s.defaultPlaybackRate_ar[i] == _s.defaultPlaybackRate_str){
					found_bl = true;
					_s.startAtPlaybackIndex = i;
				}
			}
			
			if(!found_bl){
				_s.defaultPlaybackRate_str = 1;
			}
			
			//setup skin paths
			_s.logoPath_str = _s.sknPth + "logo.png";
			_s.handPath_str = _s.sknPth + "hand.cur";
			_s.grabPath_str = _s.sknPth + "grab.cur";
			if(_s.props.logoPath) _s.logoPath_str = _s.props.logoPath;
			
			_s.popupAddCloseNPath_str = _s.sknPth + "close-button-normal.png"; 
			_s.popupAddCloseSPath_str = _s.sknPth + "close-button-selected.png";
			
			_s.annotationAddCloseNPath_str = _s.sknPth + "annotation-close-button-normal.png"; 
			_s.annotationAddCloseSPath_str = _s.sknPth + "annotation-close-button-selected.png";
			
			_s.adLinePat_str = _s.sknPth + "ad-line.png";
			_s.playSPath_str = _s.sknPth + "play-over.png"; 
			var pauseNPath_str = _s.sknPth + "pause.png"; 
			_s.pauseSPath_str = _s.sknPth + "pause-over.png";
			_s.bkMiddlePath_str = _s.sknPth + "controller-middle.png";
			_s.hdPath_str = _s.sknPth + "hd.png";
			_s.youtubeQualityArrowPath_str = _s.sknPth + "youtube-quality-arrow.png";
			_s.ytbQualityButtonPointerPath_str = _s.sknPth + "youtube-quality-pointer.png";
			_s.controllerBkPath_str = _s.sknPth + "controller-background.png";
			_s.skipIconSPath_str = _s.sknPth + "skip-icon-over.png";
			_s.adsBackgroundPath_str = _s.sknPth + "ads-background.png";
			_s.showSubtitleSPath_str = _s.sknPth + "show-subtitle-icon-over.png";
			_s.hideSubtitleSPath_str = _s.sknPth + "hide-subtitle-icon-over.png";
	
			_s.mainScrubberBkMiddlePath_str = _s.sknPth + "scrubber-middle-background.png";
			_s.mainScrubberDragMiddlePath_str = _s.sknPth + "scrubber-middle-drag.png";
			_s.mainScrubberDragLeftAddPath_str = _s.sknPth + "scrubber-left-drag-add.png";
			_s.mainScrubberDragMiddleAddPath_str = _s.sknPth + "scrubber-middle-drag-add.png";
			
			_s.volumeScrubberBkMiddlePath_str = _s.sknPth + "scrubber-middle-background.png";
			_s.volumeScrubberDragMiddlePath_str = _s.sknPth + "scrubber-middle-drag.png";	

			_s.volumeSPath_str = _s.sknPth + "volume-over.png";
			_s.volumeDPath_str = _s.sknPth + "volume-disabled.png";
			_s.largePlayS_str = _s.sknPth + "large-play-over.png";
			_s.fullScreenSPath_str = _s.sknPth + "full-screen-over.png";
			_s.ytbQualitySPath_str = _s.sknPth + "youtube-quality-over.png";
			_s.ytbQualityDPath_str = _s.sknPth + "youtube-quality-hd.png";
			_s.shareSPath_str = _s.sknPth + "share-over.png";
			_s.normalScreenSPath_str = _s.sknPth + "normal-screen-over.png";
			
			_s.progressMiddlePath_str = _s.sknPth + "progress-middle.png";
			
			_s.embedPathS_str = _s.sknPth + "embed-over.png"; 
			_s.embedWindowClosePathS_str = _s.sknPth + "embed-close-button-over.png"; 
			_s.shareWindowClosePathS_str = _s.sknPth + "embed-close-button-over.png"; 
			_s.embedWindowInputBackgroundPath_str = _s.sknPth + "embed-window-input-background.png";
			_s.embedCopyButtonNPath_str = _s.sknPth + "embed-copy-button.png";;
			_s.embedCopyButtonSPath_str = _s.sknPth + "embed-copy-button-over.png";
			_s.sendButtonNPath_str = _s.sknPth + "send-button.png";
			_s.sendButtonSPath_str = _s.sknPth + "send-button-over.png";
			_s.embedWindowBackground_str = _s.sknPth + "embed-window-background.png";
			_s.playbackRateSPath_str = _s.sknPth + "playback-rate-selected.png";
			_s.passButtonNPath_str = _s.sknPth + "pass-button.png";
			_s.passButtonSPath_str = _s.sknPth + "pass-button-over.png";
			
			_s.annotiationsListId_str = _s.props.annotiationsListId;
				
			//annotations
			_s.annotations_el = FWDEVPUtils.getChildById(_s.annotiationsListId_str);
			_s.hasAnnotiations_bl = Boolean(_s.annotations_el);
			
			if(_s.hasAnnotiations_bl){
				var annotations_ar = FWDEVPUtils.getChildren(_s.annotations_el);
				_s.annotations_ar = [];
				
				var child;
				var tt = annotations_ar.length;

				for(var i=0; i<tt; i++){
					var obj = {};
					child = annotations_ar[i];
				
					obj.start = FWDEVPSubtitle.getDuration(FWDEVPUtils.getAttributeValue(child, "data-start-time"));
					obj.end = FWDEVPSubtitle.getDuration(FWDEVPUtils.getAttributeValue(child, "data-end-time"));
					obj.left = parseInt(FWDEVPUtils.getAttributeValue(child, "data-left"), 10);
					obj.top = parseInt(FWDEVPUtils.getAttributeValue(child, "data-top"), 10);
					
					obj.showCloseButton_bl = FWDEVPUtils.getAttributeValue(child, "data-show-close-button") == "yes" ? true : false; 
					obj.clickSource = FWDEVPUtils.getAttributeValue(child, "data-click-source");
					obj.clickSourceTarget = FWDEVPUtils.getAttributeValue(child, "data-click-source-target");
					obj.normalStateClass = FWDEVPUtils.getAttributeValue(child, "data-normal-state-class");
					obj.selectedStateClass = FWDEVPUtils.getAttributeValue(child, "data-selected-state-class");
					
					obj.content = child.innerHTML;
					
					_s.annotations_ar[i] = obj
				}
				
				try{
					_s.annotations_el.parentNode.removeChild(_s.annotations_el)
				}catch(e){};
			}
			
			
			//video sources
			_s.startAtVideoSource = _s.props.startAtVideoSource || 0;
			_s.videoSource_ar = _s.props.videoSource;
			if(_s.videoSource_ar){
				_s.videosSource_ar = [];
				_s.videoLabels_ar = [];
				for(var i=0; i<_s.videoSource_ar.length; i++){
					var obj={};
					obj.source = _s.videoSource_ar[i]["source"];

					if(obj.source.indexOf("encrypt:") != -1){
						obj.source = atob(obj.source.substr(8));
					}

					obj.source = FWDEVPUtils.getValidSource(obj.source);


					obj.source2 = _s.videoSource_ar[i]["source2"];
					if(obj.source2){
						if(obj.source2.indexOf("encrypt:") != -1){
							obj.source2 = atob(obj.source2.substr(8));
						}
						obj.source2 = FWDEVPUtils.getValidSource(obj.source2);
					}
					
					obj.videoType = _s.videoSource_ar[i]["videoType"] || "normal";
					
					obj.label = _s.videoSource_ar[i]["label"];
					_s.videoSource_ar[i].videoType = obj.videoType;
					obj.isLive = _s.videoSource_ar[i]["isLive"] || "no";
					obj.isLive = obj.isLive == "yes" ? true : false;
					
					_s.videoLabels_ar[i] = _s.videoSource_ar[i]["label"];
					obj.isPrivate = _s.videoSource_ar[i]["isPrivate"] || "no";
					obj.rotationY360DegreeVideo = _s.videoSource_ar[i]["rotationY360DegreeVideo"];
					if(obj.rotationY360DegreeVideo === undefined) obj.rotationY360DegreeVideo = -90;
					obj.startWhenPlayButtonClick360DegreeVideo = _s.videoSource_ar[i]["startWhenPlayButtonClick360DegreeVideo"] || false;
					
					
					obj.isPrivate = obj.isPrivate == "yes" ? true : false;
					_s.videosSource_ar[i] = obj;
				}
				_s.videoLabels_ar.reverse();
				if(_s.startAtVideoSource > _s.videoLabels_ar.length - 1) _s.startAtVideoSource = _s.videoLabels_ar.length - 1;
			}
			
			if(!_s.videosSource_ar || (_s.videoLabels_ar && _s.videoSource_ar.length == 0)){
				setTimeout(function(){
					if(_s == null) return;
					errorMessage_str = "Please specify at least a video source!";
					_s.dispatchEvent(FWDEVPData.LOAD_ERROR, {text:errorMessage_str});
				}, 100);
				return;
			}
			
			
			if(_s.videosSource_ar[_s.startAtVideoSource]["source"]){
				if(_s.videosSource_ar[_s.startAtVideoSource]["source"].indexOf(".mp4") == -1)  _s.showDownloadVideoButton_bl = false;
			}
			
			//subtitles
			_s.startAtSubtitle = _s.props.startAtSubtitle || 0;
			_s.subtitlesSource_ar = _s.props.subtitlesSource;
			_s.subtitlesOffLabel_str = _s.props.subtitlesOffLabel || "Subtitle off";
			if(_s.subtitlesSource_ar){
				_s.subtitles_ar = [];
				for(var i=0; i<_s.subtitlesSource_ar.length; i++){
					var obj={};
					obj.source = _s.subtitlesSource_ar[i]["subtitlePath"];
					if(obj.source && obj.source.indexOf("encrypt:") != -1){
						obj.source = atob(obj.source.substr(8));
					}
					obj.source = FWDEVPUtils.getValidSource(obj.source);
					
					obj.label = _s.subtitlesSource_ar[i]["subtileLabel"];
					_s.subtitles_ar[i] = obj;
				}
				_s.subtitles_ar.splice(0,0, {source:"none", label:_s.subtitlesOffLabel_str});
				_s.subtitles_ar.reverse();
			}
			
			if(!_s.subtitlesSource_ar) _s.showSubtitleButton_bl = false;
			
			//video popup adds
			_s.popupAds_ar = _s.props.popupCommercialAdsSource;
			if(_s.popupAds_ar){
				for(var i=0; i<_s.popupAds_ar.length; i++){
					_s.popupAds_ar[i]["timeStart"] = FWDEVPUtils.getSecondsFromString(_s.popupAds_ar[i]["timeStart"]);
					_s.popupAds_ar[i]["timeEnd"] = FWDEVPUtils.getSecondsFromString(_s.popupAds_ar[i]["timeEnd"]);
					_s.popupAds_ar[i]["google_ad_width"] = _s.popupAds_ar[i]["google_ad_width"] || 600;
					_s.popupAds_ar[i]["google_ad_height"] = _s.popupAds_ar[i]["google_ad_height"] || 200;
				}
			}
			
			//ads
			_s.ads_ar = _s.props.adsSource;
			_s.adsSource_ar = [];
			if(_s.ads_ar){
				for(var i=0; i<_s.ads_ar.length; i++){
					var adsObj = {}
					adsObj.timeStart = FWDEVPUtils.getSecondsFromString(_s.ads_ar[i]["timeStart"]);
					adsObj.addDuration = FWDEVPUtils.getSecondsFromString(_s.ads_ar[i]["addDuration"]) || 10;
					adsObj.thumbnailSource = _s.ads_ar[i]["thumbnailSource"];
					
					adsObj.timeToHoldAds = _s.ads_ar[i]["timeToHoldAds"] || 0;
					adsObj.source = FWDEVPUtils.getValidSource(_s.ads_ar[i]["source"]);
					
					adsObj.link = _s.ads_ar[i]["link"];
					adsObj.target = _s.ads_ar[i]["target"];
					_s.adsSource_ar[i] = adsObj;
				}
			}

			if(_s.imaURL){
				_s.adsSource_ar = _s.popupAds_ar = [];
			}
			
			//cue points
			_s.cuePoints_ar = _s.props.cuepoints;
			_s.cuePointsSource_ar = [];
			if(_s.cuePoints_ar){
				for(var i=0; i<_s.cuePoints_ar.length; i++){
					var cuePointsObj = {}
					cuePointsObj.timeStart = FWDEVPUtils.getSecondsFromString(_s.cuePoints_ar[i]["timeStart"]);
					cuePointsObj.javascriptCall = _s.cuePoints_ar[i]["javascriptCall"];
					cuePointsObj.isPlayed_bl = false;
					
					_s.cuePointsSource_ar[i] = cuePointsObj;
				}
			}
		
			if(!_s.useChromeless_bl){
				
				_s.skinPaths_ar = [
				     {img:_s.largePlayN_img = new Image(), src:_s.sknPth + "large-play.png"},
				     {img:_s.skipIconPath_img = new Image(), src:_s.sknPth + "skip-icon.png"}
				];

				if(_s.showController_bl){
					_s.skinPaths_ar.push( 
					     {img:_s.mainScrubberBkLeft_img = new Image(), src:_s.sknPth + "scrubber-left-background.png"},
					     {img:_s.mainScrubberBkRight_img = new Image(), src:_s.sknPth + "scrubber-right-background.png"},
					     {img:_s.mainScrubberDragLeft_img = new Image(), src:_s.sknPth + "scrubber-left-drag.png"},
					     {img:_s.mainScrubberLine_img = new Image(), src:_s.sknPth + "scrubber-line.png"},
					     {img:_s.volumeScrubberBkLeft_img = new Image(), src:_s.sknPth + "scrubber-left-background.png"},
					     {img:_s.volumeScrubberBkRight_img = new Image(), src:_s.sknPth + "scrubber-right-background.png"},
					     {img:_s.volumeScrubberDragLeft_img = new Image(), src:_s.sknPth + "scrubber-left-drag.png"},
					     {img:_s.volumeScrubberLine_img = new Image(), src:_s.sknPth + "scrubber-line.png"},
					     {img:_s.progressLeft_img = new Image(), src:_s.sknPth + "progress-left.png"}
					)
				}
				
				if((_s.showOpener_bl && root.displayType == FWDEVPlayer.STICKY) 
					|| (_s.stickyOnScrollShowOpener_bl && root.stickyOnScroll)){
					_s.skinPaths_ar.push(
					     {img:_s.openerPauseN_img = new Image(), src:_s.sknPth + "open-pause-button-normal.png"},
						 {img:_s.openerPlayN_img = new Image(), src:_s.sknPth + "open-play-button-normal.png"},
						 {img:_s.animationPath_img = new Image(), src:_s.sknPth + "equalizer.png"},
						 {img:_s.closeN_img = new Image(), src:_s.sknPth + "opener-close.png"},
						 {img:_s.openTopN_img = new Image(), src:_s.sknPth + "open-button-normal-top.png"},
						 {img:_s.openBottomN_img = new Image(), src:_s.sknPth + "open-button-normal-bottom.png"}
						 
					)
					_s.openerPauseS_str = _s.sknPth + "open-pause-button-selected.png";
					_s.openerPlayS_str = _s.sknPth + "open-play-button-selected.png";
					_s.openerAnimationPath_str = _s.sknPth + "equalizer.png";	
					_s.openTopSPath_str = _s.sknPth + "open-button-selected-top.png";	
					_s.openBottomSPath_str = _s.sknPth + "open-button-selected-bottom.png";	
					_s.openTopSPath_str = _s.sknPth + "open-button-selected-top.png";
					_s.openBottomSPath_str = _s.sknPth + "open-button-selected-bottom.png";
					
					_s.closeSPath_str = _s.sknPth + "opener-close-over.png"
				}
				
				if(_s.showRewindButton_bl){
					_s.skinPaths_ar.push(
					     {img:_s.rewindN_img = new Image(), src:_s.sknPth + "rewind.png"}
					)
					_s.rewindSPath_str = _s.sknPth + "rewind-over.png";
				}
				
				
				if(_s.showShareButton_bl){
					_s.shareSPath_str = _s.sknPth + "share-over.png";
					_s.facebookSPath_str = _s.sknPth + "facebook-over.png";
					_s.googleSPath_str = _s.sknPth + "google-plus-over.png";
					_s.twitterSPath_str = _s.sknPth + "twitter-over.png";
					_s.likedInSPath_str = _s.sknPth + "likedin-over.png";
					_s.bufferSPath_str = _s.sknPth + "buffer-over.png";
					_s.diggSPath_str = _s.sknPth + "digg-over.png";
					_s.redditSPath_str = _s.sknPth + "reddit-over.png";
					_s.thumbrlSPath_str = _s.sknPth + "thumbrl-over.png";
					
				}
			}

			_s.atbSPath_str = _s.sknPth + "a-to-b-button-over.png";
			
			if(!_s.useVectorIcons_bl){
				_s.skinPaths_ar.push(
					 {img:_s.playN_img = new Image(), src:_s.sknPth + "play.png"},
					 {img:_s.pauseN_img = new Image(), src:_s.sknPth + "pause.png"},
					 {img:_s.volumeN_img = new Image(), src:_s.sknPth + "volume.png"},		
					 {img:_s.fullScreenN_img = new Image(), src:_s.sknPth + "full-screen.png"},
					 {img:_s.ytbQualityN_img = new Image(), src:_s.sknPth + "youtube-quality.png"},
					 {img:_s.normalScreenN_img = new Image(), src:_s.sknPth + "normal-screen.png"},
					 {img:_s.passColoseN_img = new Image(), src:_s.sknPth + "embed-close-button.png"},
					 {img:_s.showSubtitleNPath_img = new Image(), src:_s.sknPth + "show-subtitle-icon.png"},
					 {img:_s.hideSubtitleNPath_img = new Image(), src:_s.sknPth + "hide-subtitle-icon.png"},
					 {img:_s.playbackRateNPath_img = new Image(), src:_s.sknPth + "playback-rate-normal.png"}
				);

				if(_s.showDownloadVideoButton_bl){
					_s.skinPaths_ar.push(
					 	{img:_s.downloadN_img = new Image(), src:_s.sknPth + "download-button.png"}
					)
				}

				if(_s.showShareButton_bl || _s.showEmbedButton_bl){
					_s.skinPaths_ar.push(
						{img:_s.embedN_img = new Image(), src:_s.sknPth + "embed.png"},
					 	{img:_s.embedColoseN_img = new Image(), src:_s.sknPth + "embed-close-button.png"},
						{img:_s.shareClooseN_img = new Image(), src:_s.sknPth + "embed-close-button.png"},
						{img:_s.embedClooseN_img = new Image(), src:_s.sknPth + "embed-close-button.png"}
					);
				}
				
				if(_s.showShareButton_bl){
					_s.skinPaths_ar.push(
						{img:_s.shareN_img = new Image(), src:_s.sknPth + "share.png"},
						{img:_s.facebookN_img = new Image(), src:_s.sknPth + "facebook.png"},
						{img:_s.googleN_img = new Image(), src:_s.sknPth + "google-plus.png"},
						{img:_s.twitterN_img = new Image(), src:_s.sknPth + "twitter.png"},
						{img:_s.likedInkN_img = new Image(), src:_s.sknPth + "likedin.png"},
						{img:_s.bufferkN_img = new Image(), src:_s.sknPth + "buffer.png"},
						{img:_s.diggN_img = new Image(), src:_s.sknPth + "digg.png"},
						{img:_s.redditN_img = new Image(), src:_s.sknPth + "reddit.png"},
						{img:_s.thumbrlN_img = new Image(), src:_s.sknPth + "thumbrl.png"}
					)
				}

				if(_s.useAToB){
					_s.skinPaths_ar.push(
						{img:_s.atbNPath_img = new Image(), src:_s.sknPth + "a-to-b-button.png"}
					)
				}
			}

			if(_s.showChromecastButton_bl){
				_s.skinPaths_ar.push(
					{img:_s.castN_img = new Image(), src:_s.sknPth + "cast.png"},
					{img:_s.uncastN_img = new Image(), src:_s.sknPth + "uncast.png"}
				)
				_s.castSPath_str = _s.sknPth + "cast-over.png";
				_s.uncastSPath_str = _s.sknPth + "uncast-over.png";
			}

			// Vr button.
			_s.skinPaths_ar.push(
				{img:_s.vr_img = new Image(), src:_s.sknPth + "vr.png"},
			)
			_s.vrSPath_img = _s.sknPth + "vr-over.png";
			

			if(!_s.useVectorIconsSkin_bl && _s.showAudioTracksButton_bl){
				_s.skinPaths_ar.push(
					{img:_s.at_img = new Image(), src:_s.sknPth + "at.png"}
				)
				_s.atSPath_img = _s.sknPth + "at-over.png";
			}
			
			_s.downloadSPath_str = _s.sknPth + "download-button-over.png";
			if(_s.showHelpScreen_bl){
				_s.skinPaths_ar.push(
				    {img:_s.helpScreen_img = new Image(), src:_s.sknPth + _s.helpScreenPath_str},
				    {img:_s.pauseN_img = new Image(), src:_s.sknPth + "ok-button.png"}
				);
			};
			
			if(_s.showAopwWindow_bl){
				_s.skinPaths_ar.push(
				    {img:_s.popwColseN_img = new Image(), src:_s.sknPth + "popw-close-button.png"}
				);
				_s.popwColseSPath_str = _s.sknPth + "popw-close-button-over.png";
				_s.popwWindowBackgroundPath_str = _s.sknPth + "popw-window-background.png";
				_s.popwBarBackgroundPath_str = _s.sknPth + "popw-bar-background.png";
			};
			
			_s.totalGraphics = _s.skinPaths_ar.length;		
			_s.hdIcn = _s.sknPth + 'hd.png';
			setTimeout(function(){
				_s.onPreloaderLoadHandler();
			}, 1)
		};
		

		//####################################//
		/* Preloader load done! */
		//###################################//
		_s.onPreloaderLoadHandler = function(){
			_s.dispatchEvent(FWDEVPData.PRELOADER_LOAD_DONE);
			_s.countLoadedSCript = 0;
			_s.scripts = [];
			if(_s.useAToB && !window['FWDEVPATB']){
				_s.scripts.push('FWDEVPATB.js');
			}
			if(_s.thumbnailsPreview && !window['FWDEVPThumbnailsPreview']){
				_s.scripts.push('FWDEVPThumbnailsPreview.js');
			}
			if(_s.showChromecastButton_bl && !window['FWDEVPCC']){
				_s.scripts.push('https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1');
				_s.scripts.push('FWDEVPCC.js');
			}
			_s.totalScripts = _s.scripts.length;

			
			if(_s.useChromeless_bl){
				setTimeout(function(){
					_s.dispatchEvent(FWDEVPData.SKIN_LOAD_COMPLETE);
				}, 50);
			}else{
				_s.loadPlugin();
			}
			
		};

		_s.loadPlugin = function(){
			if(_s.countLoadedSCript == _s.totalScripts){
				_s.loadSkin();	
			}else{
				var script = document.createElement('script');
				var scriptURI = _s.scripts[_s.countLoadedSCript] 
				if(/\?/.test(scriptURI)){
					scriptURI += '&version=' + FWDEVPlayer.V;
				}else{
					scriptURI += '?version=' + FWDEVPlayer.V;
				}
				document.head.appendChild(script);
				if(scriptURI.indexOf('gstatic') != -1){
					script.src = scriptURI;
				}else{
					script.src =  _s.mainFolderPath_str + 'java/' + scriptURI;
				}
				
				script.onload = _s.loadPlugin;
				script.onerror = function(e){
					console.log(e);
					if(scriptURI == 'FWDEVPATB.js'){
						_s.dispatchEvent(FWDEVPData.LOAD_ERROR, {text:'You have enabled the A to B plugin<br>A to B js file named <font color="#FF0000">FWDEVPATB.js</font> is not found. Please make sure that the content folder contains the java folder that contains the <font color="#FF0000">FWDEVPATB.js</font> file. '});
					}else if(scriptURI == 'FWDEVPThumbnailsPreview.js'){
						_s.dispatchEvent(FWDEVPData.LOAD_ERROR, {text:'You have enabled the thumbnal preview plugin<br>thumbnail preview js file named <font color="#FF0000">FWDEVPThumbnailsPreview.js</font> is not found. Please make sure that the content folder contains the java folder that contains the <font color="#FF0000">FWDEVPThumbnailsPreview.js</font> file. '});
					}else if(scriptURI == 'FWDEVPCC.js'){
						_s.dispatchEvent(FWDEVPData.LOAD_ERROR, {text:'You have enabled the chromecast plugin<br>js file named <font color="#FF0000">FWDEVPCC.js</font> is not found. Please make sure that the content folder contains the java folder that contains the <font color="#FF0000">FWDEVPCC.js</font> file.'});
					}else if(scriptURI.indexOf('gstatic') != -1){
						_s.dispatchEvent(FWDEVPData.LOAD_ERROR, {text:'Choromecast framework javascript file can\'t be loaded<font color="#FF0000"> ' + scriptURI +  ' </font>'});
					}
				
				}
			}
			_s.countLoadedSCript++;
		}


		//#####################################//
		/* Load IMA SDK */
		//#####################################//
		_s.countImaLoadedSCript = 0;
		_s.startToLoadIMA = function(){
			
			if(_s.imaScripts) return;
			_s.imaScripts = ['//imasdk.googleapis.com/js/sdkloader/ima3.js',  _s.mainFolderPath_str + 'java/FWDEVPIMA.js'];
			_s.totalImaScripts = _s.imaScripts.length;
			_s.loadIMA();
		}
		
		_s.loadIMA = function(){
			
			if(_s.countImaLoadedSCript == _s.totalImaScripts){
				_s.imaReady = true;
				_s.dispatchEvent(FWDEVPData.IMA_READY);
			}else{
				var script = document.createElement('script');
				var scriptURI = _s.imaScripts[_s.countImaLoadedSCript];
				document.head.appendChild(script);
				
				script.src = scriptURI;
				script.onload = _s.loadIMA;
				script.onerror = function(e){
					if(_s.countImaLoadedSCript == 1){
						_s.dispatchEvent(FWDEVPData.LOAD_ERROR, {text:'IMA SDK can\'t be loaded'});
					}else if(_s.countImaLoadedSCript == 2){
						_s.dispatchEvent(FWDEVPData.LOAD_ERROR, {text:'IMA file <font color="#FF0000">FWDEVPIMA.js</font> is not found. Please make sure that the content folder contains the java folder that contains the <font color="#FF0000">FWDEVPIMA.js</font> file. '});
					}
					_s.dispatchEvent(FWDEVPData.IMA_ERROR);
				}
				_s.countImaLoadedSCript++;
			}
		}
		

		//####################################//
		/* load buttons graphics */
		//###################################//
		_s.loadSkin = function(){
			var img;
			var src;
			for(var i=0; i<_s.totalGraphics; i++){
				img = _s.skinPaths_ar[i].img;
				src = _s.skinPaths_ar[i].src;
				img.onload = _s.onSkinLoadHandler;
				img.onerror = _s.onSkinLoadErrorHandler;
				img.src = src;
			}
		};
		
		_s.onSkinLoadHandler = function(e){
			_s.countLoadedSkinImages++;
			if(_s.countLoadedSkinImages == _s.totalGraphics){
				setTimeout(function(){
					_s.dispatchEvent(FWDEVPData.SKIN_LOAD_COMPLETE);
				}, 50);
			}
		};
		
		_s.onSkinLoadErrorHandler = function(e){
			if (FWDEVPUtils.isIEAndLessThen9){
				var message = "Graphics image not found!";
			}else{
				var message = "The skin graphics with label <font color='#FF0000'>" + e.target.src + "</font> can't be loaded, check path!";
			}
			
			if(window.console) console.log(e);
			var err = {text:message};
			setTimeout(function(){
				_s.dispatchEvent(FWDEVPData.LOAD_ERROR, err);
			}, 50);
		};
	
		
		//####################################//
		/* load buttons graphics */
		//###################################//
	
		_s.onSkinLoadHandlersss = function(e){
	
			_s.countLoadedSkinImages++;
			if(_s.countLoadedSkinImages < _s.totalGraphics){
				if(FWDEVPUtils.isIEAndLessThen9){
					_s.loadImageId_to = setTimeout(_s.loadSkin, 16);
				}else{
					_s.loadSkin();
				}
			}else{
				setTimeout(function(){
					_s.dispatchEvent(FWDEVPData.SKIN_LOAD_COMPLETE);
				}, 50);
			}
		};
		

		//##########################################//
		/* Download video */
		//##########################################//
		_s.downloadVideo = function(sourcePath, pName){
			
			if(FWDEVPUtils.isLocal){
				_s.isPlaylistDispatchingError_bl = true;
				showLoadPlaylistErrorId_to = setTimeout(function(){
					_s.dispatchEvent(FWDEVPData.LOAD_ERROR, {text:"Downloading video files local is not allowed or possible! To function properly please test online."});
					_s.isPlaylistDispatchingError_bl = false;
				}, 50);
				return;
			}
			
			if(!sourcePath){
				_s.isPlaylistDispatchingError_bl = true;
				showLoadPlaylistErrorId_to = setTimeout(function(){
					_s.dispatchEvent(FWDEVPData.LOAD_ERROR, {text:"Not allowed to download this video!"});
					_s.isPlaylistDispatchingError_bl = false;
				}, 50);
				return;
			}
			
			if(String(sourcePath.indexOf(".mp4")) == -1){
				_s.isPlaylistDispatchingError_bl = true;
				showLoadPlaylistErrorId_to = setTimeout(function(){
					_s.dispatchEvent(FWDEVPData.LOAD_ERROR, {text:"Only mp4 video files hosted on your server can be downloaded."});
					_s.isPlaylistDispatchingError_bl = false;
				}, 50);
				return;
				
			}
			
			var defaultSourcePath = sourcePath;
			var path1 = location.origin;
			var path2 = location.pathname;
		
			if(path2.indexOf(".") != -1){
				path2 = path2.substr(0, path2.lastIndexOf("/") + 1);
			}
			
			var hasHTTPorHTTPS_bl = sourcePath.indexOf("http:") == -1 && sourcePath.indexOf("https:") == -1;
		
			if(hasHTTPorHTTPS_bl){
				sourcePath = path1 + path2 + sourcePath;
			}
	
			if(!pName) return;
		
			pName = pName.replace(/[^A-Z0-9\-\_\.]+/ig, "_");
			if(pName.length > 40) pName = pName.substr(0, 40) + "...";
			if(!(/\.(mp4)$/i).test(pName)){
				 pName+='.mp4';
			}else if(!(/\.(mp3)$/i).test(pName)){
				 pName+='.mp3';
			}
			
			sourcePath = sourcePath;
			
			var url = _s.videoDownloaderPath_str;
			
			if(!_s.dlIframe){
				_s.dlIframe = document.createElement("IFRAME");
				_s.dlIframe.style.display = "none";
				document.documentElement.appendChild(_s.dlIframe);
			}
			
			if(_s.isMobile_bl && !FWDEVPUtils.isAndroid){
				
				if(_s.openDownloadLinkOnMobile_bl){
					window.open(defaultSourcePath, "_blank");
					return;
				}
			
				var email = _s.getValidEmail();
				if(!email) return;
				
				if(_s.emailXHR != null){
					try{_s.emailXHR.abort();}catch(e){}
					_s.emailXHR.onreadystatechange = null;
					_s.emailXHR.onerror = null;
					_s.emailXHR = null;
				}
				
				_s.emailXHR = new XMLHttpRequest();
				
				_s.emailXHR.onreadystatechange = function(e){
					if(_s.emailXHR.readyState == 4){
						if(_s.emailXHR.status == 200){
							if(_s.emailXHR.responseText == "sent"){
								alert("Email sent.");
							}else{
								alert("Error sending email, this is a server side error, the php file can't send the email!");
							}
							
						}else{
							alert("Error sending email: " + _s.emailXHR.status + ": " + _s.emailXHR.statusText);
						}
					}
				};
				
				_s.emailXHR.onerror = function(e){
					try{
						if(window.console) console.log(e);
						if(window.console) console.log(e.message);
					}catch(e){};
					alert("Error sending email: " + e.message);
				};

				_s.emailXHR.open("get", _s.mailPath_str + "?mail=" + email + "&name=" + pName + "&path=" + sourcePath, true);
				_s.emailXHR.send();
				return;
			}
			
		
			_s.dlIframe.src = url + "?path="+ sourcePath +"&name=" + pName;
		};
		
		_s.getValidEmail = function(){
			var email = prompt("Please enter your email address where the video download link will be sent:");
			var emailRegExp = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
		
			while(!emailRegExp.test(email) || email == ""){
				if(email === null) return;
				email = prompt("Please enter a valid email address:");
			}
			return email;
		};
		

		//####################################//
		/* load vast */
		//####################################//
		_s.setVastSource = function(source){
			if(!_s.vastLoaded_bl){
				_s.vastScript = document.createElement('script');
				var scriptURI = _s.scripts[_s.countLoadedSCript];
				document.head.appendChild(_s.vastScript);
				_s.vastScript.src =  _s.mainFolderPath_str + 'java/FWDEVPVast.js';
				
				_s.vastScript.onload = function(){
					FWDEVPVast.setPrototype();
					_s.vast = new FWDEVPVast(_s);
					_s.vast.setSource(source);
				}
				
				_s.vastScript.onerror = function(e){
					_s.dispatchEvent(FWDEVPData.LOAD_ERROR, {text:'VAST js plugin named <font color="#FF0000">FWDEVPVast.js</font> is not found. Please make sure that the content folder contains the java folder that contains the <font color="#FF0000">FWDEVPVast.js</font> file. '});
				}
				_s.vastLoaded_bl = true;
				return;
			}
			if(_s.vast) _s.vast.setSource(source);
		}
		
		_s.closeVast = function(){
			if(_s.vast) _s.vast.closeVast();
		}
		
		_s.fixVmapTimes = function(duration){
			if(_s.vast) _s.vast.fixVmapTimes(duration);
		}
		
		
		//####################################//
		/* show error if a required property is not defined */
		//####################################//
		_s.showPropertyError = function(error){
			_s.dispatchEvent(FWDEVPData.LOAD_ERROR, {text:"The property called <font color='#FF0000'>" + error + "</font> is not defined."});
		};
		
		_s.init();
	};
	
	/* set prototype */
	FWDEVPData.setPrototype = function(){
		FWDEVPData.prototype = new FWDEVPEventDispatcher();
	};
	
	FWDEVPData.prototype = null;
	
	FWDEVPData.IMA_READY = 'IMAReady';
	FWDEVPData.IMA_ERROR = 'IMAError';
	FWDEVPData.VAST_LOADED = "vastLoaded";
	FWDEVPData.PRELOADER_LOAD_DONE = "onPreloaderLoadDone";
	FWDEVPData.LOAD_DONE = "onLoadDone";
	FWDEVPData.LOAD_ERROR = "onLoadError";
	FWDEVPData.IMAGE_LOADED = "onImageLoaded";
	FWDEVPData.SKIN_LOAD_COMPLETE = "onSkinLoadComplete";
	FWDEVPData.SKIN_PROGRESS = "onSkinProgress";
	FWDEVPData.IMAGES_PROGRESS = "onImagesPogress";
	FWDEVPData.VAST_LOADING = 'vastLoading';
	FWDEVPData.VAST_LOADED_DONE = 'vastLoadingDone';
	
	window.FWDEVPData = FWDEVPData;
}(window));/**
 * Easy Video Player PACKAGED v9.1
 * Display object.
 *
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © 2006 All Rights Reserved.
 */
(function (window){
	/*
	 * @ type values: div, img.
	 * @ positon values: relative, absolute.
	 * @ positon values: hidden.
	 * @ display values: block, inline-block, _s applies only if the position is relative.
	 */
	
	var FWDEVPDO = function(type, position, overflow, t){

		'use strict';
		
		var _s = this;
		_s.listeners = {events_ar:[]};
		
		if(type == "div" || type == "img" || type == "canvas" || type == "input" || type == "iframe"){
			_s.type = type;	
		}else{
			throw Error("Type is not valid! " + type);
		}
		
		_s.t = t;
		_s.children_ar = [];
		_s.position = position || "absolute";
		_s.overflow = overflow || "hidden";
		_s.display = "block";
		_s.visible = true;
		_s.x = _s.y = _s.w = _s.h = _s.rotation = 0;
		_s.scale = _s.alpha = 1
		
		_s.hasT3D = FWDEVPUtils.hasTransform3d;
		_s.hasT2D = FWDEVPUtils.hasTransform2d;
		
		//##############################//
		/* init */
		//#############################//
		_s.init = function(){
			_s.setScreen();
		};	

		
		//######################################//
		/* check if it supports transforms. */
		//######################################//
		_s.getTransform = function() {
		    var properties = ['transform', 'msTransform', 'WebkitTransform', 'MozTransform', 'OTransform'];
		    var p;
		    while (p = properties.shift()) {
		       if (typeof _s.screen.style[p] !== 'undefined') {
		            return p;
		       }
		    }
		    return false;
		};
	
		
		//######################################//
		/* setup main screen */
		//######################################//
		_s.setScreen = function(element){
			if(_s.type == "img" && element){
				_s.screen = element;
				_s.setMainProperties();
			}else{
				_s.screen = document.createElement(_s.type);
				_s.setMainProperties();
			}
		};

		
		//########################################//
		/* set main properties */
		//########################################//
		_s.setMainProperties = function(){
			
			_s.transform = _s.getTransform();
			_s.setPosition(_s.position);
			_s.setOverflow(_s.overflow);
		
			_s.screen.style.left = "0px";
			_s.screen.style.top = "0px";
			_s.screen.style.margin = "0px";
			_s.screen.style.padding = "0px";
			_s.screen.style.maxWidth = "none";
			_s.screen.style.maxHeight = "none";
			_s.screen.style.border = "none";
			_s.screen.style.lineHeight = "1";
			_s.screen.style.backfaceVisibility = "hidden";
			
			if(type == "img"){
				_s.setWidth(_s.screen.width);
				_s.setHeight(_s.screen.height);
			}
		};
			
		_s.setBackfaceVisibility =  function(){
			_s.screen.style.backfaceVisibility = "visible";
		};
		

		//###################################################//
		/* set / get various peoperties.*/
		//###################################################//
		_s.setSelectable = function(val){
			if(!val){
				_s.screen.style.userSelect = "none";
				_s.screen.style.MozUserSelect = "none";
				_s.screen.style.webkitUserSelect = "none";
				_s.screen.style.khtmlUserSelect = "none";
				_s.screen.style.oUserSelect = "none";
				_s.screen.style.msUserSelect = "none";
				_s.screen.msUserSelect = "none";
				_s.screen.ondragstart = function(e){return false;};
				_s.screen.onselectstart = function(){return false;};
				_s.screen.ontouchstart = function(){return false;};
				_s.screen.style.webkitTouchCallout='none';
				_s.hasBeenSetSelectable_bl = true;
			}else{
				if(FWDEVPUtils.isFirefox || FWDEVPUtils.isIE){
					_s.screen.style.userSelect = "element";
					_s.screen.style.MozUserSelect = "element";
					_s.screen.style.msUserSelect = "element";
				}else if(FWDEVPUtils.isSafari){
					_s.screen.style.userSelect = "text";
					_s.screen.style.webkitUserSelect = "text";
				}else{
					_s.screen.style.userSelect = "auto";
					_s.screen.style.webkitUserSelect = "auto";
				}
				
				_s.screen.style.khtmlUserSelect = "auto";
				_s.screen.style.oUserSelect = "auto";
				
				if(FWDEVPUtils.isIEAndLessThen9){
					_s.screen.ondragstart = null;
					_s.screen.onselectstart = null;
					_s.screen.ontouchstart = null;
				}else{
					_s.screen.ondragstart = undefined;
					_s.screen.onselectstart = undefined;
					_s.screen.ontouchstart = undefined;
				}
				
				_s.screen.style.webkitTouchCallout='default';
				_s.hasBeenSetSelectable_bl = false;
			}
		};
		
		_s.getScreen = function(){
			return _s.screen;
		};
		
		_s.setVisible = function(val){
			_s.visible = val;
			if(_s.visible == true){
				_s.screen.style.visibility = "visible";
			}else{
				_s.screen.style.visibility = "hidden";
			}
		};
		
		_s.getVisible = function(){
			return _s.visible;
		};
			
		_s.setResizableSizeAfterParent = function(){
			_s.screen.style.width = "100%";
			_s.screen.style.height = "100%";
		};
		
		_s.style = function(){
			return _s.screen.style;
		};
		
		_s.setOverflow = function(val){
			_s.overflow = val;
			_s.screen.style.overflow = _s.overflow;
		};
		
		_s.setPosition = function(val){
			_s.position = val;
			_s.screen.style.position = _s.position;
		};
		
		_s.setDisplay = function(val){
			_s.display = val;
			_s.screen.style.display = _s.display;
		};
		
		_s.setButtonMode = function(val){
			_s.buttonMode = val;
			if(_s.buttonMode ==  true){
				_s.screen.style.cursor = "pointer";
			}else{
				_s.screen.style.cursor = "default";
			}
		};
		
		_s.setBkColor = function(val){
			_s.screen.style.backgroundColor = val;
		};
		
		_s.setInnerHTML = function(val){
			_s.innerHTML = val;
			_s.screen.innerHTML = _s.innerHTML;
		};
		
		_s.getInnerHTML = function(){
			return _s.innerHTML;
		};
		
		_s.getRect = function(){
			return _s.screen.getBoundingClientRect();
		};
		
		_s.setAlpha = function(val){
			_s.alpha = val;
			_s.screen.style.opacity = _s.alpha;
		};
		
		_s.getAlpha = function(){
			return _s.alpha;
		};
		
		_s.getRect = function(){
			return _s.screen.getBoundingClientRect();
		};
		
		_s.getGlobalX = function(){
			return _s.getRect().left;
		};
		
		_s.getGlobalY = function(){
			return _s.getRect().top;
		};
		
		_s.setX = function(val){
			_s.x = val;
			if(_s.hasT3D){
				if(_s.t){
					_s.screen.style[_s.transform] = 'translate3d(' + _s.x + 'px,' + _s.y + 'px,0) scale(' + _s.scale + ' , ' + _s.scale + ') rotate(' + _s.rotation + 'deg)';
				}else{
					_s.screen.style[_s.transform] = 'translate3d(' + _s.x + 'px,' + _s.y + 'px,0)';
				}
			}else if(_s.hasT2D){
				if(_s.t){
					_s.screen.style[_s.transform] = 'translate(' + _s.x + 'px,' + _s.y + 'px) scale(' + _s.scale + ' , ' + _s.scale + ') rotate(' + _s.rotation + 'deg)';
				}else{
					_s.screen.style[_s.transform] = 'translate(' + _s.x + 'px,' + _s.y + 'px)';
				}
			}else{
				_s.screen.style.left = _s.x + "px";
			}
		};
		
		_s.getX = function(){
			return  _s.x;
		};
		
		_s.setY = function(val){
			_s.y = val;
			if(_s.hasT3D){
				if(_s.t){
					_s.screen.style[_s.transform] = 'translate3d(' + _s.x + 'px,' + _s.y + 'px,0) scale(' + _s.scale + ' , ' + _s.scale + ') rotate(' + _s.rotation + 'deg)';
				}else{
					_s.screen.style[_s.transform] = 'translate3d(' + _s.x + 'px,' + _s.y + 'px,0)';
				}
			}else if(_s.hasT2D){
				if(_s.t){
					_s.screen.style[_s.transform] = 'translate(' + _s.x + 'px,' + _s.y + 'px) scale(' + _s.scale + ' , ' + _s.scale + ') rotate(' + _s.rotation + 'deg)';
				}else{
					_s.screen.style[_s.transform] = 'translate(' + _s.x + 'px,' + _s.y + 'px)';
				}
			}else{
				_s.screen.style.top = _s.y + "px";
			}
		};
		
		_s.getY = function(){
			return  _s.y;
		};

		_s.setScale2 = function(val){
			_s.scale = val;
			if(_s.hasT3D){
				if(_s.t){
					_s.screen.style[_s.transform] = 'translate3d(' + _s.x + 'px,' + _s.y + 'px,0) scale(' + _s.scale + ' , ' + _s.scale + ') rotate(' + _s.rotation + 'deg)';
				}else{
					_s.screen.style[_s.transform] = 'translate3d(' + _s.x + 'px,' + _s.y + 'px,0)';
				}
			}else if(_s.hasT2D){
				if(_s.t){
					_s.screen.style[_s.transform] = 'translate(' + _s.x + 'px,' + _s.y + 'px) scale(' + _s.scale + ' , ' + _s.scale + ') rotate(' + _s.rotation + 'deg)';
				}else{
					_s.screen.style[_s.transform] = 'translate(' + _s.x + 'px,' + _s.y + 'px)';
				}
			}
		};
		
		_s.getScale = function(){
			return _s.scale;
		};
		
		_s.setRotation = function(val){
			_s.rotation = val;
			if(_s.hasT3D){
				if(_s.t){
					_s.screen.style[_s.transform] = 'translate3d(' + _s.x + 'px,' + _s.y + 'px,0) scale(' + _s.scale + ' , ' + _s.scale + ') rotate(' + _s.rotation + 'deg)';
				}else{
					_s.screen.style[_s.transform] = 'translate3d(' + _s.x + 'px,' + _s.y + 'px,0)';
				}
			}else if(_s.hasT2D){
				if(_s.t){
					_s.screen.style[_s.transform] = 'translate(' + _s.x + 'px,' + _s.y + 'px) scale(' + _s.scale + ' , ' + _s.scale + ') rotate(' + _s.rotation + 'deg)';
				}else{
					_s.screen.style[_s.transform] = 'translate(' + _s.x + 'px,' + _s.y + 'px)';
				}
			}
		};

		_s.getRotation = function(){
			return _s.rotation;
		};
		
		
		_s.setWidth = function(val){
			_s.w = val;
			if(_s.type == "img"){
				_s.screen.width = _s.w;
				_s.screen.style.width = _s.w + "px";
			}else{
				_s.screen.style.width = _s.w + "px";
			}
		};
		
		_s.getWidth = function(){
			if(_s.type == "div" || _s.type == "input"){
				if(_s.screen.offsetWidth != 0) return  _s.screen.offsetWidth;
				return _s.w;
			}else if(_s.type == "img"){
				if(_s.screen.offsetWidth != 0) return  _s.screen.offsetWidth;
				if(_s.screen.width != 0) return  _s.screen.width;
				return _s._w;
			}else if( _s.type == "canvas"){
				if(_s.screen.offsetWidth != 0) return  _s.screen.offsetWidth;
				return _s.w;
			}
		};
		
		_s.setHeight = function(val){
			_s.h = val;
			if(_s.type == "img"){
				_s.screen.height = _s.h;
				_s.screen.style.height = _s.h + "px";
			}else{
				_s.screen.style.height = _s.h + "px";
			}
		};
		
		_s.getHeight = function(){
			if(_s.type == "div" || _s.type == "input"){
				if(_s.screen.offsetHeight != 0) return  _s.screen.offsetHeight;
				return _s.h;
			}else if(_s.type == "img"){
				if(_s.screen.offsetHeight != 0) return  _s.screen.offsetHeight;
				if(_s.screen.height != 0) return  _s.screen.height;
				return _s.h;
			}else if(_s.type == "canvas"){
				if(_s.screen.offsetHeight != 0) return  _s.screen.offsetHeight;
				return _s.h;
			}
		};

		
		//#####################################//
		/* DOM list */
		//#####################################//
		_s.addChild = function(e){
			if(_s.contains(e)){	
				_s.children_ar.splice(FWDEVPUtils.indexOfArray(_s.children_ar, e), 1);
				_s.children_ar.push(e);
				_s.screen.appendChild(e.screen);
			}else{
				_s.children_ar.push(e);
				_s.screen.appendChild(e.screen);
			}
		};
		
		_s.removeChild = function(e){
			if(_s.contains(e)){
				_s.children_ar.splice(FWDEVPUtils.indexOfArray(_s.children_ar, e), 1);
				_s.screen.removeChild(e.screen);
			}else{
				throw Error("##removeChild()## Child dose't exist, it can't be removed!");
			};
		};
		
		_s.contains = function(e){
			if(FWDEVPUtils.indexOfArray(_s.children_ar, e) == -1){
				return false;
			}else{
				return true;
			}
		};
		
		_s.addChildAt = function(e, index){
			if(_s.getNumChildren() == 0){
				_s.children_ar.push(e);
				_s.screen.appendChild(e.screen);
			}else if(index == 1){
				_s.screen.insertBefore(e.screen, _s.children_ar[0].screen);
				_s.screen.insertBefore(_s.children_ar[0].screen, e.screen);	
				if(_s.contains(e)){
					_s.children_ar.splice(FWDEVPUtils.indexOfArray(_s.children_ar, e), 1, e);
				}else{
					_s.children_ar.splice(FWDEVPUtils.indexOfArray(_s.children_ar, e), 0, e);
				}
			}else{
				if(index < 0  || index > _s.getNumChildren() -1) throw Error("##getChildAt()## Index out of bounds!");
				
				_s.screen.insertBefore(e.screen, _s.children_ar[index].screen);
				if(_s.contains(e)){
					_s.children_ar.splice(FWDEVPUtils.indexOfArray(_s.children_ar, e), 1, e);
				}else{
					_s.children_ar.splice(FWDEVPUtils.indexOfArray(_s.children_ar, e), 0, e);
				}
			}
		};
		
		_s.getChildAt = function(index){
			if(index < 0  || index > _s.getNumChildren() -1) throw Error("##getChildAt()## Index out of bounds!");
			if(_s.getNumChildren() == 0) throw Errror("##getChildAt## Child dose not exist!");
			return _s.children_ar[index];
		};
		
		_s.getChildIndex = function(child){
			if(_s.contains(child)){
				return FWDEVPUtils.indexOfArray(_s.children_ar, child);
			}
			return 0;
		};
		
		_s.removeChildAtZero = function(){
			_s.screen.removeChild(_s.children_ar[0].screen);
			_s.children_ar.shift();
		};
		
		_s.getNumChildren = function(){
			return _s.children_ar.length;
		};
		
		
		//################################//
		/* event dispatcher */
		//#################################//
		_s.addListener = function (type, listener){
	    	
	    	if(type == undefined) throw Error("type is required.");
	    	if(typeof type === "object") throw Error("type must be of type String.");
	    	if(typeof listener != "function") throw Error("listener must be of type Function.");
	    	
	    	
	        var event = {};
	        event.type = type;
	        event.listener = listener;
	        event.target = this;
	        this.listeners.events_ar.push(event);
	    };
	    
	    _s.dispatchEvent = function(type, props){
	    	if(this.listeners == null) return;
	    	if(type == undefined) throw Error("type is required.");
	    	if(typeof type === "object") throw Error("type must be of type String.");
	    	
	        for (var i=0, len=this.listeners.events_ar.length; i < len; i++){
	        	if(this.listeners.events_ar[i].target === this && this.listeners.events_ar[i].type === type){		
	    	        if(props){
	    	        	for(var prop in props){
	    	        		this.listeners.events_ar[i][prop] = props[prop];
	    	        	}
	    	        }
	        		this.listeners.events_ar[i].listener.call(this, this.listeners.events_ar[i]);
	        	}
	        }
	    };
	    
	    _s.removeListener = function(type, listener){
	    	
	    	if(type == undefined) throw Error("type is required.");
	    	if(typeof type === "object") throw Error("type must be of type String.");
	    	if(typeof listener != "function") throw Error("listener must be of type Function." + type);
	    	
	        for (var i=0, len=this.listeners.events_ar.length; i < len; i++){
	        	if(this.listeners.events_ar[i].target === this 
	        			&& this.listeners.events_ar[i].type === type
	        			&& this.listeners.events_ar[i].listener ===  listener
	        	){
	        		this.listeners.events_ar.splice(i,1);
	        		break;
	        	}
	        }  
	    };
	    

	    //###########################################//
	    /* destroy methods*/
	    //###########################################//
		_s.disposeImage = function(){
			if(_s.type == "img") _s.screen.src = null;
		};
		
		
		_s.destroy = function(){
			if(_s.hasBeenSetSelectable_bl){
				_s.screen.ondragstart = null;
				_s.screen.onselectstart = null;
				_s.screen.ontouchstart = null;
			};
	
			//destroy properties
			_s.listeners = null;		
			_s.children_ar = null;
			_s.children_ar = null;

			_s = null;
		};
		
		
	    /* init */
		_s.init();
	};
	
	window.FWDEVPDO = FWDEVPDO;
}(window));/**
 * Easy Video Player PACKAGED v9.1
 * Embed window.
 *
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © 2006 All Rights Reserved.
 */
(function (window){
	
	var FWDEVPEmbedWindow = function(_d, prt){

		'use strict';
		
		var _s = this;
		var prototype = FWDEVPEmbedWindow.prototype;
		
		_s.embedColoseN_img = _d.embedColoseN_img;
		_s.embedWindowBackground_str = _d.embedWindowBackground_str;
		_s.embedWindowInputBackgroundPath_str = _d.embedWindowInputBackgroundPath_str;
		_s.secondaryLabelsColor_str = _d.secondaryLabelsColor_str;
		_s.inputColor_str = _d.inputColor_str;
		_s.mainLabelsColor_str = _d.mainLabelsColor_str;
		_s.sendButtonNPath_str = _d.sendButtonNPath_str;
		_s.sendButtonSPath_str = _d.sendButtonSPath_str;
		_s.inputBackgroundColor_str = _d.inputBackgroundColor_str;
		_s.borderColor_str = _d.borderColor_str;
		_s.sendToAFriendPath_str = _d.sendToAFriendPath_str;
		
		_s.maxTextWidth = 0;
		_s.totalWidth = 0;
		_s.sW = 0;
		_s.sH = 0;
		_s.buttonWidth = 44;
		_s.buttonHeight = 19;
		_s.embedWindowCloseButtonMargins = _d.embedWindowCloseButtonMargins;
		_s.shareAndEmbedTextColor_str = _d.shareAndEmbedTextColor_str;
		_s.isMobile_bl = FWDEVPUtils.isMobile;
		_s.useVectorIcons_bl = _d.useVectorIcons_bl
	
		//#################################//
		/* init */
		//#################################//
		this.init = function(){
			prt.main_do.addChild(_s);
			if(_s.closeButton_do) return;
		
			_s.setBackfaceVisibility();
			_s.mainHolder_do = new FWDEVPDO("div");
			_s.mainHolder_do.hasT3D = false;
			_s.mainHolder_do.hasT2D = false;
			_s.mainHolder_do.setBackfaceVisibility();
			
			_s.bk_do = new FWDEVPDO("div");
			_s.bk_do.style().width = "100%";
			_s.bk_do.style().height = "100%";
			_s.bk_do.setAlpha(.9);
			_s.bk_do.style().background = "url('" + _s.embedWindowBackground_str + "')";

			//setup link and embed text
			_s.linkAndEmbedHolder_do =  new FWDEVPDO("div");
			_s.linkAndEmbedHolderBk_do = new FWDEVPDO("div");
			_s.linkAndEmbedHolderBk_do.style().background = "url('" + _s.embedWindowBackground_str + "')";
			_s.linkAndEmbedHolderBk_do.style().borderStyle = "solid";
			_s.linkAndEmbedHolderBk_do.style().borderWidth = "1px";
			_s.linkAndEmbedHolderBk_do.style().borderColor =  _s.borderColor_str;
			
			_s.mainLbl = new FWDEVPDO("div");
			_s.mainLbl.setBackfaceVisibility();
			_s.mainLbl.style().fontFamily = "Arial";
			_s.mainLbl.style().fontSize= "12px";
			_s.mainLbl.style().color = _s.mainLabelsColor_str;
			_s.mainLbl.style().whiteSpace= "nowrap";
			_s.mainLbl.style().fontSmoothing = "antialiased";
			_s.mainLbl.style().webkitFontSmoothing = "antialiased";
			_s.mainLbl.style().textRendering = "optimizeLegibility";
			_s.mainLbl.style().padding = "0px";
			_s.mainLbl.screen.className = 'EVP-main-label';
			_s.mainLbl.setInnerHTML("SHARE & EMBED");	
			
			_s.linkLbl = new FWDEVPDO("div");
			_s.linkLbl.screen.className = 'EVP-secnd-label';
			_s.linkLbl.setBackfaceVisibility();
			_s.linkLbl.style().fontFamily = "Arial";
			_s.linkLbl.style().fontSize= "12px";
			_s.linkLbl.style().color = _s.secondaryLabelsColor_str;
			_s.linkLbl.style().whiteSpace= "nowrap";
			_s.linkLbl.style().fontSmoothing = "antialiased";
			_s.linkLbl.style().webkitFontSmoothing = "antialiased";
			_s.linkLbl.style().textRendering = "optimizeLegibility";
			_s.linkLbl.style().padding = "0px";
			_s.linkLbl.setInnerHTML("Link to this video:");	
			
			_s.linkTxt = new FWDEVPDO("div");
			_s.linkTxt.screen.className = 'EVP-embed-inpt';
			_s.linkTxt.setBackfaceVisibility();
			_s.linkTxt.style().fontFamily = "Arial";
			_s.linkTxt.style().fontSize= "12px";
			_s.linkTxt.style().color = _s.shareAndEmbedTextColor_str;
			if(!FWDEVPUtils.isIEAndLessThen9) _s.linkTxt.style().wordBreak = "break-all";
			_s.linkTxt.style().fontSmoothing = "antialiased";
			_s.linkTxt.style().webkitFontSmoothing = "antialiased";
			_s.linkTxt.style().textRendering = "optimizeLegibility";
			_s.linkTxt.style().padding = "6px";
			_s.linkTxt.style().paddingTop = "4px";
			_s.linkTxt.style().paddingBottom = "4px";
			_s.linkTxt.style().backgroundColor = _s.inputBackgroundColor_str;
			_s.linkTxt.screen.onclick = selectText;
			
			_s.embedLbl = new FWDEVPDO("div");
			_s.embedLbl.screen.className = 'EVP-secnd-label';
			_s.embedLbl.setBackfaceVisibility();
			_s.embedLbl.style().fontFamily = "Arial";
			_s.embedLbl.style().fontSize= "12px";
			_s.embedLbl.style().color = _s.secondaryLabelsColor_str;
			_s.embedLbl.style().whiteSpace= "nowrap";
			_s.embedLbl.style().fontSmoothing = "antialiased";
			_s.embedLbl.style().webkitFontSmoothing = "antialiased";
			_s.embedLbl.style().textRendering = "optimizeLegibility";
			_s.embedLbl.style().padding = "0px";
			_s.embedLbl.setInnerHTML("Embed this video:");
			
			_s.embdTxt = new FWDEVPDO("div");
			_s.embdTxt.screen.className = 'EVP-embed-inpt';
			_s.embdTxt.setBackfaceVisibility();
			if(!FWDEVPUtils.isIEAndLessThen9) _s.embdTxt.style().wordBreak = "break-all";
			_s.embdTxt.style().fontFamily = "Arial";
			_s.embdTxt.style().fontSize= "12px";
			_s.embdTxt.style().lineHeight = "16px";
			_s.embdTxt.style().color = _s.shareAndEmbedTextColor_str;
			_s.embdTxt.style().fontSmoothing = "antialiased";
			_s.embdTxt.style().webkitFontSmoothing = "antialiased";
			_s.embdTxt.style().textRendering = "optimizeLegibility";
			_s.embdTxt.style().backgroundColor = _s.inputBackgroundColor_str;
			_s.embdTxt.style().padding = "6px";
			_s.embdTxt.style().paddingTop = "4px";
			_s.embdTxt.style().paddingBottom = "4px";
			_s.embdTxt.screen.onclick = selectText;
		
			//setup flash buttons
			FWDEVPSimpleSizeButton.setPrototype();
			_s.copyLinkButton_do = new FWDEVPSimpleSizeButton(
					_d.embedCopyButtonNPath_str,
					_d.embedCopyButtonSPath_str,
					_s.buttonWidth,
					_s.buttonHeight,
					_d.useHEX,
					_d.nBC,
					_d.sBC,
					true
			);
			_s.copyLinkButton_do.screen.style.position = 'absolute';
			_s.copyLinkButton_do.addListener(FWDEVPSimpleSizeButton.CLICK, function(){
				_s.copyToClipboard(_s.linkTxt.screen);
			});

			FWDEVPSimpleSizeButton.setPrototype();
			_s.copyEmbedBtn = new FWDEVPSimpleSizeButton(
					_d.embedCopyButtonNPath_str,
					_d.embedCopyButtonSPath_str,
					_s.buttonWidth,
					_s.buttonHeight,
					_d.useHEX,
					_d.nBC,
					_d.sBC,
					true
			);
			_s.copyEmbedBtn.screen.style.position = 'absolute';
			_s.copyEmbedBtn.addListener(FWDEVPSimpleSizeButton.CLICK,function(){
				_s.copyToClipboard(_s.embdTxt.screen);
			});

			//setup send to a friend
			_s.sendMainHolder_do =  new FWDEVPDO("div");
			
			_s.sendMainHldBk = new FWDEVPDO("div");
			_s.sendMainHldBk.style().background = "url('" + _s.embedWindowBackground_str + "')";
			_s.sendMainHldBk.style().borderStyle = "solid";
			_s.sendMainHldBk.style().borderWidth = "1px";
			_s.sendMainHldBk.style().borderColor =  _s.borderColor_str;
			
			_s.sendMainLbl = new FWDEVPDO("div");
			_s.sendMainLbl.setBackfaceVisibility();
			_s.sendMainLbl.style().fontFamily = "Arial";
			_s.sendMainLbl.style().fontSize= "12px";
			_s.sendMainLbl.style().color = _s.mainLabelsColor_str;
			_s.sendMainLbl.style().whiteSpace= "nowrap";
			_s.sendMainLbl.style().padding = "0px";
			_s.sendMainLbl.screen.className = 'EVP-main-label';
			_s.sendMainLbl.setInnerHTML("SEND TO A FRIEND");	
			
			_s.yourEmailLabel_do = new FWDEVPDO("div");
			_s.yourEmailLabel_do.screen.className = 'EVP-secnd-label';
			_s.yourEmailLabel_do.setBackfaceVisibility();
			_s.yourEmailLabel_do.style().fontFamily = "Arial";
			_s.yourEmailLabel_do.style().fontSize= "12px";
			_s.yourEmailLabel_do.style().color = _s.secondaryLabelsColor_str;
			_s.yourEmailLabel_do.style().whiteSpace= "nowrap";
			_s.yourEmailLabel_do.style().padding = "0px";
			_s.yourEmailLabel_do.setInnerHTML("Your email:");
			
			_s.yourEmailInpt = new FWDEVPDO("input");
			_s.yourEmailInpt.screen.className = 'EVP-embed-inpt';
			_s.yourEmailInpt.setBackfaceVisibility();
			_s.yourEmailInpt.style().fontFamily = "Arial";
			_s.yourEmailInpt.style().fontSize= "12px";
			_s.yourEmailInpt.style().backgroundColor = _s.inputBackgroundColor_str;
			_s.yourEmailInpt.style().color = _s.inputColor_str;
			_s.yourEmailInpt.style().outline = 0;
			_s.yourEmailInpt.style().whiteSpace= "nowrap";
			_s.yourEmailInpt.style().padding = "6px";
			_s.yourEmailInpt.style().paddingTop = "4px";
			_s.yourEmailInpt.style().paddingBottom = "4px";
			
			_s.friendEmailLbl = new FWDEVPDO("div");
			_s.friendEmailLbl.screen.className = 'EVP-secnd-label';
			_s.friendEmailLbl.setBackfaceVisibility();
			_s.friendEmailLbl.style().fontFamily = "Arial";
			_s.friendEmailLbl.style().fontSize= "12px";
			_s.friendEmailLbl.style().color = _s.secondaryLabelsColor_str;
			_s.friendEmailLbl.style().whiteSpace= "nowrap";
			_s.friendEmailLbl.style().padding = "0px";
			_s.friendEmailLbl.setInnerHTML("Your friend's email:");
			
			_s.friendEmailInpt = new FWDEVPDO("input");
			_s.friendEmailInpt.screen.className = 'EVP-embed-inpt';
			_s.friendEmailInpt.setBackfaceVisibility();
			_s.friendEmailInpt.style().fontFamily = "Arial";
			_s.friendEmailInpt.style().fontSize= "12px";
			_s.friendEmailInpt.style().backgroundColor = _s.inputBackgroundColor_str;
			_s.friendEmailInpt.style().color = _s.inputColor_str;
			_s.friendEmailInpt.style().outline= 0;
			_s.friendEmailInpt.style().whiteSpace= "nowrap";
			_s.friendEmailInpt.style().padding = "6px";
			_s.friendEmailInpt.style().paddingTop = "4px";
			_s.friendEmailInpt.style().paddingBottom = "4px";	
			
			FWDEVPSimpleSizeButton.setPrototype();
			_s.sndBtn = new FWDEVPSimpleSizeButton(
					_s.sendButtonNPath_str, 
					_s.sendButtonSPath_str,
					_s.buttonWidth,
					_s.buttonHeight,
					_d.useHEX,
					_d.nBC,
					_d.sBC,
					true
					);
			_s.sndBtn.addListener(FWDEVPSimpleSizeButton.CLICK, _s.sendClickHandler);
					
			_s.infoText_do = new FWDEVPDO("div");
			_s.infoText_do.setBackfaceVisibility();
			_s.infoText_do.style().fontFamily = "Arial";
			_s.infoText_do.style().fontSize= "12px";
			_s.infoText_do.style().color = _s.secondaryLabelsColor_str;
			_s.infoText_do.style().whiteSpace= "nowrap";
			_s.infoText_do.style().fontSmoothing = "antialiased";
			_s.infoText_do.style().webkitFontSmoothing = "antialiased";
			_s.infoText_do.style().textRendering = "optimizeLegibility";
			_s.infoText_do.style().padding = "0px";
			_s.infoText_do.style().paddingTop = "4px";
			_s.infoText_do.style().textAlign = "center";
			_s.infoText_do.style().color = _s.mainLabelsColor_str;
		
			//setup close button
			if(_s.useVectorIcons_bl){
				FWDEVPSimpleButton.setPrototype();
				FWDEVPUtils.smpBtnNPos();
				var ic = prt.fontIcon +' ' + prt.fontIcon + '-close';
				_s.closeButton_do = new FWDEVPSimpleButton(
						undefined, undefined, undefined, true, undefined, undefined, undefined,
						"<div class='table-fwdevp-button'><span class='table-cell-fwdevp-button " + ic + "'></span></div>",
						undefined,
						"EVPCloseButtonNormalState",
						"EVPCloseButtonSelectedState"
				);
				
			}else{
				FWDEVPSimpleButton.setPrototype();
				_s.closeButton_do = new FWDEVPSimpleButton(_d.embedClooseN_img, _d.embedWindowClosePathS_str, undefined,
						true,
						_d.useHEX,
						_d.nBC,
						_d.sBC,
						false, false, false, false, true);
			}
			
			_s.closeButton_do.addListener(FWDEVPSimpleButton.MOUSE_UP, _s.closeButtonOnMouseUpHandler);
			
			_s.addChild(_s.mainHolder_do);
			_s.mainHolder_do.addChild(_s.bk_do);
			
			_s.linkAndEmbedHolder_do.addChild(_s.linkAndEmbedHolderBk_do);
			_s.linkAndEmbedHolder_do.addChild(_s.mainLbl);
			_s.linkAndEmbedHolder_do.addChild(_s.linkLbl);
			_s.linkAndEmbedHolder_do.addChild(_s.linkTxt);
			_s.linkAndEmbedHolder_do.addChild(_s.embedLbl);
			_s.linkAndEmbedHolder_do.addChild(_s.embdTxt);
			_s.linkAndEmbedHolder_do.addChild(_s.copyLinkButton_do);
			_s.linkAndEmbedHolder_do.addChild(_s.copyEmbedBtn);
			
			_s.sendMainHolder_do.addChild(_s.sendMainHldBk);
			_s.sendMainHolder_do.addChild(_s.sendMainLbl);
			_s.sendMainHolder_do.addChild(_s.yourEmailLabel_do);
			_s.sendMainHolder_do.addChild(_s.yourEmailInpt);
			_s.sendMainHolder_do.addChild(_s.friendEmailLbl);
			_s.sendMainHolder_do.addChild(_s.friendEmailInpt);
			_s.sendMainHolder_do.addChild(_s.sndBtn);
			
			_s.mainHolder_do.addChild(_s.linkAndEmbedHolder_do);
			_s.mainHolder_do.addChild(_s.sendMainHolder_do);
			
			_s.mainHolder_do.addChild(_s.closeButton_do); 
		};
	
		this.closeButtonOnMouseUpHandler = function(){
			if(!_s.isShowed_bl) return;
			_s.hide();
		};

		this.copyToClipboard = function(element){
			  selectText(element);
			  document.execCommand("copy");
		}
	
		function selectText(element){
			if(window.top != window && FWDEVPUtils.isIE) return;
			if(!element) element = this;

			var range, selection;
			if (document.body.createTextRange) {
				range = document.body.createTextRange();
			    range.moveToElementText(element);
			    range.select();
			}else if(window.getSelection && document.createRange) {
			    selection = window.getSelection();
			    range = document.createRange();
			    range.selectNodeContents(element);
			    selection.removeAllRanges();
			    selection.addRange(range);
			}
		};
		
		this.positionAndResize = function(){
			_s.sW = prt.sW;
			_s.sH = prt.sH;
			
			_s.maxTextWidth = Math.min(_s.sW - 150, 500);
			_s.totalWidth = _s.maxTextWidth + _s.buttonWidth + 40;
			
			if(_s.isMobile_bl){
				_s.linkTxt.setWidth(_s.maxTextWidth + 52);
				_s.embdTxt.setWidth(_s.maxTextWidth + 52);
			}else{
				_s.linkTxt.setWidth(_s.maxTextWidth);
				_s.embdTxt.setWidth(_s.maxTextWidth);
			}
			
			_s.positionFinal();
			
			_s.closeButton_do.setX(_s.sW - _s.closeButton_do.w - _s.embedWindowCloseButtonMargins);
			_s.closeButton_do.setY(_s.embedWindowCloseButtonMargins);
			
			_s.setWidth(_s.sW);
			_s.setHeight(_s.sH);
			_s.mainHolder_do.setWidth(_s.sW);
			_s.mainHolder_do.setHeight(_s.sH);
		};
		
		this.positionFinal = function(){
			
			var totalHeight;
			var isEmbeddedAndFScreenOnIE11Bug_bl = false;
			
			if(_s.sH < 360 || _s.sW < 350){
				_s.linkTxt.style().whiteSpace= "nowrap";
				_s.embdTxt.style().whiteSpace= "nowrap";
			}else{
				_s.linkTxt.style().whiteSpace = "normal";
				_s.embdTxt.style().whiteSpace= "normal";
			}
			
			if(_s.linkLbl.screen.offsetHeight < 6) isEmbeddedAndFScreenOnIE11Bug_bl = true;
			
			var embedAndLinkMainLabelHeight;
			if(isEmbeddedAndFScreenOnIE11Bug_bl){
				embedAndLinkMainLabelHeight = Math.round(_s.mainLbl.screen.getBoundingClientRect().height * 100);
			}else{
				embedAndLinkMainLabelHeight = _s.mainLbl.getHeight();
			}
			_s.mainLbl.setX(16);
			_s.linkLbl.setX(16);
			_s.linkLbl.setY(embedAndLinkMainLabelHeight + 14);

			var linkTextLabelHeight;
			var linkTextHeight;
			if(isEmbeddedAndFScreenOnIE11Bug_bl){
				linkTextLabelHeight = Math.round(_s.linkLbl.screen.getBoundingClientRect().height * 100);
				linkTextHeight = Math.round(_s.linkTxt.screen.getBoundingClientRect().height * 100);
			}else{
				linkTextLabelHeight = _s.linkLbl.getHeight();
				linkTextHeight = _s.linkTxt.getHeight();
			}
			
			_s.linkTxt.setX(10);
			_s.linkTxt.setY(_s.linkLbl.y + linkTextLabelHeight + 5);
			if(_s.isMobile_bl){
				_s.copyLinkButton_do.setX(-100);
			}else{
				_s.copyLinkButton_do.setX(_s.maxTextWidth + 30);
			}
			
			_s.copyLinkButton_do.setY(_s.linkTxt.y + linkTextHeight - _s.buttonHeight);
			_s.embedLbl.setX(16);
			_s.embedLbl.setY(_s.copyLinkButton_do.y + _s.copyLinkButton_do.h + 14);
			
			var embedTextHeight;
			if(isEmbeddedAndFScreenOnIE11Bug_bl){
				embedTextHeight = Math.round(_s.embdTxt.screen.getBoundingClientRect().height * 100);
			}else{
				embedTextHeight = _s.embdTxt.getHeight();
			}
			_s.embdTxt.setX(10);
			_s.embdTxt.setY(_s.embedLbl.y + linkTextLabelHeight + 5);
			if(_s.isMobile_bl){
				_s.copyEmbedBtn.setX(-100);
			}else{
				_s.copyEmbedBtn.setX(_s.maxTextWidth + 30);
			}
			_s.copyEmbedBtn.setY(_s.embdTxt.y + embedTextHeight - _s.buttonHeight);
			_s.linkAndEmbedHolderBk_do.setY(_s.linkLbl.y - 9);
			_s.linkAndEmbedHolderBk_do.setWidth(_s.totalWidth - 2);
			_s.linkAndEmbedHolderBk_do.setHeight(_s.embdTxt.y + embedTextHeight - 9);
			_s.linkAndEmbedHolder_do.setWidth(_s.totalWidth);
			_s.linkAndEmbedHolder_do.setHeight(_s.embdTxt.y + embedTextHeight + 14);
			
			var sendMainLabelHeight;
			var inputHeight;
			if(isEmbeddedAndFScreenOnIE11Bug_bl){
				sendMainLabelHeight = Math.round(_s.sendMainLbl.screen.getBoundingClientRect().height * 100);
				inputHeight = Math.round(_s.yourEmailInpt.screen.getBoundingClientRect().height * 100);
			}else{
				sendMainLabelHeight = _s.sendMainLbl.getHeight();
				inputHeight = _s.yourEmailInpt.getHeight();
			}
			_s.sendMainLbl.setX(16);
			_s.yourEmailLabel_do.setX(16);
			_s.yourEmailLabel_do.setY(sendMainLabelHeight + 14);
			
			if(_s.sW > 400){
				_s.yourEmailInpt.setX(10);
				_s.yourEmailInpt.setWidth(parseInt(_s.totalWidth - 52 - _s.buttonWidth)/2);
				_s.yourEmailInpt.setY(_s.yourEmailLabel_do.y + linkTextLabelHeight + 5);
				
				_s.friendEmailLbl.setX(_s.yourEmailInpt.x + _s.yourEmailInpt.w + 26);
				_s.friendEmailLbl.setY(_s.yourEmailLabel_do.y);
				_s.friendEmailInpt.setX(_s.yourEmailInpt.x + _s.yourEmailInpt.w + 20);
				_s.friendEmailInpt.setWidth(parseInt((_s.maxTextWidth - 30)/2));
				_s.friendEmailInpt.setY(_s.yourEmailLabel_do.y + linkTextLabelHeight + 5);
				_s.sndBtn.setX(_s.friendEmailInpt.x + _s.yourEmailInpt.w + 10);
				_s.sndBtn.setY(_s.friendEmailInpt.y +inputHeight - _s.buttonHeight);
			}else{
				_s.yourEmailInpt.setX(10);
				_s.yourEmailInpt.setWidth(_s.totalWidth -32);
				_s.yourEmailInpt.setY(_s.yourEmailLabel_do.y + linkTextLabelHeight + 5);
				
				_s.friendEmailLbl.setX(16);
				_s.friendEmailLbl.setY(_s.yourEmailInpt.y + inputHeight + 14);
				_s.friendEmailInpt.setX(10);
				_s.friendEmailInpt.setY(_s.friendEmailLbl.y + linkTextLabelHeight + 5);
				_s.friendEmailInpt.setWidth(_s.totalWidth - 32);
				
				_s.sndBtn.setX(_s.totalWidth - _s.buttonWidth - 10);
				_s.sndBtn.setY(_s.friendEmailInpt.y + inputHeight + 10);
			}
			
			_s.sendMainHldBk.setY(_s.yourEmailLabel_do.y - 9);
			_s.sendMainHldBk.setWidth(_s.totalWidth - 2);
			_s.sendMainHldBk.setHeight(_s.sndBtn.y + _s.sndBtn.h - 9);
			_s.sendMainHolder_do.setWidth(_s.totalWidth);
			_s.sendMainHolder_do.setHeight(_s.sndBtn.y + _s.sndBtn.h + 14);
			
			if(isEmbeddedAndFScreenOnIE11Bug_bl){
				totalHeight = Math.round(_s.linkAndEmbedHolder_do.screen.getBoundingClientRect().height * 100 + _s.sendMainHolder_do.screen.getBoundingClientRect().height * 100);
			}else{
				totalHeight = _s.linkAndEmbedHolder_do.getHeight() + _s.sendMainHolder_do.getHeight();
			}
			
			
			_s.linkAndEmbedHolder_do.setX(parseInt((_s.sW - _s.totalWidth)/2));
			_s.linkAndEmbedHolder_do.setY(parseInt((_s.sH - totalHeight)/2) - 8);
			_s.sendMainHolder_do.setX(parseInt((_s.sW - _s.totalWidth)/2));
			if(isEmbeddedAndFScreenOnIE11Bug_bl){
				_s.sendMainHolder_do.setY(Math.round(_s.linkAndEmbedHolder_do.y + _s.linkAndEmbedHolder_do.screen.getBoundingClientRect().height * 100 + 20));
			}else{
				_s.sendMainHolder_do.setY(_s.linkAndEmbedHolder_do.y + _s.linkAndEmbedHolder_do.getHeight() + 20);
			}
		};
		

		//##############################################//
		/* Send email */
		//##############################################//
		this.sendClickHandler = function(){
			var hasError_bl = false;
			if(!_s.getValidEmail(_s.yourEmailInpt.screen.value)){
				if(FWDAnimation.isTweening(_s.yourEmailInpt.screen)) return;
				FWDAnimation.to(_s.yourEmailInpt.screen, .1, {css:{backgroundColor:'#FF0000'}, yoyo:true, repeat:3});
				hasError_bl = true;
			}
			if(!_s.getValidEmail(_s.friendEmailInpt.screen.value)){
				if(FWDAnimation.isTweening(_s.friendEmailInpt.screen)) return;
				FWDAnimation.to(_s.friendEmailInpt.screen, .1, {css:{backgroundColor:'#FF0000'}, yoyo:true, repeat:3});
				hasError_bl = true;
			}
			if(hasError_bl) return;
			_s.sendEmail();
		};
		

		//############ send email ####################//
		this.sendEmail = function(){
			if(_s.isSending_bl) return;
			_s.isSending_bl = true;
			_s.xhr = new XMLHttpRequest();
			_s.xhr.onreadystatechange = _s.onChange;
			_s.xhr.onerror = _s.ajaxOnErrorHandler;
			
			try{
				_s.xhr.open("get", _s.sendToAFriendPath_str + "?friendMail=" + _s.friendEmailInpt.screen.value + "&yourMail=" + _s.yourEmailInpt.screen.value + "&link=" + encodeURIComponent(_s.linkToVideo_str) , true);
				_s.xhr.send();
			}catch(e){
				_s.showInfo("ERROR", true);
				if(console) console.log(e);
				if(e.message) console.log(e.message);
			}
			_s.resetInputs();
		};
		
		this.ajaxOnErrorHandler = function(e){
			_s.showInfo("ERROR", true);
			try{
				if(window.console) console.log(e);
				if(window.console) console.log(e.message);
			}catch(e){};
			_s.isSending_bl = false;
		};
		
		this.onChange = function(response){
			if(_s.xhr.readyState == 4 && _s.xhr.status == 200){
				if(_s.xhr.responseText == "sent"){
					_s.showInfo("SENT");
				}else{
					_s.showInfo("ERROR", true);
					if(window.console) console.log("Error The server can't send the email!");
				}
				_s.isSending_bl = false;
			}
		};
		
		this.resetInputs = function(){
			_s.yourEmailInpt.screen.value = "";
			_s.friendEmailInpt.screen.value = "";
		};
	
		this.getValidEmail = function(email){
			var emailRegExp = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
			if(!emailRegExp.test(email) || email == "") return false;
			return true;
		};
		

		//#############################################//
		/* Set embed _d */
		//#############################################//
		this.setEmbedData = function(){
		
			var allUrl = location.href;
			var host = location.protocol + "//" + location.host;
			var pathName = location.pathname;
			var hash = location.hash;
			var search = location.search;
			var pathWithoutHashOrSearch = host + pathName;
		
			search = search.replace(/&?EVPInstanceName=.+/g, "");
			hash = hash.replace(/&?EVPInstanceName=.+/g, "");
			allUrl = allUrl.replace(/&?EVPInstanceName=.+/g, "");
			if(search == "?") search = null;
			
			if(search){
				if(hash){
					_s.finalEmbedPath_str = pathWithoutHashOrSearch + search + hash + "&EVPInstanceName=" + prt.instanceName_str;
					_s.linkToVideo_str = pathWithoutHashOrSearch + search + hash;
				}else{
					_s.finalEmbedPath_str = pathWithoutHashOrSearch + search + "&EVPInstanceName=" + prt.instanceName_str;
					_s.linkToVideo_str = pathWithoutHashOrSearch + search;
				}
			}else{
				if(hash){
					_s.finalEmbedPath_str = pathWithoutHashOrSearch + hash + "?EVPInstanceName=" + prt.instanceName_str;
					_s.linkToVideo_str = pathWithoutHashOrSearch + hash;
				}else{
					_s.finalEmbedPath_str = pathWithoutHashOrSearch + "?EVPInstanceName=" + prt.instanceName_str;
					_s.linkToVideo_str = pathWithoutHashOrSearch;
				}
			}
		
			_s.finalEmbedPath_str = encodeURI(_s.finalEmbedPath_str);
			_s.linkToVideo_str = encodeURI(_s.linkToVideo_str);	
			_s.finalEmbedCode_str = "<iframe src='" + _s.finalEmbedPath_str + "' width='" + prt.sW + "' height='" + prt.sH + "' frameborder='0' scrolling='no' allowfullscreen></iframe>";
		
			if(FWDEVPUtils.isIE){
				_s.linkTxt.screen.innerText = _s.linkToVideo_str;
				_s.embdTxt.screen.innerText = _s.finalEmbedCode_str;
			}else{
				_s.linkTxt.screen.textContent = _s.linkToVideo_str;
				_s.embdTxt.screen.textContent = _s.finalEmbedCode_str;
			}
		};	
		

		//#########################################//
		/* show hide info */
		//#########################################//
		this.showInfo = function(text, hasError){
				
			_s.infoText_do.setInnerHTML(text);
			_s.sendMainHolder_do.addChild(_s.infoText_do);
			_s.infoText_do.setWidth(_s.buttonWidth);
			_s.infoText_do.setHeight(_s.buttonHeight - 4);
			_s.infoText_do.setX(_s.sndBtn.x);
			_s.infoText_do.setY(_s.sndBtn.y - 23);

			_s.infoText_do.setAlpha(0);
			if(hasError){
				_s.infoText_do.style().color = "#FF0000";
			}else{
				_s.infoText_do.style().color = _s.mainLabelsColor_str;
			}
			FWDAnimation.killTweensOf(_s.infoText_do);
			FWDAnimation.to(_s.infoText_do, .16, {alpha:1, yoyo:true, repeat:7});
		};
		

		//###########################################//
		/* show / hide */
		//###########################################//
		this.show = function(id){
			if(_s.isShowed_bl) return;
			_s.isShowed_bl = true;
			prt.main_do.addChild(_s);
			_s.init();
			
			_s.resetInputs();
			_s.setEmbedData();
			if(!FWDEVPUtils.isMobile || (FWDEVPUtils.isMobile && FWDEVPUtils.hasPointerEvent)) prt.main_do.setSelectable(true);

			if(_s.useVectorIcons_bl){
				_s.checkButtonsId_to = setInterval(function(){
					
					if(_s.closeButton_do.w != 0){	
						_s.positionAndResize();
						
						clearInterval(_s.checkButtonsId_to);
						clearTimeout(_s.hideCompleteId_to);
						clearTimeout(_s.showCompleteId_to);
						_s.mainHolder_do.setY(- _s.sH);
						
						_s.showCompleteId_to = setTimeout(_s.showCompleteHandler, 900);
						setTimeout(function(){
							FWDAnimation.to(_s.mainHolder_do, .8, {y:0, delay:.1, ease:Expo.easeInOut});
						}, 100);
					
					}
				
				}, 50);
			}else{
				_s.positionAndResize();
			
				clearTimeout(_s.hideCompleteId_to);
				clearTimeout(_s.showCompleteId_to);
				_s.mainHolder_do.setY(- _s.sH);
				
				_s.showCompleteId_to = setTimeout(_s.showCompleteHandler, 900);
				setTimeout(function(){
					FWDAnimation.to(_s.mainHolder_do, .8, {y:0, delay:.1, ease:Expo.easeInOut});
				}, 100);
			}
		};
		
		this.showCompleteHandler = function(){};
		
		this.hide = function(){
			if(!_s.isShowed_bl) return;
			_s.isShowed_bl = false;
			
			if(prt.customContextMenu_do) prt.customContextMenu_do.enable();
			_s.positionAndResize();
			
			clearTimeout(_s.hideCompleteId_to);
			clearTimeout(_s.showCompleteId_to);
			
			if(!FWDEVPUtils.isMobile || (FWDEVPUtils.isMobile && FWDEVPUtils.hasPointerEvent)) prt.main_do.setSelectable(false);
			_s.hideCompleteId_to = setTimeout(_s.hideCompleteHandler, 800);
			FWDAnimation.killTweensOf(_s.mainHolder_do);
			FWDAnimation.to(_s.mainHolder_do, .8, {y:-_s.sH, ease:Expo.easeInOut});
		};
		
		this.hideCompleteHandler = function(){
			prt.main_do.removeChild(_s);
			_s.dispatchEvent(FWDEVPEmbedWindow.HIDE_COMPLETE);
		};
	
		if(_d.useHEX){
			_s.init();
		}
	};
		
		
	/* set prototype */
	FWDEVPEmbedWindow.setPrototype = function(){
		FWDEVPEmbedWindow.prototype = new FWDEVPDO("div");
	};
	
	FWDEVPEmbedWindow.ERROR = "error";
	FWDEVPEmbedWindow.HIDE_COMPLETE = "hideComplete";
	
	FWDEVPEmbedWindow.prototype = null;
	window.FWDEVPEmbedWindow = FWDEVPEmbedWindow;
}(window));/**
 * Easy Video Player PACKAGED v9.1
 * Event dispatcher.
 *
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © 2006 All Rights Reserved.
 */
(function (){
	
	var FWDEVPEventDispatcher = function (){

		'use strict';
		
	    this.listeners = {events_ar:[]};
	     
	    this.addListener = function (type, listener){
	    	
	    	if(type == undefined) throw Error("type is required.");
	    	if(typeof type === "object") throw Error("type must be of type String.");
	    	if(typeof listener != "function") throw Error("listener must be of type Function.");
	    	
	    	
	        var event = {};
	        event.type = type;
	        event.listener = listener;
	        event.target = this;
	        this.listeners.events_ar.push(event);
	    };
	    
	    this.dispatchEvent = function(type, props){
	    	if(this.listeners == null) return;
	    	if(type == undefined) throw Error("type is required.");
	    	if(typeof type === "object") throw Error("type must be of type String.");
	    	
	        for (var i=0, len=this.listeners.events_ar.length; i < len; i++){
	        	if(this.listeners.events_ar[i].target === this && this.listeners.events_ar[i].type === type){		
	    	        if(props){
	    	        	for(var prop in props){
	    	        		this.listeners.events_ar[i][prop] = props[prop];
	    	        	}
	    	        }
	        		this.listeners.events_ar[i].listener.call(this, this.listeners.events_ar[i]);
	        	}
	        }
	    };
	    
	   this.removeListener = function(type, listener){
	    	
	    	if(type == undefined) throw Error("type is required.");
	    	if(typeof type === "object") throw Error("type must be of type String.");
	    	if(typeof listener != "function") throw Error("listener must be of type Function." + type);
	    	
	        for (var i=0, len=this.listeners.events_ar.length; i < len; i++){
	        	if(this.listeners.events_ar[i].target === this 
	        			&& this.listeners.events_ar[i].type === type
	        			&& this.listeners.events_ar[i].listener ===  listener
	        	){
	        		this.listeners.events_ar.splice(i,1);
	        		break;
	        	}
	        }  
	    };
	    
	    /* destroy */
	    this.destroy = function(){
	    	this.listeners = null;
	    	
	    	this.addListener = null;
		    this.dispatchEvent = null;
		    this.removeListener = null;
	    };
	    
	};	
	
	window.FWDEVPEventDispatcher = FWDEVPEventDispatcher;
}(window));/* hider */
(function (window){
	
    var FWDEVPHider = function(screenToTest, screenToTest2, hideDelay){

    	'use strict';
    	
    	var _s = this;
    	var prototype = FWDEVPHider.prototype;
   
    	_s.screenToTest = screenToTest;
    	_s.screenToTest2 = screenToTest2;
    	_s.hideDelay = hideDelay;
    	_s.globalX = 0;
    	_s.globalY = 0;

       	_s.dispatchOnceShow_bl = true;

    	_s.isStopped_bl = true;
    	_s.isMbl = FWDEVPUtils.isMobile;
    	_s.hasPointerEvent_bl = FWDEVPUtils.hasPointerEvent;
    	
		_s.init = function(){};
	
		_s.start = function(){
			_s.currentTime = new Date().getTime();
			clearInterval(_s.checkIntervalId_int);
			_s.checkIntervalId_int = setInterval(_s.update, 100);
			_s.addMouseOrTouchCheck();
			_s.isStopped_bl = false;
		};
		
		_s.stop = function(){
			clearInterval(_s.checkIntervalId_int);
			_s.isStopped_bl = true;
			_s.removeMouseOrTouchCheck();
			_s.removeMouseOrTouchCheck2();
		};
		
		_s.addMouseOrTouchCheck = function(){	
			if(_s.hasInitialTestEvents_bl) return;
			_s.hasInitialTestEvents_bl = true;
			if(_s.isMbl){
				if(_s.hasPointerEvent_bl){
					_s.screenToTest.screen.addEventListener("pointerdown", _s.onMTU);
					_s.screenToTest.screen.addEventListener("MSPointerMove", _s.onMTU);
				}else{
					_s.screenToTest.screen.addEventListener("touchstart", _s.onMTU);
				}
			}else if(window.addEventListener){
				window.addEventListener("mousemove", _s.onMTU);
			}else if(document.attachEvent){
				document.attachEvent("onmousemove", _s.onMTU);
			}
		};
		
		_s.removeMouseOrTouchCheck = function(){	
			if(!_s.hasInitialTestEvents_bl) return;
			_s.hasInitialTestEvents_bl = false;
			if(_s.isMbl){
				if(_s.hasPointerEvent_bl){
					_s.screenToTest.screen.removeEventListener("pointerdown", _s.onMTU);
					_s.screenToTest.screen.removeEventListener("MSPointerMove", _s.onMTU);
				}else{
					_s.screenToTest.screen.removeEventListener("touchstart", _s.onMTU);
				}
			}else if(window.removeEventListener){
				window.removeEventListener("mousemove", _s.onMTU);
			}else if(document.detachEvent){
				document.detachEvent("onmousemove", _s.onMTU);
			}
		};
		
		_s.addMouseOrTouchCheck2 = function(){	
			if(_s.addSecondTestEvents_bl) return;
			_s.addSecondTestEvents_bl = true;
			if(_s.screenToTest.screen.addEventListener){
				_s.screenToTest.screen.addEventListener("mousemove", _s.onSecondTest);
			}else if(_s.screenToTest.screen.attachEvent){
				_s.screenToTest.screen.attachEvent("onmousemove", _s.onSecondTest);
			}
		};
		
		_s.removeMouseOrTouchCheck2 = function(){	
			if(!_s.addSecondTestEvents_bl) return;
			_s.addSecondTestEvents_bl = false;
			if(_s.screenToTest.screen.removeEventListener){
				_s.screenToTest.screen.removeEventListener("mousemove", _s.onSecondTest);
			}else if(_s.screenToTest.screen.detachEvent){
				_s.screenToTest.screen.detachEvent("onmousemove", _s.onSecondTest);
			}
		};
		
		_s.onSecondTest = function(){
			_s.removeMouseOrTouchCheck2();
			_s.addMouseOrTouchCheck();
		};
		
		_s.onMTU = function(e){
			var vc = FWDEVPUtils.getViewportMouseCoordinates(e);	
			
			if(_s.globalX != vc.screenX
			   && _s.globalY != vc.screenY){
				_s.currentTime = new Date().getTime();
			}
			
			_s.globalX = vc.screenX;
			_s.globalY = vc.screenY;
			
			if(!_s.isMbl){
				if(!FWDEVPUtils.hitTest(_s.screenToTest.screen, _s.globalX, _s.globalY)){
					_s.removeMouseOrTouchCheck();
					_s.addMouseOrTouchCheck2();
				}
			}
		};
	
		_s.update = function(e){
			if(new Date().getTime() > _s.currentTime + _s.hideDelay){
				if(_s.dispatchOnceShow_bl){	
					_s.dispatchOnceHide_bl = true;
					_s.dispatchOnceShow_bl = false;	
					_s.dispatchEvent(FWDEVPHider.HIDE);
					clearTimeout(_s.hideCompleteId_to);
					_s.hideCompleteId_to = setTimeout(function(){
						_s.dispatchEvent(FWDEVPHider.HIDE_COMPLETE);
					}, 1000);
				}
			}else{
				if(_s.dispatchOnceHide_bl){
					clearTimeout(_s.hideCompleteId_to);
					_s.dispatchOnceHide_bl = false;
					_s.dispatchOnceShow_bl = true;
					_s.dispatchEvent(FWDEVPHider.SHOW);
				}
			}
		};

		_s.reset = function(){
			clearTimeout(_s.hideCompleteId_to);
			_s.currentTime = new Date().getTime();
			_s.dispatchEvent(FWDEVPHider.SHOW);
		};
		
		
		/* destroy */
		_s.destroy = function(){
		
			_s.removeMouseOrTouchCheck();
			clearInterval(_s.checkIntervalId_int);
			prototype.destroy();
			prototype = null;
			_s = null;
			FWDEVPHider.prototype = null;
		};
		
		_s.init();
     };
     
	 FWDEVPHider.HIDE = "hide";
	 FWDEVPHider.SHOW = "show";
	 FWDEVPHider.HIDE_COMPLETE = "hideComplete";
	 
	 FWDEVPHider.setPrototype = function(){
		 FWDEVPHider.prototype = new FWDEVPEventDispatcher();
	 };
	 

	 window.FWDEVPHider = FWDEVPHider;
}(window));/* Info screen */
(function (window){
	
	var FWDEVPInfo = function(prt, warningIconPath, showErrorInfo){

		'use strict';
		
		var _s = this;
		var prototype = FWDEVPInfo.prototype;
		
		_s.warningIconPath_str = warningIconPath;	
		_s.showErrorInfo_bl = showErrorInfo;
	
		
		//#################################//
		/* init */
		//#################################//
		this.init = function(){
			_s.setResizableSizeAfterParent();
			
			_s.bk_do = new FWDEVPDO("div");
			_s.bk_do.setAlpha(.2);
			_s.bk_do.setBkColor("#000000");
			_s.addChild(_s.bk_do);
			
			_s.textHolder_do = new FWDEVPDO("div");
			if(!FWDEVPUtils.isIEAndLessThen9) _s.textHolder_do.style().font = "Arial";
			_s.textHolder_do.style().wordWrap = "break-word";
			_s.textHolder_do.style().padding = "10px";
			_s.textHolder_do.style().paddingLeft = "42px";
			_s.textHolder_do.style().lineHeight = "18px";
			_s.textHolder_do.style().color = "#000000";
			_s.textHolder_do.setBkColor("#EEEEEE");
			
			var img_img = new Image();
			img_img.src = this.warningIconPath_str;
			this.img_do = new FWDEVPDO("img");
			this.img_do.setScreen(img_img);
			this.img_do.setWidth(28);
			this.img_do.setHeight(28);
			
			_s.addChild(_s.textHolder_do);
			_s.addChild(_s.img_do);
		};
		
		this.showText = function(txt){
			
			if(!_s.isShowedOnce_bl){
				if(_s.hasPointerEvent_bl){
					_s.screen.addEventListener("pointerdown", _s.closeWindow);
				}else{
					_s.screen.addEventListener("click", _s.closeWindow);
					_s.screen.addEventListener("touchend", _s.closeWindow);
				}
				_s.isShowedOnce_bl = true;
			}
			
			_s.setVisible(false);
			
			_s.textHolder_do.style().paddingBottom = "10px";
			_s.textHolder_do.setInnerHTML(txt);
			
			
			clearTimeout(_s.show_to);
			_s.show_to = setTimeout(_s.show, 60);
			setTimeout(function(){
				_s.positionAndResize();
			}, 10);
		};
		
		this.show = function(){
			var finalW = Math.min(640, prt.sW - 120);
			_s.isShowed_bl = true;
		
			_s.textHolder_do.setWidth(finalW);
			setTimeout(function(){
				if(_s.showErrorInfo_bl)_s.setVisible(true);
				_s.positionAndResize();
			}, 100);
		};
		
		this.positionAndResize = function(){
			
			var finalW = _s.textHolder_do.getWidth();
			var finalH = _s.textHolder_do.getHeight();
			var finalX = parseInt((prt.sW - finalW)/2);
			var finalY = parseInt((prt.sH - finalH)/2);
			
			_s.bk_do.setWidth(prt.sW);
			_s.bk_do.setHeight(prt.sH);
			_s.textHolder_do.setX(finalX);
			_s.textHolder_do.setY(finalY);
			
			_s.img_do.setX(finalX + 6);
			_s.img_do.setY(finalY + parseInt((_s.textHolder_do.getHeight() - _s.img_do.h)/2));
		};
		
		this.closeWindow = function(){
			_s.isShowed_bl = false;
			clearTimeout(_s.show_to);
			try{prt.main_do.removeChild(_s);}catch(e){}
		};
		
		this.init();
	};
		
		
	/* set prototype */
	FWDEVPInfo.setPrototype = function(){
		FWDEVPInfo.prototype = new FWDEVPDO("div", "relative");
	};
	
	FWDEVPInfo.prototype = null;
	window.FWDEVPInfo = FWDEVPInfo;
}(window));/**
 * Easy Video Player PACKAGED v9.1
 * Vanila javascript video player.
 *
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © 2006 All Rights Reserved.
 */
(function (window){
	
	var FWDEVPlayer = function(props){

		'use strict';
		
		FWDEVPlayer.V = '8.4';
		var _s = this;
	
		_s.props = props;
		_s.isInstantiate_bl = false;
		_s.displayType = props.displayType || FWDEVPlayer.RESPONSIVE;
		_s.delayPoster = !props.delayPoster;
		
		if(_s.displayType.toLowerCase() != FWDEVPlayer.RESPONSIVE 
		   && _s.displayType.toLowerCase() != FWDEVPlayer.FULL_SCREEN
		   && _s.displayType.toLowerCase() != FWDEVPlayer.AFTER_PARENT
		   && _s.displayType.toLowerCase() != FWDEVPlayer.STICKY
		   && _s.displayType.toLowerCase() != FWDEVPlayer.LIGHTBOX
		){
			_s.displayType = FWDEVPlayer.RESPONSIVE;
		}
		
		if(props.displayType.toLowerCase() == FWDEVPlayer.BACKGROUND_VIDEO){
			_s.displayType = FWDEVPlayer.BACKGROUND_VIDEO;
		}
		
		_s.displayType = _s.displayType.toLowerCase();

		if(FWDEVPlayer.videoStartBehaviour != "pause" 
			&& FWDEVPlayer.videoStartBehaviour != "stop"
			&& FWDEVPlayer.videoStartBehaviour != "default"
		){
			FWDEVPlayer.videoStartBehaviour = "pause";
		}

		_s.stickyOnScroll = props.stickyOnScroll || "no";
		_s.stickyOnScroll = _s.stickyOnScroll == "yes" ? true : false;
		if(_s.displayType != FWDEVPlayer.RESPONSIVE) _s.stickyOnScroll = false;
		_s.isMinShowed = true;
		
		_s.stickyOnScrollWidth = props.stickyOnScrollWidth || 700;
		_s.stickyOnScrollHeight = props.stickyOnScrollHeight || 394; 

		_s.fontIcon = props.fontIcon || 'fwdicon';

		_s.maxWidth = props.maxWidth || 640;
		_s.maxHeight = props.maxHeight || 380;
	
		_s.showPreloader_bl = props.showPreloader; 
		_s.showPreloader_bl = _s.showPreloader_bl == "no" ? false : true;
	
		_s.disableDoubleClickFullscreen_bl = props.disableDoubleClickFullscreen || "no"; 
		_s.disableDoubleClickFullscreen_bl = _s.disableDoubleClickFullscreen_bl == "yes" ? true : false;
			
		_s.mainFolderPath_str = props.mainFolderPath;
		if((_s.mainFolderPath_str.lastIndexOf("/") + 1) != _s.mainFolderPath_str.length){
			_s.mainFolderPath_str += "/";
		}
		
		_s.sknPth = props.skinPath;
		if((_s.sknPth.lastIndexOf("/") + 1) != _s.sknPth.length){
			_s.sknPth += "/";
		}
		
		_s.warningIconPath_str = _s.mainFolderPath_str + _s.sknPth + "warningIcon.png";
		_s.fillEntireVideoScreen_bl = false;
		_s.isShowedFirstTime_bl = true;
		FWDEVPlayer.instaces_ar.push(this);
	

		/* init */
		_s.init = function(){
			
			if(_s.isInstantiate_bl) return;
			
			FWDTweenLite.ticker.useRAF(true);
			_s.props = props;
			
			_s.instanceName_str = _s.props.instanceName;
			
			_s.mustHaveHolderDiv_bl = false;
			
			if(!_s.instanceName_str){
				alert("FWDEVPlayer instance name is requires please make sure that the instanceName parameter exsists and it's value is uinique.");
				return;
			}
			
			if(window[_s.instanceName_str]){
				alert("FWDEVPlayer instance name " + _s.instanceName_str +  " is already defined and contains a different instance reference, set a different instance name.");
				return;
			}else{
				window[_s.instanceName_str] = this;
			}
		
			if(!_s.props){
				alert("FWDEVPlayer constructor properties object is not defined!");
				return;
			}
			
			if(!_s.props.parentId){		
				alert("Property parentId is not defined in the FWDEVPlayer constructor, _s property represents the div id into which the megazoom is added as a child!");
				return;
			}
			
			if(_s.displayType == FWDEVPlayer.RESPONSIVE || _s.displayType == FWDEVPlayer.AFTER_PARENT) _s.mustHaveHolderDiv_bl = true;
		
			if(_s.mustHaveHolderDiv_bl && !FWDEVPUtils.getChildById(_s.props.parentId)){
				alert("FWDEVPlayer holder div is not found, please make sure that the div exsists and the id is correct! " + _s.props.parentId);
				return;
			}
			
			var args = FWDEVPUtils.getUrlArgs(window.location.search);
			var embedTest = args.EVPInstanceName;
			
			if(_s.instanceName_str == embedTest){
				FWDEVPlayer.isEmbedded_bl = true;
				_s.isEmbedded_bl = true;
			}
			
			_s.position_str = _s.props.verticalPosition;
			if(!_s.position_str) _s.position_str = FWDEVPlayer.POSITION_TOP;
			if(_s.position_str == "bottom"){
				_s.position_str = FWDEVPlayer.POSITION_BOTTOM;
			}else{
				_s.position_str = FWDEVPlayer.POSITION_TOP;
			}
			
			_s.horizontalPosition_str = _s.props.horizontalPosition;
			if(!_s.horizontalPosition_str) _s.horizontalPosition_str = FWDEVPlayer.CENTER;
			if(_s.horizontalPosition_str == "center"){
				_s.horizontalPosition_str = FWDEVPlayer.CENTER;
			}else if(_s.horizontalPosition_str == "left"){
				_s.horizontalPosition_str = FWDEVPlayer.LEFT;
			}else if(_s.horizontalPosition_str == "right"){
				_s.horizontalPosition_str = FWDEVPlayer.RIGHT;
			}else{
				_s.horizontalPosition_str = FWDEVPlayer.CENTER;
			}
			
			_s.isShowed_bl = _s.props.showPlayerByDefault; 
			_s.isShowed_bl = _s.isShowed_bl == "no" ? false : true;
			
			_s.preloaderBackgroundColor = _s.props.preloaderBackgroundColor || "#000000";
			_s.preloaderFillColor = _s.props.preloaderFillColor || "#FFFFFF";
			_s.offsetX = parseInt(props.offsetX) || 0;
			_s.offsetY = parseInt(props.offsetY) || 0
		
			if(_s.isEmbedded_bl) _s.displayType = FWDEVPlayer.FULL_SCREEN;
			
			_s.body = document.getElementsByTagName("body")[0];
			_s.stageContainer = null;
			
			if(_s.displayType == FWDEVPlayer.STICKY){
				_s.stageContainer = document.createElement("div");
				_s.stageContainer.style.position = "fixed";
				_s.stageContainer.style.width = "100%";
				_s.stageContainer.style.zIndex = "999999";
				_s.stageContainer.style.height = "0px";
			
				document.documentElement.appendChild(_s.stageContainer);
				_s.stageContainer.style.overflow = "visible";
				
			}else if(_s.displayType == FWDEVPlayer.FULL_SCREEN || _s.displayType == FWDEVPlayer.BACKGROUND_VIDEO || _s.displayType == FWDEVPlayer.LIGHTBOX){
				_s.stageContainer = document.documentElement;
			}else{
				_s.stageContainer = FWDEVPUtils.getChildById(_s.props.parentId);
			}

			_s.listeners = {events_ar:[]};
			
			_s.lightBoxBackgroundOpacity = _s.props.lightBoxBackgroundOpacity || 1;
			_s.lightBoxBackgroundColor_str = _s.props.lightBoxBackgroundColor || "transparent";
			_s.lightBoxWidth = _s.props.maxWidth || 500;
			_s.lightBoxHeight =  _s.props.maxHeight || 400;
			
			_s.backgroundColor_str = _s.props.backgroundColor || "transparent";
			_s.videoBackgroundColor_str = "#000000";
			_s.flashObjectMarkup_str =  null;
			_s.controllerHeight = parseInt(_s.props.controllerHeight) || 70;
			_s.lastX = 0;
			_s.lastY = 0;
			_s.sW = 0;
			_s.sH = 0;
			
			_s.posterPath_str = _s.props.posterPath;
			
			_s.autoScale_bl = _s.props.autoScale;
			_s.autoScale_bl = _s.autoScale_bl == "yes" ? true : false;
			_s.showErrorInfo_bl = _s.props.showErrorInfo; 
			_s.showErrorInfo_bl = _s.showErrorInfo_bl == "no" ? false : true;
			_s.isVideoPlayingWhenOpenWindows_bl = false;
			_s.useWithoutVideoScreen_bl = _s.props.useWithoutVideoScreen; 
			_s.useWithoutVideoScreen_bl = _s.useWithoutVideoScreen_bl == "yes" ? true : false;
			_s.totalTime = 100;

			_s.mainBackgroundImagePath_str = _s.props.mainBackgroundImagePath;
			if(_s.mainBackgroundImagePath_str && _s.mainBackgroundImagePath_str.length < 3) _s.mainBackgroundImagePath_str = undefined;
			_s.isMobile_bl = FWDEVPUtils.isMobile;
			_s.hasPointerEvent_bl = FWDEVPUtils.hasPointerEvent;
		
			_s.initializeOnlyWhenVisible_bl = _s.props.initializeOnlyWhenVisible; 
			_s.initializeOnlyWhenVisible_bl = _s.initializeOnlyWhenVisible_bl == "yes" ? true : false;
			
			_s.googleAnalyticsTrackingCode = _s.props.googleAnalyticsTrackingCode; 
			if(!window["ga"] && _s.googleAnalyticsTrackingCode){
				(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
				(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
				m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
				})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

				ga('create', _s.googleAnalyticsTrackingCode, 'auto');
				ga('send', 'pageview');
			}else if(window["ga"] && _s.googleAnalyticsTrackingCode){
				ga('create', _s.googleAnalyticsTrackingCode, 'auto');
				ga('send', 'pageview');
			}
		
			if(_s.displayType == FWDEVPlayer.LIGHTBOX){
				_s.setupLightBox();
			}else if(_s.displayType == FWDEVPlayer.STICKY){
				_s.setupPlayer();
				_s.startResizeHandler();
			}else{
				_s.setupMainDo();
				if(_s.initializeOnlyWhenVisible_bl){
					_s.startResizeHandler();
					window.addEventListener("scroll", _s.onInitlalizeScrollHandler);
					setTimeout(_s.onInitlalizeScrollHandler, 500);
				}else{
					_s.setupPlayer();
					_s.startResizeHandler();
				}
			}
		};


		//#############################################//
		/* add min on scroll */
		//#############################################//
		_s.addMinOnScroll = function(){
			if(_s.displayType != FWDEVPlayer.RESPONSIVE) return;
			if(_s.stickyOnScroll) window.addEventListener("scroll", _s.minimizeOnScrollHandler);
		}

		_s.removeMinOnScroll = function(){
			if(_s.stickyOnScroll) window.removeEventListener("scroll", _s.minimizeOnScrollHandler);
		}

		_s.minimizeOnScrollHandler = function(e){
			var scrollOffsets = FWDEVPUtils.getScrollOffsets();
			_s.pageXOffset = scrollOffsets.x;
			_s.pageYOffset = scrollOffsets.y;
			
			if(_s.stageContainer.getBoundingClientRect().bottom < 0){
				_s.setMinimized();
			}else{
				_s.setNormal();
			}
		}

		_s.setMinimized = function(){
			if(_s.isMin || _s.isFullscreen_bl) return;
			_s.isMin = true;
			_s.main_do.style().position = 'fixed';
			_s.main_do.style().zIndex = 9999999999999;
			_s.main_do.setAlpha(0);
			_s.startPosisionOnMin();
		}

		_s.startPosisionOnMin = function(){
			_s.resizeHandler();
			_s.positionOnMin();
		}

		_s.setNormal = function(){
			if(!_s.isMin) return;
			_s.isMinShowed = true;
			_s.isMin = false;
			_s.main_do.style().position = "relative";
			_s.main_do.style().zIndex = 0;
			FWDAnimation.killTweensOf(_s.main_do);
			_s.main_do.setAlpha(1);
			_s.main_do.setX(0);
			_s.main_do.setY(0);
			if(_s.opener_do) _s.opener_do.setX(-1000);
						
			_s.startPosisionOnNormal();
		}

		_s.startPosisionOnNormal = function(){
			if(_s.opener_do) _s.opener_do.showCloseButton();
			_s.resizeHandler();
		}
		
		_s.positionOnMin = function(animate){
			if(!_s.isMin && !animate) return;
			var offset = 5;
			var dl = .2;
			if(_s.isMobile_bl) offset= 0;
			var offsetTop = 0;
			if(!_s.isMinShowed){
				dl = 0;
				offsetTop = Math.round(_s.sH) + offset;
			} 

			if(_s.opener_do){
				var oX = _s.ws.w - _s.opener_do.w - offset;
				var oY = _s.ws.h - _s.sH - offset + offsetTop - _s.opener_do.h;
			}

			_s.main_do.setX(_s.ws.w - _s.sW - offset);
			if(_s.main_do.alpha == 0 || animate){
				if(_s.main_do.alpha == 0){
					_s.main_do.setY(_s.ws.h);
					if(_s.opener_do){
						_s.opener_do.setX(oX);
						_s.opener_do.setY(_s.ws.h);
					}
				}
				FWDAnimation.to(_s.main_do, .8, {alpha:1, y:_s.ws.h - _s.sH - offset + offsetTop, delay:dl, ease:Expo.easeInOut});
				if(_s.opener_do){
					FWDAnimation.killTweensOf(_s.opener_do);
					FWDAnimation.to(_s.opener_do, .8, {x:oX, y:oY, delay:dl, ease:Expo.easeInOut});
				}
			}else{
				FWDAnimation.killTweensOf(_s.main_do);
				_s.main_do.setAlpha(1);
				_s.main_do.setY(_s.ws.h - _s.sH - offset + offsetTop);
				if(_s.opener_do){
					FWDAnimation.killTweensOf(_s.opener_do);
					_s.opener_do.setX(oX);
					_s.opener_do.setY(oY);
				}
			}			
		}
		

		//#############################################//
		/* setup  lighbox...*/
		//#############################################//
		_s.setupLightBox = function(){
			
			FWDEVPLightBox.setPrototype();
			_s.lightBox_do =  new FWDEVPLightBox(_s, 
					_s.lightBoxBackgroundColor_str, 
					_s.backgroundColor_str, 
					_s.lightBoxBackgroundOpacity, 
					_s.lightBoxWidth, 
					_s.lightBoxHeight);
					
			_s.lightBox_do.addListener(FWDEVPLightBox.SHOW, _s.lightBoxShowHandler);
			_s.lightBox_do.addListener(FWDEVPLightBox.CLOSE, _s.lightBoxCloseHandler);
			_s.lightBox_do.addListener(FWDEVPLightBox.HIDE_COMPLETE, _s.lightBoxHideCompleteHandler);
			_s.lighboxAnimDoneId_to = setTimeout(_s.setupPlayer, 1200);
		};
		
		_s.lightBoxShowHandler = function(){}
		
		_s.lightBoxCloseHandler = function(){
			_s.stop();
			_s.stopResizeHandler();
		};
		
		_s.lightBoxHideCompleteHandler = function(){
			_s.dispatchEvent(FWDEVPlayer.HIDE_LIGHTBOX_COMPLETE);
		};
		
		_s.onInitlalizeScrollHandler = function(){
			
			var scrollOffsets = FWDEVPUtils.getScrollOffsets();
			_s.pageXOffset = scrollOffsets.x;
			_s.pageYOffset = scrollOffsets.y;
			
			if(_s.main_do.getRect().top >= -_s.sH && _s.main_do.getRect().top < _s.ws.h){
				window.removeEventListener("scroll", _s.onInitlalizeScrollHandler);
				_s.setupPlayer();
			}
		};
		
		_s.setupPlayer = function(){
			if(!_s.info_do){
				_s.setupMainDo();
				_s.setupInfo();
				_s.setupData();
			}
		}
		

		//#############################################//
		/* setup main do */
		//#############################################//
		_s.setupMainDo = function(){
			if(_s.main_do) return;
			_s.main_do = new FWDEVPDO("div", "relative");
			if(_s.hasPointerEvent_bl) _s.main_do.style().touchAction = "none";
			_s.main_do.style().webkitTapHighlightColor = "rgba(0, 0, 0, 0)";
			_s.main_do.style().webkitFocusRingColor = "rgba(0, 0, 0, 0)";
			_s.main_do.screen.className = 'fwdevp';
			_s.main_do.style().width = "100%";
			_s.main_do.style().height = "100%";
			_s.main_do.setBackfaceVisibility();
			_s.main_do.setBkColor(_s.backgroundColor_str);
			if(!FWDEVPUtils.isMobile || (FWDEVPUtils.isMobile && FWDEVPUtils.hasPointerEvent)) _s.main_do.setSelectable(false);	

			if(_s.displayType ==  FWDEVPlayer.STICKY){
				_s.background_do = new FWDEVPDO("div");
				_s.background_do.style().width = "100%";
				if(_s.mainBackgroundImagePath_str){
					_s.mainBackground_do =  new FWDEVPDO("div");
					_s.stageContainer.appendChild(_s.mainBackground_do.screen);
				}
				_s.stageContainer.appendChild(_s.background_do.screen);
				_s.stageContainer.appendChild(_s.main_do.screen);
			}else if(_s.displayType == FWDEVPlayer.FULL_SCREEN){	
				_s.stageContainer.style.overflow = "hidden";
				_s.main_do.style().position = "absolute";
				document.documentElement.appendChild(_s.main_do.screen);
				_s.stageContainer.style.zIndex = 9999999999998;
				_s.main_do.style().zIndex = 9999999999998;
			}else if(_s.displayType == FWDEVPlayer.BACKGROUND_VIDEO){	
				document.documentElement.appendChild(_s.main_do.screen);
				_s.main_do.style().zIndex = -9999999999998;
				_s.main_do.style().position = "fixed";
				_s.main_do.setAlpha(0);
				document.documentElement.insertBefore(_s.main_do.screen, document.documentElement.firstChild);
			}else if(_s.displayType == FWDEVPlayer.LIGHTBOX){
				_s.main_do.style().position = "absolute";
				_s.stageContainer = _s.lightBox_do.mainLightBox_do.screen;
				_s.stageContainer.appendChild(_s.main_do.screen);
				_s.main_do.setX(-10000);
				_s.main_do.setY(-10000);
				_s.main_do.setWidth(0);
				_s.main_do.setHeight(0);
			}else{
				_s.stageContainer.style.overflow = "hidden";
				_s.stageContainer.appendChild(_s.main_do.screen);
			}	


			if(_s.useWithoutVideoScreen_bl){
				setTimeout(function(){
					_s.stageContainer.style.overflow = "visible";
					_s.main_do.style().overflow = 'visible';
				}, 1000);
			}
	
			if(_s.isEmbedded_bl) _s.main_do.style().zIndex = 9999999999998;
			
		};


		//#####################################//
		/* Setup disable click */
		//#####################################//
		_s.setupDisableClick = function(){
			_s.disableClick_do = new FWDEVPDO("div");
			if(FWDEVPUtils.isIE){
				_s.disableClick_do.setBkColor("#ff0000");
				_s.disableClick_do.setAlpha(0.001);
			}
	
			_s.main_do.addChild(_s.disableClick_do);
		};
		
		_s.disableClick = function(){
			_s.disableClick_bl = true;
			clearTimeout(_s.disableClickId_to);
			if(_s.disableClick_do){
				_s.disableClick_do.setWidth(_s.sW);
				_s.disableClick_do.setHeight(_s.sH);
			}
			_s.disableClickId_to =  setTimeout(function(){
				if(_s.disableClick_do){
					_s.disableClick_do.setWidth(0);
					_s.disableClick_do.setHeight(0);
				}
				_s.disableClick_bl = false;
			}, 500);
		};
		
		_s.showDisable = function(){
			if(_s.disableClick_do.w == _s.sW) return;
			_s.disableClick_do.setWidth(_s.sW);
			_s.disableClick_do.setHeight(_s.sH);
		};
		
		_s.hideDisable = function(){
			if(!_s.disableClick_do) return;
			if(_s.disableClick_do.w == 0) return;
			_s.disableClick_do.setWidth(0);
			_s.disableClick_do.setHeight(0);
		};
		

		//#############################################//
		/* setup info_do */
		//#############################################//
		_s.setupInfo = function(){
			FWDEVPInfo.setPrototype();
			_s.info_do = new FWDEVPInfo(_s, _s.warningIconPath_str, _s.showErrorInfo_bl);
		};	
		

		//#############################################//
		/* resize handler */
		//#############################################//
		_s.startResizeHandler = function(){
			window.addEventListener("resize", _s.onResizeHandler);
			
			if(_s.displayType != FWDEVPlayer.AFTER_PARENT){
				window.addEventListener("orientationchange", _s.orientationChange);
			}

			if(_s.displayType == FWDEVPlayer.STICKY){	
				window.addEventListener("scroll", _s.onScrollHandler);
			}
			
			if(_s.displayType == FWDEVPlayer.LIGHTBOX){
				window.addEventListener("scroll", _s.onScrollHandler);
			}
			
			_s.onResizeHandler(true);
			_s.resizeHandlerId_to = setTimeout(function(){_s.resizeHandler(true);}, 500);
			if(_s.displayType == FWDEVPlayer.BACKGROUND_VIDEO){
				_s.resizeHandlerId_to = setTimeout(function(){_s.resizeHandler(true);}, 900);
			}
		};
		
		_s.onScrollHandler = function(e){
			if(_s.displayType == FWDEVPlayer.STICKY) _s.onResizeHandler();
			if(_s.lightBox_do && !_s.lightBox_do.isShowed_bl) return;
			_s.scrollHandler();
			var scrollOffsets = FWDEVPUtils.getScrollOffsets();
			_s.scrollOffsets = scrollOffsets;
		};
		
		_s.scrollHandler = function(){
			var scrollOffsets = FWDEVPUtils.getScrollOffsets();
			_s.pageXOffset = scrollOffsets.x;
			_s.pageYOffset = scrollOffsets.y;
			if(_s.displayType == FWDEVPlayer.LIGHTBOX){
				_s.lightBox_do.setX(scrollOffsets.x);
				_s.lightBox_do.setY(scrollOffsets.y);
			}else if(_s.isFullScreen_bl || _s.displayType == FWDEVPlayer.FULL_SCREEN){	
				_s.main_do.setX(scrollOffsets.x);
				_s.main_do.setY(scrollOffsets.y);
			}
		};
		
		_s.stopResizeHandler = function(){
			if(window.removeEventListener){
				window.removeEventListener("resize", _s.onResizeHandler);
				window.removeEventListener("scroll", _s.onScrollHandler);
				window.removeEventListener("orientationchange", _s.orientationChange);
			}else if(window.detachEvent){
				window.detachEvent("onresize", _s.onResizeHandler);
			}	
			clearTimeout(_s.resizeHandlerId_to);
		};
		
		_s.onResizeHandler = function(e){
			_s.resizeHandler();
			clearTimeout(_s.resizeHandler2Id_to);
			_s.resizeHandler2Id_to = setTimeout(function(){_s.resizeHandler();}, 300);
		};
		
		_s.orientationChange = function(){
			_s.orintationChangeComplete_bl = false;	
			clearTimeout(_s.resizeHandlerId_to);
			clearTimeout(_s.resizeHandler2Id_to);
			clearTimeout(_s.orientationChangeId_to);
			
			_s.orientationChangeId_to = setTimeout(function(){
				_s.orintationChangeComplete_bl = true; 
				_s.resizeHandler(true);
				}, 150);
			
			_s.stageContainer.style.left = "-5000px";
			if(_s.preloader_do) _s.preloader_do.setX(-5000);	
		};
		

		_s.resizeHandler = function(animate){
		
			var vwSize = FWDEVPUtils.getViewportSize();
			var scrollOffsets = FWDEVPUtils.getScrollOffsets();
			_s.ws = vwSize;
			
			if(_s.displayType == FWDEVPlayer.STICKY && !_s.isFullScreen_bl){
				_s.main_do.style().width = "100%";
				if(_s.main_do.getWidth() > _s.maxWidth){
					_s.main_do.setWidth(_s.maxWidth);
				}
				
				_s.sW = _s.main_do.getWidth();
				if(_s.autoScale_bl){
					_s.sH = parseInt(_s.maxHeight * (_s.sW/_s.maxWidth));
				}else{
					_s.sH = _s.maxHeight;
				}
			
			}else if(_s.displayType == FWDEVPlayer.LIGHTBOX && !_s.isFullScreen_bl){
				if(!_s.lightBox_do.isShowed_bl ||  !_s.main_do) return;
				if(_s.lightBoxWidth > vwSize.w){
					_s.finalLightBoxWidth = vwSize.w;
					_s.finalLightBoxHeight = parseInt(_s.lightBoxHeight * (vwSize.w/_s.lightBoxWidth));
				}else{
					_s.finalLightBoxWidth = _s.lightBoxWidth;
					_s.finalLightBoxHeight = _s.lightBoxHeight;
				}
				_s.lightBox_do.setWidth(vwSize.w);
				_s.lightBox_do.setHeight(vwSize.h);
				_s.lightBox_do.setX(scrollOffsets.x);
				_s.lightBox_do.setY(scrollOffsets.y);
				_s.lightBox_do.mainLightBox_do.setX(parseInt((vwSize.w - _s.finalLightBoxWidth)/2));
				_s.lightBox_do.mainLightBox_do.setY(parseInt((vwSize.h - _s.finalLightBoxHeight)/2));
				if(_s.lightBox_do.clsBtn && _s.lightBox_do.isShowed_bl){ 
					_s.lightBox_do.clsBtn.setX(vwSize.w - _s.lightBox_do.clsBtn.w - 15);
					_s.lightBox_do.clsBtn.setY(15);
				}
				_s.main_do.setX(0);
				_s.main_do.setY(0);
				_s.lightBox_do.mainLightBox_do.setWidth(_s.finalLightBoxWidth);
				_s.lightBox_do.mainLightBox_do.setHeight(_s.finalLightBoxHeight);	
				_s.sW = _s.finalLightBoxWidth;
				_s.sH = _s.finalLightBoxHeight;
			}else if((_s.isFullScreen_bl || _s.displayType == FWDEVPlayer.FULL_SCREEN || _s.displayType == FWDEVPlayer.BACKGROUND_VIDEO) && !_s.doNotDisplyFS){	
				_s.main_do.setX(0);
				_s.main_do.setY(0);
				_s.sW = vwSize.w + 2;
				_s.sH = vwSize.h + 2;
			}else if(_s.displayType == FWDEVPlayer.AFTER_PARENT){
				_s.sW = _s.stageContainer.offsetWidth;
				_s.sH = _s.stageContainer.offsetHeight;
			}else{
				_s.stageContainer.style.width = "100%";
				if(_s.stageContainer.offsetWidth > _s.maxWidth){
					_s.stageContainer.style.width = _s.maxWidth + "px";
				}
				_s.sW = _s.stageContainer.offsetWidth;
				if(_s.autoScale_bl){
					_s.sH = parseInt(_s.maxHeight * (_s.sW/_s.maxWidth));
				}else{
					_s.sH = _s.maxHeight;
				}
				
				if(_s.useWithoutVideoScreen_bl){
					_s.sH = _s.controllerHeight;
				}
				_s.stageContainer.style.height = _s.sH + "px";
			}

			if(_s.isMin && !_s.isFullScreen_bl){
				_s.sW = Math.min(_s.stickyOnScrollWidth - 10, _s.ws.w - 10)
				_s.sH = parseInt(_s.stickyOnScrollHeight * (_s.sW/_s.stickyOnScrollWidth));
				_s.sH = _s.sH;
			}

			_s.tempVidStageWidth = _s.sW;
			_s.tempVidStageHeight = _s.sH;
			_s.main_do.setWidth(_s.sW);
			_s.main_do.setHeight(_s.sH);
			
			if(_s.fillEntireVideoScreen_bl  && (_s.videoType_str == FWDEVPlayer.VIDEO || _s.videoType_str == FWDEVPlayer.HLS_JS) && !_s.isFullScreen_bl){
				if(_s.videoScreen_do && _s.videoScreen_do.video_el && _s.videoScreen_do.video_el.videoWidth != 0){
					var originalW = _s.videoScreen_do.video_el.videoWidth;
					var originalH = _s.videoScreen_do.video_el.videoHeight
					var scaleX = _s.sW/originalW;
					var scaleY = _s.sH/originalH;
					
					var totalScale = 1;
					if(scaleX > scaleY){
						totalScale = scaleX;
					}else if(scaleX < scaleY){
						totalScale = scaleY;
					}
					
					var finalW = Math.round(originalW * totalScale) + 2;
					var finalH = Math.round(originalH * totalScale) + 2;
					var finalX = Math.round((_s.sW - finalW)/2) - 1;
					var finalY = Math.round((_s.sH - finalH)/2) - 1;
					
					_s.videoScreen_do.resizeAndPosition(finalW, finalH, finalX, finalY)

					if(_s.main_do.alpha == 0){
						FWDAnimation.to(_s.main_do, 3, {alpha:1});
					}
				}
			}else if(_s.audioScreen_do && _s.videoType_str == FWDEVPlayer.MP3){
				_s.audioScreen_do.resizeAndPosition(_s.sW, _s.sH);
				_s.audioScreen_do.setX(0);
				_s.audioScreen_do.setY(0);
			}else if(_s.videoScreen_do && (_s.videoType_str == FWDEVPlayer.VIDEO || _s.videoType_str == FWDEVPlayer.HLS_JS || _s.videoType_str == FWDEVPlayer.DASH)){
				_s.videoScreen_do.resizeAndPosition(_s.sW, _s.sH);
				_s.videoScreen_do.setX(0);
				_s.videoScreen_do.setY(0);
			}
			
			if(_s.popw_do && _s.popw_do.isShowed_bl) _s.popw_do.positionAndResize();
		
			if(_s.ytb_do && _s.videoType_str == FWDEVPlayer.YOUTUBE){
				_s.ytb_do.setWidth(_s.sW);
				_s.ytb_do.setHeight(_s.sH);
			}
			
			if(_s.vimeo_do && _s.videoType_str == FWDEVPlayer.VIMEO) _s.vimeo_do.resizeAndPosition();
			
			_s.positionAdsImage();
			
			if(_s.logo_do) _s.logo_do.positionAndResize();
		
			if(_s.controller_do) _s.controller_do.resizeAndPosition();
		
			if(_s.ytb_do && _s.ytb_do.ytb && _s.videoType_str == FWDEVPlayer.YOUTUBE){
				_s.ytb_do.resizeAndPosition();
			}
			
			if(_s.isIMA && _s.IMA) _s.IMA.resizeAndPosition();
			
			if(_s.preloader_do) _s.positionPreloader();
			_s.resizeDumyHandler();
			
			if(_s.largePlayButton_do) _s.positionLargePlayButton();
			if(_s.videoPoster_do && _s.videoPoster_do.allowToShow_bl) _s.videoPoster_do.positionAndResize();
			if(_s.embedWindow_do && _s.embedWindow_do.isShowed_bl) _s.embedWindow_do.positionAndResize();
			if(_s.passWindow_do && _s.passWindow_do.isShowed_bl) _s.passWindow_do.positionAndResize();
			if(_s.lg_do && _s.lg_do.isShowed_bl) _s.lg_do.positionAndResize();
			if(_s.shareWindow_do && _s.shareWindow_do.isShowed_bl) _s.shareWindow_do.positionAndResize();
			if(_s.adsStart_do) _s.positionAds();
			if(_s.subtitle_do) _s.subtitle_do.position();
			if(_s.popupAds_do) _s.popupAds_do.position();
			if(_s.annotations_do) _s.annotations_do.position();
			
			if(_s.mainBackground_do){
				_s.mainBackground_do.setWidth(_s.ws.w);
				_s.mainBackground_do.setHeight(_s.sH);
			}
			
			if(_s.displayType == FWDEVPlayer.STICKY) _s.setStageContainerFinalHeightAndPosition(animate);

			_s.positionOnMin();
			
		};
		
		_s.resizeDumyHandler = function(){
			if(_s.dClk_do){
				if(_s.is360 && _s.videoType_str == FWDEVPlayer.YOUTUBE){
					_s.dClk_do.setWidth(0);
				}else if(_s.videoType_str == FWDEVPlayer.VIMEO && !_s._d.showDefaultControllerForVimeo_bl){
					_s.dClk_do.setWidth(_s.sW);
					_s.dClk_do.setHeight(0);
				}else{
					_s.dClk_do.setWidth(_s.sW);
					if(_s.isMobile_bl){
						_s.dClk_do.setHeight(_s.sH);
					}else{
						_s.dClk_do.setHeight(_s.sH);
					}
				}
			}
		}
		
		_s.setStageContainerFinalHeightAndPosition = function(animate){
			
			if(_s.isMin) return;
			_s.allowToResizeAndPosition_bl = true;
			clearTimeout(_s.showPlaylistWithDelayId_to);
			
			
			if(_s.horizontalPosition_str == FWDEVPlayer.LEFT){
				_s.main_do.setX(_s.offsetX);
				if(_s.opener_do){
					if(_s._d.openerAlignment_str == "right"){
						_s.opener_do.setX(Math.round(_s.sW - _s.opener_do.w + _s.offsetX));
					}else{
						_s.opener_do.setX(_s.offsetX);
					}
				}
			}else if(_s.horizontalPosition_str == FWDEVPlayer.CENTER){
				_s.main_do.setX(Math.round((_s.ws.w - _s.sW)/2));
				if(_s.opener_do){
					if(_s._d.openerAlignment_str == "right"){
						_s.opener_do.setX(parseInt((_s.ws.w - _s.sW)/2) + _s.sW - _s.opener_do.w);
					}else{
						_s.opener_do.setX(_s.main_do.x);
					}
				}
			}else if(_s.horizontalPosition_str == FWDEVPlayer.RIGHT){
				_s.main_do.setX(Math.round(_s.ws.w - _s.sW - _s.offsetX));
				if(_s.opener_do){
					if(_s._d.openerAlignment_str == "right"){
						_s.opener_do.setX(Math.round(_s.ws.w - _s.opener_do.w - _s.offsetX));
					}else{
						_s.opener_do.setX(Math.round(_s.ws.w - _s.sW - _s.offsetX));
					}
				}
			}
			
			if(animate){		
				if(FWDAnimation.isTweening(_s.stageContainer)) return;
				if(_s.opener_do) FWDAnimation.killTweensOf(_s.opener_do);
				if(_s.position_str ==  FWDEVPlayer.POSITION_TOP){
					if(_s.isShowed_bl && !_s.isShowedFirstTime_bl){
						FWDAnimation.to(_s.stageContainer, .8, {css:{top:_s.offsetY}, ease:Expo.easeInOut});
					}else{
						FWDAnimation.to(_s.stageContainer, .8, {css:{top:-_s.sH}, ease:Expo.easeInOut});
					}
					
					if(_s.isShowedFirstTime_bl){
						if(_s.opener_do) FWDAnimation.to(_s.opener_do, .8, {y:_s.sH - _s.opener_do.h, ease:Expo.easeInOut});
					}else{
						if(_s.opener_do) FWDAnimation.to(_s.opener_do, .8, {y:_s.sH, ease:Expo.easeInOut});
					}
				}else{
					if(_s.isShowed_bl && !_s.isShowedFirstTime_bl){
						FWDAnimation.to(_s.stageContainer, .8, {css:{top:_s.ws.h - _s.sH - _s.offsetY}, ease:Expo.easeInOut});
					}else{
						FWDAnimation.to(_s.stageContainer, .8, {css:{top:_s.ws.h}, ease:Expo.easeInOut, onComplete:_s.moveWheyLeft});
					}
					
					if(_s.isShowedFirstTime_bl){
						if(_s.opener_do) FWDAnimation.to(_s.opener_do, .8, {y:0, ease:Expo.easeInOut});
					}else{
						if(_s.opener_do) FWDAnimation.to(_s.opener_do, .8, {y:-_s.opener_do.h, ease:Expo.easeInOut});
					}
				}
			}else{
				if(_s.position_str ==  FWDEVPlayer.POSITION_TOP){
					if(_s.isShowed_bl && !_s.isShowedFirstTime_bl){
						_s.stageContainer.style.top = _s.offsetY + "px";
					}else{
						_s.stageContainer.style.top = -_s.sH + "px";
					}
					if(_s.isShowedFirstTime_bl){
						if(_s.opener_do) _s.opener_do.setY(_s.sH - _s.opener_do.h);
					}else{
						if(_s.opener_do) _s.opener_do.setY(_s.sH);
					}
				}else{
					if(_s.isShowed_bl && !_s.isShowedFirstTime_bl){
						_s.stageContainer.style.top = (_s.ws.h - _s.sH - _s.offsetY) + "px";
					}else{
						_s.stageContainer.style.top = _s.ws.h + "px";
					}
					
					if(_s.isShowedFirstTime_bl){
						if(_s.opener_do) _s.opener_do.setY(0);
					}else{
						if(_s.opener_do) _s.opener_do.setY(-_s.opener_do.h);
					}
				}
			}
		}
		
		
		//###############################################//
		/* Setup click screen */
		//###############################################//
		_s.setupClickScreen = function(){
			_s.dClk_do = new FWDEVPDO("div");
			_s.dClk_do.screen.className = 'fwdevp-dumy-click';
			
			if(_s.disableDoubleClickFullscreen_bl){
				_s.dClk_do.style().pointerEvents = 'none';
			}

			if(_s.displayType !=  FWDEVPlayer.BACKGROUND_VIDEO){
				if(_s.hasPointerEvent_bl){
					_s.dClk_do.screen.addEventListener("pointerdown", _s.playPauseDownHandler);
					_s.dClk_do.screen.addEventListener("pointerup", _s.playPauseClickHandler);
					_s.dClk_do.screen.addEventListener("pointermove", _s.playPauseMoveHandler);
				}else{	
					if(!_s.isMobile_bl){
						_s.dClk_do.screen.addEventListener("mousedown", _s.playPauseDownHandler);
						_s.dClk_do.screen.addEventListener("mouseup", _s.playPauseClickHandler);
						_s.dClk_do.screen.addEventListener("mousemove", _s.playPauseMoveHandler);
					}else{
						if(_s.inIGPGrid){
							_s.dClk_do.screen.addEventListener("touchend", _s.playPauseClickHandler);
						}else{
							_s.dClk_do.screen.addEventListener("click", _s.playPauseClickHandler);
						}
					}
				}
			}
		
			_s.hideClickScreen();
			_s.main_do.addChild(_s.dClk_do);
		};
		
		_s.playPauseDownHandler = function(e){
			
			_s.isClickHandlerMoved_bl = false;
			var viewportMouseCoordinates = FWDEVPUtils.getViewportMouseCoordinates(e);
			_s.firstDommyTapX = viewportMouseCoordinates.screenX;
			_s.firstDommyTapY = viewportMouseCoordinates.screenY;
			if(_s.is360) _s.dClk_do.style().cursor = 'url(' + _s._d.grabPath_str + '), default';
		}
		
		_s.playPauseMoveHandler = function(e){
			if(window['FWDIGP'] && (FWDIGP.isDragged_bl || FWDIGP.isZoomed)) return;
			var viewportMouseCoordinates = FWDEVPUtils.getViewportMouseCoordinates(e);
			var dx;
			var dy;
			
			if(e.touches && e.touches.length != 1) return;
			dx = Math.abs(viewportMouseCoordinates.screenX - _s.firstDommyTapX);   
			dy = Math.abs(viewportMouseCoordinates.screenY - _s.firstDommyTapY); 
			
			if(_s.isMobile_bl && (dx > 10 || dy > 10)){
				_s.isClickHandlerMoved_bl = true;
			}else if(!_s.isMobile_bl && (dx > 2 || dy > 2)){
				_s.isClickHandlerMoved_bl = true;
			}
		}
		
		_s.playPauseClickHandler = function(e){
			if(window['FWDIGP'] && (FWDIGP.isDragged_bl || FWDIGP.isZoomed)) return;
			if(e.button == 2) return;
			if(_s.is360) _s.dClk_do.style().cursor = 'url(' + _s._d.handPath_str + '), default';
			if(_s.isClickHandlerMoved_bl) return;
			
			if(_s.isAdd_bl){	
				if(_s._d.adsPageToOpenURL_str && _s._d.adsPageToOpenURL_str != "none" && !_s.skipOnDb_bl){
					if(_s.ClickTracking) _s.executeVastEvent(_s.ClickTracking);
					window.open(_s._d.adsPageToOpenURL_str, _s._d.adsPageToOpenTarget_str);
					_s.pause();
				}
				return;
			}

			if(_s.disableClick_bl) return;
			_s.firstTapPlaying_bl = _s.isPlaying_bl;
			
			FWDEVPlayer.keyboardCurInstance = _s;
			
			if(_s.controller_do && _s.controller_do.mainHolder_do.y != 0 && _s.isMobile_bl) return;
			if(!_s.isMobile_bl){
				if(FWDEVPlayer.videoStartBehaviour == FWDEVPlayer.PAUSE_ALL_VIDEOS){
					FWDEVPlayer.pauseAllVideos(_s);
				}else if(FWDEVPlayer.videoStartBehaviour == FWDEVPlayer.STOP_ALL_VIDEOS){
					FWDEVPlayer.stopAllVideos(_s);
				}
			}
			
			if(_s.videoType_str == FWDEVPlayer.IMAGE || _s.videoType_str == FWDEVPlayer.IFRAME){
				_s.togglePlayPause();
			}else if(_s.videoType_str == FWDEVPlayer.YOUTUBE){
				_s.ytb_do.togglePlayPause();
			}else if(_s.videoType_str == FWDEVPlayer.VIMEO){
				_s.vimeo_do.togglePlayPause();
			}else if(_s.videoType_str == FWDEVPlayer.MP3){
				_s.audioScreen_do.togglePlayPause();
			}else{
				if(_s.videoScreen_do) _s.videoScreen_do.togglePlayPause();
			}
		};
		
		_s.showClickScreen = function(){
			_s.dClk_do.setVisible(true);
			if(_s.isAdd_bl && _s._d.adsPageToOpenURL_str && _s._d.adsPageToOpenURL_str != "none"){
				_s.dClk_do.setButtonMode(true);
			}else{	
				if(_s.is360){
					_s.dClk_do.style().cursor = 'url(' + _s._d.handPath_str + '), default';
				}else{
					_s.dClk_do.setButtonMode(false);
				}
			}
			_s.dispatchEvent(FWDEVPlayer.SHOW_CURSOR);
		};
		
		_s.hideClickScreen = function(){
			_s.dClk_do.setVisible(false);
		};
		
		_s.disableClick = function(){
			_s.disableClick_bl = true;
			clearTimeout(_s.disableClickId_to);
			_s.disableClickId_to =  setTimeout(function(){
				_s.disableClick_bl = false;
			}, 500);
		};

		
		//########################################//
		/* add double click and tap support */
		//########################################//
		_s.addDoubleClickSupport = function(){
			if(_s.hasPointerEvent_bl){
				_s.dClk_do.screen.addEventListener("pointerdown", _s.onFirstDown);
			}else{
				if(!_s.isMobile_bl){
					_s.dClk_do.screen.addEventListener("mousedown", _s.onFirstDown);
					if(FWDEVPUtils.isIEWebKit) _s.dClk_do.screen.addEventListener("dblclick", _s.onSecondDown);
				}
				_s.dClk_do.screen.addEventListener("touchstart", _s.onFirstDown);
			}
			_s.setupVisualization();
		};
		
		_s.onFirstDown = function(e){
			if(e.button == 2) return;
			if(_s.isFullscreen_bl && e.preventDefault) e.preventDefault();
			var viewportMouseCoordinates = FWDEVPUtils.getViewportMouseCoordinates(e);
			_s.firstTapX = viewportMouseCoordinates.screenX - _s.main_do.getGlobalX();
			_s.firstTapY = viewportMouseCoordinates.screenY - _s.main_do.getGlobalY();
			
			_s.firstTapPlaying_bl = _s.isPlaying_bl;
			
			if(FWDEVPUtils.isIEWebKit) return;
			if(_s.hasPointerEvent_bl){
				_s.dClk_do.screen.removeEventListener("pointerdown", _s.onFirstDown);
				_s.dClk_do.screen.addEventListener("pointerdown", _s.onSecondDown);
			}else{
				if(!_s.isMobile_bl){
					_s.dClk_do.screen.addEventListener("mousedown", _s.onSecondDown);
					_s.dClk_do.screen.removeEventListener("mousedown", _s.onFirstDown);
				}
				_s.dClk_do.screen.addEventListener("touchstart", _s.onSecondDown);
				_s.dClk_do.screen.removeEventListener("touchstart", _s.onFirstDown);
			}
			clearTimeout(_s.secondTapId_to);
			_s.secondTapId_to = setTimeout(_s.doubleTapExpired, 500);
		};
		
		_s.doubleTapExpired = function(){
			clearTimeout(_s.secondTapId_to);
			if(_s.hasPointerEvent_bl){
				_s.dClk_do.screen.removeEventListener("pointerdown", _s.onSecondDown);
				_s.dClk_do.screen.addEventListener("pointerdown", _s.onFirstDown);
			}else{
				_s.dClk_do.screen.removeEventListener("touchstart", _s.onSecondDown);
				_s.dClk_do.screen.addEventListener("touchstart", _s.onFirstDown);
				if(!_s.isMobile_bl){
					_s.dClk_do.screen.removeEventListener("mousedown", _s.onSecondDown);
					_s.dClk_do.screen.addEventListener("mousedown", _s.onFirstDown);
				}
			}
		};
		
		_s.onSecondDown = function(e){
			if(e.preventDefault) e.preventDefault();
			var viewportMouseCoordinates = FWDEVPUtils.getViewportMouseCoordinates(e);
			var dx;
			var dy;
			
			if(FWDEVPUtils.isIEWebKit) _s.firstTapPlaying_bl = _s.isPlaying_bl;
			if(e.touches && e.touches.length != 1) return;
			dx = Math.abs((viewportMouseCoordinates.screenX - _s.main_do.getGlobalX()) - _s.firstTapX);
			dy = Math.abs(viewportMouseCoordinates.screenY -  _s.main_do.getGlobalY() - _s.firstTapY); 
		
			if((dx > 10 || dy > 10)) return;
				
			if(_s.firstTapX < _s.tempVidStageWidth * 0.33){
				if(!_s.isPlaying_bl){
					_s.skipOnDb_bl = true;
					_s.rewind(10);
					_s.addVisualization('left');
					setTimeout(function(){
						if(!_s.isPlaying_bl) _s.play();
					}, 200);
					setTimeout(function(){
						_s.skipOnDb_bl = false;
					}, 500);
				} 
			}else if(_s.firstTapX > _s.tempVidStageWidth * 0.67){
					if(!_s.isPlaying_bl){
						_s.skipOnDb_bl = true;
						_s.rewind(-10);
						_s.addVisualization('right');
						_s.rewindId_to = setTimeout(function(){
							if(!_s.isPlaying_bl) _s.play();
						}, 200);
						setTimeout(function(){
							_s.skipOnDb_bl = false;
						}, 500);
				} 
			}else{
				_s.switchFullScreenOnDoubleClick();
				if(_s.firstTapPlaying_bl){
					_s.play();
				}else{
					_s.pause();
				}
			}
		};
		
		_s.switchFullScreenOnDoubleClick = function(e){
			_s.disableClick();
			if(!_s.isFullScreen_bl){
				_s.goFullScreen();
			}else{
				_s.goNormalScreen();
			}
		};


		//############################################//
		/* Setup double click visualization */
		//############################################//
		_s.lasPosition;
		_s.setupVisualization = function(){
			_s.mainVz_do = new FWDEVPDO('div');
			_s.mainVz_do.style().pointerEvents = 'none';
			_s.mainVz_do.style().backgroundColor = 'rgba(0,0,0,0.01)';
			_s.mainVzBackgrond_do = new FWDEVPDO('div');
			_s.mainVzBackgrond_do.style().width = '100%';
			_s.mainVzBackgrond_do.style().height = '100%';
			_s.mainVzBackgrond_do.style().backgroundColor = 'rgba(255,255,255, .15)';
			_s.mainVz_do.style().borderRadius = '100%';
			_s.mainVz_do.addChild(_s.mainVzBackgrond_do);

			_s.circle_do = new FWDEVPDO('div',0, 0, true);
			_s.circle_do.style().backgroundColor = 'rgba(255,255,255, .15)';
			_s.circle_do.style().borderRadius = '100%';
			_s.mainVz_do.addChild(_s.circle_do);


			var vzImg1 = new Image();
			vzImg1.src = _s.mainFolderPath_str + _s.sknPth + 'vis.png';
			_s.vzImg1_do = new FWDEVPDO('img', 0, 0, true);
			_s.vzImg1_do.setScreen(vzImg1);
			_s.vzImg1_do.setWidth(17);
			_s.vzImg1_do.setHeight(23);
			_s.mainVz_do.addChild(_s.vzImg1_do);

			var vzImg2 = new Image();
			vzImg2.src = _s.mainFolderPath_str + _s.sknPth + 'vis.png';
			_s.vzImg2_do = new FWDEVPDO('img', 0, 0, true);
			_s.vzImg2_do.setScreen(vzImg2);
			_s.vzImg2_do.setWidth(17);
			_s.vzImg2_do.setHeight(23);
			_s.mainVz_do.addChild(_s.vzImg2_do);

			var vzImg3 = new Image();
			vzImg3.src = _s.mainFolderPath_str + _s.sknPth + 'vis.png';
			_s.vzImg3_do = new FWDEVPDO('img', 0 ,0, true);
			_s.vzImg3_do.setScreen(vzImg3);
			_s.vzImg3_do.setWidth(17);
			_s.vzImg3_do.setHeight(23);
			_s.mainVz_do.addChild(_s.vzImg3_do);
		}

		_s.addVisualization = function(pos){
			clearTimeout(_s.vizFinisedId_to);
			clearTimeout(_s.vizFinished2Id_to);
			var w = Math.round(_s.tempVidStageWidth/2);
			var h = Math.round(_s.tempVidStageHeight * 1.5);

			FWDAnimation.killTweensOf(_s.mainVzBackgrond_do);
			if(_s.lasPosition != pos) _s.mainVzBackgrond_do.setAlpha(0);
			FWDAnimation.to(_s.mainVzBackgrond_do, .4, {alpha:1});

			_s.mainVz_do.setVisible(true);
			_s.mainVz_do.setWidth(w);
			_s.mainVz_do.setHeight(h);
			_s.mainVz_do.setY((_s.tempVidStageHeight - h)/2);
			var offsetY = Math.abs(_s.mainVz_do.y);
			if(_s.controller_do && _s.controller_do.isShowed_bl) offsetY -= _s.controller_do.sH/2;
			if(!_s.main_do.contains(_s.mainVz_do)){
				if(_s.controller_do){
					_s.main_do.addChildAt(_s.mainVz_do, _s.main_do.getChildIndex(_s.controller_do) - 1);
				}else{
					_s.main_do.addChild(_s.mainVz_do);
				}
			} 
			if(pos == 'right'){
				_s.mainVz_do.style().borderRadius = '100% 0% 0% 100%';
				_s.mainVz_do.setX(w);
				_s.vzImg1_do.setRotation(0);
				_s.vzImg2_do.setRotation(0);
				_s.vzImg3_do.setRotation(0);
			}else{
				_s.mainVz_do.style().borderRadius = '0% 100% 100% 0%';
				_s.mainVz_do.setX(0);
				_s.vzImg1_do.setRotation(180);
				_s.vzImg2_do.setRotation(180);
				_s.vzImg3_do.setRotation(180);
			}

			_s.vzImg1_do.setX(Math.round(w - (_s.vzImg1_do.w * 3))/2);
			_s.vzImg1_do.setY(Math.round(offsetY + (_s.tempVidStageHeight - _s.vzImg1_do.h)/2));
			_s.vzImg2_do.setX(_s.vzImg1_do.x + _s.vzImg1_do.w);
			_s.vzImg2_do.setY(_s.vzImg1_do.y);
			_s.vzImg3_do.setX(_s.vzImg2_do.x + _s.vzImg2_do.w);
			_s.vzImg3_do.setY(_s.vzImg2_do.y);

			
			FWDAnimation.killTweensOf(_s.vzImg1_do);
			FWDAnimation.killTweensOf(_s.vzImg2_do);
			FWDAnimation.killTweensOf(_s.vzImg3_do);
			_s.vzImg1_do.setAlpha(0);
			_s.vzImg2_do.setAlpha(0);
			_s.vzImg3_do.setAlpha(0);
			if(pos == 'right'){
				FWDAnimation.to(_s.vzImg1_do, .4, {alpha:1});
				FWDAnimation.to(_s.vzImg1_do, .4, {alpha:0, delay:.3});
				FWDAnimation.to(_s.vzImg2_do, .4, {alpha:1, delay:.3});
				FWDAnimation.to(_s.vzImg2_do, .4, {alpha:0, delay:.6});
				FWDAnimation.to(_s.vzImg3_do, .4, {alpha:1, delay:.6});
				FWDAnimation.to(_s.vzImg3_do, .4, {alpha:0, delay:.9});
			}else{
				FWDAnimation.to(_s.vzImg3_do, .4, {alpha:1});
				FWDAnimation.to(_s.vzImg3_do, .4, {alpha:0, delay:.3});
				FWDAnimation.to(_s.vzImg2_do, .4, {alpha:1, delay:.3});
				FWDAnimation.to(_s.vzImg2_do, .4, {alpha:0, delay:.6});
				FWDAnimation.to(_s.vzImg1_do, .4, {alpha:1, delay:.6});
				FWDAnimation.to(_s.vzImg1_do, .4, {alpha:0, delay:.9});
			}

			FWDAnimation.killTweensOf(_s.circle_do);
			_s.circle_do.setAlpha(1);
			_s.circle_do.setScale2(1);
			_s.circle_do.setWidth(w);
			_s.circle_do.setHeight(w);
			_s.circle_do.setScale2(0);
			_s.circle_do.setX(_s.firstTapX - _s.mainVz_do.x - _s.circle_do.w/2);
			_s.circle_do.setY(_s.firstTapY + offsetY - _s.circle_do.w/2);
			FWDAnimation.to(_s.circle_do, .8, {scale:2, ease:Expo.easeInOut});

			_s.vizFinisedId_to = setTimeout(function(){
				FWDAnimation.to(_s.mainVzBackgrond_do, .4, {alpha:0});
				FWDAnimation.to(_s.circle_do, .4, {alpha:0});
				_s.vizFinished2Id_to = setTimeout(function(){
					_s.mainVz_do.setVisible(false);
				}, 400)
			}, 800);

			_s.lasPosition = pos;
		}

		_s.stopVisualization =  function(){
			if(!_s.mainVz_do) return;
			clearTimeout(_s.vizFinisedId_to);
			clearTimeout(_s.vizFinished2Id_to);
			_s.mainVz_do.setVisible(false);
		}
		

		//############################################//
		/* Setup Vimeo API */
		//############################################//
		_s.setupVimeoAPI = function(){
			if(_s.vimeo_do) return;
			_s.dispatchEvent(FWDEVPlayer.FRAMEWORK_LOAD);
			if(typeof Vimeo != "undefined" && Vimeo.Player){
				_s.setupVimeoPlayer();
				return;
			}else{
				if(FWDEVPlayer.isVimeoAPILoadedOnce_bl){
					_s.keepCheckingVimeoAPI_int =  setInterval(function(){
						if(typeof Vimeo != "undefined" && Vimeo && Vimeo.Player){
							if(_s.videoSourcePath_str.indexOf("vimeo.") == -1) clearInterval(_s.keepCheckingVimeoAPI_int);
							clearInterval(_s.keepCheckingVimeoAPI_int);
							_s.setupVimeoPlayer();
						}
					}, 50);
					return;
				}
				
				var tag = document.createElement("script");
				tag.src = "https://player.vimeo.com/api/player.js";
				var firstScriptTag = document.getElementsByTagName("script")[0];
				firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
			
				tag.onload = function(){
					_s.keepCheckingVimeoAPI_int = setInterval(function(){
						if(typeof Vimeo != "undefined" && Vimeo && Vimeo.Player){
							clearInterval(_s.keepCheckingVimeoAPI_int);
							_s.setupVimeoPlayer();
						}
					}, 50);
					FWDEVPlayer.isVimeoAPILoadedOnce_bl = true;
				}
										
				tag.onerror = function(){
					setTimeout(function(){
						_s.main_do.addChild(_s.info_do);
						var error = "Error loading Vimeo API";
						_s.displayError(error);
					}, 500);
					return;
				}
				if(_s.largePlayButton_do) _s.hideLargePlayButton();
			}
		};
		
		
		//############################################//
		/* Setup Vimeo player */
		//############################################//
		_s.isVimeoReady_bl = false;
		_s.setupVimeoPlayer = function(){
			if(_s.vimeo_do) return;
			FWDEVPVimeoScreen.setPrototype();
			_s.vimeo_do = new FWDEVPVimeoScreen(_s, _s._d.volume);
		
			_s.vimeo_do.addListener(FWDEVPVimeoScreen.ERROR, _s.videoScreenErrorHandler);
			_s.vimeo_do.addListener(FWDEVPVimeoScreen.READY, _s.vimeoReadyHandler);
			_s.vimeo_do.addListener(FWDEVPVimeoScreen.STOP, _s.videoScreenStopHandler);
			_s.vimeo_do.addListener(FWDEVPVimeoScreen.SAFE_TO_SCRUBB, _s.videoScreenSafeToScrubbHandler);
			_s.vimeo_do.addListener(FWDEVPVimeoScreen.PLAY, _s.videoScreenPlayHandler);
			_s.vimeo_do.addListener(FWDEVPVimeoScreen.PAUSE, _s.videoScreenPauseHandler);
			_s.vimeo_do.addListener(FWDEVPVimeoScreen.UPDATE, _s.videoScreenUpdateHandler);
			_s.vimeo_do.addListener(FWDEVPVimeoScreen.UPDATE_TIME, _s.videoScreenUpdateTimeHandler);
			_s.vimeo_do.addListener(FWDEVPVimeoScreen.LOAD_PROGRESS, _s.videoScreenLoadProgressHandler);
			_s.vimeo_do.addListener(FWDEVPVimeoScreen.PLAY_COMPLETE, _s.videoScreenPlayCompleteHandler);
			_s.vimeo_do.addListener(FWDEVPVimeoScreen.UPDATE_SUBTITLE, _s.videoScreenUpdateSubtitleHandler);

			_s.dispatchEvent(FWDEVPlayer.FRAMEWORK_DONE);
		};
		
		_s.vimeoReadyHandler = function(e){
			_s.isVimeoReady_bl = true;
			clearInterval(_s.hidePreloaderId_to);
			if(_s.vimeo_do.iFrame_do) _s.vimeo_do.iFrame_do.screen.style.left = "0px";
			_s.setSource(_s.videoSourcePath_str, true);
			if(_s.preloader_do){
				_s.preloader_do.hide(false);
				_s.preloader_do.stopPreloader();
			}
		};		
		

		//############################################//
		/* Setup youtube player */
		//############################################//
		_s.setupYoutubeAPI = function(){
			if(_s.ytb_do) return;
			
			_s.dispatchEvent(FWDEVPlayer.FRAMEWORK_LOAD);
			if(typeof YT != "undefined" && YT.Player || FWDEVPlayer.isYoutubeAPILoadedOnce_bl){
				_s.setupYoutubePlayer();
				return;
			}else{
				if(FWDEVPlayer.isYoutubeAPILoadedOnce_bl){
					_s.keepCheckingYoutubeAPI_int =  setInterval(function(){
						if(typeof YT != "undefined" && YT && YT.Player){
							if(_s.videoSourcePath_str.indexOf("youtube.") == -1) clearInterval(_s.keepCheckingYoutubeAPI_int);
							clearInterval(_s.keepCheckingYoutubeAPI_int);
							_s.setupYoutubePlayer();
						}
					}, 50);
					return;
				}
				
				var tag = document.createElement("script");
				tag.src = "https://www.youtube.com/iframe_api";
				var firstScriptTag = document.getElementsByTagName("script")[0];
				firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
			
				tag.onload = function(){
					_s.checkIfYoutubePlayerIsReadyId_int = setInterval(function(){
						if(YT && YT.Player){
							clearInterval(_s.checkIfYoutubePlayerIsReadyId_int);
							_s.setupYoutubePlayer();
						}
					}, 50);
				}
				
				tag.onerror = function(){
					setTimeout(function(){
						_s.main_do.addChild(_s.info_do);
						_s.info_do.allowToRemove_bl = false;
						var error = "Error loading Youtube API";
						_s.displayError(error);
					}, 500);
					return;
				}
			}
		};
		
		_s.setupYoutubePlayer = function(){
			if(_s.ytb_do) return;
			FWDEVPYoutubeScreen.setPrototype();
			_s.ytb_do = new FWDEVPYoutubeScreen(_s, _s._d.volume);
			_s.ytb_do.addListener(FWDEVPYoutubeScreen.READY, _s.youtubeReadyHandler);
			_s.ytb_do.addListener(FWDEVPVideoScreen.ERROR, _s.videoScreenErrorHandler);
			_s.ytb_do.addListener(FWDEVPYoutubeScreen.SAFE_TO_SCRUBB, _s.videoScreenSafeToScrubbHandler);
			_s.ytb_do.addListener(FWDEVPYoutubeScreen.STOP, _s.videoScreenStopHandler);
			_s.ytb_do.addListener(FWDEVPYoutubeScreen.PLAY, _s.videoScreenPlayHandler);
			_s.ytb_do.addListener(FWDEVPYoutubeScreen.PAUSE, _s.videoScreenPauseHandler);
			_s.ytb_do.addListener(FWDEVPYoutubeScreen.UPDATE, _s.videoScreenUpdateHandler);
			_s.ytb_do.addListener(FWDEVPYoutubeScreen.UPDATE_TIME, _s.videoScreenUpdateTimeHandler);
			_s.ytb_do.addListener(FWDEVPYoutubeScreen.LOAD_PROGRESS, _s.videoScreenLoadProgressHandler);
			_s.ytb_do.addListener(FWDEVPYoutubeScreen.PLAY_COMPLETE, _s.videoScreenPlayCompleteHandler);
			_s.ytb_do.addListener(FWDEVPYoutubeScreen.CUED, _s.youtubeScreenCuedHandler);
			_s.ytb_do.addListener(FWDEVPYoutubeScreen.QUALITY_CHANGE, _s.youtubeScreenQualityChangeHandler);
			_s.ytb_do.addListener(FWDEVPVideoScreen.UPDATE_SUBTITLE, _s.videoScreenUpdateSubtitleHandler);
			
			FWDEVPlayer.isYoutubeAPILoadedOnce_bl = true;
			if(!_s.isMobile_bl) _s.ytb_do.showDisable();
			clearTimeout(_s.ytb_do);
			 _s.dispatchEvent(FWDEVPlayer.FRAMEWORK_DONE);
		};
		
		_s.youtubeReadyHandler = function(e){
		
			_s.isYoutubeReady_bl = true;
			if(_s.videoType_str != FWDEVPlayer.YOUTUBE) return;
		
			if(_s.ytb_do.hasBeenCreatedOnce_bl){
				if(_s.videoSourcePath_str.indexOf(".") != -1) return;
				if(!_s.isMobile_bl){
					_s.setPosterSource(_s.posterPath_str);
				}else{
					_s.setPosterSource(undefined);
					_s.videoPoster_do.hide();
				}
				if(_s.videoSourcePath_str.indexOf(".") == -1){
					_s.setSource(_s.videoSourcePath_str, true, _s._d.videosSource_ar[_s._d.startAtVideoSource]["videoType"]);
				}
				return;
			}
			
			if(_s.isMobile_bl){
				setTimeout(function(){
					try{
						_s.ytb_do.ytb.a.style.left = "0px";
					}catch(e){}
				}, 500);
			}
			
			_s.setSource(_s.videoSourcePath_str, true, _s._d.videosSource_ar[_s._d.startAtVideoSource]["videoType"]);
			
			if(_s.preloader_do){
				_s.preloader_do.hide(false);
				_s.preloader_do.stopPreloader();
			}
		};
		
		_s.youtubeScreenCuedHandler = function(){
			if(_s.main_do) if(_s.main_do.contains(_s.info_do)) _s.main_do.removeChild(_s.info_do);
		};
		
		_s.youtubeScreenQualityChangeHandler = function(e){
			if(_s.videoType_str == FWDEVPlayer.VIDEO) _s.curDurration = _s.videoScreen_do.curDuration;
			if(_s.controller_do) _s.controller_do.updateQuality(e.levels, e.qualityLevel);
		};
		

		//#############################################//
		/* setup context menu */
		//#############################################//
		_s.setupContextMenu = function(){
			FWDEVPContextMenu.setPrototype();
			_s.customContextMenu_do = new FWDEVPContextMenu(_s, _s._d);
		};
		

		//###########################################//
		/* setup opener */
		//###########################################//
		_s.setupOpener = function(){
			
			FWDEVPOpener.setPrototype();
			_s.opener_do = new FWDEVPOpener(_s, _s._d, _s.position_str, _s.isShowed_bl);
			_s.opener_do.style().zIndex = "99999999994";
			
			_s.opener_do.setX(-1000);
			if(_s.isShowed_bl){
				_s.opener_do.showCloseButton();
			}else{
				_s.opener_do.showOpenButton();
			}
		
			_s.opener_do.addListener(FWDEVPOpener.SHOW, _s.openerShowHandler);
			_s.opener_do.addListener(FWDEVPOpener.HIDE, _s.openerHideHandler);
			_s.opener_do.addListener(FWDEVPOpener.PLAY, _s.controllerOnPlayHandler);
			_s.opener_do.addListener(FWDEVPOpener.PAUSE, _s.controllerOnPauseHandler);
			_s.stageContainer.appendChild(_s.opener_do.screen);
			if(_s.stickyOnScroll){
				 _s.opener_do.style().position = 'fixed';
				 document.documentElement.appendChild(_s.opener_do.screen);
			}
		};
		
		_s.openerShowHandler = function(){
			_s.showPlayer();
		};
		
		_s.openerHideHandler = function(){
			_s.hidePlayer();
		};


		//#############################################//
		/* setup RSM */
		//#############################################//
		_s.setupRSM = function(){
			if(_s._d.useResumeOnPlay_bl){
				window.addEventListener("beforeunload", function (e) {
					var test = Math.random() * 1000;
					if(_s.isPlaying_bl){
						document.cookie = "fwdevp_video_path=" + _s.videoSourcePath_str + "; expires=Thu, 18 Dec 2040 00:00:01 GMT; path=/";
						var curTime = _s.getCurrentTime();
						if(curTime.length == 5) curTime = "00:" + curTime;
						document.cookie = "fwdevp_time=" + curTime + "; expires=Thu, 18 Dec 2040 00:00:01 GMT; path=/";	
					}
				});
			}
		};
		

		//#############################################//
		/* setup data */
		//#############################################//
		_s.setupData = function(){
			FWDEVPData.setPrototype();
			_s._d = new FWDEVPData(_s.props, _s.rootElement_el, _s);
			
			if(_s.mainBackground_do) _s.mainBackground_do.style().background = "url('" + _s.mainBackgroundImagePath_str + "')";
			_s._d.addListener(FWDEVPData.VAST_LOADING, _s.vastLoading);
			_s._d.addListener(FWDEVPData.VAST_LOADED_DONE, _s.vastLoadedDone);
			_s._d.addListener(FWDEVPData.PRELOADER_LOAD_DONE, _s.onPreloaderLoadDone);
			_s._d.addListener(FWDEVPData.LOAD_ERROR, _s.dataLoadError);
			_s._d.addListener(FWDEVPData.SKIN_PROGRESS, _s.dataSkinProgressHandler);
			_s._d.addListener(FWDEVPData.SKIN_LOAD_COMPLETE, _s.dataSkinLoadComplete);
			_s._d.addListener(FWDEVPData.IMA_READY, _s.dataImaReady);
			_s._d.addListener(FWDEVPData.IMA_ERROR, _s.dataImaError);
		};
		
		_s.vastLoading = function(){
			_s.isVastLoading_bl = true;
			_s.preloader_do.show(true);
			_s.preloader_do.startPreloader();
		}
		
		_s.vastLoadedDone = function(){
			_s.isAdd_bl = false
			_s.isVastLoading_bl = false;
			_s.updateAds(0, true);
			_s.preloader_do.hide(true);
			_s.dispatchEvent(FWDEVPlayer.VAST_LOADED_DONE);
		}
		
		_s.onPreloaderLoadDone = function(){
			_s.setupPreloader();
			if(!_s.isMobile_bl) _s.setupContextMenu();
			if(_s.displayType == FWDEVPlayer.BACKGROUND_VIDEO){
				_s._d.useChromeless_bl = true;
				_s._d.autoPlay_bl = true;
				_s._d.loop_bl = true;
				_s._d.fillEntireVideoScreen_bl = _s.fillEntireVideoScreen_bl = true;
			}else{
				_s.fillEntireVideoScreen_bl = _s._d.fillEntireVideoScreen_bl;
			}
		
			_s.resizeHandler();
		};
		
		_s.dataLoadError = function(e, text){
			_s.main_do.addChild(_s.info_do);
			_s.info_do.showText(e.text);
			if(_s.preloader_do){
				_s.preloader_do.hide(false);
				_s.preloader_do.stopPreloader();
			}
			_s.resizeHandler();
			_s.dispatchEvent(FWDEVPlayer.ERROR, {error:e.text});
		};
		
		
		_s.dataSkinProgressHandler = function(e){};
		
		_s.dataSkinLoadComplete = function(){
			window.removeEventListener("scroll", _s.onScrollHandler);
			_s.volume = _s._d.volume;
			if(_s.displayType == FWDEVPlayer.FULL_SCREEN  && !FWDEVPUtils.hasFullScreen){
				_s._d.showFullScreenButton_bl = false;
			}
			
			clearInterval(_s.hidePreloaderId_to);
			_s.hidePreloaderId_to = setTimeout(function(){
				if(_s.preloader_do && !_s.isVastLoading_bl){
					_s.preloader_do.hide(false);
					_s.preloader_do.stopPreloader();
				}
			}, 500);
			
			if(_s.useWithoutVideoScreen_bl){
				_s._d.showFullScreenButton_bl = false;
				_s._d.showDownloadVideoButton_bl = false;
				_s._d.showSubtitleButton_bl = false;
				_s._d.showEmbedButton_bl = false;
				_s._d.showYoutubeQualityButton_bl = false;
				_s._d.showShareButton_bl = false;
				_s._d.showPlaybackRateButton_bl = false;
				_s._d.controllerHideDelay = 10000000;
			}

			_s.setupNormalVideoPlayer();
			
			_s.animate_bl = _s._d.animate_bl;

			if((_s._d.showOpener_bl && _s.displayType == FWDEVPlayer.STICKY)
				|| (_s._d.stickyOnScrollShowOpener_bl && _s.stickyOnScroll)){
				_s.setupOpener();
			} 
		
			if(_s._d.useVectorIcons_bl){
				_s.checkFinalButtonSizezId_int = setInterval(function(){
					if(_s.controller_do){
						if(_s.controller_do.playPauseButton_do.w != 0){
							setTimeout(function(){
								_s.isShowedFirstTime_bl = false;
								_s.resizeHandler(_s.animate_bl);
								clearInterval(_s.checkFinalButtonSizezId_int);
							}, 100);
						}
					}else{
						if(_s.controller_do) clearInterval(_s.checkFinalButtonSizezId_int);
					}
				}, 50);
			}else{
				setTimeout(function(){
					_s.isShowedFirstTime_bl = false;
					_s.resizeHandler(_s.animate_bl);
				}, 50);
			}
		};
		
		_s.dataImaReady = function(){
			if(_s.isIMA){
				var dSrc = _s._d.videosSource_ar[_s._d.startAtVideoSource];
				_s.setSource(dSrc["source"], true, _s._d.videosSource_ar[_s._d.startAtVideoSource]["videoType"], dSrc["source2"]);
			} 
		}
		
		_s.dataImaError = function(){
			_s.errorImaSDK = true;
			var dSrc = _s._d.videosSource_ar[_s._d.startAtVideoSource];
			_s.setSource(dSrc["source"],false, _s._d.videosSource_ar[_s._d.startAtVideoSource]["videoType"], dSrc["source2"]);
		}
		
		_s.setupNormalVideoPlayer = function(){
			if(_s.normalVideoPlayersCreated_bl) return;
			_s.normalVideoPlayersCreated_bl = true;
			
			_s.isAPIReady_bl = true;
			_s.setupVideoScreen();
			_s.setupAudioScreen();
			_s.setupVideoPoster();
			if(_s.showPreloader_bl) _s.main_do.addChild(_s.preloader_do);	
			_s.setupSubtitle();
			_s.setupClickScreen();
			_s.setupPopupAds();
			if(!_s.disableDoubleClickFullscreen_bl) _s.addDoubleClickSupport();
			if(!_s._d.useChromeless_bl && _s._d.showController_bl) _s.setupController();
			if(!_s._d.useChromeless_bl && _s._d.showLogo_bl) _s.setupLogo();
			_s.setupHider();
			if(!_s._d.useChromeless_bl && _s._d.showController_bl && _s._d.showEmbedButton_bl) _s.setupEmbedWindow();
			if(!_s._d.useChromeless_bl && _s._d.showController_bl) _s.setupPasswordWindow();
			if(!_s._d.isLoggedIn_bl && _s._d.showController_bl) _s.setupLoginWindow();
			if(!_s._d.useChromeless_bl  && _s._d.showController_bl && _s._d.showShareButton_bl) _s.setupShareWindow();
			if(_s._d.showAopwWindow_bl) _s.setupAopw();
			if(!_s._d.useChromeless_bl && _s._d.showController_bl) _s.setupAdsStart();
			if(_s._d.hasAnnotiations_bl) _s.setupAnnotations();
			if(!_s._d.useChromeless_bl) _s.setupLargePlayPauseButton();
			if(_s._d.showChromecastButton_bl) _s.setupChormecast();
			_s.addMinOnScroll();
			_s.setupDisableClick();
			_s.setupRSM();
			_s.updateAds(0, true);

			setTimeout(function(){
				_s.dispatchEvent(FWDEVPlayer.READY);
			}, 50);
			
			if(_s.displayType == FWDEVPlayer.BACKGROUND_VIDEO && _s.isMobile_bl){
				if(_s.hasPointerEvent_bl){
					window.addEventListener("pointerdown", _s.playVideoBackgroundOnMobileOnInteraction);
				}else{
					window.addEventListener("touchstart", _s.playVideoBackgroundOnMobileOnInteraction);
				}	
			}
			
			if(_s._d.addKeyboardSupport_bl) _s.addKeyboardSupport();
			_s.resizeHandler();
		};
		
		_s.setupAopw = function(){
			
			FWDEVPOPWindow.setPrototype();
			_s.popw_do = new FWDEVPOPWindow(_s._d, _s);
		}
		
		_s.playVideoBackgroundOnMobileOnInteraction = function(){
			if(_s.hasPointerEvent_bl){
				window.removeEventListener("pointerdown", _s.playVideoBackgroundOnMobileOnInteraction);
			}else{
				window.removeEventListener("touchstart", _s.playVideoBackgroundOnMobileOnInteraction);
			}	
			_s.play();
		}

		
		//###########################################//
		/* Setup autoplay click. */
		//###########################################//
		_s.setupAPT = function(){
			if(!_s.apt && _s._d.autoPlayText && _s._d.autoPlay_bl){
				_s.removeAPT();
				_s.apt = new FWDEVPDO('div', 0, 0, true);
				_s.apt.screen.className = 'fwdevp-autoplay-text';
				_s.apt.setButtonMode(true);
				_s.apt.setInnerHTML(_s._d.autoPlayText + '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0)"><path d="M9.4272 0.430497C9.4272 0.267667 9.33293 0.113407 9.18724 0.0448468C9.03298 -0.0322832 8.86158 -0.00657319 8.73303 0.0962667L4.93652 3.12147L9.4272 7.61215V0.430497Z" fill="black"/><path d="M11.8742 11.2702L0.733188 0.129242C0.566073 -0.0378725 0.294404 -0.0378725 0.127289 0.129242C-0.0398256 0.296357 -0.0398256 0.568026 0.127289 0.735141L2.82341 3.43212H2.57231C2.30664 3.43212 2.07525 3.5521 1.92099 3.74064C1.79244 3.88633 1.71531 4.08344 1.71531 4.28912V7.71712C1.71531 8.18847 2.10096 8.57412 2.57231 8.57412H4.56055L8.73413 11.9078C8.81126 11.9678 8.90553 12.0021 8.9998 12.0021C9.05979 12.0021 9.12835 11.985 9.18834 11.9593C9.33403 11.8907 9.4283 11.7364 9.4283 11.5736V10.037L11.2674 11.8761C11.3514 11.9601 11.4611 12.0021 11.5708 12.0021C11.6805 12.0021 11.7902 11.9601 11.8742 11.877C12.0413 11.709 12.0413 11.4382 11.8742 11.2702Z" fill="black"/></g></svg>');
				_s.main_do.addChild(_s.apt);
				
				if(_s.isMobile_bl){
					_s.apt.screen.addEventListener('touchend', _s.aptSetVolume, {passive:false});
				}else{
					_s.apt.screen.addEventListener('click', _s.aptSetVolume);
				}
				
			}
			_s.showAPT();
		}

		_s.aptSetVolume = function(e){
			if(e.preventDefault) e.preventDefault();
			_s.setVolume(_s._d.volume, true);
		}

		_s.removeAPT = function(e){
			if(e && e.preventDefault) e.preventDefault();
			if(_s.apt && _s.main_do.contains(_s.apt)) _s.main_do.removeChild(_s.apt);
			FWDAnimation.killTweensOf(_s.apt);
			_s.aptRemoved = true;
			_s.apt = null;
		}

		_s.hideAPT = function(){
			if(_s.apt) _s.apt.setX(-5000);
		}

		_s.showAPT = function(){
			if(_s.apt){
				 _s.apt.setX(0);
				 _s.apt.setScale2(0);
				 FWDAnimation.to(_s.apt, 1, {scale:1, ease:Elastic.easeInOut});
			}
		}


		//###########################################//
		/* Setup popup ads */
		//###########################################//
		_s.setupPopupAds = function(){
			FWDEVPPopupAds.setPrototype();
			_s.popupAds_do =  new FWDEVPPopupAds(_s, _s._d);
			_s.main_do.addChild(_s.popupAds_do);
		};
		

		//#############################################//
		/* setup preloader */
		//#############################################//
		_s.setupPreloader = function(){
			FWDEVPPreloader.setPrototype();
		
			_s.preloader_do = new FWDEVPPreloader(_s, 'center', 10, _s.preloaderBackgroundColor, _s.preloaderFillColor, 3, 0.8);
			_s.preloader_do.show(false);
			_s.preloader_do.startPreloader();
			
			if(_s.showPreloader_bl){
				if(_s.displayType == FWDEVPlayer.STICKY){
					document.documentElement.appendChild(_s.preloader_do.screen);
				}else{
					_s.main_do.addChild(_s.preloader_do);
				}
				
			}
		};
		
		_s.positionPreloader = function(){

			if(_s.displayType == FWDEVPlayer.STICKY){
				
				if(!_s.main_do.contains(_s.preloader_do)){
					
					_s.preloader_do.setX(Math.round((_s.ws.w - _s.preloader_do.w)/2));
					if(_s.position_str == FWDEVPlayer.POSITION_BOTTOM){
						_s.preloader_do.setY(Math.round((_s.ws.h - _s.preloader_do.h) - 10) + FWDEVPUtils.getScrollOffsets().y);
					}else{
						_s.preloader_do.setY(10);
					}
				}else{
					_s.preloader_do.setX(Math.round((_s.sW - _s.preloader_do.w)/2));
					_s.preloader_do.setY(Math.round((_s.sH - _s.preloader_do.h)/2));
				}
			}else{
				_s.preloader_do.setX(parseInt((_s.sW - _s.preloader_do.w)/2));
				_s.preloader_do.setY(parseInt((_s.sH - _s.preloader_do.h)/2));
			}
		};
		

		//##########################################//
		/* setup video poster */
		//##########################################//
		_s.setupVideoPoster = function(){
			FWDEVPPoster.setPrototype();
			_s.videoPoster_do = new FWDEVPPoster(_s, _s._d.posterBackgroundColor_str, _s._d.show, _s._d.fillEntireScreenWithPoster_bl);
			_s.main_do.addChild(_s.videoPoster_do);
		};


		//##########################################//
		/* setup chromecast */
		//##########################################//
		_s.setupChormecast = function(){
			FWDEVPCC.setPrototype();
			_s.cc = new FWDEVPCC(_s.controller_do);
		}
		
		
		//###########################################//
		/* Setup large play / pause button */
		//###########################################//
		_s.setupLargePlayPauseButton = function(){
			if(_s._d.useVectorIcons_bl){					
				var ic = _s.fontIcon + ' ' + _s.fontIcon + '-play';
				FWDEVPSimpleButton.setTransformPrototype();
				_s.largePlayButton_do = new FWDEVPSimpleButton(
						undefined, 0, 0, true, 0, 0, 0,
						"<div class='table-fwdevp-button'><span class='table-cell-fwdevp-button " + ic + "'></span></div>",
						undefined,
						"EVPLargePlayButtonNormalState",
						"EVPLargePlayButtonSelectedState"
				);
			}else{
				FWDEVPSimpleButton.setTransformPrototype();
				_s.largePlayButton_do = new FWDEVPSimpleButton(
														 _s._d.largePlayN_img, 
														 _s._d.largePlayS_str, 
														 undefined, 
														 true,
														 _s._d.useHEX,
														 _s._d.nBC,
														 _s._d.sBC,
														 undefined, undefined, undefined, undefined, true);
			}

			_s.largePlayButton_do.addListener(FWDEVPSimpleButton.MOUSE_UP, _s.largePlayButtonUpHandler);
			_s.largePlayButton_do.setOverflow("visible");
			_s.hideLargePlayButton();
			if(!_s.notShowLargePlayButton_bl) _s.main_do.addChild(_s.largePlayButton_do);
		};
		
		_s.largePlayButtonUpHandler = function(){
			if(window['FWDIGP']){
				if(FWDIGP.isCategoryChanging_bl || FWDIGP.disableOnDragOrSwipe_bl || FWDIGP.isMobileScrolling_bl){
					return;
				} 
			}
			if(_s.isIMA && _s.IMA && !_s.IMA.isReady) return;
			_s.disableClick();
			if(_s.videoType_str == FWDEVPlayer.VIMEO && _s.vimeo_do){
				if(_s.vimeo_do.hasError) return;
				_s.vimeo_do.hideDisable();
			}
			_s.hideLargePlayButton();
			_s.play();
			if(_s._d.goFullScreenOnPlay_bl) _s.goFullScreen();
		};
		
		_s.positionLargePlayButton =  function(){
			_s.largePlayButton_do.setX(parseInt((_s.sW - _s.largePlayButton_do.w)/2));
			_s.largePlayButton_do.setY(parseInt((_s.sH - _s.largePlayButton_do.h)/2));
		};

		_s.showLargePlayButton = function(dl){
			if(_s.notShowPlayBtnExternal && !_s.isFullScreen_bl) return;
			 _s.largePlayButton_do.show(dl);
			_s.dispatchEvent(FWDEVPlayer.SHOW_PLAY_BUTTON);
		}

		_s.hideLargePlayButton = function(){
			_s.largePlayButton_do.hide();
			_s.dispatchEvent(FWDEVPlayer.HIDE_PLAY_BUTTON);
		}

		
		//###########################################//
		/* Setup logo */
		//###########################################//
		_s.setupLogo = function(){
			FWDEVPLogo.setPrototype();
			_s.logo_do = new FWDEVPLogo(_s, _s._d.logoPath_str, _s._d.logoPosition_str, _s._d.logoMargins);
			_s.main_do.addChild(_s.logo_do);
		};
		

		//###########################################//
		/* Setup subtitle */
		//###########################################//
		_s.setupSubtitle = function(){
			FWDEVPSubtitle.setPrototype();
			_s.subtitle_do =  new FWDEVPSubtitle(_s, _s._d);
			_s.subtitle_do.addListener(FWDEVPSubtitle.LOAD_COMPLETE, _s.subtitleLoadComplete);
		};
		
		_s.subtitleLoadComplete = function(){
			if(_s.controller_do) _s.controller_do.enableSubtitleButton();
		};
		
		_s.loadSubtitle = function(path){
			if(!path) return;
			if(_s.isCasting){
				_s.cc.loadSubtitle();
				return;
			}
			if(path){
				_s.subtitle_do.loadSubtitle(path);
				_s.main_do.addChildAt(_s.subtitle_do, _s.main_do.getChildIndex(_s.dClk_do) - 1);
			}
		}
		
		
		//###########################################//
		/* setup controller */
		//###########################################//
		_s.setupController = function(){
			
			FWDEVPController.setPrototype();
			_s.controller_do = new FWDEVPController(_s._d, _s);
			
			_s.controller_do.addListener(FWDEVPController.CHANGE_AUDIO_TRACKS, _s.audioTracksHanlder);
			_s.controller_do.addListener(FWDEVPController.VR, _s.vrHanlder);
			_s.controller_do.addListener(FWDEVPController.REWIND, _s.rewindHandler);
			_s.controller_do.addListener(FWDEVPData.LOAD_ERROR, _s.thumbnailsPreviewLoadError);
			_s.controller_do.addListener(FWDEVPController.CHANGE_PLAYBACK_RATES, _s.changePlaybackRateHandler);
			_s.controller_do.addListener(FWDEVPController.CHANGE_SUBTITLE, _s.changeSubtitileHandler);
			_s.controller_do.addListener(FWDEVPController.PLAY, _s.controllerOnPlayHandler);
			_s.controller_do.addListener(FWDEVPController.PAUSE, _s.controllerOnPauseHandler);
			_s.controller_do.addListener(FWDEVPController.START_TO_SCRUB, _s.controllerStartToScrubbHandler);
			_s.controller_do.addListener(FWDEVPController.SCRUB, _s.controllerScrubbHandler);
			_s.controller_do.addListener(FWDEVPController.STOP_TO_SCRUB, _s.controllerStopToScrubbHandler);
			_s.controller_do.addListener(FWDEVPController.CHANGE_VOLUME, _s.controllerChangeVolumeHandler);
			_s.controller_do.addListener(FWDEVPController.DOWNLOAD_VIDEO, _s.controllerDownloadVideoHandler);
			_s.controller_do.addListener(FWDEVPController.SHARE, _s.controllerShareHandler);
			_s.controller_do.addListener(FWDEVPController.CHANGE_YOUTUBE_QUALITY, _s.controllerChangeYoutubeQualityHandler);
			_s.controller_do.addListener(FWDEVPController.FULL_SCREEN, _s.controllerFullScreenHandler);
			_s.controller_do.addListener(FWDEVPController.NORMAL_SCREEN, _s.controllerNormalScreenHandler);
			_s.controller_do.addListener(FWDEVPController.SHOW_EMBED_WINDOW, _s.showEmbedWindowHandler);
			_s.controller_do.addListener(FWDEVPController.SHOW_SUBTITLE, _s.showSubtitleHandler);
			_s.controller_do.addListener(FWDEVPController.HIDE_SUBTITLE, _s.hideSubtitleHandler);
			_s.main_do.addChild(_s.controller_do);
		};

		_s.audioTracksHanlder = function(e){
			if(_s.hlsJS){
				_s.hlsJS.audioTrack = e.id;
			}else{
				_s.videoScreen_do.setAudioTrack(e.id);
			}
		}

		_s.vrHanlder = function(){
			_s.play();
			if(!_s.videoScreen_do.vrSupport_bl){
				_s.videoScreen_do.showVrMessage();
			}else{
				_s.videoScreen_do.startVR();
			}
		}
		
		_s.rewindHandler = function(){
			_s.rewind(10);
		}
		
		_s.rewind = function(offset){
			var curTime = _s.getCurrentTime();
			if(curTime.length == 5) curTime = "00:" + curTime;
			if(curTime.length == 7) curTime = "0" + curTime;
			curTime = FWDEVPUtils.getSecondsFromString(curTime);
			curTime -= offset;
			curTime = FWDEVPUtils.formatTime(curTime);
			if(curTime.length == 5) curTime = "00:" + curTime;
			if(curTime.length == 7) curTime = "0" + curTime;
			_s.scrubbAtTime(curTime);
		}
		
		_s.thumbnailsPreviewLoadError = function(e){
			console.log(e);
		}
		
		_s.changePlaybackRateHandler = function(e){
			_s.setPlaybackRate(e.rate);
			_s.dispatchEvent(FWDEVPlayer.PLAYBACK_RATE_CHANGE, {rate:e.rate});
		}
		
		_s.changeSubtitileHandler = function(e){
			_s._d.startAtSubtitle = e.id;
			_s.controller_do.updateSubtitleButtons(_s._d.subtitles_ar, _s._d.startAtSubtitle);
			_s._d.subtitlePath_str = _s._d.subtitles_ar[_s._d.subtitles_ar.length - 1 - _s._d.startAtSubtitle]["source"];
			_s._d.startAtSubtitle = e.id;
			_s.ccSS = e.id;
		
			if(!_s.isAdd_bl) _s.loadSubtitle(_s._d.subtitlePath_str);
		}
		
		_s.controllerDownloadVideoHandler = function(){
			_s.downloadVideo();
		};
		
		_s.showSubtitleHandler = function(){
			_s.subtitle_do.isShowed_bl = true;
			_s.subtitle_do.show();
		};
		
		_s.hideSubtitleHandler = function(){
			_s.subtitle_do.isShowed_bl = false;
			_s.subtitle_do.hide();
		};
		
		_s.controllerOnPlayHandler = function(e){
			_s.play();
			if(_s._d.goFullScreenOnPlay_bl) _s.goFullScreen();
		};
		
		_s.controllerOnPauseHandler = function(e){
			_s.pause();
		};
		
		_s.controllerStartToScrubbHandler = function(e){
			if(_s.isCasting){
				_s.cc.startToScrub();
				return;
			}
			_s.startToScrub();
		};
		
		_s.controllerScrubbHandler = function(e){
			if(_s.isCasting){
				_s.cc.seek(e.percent);
				return;
			}
			_s.scrub(e.percent);
		};
		
		_s.controllerStopToScrubbHandler = function(e){
			if(_s.isCasting){
				_s.cc.stopToScrub();
				return;
			}
			_s.stopToScrub();
		};
		
		_s.controllerChangeVolumeHandler = function(e){
			_s.setVolume(e.percent, true);
		};
		
		_s.controllerShareHandler = function(e){
			_s.setVideoPlayingStateOnWindowShow();
			_s.pause();
			
			_s.shareWindow_do.show();
			if(_s.controller_do){
				_s.controller_do.shareButton_do.setSelectedState();
				_s.controller_do.shareButton_do.isDisabled_bl = true;
			}
		};
		
		_s.controllerChangeYoutubeQualityHandler = function(e){
			if(_s.videoType_str == FWDEVPlayer.HLS_JS){
				_s.curHlsLevel = Math.abs(e.id - _s.hlsLevels_ar.length + 1);
				_s.hlsJS.currentLevel = _s.curHlsLevel;
				//_s.controller_do.disableQualityButtons(_s.hlsLevels_ar[_s.curHlsLevel]);
			}else if(_s.videoType_str == FWDEVPlayer.YOUTUBE){
				_s.ytb_do.setQuality(e.quality);
			}else{
				_s._d.startAtVideoSource = _s._d.videosSource_ar.length -1 - e.id;
				var dSrc = _s._d.videosSource_ar[_s._d.startAtVideoSource];
				_s.isQualityChangingError_bl = _s.isQualityChanging_bl = _s.isQualityChangingStop_bl = true;
				_s.updateAds(0);
				_s.play();
			}
		};
		
		_s.controllerFullScreenHandler = function(){
			_s.goFullScreen();
		};
		
		_s.controllerNormalScreenHandler = function(){
			_s.goNormalScreen();
		};
		
		_s.showEmbedWindowHandler = function(){
			
			_s.setVideoPlayingStateOnWindowShow();
			_s.pause();
			
			if(_s.customContextMenu_do) _s.customContextMenu_do.disable();
			_s.embedWindow_do.show();
			
			if(_s.controller_do){
				_s.controller_do.embedButton_do.setSelectedState();
				_s.controller_do.embedButton_do.isDisabled_bl = true;
			}
		};
		
		_s.setVideoPlayingStateOnWindowShow =  function(){
			if(_s.isCasting){
				_s.isVideoPlayingWhenOpenWindows_bl = _s.cc.playerState == 'PLAYING';
			}else if(_s.isIMA && _s.IMA.started){
				_s.isVideoPlayingWhenOpenWindows_bl = _s.IMA.isPlaying;
			}else if(_s.videoType_str == FWDEVPlayer.YOUTUBE && _s.ytb_do){
				_s.isVideoPlayingWhenOpenWindows_bl = _s.ytb_do.isPlaying_bl;
			}else if(_s.videoType_str == FWDEVPlayer.VIMEO && _s.vimeo_do){
				_s.isVideoPlayingWhenOpenWindows_bl = _s.vimeo_do.isPlaying_bl;
			}else if(FWDEVPlayer.hasHTML5Video){
				if(_s.videoScreen_do) _s.isVideoPlayingWhenOpenWindows_bl = _s.videoScreen_do.isPlaying_bl;
			}
		}
		

		//###########################################//
		/* setup FWDEVPAudioScreen */
		//###########################################//
		_s.setupAudioScreen = function(){	
			FWDEVPAudioScreen.setPrototype();
			_s.audioScreen_do = new FWDEVPAudioScreen(_s, _s._d.volume);
			_s.audioScreen_do.addListener(FWDEVPAudioScreen.ERROR, _s.videoScreenErrorHandler);
			_s.audioScreen_do.addListener(FWDEVPAudioScreen.SAFE_TO_SCRUBB, _s.videoScreenSafeToScrubbHandler);
			_s.audioScreen_do.addListener(FWDEVPAudioScreen.STOP, _s.videoScreenStopHandler);
			_s.audioScreen_do.addListener(FWDEVPAudioScreen.PLAY, _s.videoScreenPlayHandler);
			_s.audioScreen_do.addListener(FWDEVPAudioScreen.PAUSE, _s.videoScreenPauseHandler);
			_s.audioScreen_do.addListener(FWDEVPAudioScreen.UPDATE, _s.videoScreenUpdateHandler);
			_s.audioScreen_do.addListener(FWDEVPAudioScreen.UPDATE_TIME, _s.videoScreenUpdateTimeHandler);
			_s.audioScreen_do.addListener(FWDEVPAudioScreen.LOAD_PROGRESS, _s.videoScreenLoadProgressHandler);
			_s.audioScreen_do.addListener(FWDEVPVideoScreen.START_TO_BUFFER, _s.videoScreenStartToBuferHandler);
			_s.audioScreen_do.addListener(FWDEVPVideoScreen.STOP_TO_BUFFER, _s.videoScreenStopToBuferHandler);
			_s.audioScreen_do.addListener(FWDEVPAudioScreen.PLAY_COMPLETE, _s.videoScreenPlayCompleteHandler);
			_s.audioScreen_do.addListener(FWDEVPAudioScreen.UPDATE_SUBTITLE, _s.videoScreenUpdateSubtitleHandler);
			_s.main_do.addChild(_s.audioScreen_do);
		};

		
		//###########################################//
		/* setup FWDEVPVideoScreen */
		//###########################################//
		_s.setupVideoScreen = function(){
			
			FWDEVPVideoScreen.setPrototype();
			_s.videoScreen_do = new FWDEVPVideoScreen(_s, _s.backgroundColor_str, _s._d.volume);
			_s.videoScreen_do.addListener(FWDEVPVideoScreen.ERROR, _s.videoScreenErrorHandler);
			_s.videoScreen_do.addListener(FWDEVPVideoScreen.SAFE_TO_SCRUBB, _s.videoScreenSafeToScrubbHandler);
			_s.videoScreen_do.addListener(FWDEVPVideoScreen.STOP, _s.videoScreenStopHandler);
			_s.videoScreen_do.addListener(FWDEVPVideoScreen.START, _s.videoScreenStartHandler);
			_s.videoScreen_do.addListener(FWDEVPVideoScreen.PLAY, _s.videoScreenPlayHandler);
			_s.videoScreen_do.addListener(FWDEVPVideoScreen.PAUSE, _s.videoScreenPauseHandler);
			_s.videoScreen_do.addListener(FWDEVPVideoScreen.UPDATE, _s.videoScreenUpdateHandler);
			_s.videoScreen_do.addListener(FWDEVPVideoScreen.UPDATE_TIME, _s.videoScreenUpdateTimeHandler);
			_s.videoScreen_do.addListener(FWDEVPVideoScreen.UPDATE_SUBTITLE, _s.videoScreenUpdateSubtitleHandler);
			_s.videoScreen_do.addListener(FWDEVPVideoScreen.LOAD_PROGRESS, _s.videoScreenLoadProgressHandler);
			_s.videoScreen_do.addListener(FWDEVPVideoScreen.START_TO_BUFFER, _s.videoScreenStartToBuferHandler);
			_s.videoScreen_do.addListener(FWDEVPVideoScreen.STOP_TO_BUFFER, _s.videoScreenStopToBuferHandler);
			_s.videoScreen_do.addListener(FWDEVPVideoScreen.PLAY_COMPLETE, _s.videoScreenPlayCompleteHandler);
			_s.main_do.addChild(_s.videoScreen_do);
		};
		
		_s.videoScreenStartHandler = function(){
			_s.callVastEvent("start");
			_s.executeVastEvent(_s.Impression);
		}
		
		_s.checkSecondSource = function(){
			//Check second source.
			_s.videoSource2_str = _s._d.videosSource_ar[_s._d.startAtVideoSource]["source2"];
			if(_s.videoSource2_str && !_s.playSecondSource && !_s.isAdd_bl){
				_s.playSecondSource = true;
				_s.prevIsIMA = '-1';
				_s.setSource(_s.videoSource2_str, false, _s.videoType);

				if(_s.isQualityChangingError_bl){
					_s.play();
					_s.isQualityChangingError_bl = false;
				}
				return true;
			}
		}
		
		_s.videoScreenErrorHandler = function(e){
			var error;
			_s.isPlaying_bl = false;

			if(_s.checkSecondSource()){
				return;
			}
			
			// Execute error.
			if(FWDEVPlayer.hasHTML5Video || _s.videoType_str == FWDEVPlayer.YOUTUBE){
				error = e.text;
				if(window.console) console.log(e.text);
				if(_s.main_do) _s.main_do.addChild(_s.info_do);
				if(_s.info_do) _s.info_do.showText(error);
				
				if(_s.controller_do){
					_s.controller_do.disableMainScrubber();
					if(!_s._d.showControllerWhenVideoIsStopped_bl) _s.controller_do.hide(!_s.isMobile_bl, true);
					_s.hideClickScreen();
					_s.hider.stop();
				}
				
			}else{
				error = e;
				if(_s.main_do) _s.main_do.addChild(_s.info_do);
				if(_s.info_do) _s.info_do.showText(error);
			}
		
			if(_s.logo_do) _s.logo_do.hide(false);

			_s.preloader_do.hide(false);
			_s.preloader_do.stopPreloader();
			_s.showCursor();
			
			_s.dispatchEvent(FWDEVPlayer.ERROR, {error:error});
		};
		
		_s.videoScreenSafeToScrubbHandler = function(){
			
			if(_s.isCasting) return;
			
			if(_s.controller_do){
				if(_s.isAdd_bl){
					_s.controller_do.disableMainScrubber();
					if(_s._d.showSkipButton_bl){
						if(_s._d.timeToHoldAds != 0) _s.adsStart_do.show(true);
						if(_s._d.adsThumbnailPath_str && _s._d.adsThumbnailPath_str != "none") _s.adsStart_do.loadThumbnail(_s._d.adsThumbnailPath_str);
					}
					_s.positionAds();
				}else{
					_s.controller_do.enableMainScrubber();
				}
				
				if(_s.controller_do){
					if(!_s.isQualityChanging_bl) _s.controller_do.disableSubtitleButton();
					if(!_s.isAdd_bl) _s.controller_do.enableAtbButton();
					clearTimeout(_s.hideController_to);
					_s.controller_do.show(true);
				} 

				if(_s.isAdd_bl || (_s.IMA && _s.IMA.isPlaying)){
					// Ingnore controller tooltip and thumbnails preview
				}else{
					if(_s.customContextMenu_do) _s.customContextMenu_do.enable();
					_s.loadSubtitle(_s._d.subtitlePath_str);
					_s._d.tempShowMainScrubberToolTipLabel_bl = _s._d.showMainScrubberToolTipLabel_bl;
				
					if((_s._d.thumbnailsPreview || _s._d.thumbnailsPreview == 'auto')
					&& (_s.videoType_str == FWDEVPlayer.VIDEO || _s.videoType_str == FWDEVPlayer.HLS_JS)
					&& _s._d.thumbnailsPreview){
						_s._d.tempShowMainScrubberToolTipLabel_bl = false;
						_s.controller_do.setupThumbnailsPreview();
						_s.controller_do.thumbnailsPreview_do.load(_s._d.thumbnailsPreview, _s.videoType_str, _s.videoSource_str, _s.videoScreen_do.video_el);
					}else{
						if(_s._d.showMainScrubberToolTipLabel_bl) _s._d.tempShowMainScrubberToolTipLabel_bl = true;
					}
				}
				
				if(!_s.isAdd_bl && _s.controller_do.ytbQualityButton_do){
					_s.controller_do.ytbQualityButton_do.enable();
				}
				
				if(!_s.isAdd_bl && _s.controller_do.playbackRateButton_do){
					_s.controller_do.enablePlaybackRateButton();
				}

				if(!_s.isAdd_bl && _s.controller_do){
					 if(_s.controller_do.downloadButton_do) _s.controller_do.downloadButton_do.enable();
					 if(_s.controller_do.rewindButton_do) _s.controller_do.rewindButton_do.enable();
					 _s.controller_do.enableAtButton();
				}

				if(_s.isQualityChanging_bl && !_s.isAdd_bl){
					_s.scrubbAtTime(_s.curDurration);
					_s.curDurration = 0;
					_s.isQualityChanging_bl = false;
				}
				
				_s.hider.start();
			}
		
			_s.showClickScreen();
			setTimeout(function(){
				if(_s.totalDuration && _s.controller_do) _s.controller_do.positionAdsLines(_s.totalDuration);
			}, 500);

			var args = FWDEVPUtils.getHashUrlArgs(window.location.hash);
			
			if(_s.getStartTimeStamp("t") != "00:00:00"){
				if(args['evpi']){
					if(args['evpi'] == _s.instanceName_str) _s.scrubbAtTime(_s.getStartTimeStamp("t"));
				}else{
					_s.scrubbAtTime(_s.getStartTimeStamp("t"));
				}
			}

			if(document.cookie && _s._d.useResumeOnPlay_bl){
				if(FWDEVPUtils.getCookie("fwdevp_video_path") && FWDEVPUtils.getCookie("fwdevp_time") 
				   && FWDEVPUtils.getCookie("fwdevp_video_path") == _s.videoSourcePath_str && !_s.isAdd_bl){
					var curTime = FWDEVPUtils.getCookie("fwdevp_time");
					if(!_s.rmsPlayed_bl){
						_s.scrubbAtTime(FWDEVPUtils.getCookie("fwdevp_time"));
					}
				}
			}
			
			_s.setupAPT();
			_s.dispatchEvent(FWDEVPlayer.SAFE_TO_SCRUB);
		};
		
		_s.videoScreenStopHandler = function(e){
			
			if(_s.main_do) if(_s.main_do.contains(_s.info_do)) _s.main_do.removeChild(_s.info_do);
			
			_s.videoPoster_do.allowToShow_bl = true;
			_s.isPlaying_bl = false;
			
			clearTimeout(_s.hideController_to);
			if(_s.controller_do){
				_s.controller_do.disableMainScrubber();
				_s.controller_do.showPlayButton();
				_s.controller_do.updateMainScrubber(0);
				if(!_s._d.showControllerWhenVideoIsStopped_bl){
					_s.hideController_to = setTimeout(function(){
						_s.controller_do.hide(true, true);
					}, 200);
				}else{
					_s.controller_do.show(true);
				}
				_s.hider.stop();
			}
			
			if(_s.ytb_do && _s.videoType_str == FWDEVPlayer.YOUTUBE){
				_s.ytb_do.stopVideo();
			}
			
			if(_s.logo_do) _s.logo_do.hide(false);
			
			_s.hideClickScreen();
			_s.hider.reset();
			_s.showCursor();
			_s.dispatchEvent(FWDEVPlayer.STOP);
		};
		
		_s.videoScreenPlayHandler = function(){
			FWDEVPlayer.keyboardCurInstance = _s;
			
			if(_s.videoType_str == FWDEVPlayer.YOUTUBE
			   && _s.ytb_do && _s.ytb_do.isStopped_bl) return;

			_s.videoPoster_do.hide();
			
			_s.callVastEvent("resume");
			_s.isPlaying_bl = true;
			_s.hasHlsPlayedOnce_bl = true;
			
			if(_s.isMobile_bl){
				if(FWDEVPlayer.videoStartBehaviour == FWDEVPlayer.STOP_ALL_VIDEOS){
					FWDEVPlayer.stopAllVideos(_s);
				}
			}else{
				if(FWDEVPlayer.videoStartBehaviour == FWDEVPlayer.PAUSE_ALL_VIDEOS){
					FWDEVPlayer.pauseAllVideos(_s);
				}
			}
			
			if(_s.logo_do && !_s.isIMA) _s.logo_do.show(true);
			  
			if(_s.controller_do){
				_s.controller_do.showPauseButton();
				clearTimeout(_s.hideController_to);
				_s.controller_do.show(true);
			}
			
			if(_s.popw_do) _s.popw_do.hide();
			
			if(_s.largePlayButton_do) _s.hideLargePlayButton();
			_s.hider.start();
			_s.showCursor();
			
			if(_s.isAdd_bl) _s.isQualityChangingError_bl = _s.isQualityChanging_bl = false;
			if(_s.playAtTime_bl && !_s.isAdd_bl) _s.scrubbAtTime(_s._d.scrubAtTimeAtFirstPlay);
			_s.playAtTime_bl = false;
			
			if(_s.isAdd_bl && !_s.hasStartedToPlay_bl) _s.scrubbAtTime(0);
		
			if(_s.wasAdd_bl && !_s.isAdd_bl){
				if(FWDEVPUtils.isSafari
				 || _s.videoType_str == FWDEVPlayer.VIMEO
				 || _s.videoType_str == FWDEVPlayer.DASH){
					clearTimeout(_s.playAfterAd_to);
					_s.playAfterAd_to = setTimeout(function(){
						_s.wasAdd_bl = false;
						_s.scrubbAtTime(_s.scrubAfterAddDuration);
					}, 1000);
				}else{
					_s.wasAdd_bl = false;
					_s.scrubbAtTime(_s.scrubAfterAddDuration);
				}
			}
			
			if(!_s.hasStartedToPlay_bl && _s._d.startAtTime && !_s.isAdd_bl){
				_s.scrubbAtTime(_s._d.startAtTime);
			}
			
			if(!_s.hasStartedToPlay_bl && _s.castStartAtTime && !_s.isAdd_bl){
				_s.scrubbAtTime(_s.castStartAtTime);
				_s.castStartAtTime = undefined;
			}
			
			if(_s.opener_do) _s.opener_do.showPauseButton();
			
			_s.hasStartedToPlay_bl = true;

			_s.dispatchEvent(FWDEVPlayer.PLAY);
		};
		
		_s.videoScreenPauseHandler = function(){
			if(_s.isCasting) return;
			if(_s.videoType_str == FWDEVPlayer.YOUTUBE
			   && _s.ytb_do && _s.ytb_do.isStopped_bl) return;
			
			_s.isPlaying_bl = false;
			_s.callVastEvent("pause");
			
			if(_s.controller_do) _s.controller_do.showPlayButton(); 
			if(_s.largePlayButton_do && !_s._d.showAnnotationsPositionTool_bl && !_s.useWithoutVideoScreen_bl && !_s.notShowPlayBtnExternal) _s.showLargePlayButton();
			_s.notShowPlayBtnExternal = false;
			if(_s.controller_do) _s.controller_do.show(true);
			if(_s.logo_do && !_s.useWithoutVideoScreen_bl && !_s.useWithoutVideoScreen_bl) _s.logo_do.show(true);
			_s.hider.stop();
			_s.hider.reset();
			_s.showCursor();
			if(_s.videoType_str != FWDEVPlayer.VIMEO) _s.showClickScreen();
			
			if(_s.popw_do){
				var isShareWIndowShowed_bl = _s.shareWindow_do && _s.shareWindow_do.isShowed_bl;
				var isEmbedWIndowShowed_bl = _s.embedWindow_do && _s.embedWindow_do.isShowed_bl;

				if(!isShareWIndowShowed_bl && !isEmbedWIndowShowed_bl)
				_s.popw_do.show();
			}
			if(_s.opener_do) _s.opener_do.showPlayButton();
			
			_s.dispatchEvent(FWDEVPlayer.PAUSE);
		};
		
		_s.videoScreenUpdateHandler = function(e){
			var percent;	
			
			if(FWDEVPlayer.hasHTML5Video || _s.videoType_str == FWDEVPlayer.YOUTUBE && _s.videoType_str != FWDEVPlayer.IMAGE && _s.videoType_str != FWDEVPlayer.IFRAME){
				percent = e.percent;
				if(_s.controller_do) _s.controller_do.updateMainScrubber(percent);
			}else{
				percent = e;
				if(_s.controller_do) _s.controller_do.updateMainScrubber(percent);
			}
			_s.dispatchEvent(FWDEVPlayer.UPDATE, {percent:percent});
		};
		
		_s.videoScreenUpdateSubtitleHandler = function(e){
			_s.subtitle_do.updateSubtitle(e.curTime);
		}
		
		_s.videoScreenUpdateTimeHandler = function(e, e2, e3, stopHandler){
			if(_s.isCasting) return;
			if(_s.prevSeconds != Math.round(e.seconds)) _s.totalTimePlayed += 1;
			_s.totalTimeInSeconds = Math.round(e.totalTimeInSeconds);
			_s.totalTimeInMilliseconds = e.totalTimeInSeconds;
			_s.curTimeInSecond = Math.round(e.seconds);
			_s.curTimeInmilliseconds = e.seconds;
			_s.prevSeconds =  Math.round(e.seconds)
			_s.totalPercentPlayed = _s.totalTimePlayed/e.totalTimeInSeconds;

			if(!isFinite(_s.totalPercentPlayed)) _s.totalPercentPlayed = 0;
		
			if(_s.controller_do 
			   && !_s.controller_do.isMainScrubberScrubbing_bl
			   && _s.controller_do.atb
			   && _s.controller_do.atb.isShowed_bl
			   && !_s.controller_do.atb.scrub){
				var a = _s.totalTimeInSeconds * _s.controller_do.atb.pa;
				var b = _s.totalTimeInSeconds * _s.controller_do.atb.pb;
				
				if(_s.prevCurTimeInSeconds != _s.curTimeInSecond){
					_s.prevCurTimeInSeconds = _s.curTimeInSecond;
					if(_s.curTimeInSecond < a){
						_s.scrub(_s.controller_do.atb.pa);
					}else if(_s.curTimeInSecond > b){
						_s.scrub(_s.controller_do.atb.pa);
					}
				}	
			}

			if(_s.isAdd_bl){
				if(_s.totalPercentPlayed >= .25 && _s.callFirstQuartile){
					_s.callVastEvent("firstQuartile");
					_s.callFirstQuartile = false;
				}else if(_s.totalPercentPlayed >= .5 && _s.callMidpoint){
					_s.callVastEvent("midpoint");
					_s.callMidpoint = false;
				}else if(_s.totalPercentPlayed >= .75 && _s.callThirdQuartile){
					_s.callVastEvent("thirdQuartile");
					_s.callThirdQuartile = false;
				}
			}
			
			var time;
			var seconds;
			if(FWDEVPlayer.hasHTML5Video || _s.videoType_str == FWDEVPlayer.YOUTUBE || _s.videoType_str == FWDEVPlayer.HLS_JS || _s.videoType_str == FWDEVPlayer.VIMEO){
				_s.curTime = e.curTime;
				_s.totalTime = e.totalTime;
				time = _s.curTime + "/" + _s.totalTime;
				seconds = Math.round(e.seconds);
				if(_s.controller_do) _s.controller_do.updateTime(time);
			}else{
				_s.curTime = e;
				_s.totalTime = e2;
				time = _s.curTime + "/" + _s.totalTime;
				seconds = Math.round(e3);
				if(e == undefined || e2 ==  undefined) time = "00:00/00:00";
				if(_s.controller_do) _s.controller_do.updateTime(time);
			}
		
			if(stopHandler) return;
			
			if(!_s.isAdd_bl){
				if(_s.totalTime.length>5){
					_s.totalDuration = FWDEVPUtils.getSecondsFromString(_s.totalTime);
				}else{
					_s.totalDuration = FWDEVPUtils.getSecondsFromString("00:" + _s.totalTime);
				}
			}
			
			if(_s.isAdd_bl && _s._d.showSkipButton_bl){
				if(_s._d.timeToHoldAds > seconds){
					_s.adsStart_do.updateText(_s._d.skipToVideoText_str + Math.abs(_s._d.timeToHoldAds - seconds));
					_s.adsSkip_do.hide(false);
					if(_s.videoType_str == FWDEVPlayer.IMAGE || _s.videoType_str == FWDEVPlayer.IFRAME){
						_s.adsStart_do.show(true);
					}
				}else{
					_s.adsStart_do.hide(true);
					if(_s._d.timeToHoldAds != 0) _s.adsSkip_do.show(true);
				}
			}
			
			_s.currentSecconds = seconds;
			
			if(!_s.isAdd_bl && _s.popupAds_do) _s.popupAds_do.update(seconds);
			if(!_s.isAdd_bl && _s.annotations_do) _s.annotations_do.update(seconds);
			if(seconds != 0 && !_s.isAdd_bl) _s.curDurration = seconds;
		
			if(_s._d.cuePointsSource_ar){
				for(var i=0; i<_s._d.cuePointsSource_ar.length; i++){
					var cuePoint = _s._d.cuePointsSource_ar[i];
					if(cuePoint.timeStart == seconds){
						if(_s._d.executeCuepointsOnlyOnce_bl){
							if(!cuePoint.isPlayed_bl) eval(cuePoint.javascriptCall);
						}else{
							eval(cuePoint.javascriptCall);
						}
						cuePoint.isPlayed_bl = true;
					}
				}
			}

			if(!_s.isAdd_bl && seconds != 0 && _s.isPlaying_bl){
				 _s.updateAds(seconds);
			}

			if(_s.isIMA && !_s.IMA.started){
				_s.IMA.updateCuepointLines(seconds);
			}
			
			if(_s.isPlaying_bl && FWDEVPUtils.getSecondsFromString(_s._d.stopAtTime) <= seconds) _s.stop();

			if(FWDEVPUtils.getSecondsFromString(_s.getStartTimeStamp("e"))){
				if(_s.curTimeInSecond >= parseInt(FWDEVPUtils.getSecondsFromString(_s.getStartTimeStamp("e")))) _s.stop();
			}
				
			_s.dispatchEvent(FWDEVPlayer.UPDATE_TIME, {currentTime:_s.curTime, totalTime:_s.totalTime});
		};
		
		_s.videoScreenLoadProgressHandler = function(e){
			if(FWDEVPlayer.hasHTML5Video || _s.videoType_str == FWDEVPlayer.YOUTUBE){
				if(_s.controller_do) _s.controller_do.updatePreloaderBar(e.percent);
			}else if(_s.videoType_str == FWDEVPlayer.VIDEO){
				if(_s.controller_do) _s.controller_do.updatePreloaderBar(e);
			}
		};
		
		_s.videoScreenStartToBuferHandler = function(){
			if(_s.showPreloader_bl){
				_s.preloader_do.show(false);
				_s.preloader_do.startPreloader();
			} 
		};
		
		_s.videoScreenStopToBuferHandler = function(){
			_s.preloader_do.hide(false);
			_s.preloader_do.stopPreloader();
		};
		
		_s.videoScreenPlayCompleteHandler = function(e, buttonUsedToSkipAds){
			_s.adDone_bl = true;
			
			_s.callVastEvent("complete");
			
			if(_s.isIMA && _s.IMA.hasPostRoll && _s.curTimeInSecond >= _s.totalTimeInSeconds - 1){
				_s.IMA.playPostRoll();
				return;
			}
			
			if(!_s.isAdd_bl && _s._d.redirectURL){
				if(_s._d.redirectTarget == "_self"){
					location.replace(_s._d.redirectURL);
				}else{
					window.open(_s._d.redirectURL, _s._d.redirectTarget);
				}
			}
		
			var tempIsAdd_bl = _s.isAdd_bl;
			if(_s.isAdd_bl){
				if(_s._d.openNewPageAtTheEndOfTheAds_bl && _s._d.adsPageToOpenURL_str != "none" && !buttonUsedToSkipAds){
					if(_s._d.adsPageToOpenTarget_str == "_self"){
						location.href = _s._d.adsPageToOpenURL_str;
					}else{
						window.open(_s._d.adsPageToOpenURL_str, _s._d.adsPageToOpenTarget_str);
					}
				}
				
				_s.isAdd_bl = false;
			
				// Set new source and check for second source!
				_s.isQualityChangingError_bl = true;
				_s.updateAds(_s.curDurration);
				
				_s.wasAdd_bl = true;
				if(buttonUsedToSkipAds && _s.videoType_str == FWDEVPlayer.VIDEO){	
					_s.play();
				}else{
					if(!_s.isMobile_bl && _s.videoType_str != FWDEVPlayer.HLS_JS) _s.play();
				}	
				_s.wasAdHLS = true;
				_s.callVastEvent('complete');
			}
			
			if(!tempIsAdd_bl){
				_s.wasAdd_bl = false;
				if((_s.lightBox_do && _s.lightBox_do.isShowed_bl && _s._d.clsLghtbPlayFinish)){
					_s.stop();
					_s.lightBox_do.closeButtonOnStartHandler();
				}

				if(_s._d.loop_bl){
					_s.scrub(0);
					_s.play();
				}else{
					_s.stop();
				}

				_s.dispatchEvent(FWDEVPlayer.PLAY_COMPLETE);
			}
			
			if(_s.hider) _s.hider.reset();
		};
		

		//##########################################//
		/* Setup annotations */
		//##########################################//
		_s.setupAnnotations = function(){
			FWDEVPAnnotations.setPrototype();
			_s.annotations_do = new FWDEVPAnnotations(_s, _s._d);
			_s.main_do.addChild(_s.annotations_do);
		};
		

		//##########################################//
		/* Setup skip adds buttons */
		//##########################################//
		_s.setupAdsStart = function(){
			FWDEVPAdsStart.setPrototype();
			_s.adsStart_do = new FWDEVPAdsStart(
					_s._d.adsButtonsPosition_str, 
					_s._d.adsBorderNormalColor_str, 
					"", 
					_s._d.adsBackgroundPath_str,
					_s._d.adsTextNormalColor);
			
			FWDEVPAdsButton.setPrototype();
			_s.adsSkip_do = new FWDEVPAdsButton(
					_s,
					_s._d.skipIconPath_img,
					_s._d.skipIconSPath_str,
					_s._d.skipToVideoButtonText_str,
					_s._d.adsButtonsPosition_str, 
					_s._d.adsBorderNormalColor_str, 
					_s._d.adsBorderSelectedColor_str, 
					_s._d.adsBackgroundPath_str,
					_s._d.adsTextNormalColor,
					_s._d.adsTextSelectedColor,
					_s._d.useHEX,
					_s._d.nBC,
					_s._d.sBC);
			_s.adsSkip_do.addListener(FWDEVPAdsButton.MOUSE_UP, _s.skipAdsMouseUpHandler);
			
			
			_s.main_do.addChild(_s.adsSkip_do);
			_s.main_do.addChild(_s.adsStart_do);
		};
		
		_s.skipAdsMouseUpHandler = function(e){
			if(e.preventDefault) e.preventDefault();
			
			_s.callVastEvent("skip");
			_s.videoScreenPlayCompleteHandler(e, true);
		};
		
		_s.positionAds = function(animate){
			if(!_s._d.showSkipButton_bl) return;
			var finalX;
			var finalY;
			var mbl = false;
			if(_s.sW < 600) mbl = true;
		
			_s.adsSkip_do.resize();

			if(_s._d.adsButtonsPosition_str == "left"){
				finalX = 0;
			}else{
				finalX = _s.sW;
			}
			
			if(_s.controller_do && _s.controller_do.isShowed_bl){
				finalY = _s.sH - _s.adsStart_do.h - _s._d.controllerHeight - 30;
			}else{
				finalY = _s.sH - _s.adsStart_do.h - _s._d.controllerHeight;
			}
			
			FWDAnimation.killTweensOf(_s.adsStart_do);
			if(animate){
				FWDAnimation.to(_s.adsStart_do, .8, {y:finalY, ease:Expo.easeInOut});
			}else{
				_s.adsStart_do.setY(finalY);
			}
			
			_s.adsStart_do.setX(finalX);
			
			if(_s._d.adsButtonsPosition_str == "left"){
				finalX = 0;
			}else{
				finalX = _s.sW;
			}
			
			if(_s.controller_do && _s.controller_do.isShowed_bl){
				finalY = _s.sH - _s.adsSkip_do.h - _s._d.controllerHeight - 30;
			}else{
				finalY = _s.sH - _s.adsSkip_do.h - _s._d.controllerHeight;
			}
			
			FWDAnimation.killTweensOf(_s.adsSkip_do);
			if(animate){
				FWDAnimation.to(_s.adsSkip_do, .8, {y:finalY, ease:Expo.easeInOut});
			}else{
				_s.adsSkip_do.setY(finalY);
			}
			
			_s.adsSkip_do.setX(finalX);
			
		};
		
		
		//##########################################//
		/* Setup embed window */
		//##########################################//
		_s.setupShareWindow = function(){
			FWDEVPShareWindow.setPrototype();
			_s.shareWindow_do = new FWDEVPShareWindow(_s._d, _s);
			_s.shareWindow_do.addListener(FWDEVPShareWindow.HIDE_COMPLETE, _s.shareWindowHideCompleteHandler);
		};
		
		_s.shareWindowHideCompleteHandler = function(){
			
			if(_s.isVideoPlayingWhenOpenWindows_bl){
				_s.resume();
			}
			
			if(_s.controller_do){
				_s.controller_do.shareButton_do.isDisabled_bl = false;
				_s.controller_do.shareButton_do.setNormalState(true);
			}
		};
		
		
		//##########################################//
		/* Setup login window */
		//##########################################//
		_s.setupLoginWindow =  function(){
			FWDEVPPassword.setPrototype();
			_s.lg_do = new FWDEVPPassword(_s._d, _s, true);
		}
		

		//##########################################//
		/* Setup embed window */
		//##########################################//
		_s.setupPasswordWindow = function(){
			FWDEVPPassword.setPrototype();
			_s.passWindow_do = new FWDEVPPassword(_s._d, _s);
			_s.passWindow_do.addListener(FWDEVPPassword.CORRECT, _s.passordCorrect);
			_s.passWindow_do.addListener(FWDEVPPassword.HIDE_COMPLETE, _s.passordHideComplete);
		};
		
		_s.passordCorrect = function(){
			_s.passWindow_do.hide();
			_s.hasPassedPassowrd_bl = true;
			_s.play();
		}

		_s.passordHideComplete = function(){
			if(_s.isStopped_bl){
				_s.showLargePlayButton()
			}
		}
		

		//##########################################//
		/* Setup embed window */
		//##########################################//
		_s.setupEmbedWindow = function(){
			FWDEVPEmbedWindow.setPrototype();
			_s.embedWindow_do = new FWDEVPEmbedWindow(_s._d, _s);
			_s.embedWindow_do.addListener(FWDEVPEmbedWindow.ERROR, _s.embedWindowErrorHandler);
			_s.embedWindow_do.addListener(FWDEVPEmbedWindow.HIDE_COMPLETE, _s.embedWindowHideCompleteHandler);
		};
		
		_s.embedWindowErrorHandler = function(e){
			_s.main_do.addChild(_s.info_do);
			_s.info_do.showText(e.error);
		};
		
		_s.embedWindowHideCompleteHandler = function(){
		
			if(_s.isVideoPlayingWhenOpenWindows_bl) _s.resume();
		
			if(_s.controller_do){
				_s.controller_do.embedButton_do.isDisabled_bl = false;
				_s.controller_do.embedButton_do.setNormalState(true);
			}
		};
		
		_s.copyLinkButtonOnMouseOver = function(){
			if(!_s.embedWindow_do.isShowed_bl) return
			_s.embedWindow_do.copyLinkButton_do.setSelectedState();
		};
		
		_s.copyLinkButtonOnMouseOut = function(){
			if(!_s.embedWindow_do.isShowed_bl) return
			_s.embedWindow_do.copyLinkButton_do.setNormalState();
		};
		
		_s.getLinkCopyPath = function(){
			if(!_s.embedWindow_do.isShowed_bl) return
			return _s.embedWindow_do.linkToVideo_str;
		};
		
		_s.embedkButtonOnMouseOver = function(){
			if(!_s.embedWindow_do.isShowed_bl) return
			_s.embedWindow_do.copyEmbedButton_do.setSelectedState();
		};
		
		_s.embedButtonOnMouseOut = function(){
			if(!_s.embedWindow_do.isShowed_bl) return
			_s.embedWindow_do.copyEmbedButton_do.setNormalState();
		};
		
		_s.getEmbedCopyPath = function(){
			return _s.embedWindow_do.finalEmbedCode_str;
		};
		
		
		//######################################//
		/* Add keyboard support */
		//######################################//
		_s.setInputs = function(){
			var numInputs = document.querySelectorAll('input');
			for (var i = 0; i < numInputs.length; i++) {
				numInputs[i].addEventListener("mousedown", _s.inputFocusInHandler);
				numInputs[i].addEventListener("touchstart", _s.inputFocusInHandler);
			}

			var numTextA = document.querySelectorAll('textarea');
			for (var i = 0; i < numTextA.length; i++) {
				numTextA[i].addEventListener("mousedown", _s.inputFocusInHandler);
				numTextA[i].addEventListener("touchstart", _s.inputFocusInHandler);
			}
		}
		
		_s.inputFocusInHandler = function(e){
			_s.curInput = e.target;
			setTimeout(function(){
				if(_s.hasPointerEvent_bl){
					window.addEventListener("pointerdown", _s.inputFocusOutHandler);
				}else if(window.addEventListener){
					window.addEventListener("mousedown", _s.inputFocusOutHandler);
					window.addEventListener("touchstart", _s.inputFocusOutHandler);
				}
				FWDEVPlayer.isSearchedFocused_bl = true;
			}, 50);
		}
		
		_s.inputFocusOutHandler = function(e){
			
			var vc = FWDEVPUtils.getViewportMouseCoordinates(e);	
			if(!FWDEVPUtils.hitTest(_s.curInput, vc.screenX, vc.screenY)){
				if(_s.hasPointerEvent_bl){
					window.removeEventListener("pointerdown", _s.inputFocusOutHandler);
				}else if(window.removeEventListener){
					window.removeEventListener("mousedown", _s.inputFocusOutHandler);
					window.removeEventListener("touchstart", _s.inputFocusOutHandler);
				}
				FWDEVPlayer.isSearchedFocused_bl = false;
				return;
			}
		};
		
		_s.addKeyboardSupport = function(){
			_s.setInputs();
			document.addEventListener("keydown",  _s.onKeyDownHandler);	
			document.addEventListener("keyup",  _s.onKeyUpHandler);	
		};

		_s.removeKeyboardSupport = function(){
			_s.setInputs();
			document.removeEventListener("keydown",  _s.onKeyDownHandler);	
			document.removeEventListener("keyup",  _s.onKeyUpHandler);	
		};
		
		_s.onKeyDownHandler = function(e){
			if(!_s._d.addKeyboardSupport_bl) return;
			if((_s.isSpaceDown_bl || !_s.hasStartedToPlay_bl || FWDEVPlayer.isSearchedFocused_bl) && !_s.isCasting) return;
			_s.isSpaceDown_bl = true;
			if(e.preventDefault) e.preventDefault();
			
			//pause
			if (e.keyCode == 32){
				
				if(_s != FWDEVPlayer.keyboardCurInstance 
				   && (FWDEVPlayer.videoStartBehaviour == "pause" || FWDEVPlayer.videoStartBehaviour == "none")) return
				_s.stickOnCurrentInstanceKey_bl = true;
			
				if(_s.isCasting){
					_s.cc.togglePlayPause();
				}else if(_s.videoType_str == FWDEVPlayer.IMAGE || _s.videoType_str == FWDEVPlayer.IFRAME){
					if(_s.isImageAdsPlaying_bl){
						_s.stopUpdateImageInterval();
					}else{
						_s.startUpdateImageInterval();
					}
				}else if(_s.isIMA && _s.IMA.started){
					_s.IMA.togglePlayPause();
				}else if(_s.videoType_str == FWDEVPlayer.YOUTUBE){
					if(!_s.ytb_do.isSafeToBeControlled_bl) return;
					_s.ytb_do.togglePlayPause();
				}else if(_s.videoType_str == FWDEVPlayer.VIMEO){
					if(!_s.vimeo_do.isSafeToBeControlled_bl) return;
					_s.vimeo_do.togglePlayPause();
				}else if(_s.videoType_str == FWDEVPlayer.MP3){
					if(!_s.audioScreen_do.isSafeToBeControlled_bl) return;
					_s.audioScreen_do.togglePlayPause();
				}else if(FWDEVPlayer.hasHTML5Video){
					if(!_s.videoScreen_do.isSafeToBeControlled_bl) return;
					if(_s.videoScreen_do) _s.videoScreen_do.togglePlayPause();
				}
				if(e.preventDefault) e.preventDefault();
				return false;
			}else if (e.keyCode == 70 && !_s.useWithoutVideoScreen_bl){
				if(_s.isFullScreen_bl){
					_s.goNormalScreen();
				}else{
					_s.goFullScreen();
				}
			}else if (e.keyCode == 77){
				if(_s.volume != 0) _s.lastVolume = _s.volume;
				if(_s.volume != 0){
					_s.volume = 0;
				}else{
					_s.volume = _s.lastVolume;
				}
				_s.setVolume(_s.volume);
			}else if (e.keyCode == 38){
				_s.volume += .1;
				if(_s.volume > 1) _s.volume = 1;
				_s.setVolume(_s.volume);
			}else if (e.keyCode == 40){
				_s.volume -= .1;
				if(_s.volume < 0) _s.volume = 0;
				_s.setVolume(_s.volume);
			}else if (e.keyCode == 77){
				if(_s.volume < 0) _s.volume = 0;
				_s.setVolume(_s.volume);
			}else if (e.keyCode == 39 && !_s.isAdd_bl && !_s.isIMA){
				var curTime = _s.getCurrentTime();
				if(curTime.length == 5) curTime = "00:" + curTime;
				if(curTime.length == 7) curTime = "0" + curTime;
				curTime = FWDEVPUtils.getSecondsFromString(curTime);
				curTime += 5;
				curTime = FWDEVPUtils.formatTime(curTime);
				if(curTime.length == 5) curTime = "00:" + curTime;
				if(curTime.length == 7) curTime = "0" + curTime;
				_s.scrubbAtTime(curTime);
			}else if (e.keyCode == 37 && !_s.isAdd_bl && !_s.isIMA){
				var curTime = _s.getCurrentTime();
				if(curTime.length == 5) curTime = "00:" + curTime;
				if(curTime.length == 7) curTime = "0" + curTime;
				curTime = FWDEVPUtils.getSecondsFromString(curTime);
				curTime -= 5;
				curTime = FWDEVPUtils.formatTime(curTime);
				if(curTime.length == 5) curTime = "00:" + curTime;
				if(curTime.length == 7) curTime = "0" + curTime;
				_s.scrubbAtTime(curTime);
			}
		};
		
		_s.onKeyUpHandler = function(e){
			if(!_s._d.addKeyboardSupport_bl) return;
			_s.isSpaceDown_bl = false;
		};

		
		//####################################//
		/* Setup hider */
		//####################################//
		_s.setupHider = function(){
			FWDEVPHider.setPrototype();
			_s.hider = new FWDEVPHider(_s.main_do, _s.controller_do, _s._d.controllerHideDelay);
			_s.hider.addListener(FWDEVPHider.SHOW, _s.hiderShowHandler);
			_s.hider.addListener(FWDEVPHider.HIDE, _s.hiderHideHandler);
			_s.hider.addListener(FWDEVPHider.HIDE_COMPLETE, _s.hiderHideCompleteHandler);
		};
		
		_s.hiderShowHandler = function(){
			if(_s.isCasting) return;
			
			if(_s.controller_do && _s.isPlaying_bl){
				clearTimeout(_s.hideController_to);
				_s.controller_do.show(true);
			} 
			if(_s.logo_do && _s._d.hideLogoWithController_bl && _s.isPlaying_bl && !_s.useWithoutVideoScreen_bl) _s.logo_do.show(true);
			_s.showCursor();
			if(_s.isAdd_bl && _s._d.showSkipButton_bl){
				_s.positionAds(true);
				_s.adsStart_do.showWithOpacity();
				_s.adsSkip_do.showWithOpacity();	
			}
			_s.subtitle_do.position(true);
			if(_s.popupAds_do) _s.popupAds_do.position(true);
			_s.dispatchEvent(FWDEVPlayer.HIDER_SHOW);
		};
		
		_s.hiderHideHandler = function(){
			if(_s.isCasting) return;
			if(_s.videoType_str == FWDEVPlayer.VIMEO && !_s._d.showDefaultControllerForVimeo_bl) return;
			
			if(_s.controller_do && _s._d.showYoutubeQualityButton_bl && FWDEVPUtils.hitTest(_s.controller_do.ytbButtonsHolder_do.screen, _s.hider.globalX, _s.hider.globalY)){
				_s.hider.reset();
				return;
			}

			if(_s.controller_do && _s.controller_do.atb && _s.controller_do.atb.isShowed_bl){
				if(FWDEVPUtils.hitTest(_s.controller_do.atb.mainHolder_do.screen, _s.hider.globalX, _s.hider.globalY)){
					_s.hider.reset();
					return;
				}
			}
			
			if(_s.controller_do && _s._d.showSubtitleButton_bl && FWDEVPUtils.hitTest(_s.controller_do.subtitlesButtonsHolder_do.screen, _s.hider.globalX, _s.hider.globalY)){
				_s.hider.reset();
				return;
			}
			
			if(_s.controller_do && _s._d.showPlaybackRateButton_bl && FWDEVPUtils.hitTest(_s.controller_do.playbackRatesButtonsHolder_do.screen, _s.hider.globalX, _s.hider.globalY)){
				_s.hider.reset();
				return;
			}
			
			if(_s.controller_do && FWDEVPUtils.hitTest(_s.controller_do.screen, _s.hider.globalX, _s.hider.globalY)){
				_s.hider.reset();
				return;
			}
			
			if(_s.controller_do) _s.controller_do.hide(true);
			if(_s.isAdd_bl && _s._d.showSkipButton_bl){
				_s.positionAds(true);
				_s.adsStart_do.hideWithOpacity();
				_s.adsSkip_do.hideWithOpacity();	
			}
			
			if(_s.logo_do && _s._d.hideLogoWithController_bl) _s.logo_do.hide(true);
			if(_s.isFullScreen_bl) _s.hideCursor();
			_s.subtitle_do.position(true);
			if(_s.popupAds_do) _s.popupAds_do.position(true);
			_s.dispatchEvent(FWDEVPlayer.HIDER_HIDE);
		};
		
		_s.hiderHideCompleteHandler = function(){
			if(_s.isCasting) return;
			if(_s.controller_do) _s.controller_do.positionScrollBarOnTopOfTheController();
		};
		
		
		//####################################//
		// API
		//###################################//
		_s.showPlayer = function(){
			if(!_s.isAPIReady_bl) return;
			_s.isShowed_bl = true;
			_s.opener_do.showCloseButton();
			_s.setStageContainerFinalHeightAndPosition(_s.animate_bl);
			if(_s.isMin){
				_s.isMinShowed = true;
				_s.positionOnMin(true);
			}
		};
		
		_s.hidePlayer = function(){
			if(!_s.isAPIReady_bl) return;
			_s.isShowed_bl = false;
			_s.opener_do.showOpenButton();
			_s.setStageContainerFinalHeightAndPosition(_s.animate_bl);
			if(_s.isMin){
				_s.isMinShowed = false;
				_s.positionOnMin(true);
			}
		};
		
		_s.play = function(){
			
			if(!_s.isAPIReady_bl) return;

			if(_s.isCasting){
				_s.cc.play();
				return;
			}
	
			if(_s.videoType_str == FWDEVPlayer.YOUTUBE && !_s.isYoutubeReady_bl){
				if(_s.showPreloader_bl){
				 	_s.preloader_do.show(false);
					_s.preloader_do.startPreloader();
				}
				if(_s.largePlayButton_do && !_s.useWithoutVideoScreen_bl) _s.showLargePlayButton();
				return;
			}
			
			if(_s.videoType_str == FWDEVPlayer.VIMEO && !_s.isVimeoReady_bl){
				if(_s.showPreloader_bl){
					_s.preloader_do.show(false);
					_s.preloader_do.startPreloader();
				}
				if(_s.largePlayButton_do && !_s.useWithoutVideoScreen_bl) _s.showLargePlayButton();
				return;
			}
			
			if(_s.videoType_str == FWDEVPlayer.HLS_JS){
				if(location.protocol.indexOf("file:") >= 0){
					_s.main_do.addChild(_s.info_do);
					_s.info_do.showText("HLS m3u8 videos can't be played local on this browser, please test it online!.");
					return;
				}
			}
			
			if(_s._d.playVideoOnlyWhenLoggedIn_bl){
				if(!_s._d.isLoggedIn_bl){
					if(_s.largePlayButton_do && !_s.useWithoutVideoScreen_bl) _s.showLargePlayButton();
					_s.lg_do.show();
					return;
				}
			}
			
			if(!_s.isAdd_bl && _s._d.videosSource_ar[_s._d.startAtVideoSource]["isPrivate"] && !_s.hasPassedPassowrd_bl && _s.passWindow_do){
				if(_s.largePlayButton_do && !_s.useWithoutVideoScreen_bl) _s.hideLargePlayButton();
				_s.passWindow_do.show();
				_s.dispatchEvent(FWDEVPlayer.PLAY_START);
				return
			}
			_s.hasPassedPassowrd_bl = true;
			_s.isStopped_bl = false;

			if(_s.isMobile_bl){
				FWDEVPlayer.stopAllVideos(_s);
			}else{
				if(FWDEVPlayer.videoStartBehaviour == FWDEVPlayer.PAUSE_ALL_VIDEOS){
					FWDEVPlayer.pauseAllVideos(_s);
				}else if(FWDEVPlayer.videoStartBehaviour == FWDEVPlayer.STOP_ALL_VIDEOS){
					FWDEVPlayer.stopAllVideos(_s);
				}
			}
		
			if(_s.isIMA){
				if(!_s.IMA || _s.isIMA && _s.IMA && !_s.IMA.isReady) return;
				_s.IMA.play();
			}else if(_s.videoType_str == FWDEVPlayer.IMAGE || _s.videoType_str == FWDEVPlayer.IFRAME){
				_s.startUpdateImageInterval();
			}else if(_s.videoType_str == FWDEVPlayer.YOUTUBE && _s.ytb_do){
				_s.ytb_do.play();
				
			}else if(_s.videoType_str == FWDEVPlayer.VIMEO && _s.vimeo_do){
				_s.vimeo_do.play();
			}else if(_s.videoType_str == FWDEVPlayer.MP3){
				if(_s.audioScreen_do){
					_s.audioScreen_do.play();
					if(!FWDEVPUtils.isLocal) _s.audioScreen_do.setupSpectrum();
				}
			}else if(FWDEVPlayer.hasHTML5Video){
			
				if(_s.videoType_str == FWDEVPlayer.HLS_JS && !_s.isHLSManifestReady_bl && window['Hls']){
					_s.videoScreen_do.initVideo();
					_s.setupHLS();
					var source = _s.videoSourcePath_str;
					if(source.indexOf("encrypt:") != -1) source = atob(source.substr(8));
					_s.hlsJS.loadSource(source);
					_s.hlsJS.attachMedia(_s.videoScreen_do.video_el);
					_s.hlsJS.on(Hls.Events.MANIFEST_PARSED,function(e){
						_s.isHLSManifestReady_bl = true;
						_s.parseLevels();
						_s.play();
					});

					// Get qulity levels.

				}else if(_s.dashJS && _s.videoType_str == FWDEVPlayer.DASH && !_s.isDASHManifestReady_bl){
					_s.videoScreen_do.initVideo();
					_s.setupDASH();
					
					_s.dashJS.initialize(_s.videoScreen_do.video_el, _s.videoSourcePath_str, false);
                 	_s.dashJS.attachSource(_s.videoSourcePath_str);

                 	_s.dashJS.on(dashjs.MediaPlayer.events.MANIFEST_LOADED, function(e){
                 		_s.isDASHManifestReady_bl = true;
						setTimeout(_s.play, 100);
                 	});
				}else{
					if(_s.videoScreen_do) _s.videoScreen_do.play();
				}
				
			}
			
			FWDEVPlayer.keyboardCurInstance = _s;
			_s.videoPoster_do.allowToShow_bl = false;
			_s.playStarted = true;
			if(_s.largePlayButton_do) _s.hideLargePlayButton();
			
			_s.videoPoster_do.hide();
			_s.dispatchEvent(FWDEVPlayer.PLAY_START);
		};
		
		_s.pause = function(){
			if(!_s.isAPIReady_bl) return;
			
			if(_s.isCasting){
				_s.cc.pause();
				return;
			}
			
			if(_s.isIMA && _s.IMA){
				_s.IMA.pause();
			}else if(_s.videoType_str == FWDEVPlayer.IMAGE || _s.videoType_str == FWDEVPlayer.IFRAME){
				_s.stopUpdateImageInterval();
			}else if(_s.videoType_str == FWDEVPlayer.YOUTUBE && _s.ytb_do){
				_s.ytb_do.pause();
			}else if(_s.videoType_str == FWDEVPlayer.VIMEO && _s.vimeo_do){
				_s.vimeo_do.pause();
			}else if(_s.videoType_str == FWDEVPlayer.MP3){
				if(_s.audioScreen_do) _s.audioScreen_do.pause();
			}else{
				if(_s.videoScreen_do) _s.videoScreen_do.pause();
			}
		};
		
		_s.resume = function(){
			if(!_s.isAPIReady_bl) return;
			
			if(_s.isCasting){
				_s.cc.play();
			}else if(_s.isIMA && _s.IMA.started){
				_s.IMA.play();
			}else if(_s.videoType_str == FWDEVPlayer.IMAGE || _s.videoType_str == FWDEVPlayer.IFRAME){
				_s.startUpdateImageInterval();
			}else if(_s.videoType_str == FWDEVPlayer.YOUTUBE && _s.ytb_do){
				_s.ytb_do.resume();
			}else if(_s.videoType_str == FWDEVPlayer.VIMEO && _s.vimeo_do){
				_s.vimeo_do.resume();
			}else if(_s.videoType_str == FWDEVPlayer.MP3){
				if(_s.audioScreen_do) _s.audioScreen_do.resume();
			}else if(FWDEVPlayer.hasHTML5Video){
				if(_s.videoScreen_do) _s.videoScreen_do.resume();
			}
		};		
		
		_s.stop = function(source){
			if(!_s.isAPIReady_bl) return;

			if(window["ga"]){
				if(Math.round(_s.totalPercentPlayed * 100)){
					var gaLabel = 'videoPath:' + _s.videoSource_str +  ', percentPlayed:' + Math.round(_s.totalPercentPlayed * 100)  + ', stoppedAtTime:' + _s.getCurrentTime() + ', fullScreen:' +  _s.	isFullScreen_bl + ''
					ga('send', {
					  hitType: 'event',
					  eventCategory: 'videos',
					  eventAction: 'played',
					  eventLabel: gaLabel,
					  nonInteraction: true
					});
				}
			}
			
			if(_s.IMA) _s.IMA.stop();
			_s.isQualityChangingStop_bl = false;
			
			if(_s.isCasting){
				_s.cc.stop();
			}
			
			_s.hlsLevels_ar = null;
			_s.isIMA = undefined;
			_s.isStopped_bl = true;
			_s.hasPassedPassowrd_bl = false;
			_s.isHLSManifestReady_bl = false;
			_s.isDASHManifestReady_bl = false;
			_s.playYoutubeIfLoadedLate_bl = false;
			_s.isPlaying_bl = false;
			_s.totalTimePlayed = 0;
			_s._d.closeVast();
			_s.hideAPT();
			_s.hider.reset();
			_s.destroyHLS();
			_s.destroyDASH();
			clearTimeout(_s.parseQualityLevelsId_to);
			clearTimeout(_s.playAfterAd_to);
			clearTimeout(_s.rewindId_to);
			clearTimeout(_s.load360ScriptsId_to);
			if(_s.popw_do) _s.popw_do.hide();
			
			if(_s.controller_do && _s.controller_do.ytbQualityButton_do){
				_s.controller_do.ytbQualityButton_do.disable();
				_s.controller_do.hideQualityButtons(false);
				_s.controller_do.updateMainScrubber(0);
				_s.controller_do.updatePreloaderBar(0);
			}
			
			if(_s.controller_do){
				if(_s.controller_do.atb) _s.controller_do.atb.hide(true);
				_s.controller_do.disableAtButton();
				if(_s.controller_do.thumbnailsPreview_do) _s.controller_do.thumbnailsPreview_do.remove();
				if(_s.controller_do.subtitleButton_do) _s.controller_do.subtitleButton_do.disable();
				if(_s.controller_do.rewindButton_do) _s.controller_do.rewindButton_do.disable();
				_s.controller_do.disablePlaybackRateButton();
				if(_s.controller_do.ttm) _s.controller_do.ttm.hide();
				if(_s._d.showPlaybackRateButton_bl){
					_s.controller_do.updatePlaybackRateButtons(_s._d.updatePlaybackRateButtons, _s._d.startAtPlaybackIndex);
				}
			}
		
			if(_s.isAdd_bl){
				_s.setPlaybackRate(1);
			}else{
				_s.setPlaybackRate(_s._d.defaultPlaybackRate_ar[_s._d.startAtPlaybackIndex]);
			}
			
			if(_s.videoType_str == FWDEVPlayer.IMAGE || _s.videoType_str == FWDEVPlayer.IFRAME){
				_s.stopUpdateImageInterval();
			}else if(_s.videoType_str == FWDEVPlayer.YOUTUBE && _s.ytb_do){
				_s.ytb_do.stop();
			}else if(_s.videoType_str == FWDEVPlayer.VIMEO){
				if(_s.vimeo_do) _s.vimeo_do.stop();
			}else if(_s.videoType_str == FWDEVPlayer.MP3){
				if(_s.audioScreen_do) _s.audioScreen_do.stop();
			}else{
				_s.videoScreen_do.stop();
			}
			
			clearTimeout(_s.hideController_to);
			if(_s.controller_do){
				if(_s._d.showControllerWhenVideoIsStopped_bl){
					 _s.controller_do.show(true);
				}else{
					_s.hideController_to = setTimeout(function(){
						_s.controller_do.hide(true);
					}, 200);
				}
			}
			_s.videoPoster_do.show();
			if(_s.largePlayButton_do && !_s.useWithoutVideoScreen_bl && !_s.notShowLargePlayButton_bl) _s.showLargePlayButton();
			
			clearInterval(_s.fillScreenId_int);
			_s.subtitle_do.stopToLoadSubtitle();
			_s.subtitle_do.hide();
			_s.hasHlsPlayedOnce_bl = false;
			_s.isSafeToScrub_bl = false;
			_s.hlsState = undefined;
			if(_s.popupAds_do) _s.popupAds_do.hideAllPopupButtons(false);
			if(_s.adsStart_do) _s.adsStart_do.hide(true);
			if(_s.adsSkip_do) _s.adsSkip_do.hide(true);
			if(_s.controller_do) _s.controller_do.hideAdsLines();
			if(_s.annotations_do) _s.annotations_do.update(100000);
			if(_s.customContextMenu_do) _s.customContextMenu_do.disable();
			_s.stopVisualization();
			
			_s.hasStartedToPlay_bl = false;
		};
		
		_s.startToScrub = function(){
			if(!_s.isAPIReady_bl) return;
			if(_s.videoType_str == FWDEVPlayer.YOUTUBE && _s.ytb_do && _s.ytb_do.isSafeToBeControlled_bl){
				_s.ytb_do.startToScrub();
			}else if(_s.videoType_str == FWDEVPlayer.VIMEO && _s.vimeo_do){
				_s.vimeo_do.startToScrub();
			}else if(_s.videoType_str == FWDEVPlayer.MP3){
				if(_s.audioScreen_do) _s.audioScreen_do.startToScrub();
			}else if(FWDEVPlayer.hasHTML5Video){
				if(_s.videoScreen_do) _s.videoScreen_do.startToScrub();
			}
			_s.dispatchEvent(FWDEVPlayer.START_TO_SCRUB);
		};
		
		_s.stopToScrub = function(){
			if(!_s.isAPIReady_bl) return;
			if(_s.videoType_str == FWDEVPlayer.YOUTUBE && _s.ytb_do && _s.ytb_do.isSafeToBeControlled_bl){
				_s.ytb_do.stopToScrub();
			}else if(_s.videoType_str == FWDEVPlayer.VIMEO && _s.vimeo_do){
				_s.vimeo_do.stopToScrub();
			}else if(_s.videoType_str == FWDEVPlayer.MP3){
				if(_s.audioScreen_do) _s.audioScreen_do.stopToScrub();
			}else if(FWDEVPlayer.hasHTML5Video){
				if(_s.videoScreen_do) _s.videoScreen_do.stopToScrub();
			}
			_s.dispatchEvent(FWDEVPlayer.STOP_TO_SCRUB);
		};
		
		_s.scrub = function(percent, time){
			if(!_s.isAPIReady_bl) return;
			if(isNaN(percent)) return;
			if(percent < 0){
				percent = 0;
			}else if(percent > 1){
				percent = 1;
			}
			
			if(_s.videoType_str == FWDEVPlayer.YOUTUBE && _s.ytb_do && _s.ytb_do.isSafeToBeControlled_bl){
				_s.ytb_do.scrub(percent);
			}else if(_s.videoType_str == FWDEVPlayer.VIMEO && _s.vimeo_do){
				_s.vimeo_do.scrub(percent);
			}else if(_s.videoType_str == FWDEVPlayer.MP3){
				if(_s.audioScreen_do) _s.audioScreen_do.scrub(percent);
			}else{
				if(_s.videoScreen_do) _s.videoScreen_do.scrub(percent);	
			}
	
			_s.dispatchEvent(FWDEVPlayer.SCRUB, {percent:percent});
		};
		
		_s.scrubbAtTime = function(duration){
			if(!_s.isAPIReady_bl || !duration) return;
			if(String(duration).indexOf(":") != -1) duration = FWDEVPUtils.getSecondsFromString(duration);

			if(_s.isCasting){
				_s.cc.scrubbAtTime(duration);
			}else if(_s.videoType_str == FWDEVPlayer.YOUTUBE && _s.ytb_do){
				_s.ytb_do.scrubbAtTime(duration);
			}else if(_s.videoType_str == FWDEVPlayer.VIMEO && _s.vimeo_do){
				_s.vimeo_do.scrubbAtTime(duration);
			}else if(_s.videoType_str == FWDEVPlayer.MP3){
				if(_s.audioScreen_do) _s.audioScreen_do.scrubbAtTime(duration);
			}else{
				if(_s.videoScreen_do) _s.videoScreen_do.scrubbAtTime(duration);
			}
		};
		
		_s.share = function(){
			if(!_s.isAPIReady_bl) return;
			_s.shareWindow_do.show();
		}
		
		
		_s.setVolume = function(volume, removeAutoPlay){
			if(!_s.isAPIReady_bl) return;
		
			if(_s.controller_do) _s.controller_do.updateVolume(volume, true);
			if(volume && removeAutoPlay){
				_s._d.autoPlay_bl = false;
				_s.removeAPT();
			} 
			_s.volume = volume;
			
			if(_s.isIMA && _s.IMA) _s.IMA.setVolume(volume);
			
			if(_s.ytb_do){
				_s.ytb_do.setVolume(_s.volume);
			}
			
			if(_s.vimeo_do){
				_s.vimeo_do.setVolume(_s.volume);
			}
			
			if(_s.audioScreen_do){
				_s.audioScreen_do.setVolume(_s.volume);
			}
			
			if(FWDEVPlayer.hasHTML5Video){
				_s.videoScreen_do.setVolume(_s.volume);
			}
			
			if(_s.isCasting){
				_s.cc.setVolume();
			}
				
			_s.dispatchEvent(FWDEVPlayer.VOLUME_SET, {volume:_s.volume});
		};
		
		_s.setPosterSource = function(path, o){
			_s.posterPath_str = path;
			if(!path){
				_s.videoPoster_do.curPath = '';
				_s.videoPoster_do.hide();
				return;
			}
			
			if(!_s.isAPIReady_bl) return;
			var path_ar = path.split(",");
				
			if(_s.isMobile_bl && path_ar[1] != undefined){
				path = path_ar[1];
			}else{
				path = path_ar[0];
			}
			
			if(path.indexOf("encrypt:") != -1) path = atob(path.substr(8));
			
			_s.videoPoster_do.setPoster(_s.posterPath_str, o);
			if(_s.prevPosterSource_str != path && !o) _s.dispatchEvent(FWDEVPlayer.UPDATE_POSTER_SOURCE);
			_s.prevPosterSource_str = path;
		};
		

		//#####################################################//
		/* Update ads */
		//#####################################################//
		_s.updateAds = function(duration, forceSource){
			
			if(_s.videoType_str == FWDEVPlayer.YOUTUBE && !_s.ytb_do) return;
				
			if(_s._d.vastXML && !_s._d.isVastXMLParsed_bl){
				if(_s.controller_do){
					_s.controller_do.createdAdsOnce_bl = false;
					_s.controller_do.resetsAdsLines(true);
				}

				_s.lastCurTime = '00:00'
				_s._d.setVastSource(_s._d.vastXML);
				return;
			} 
			
			if(_s.isAdd_bl) return;

			if(!_s.isAdd_bl && _s._d.adsSource_ar){
				if(_s.controller_do){
					_s._d.fixVmapTimes(_s.totalDuration);
					if(_s.totalDuration){
						_s.controller_do.setupAdsLines(_s._d.adsSource_ar);
						_s.controller_do.positionAdsLines(_s.totalDuration);

						if(_s.popupAds_do){
							if(_s._d.popupAds_ar){
								_s.popupAds_do.resetPopups(_s._d.popupAds_ar);
							}
						}
					}
				}

				if(isNaN(duration)) duration = 0;
		
				for(var i=0; i<_s._d.adsSource_ar.length; i++){
					if(duration >= _s._d.adsSource_ar[i].timeStart && duration <= (_s._d.adsSource_ar[i].timeStart + 1) 
						&& !_s._d.adsSource_ar[i].played_bl/* && duration != _s.prevDuration*/){
						
						_s.isAdd_bl = true;
						if(_s._d.adsSource_ar[i].timeStart != 0) _s.wasAdd_bl = true;
						_s.addSource_str = _s._d.adsSource_ar[i].source;
						_s._d.adsSource_ar[i].played_bl = true;
						_s._d.adsThumbnailPath_str = _s._d.adsSource_ar[i].thumbnailSource;
						_s._d.timeToHoldAds = _s._d.adsSource_ar[i].timeToHoldAds;
						if(_s._d.timeToHoldAds){
							_s._d.showSkipButton_bl = true;
						}else{
							_s._d.showSkipButton_bl = false;
						}						
						_s._d.adsPageToOpenURL_str = _s._d.adsSource_ar[i].link;
						_s._d.adsPageToOpenTarget_str = _s._d.adsSource_ar[i].target;
						_s.scrubAfterAddDuration = _s._d.adsSource_ar[i].timeStart;
						_s.TrackingEvents = _s._d.adsSource_ar[i].TrackingEvents;

						_s.Impression = _s._d.adsSource_ar[i].Impression;
						_s.ClickTracking = _s._d.adsSource_ar[i].ClickTracking;
						
						if(_s.TrackingEvents){
							_s.Impression = _s.ClickTracking = _s.ClickThrough = true;
							_s.callFirstQuartile = _s.callMidpoint = _s.callThirdQuartile =  true;
						}

						_s.curImageTotalTime = _s._d.adsSource_ar[i].addDuration;
						if(!_s.isStopped_bl) _s.lastCurTime = _s.curTime
						if(!_s.lastCurTime) _s.lastCurTime = _s.getCurrentTime();
						_s.setSource(_s.addSource_str, true);
						 _s.prevVidSrc2 = '';
						
						if(_s.videoType_str != FWDEVPlayer.IMAGE && _s.videoType_str != FWDEVPlayer.IFRAME && !_s.isMobile_bl){
							_s.allowToPlay = false;
							if(_s.lastCurTime.substr(_s.lastCurTime.length -2) == "00"){
								
								if(_s.autoPlay_bl || _s.adDone_bl){
									if(_s.addSource_str.indexOf("youtube.") != -1 && _s.ytb_do && _s.ytb_do.hasBeenCreatedOnce_bl) _s.allowToPlay = true;
									if(_s.addSource_str.indexOf("youtube.") == -1 ) _s.allowToPlay = true;
								}
							}else{
								if(_s.addSource_str.indexOf("youtube.") != -1 && _s.ytb_do) _s.allowToPlay = true;
								_s.allowToPlay = true;
							}
							if(_s.allowToPlay) _s.play();
						}
						_s.adDone_bl = false;
						if(_s.controller_do && _s.controller_do.line_ar){
							if(_s.controller_do.line_ar[i]){
								_s.controller_do.line_ar[i].setVisible(false);
								_s.controller_do.line_ar[i].isUsed_bl = true;
							}
						}
						break;
					}
				}
			}
			_s.isLive = _s._d.videosSource_ar[_s._d.startAtVideoSource]["isLive"];
			

			if(!_s.isAdd_bl){
				var dSrc = _s._d.videosSource_ar[_s._d.startAtVideoSource];
				var curVidSrc = dSrc["source"];
				if(curVidSrc != _s.prevVidSrc || forceSource){
					_s.TrackingEvents = _s.Impression = _s.ClickTracking = _s.ClickThrough = undefined;
					_s.callFirstQuartile = _s.callMidpoint = _s.callThirdQuartile = undefined;
					_s.playSecondSource = false;
					_s.videoSource2_str = undefined;
					_s.setSource(dSrc["source"], false, _s._d.videosSource_ar[_s._d.startAtVideoSource]["videoType"]);
					_s.prevVidSrc = curVidSrc;
				}else{
					var source = dSrc["source"];
					if(_s.videoSource2_str) source = _s.videoSource2_str;
					if(source != _s.prevVidSrc2){
						_s.setSource(source, false, _s._d.videosSource_ar[_s._d.startAtVideoSource]["videoType"]);
						_s.prevVidSrc2 = source;
					}
				}
			}

			if(_s.controller_do) _s.controller_do.positionAdsLines(_s.curDuration);
			_s.prevDuration = duration;
		};
		

		//#####################################################//
		/* Setup image screen */
		//#####################################################//
		_s.updateImageScreen = function(source){
			
			if(_s.videoType_str == FWDEVPlayer.IFRAME){
				if(!_s.iFrame_do){		
					_s.iFrame_do = new FWDEVPDO("iframe");
					_s.iFrame_do.hasT3D = false;
					_s.iFrame_do.hasT2D = false;
					_s.iFrame_do.setBackfaceVisibility();
				}
				
				_s.main_do.addChildAt(_s.iFrame_do, _s.main_do.getChildIndex(_s.dClk_do) + 1);
				_s.showClickScreen();
				
				_s.iFrame_do.screen.src = source;
				_s.positionAdsImage();
				_s.startToUpdateAdsButton();
				return;
			}
			
			if(!_s.imageSceeenHolder_do){
				_s.imageSceeenHolder_do = new FWDEVPDO("div");
				_s.imageSceeenHolder_do.setX(0);
				_s.imageSceeenHolder_do.setY(0);
				_s.imageSceeenHolder_do.setBkColor("#000000");
			}
			
			_s.main_do.addChildAt(_s.imageSceeenHolder_do,  _s.main_do.getChildIndex(_s.dClk_do) - 1);
			_s.showClickScreen();
			if(_s.imageSceeenHolder_do.contains(_s.imageScreen_do)) _s.imageSceeenHolder_do.removeChild(_s.imageScreen_do);
			_s.imageScreen_do = null;
			
			_s.imageScreen_do = new FWDEVPDO("img");
			
			_s.imageAdd_img = new Image()
			_s.imageAdd_img.src = source;
		
			if(_s.showPreloader_bl){
				_s.preloader_do.show(false);
				_s.preloader_do.startPreloader();
			}
			if(_s.largePlayButton_do) _s.hideLargePlayButton();
			
			_s.imageAdd_img.onload = function(){
				_s.imageScreen_do.setScreen(_s.imageAdd_img);
				_s.imageScreen_do.setAlpha(0);
				FWDAnimation.to(_s.imageScreen_do, 1, {alpha:1});
				_s.imageAddOriginalWidth = _s.imageAdd_img.width;
				_s.imageAddOriginalHeight = _s.imageAdd_img.height;
				_s.preloader_do.hide(false);
				_s.preloader_do.stopPreloader();
				_s.imageSceeenHolder_do.addChild(_s.imageScreen_do);
				_s.positionAdsImage();
				_s.startToUpdateAdsButton();
			}
			
			_s.imageAdd_img.onerror = function(){
				_s.main_do.addChild(_s.info_do);
				_s.info_do.showText("Advertisment image with path " +  source + " can't be found");
				_s.preloader_do.hide(false);
				_s.preloader_do.stopPreloader();
				return;
			}
		}
		
		_s.positionAdsImage = function(){
			
			if(_s.videoType_str == FWDEVPlayer.IFRAME && _s.iFrame_do){
				_s.iFrame_do.setWidth(_s.sW);
				_s.iFrame_do.setHeight(_s.sH);
		
			}
			
			if(!_s.imageScreen_do || _s.videoType_str != FWDEVPlayer.IMAGE) return;
			var scaleX = _s.sW/_s.imageAddOriginalWidth;
			var scaleY = _s.sH/_s.imageAddOriginalHeight;
			
			var totalScale = 0;
			if(scaleX >= scaleY){
				totalScale = scaleX;
			}else if(scaleX <= scaleY){
				totalScale = scaleY;
			}
			
			var finalW = parseInt(_s.imageAddOriginalWidth * totalScale);
			var finalH = parseInt(_s.imageAddOriginalHeight * totalScale);
			var finalX = parseInt((_s.sW - finalW)/2);
			var finalY = parseInt((_s.sH - finalH)/2);
			
			_s.imageScreen_do.setWidth(finalW); 
			_s.imageScreen_do.setHeight(finalH); 
			_s.imageScreen_do.setX(finalX); 
			_s.imageScreen_do.setY(finalY); 
			_s.imageSceeenHolder_do.setWidth(_s.sW);
			_s.imageSceeenHolder_do.setHeight(_s.sH);
		}
		
		_s.startToUpdateAdsButton = function(){
			_s.curImageTime = 0;
			_s.updateAdsButton();
			_s.stopUpdateImageInterval();
			_s.startUpdateImageInterval();
			_s.setPlayAndPauseButtonState();	
		}
		
		_s.stopUpdateImageInterval = function(){
			_s.isImageAdsPlaying_bl = false;
			
			clearInterval(_s.startUpdateAdsId_int);
			_s.setPlayAndPauseButtonState();
			if(_s.largePlayButton_do && !_s.useWithoutVideoScreen_bl) _s.showLargePlayButton();
			_s.isPlaying_bl = false;
			
			_s.hider.stop();	
		}
		
		_s.startUpdateImageInterval = function(){
			_s.isImageAdsPlaying_bl = true;
			_s.startUpdateAdsId_int = setInterval(_s.updateAdsButton, 1000);
			_s.setPlayAndPauseButtonState();
			if(_s.largePlayButton_do) _s.hideLargePlayButton();
			_s.isPlaying_bl = true;
			_s.hider.start();
		}
		
		_s.updateAdsButton = function(){
			
			_s.videoScreenUpdateTimeHandler({curTime:FWDEVPUtils.formatTime(_s.curImageTime), totalTime:FWDEVPUtils.formatTime(_s.curImageTotalTime), seconds:_s.curImageTime});
			_s.videoScreenUpdateHandler({percent:_s.curImageTime/_s.curImageTotalTime});
			if(_s.curImageTime == _s.curImageTotalTime) _s.videoScreenPlayCompleteHandler();
			_s.curImageTime += 1;
		}
		
		_s.setPlayAndPauseButtonState = function(){
			if(_s.isImageAdsPlaying_bl){
				if(_s.controller_do) _s.controller_do.showPauseButton();
			}else{
				if(_s.controller_do) _s.controller_do.showPlayButton();
			}
		}
		

		// DASH
		_s.setupDASH = function(){
			if(_s.dashJS || !window['dashjs']) return;
		
			_s.isDASHLoaded_bl = true;
			_s.dashJS = dashjs.MediaPlayer().create();

			_s.dashJS.on(dashjs.MediaPlayer.events.ERROR, function(e){

				if(_s.checkSecondSource()){
					return;
				}
				_s.main_do.addChild(_s.info_do);
				_s.info_do.showText(e.error.message);
			});
			_s.dispatchEvent(FWDEVPlayer.FRAMEWORK_DONE);
		}

		_s.destroyDASH = function(){
			if(_s.dashJS){
				try{
					_s.dashJS.reset();
				}catch(e){}
				_s.dashJS = null;
			}
		}


		// Setup HLS.
		_s.isThreeJsLoaded_bl = false;
		_s.isThreeJsOrbitLoaded_bl = false;
		_s.load360ScriptsId_to;
		_s.isHLSJsLoaded_bl = false;
		
		_s.destroyHLS = function(){
			if(_s.hlsJS){
				_s.hlsJS.destroy();
				_s.hlsJS = null;
			}
		}
		
		_s.setupHLS = function(){
			if(_s.hlsJS || !window['Hls']) return;
			_s.isHLSJsLoaded_bl = true;
			_s.hlsJS = new Hls({autoLevelEnabled:true});
			FWDEVPRegisterHLSError(_s);
			_s.dispatchEvent(FWDEVPlayer.FRAMEWORK_DONE);

			_s.hlsJS.on(Hls.Events.MANIFEST_LOADED,function(event, data){
				_s.setAudioTracks(_s.hlsJS.audioTracks);
			});

			_s.hlsJS.on(Hls.Events.LEVEL_UPDATED,function(event, data){
				_s.curHlsLevel = data.level;
				_s.updateHlsControllerLevels();
			});

			_s.hlsJS.on(Hls.Events.LEVEL_SWITCHING,function(event, data){
				_s.curHlsLevel = data.level;
				_s.updateHlsControllerLevels();
			});
		}

		_s.setAudioTracks = function(audioTracks_ar){
			if(audioTracks_ar && audioTracks_ar.length > 1){
				_s.controller_do.addAtButton();

				_s.audioTracks_ar = [];
				audioTracks_ar.forEach((o,i) =>{
					_s.audioTracks_ar[i] = {'label':o['name'] || o['label']};
				})
				_s.audioTracks_ar.reverse();
				_s.controller_do.updateATBButtons(_s.audioTracks_ar, 0);
			}
		}

		_s.updateHlsControllerLevels = function(){

			if(_s.controller_do && _s.hlsLevels_ar){
				_s.curHlsLevel = Math.abs(_s.curHlsLevel - _s.hlsLevels_ar.length + 1)
				_s.controller_do.disableQualityButtons('', _s.curHlsLevel);
			}
		}

		_s.parseLevels = function(){
			var hlsLevels = _s.hlsJS.levels;
			
			_s.parseQualityLevelsId_to = setTimeout(function(){

				_s.hlsLevels_ar = [];
				
				hlsLevels.forEach(function(el){
					var level = '';
					var levelW = el.width;
					var levelH = el.height;
					if(levelW == 320){
						level = 'tiny';
					}else if(levelW == 480){
						level = 'small';
					}else if(levelW == 640){
						level = 'medium';
					}else if(levelW == 960){
						level = 'large';
					}else if(levelW == 1280){
						level = 'hd720';
					}else if(levelW == 1920){
						level = 'hd1080';
					}else if(levelW == 2560){
						level = 'hd1440p';
					}else if(levelW == 3840){
						level = 'hd2160';
					}else if(levelW == 3840){
						level = 'hd2160';
					}else if(levelW == 5120){
						level = 'hd2880';
					}else if(levelW == 7680){
						level = 'hd4320';
					}else{
						level = levelW + 'x' + levelH;
					}

					_s.hlsLevels_ar.push(level);					
				});
				
				_s.hlsLevels_ar.reverse();
			
				if(_s.controller_do){
					_s.curHlsLevel = Math.abs(_s.hlsLevels_ar.length - _s.hlsLevels_ar.length);
					_s.curHlsLevel = _s.curHlsLevel;
					_s.controller_do.updateQuality(_s.hlsLevels_ar, _s.curHlsLevel, _s.curHlsLevel);
				}
			}, 500);
		
		}
	

		//#####################################################//
		/* set source */
		//#####################################################//
		_s.setSource = function(source, overwrite, videoType, source2){
			
			if(!_s.isAPIReady_bl || !source) return;

			source = source.replace(/&amp;/g, "&");

			_s.currentSecconds = 0;
			clearInterval(_s.tryHLS_int);
			clearTimeout(_s.load360ScriptsId_to);
			if(source.indexOf("encrypt:") != -1) source = atob(source.substr(8));
			if(source == _s.prevVideoSource_str && !overwrite) return;
			_s.prevVideoSource_str = source;
			
			_s.videoSource_str = source;
			_s.videoSourcePath_str = source;
			_s.finalVideoPath_str = source;
			_s.videoType = videoType;
			
			if(_s.main_do.contains(_s.info_do)){
				_s.main_do.removeChild(_s.info_do);
			}
			
			_s.stop();
	
			if(_s.controller_do) _s.controller_do.setIsLive(_s.isLive);
		
			if(_s.videoSourcePath_str.indexOf("vimeo.com") != -1 &&
			   source.indexOf(".mp4") == -1 && source.indexOf(".m3u8") == -1){
				_s.videoType_str = FWDEVPlayer.VIMEO;
			}else if(_s.videoSourcePath_str.indexOf("youtube.") != -1){
				_s.videoType_str = FWDEVPlayer.YOUTUBE;
				if(_s.controller_do) _s.controller_do.setX(0);
			}else if(_s.videoSourcePath_str.indexOf(".jpg") != -1 
					|| _s.videoSourcePath_str.indexOf(".jpeg") != -1 
					|| _s.videoSourcePath_str.indexOf(".png") != -1
			){
				_s.videoType_str = FWDEVPlayer.IMAGE;
				if(_s.controller_do) _s.controller_do.setX(0);
			}else if(source.match(/\.mp3|\.m4a|\.acc/ig)){
				_s.videoType_str = FWDEVPlayer.MP3;
				if(_s.controller_do) _s.controller_do.setX(0);
			}else if(!source.match(/\.mpd|\.m3u8|\.mp4|\.mov|google.com|lh3.|myqnapcloud/ig)){
				_s.videoType_str = FWDEVPlayer.IFRAME;
				if(_s.controller_do) _s.controller_do.setX(0);
			}else{
				if(_s.controller_do) _s.controller_do.setX(0);
				if(!FWDEVPUtils.isIOS && _s.videoSourcePath_str.indexOf(".m3u8") != -1){
					_s.videoType_str = FWDEVPlayer.HLS_JS;
				}else if(source.indexOf(".mpd") != -1){
					_s.videoType_str = FWDEVPlayer.DASH;
				}else{
					_s.videoType_str = FWDEVPlayer.VIDEO;
				}
			}


			// IMA
			var isIMA = _s._d.imaURL;
			if(_s.videoType_str != FWDEVPlayer.VIDEO || _s.errorImaSDK) isIMA = false;
			
			if(isIMA){
				_s.isIMA = isIMA;
				if(!_s._d.imaReady){
					_s._d.startToLoadIMA();
					return;
				}
				
				if(!_s.IMA){
					FWDEVPIMA.setPrototype();
					_s.IMA = new FWDEVPIMA(_s);
				}
			}
			if(!_s.IMA) _s.isIMA = false;

			if(!isIMA){
				if(_s.IMA) _s.IMA.stop();
				_s.prevIsIMA = '';
			}


			_s.isGR = false;
			_s.is360 = false;
			
			if(videoType){
				if(videoType.toLowerCase() == "360degreevideo"){
					_s.isGR = false;
					_s.is360 = true;
				}else if(videoType.toLowerCase() == "greenscreenvideo"){
					_s.isGR = true;
					_s.is360 = false;
				}
			}
			
			if(_s.isGR){
				_s.main_do.setBkColor("transparent");
				_s.videoScreen_do.setBkColor("transparent");
			}else{
				_s.main_do.setBkColor(_s.backgroundColor_str);
				_s.videoScreen_do.setBkColor(_s.backgroundColor_str);
			}

			
			// Casting
			if(_s.cc) _s.cc.checkButtonState();
			if(_s.vimeo_do) _s.vimeo_do.setX(-5000);
			if(_s.ytb_do) _s.ytb_do.setX(-5000);
			if(_s.videoScreen_do) _s.videoScreen_do.setX(-5000);
			if(_s.audioScreen_do) _s.audioScreen_do.setX(-5000);
			_s.audioScreen_do.setVisible(false);
			
			// Youtube.
			if(_s.videoSource_str.indexOf("youtube.") != -1 && !_s.isYoutubeReady_bl){
				setTimeout(function(){					
					if(_s.showPreloader_bl){
						_s.main_do.addChild(_s.preloader_do);	
						_s.preloader_do.show(false);
						_s.preloader_do.startPreloader();
						if(_s.largePlayButton_do) _s.hideLargePlayButton();
						
						if(location.protocol.indexOf("file:") != -1 && FWDEVPUtils.isIE) _s.main_do.addChild(_s.info_do);
					}
				}, 50);
				
				if(location.protocol.indexOf("file:") != -1 && FWDEVPUtils.isIE){
					_s.info_do.allowToRemove_bl = false;
					var error = "This browser dosen't allow the Youtube API to run local, please test it online or in another browser like Firefox or Chrome."
					_s.displayError(error);
					_s.resizeHandler();
					return;
				}	
				
				_s.setupYoutubeAPI();
				return;
			}
			
			// Vimeo.
			if(source.indexOf("vimeo.") != -1 && !_s.vimeo_do && _s.videoType_str == FWDEVPlayer.VIMEO){
					
				if(location.protocol.indexOf("file:") != -1){
					var error = "This browser dosen't allow playing Vimeo videos local, please test online.";
					_s.displayError(error);
					return;
				}

				if(_s.showPreloader_bl){
					_s.main_do.addChild(_s.preloader_do);	
					_s.preloader_do.show(false);
					_s.preloader_do.startPreloader();
				}
				if(_s.largePlayButton_do) _s.hideLargePlayButton();
			
				_s.setupVimeoAPI();
				return;
			}
			
			
			//DASH
			if(source.indexOf(".mpd") != -1 && !_s.isDASHLoaded_bl && !FWDEVPlayer.isDASHLoaded_bl){
				
				if(location.protocol.indexOf("file:") != -1){
					var error = "This browser doesn't allow playing MPEG DASH videos local, please test online.";
					_s.displayError(error);
					return;
				}
				_s.dispatchEvent(FWDEVPlayer.FRAMEWORK_LOAD);
				
				var script = document.createElement('script');
				script.src = _s._d.dashPath_str;
				document.head.appendChild(script);
				script.onerror = function(){
					var error = "Error loading MPEG DASH library <font color='#FF0000'>" + _s._d.dashPath_str + "</font>.";
					_s.displayError(error);
					return;
				}

				script.onload = function () {
					_s.isDASHLoaded_bl = true;
					FWDEVPlayer.isDASHLoaded_bl = true;
					_s.setupDASH();
					_s.setSource(source, true, _s.is360);
				}

				if(!_s.autoPlay_bl){
					_s.setPosterSource(_s.posterPath_str);
					if(_s.videoPoster_do) _s.videoPoster_do.show();
					if(_s.lrgPlayBtn) _s.lrgPlayBtn.show();
				}
				return;
			}

			// HLS.
			if(!FWDEVPUtils.isIOS && _s.videoSourcePath_str.indexOf(".m3u8") != -1 
				&& !_s.isHLSJsLoaded_bl && !FWDEVPlayer.isHLSJsLoaded_bl
			){
				
				if(location.protocol.indexOf("file:") != -1){
					_s.info_do.allowToRemove_bl = false;
					var error = "This browser dosen't allow playing HLS / live streaming videos local, please test online.";
					_s.displayError(error);
					return;
				}

				_s.dispatchEvent(FWDEVPlayer.FRAMEWORK_LOAD);
				
				var script = document.createElement('script');
				script.src = _s._d.hlsPath_str;
				script.onerror = function(){
					_s.main_do.addChild(_s.info_do);
					var error = "Error loading HLS library <font color='#FF0000'>" + _s._d.hlsPath_str + "</font>.";
					_s.displayError(error);
					return;
				}
				
				script.onload = function () {
					_s.isHLSJsLoaded_bl = true;
					FWDEVPlayer.isHLSJsLoaded_bl = true;
					_s.setupHLS();
					_s.setSource(_s.videoSourcePath_str, true,_s._d.videosSource_ar[_s._d.startAtVideoSource]["videoType"]);
				}
				document.head.appendChild(script);
				return;
			}
			
			// 360
			if(_s.is360 && !_s.isThreeJsOrbigLoaded_bl){
				
				if(FWDEVPUtils.isLocal){
					_s.main_do.addChild(_s.info_do);
					var error = "This browser dosen't allow playing 360 videos local, please test online."
					_s.displayError(error);
					return;
				}

			
				if(!FWDEVPUtils.hasWEBGL){
					_s.main_do.addChild(_s.info_do);
					var error = "Playing 360 videos in this browser is not possible because it dosen't support WEBGL."
					_s.displayError(error);
					return;
				}
			
				if(!_s.isThreeJsLoaded_bl && !FWDEVPlayer.hasThreeJsLoaded_bl){
					_s.dispatchEvent(FWDEVPlayer.FRAMEWORK_LOAD);
					var script = document.createElement('script');
					script.src = _s._d.threeJsPath_str;
					script.onerror = function(){
						var error = "Error loading 360 degree library <font color='#FF0000'>" + _s._d.threeJsPath_str + "</font>.";
						_s.displayError(error);
						return;
					}

					script.onload = function () {
						_s.isThreeJsOrbigLoaded_bl = true;
						
						var script2 = document.createElement('script');
						script2.src = _s._d.threeJsControlsPath_str;
						script2.onerror = function(){
							var error = "Error loading three.js from <font color='#FF0000'>" + _s._d.threeJsControlsPath_str + "</font>."
							_s.displayError(error);
							return;
						}

						script2.onload = function () {
							FWDEVPlayer.hasThreeJsLoaded_bl = true;
							_s.isThreeJsOrbitLoaded_bl = true;
							var dSrc = _s._d.videosSource_ar[_s._d.startAtVideoSource];
							if(_s.isThreeJsOrbigLoaded_bl && _s.isThreeJsOrbitLoaded_bl) _s.setSource(dSrc["source"],true, dSrc["videoType"], dSrc['source2']);
							clearTimeout(_s.load360ScriptsId_to);
							_s.preloader_do.hide(false);
							_s.preloader_do.stopPreloader();
							_s.dispatchEvent(FWDEVPlayer.FRAMEWORK_DONE);
						};
						document.head.appendChild(script2); 
							
						};

						document.head.appendChild(script);
						
						_s.load360ScriptsId_to = setTimeout(function(){
							if(_s.showPreloader_bl){
								_s.preloader_do.show(false);
								_s.preloader_do.startPreloader();
							}
						},1000);
					return;
				}
			}
			
			if(_s.is360){
				_s.dClk_do.style().cursor = 'url(' + _s._d.handPath_str + '), default';
			}else{
				_s.dClk_do.style().cursor = "auto";
				_s.dispatchEvent(FWDEVPlayer.SHOW_CURSOR)
			}
			
			if(!source){
				_s.main_do.addChild(_s.info_do);
				_s.info_do.showText("Video source is not defined!");
				return;
			}
			
			if(source.indexOf("youtube.") != -1){
				var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
				source = source.match(regExp)[2];
			}
			
			if(_s.controller_do && _s._d.subtitles_ar && _s._d.subtitles_ar.length > 1){
				_s.controller_do.updateSubtitleButtons(_s._d.subtitles_ar, _s._d.startAtSubtitle);
				_s._d.subtitlePath_str = _s._d.subtitles_ar[_s._d.subtitles_ar.length - 1 - _s._d.startAtSubtitle]["source"];
				_s.ccSS = _s._d.startAtSubtitle;
			}
			_s.subtitle_do.stopToLoadSubtitle();
			
			if(_s.controller_do && !_s.isQualityChanging_bl) _s.controller_do.disableSubtitleButton();
			if(_s.controller_do && _s.controller_do.rewindButton_do) _s.controller_do.rewindButton_do.disable();
			
			if(_s._d.scrubAtTimeAtFirstPlay != "00:00:00") _s.playAtTime_bl = true;
			
			if(_s.controller_do){
				_s.controller_do.updateHexColorForScrubber(_s.isAdd_bl);
				_s.controller_do.removeAtButton();
			} 
				
			_s.resizeHandler();
			if(_s.getVideoSource()) _s.dispatchEvent(FWDEVPlayer.UPDATE_VIDEO_SOURCE);
	
			//Image
			if(_s.videoType_str == FWDEVPlayer.IMAGE || _s.videoType_str == FWDEVPlayer.IFRAME){
				_s.updateImageScreen(_s.videoSourcePath_str);
				if(_s.videoPoster_do) _s.videoPoster_do.setX(-5000);
				_s.wasAdd_bl = false;
				return;
			}else{
				if(_s.main_do.contains(_s.imageSceeenHolder_do)) _s.main_do.removeChild(_s.imageSceeenHolder_do);
				if(_s.main_do.contains(_s.iFrame_do)) _s.main_do.removeChild(_s.iFrame_do);
		   		if(_s.videoPoster_do) _s.videoPoster_do.setX(0);
		   		_s.hideClickScreen();
			}
			
			if(_s.isAdd_bl){
				_s.setPlaybackRate(1);
			}else{
				_s.setPlaybackRate(_s._d.defaultPlaybackRate_ar[_s._d.startAtPlaybackIndex]);
			}
			
			if(_s.controller_do){
				if(_s.videoType_str == FWDEVPlayer.VIMEO
					|| _s.videoType_str == FWDEVPlayer.IMAGE
					|| _s.videoType_str == FWDEVPlayer.IFRAME
				){
					_s.controller_do.removePlaybackRateButton();
				}else{
					_s.controller_do.addPlaybackRateButton();
				}

				if(_s.is360 && _s._d.show360DegreeVideoVrButton_bl){
					_s.controller_do.addVrButton();
				}else{
					_s.controller_do.removeVrButton();
				}
			}
			
			if(_s.controller_do && _s._d.showPlaybackRateButton_bl){
				_s.controller_do.updatePlaybackRateButtons(_s._d.updatePlaybackRateButtons, _s._d.startAtPlaybackIndex);
			}


			//Vimeo
			if(_s.videoType_str == FWDEVPlayer.VIMEO){
				
				if(_s.ytb_do && _s.ytb_do.ytb ){
					_s.ytb_do.showDisable();
				}
				
				if(_s.controller_do){
					_s.controller_do.removeYtbQualityButton();
				}

				_s.vimeo_do.showDisable();
				_s.vimeo_do.setSource(source);
				_s.setPosterSource(_s.posterPath_str);
			
				if(_s.largePlayButton_do && !_s._d.showAnnotationsPositionTool_bl && !_s.useWithoutVideoScreen_bl){
					 _s.hideLargePlayButton();
					 _s.showLargePlayButton();
				}

				if(_s._d.autoPlay_bl){
					if(_s.controller_do) _s.controller_do.updateVolume(0);
				}
			
				
				if(_s.getVideoSource()) _s.dispatchEvent(FWDEVPlayer.UPDATE_VIDEO_SOURCE);
				_s.resizeHandler();
				if(_s.vimeo_do.iFrame_do) _s.vimeo_do.iFrame_do.screen.style.left = "0px";
				_s.vimeo_do.setX(0);
				_s.wasAdd_bl = false;
				return;
			}
				
			//Youtube
			if(_s.videoType_str == FWDEVPlayer.YOUTUBE && _s.ytb_do && _s.ytb_do.ytb &&  _s.ytb_do.ytb.cueVideoById){
			
				if(_s.ytb_do && _s.ytb_do.ytb && !_s.is360){
					_s.ytb_do.showDisable();
				}else{
					_s.ytb_do.hideDisable();
				}

				_s.ytb_do.setX(0);
				if(_s._d.aom_bl && _s.controller_do) _s.controller_do.updateVolume(0);
				_s.ytb_do.setSource(source);
				
				_s.setPosterSource(_s.posterPath_str);
				if(_s.largePlayButton_do  && !_s._d.showAnnotationsPositionTool_bl && !_s.useWithoutVideoScreen_bl){
					 _s.hideLargePlayButton();
					 _s.showLargePlayButton();
				}
				
				_s.playSecondSource = false;
				
				if(_s.controller_do){
					_s.controller_do.updatePreloaderBar(0);
					_s.controller_do.addYtbQualityButton();
				}
				_s.wasAdd_bl = false;
				if(_s.getVideoSource()) _s.dispatchEvent(FWDEVPlayer.UPDATE_VIDEO_SOURCE);
				return;
			}
			
			_s.finalVideoPath_str = source;
			
			// Mp3.
			if(_s.videoType_str == FWDEVPlayer.MP3){
				_s._d.autoPlay_bl = false;
				_s.setPosterSource(_s.posterPath_str);
				if(_s.ytb_do && _s.ytb_do.ytb){
					_s.ytb_do.showDisable();
				}
				
				if(_s.largePlayButton_do  && !_s._d.showAnnotationsPositionTool_bl && !_s.useWithoutVideoScreen_bl){
					 _s.hideLargePlayButton();
					 _s.showLargePlayButton();
				}

				_s.audioScreen_do.setX(0);
				_s.audioScreen_do.setVisible(true);
				
				if(_s.showPreloader_bl){
					_s.preloader_do.hide(false);
					_s.preloader_do.stopPreloader();
				}
			
				_s.audioScreen_do.setSource(source);
				if(_s.playSecondSource){
					_s.play();
				} 
			
				if(_s.controller_do && _s._d.videosSource_ar && _s._d.videosSource_ar.length > 1){
					_s.controller_do.updatePreloaderBar(0);					
					_s.controller_do.addYtbQualityButton();	
					_s.controller_do.updateQuality(_s._d.videoLabels_ar, _s._d.videoLabels_ar[_s._d.videoLabels_ar.length - 1 - _s._d.startAtVideoSource]);
				}else if(_s.controller_do){	
					_s.controller_do.removeYtbQualityButton();
				}
				_s.wasAdd_bl = false;
				return;
			}
			
			// Video.		
			if(FWDEVPlayer.hasHTML5Video && _s.videoType_str == FWDEVPlayer.VIDEO
			  || _s.videoType_str == FWDEVPlayer.HLS_JS
			  || _s.videoType_str == FWDEVPlayer.DASH
			){
				
				_s.setPosterSource(_s.posterPath_str);
				
				if(_s.ytb_do && _s.ytb_do.ytb){
					_s.ytb_do.showDisable();
				}

				if(_s.largePlayButton_do  && !_s._d.showAnnotationsPositionTool_bl && !_s.useWithoutVideoScreen_bl){
					 _s.hideLargePlayButton();
					 _s.showLargePlayButton();
				}
				
				_s.videoScreen_do.setX(0)
				_s.videoScreen_do.setVisible(true);
				if(_s.showPreloader_bl){
					_s.preloader_do.hide(false);
					_s.preloader_do.stopPreloader();
				}
			
				if(_s.videoType_str == FWDEVPlayer.DASH){
					_s.videoScreen_do.setSource(source);
					_s.videoScreen_do.initVideo();
					_s.setupDASH();

					_s.dashJS.initialize(_s.videoScreen_do.video_el, _s.videoSourcePath_str, false);
                 	_s.dashJS.attachSource(_s.videoSourcePath_str);

                 	_s.dashJS.on(dashjs.MediaPlayer.events.MANIFEST_LOADED, function(e){
                 		_s.isDASHManifestReady_bl = true;
                 
                 		if(_s._d.autoPlay_bl
                 			|| (_s.playSecondSource && _s.playStarted)
                 			|| (!_s.isMobile_bl && _s.wasAdd_bl)
                 		 ){
                 		 	if(_s._d.autoPlay_bl) _s.controller_do.updateVolume(0);
							if(_s.videoType_str == FWDEVPlayer.DASH){
								if( _s.displayType != FWDEVPlayer.LIGHTBOX  || _s.lightBox_do.showComplete_bl){
									setTimeout(_s.play, 100);
								} 
								setTimeout(_s.play, 100);
							}
							_s.playStarted = _s.playSecondSource = false;
						}

						if(_s.isAdd_bl){
							_s.setPlaybackRate(1);
						}else{
							_s.setPlaybackRate(_s._d.defaultPlaybackRate_ar[_s.startAtPlaybackIndex]);
						}
						if(_s.controller_do && _s._d.showPlaybackRateButton_bl){
							_s.controller_do.updatePlaybackRateButtons(_s.startAtPlaybackIndex);
						}
                 	});
					
				}else if(_s.videoType_str == FWDEVPlayer.HLS_JS){
					_s.videoScreen_do.setSource(source);
					_s.videoScreen_do.initVideo();
					_s.setupHLS();
					_s.hlsJS.loadSource(_s.videoSourcePath_str);
					_s.hlsJS.attachMedia(_s.videoScreen_do.video_el);


					
					_s.hlsJS.on(Hls.Events.MANIFEST_PARSED,function(e){
						_s.isHLSManifestReady_bl = true;
						if(_s.controller_do){
							_s.controller_do.addYtbQualityButton();
						}

						if(_s._d.autoPlay_bl || _s.wasAdHLS){
							if(_s._d.autoPlay_bl) _s.controller_do.updateVolume(0);
							if(_s.displayType != FWDEVPlayer.LIGHTBOX  || _s.lightBox_do.showComplete_bl){
								_s.play();
							} 
						}

						_s.dispatchEvent(FWDEVPlayer.MANIFEST_PARSED_PLAY);

						_s.parseLevels();
						_s.wasAdHLS = false;
					});
				}else{
					_s.videoScreen_do.setSource(source);
					if(_s._d.autoPlay_bl){
						if(_s.controller_do) _s.controller_do.updateVolume(0);
						if(_s.displayType != FWDEVPlayer.LIGHTBOX  || _s.lightBox_do.showComplete_bl){
							_s.play();
						} 
					} 

					if(_s.isIMA){
						if(_s.prevIsIMA != _s.isIMA){
							_s.IMA.setSource(_s.isIMA);
						}
						_s.prevIsIMA = _s.isIMA;
					} 
					_s.wasAdd_bl = false;
				}
				
				if(_s.controller_do && _s._d.videosSource_ar && _s._d.videosSource_ar.length > 1){
					_s.controller_do.updatePreloaderBar(0);
					_s.controller_do.addYtbQualityButton();
					_s.controller_do.updateQuality(_s._d.videoLabels_ar, _s._d.videoLabels_ar[_s._d.videoLabels_ar.length - 1 - _s._d.startAtVideoSource]);
				}else if(_s.controller_do){
					_s.controller_do.removeYtbQualityButton();
				}
				
			}
			_s.prevVideoSourcePath_str = _s.videoSourcePath_str;
		};
		
	
		//#############################################//
		/* go fullscreen / normal screen */
		//#############################################//
		_s.goFullScreen = function(){
			if(!_s.isAPIReady_bl || _s.displayType ==  FWDEVPlayer.BACKGROUND_VIDEO) return;
			
			if(document.addEventListener){
				document.addEventListener("fullscreenchange", _s.onFullScreenChange);
				document.addEventListener("mozfullscreenchange", _s.onFullScreenChange);
				document.addEventListener("webkitfullscreenchange", _s.onFullScreenChange);
				document.addEventListener("MSFullscreenChange", _s.onFullScreenChange);
			}
			
			if(document.documentElement.requestFullScreen) {
				_s.main_do.screen.documentElement.requestFullScreen();
			}else if(document.documentElement.mozRequestFullScreen){ 
				_s.main_do.screen.mozRequestFullScreen();
			}else if(document.documentElement.webkitRequestFullScreen){
				_s.main_do.screen.webkitRequestFullScreen();
			}else if(document.documentElement.msRequestFullscreen){
				_s.main_do.screen.msRequestFullscreen();
			}
			
			_s.stopVisualization();
			_s.callVastEvent("playerExpand");
			_s.callVastEvent("fullscreen");
			_s.disableClick();
			if(_s.customContextMenu_do) _s.customContextMenu_do.updateFullScreenButton(1);
			_s.main_do.style().position = "fixed";
			document.documentElement.style.overflow = "hidden";
			_s.main_do.style().zIndex = 9999999999998;
		
			_s.isFullScreen_bl = true;
			if(_s.controller_do){
				_s.controller_do.showNormalScreenButton();
				_s.controller_do.setNormalStateToFullScreenButton();
			}
			
			var scrollOffsets = FWDEVPUtils.getScrollOffsets();
			_s.lastX = scrollOffsets.x;
			_s.lastY = scrollOffsets.y;
			
			window.scrollTo(0,0);
		
			if(_s.isMobile_bl) window.addEventListener("touchmove", _s.disableFullScreenOnMobileHandler, {passive:false});
			_s.dispatchEvent(FWDEVPlayer.GO_FULLSCREEN);
			_s.resizeHandler();
			setTimeout(function(){
				_s.resizeHandler();
			}, 300);
			setTimeout(function(){
				_s.resizeHandler();
			}, 600);
		};
		
		_s.disableFullScreenOnMobileHandler = function(e){
			if(e.preventDefault) e.preventDefault();
		};
		
		_s.goNormalScreen = function(){		
			if(!_s.isAPIReady_bl || _s.displayType == FWDEVPlayer.BACKGROUND_VIDEO || !_s.isFullScreen_bl) return;
			
			if (document.cancelFullScreen) {  
				document.cancelFullScreen();  
			}else if (document.mozCancelFullScreen) {  
				document.mozCancelFullScreen();  
			}else if (document.webkitCancelFullScreen) {  
				document.webkitCancelFullScreen();  
			}else if (document.msExitFullscreen) {  
				document.msExitFullscreen();  
			}
		
			
			_s.addMainDoToTheOriginalParent();
			_s.isFullScreen_bl = false;
		};
		
		_s.addMainDoToTheOriginalParent = function(o){
			if(!_s.isFullScreen_bl && !o) return;
			
			_s.isFullScreen_bl = false;

			if(document.removeEventListener){
				document.removeEventListener("fullscreenchange", _s.onFullScreenChange);
				document.removeEventListener("mozfullscreenchange", _s.onFullScreenChange);
				document.removeEventListener("webkitfullscreenchange", _s.onFullScreenChange);
				document.removeEventListener("MSFullscreenChange", _s.onFullScreenChange);
			}
			
			_s.callVastEvent("playerCollapse");
				
			if(_s.controller_do) _s.controller_do.setNormalStateToFullScreenButton();
			
			if(_s.displayType == FWDEVPlayer.RESPONSIVE
			   || _s.displayType == FWDEVPlayer.AFTER_PARENT
			   || _s.displayType == FWDEVPlayer.LIGHTBOX
			   || _s.displayType == FWDEVPlayer.STICKY
			 ){
			
				document.documentElement.style.overflow = "visible";
				_s.main_do.style().position = "relative";
				_s.main_do.style().zIndex = 0;

				if(_s.isMin){
					_s.main_do.style().position = 'fixed';
					_s.main_do.style().zIndex = 9999999999999;
				}else{
					_s.main_do.style().position = "relative";
					_s.main_do.style().zIndex = 0;
				}
			}else{
				_s.main_do.style().position = "absolute";
				_s.main_do.style().zIndex = 9999999999998;
			}
			
			
			_s.showCursor();
			if(_s.controller_do) _s.controller_do.showFullScreenButton();

			var alScr = true;
			if(window['FWDSISC'] && FWDSISC.isFS){
				alScr = false;
			}
			
			if(alScr){
				window.scrollTo(_s.lastX, _s.lastY);
				
				if(!FWDEVPUtils.isIE){
					setTimeout(function(){
						window.scrollTo(_s.lastX, _s.lastY);
					}, 150);
				}
			}

			_s.resizeHandler();
			if(_s.customContextMenu_do) _s.customContextMenu_do.updateFullScreenButton(0);
			if(_s.isMobile_bl) window.removeEventListener("touchmove", _s.disableFullScreenOnMobileHandler);
			_s.dispatchEvent(FWDEVPlayer.GO_NORMALSCREEN);
		};
		
		_s.onFullScreenChange = function(e){
			if(!(document.fullScreen || document.msFullscreenElement  || document.mozFullScreen || document.webkitIsFullScreen || document.msieFullScreen)){
				if(_s.controller_do) _s.controller_do.showNormalScreenButton();
				_s.isFullScreen_bl = false;
				_s.addMainDoToTheOriginalParent(true);
				
			}
		};

		_s.displayError = function(error){
			_s.main_do.addChild(_s.info_do);
			_s.info_do.showText(error);
			_s.preloader_do.hide(false);
			_s.preloader_do.stopPreloader();
			_s.dispatchEvent(FWDEVPlayer.ERROR, {error:error});
		}
		
		_s.downloadVideo = function(){
			if(!_s.isAPIReady_bl) return;
			var sourceName;
			
			var source = _s._d.videosSource_ar[_s._d.startAtVideoSource]["source"];
			if(source.indexOf("/") != -1){
				sourceName = source.substr(source.lastIndexOf("/") + 1);
			}else{
				sourceName = source;
			}
		
			_s._d.downloadVideo(source, sourceName);
			
			if(window["ga"]){
				var gaLabel = 'videoPath:' + source +  ', videoName:' + sourceName  + '';
				ga('send', {
				  hitType: 'event',
				  eventCategory: 'videos',
				  eventAction: 'downloaded',
				  eventLabel: gaLabel,
				  nonInteraction: true
				});
			}
		};


		_s.stopVideo = function(){
			if(!_s.isAPIReady_bl) return;
			if(_s.IMA) _s.IMA.stop();
			if(_s.controller_do){
				_s.controller_do.createdAdsOnce_bl = false;
				_s.controller_do.resetsAdsLines(true);
			}

			_s._d.imaURL = _s.videoSource2_str = _s.prevVideoSource_str = undefined;
			_s.adDone_bl = _s.isAdd_bl = _s._d.isVastXMLParsed_bl = _s.playSecondSource = false;
			_s._d.adsSource_ar = _s._d.popupAds_ar = [];
			_s.prevVidSrc = _s.prevVidSrc2 = _s.prevIsIMA = '';
			_s.curDurration = 0;
			_s.prevDuration = -1;
			_s.stop();
		}
		
		_s.setVideoSource =  function(source, source2, videoType, isLive, vast, password, rotationY360DegreeVideo, startWhenPlayButtonClick360DegreeVideo){
			if(!_s.isAPIReady_bl) return;
			_s.stopVideo();
			_s.isAdd_bl = false;
			_s.adDone_bl = false;
			_s.prevDuration = -1;
			_s._d.vastXML = undefined;
			_s._d.imaURL = undefined;

			if(vast && FWDEVPUtils.isIMA(vast)){
				_s._d.imaURL = vast;
			}else if(vast){
				_s._d.vastXML = vast;
			}
			
			if(isLive ==  undefined) isLive = false;
		
			_s._d.videosSource_ar[_s._d.startAtVideoSource]["isLive"] = isLive;
			_s._d.videosSource_ar[_s._d.startAtVideoSource]["source"] = source;
			_s._d.videosSource_ar[_s._d.startAtVideoSource]["videoType"] = videoType;
			_s._d.videosSource_ar[_s._d.startAtVideoSource]["isPrivate"] = password;
			_s._d.videosSource_ar[_s._d.startAtVideoSource]["rotationY360DegreeVideo"] = rotationY360DegreeVideo || 0;
			_s._d.videosSource_ar[_s._d.startAtVideoSource]["startWhenPlayButtonClick360DegreeVideo"] = startWhenPlayButtonClick360DegreeVideo || false;
			
			_s.updateAds(0);
		};
		
		_s.setVastSource = function(source){
			if(!_s.isAPIReady_bl) return;
			_s.stopVideo();
			_s._d.vastXML = source;
			_s.updateAds(0);
		}
		
		_s.getVideoSource = function(){
			if(!_s.isAPIReady_bl) return;
			return _s.finalVideoPath_str;
		};
		
		_s.updateVolume = function(){
			if(!_s.isAPIReady_bl) return;
			_s.setVolume();
		}
		
		_s.getPosterSource = function(){
			if(!_s.isAPIReady_bl) return;
			return _s.posterPath_str;
		};

		_s.getCurrentTime = function(format){
			if(!format) format = 'text';
			var tm;
			if(format == 'milliseconds'){
				if(!_s.curTimeInmilliseconds){
					tm = 0;
				}else{
					tm = _s.curTimeInmilliseconds;
				}
				if(_s.isCasting) tm = _s.cc.getCurrentTime();
			}else if(format == 'seconds'){
				if(!_s.curTimeInSecond){
					tm = 0;
				}else{
					tm = _s.curTimeInSecond;
				}
				if(_s.isCasting) tm = _s.cc.getCurrentTime();
			}else{
				if(!_s.curTime){
					tm = "00:00";
				}else{
					tm = _s.curTime;
				}
				if(_s.isCasting) tm = FWDEVPUtils.formatTime(_s.cc.getCurrentTime());
			}
			return tm;
		};
		
		_s.getTotalTime = function(format){
			if(!format) format = 'text';
			var tm;
			if(format == 'milliseconds'){
				if(!_s.totalTimeInMilliseconds){
					tm = 0;
				}else{
					tm = _s.totalTimeInMilliseconds;
				}
				if(_s.isCasting) tm = _s.cc.getCurrentTime();
			}else if(format == 'seconds'){
				tm = Math.round(_s.totalTimeInSeconds);
				if(_s.isCasting) tm = _s.cc.getDuration();
			}else{
				if(!_s.totalTime){
					tm = "00:00";
				}else{
					tm = _s.totalTime;
				}
				if(_s.isCasting) tm = FWDEVPUtils.formatTime(_s.cc.getDuration());
			}
			return tm;
		};
		
		_s.setPlaybackRate = function(rate){
			if(!_s.isAPIReady_bl || rate === undefined) return;
			if( _s.videoScreen_do && _s.videoType_str == FWDEVPlayer.VIDEO
			 || _s.videoType_str == FWDEVPlayer.HLS_JS
			 || _s.videoType_str == FWDEVPlayer.DASH){
				_s.videoScreen_do.setPlaybackRate(rate);
			}else if(_s.videoType_str == FWDEVPlayer.MP3 && _s.audioScreen_do){
				_s.audioScreen_do.setPlaybackRate(rate);
			}else if(_s.videoType_str == FWDEVPlayer.YOUTUBE){
				if(_s.ytb_do && _s.ytb_do.ytb) _s.ytb_do.setPlaybackRate(rate);
			}
		}
		
		_s.fillEntireVideoScreen = function(param){
			if(!_s.isAPIReady_bl) return;
			_s.fillEntireVideoScreen_bl = param;
			_s.resizeHandler();
		};
		
		_s.showLightbox = function(){
			if(_s.lightBox_do) _s.lightBox_do.show();
		}
		
		_s.updateHEXColors = function(normalColor, selectedColor){
			if(!_s.isAPIReady_bl) return;
			_s.controller_do.updateHEXColors(normalColor, selectedColor);
			if(_s.largePlayButton_do) _s.largePlayButton_do.updateHEXColors(normalColor, selectedColor);
			if(_s.shareWindow_do) _s.shareWindow_do.updateHEXColors(normalColor, selectedColor);
			if(_s.embedWindow_do) _s.embedWindow_do.updateHEXColors(normalColor, selectedColor);
			if(_s.adsSkip_do) _s.adsSkip_do.updateHEXColors(normalColor, selectedColor);
			if(_s.opener_do) _s.opener_do.updateHEXColors(normalColor, selectedColor);
		};
		

		//###########################################//
		/* Hide / show cursor */
		//###########################################//
		_s.hideCursor = function(){
			document.documentElement.style.cursor = "none";
			document.getElementsByTagName("body")[0].style.cursor = "none";
			if(!_s.isAdd_bl) _s.dClk_do.style().cursor = "none";
		};
		
		_s.showCursor = function(){
			document.documentElement.style.cursor = "auto";
			document.getElementsByTagName("body")[0].style.cursor = "auto";
			if(_s.isAdd_bl){
				_s.dClk_do.setButtonMode(true);
			}else{
				if(_s.is360){
					_s.dClk_do.style().cursor = 'url(' + _s._d.handPath_str + '), default';
				}else{
					_s.dClk_do.style().cursor = "auto";
				}
			}
			_s.dispatchEvent(FWDEVPlayer.SHOW_CURSOR);
		};
		

		//#############################################//
		/* Tracking vast events */
		//#############################################//
		_s.callVastEvent = function(eventName){
			
			if(!_s.TrackingEvents) return;
			var URI;
		
			for(var i=0; i<_s.TrackingEvents.length; i++){
				if(eventName == _s.TrackingEvents[i]["event"]){
					URI = _s.TrackingEvents[i]["URI"];
				}
			}
		
			if(!URI) return;
			_s.executeVastEvent(URI);
		}
		
		_s.executeVastEvent = function(URI){
			if(!URI) return;
			if(URI === true) return;
			
			var trackingXHR = new XMLHttpRequest();
			trackingXHR.onreadystatechange = function(e){};
			
			trackingXHR.onerror = function(e){};
			
			trackingXHR.open("get", URI, true);
			trackingXHR.send();
		}
		
		_s.getStartTimeStamp = function(str){
			
			var ts  = window.location.href;
			ts = ts.substr(ts.indexOf(str + "=") + 2);
			if(ts.indexOf("&") != -1){
				ts = ts.substr(0, ts.indexOf("&"));
			}

			if(ts.indexOf("s&") != -1){
				ts = ts.substr(0, ts.indexOf("s&") + 1);
			}

			if(ts.match(/:/)) return '00:00:00';
			
			var pattern = /\d+h/g;
			var hours = ts.match(pattern);
			try{ hours = ts.match(pattern)[0] }catch(e){}
			if(hours){
				hours = hours.substr(0, hours.length -1);
				if(hours.length == 1 && parseInt(hours) < 10){
					hours = "0" + hours;
				}
				if(parseInt(hours) > 59) hours = 59;
			}
			hours = hours ? hours : "00";
			
			var pattern = /\d+m/g;
			var minutes = ts.match(pattern);
			try{ minutes = ts.match(pattern)[0] }catch(e){}
			if(minutes){
				minutes = minutes.substr(0, minutes.length -1);
				if(minutes.length == 1 && parseInt(minutes) < 10){
					minutes = "0" + minutes;
				}
				if(parseInt(minutes) > 59) minutes = 59;
			}
			minutes = minutes ? minutes : "00";
			
			var pattern = /\d+s/g;
			var seconds = ts.match(pattern);
			try{ seconds = ts.match(pattern)[0] }catch(e){}
			if(seconds){
				seconds = seconds.substr(0, seconds.length -1);
				if(seconds.length == 1 && parseInt(seconds) < 10){
					seconds = "0" + seconds;
				}
				if(parseInt(seconds) > 59) seconds = 59;
			}
			seconds = seconds ? seconds : "00";
		
			return hours + ":" + minutes + ":" + seconds;
		}
	

		//###########################################//
		/* event dispatcher */
		//###########################################//
		_s.addListener = function (type, listener){
	    	if(type == undefined) throw Error("type is required.");
	    	if(typeof type === "object") throw Error("type must be of type String.");
	    	if(typeof listener != "function") throw Error("listener must be of type Function.");
	    	
	        var event = {};
	        event.type = type;
	        event.listener = listener;
	        event.target = this;
	        _s.listeners.events_ar.push(event);
	    };
	    
	    _s.dispatchEvent = function(type, props){
	    	if(_s.listeners == null) return;
	    	if(type == undefined) throw Error("type is required.");
	    	if(typeof type === "object") throw Error("type must be of type String.");
	    	
	        for (var i=0, len=_s.listeners.events_ar.length; i < len; i++){
	        	if(_s.listeners.events_ar[i].target === this && _s.listeners.events_ar[i].type === type){		
	    	        if(props){
	    	        	for(var prop in props){
	    	        		_s.listeners.events_ar[i][prop] = props[prop];
	    	        	}
	    	        }
	        		_s.listeners.events_ar[i].listener.call(this, _s.listeners.events_ar[i]);
	        	}
	        }
	    };
	    
	   _s.removeListener = function(type, listener){
	    	
	    	if(type == undefined) throw Error("type is required.");
	    	if(typeof type === "object") throw Error("type must be of type String.");
	    	if(typeof listener != "function") throw Error("listener must be of type Function." + type);
	    	
	        for (var i=0, len=_s.listeners.events_ar.length; i < len; i++){
	        	if(_s.listeners.events_ar[i].target === this 
	        			&& _s.listeners.events_ar[i].type === type
	        			&& _s.listeners.events_ar[i].listener ===  listener
	        	){
	        		_s.listeners.events_ar.splice(i,1);
	        		break;
	        	}
	        }  
	    };
	    

	   //#############################################//
		/* clean main events */
		//#############################################//
		_s.cleanMainEvents = function(){
			if(window.removeEventListener){
				window.removeEventListener("resize", _s.onResizeHandler);
			}else if(window.detachEvent){
				window.detachEvent("onresize", _s.onResizeHandler);
			}
		
			clearTimeout(_s.resizeHandlerId_to);
			clearTimeout(_s.resizeHandler2Id_to);
			clearTimeout(_s.hidePreloaderId_to);
			clearTimeout(_s.orientationChangeId_to);
		};
		
		
		//#####################################################//
		/* Add background if embedded */
		//#####################################################//
		var args = FWDEVPUtils.getUrlArgs(window.location.search);
		var embedTest = args.EVPInstanceName;
	
		var tt = FWDEVPlayer.instaces_ar.length;
		var video;
		
		if(embedTest){
			for(var i=0; i<tt; i++){
				video = FWDEVPlayer.instaces_ar[i];
				if(video.props.instanceName == embedTest){
					var ws = FWDEVPUtils.getViewportSize();
					
					var dumy_do = new FWDEVPDO("div");
					dumy_do.setBkColor(video.props.backgroundColor);
					dumy_do.setWidth(ws.w);
					dumy_do.setHeight(ws.h);
				
					document.documentElement.style.overflow = "hidden";
					document.getElementsByTagName("body")[0].style.overflow = "hidden";
					
					if(FWDEVPUtils.isIEAndLessThen9){
						document.getElementsByTagName("body")[0].appendChild(dumy_do.screen);
					}else{
						document.documentElement.appendChild(dumy_do.screen);
					}
					break;
				}
			}
		}
	
		_s.init();
	};
	
	
	/* set prototype */
	FWDEVPlayer.setPrototype =  function(){
		FWDEVPlayer.prototype = new FWDEVPEventDispatcher();
	};
	
	FWDEVPlayer.stopAllVideos = function(pVideo){
		var tt = FWDEVPlayer.instaces_ar.length;
		var video;
		for(var i=0; i<tt; i++){
			video = FWDEVPlayer.instaces_ar[i];
			if(video != pVideo){
				video.stop();
			}
		};
	};
	
	FWDEVPlayer.pauseAllVideos = function(pVideo){
		var tt = FWDEVPlayer.instaces_ar.length;
		var video;
		for(var i=0; i<tt; i++){
			video = FWDEVPlayer.instaces_ar[i];
			if(video != pVideo){
				video.pause();
			}
		};
	};
	
	
	FWDEVPlayer.hasHTML5Video = true;
	
	FWDEVPlayer.hasHTMLHLS = (function(){
		var videoTest_el = document.createElement("video");
		var flag = false;
		if(videoTest_el.canPlayType){
			flag = Boolean(videoTest_el.canPlayType('application/vnd.apple.mpegurl') === "probably" || videoTest_el.canPlayType('application/vnd.apple.mpegurl') === "maybe");
		}
		return flag;
	}());
	
	FWDEVPlayer.instaces_ar = [];
	
	FWDEVPlayer.curInstance = null;
	FWDEVPlayer.keyboardCurInstance = null;
	FWDEVPlayer.areInstancesCreated_bl = null;
	FWDEVPlayer.isYoutubeAPICreated_bl = false;
	FWDEVPlayer.isEmbedded_bl = false;
	
	
	FWDEVPlayer.START_TO_SCRUB = "startToScrub";
	FWDEVPlayer.STOP_TO_SCRUB = "stopToScrub";
	FWDEVPlayer.CENTER = "center";
	FWDEVPlayer.LEFT = "left";
	FWDEVPlayer.RIGHT = "right";
	FWDEVPlayer.PAUSE_ALL_VIDEOS = "pause";
	FWDEVPlayer.STOP_ALL_VIDEOS = "stop";
	FWDEVPlayer.DO_NOTHING = "none";
	FWDEVPlayer.VIMEO = "vimeo";
	FWDEVPlayer.YOUTUBE = "youtube";
	FWDEVPlayer.VIDEO = "video";
	FWDEVPlayer.MP3 = "mp3";
	FWDEVPlayer.STICKY = "sticky";
	FWDEVPlayer.POSITION_TOP = "top";
	FWDEVPlayer.POSITION_BOTTOM = "bottom";
	FWDEVPlayer.SHOW_PLAY_BUTTON = 'showPlayButton';
	FWDEVPlayer.HIDE_PLAY_BUTTON = 'hidePlayButton';
	FWDEVPlayer.SAFE_TO_SCRUB = "safeToScrub";
	FWDEVPlayer.IFRAME = "iframe";
	FWDEVPlayer.SCRUB = "scrub";
	FWDEVPlayer.BACKGROUND_VIDEO = "backgroundvideo";
	FWDEVPlayer.READY = "ready";
	FWDEVPlayer.STOP = "stop";
	FWDEVPlayer.PLAY_START = "playStart";
	FWDEVPlayer.PLAY = "play";
	FWDEVPlayer.PAUSE = "pause";
	FWDEVPlayer.UPDATE = "update";
	FWDEVPlayer.UPDATE_TIME = "updateTime";
	FWDEVPlayer.UPDATE_VIDEO_SOURCE = "updateVideoSource";
	FWDEVPlayer.UPDATE_POSTER_SOURCE = "udpatePosterSource";
	FWDEVPlayer.PLAYBACK_RATE_CHANGE = "playbackRateChange";
	FWDEVPlayer.ERROR = "error";
	FWDEVPlayer.PLAY_COMPLETE = "playComplete";
	FWDEVPlayer.VOLUME_SET = "volumeSet";
	FWDEVPlayer.GO_FULLSCREEN = "goFullScreen";
	FWDEVPlayer.GO_NORMALSCREEN = "goNormalScreen";
	FWDEVPlayer.IMAGE = "image";
	FWDEVPlayer.VAST_LOADED_DONE = 'vastLoadingDone';
	FWDEVPlayer.HIDER_HIDE = 'hide';
	FWDEVPlayer.HIDER_SHOW = 'show';
	FWDEVPlayer.SHOW_CURSOR = 'showCursor';
	FWDEVPlayer.VR_START = 'vrStart';
	FWDEVPlayer.VR_STOP = 'vrStop';
	FWDEVPlayer.MANIFEST_PARSED_PLAY = 'manifesetParsedPlay';
	FWDEVPlayer.HIDE_LIGHTBOX_COMPLETE = "lightboxHideComplete";
	FWDEVPlayer.DASH = 'dash';
	FWDEVPlayer.HLS_JS = "HLS_JS";
	FWDEVPlayer.LIGHTBOX = "lightbox";
	FWDEVPlayer.RESPONSIVE = "responsive";
	FWDEVPlayer.FULL_SCREEN = "fullscreen";
	FWDEVPlayer.AFTER_PARENT = "afterparent";
	FWDEVPlayer.FRAMEWORK_LOAD = 'frload;';
	FWDEVPlayer.FRAMEWORK_DONE = 'frdone';
	
	
	window.FWDEVPlayer = FWDEVPlayer;
	
}(window));/**
 * Easy Video Player PACKAGED v9.1
 * Lightbox.
 *
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © 2006 All Rights Reserved.
 */
(function (window){

	'use strict';

	var FWDEVPLightBox = function(
			prt,
			mainBackgroundColor_str,
			holderBackgroundColor_str,
			lightBoxBackgroundOpacity,
			lightBoxWidth,
			lightBoxHeight
		){
		
		var _s  = this;
		var prototype = FWDEVPLightBox.prototype;

		_s.mainBackgroundColor_str = mainBackgroundColor_str;
		_s.holderBackgroundColor_str = holderBackgroundColor_str;
		
		_s.lightBoxBackgroundOpacity = lightBoxBackgroundOpacity;
		_s.lightBoxWidth = lightBoxWidth;
		_s.lightBoxHeight = lightBoxHeight;
		
		_s.isMobile_bl = FWDEVPUtils.isMobile;
		_s.hasPointerEvent_bl = FWDEVPUtils.hasPointerEvent;
		_s.closeButtonIsTweening_bl = true;
	
		_s.init = function(){
			_s.style().zIndex = 9999999;
			_s.setupMainContainers();
		};
		

		//#############################################//
		/* setup main containers */
		//#############################################//
		_s.setupMainContainers = function(){
			
			if(_s.isMobile_bl && _s.hasPointerEvent_bl) _s.style().msTouchAction = "none";
			
			_s.lightBoxBackground_sdo = new FWDEVPDO("div"); 
			_s.lightBoxBackground_sdo.setResizableSizeAfterParent();
			_s.lightBoxBackground_sdo.setBkColor(_s.mainBackgroundColor_str);
			_s.lightBoxBackground_sdo.screen.addEventListener('click', _s.closeButtonOnStartHandler);
			_s.addChild(_s.lightBoxBackground_sdo);
			
			_s.mainLightBox_do = new FWDEVPDO("div");
			_s.mainLightBox_do.setBkColor(_s.holderBackgroundColor_str);
			_s.mainLightBox_do.setWidth(1);
			_s.mainLightBox_do.setHeight(1);

			_s.addChild(_s.mainLightBox_do);
			
			document.documentElement.appendChild(_s.screen);

			_s.setX(-10000);
			_s.setY(-10000);
			_s.setWidth(0);
			_s.setHeight(0);
		};
		
		_s.show = function(){
			if(_s.isShowed_bl) return;
			_s.isShowed_bl = true;
			if(_s.clsBtn){
				_s.hideCloseButton(false);
				_s.showCloseButton(true);
				_s.clsBtn.setX(-200);
			}else{
				_s.loadClsoeButtonImage();
			}
			
			var viewportSize = FWDEVPUtils.getViewportSize();
			var scrollOffsets = FWDEVPUtils.getScrollOffsets();
			
			_s.setWidth(viewportSize.w);
			_s.setHeight(viewportSize.h);
			_s.setX(scrollOffsets.x);
			_s.setY(scrollOffsets.y);
			
			_s.lightBoxBackground_sdo.setAlpha(0);
			FWDAnimation.to(_s.lightBoxBackground_sdo, .8, {alpha:_s.lightBoxBackgroundOpacity});
			_s.setX(scrollOffsets.x);
			_s.setY(scrollOffsets.y);
			
			_s.mainLightBox_do.setX(parseInt(viewportSize.w/2));
			_s.mainLightBox_do.setY(parseInt(viewportSize.h/2));
			
			if(_s.lightBoxWidth > viewportSize.w){
				_s.finalLightBoxWidth = viewportSize.w;
				_s.finalLightBoxHeight = parseInt(_s.lightBoxHeight * (viewportSize.w/_s.lightBoxWidth));
			}else{
				_s.finalLightBoxWidth = _s.lightBoxWidth;
				_s.finalLightBoxHeight = _s.lightBoxHeight;
			}
			
			FWDAnimation.to(_s.mainLightBox_do, .8, {
				w:_s.finalLightBoxWidth, 
				h:_s.finalLightBoxHeight,
				x:parseInt((viewportSize.w - _s.finalLightBoxWidth)/2),
				y:parseInt((viewportSize.h - _s.finalLightBoxHeight)/2),
				delay:.4,
				onComplete:_s.showComplete,
				ease:Expo.easeInOut});
				
			prt.stageContainer = _s.mainLightBox_do.screen;
			if(prt.main_do){
				prt.main_do.setX(-5000);
				if(!prt.stageContainer.contains(prt.main_do.screen)) prt.stageContainer.appendChild(prt.main_do.screen);
			}
			_s.dispatchEvent(FWDEVPLightBox.SHOW);
		}
		
		_s.showComplete = function(){
			_s.clsBtn.addListener(FWDEVPSimpleButton.MOUSE_UP, _s.closeButtonOnStartHandler);
			_s.addKeyboardSupport();
			prt.startResizeHandler();
			_s.showComplete_bl = true;
			
			if(prt._d.autoPlay_bl){
				prt.play();
			}
		}
		
		
		//####################################//
		/* Add keyboard support */
		//#####################################//
		_s.addKeyboardSupport = function(){
			document.addEventListener("keydown",  _s.onKeyDownHandler);	
		}
		
		_s.onKeyDownHandler = function(e){
			if(e.keyCode == 27) _s.closeButtonOnStartHandler();
		}

		
		//#############################################//
		/* setup lightbox close button */
		//#############################################//
		_s.loadClsoeButtonImage = function(){
			_s.closeN_img = new Image();
			_s.closeN_img.onload = _s.setupCloseButton;
			_s.closeN_img.src = prt.mainFolderPath_str + prt.sknPth + "embed-close-button.png";
			_s.closeSPath_str = prt.mainFolderPath_str + prt.sknPth + "embed-close-button-over.png";
		}
		
		_s.setupCloseButton = function(e){
			var viewportSize = FWDEVPUtils.getViewportSize();
			FWDEVPSimpleButton.setPrototype();
			_s.clsBtn = new FWDEVPSimpleButton(_s.closeN_img, _s.closeSPath_str, undefined, true);
			
			_s.hideCloseButton(false);
			_s.showCloseButton(true);
			_s.clsBtn.setX(viewportSize.w - _s.clsBtn.w - 15);
			_s.clsBtn.setY(- 15);
			_s.addChild(_s.clsBtn);
		};
		
		_s.showCloseButtonComplete = function(){
			_s.closeButtonIsTweening_bl = false;
		}
		
		_s.hideCloseButton = function(animate){
			FWDAnimation.killTweensOf(_s.clsBtn);
			if(!animate){
				_s.clsBtn.setAlpha(0);
			}else{
				FWDAnimation.to(_s.clsBtn, .9, {alpha:0});	
			}
		}
		
		_s.showCloseButton = function(animate){
			
			FWDAnimation.killTweensOf(_s.clsBtn);
			if(!animate){
				_s.clsBtn.setAlpha(1);
			}else{
				FWDAnimation.to(_s.clsBtn, .9, {alpha:1, delay:.8});	
			}
		}
		
		_s.mouseDummyHandler = function(e){
			if(e.preventDefault){
				e.preventDefault();
			}else{
				return false;
			}
		};
			
		_s.closeButtonOnStartHandler = function(e){
			if(!_s.isShowed_bl || !_s.showComplete_bl) return;
			_s.isShowed_bl = false;
			var viewportSize = FWDEVPUtils.getViewportSize();
			
			_s.clsBtn.removeListener(FWDEVPSimpleButton.MOUSE_UP, _s.closeButtonOnStartHandler);
			
			FWDAnimation.to(_s.clsBtn, .9, {alpha:0});
			
			FWDAnimation.to(_s.mainLightBox_do, .8, {
				w:0, 
				h:0,
				x:parseInt(viewportSize.w/2),
				y:parseInt(viewportSize.h/2),
				delay:.4,
				ease:Expo.easeInOut});
			
			FWDAnimation.to(_s.lightBoxBackground_sdo, .8, {alpha:0, delay:.8});
			FWDAnimation.to(prt.main_do, .8, {x:-prt.main_do.w/2, y:-prt.main_do.h/2 , ease:Expo.easeInOut, delay:.4});
			_s.lighboxAnimDoneId_to = setTimeout(_s.lighboxHideAnimationDone, 1600);
			
			
			_s.dispatchEvent(FWDEVPLightBox.CLOSE);
		};
		
		_s.lighboxHideAnimationDone = function(){
			_s.setX(-10000);
			_s.setY(-10000);
			_s.setWidth(0);
			_s.setHeight(0);
			_s.dispatchEvent(FWDEVPLightBox.HIDE_COMPLETE);
		};
		
		
		_s.init();
	};
	
	
	/* set prototype */
    FWDEVPLightBox.setPrototype = function(){
    	FWDEVPLightBox.prototype = new FWDEVPDO("div");
    };
    
    FWDEVPLightBox.CLOSE = "ligtBoxClose";
    FWDEVPLightBox.SHOW = "show";
    FWDEVPLightBox.HIDE_COMPLETE = "hideComplete";
    
    FWDEVPLightBox.prototype = null;
	window.FWDEVPLightBox = FWDEVPLightBox;
}(window));/**
 * Easy Video Player PACKAGED v9.1
 * Logo.
 *
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © 2006 All Rights Reserved.
 */
(function (window){
	
	var FWDEVPLogo = function(
			prt, 
			source,
			position,
			margins
		){

		'use strict';
		
		var _s  = this;
		var prototype = FWDEVPLogo.prototype;
	
		_s.position_str = position;
		_s.source_str = source;
		_s.logoLink_str = prt._d.logoLink_str;
		_s.margins = margins;
		
		_s.isShowed_bl = true;
		_s.allowToShow_bl = true;
	
		_s.init = function(){
			
			if(_s.logoLink_str == "none"){
				_s.style().pointerEvents = "none";
			}else{
				_s.setButtonMode(true);
				_s.screen.onclick = function(){window.open(_s.logoLink_str, "_blank");};
			}
			
			_s.logoImage_do = new FWDEVPDO("img");
			
			_s.img_img = new Image();
			_s.img_img.onerror = null;
			_s.img_img.onload = _s.loadDone;
			_s.img_img.src = _s.source_str + "?" + (new Date()).getTime();
			_s.hide();
		};
		
		_s.loadDone = function(){
			_s.setWidth(_s.img_img.width);
			_s.setHeight(_s.img_img.height);
			
			_s.logoImage_do.setScreen(_s.img_img);
			_s.addChild(_s.logoImage_do);
			_s.logoImage_do.setWidth(_s.img_img.width);
			_s.logoImage_do.setHeight(_s.img_img.height);
			
			_s.positionAndResize();
		};
		
		_s.positionAndResize = function(){
			
			if(_s.position_str == "topleft"){
				_s.finalX = _s.margins;
				_s.finalY = _s.margins;
			}else if(_s.position_str == "topright"){
				_s.finalX = prt.sW - _s.w - _s.margins;
				_s.finalY = _s.margins;
			}else if(_s.position_str == "bottomright"){
				_s.finalX = prt.sW - _s.w - _s.margins;
				_s.finalY = prt.sH - _s.h - _s.margins;
			}else if(_s.position_str == "bottomleft"){
				_s.finalX = _s.margins;
				_s.finalY = prt.sH - _s.h - _s.margins;
			}
		
			_s.setX(_s.finalX);
			_s.setY(_s.finalY);
		};

		
		//################################//
		/* show / hide */
		//################################//
		_s.show = function(animate){
			if(_s.isShowed_bl) return;
			_s.isShowed_bl = true;
			_s.setVisible(true);
			FWDAnimation.killTweensOf(_s);
			if(animate){
				FWDAnimation.to(_s, .8, {alpha:1, ease:Expo.easeInOut});
			}else{
				_s.setAlpha(1);
			}
		};
		
		_s.hide = function(animate, overwrite){
			if(!_s.isShowed_bl && !overwrite) return;
			_s.isShowed_bl = false;
			FWDAnimation.killTweensOf(_s);
			if(animate){
				FWDAnimation.to(_s, .8, {alpha:0, ease:Expo.easeInOut, onComplete:function(){
					_s.setVisible(false);
				}});
			}else{
				_s.setAlpha(0);
				_s.setVisible(false);
			}
		};
		
		_s.init();
	};
	
	
	/* set prototype */
    FWDEVPLogo.setPrototype = function(){
    	FWDEVPLogo.prototype = new FWDEVPDO("div");
    };
    
    FWDEVPLogo.prototype = null;
	window.FWDEVPLogo = FWDEVPLogo;
}(window));/**
 * Easy Video Player PACKAGED v9.1
 * Opener for the sticky display.
 *
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © 2006 All Rights Reserved.
 */
(function (){
	
	var FWDEVPOpener = function(prt, _d, position_str, playerIsShowed_bl){

		'use strict';
		
		var _s = this;
		
		_s.animation_img = _d.openerAnimation_img;
		
		if(position_str ==  FWDEVPlayer.POSITION_TOP){
			_s.openN_img = _d.openTopN_img;
			_s.openSPath_str = _d.openTopSPath_str;		
		}else{
			_s.openN_img = _d.openBottomN_img;
			_s.openSPath_str = _d.openBottomSPath_str;
		}
	
		_s.openerPauseN_img = _d.openerPauseN_img;
		_s.openerPlayN_img = _d.openerPlayN_img;
		_s.closeN_img = _d.closeN_img;
		
		_s.useHEX = _d.useHEX; 
		_s.nBC = _d.nBC;
		_s.sBC = _d.sBC;
		
		_s.openerPauseS_str = _d.openerPauseS_str;
		_s.openerPlaySPath_str = _d.openerPlayS_str;
		_s.closeSPath_str = _d.closeSPath_str;
		_s.animationPath_img = _d.animationPath_img;
	
		_s.totalWidth = _s.openN_img.width;
		_s.totalHeight = _s.openN_img.height;
		_s.position_str = position_str;
		_s.alignment_str = _d.openerAlignment_str;
		
		_s.openerEqulizerOffsetLeft = _d.openerEqulizerOffsetLeft; 
		_s.openerEqulizerOffsetTop = _d.openerEqulizerOffsetTop;
		
		_s.showFirstTime_bl = true;
		_s.playerIsShowed_bl = playerIsShowed_bl;
		_s.showOpenerPlayPauseButton_bl = _d.showOpenerPlayPauseButton_bl;
		_s.isMobile_bl = FWDEVPUtils.isMobile;
		_s.hasPointerEvent_bl = FWDEVPUtils.hasPointerEvent;
		
		_s.init = function(){
			if(_d.sknPth.indexOf("hex_white") != -1){
				_s.sBC = "#FFFFFF";
			}else{
				_s.sBC = _d.sBC;
			}
			_s.hasT3D = false;
			_s.hasT2D = false;
			_s.setBackfaceVisibility();
			_s.style().msTouchAction = "none";
			_s.style().webkitTapHighlightColor = "rgba(0, 0, 0, 0)";
			_s.setupStuff();
			if(_s.showOpenerPlayPauseButton_bl) _s.setupPlayPauseButton();
		
			if(_s.playerIsShowed_bl) _s.showCloseButton();
			if(_s.showOpenerPlayPauseButton_bl){
				_s.setWidth(_s.totalWidth + _s.openerPauseN_img.width + 1);
			}else{
				_s.setWidth(_s.totalWidth);
			}
			_s.setHeight(_s.totalHeight);
		};
	

		//######################################//
		/* setup main stuff */
		//######################################//
		_s.setupStuff = function(e){
			_s.mainHolder_do = new FWDEVPDO("div");
			_s.mainHolder_do.hasT3D = false;
			_s.mainHolder_do.hasT2D = false;
			_s.mainHolder_do.setBackfaceVisibility();
			
			if(_s.showOpenerPlayPauseButton_bl){
				_s.mainHolder_do.setWidth(_s.totalWidth + _s.openerPauseN_img.width + 1);
			}else{
				_s.mainHolder_do.setWidth(_s.totalWidth);
			}
			_s.mainHolder_do.setHeight(_s.totalHeight);
			
			if(_s.useHEX){
				_s.openN_do = new FWDEVPDO("div");
				_s.openN_canvas = FWDEVPUtils.getCanvasWithModifiedColor(_s.openN_img, _s.nBC).canvas;
				_s.openN_do.screen.appendChild(_s.openN_canvas);
			}else{
				_s.openN_do = new FWDEVPDO("img");
				_s.openN_do.setScreen(_s.openN_img);
			}
			_s.openN_do.setWidth(_s.openN_img.width);
			_s.openN_do.setHeight(_s.openN_img.height);
			
			
			_s.openS_img = new Image();
			_s.openS_img.src = _s.openSPath_str;	
			if(_s.useHEX){
				_s.openS_do = new FWDEVPDO("div");
				_s.openS_img.onload = function(){		
					_s.openS_canvas = FWDEVPUtils.getCanvasWithModifiedColor(_s.openS_img, _s.sBC).canvas;
					_s.openS_do.setWidth(_s.openS_img.width);
					_s.openS_do.setHeight(_s.openS_img.height);
					_s.openS_do.screen.appendChild(_s.openS_canvas);
				}					
			}else{
				_s.openS_do = new FWDEVPDO("img"); 
				_s.openS_do.setScreen(_s.openS_img);
			}
			_s.openS_do.setWidth(_s.openN_do.w);
			_s.openS_do.setHeight(_s.openN_do.h);
			_s.openS_do.setAlpha(0);
			
			
			if(_s.useHEX){
				_s.closeN_do = new FWDEVPDO("div");
				_s.closeN_canvas = FWDEVPUtils.getCanvasWithModifiedColor(_s.closeN_img, _s.nBC).canvas;
				_s.closeN_do.screen.appendChild(_s.closeN_canvas);
			}else{
				_s.closeN_do = new FWDEVPDO("img");
				_s.closeN_do.setScreen(_s.closeN_img);
			}
			_s.closeN_do.setWidth(_s.closeN_img.width);
			_s.closeN_do.setHeight(_s.closeN_img.height);
			
			_s.closeN_do.hasT3D = false;
			_s.closeN_do.hasT2D = false;
			_s.closeN_do.setBackfaceVisibility();
			
			_s.closeS_img = new Image();
			_s.closeS_img.src = _s.closeSPath_str;	
			if(_s.useHEX){
				_s.closeS_do = new FWDEVPDO("div");
				_s.closeS_img.onload = function(){		
					_s.closeS_canvas = FWDEVPUtils.getCanvasWithModifiedColor(_s.closeS_img, _s.sBC).canvas;
					_s.closeS_do.setWidth(_s.closeN_img.width);
					_s.closeS_do.setHeight(_s.closeN_img.height);
					_s.closeS_do.screen.appendChild(_s.closeS_canvas);
				}					
			}else{
				_s.closeS_do = new FWDEVPDO("img"); 
				_s.closeS_do.setScreen(_s.closeS_img);
			}
			
			_s.closeS_do.setWidth(_s.closeN_img.width);
			_s.closeS_do.setHeight(_s.closeN_img.height);
			
			_s.closeS_do.setAlpha(0);
			_s.closeS_do.hasT3D = false;
			_s.closeS_do.hasT2D = false;
			
			
			FWDEVPPreloader2.setPrototype();
			_s.animation_do = new FWDEVPPreloader2(_s.animationPath_img, 29, 22, 31, 80, true);
			_s.animation_do.setY(_s.openerEqulizerOffsetTop);
			_s.animation_do.show(false);
			_s.animation_do.stop();
			
			_s.dumy_do = new FWDEVPDO("div");
			_s.dumy_do.setWidth(_s.totalWidth);
			_s.dumy_do.setHeight(_s.totalHeight);
			_s.dumy_do.style().zIndex = 2;
			_s.dumy_do.hasT3D = false;
			_s.dumy_do.hasT2D = false;
			_s.dumy_do.setBackfaceVisibility();
			_s.dumy_do.setButtonMode(true);
			
			if(FWDEVPUtils.isIE || FWDEVPUtils.isAndroid){
				_s.dumy_do.setBkColor("#FF0000");
				_s.dumy_do.setAlpha(.01);
			}
		
			
			if(_s.hasPointerEvent_bl){
				_s.mainHolder_do.screen.addEventListener("pointerup", _s.onMouseUp);
				_s.mainHolder_do.screen.addEventListener("pointerover", _s.onMouseOver);
				_s.mainHolder_do.screen.addEventListener("pointerout", _s.onMouseOut);
			}else if(_s.screen.addEventListener){	
				if(!_s.isMobile_bl){
					_s.mainHolder_do.screen.addEventListener("mouseover", _s.onMouseOver);
					_s.mainHolder_do.screen.addEventListener("mouseout", _s.onMouseOut);
					_s.mainHolder_do.screen.addEventListener("mouseup", _s.onMouseUp);
				}
				_s.screen.addEventListener("touchend", _s.onMouseUp);
			}
			
			_s.mainHolder_do.addChild(_s.openN_do);
			_s.mainHolder_do.addChild(_s.openS_do);
			
			_s.mainHolder_do.addChild(_s.closeN_do);
			_s.mainHolder_do.addChild(_s.closeS_do);
			_s.mainHolder_do.addChild(_s.animation_do);
			_s.mainHolder_do.addChild(_s.dumy_do);
			_s.addChild(_s.mainHolder_do);
		};
		
		_s.onMouseOver = function(e, animate){
			if(!e.pointerType || e.pointerType == e.MSPOINTER_TYPE_MOUSE || e.pointerType == "mouse"){
				_s.setSelectedState();
			}
		};
			
		_s.onMouseOut = function(e){
			if(!e.pointerType || e.pointerType == e.MSPOINTER_TYPE_MOUSE || e.pointerType == "mouse"){
				_s.setNormalState();
			}
		};
		
		_s.onMouseUp = function(e){
			if(e.preventDefault) e.preventDefault();
			if(_s.playerIsShowed_bl){
				_s.playerIsShowed_bl = false;
				_s.dispatchEvent(FWDEVPOpener.HIDE);
			}else{
				_s.playerIsShowed_bl = true;
				_s.dispatchEvent(FWDEVPOpener.SHOW);
			}
		};
		

		//################################################//
		/* Setup play button */
		//################################################//
		_s.setupPlayPauseButton = function(){
			FWDEVPComplexButton.setPrototype();
			_s.playPauseButton_do = new FWDEVPComplexButton(
					_s.openerPlayN_img,
					_s.openerPlaySPath_str,
					_s.openerPauseN_img,
					_s.openerPauseS_str,
					true,
					_s.useHEX,
					_s.nBC,
					_s.sBC
			);
			_s.playPauseButton_do.addListener(FWDEVPComplexButton.MOUSE_UP, _s.playButtonMouseUpHandler);
			_s.addChild(_s.playPauseButton_do);
		};
		
		_s.showPlayButton = function(){
			if(_s.playPauseButton_do) _s.playPauseButton_do.setButtonState(1);
			_s.animation_do.stop();
		};
		
		_s.showPauseButton = function(){
			if(_s.playPauseButton_do) _s.playPauseButton_do.setButtonState(0);
			_s.animation_do.start(0);
		};
		
		_s.playButtonMouseUpHandler = function(){
			if(_s.playPauseButton_do.currentState == 0){
				_s.dispatchEvent(FWDEVPController.PAUSE);
			}else{
				_s.dispatchEvent(FWDEVPController.PLAY);
			}
		};
		

		//###############################//
		/* set normal / selected state */
		//################################//
		_s.setNormalState = function(){
			if(_s.isMobile_bl && !_s.hasPointerEvent_bl) return;
			FWDAnimation.killTweensOf(_s.openS_do);
			FWDAnimation.killTweensOf(_s.closeS_do);
			FWDAnimation.to(_s.openS_do, .5, {alpha:0, ease:Expo.easeOut});	
			FWDAnimation.to(_s.closeS_do, .5, {alpha:0, ease:Expo.easeOut});
		};
		
		_s.setSelectedState = function(animate){
			FWDAnimation.killTweensOf(_s.openS_do);
			FWDAnimation.killTweensOf(_s.closeS_do);
			FWDAnimation.to(_s.openS_do, .5, {alpha:1, ease:Expo.easeOut});	
			FWDAnimation.to(_s.closeS_do, .5, {alpha:1, ease:Expo.easeOut});
		};
		

		//######################################//
		/* show /hide close / open */
		//######################################//
		_s.showOpenButton = function(){
			_s.playerIsShowed_bl = false;
			_s.closeN_do.setX(150);
			_s.closeS_do.setX(150);
			
			if(_s.playPauseButton_do){
				if(_s.alignment_str == "right"){
					_s.playPauseButton_do.setX(0);
					_s.openN_do.setX(_s.playPauseButton_do.w + 1);
					_s.openS_do.setX(_s.playPauseButton_do.w + 1);
					_s.dumy_do.setX(_s.playPauseButton_do.w + 1);
					_s.dumy_do.setWidth(_s.totalWidth);
					_s.animation_do.setX(_s.playPauseButton_do.w + 1 + _s.openerEqulizerOffsetLeft);
				}else{
					_s.playPauseButton_do.setX(_s.openN_do.w + 1);
					_s.openN_do.setX(0);
					_s.openS_do.setX(0);
					_s.dumy_do.setX(0);
					_s.dumy_do.setWidth(_s.totalWidth);
					_s.animation_do.setX(_s.openerEqulizerOffsetLeft);
				}
			}else{
				_s.openN_do.setX(0);
				_s.openS_do.setX(0);
				_s.dumy_do.setX(0);
				_s.dumy_do.setWidth(_s.totalWidth);
				_s.animation_do.setX(_s.openerEqulizerOffsetLeft);
			}
			_s.animation_do.setVisible(true);
		};
		
		_s.showCloseButton = function(){
			_s.playerIsShowed_bl = true;
			_s.openN_do.setX(150);
			_s.openS_do.setX(150);
			_s.dumy_do.setWidth(_s.closeN_do.w);
			if(_s.alignment_str == "right"){
				if(_s.playPauseButton_do){
					_s.closeN_do.setX(_s.totalWidth + 1);
					_s.closeS_do.setX(_s.totalWidth + 1);
					_s.dumy_do.setX(_s.totalWidth + 1);
				}else{
					_s.closeN_do.setX(_s.totalWidth - _s.closeN_do.w);
					_s.closeS_do.setX(_s.totalWidth - _s.closeN_do.w);
					_s.dumy_do.setX(_s.totalWidth - _s.closeN_do.w);
				}
			}else{
				_s.closeN_do.setX(0);
				_s.closeS_do.setX(0);
				_s.dumy_do.setX(0);
			}
			
			if(_s.playPauseButton_do) _s.playPauseButton_do.setX(150);
			_s.animation_do.setX(150);
			_s.animation_do.setVisible(false);
		};
		
		_s.hide = function(){
			_s.mainHolder_do.setX(150);
		};
		
		_s.show = function(){
			_s.mainHolder_do.setX(0);
		};
		

		//##########################################//
		/* Update HEX color of a canvaas */
		//##########################################//
		_s.updateHEXColors = function(nBC, sBC){
			
			_s.nBC = nBC;
			_s.sBC = sBC;
			_s.playPauseButton_do.updateHEXColors(nBC, sBC);
			FWDEVPUtils.changeCanvasHEXColor(_s.openN_img, _s.openN_canvas, nBC);
			FWDEVPUtils.changeCanvasHEXColor(_s.closeN_img, _s.closeN_canvas, nBC);
			
			FWDEVPUtils.changeCanvasHEXColor(_s.openS_img, _s.openS_canvas, sBC);
			FWDEVPUtils.changeCanvasHEXColor(_s.closeS_img, _s.closeS_canvas, sBC);
		}
		
		_s.init();
	};
	

	/* set prototype */
	FWDEVPOpener.setPrototype = function(){
		FWDEVPOpener.prototype = new FWDEVPDO("div");
	};
	
	FWDEVPOpener.SHOW = "show";
	FWDEVPOpener.HIDE = "hise";
	FWDEVPOpener.PLAY = "play";
	FWDEVPOpener.PAUSE = "pause";
	
	
	FWDEVPOpener.prototype = null;
	window.FWDEVPOpener = FWDEVPOpener;
	
}(window));/**
 * Easy Video Player PACKAGED v9.1
 * Popup window.
 *
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © 2006 All Rights Reserved.
 */
(function (window){

	var FWDEVPOPWindow = function(_d, prt){

		'use strict';
		
		var _s = this;
		var prototype = FWDEVPOPWindow.prototype;
	
		_s.buttons_ar = [];
		_s.maxWidth = _d.aopwWidth;
		_s.maxHeight = _d.aopwHeight + _d.popwColseN_img.height + 1; 
		_s.sW = 0;
		_s.sH = 0;
		_s.aopwSource = _d.aopwSource;
		_s.aopwTitle = _d.aopwTitle;
		_s.aopwTitleColor_str = _d.aopwTitleColor_str;
		_s.aopwBorderSize = _d.aopwBorderSize;
		
		_s.isShowed_bl = false;
		_s.isMobile_bl = FWDEVPUtils.isMobile;
	

		//#################################//
		/* init */
		//#################################//
		_s.init = function(){
			_s.setBackfaceVisibility();
			
			_s.mainBar_do = new FWDEVPDO("div");
			
			_s.bar_do = new FWDEVPDO("div");
			_s.bar_do.style().background = "url('" + _d.popwBarBackgroundPath_str + "')";
			
			_s.adHolder_do = new FWDEVPDO("div");
		
			
			_s.adBk_do = new FWDEVPDO("div");
			_s.adBk_do.style().background = "url('" + _d.popwWindowBackgroundPath_str + "')";
				
			//setup close button
			FWDEVPSimpleButton.setPrototype();
			_s.closeButton_do = new FWDEVPSimpleButton(_d.popwColseN_img, _d.popwColseSPath_str, undefined,
					true,
					_d.useHEX,
					_d.nBC,
					_d.sBC);
			_s.closeButton_do.addListener(FWDEVPSimpleButton.MOUSE_UP, _s.closeButtonOnMouseUpHandler);
			
			
			_s.title_do = new FWDEVPDO("div");
			_s.title_do.style().width = "100%";
			_s.title_do.style().textAlign = "left";
			_s.title_do.style().fontFamily = "Arial";
			_s.title_do.style().fontSize= "14px";
			_s.title_do.style().fontWeight = "100";
			_s.title_do.style().color = _s.aopwTitleColor_str;
			_s.title_do.setInnerHTML(_s.aopwTitle);
			_s.bar_do.addChild(_s.title_do);
			
			_s.addChild(_s.adBk_do);
			_s.mainBar_do.addChild(_s.bar_do);
			_s.mainBar_do.addChild(_s.closeButton_do); 
			_s.mainBar_do.setHeight(_s.closeButton_do.h);
			_s.addChild(_s.mainBar_do);
			_s.addChild(_s.adHolder_do);
			_s.bar_do.setHeight(_s.mainBar_do.h);
		};
		
		_s.closeButtonOnMouseUpHandler = function(){
			if(!_s.isShowed_bl) return;
			_s.hide();
			prt.play();
		};
		
		_s.positionAndResize = function(){
			_s.sW = Math.min(prt.sW, _s.maxWidth);
			_s.sH = Math.min(prt.sH, _s.maxHeight);
			var totalScale = 1;
			var scaleX = prt.sW/_s.maxWidth;
			var scaleY = prt.sH/_s.maxHeight;
			if(scaleX < scaleY){
				totalScale = scaleX;
			}else if(scaleX > scaleY){
				totalScale = scaleY;
			}
			if(totalScale > 1) totalScale = 1;
			
			_s.sW = totalScale * _s.maxWidth;
			_s.sH = totalScale * _s.maxHeight;
				
			_s.setWidth(_s.sW);
			_s.setHeight(_s.sH);
		
			_s.setHeight(_s.sH);
			_s.setX(Math.round((prt.sW - _s.sW)/2));
			_s.setY(Math.round((prt.sH - _s.sH)/2));
			
			_s.mainBar_do.setWidth(_s.sW);
			_s.closeButton_do.setX(_s.sW - _s.closeButton_do.w);
			_s.bar_do.setWidth(_s.sW - _s.closeButton_do.w - 1);
			
			_s.adBk_do.setWidth(_s.sW);
			_s.adBk_do.setHeight(_s.sH - _s.mainBar_do.h - 1);
			_s.adBk_do.setY(_s.mainBar_do.h + 1);
			
			_s.adHolder_do.setWidth(_s.sW - _s.aopwBorderSize * 2);
			_s.adHolder_do.setX(_s.aopwBorderSize);
			_s.adHolder_do.setY(_s.mainBar_do.h + _s.aopwBorderSize + 1);
			_s.adHolder_do.setHeight(_s.sH - _s.mainBar_do.h - _s.aopwBorderSize * 2 - 1);
		};
		
		
		//###########################################//
		/* show / hide */
		//###########################################//
		_s.show = function(id){
			if(_s.isShowed_bl) return;
			_s.isShowed_bl = true;
			prt.main_do.addChild(_s);
			_s.adHolder_do.setInnerHTML("<iframe width='100%' height='100%' scrolling='no' frameBorder='0' src=" + _s.aopwSource + "></iframe>");
			_s.positionAndResize();
			
			_s.title_do.setX(8);
			_s.title_do.setY(Math.round((_s.bar_do.h - _s.title_do.getHeight())/2));
		};
		
		_s.showCompleteHandler = function(){};
		
		_s.hide = function(){
			if(!_s.isShowed_bl) return;
			_s.isShowed_bl = false;
			if(prt.main_do.contains(_s)) prt.main_do.removeChild(_s);
		};
		
		_s.hideCompleteHandler = function(){
			prt.main_do.removeChild(_s);
			_s.dispatchEvent(FWDEVPOPWindow.HIDE_COMPLETE);
		};
		

		//##########################################//
		/* Update HEX color of a canvaas */
		//##########################################//
		_s.updateHEXColors = function(nBC, sBC){
			_s.closeButton_do.updateHEXColors(nBC, sBC);
		}
	
		_s.init();
	};
		
		
	/* set prototype */
	FWDEVPOPWindow.setPrototype = function(){
		FWDEVPOPWindow.prototype = new FWDEVPDO("div");
	};
	
	FWDEVPOPWindow.HIDE_COMPLETE = "hideComplete";
	
	FWDEVPOPWindow.prototype = null;
	window.FWDEVPOPWindow = FWDEVPOPWindow;
}(window));/**
 * Easy Video Player PACKAGED v9.1
 * Password window.
 *
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © 2006 All Rights Reserved.
 */
(function (window){

	var FWDEVPPassword = function(_d, prt, lg){

		'use strict';
		
		var _s = this;
		var prototype = FWDEVPPassword.prototype;
	
		_s.passColoseN_img = _d.passColoseN_img;
		
	
		_s.embedWindowBackground_str = _d.embedWindowBackground_str;
		
		_s.secondaryLabelsColor_str = _d.secondaryLabelsColor_str;
		_s.inputColor_str = _d.inputColor_str;
		_s.mainLabelsColor_str = _d.mainLabelsColor_str;
		_s.passButtonNPath_str = _d.passButtonNPath_str;
		_s.passButtonSPath_str = _d.passButtonSPath_str;
		_s.inputBackgroundColor_str = _d.inputBackgroundColor_str;
		_s.borderColor_str = _d.borderColor_str;
		
		_s.maxTextWidth = 0;
		_s.totalWidth = 0;
		_s.sW = 0;
		_s.sH = 0;
		_s.buttonWidth = 28;
		_s.buttonHeight = 19;
		_s.embedWindowCloseButtonMargins = _d.embedWindowCloseButtonMargins;		
		_s.useVectorIcons_bl = _d.useVectorIcons_bl;
		_s.isShowed_bl = false;
		_s.isMobile_bl = FWDEVPUtils.isMobile;
	
		//#################################//
		/* init */
		//#################################//
		_s.init = function(){
			if(_s.clsBtn) return;
			_s.setBackfaceVisibility();
			_s.mainHld = new FWDEVPDO("div");
			_s.mainHld.hasT3D = false;
			_s.mainHld.hasT2D = false;
			_s.mainHld.setBackfaceVisibility();
			
			_s.bk_do = new FWDEVPDO("div");
			_s.bk_do.style().width = "100%";
			_s.bk_do.style().height = "100%";
			_s.bk_do.setAlpha(.9);
			_s.bk_do.style().background = "url('" + _s.embedWindowBackground_str + "')";
		
			_s.passMainHolder_do =  new FWDEVPDO("div");
			
			_s.passMainHolderBk_do = new FWDEVPDO("div");
			_s.passMainHolderBk_do.style().background = "url('" + _s.embedWindowBackground_str + "')";
			_s.passMainHolderBk_do.style().borderStyle = "solid";
			_s.passMainHolderBk_do.style().borderWidth = "1px";
			_s.passMainHolderBk_do.style().borderColor =  _s.borderColor_str;
			
			_s.passMainLabel_do = new FWDEVPDO("div");
			_s.passMainLabel_do.setBackfaceVisibility();
			_s.passMainLabel_do.screen.className = 'fwdevp-password-title'
			_s.passMainLabel_do.style().fontFamily = "Arial";
			_s.passMainLabel_do.style().fontSize= "12px";
			_s.passMainLabel_do.style().color = _s.mainLabelsColor_str;
			_s.passMainLabel_do.style().whiteSpace= "nowrap";
			_s.passMainLabel_do.style().padding = "0px";
			_s.passMainLabel_do.setInnerHTML("PRIVATE CONTENT");	
			
			_s.passLabel_do = new FWDEVPDO("div");
			_s.passLabel_do.setBackfaceVisibility();
			_s.passLabel_do.screen.className = 'fwdevp-password-label';
			_s.passLabel_do.style().fontFamily = "Arial";
			_s.passLabel_do.style().fontSize= "12px";
			_s.passLabel_do.style().color = _s.secondaryLabelsColor_str;
			_s.passLabel_do.style().whiteSpace= "nowrap";
	
			_s.passLabel_do.style().padding = "0px";
			_s.passLabel_do.setInnerHTML("Please enter password:");
			
			_s.passInput_do = new FWDEVPDO("input");
			_s.passInput_do.screen.className = 'fwdevp-password-input';
			_s.passInput_do.setBackfaceVisibility();
			_s.passInput_do.style().fontFamily = "Arial";
			_s.passInput_do.style().fontSize= "12px";
			_s.passInput_do.style().backgroundColor = _s.inputBackgroundColor_str;
			_s.passInput_do.style().color = _s.inputColor_str;
			_s.passInput_do.style().outline = 0;
			_s.passInput_do.style().whiteSpace= "nowrap";
			_s.passInput_do.style().padding = "6px";
			_s.passInput_do.style().paddingTop = "4px";
			_s.passInput_do.style().paddingBottom = "4px";
			_s.passInput_do.screen.setAttribute("type", "password");
			
			if(!lg){
				FWDEVPSimpleSizeButton.setPrototype();
				_s.passButton_do = new FWDEVPSimpleSizeButton(
						_s.passButtonNPath_str, 
						_s.passButtonSPath_str,
						_s.buttonWidth,
						_s.buttonHeight,
						_d.useHEX,
						_d.nBC,
						_d.sBC
						);
				_s.passButton_do.addListener(FWDEVPSimpleSizeButton.CLICK, _s.passClickHandler);
			
				//setup close button
				FWDEVPSimpleButton.setPrototype();
				if(_s.useVectorIcons_bl){
					FWDEVPUtils.smpBtnNPos();
					var ic = prt.fontIcon +' ' + prt.fontIcon + '-close';
					_s.clsBtn = new FWDEVPSimpleButton(
							0, 0, 0, true, 0, 0, 0,
							"<div class='table-fwdevp-button'><span class='table-cell-fwdevp-button " + ic + "'></span></div>",
							undefined,
							"EVPCloseButtonNormalState",
							"EVPCloseButtonSelectedState"
					);
					_s.clsBtn.addListener(FWDEVPSimpleButton.MOUSE_UP, _s.closeButtonOnMouseUpHandler);
					_s.mainHld.addChild(_s.clsBtn); 
				
				}else{
					_s.clsBtn = new FWDEVPSimpleButton(_s.passColoseN_img, _d.embedWindowClosePathS_str, undefined,
							true,
							_d.useHEX,
							_d.nBC,
							_d.sBC);
				}
				_s.clsBtn.screen.className = 'fwdevp-close-button';
				_s.clsBtn.addListener(FWDEVPSimpleButton.MOUSE_UP, _s.closeButtonOnMouseUpHandler);
				
				_s.addChild(_s.mainHld);
				_s.mainHld.addChild(_s.bk_do);
				
				_s.passMainHolder_do.addChild(_s.passMainHolderBk_do);
				_s.passMainHolder_do.addChild(_s.passMainLabel_do);
				_s.passMainHolder_do.addChild(_s.passLabel_do);
				_s.passMainHolder_do.addChild(_s.passInput_do);
				_s.passMainHolder_do.addChild(_s.passButton_do);
				_s.mainHld.addChild(_s.passMainHolder_do);
				_s.mainHld.addChild(_s.clsBtn); 
			}else{
				_s.addChild(_s.mainHld);
				_s.mainHld.addChild(_s.bk_do);
				_s.mainHld.addChild(_s.passLabel_do);
				_s.passLabel_do.style().whiteSpace = "normal";
				_s.passLabel_do.style().width = "calc(100% - 40px)";
				_s.passLabel_do.style().textAlign = 'center';
				_s.passLabel_do.setInnerHTML(_d.loggedInMessage_str);

				var clsn = 'fwdevp-loggedin-message-white';
				if(_d.isDark){
					clsn = 'fwdevp-loggedin-message-dark';
				}
				_s.passLabel_do.screen.className = clsn;

				FWDEVPSimpleButton.setPrototype();
				if(_s.useVectorIcons_bl){
					FWDEVPUtils.smpBtnNPos();
					var ic = 'fwdicon-close';
					_s.clsBtn = new FWDEVPSimpleButton(
							0, 0, 0, true, 0, 0, 0,
							"<div class='table-fwdevp-button'><span class='table-cell-fwdevp-button " + ic + "'></span></div>",
							undefined,
							"EVPCloseButtonNormalState",
							"EVPCloseButtonSelectedState"
					);
					_s.clsBtn.screen.className = 'fwdevp-close-button';
					_s.clsBtn.addListener(FWDEVPSimpleButton.MOUSE_UP, _s.closeButtonOnMouseUpHandler);
					_s.mainHld.addChild(_s.clsBtn); 
				}else{

					var clsNImg = new Image();
					clsNImg.src = _s.passColoseN_img.src;
					clsNImg.onload = function(){
						//setup close button.
						FWDEVPSimpleButton.setPrototype();
						_s.clsBtn = new FWDEVPSimpleButton(
								clsNImg, 
								_d.embedWindowClosePathS_str, 
								undefined,
								true,
								_d.useHEX,
								_d.nBC,
								_d.sBC, 
								false, false, false, true);
						_s.clsBtn.screen.className = 'fwdevp-close-button';
						_s.clsBtn.addListener(FWDEVPSimpleButton.MOUSE_UP, _s.closeButtonOnMouseUpHandler);
						_s.mainHld.addChild(_s.clsBtn); 
						clsNImg.onload = null;
						_s.posClsBtn();
					}
				}
			}		
			_s.posClsBtn();
		};
	
		_s.closeButtonOnMouseUpHandler = function(){
			if(!_s.isShowed_bl) return;
			_s.hide();
		};
		
	
		function selectText(){
			if(window.top != window && FWDEVPUtils.isIE) return;
			var range, selection;
			if (document.body.createTextRange) {
				range = document.body.createTextRange();
			    range.moveToElementText(this);
			    range.select();
			}else if(window.getSelection && document.createRange) {
			    selection = window.getSelection();
			    range = document.createRange();
			    range.selectNodeContents(this);
			    selection.removeAllRanges();
			    selection.addRange(range);
			}
		};
		
		_s.positionAndResize = function(){
			_s.sW = prt.sW;
			_s.sH = prt.sH;
			
			_s.maxTextWidth = Math.min(_s.sW - 150, 300);
			_s.totalWidth = _s.maxTextWidth + _s.buttonWidth;
			
			_s.positionFinal();
			
			_s.setWidth(_s.sW);
			_s.setHeight(_s.sH);
			_s.mainHld.setWidth(_s.sW);
			_s.mainHld.setHeight(_s.sH);
		};

		_s.posClsBtn = function(){
			if(_s.clsBtn){
				_s.clsBtn.style().left = 'auto';
				_s.clsBtn.style().right = _s.embedWindowCloseButtonMargins + 'px';
				_s.clsBtn.style().top = _s.embedWindowCloseButtonMargins + 'px';
			}
		}

		
		_s.positionFinal = function(){
			
			var totalHeight;
			var textLableHeight = _s.passLabel_do.getHeight();
			var passMainLabelHeight;
			
			passMainLabelHeight = _s.passMainLabel_do.getHeight();

			if(!lg){
				_s.passMainLabel_do.setX(14);
				_s.passLabel_do.setX(14);
				_s.passLabel_do.setY(passMainLabelHeight + 14);
				
				_s.passInput_do.setX(10);
				_s.passInput_do.setWidth(parseInt(_s.totalWidth - 40 - _s.buttonWidth));
				_s.passInput_do.setY(_s.passLabel_do.y + textLableHeight + 5);
				_s.passButton_do.setX(10 + _s.passInput_do.w + 20);
				_s.passButton_do.setY(_s.passLabel_do.y + textLableHeight + 7);
				
				_s.passMainHolderBk_do.setY(_s.passLabel_do.y - 9);
				_s.passMainHolderBk_do.setWidth(_s.totalWidth - 2);
				_s.passMainHolderBk_do.setHeight(_s.passButton_do.y + _s.passButton_do.h - 9);
				_s.passMainHolder_do.setWidth(_s.totalWidth);
				_s.passMainHolder_do.setHeight(_s.passButton_do.y + _s.passButton_do.h + 14);

				_s.passMainHolder_do.setX(Math.round((_s.sW - _s.totalWidth)/2));
				totalHeight = _s.passMainHolderBk_do.getHeight();
				_s.passMainHolder_do.setY(Math.round((_s.sH - totalHeight)/2) - 10);
			}else{
				_s.passLabel_do.setX(Math.round((_s.sW - _s.passLabel_do.getWidth())/2));
				_s.passLabel_do.setY(Math.round((_s.sH - _s.passLabel_do.getHeight())/2));
			}
		};
		
		//##############################################//
		/* Send email */
		//##############################################//
		_s.passClickHandler = function(){
			if(_d.privateVideoPassword_str != FWDEVPUtils.MD5(_s.passInput_do.screen.value)){
				if(!FWDAnimation.isTweening(_s.passInput_do.screen)) FWDAnimation.to(_s.passInput_do.screen, .1, {css:{backgroundColor:'#FF0000'}, yoyo:true, repeat:3});
				return;
			}
			_s.dispatchEvent(FWDEVPPassword.CORRECT);
		};
		
		//##########################################//
		/* Update HEX color of a canvaas */
		//##########################################//
		_s.updateHEXColors = function(nBC, sBC){
			_s.passButton_do.updateHEXColors(nBC, sBC);
			_s.clsBtn.updateHEXColors(nBC, sBC);
		}
		
		/* show hide info */
		//#########################################//
		_s.showInfo = function(text, hasError){
				
			_s.infoText_do.setInnerHTML(text);
			_s.passMainHolder_do.addChild(_s.infoText_do);
			_s.infoText_do.setWidth(_s.buttonWidth);
			_s.infoText_do.setHeight(_s.buttonHeight - 4);
			_s.infoText_do.setX(_s.passButton_do.x);
			_s.infoText_do.setY(_s.passButton_do.y - 23);

			_s.infoText_do.setAlpha(0);
			if(hasError){
				_s.infoText_do.style().color = "#FF0000";
			}else{
				_s.infoText_do.style().color = _s.mainLabelsColor_str;
			}
			FWDAnimation.killTweensOf(_s.infoText_do);
			FWDAnimation.to(_s.infoText_do, .16, {alpha:1, yoyo:true, repeat:7});
		};
		
		//###########################################//
		/* show / hide */
		//###########################################//
		_s.show = function(id){
			if(_s.isShowed_bl) return;
			_s.isShowed_bl = true;
			prt.main_do.addChild(_s);
			_s.init();
			
			if(_s.passButton_do){
				_s.passButton_do.setSelectedState();
				_s.passInput_do.setInnerHTML("");
			}
			if(!FWDEVPUtils.isMobile || (FWDEVPUtils.isMobile && FWDEVPUtils.hasPointerEvent)) prt.main_do.setSelectable(true);
			_s.positionAndResize();
			
			clearTimeout(_s.hideCompleteId_to);
			clearTimeout(_s.showCompleteId_to);
			_s.mainHld.setY(- _s.sH);
			if(_s.passButton_do){
				_s.passButton_do.setNormalState();
			}
			_s.showCompleteId_to = setTimeout(_s.showCompleteHandler, 900);
			setTimeout(function(){
				_s.positionAndResize();
				FWDAnimation.to(_s.mainHld, .8, {y:0, delay:.1, ease:Expo.easeInOut});
			}, 100);
		};
		
		_s.showCompleteHandler = function(){};
		
		_s.hide = function(normal){
			if(!_s.isShowed_bl) return;
			_s.isShowed_bl = false;
			
			if(prt.customContextMenu_do) prt.customContextMenu_do.enable();
			_s.positionAndResize();
			
			clearTimeout(_s.hideCompleteId_to);
			clearTimeout(_s.showCompleteId_to);
			
			if(!FWDEVPUtils.isMobile || (FWDEVPUtils.isMobile && FWDEVPUtils.hasPointerEvent)) prt.main_do.setSelectable(false);
			if(normal){
				_s.mainHld.setY(-_s.sH);
				_s.hideCompleteHandler();
			}else{
				_s.hideCompleteId_to = setTimeout(_s.hideCompleteHandler, 800);
				FWDAnimation.killTweensOf(_s.mainHld);
				FWDAnimation.to(_s.mainHld, .8, {y:-_s.sH, ease:Expo.easeInOut});
			}

			
		
		};
		
		_s.hideCompleteHandler = function(){
			prt.main_do.removeChild(_s);
			_s.dispatchEvent(FWDEVPPassword.HIDE_COMPLETE);
		};
	
		if(_d.useHEX){
			_s.init();
		}
	};
		
	/* set prototype */
	FWDEVPPassword.setPrototype = function(){
		FWDEVPPassword.prototype = new FWDEVPDO("div");
	};
	
	FWDEVPPassword.ERROR = "error";
	FWDEVPPassword.CORRECT = "correct";
	FWDEVPPassword.HIDE_COMPLETE = "hideComplete";
	
	FWDEVPPassword.prototype = null;
	window.FWDEVPPassword = FWDEVPPassword;
}(window));/**
 * Easy Video Player PACKAGED v9.1
 * Popup ad button.
 *
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © 2006 All Rights Reserved.
 */
(function (){

	var FWDEVPPopupAddButton = function(
		    prt,
			imageSource,
			start,
			end,
			link,
			target,
			id,
			google_ad_client,
			google_ad_slot,
			google_ad_width,
			google_ad_height,
			tracking,
			popupAddCloseNPath_str,
			popupAddCloseSPath_str,
			showPopupAdsCloseButton_bl
		){

		'use strict';
		
		var _s = this;
		var prototype = FWDEVPPopupAddButton.prototype;
		
		_s.imageSource = imageSource;
		_s.link = link;
		_s.target = target;
		_s.start = start;
		_s.end = end;
		_s.google_ad_client = google_ad_client;
		_s.google_ad_slot = google_ad_slot
		_s.originalW = _s.google_ad_width = google_ad_width;
		_s.originalH = _s.google_ad_height = google_ad_height;
		_s.tracking = tracking;
		
		
		_s.finalW = 0;
		_s.finalH = 0;
		
		if(Boolean(_s.google_ad_client)){
			_s.type = 'adsense';
		}else if(_s.imageSource.match(/.png|.jpg|.jpeg|.gif/ig)){
			_s.type = 'image';
		}else{
			_s.type = 'iframe';
		}
		
		_s.id = id;
		
		_s.showPopupAdsCloseButton_bl = showPopupAdsCloseButton_bl;
		_s.popupAddCloseNPath_str = popupAddCloseNPath_str;
		_s.popupAddCloseSPath_str = popupAddCloseSPath_str;
		
		
		//##########################################//
		/* initialize _s */
		//##########################################//
		_s.init = function(){
			_s.setBkColor("rgba(0, 0, 0, 0.6)");
			_s.setX(-5000);
			if(_s.showPopupAdsCloseButton_bl){
				FWDEVPSimpleSizeButton.setPrototype();
				_s.closeButton_do = new FWDEVPSimpleSizeButton(
						_s.popupAddCloseNPath_str, 
						_s.popupAddCloseSPath_str,
						21,
						21
						);
				_s.closeButton_do.addListener(FWDEVPSimpleSizeButton.CLICK, _s.closeClickButtonCloseHandler);
			}
			
			
			if(_s.type == 'image'){
				_s.image = new Image();
				_s.image.src = _s.imageSource;
				_s.image.onload = _s.onLoadHandler;
			}else{
				_s.isLoaded_bl = true;
				_s.setWidth(_s.originalW);
				_s.setHeight(_s.originalH);
			}
			
			if(_s.closeButton_do){
				_s.addChild(_s.closeButton_do);
				_s.closeButton_do.setX(-300);
			}
			
			if(_s.link){
				_s.setButtonMode(true);
			}
		};
		
		_s.closeClickButtonCloseHandler = function(){
			_s.hide();
			_s.isClosed_bl = true;
		};
		
		_s.clickHandler = function(){
			if(_s.link){
				prt.prt.pause();
				if(_s.tracking){
					prt.prt.executeVastEvent(_s.tracking);
				}
				window.open(_s.link, _s.target);
			}
		};
		
		//##########################################//
		/* setup main containers */
		//##########################################//
		_s.onLoadHandler = function(){
			_s.originalW = _s.image.width;
			_s.originalH = _s.image.height;
			_s.image_do = new FWDEVPDO("img");
			_s.image_do.setScreen(_s.image);
			_s.image_do.setWidth(_s.originalW);
			_s.image_do.setHeight(_s.originalH);
			_s.addChild(_s.image_do);
			_s.isLoaded_bl = true;
			if(_s.closeButton_do){
				_s.addChild(_s.closeButton_do);
				_s.closeButton_do.setX(-300);
			}
			//_s.resizeAndPosition(true);
			_s.image_do.screen.addEventListener("click", _s.clickHandler);
		};
		
		_s.hide = function(remove){
			if(!_s.isShowed_bl) return;
			_s.isShowed_bl = false;
			var scale = Math.min(1, prt.prt.tempVidStageWidth/(_s.originalW));			
			var finalH = parseInt(scale * _s.originalH);
			
			var finalY = parseInt(prt.prt.tempVidStageHeight);
			prt.setY(finalY);
			
			_s.setX(-5000);
			FWDAnimation.killTweensOf(prt);
			if(remove){
				prt.removeChild(_s);
				prt.setWidth(0);
				prt.setHeight(0);
			}else{
				_s.setWidth(0);
				_s.setHeight(0);
				prt.setVisible(false);
				_s.setVisible(false);
			}
		};
		
		_s.show = function(){
			
			if(_s.isShowed_bl || _s.isClosed_bl || !_s.isLoaded_bl) return;	
			_s.isShowed_bl = true;
			
			_s.setX(0);
			setTimeout(function(){
				FWDAnimation.killTweensOf(prt);
				prt.setVisible(true);
				_s.setVisible(true);

				if(_s.type == 'adsense' && !_s.isGooglAdCreated_bl){
					
					_s.isGooglAdCreated_bl = true;
					
					window.google_ad_client = _s.google_ad_client;
					window.google_ad_slot = _s.google_ad_slot;
					window.google_ad_width = _s.originalW;
					window.google_ad_height = _s.originalH;
					
					// container is where you want the ad to be inserted
					_s.container = new FWDEVPDO("div", 0, 0, true);
					_s.container.setWidth(_s.originalW);
					_s.container.setHeight(_s.originalH);
					
					_s.addChild(_s.container);
				
					var w = document.write;
					document.write = function (content) {
						_s.container.screen.innerHTML = content;
						document.write = w;
					};

					var script = document.createElement('script');
					script.type = 'text/javascript';
					if(location.href.indexOf("https") != -1){
						script.src = 'https://pagead2.googlesyndication.com/pagead/show_ads.js';
					}else{
						script.src = 'http://pagead2.googlesyndication.com/pagead/show_ads.js';
					}
					
					document.body.appendChild(script);
					if(_s.closeButton_do){
						_s.addChild(_s.closeButton_do);
						_s.closeButton_do.setX(-300);
					}
				}else if(_s.type == 'iframe'){
					// container is where you want the ad to be inserted
					_s.container = new FWDEVPDO("div", 0, 0, true);
					_s.container.setWidth(_s.originalW);
					_s.container.setHeight(_s.originalH);
					
					_s.ifr = new FWDEVPDO("iframe", 0, 0, true);
					_s.ifr.screen.scrolling = 'no';
					_s.ifr.setWidth(_s.originalW);
					_s.ifr.setHeight(_s.originalH);
					_s.ifr.screen.src = _s.imageSource;
					_s.container.addChild(_s.ifr);
				
					if(_s.link){
						_s.clicker = new FWDEVPDO('div');
						_s.clicker.screen.style.width = '100%';
						_s.clicker.screen.style.height = '100%';
						_s.container.addChild(_s.clicker);
						_s.container.addChild(_s.clicker);
						_s.container.screen.addEventListener("click", _s.clickHandler);
					}
					_s.addChild(_s.container);
					if(_s.closeButton_do){
						_s.addChild(_s.closeButton_do);
						_s.closeButton_do.setX(-300);
					}
				}
				
				
				
				var scale = Math.min(1, prt.prt.tempVidStageWidth/(_s.originalW));			
				var finalH = parseInt(scale * _s.originalH) - 2;
				
				if(prt.prt.controller_do.isShowed_bl){
					var finalY = parseInt(prt.prt.tempVidStageHeight - prt.prt.controller_do.h - (_s.originalH * scale) + 2 + finalH);
				}else{
					var finalY = parseInt(prt.prt.tempVidStageHeight - (_s.originalH * scale) + 2 + finalH);
				}	
				prt.setY(finalY);
			
				_s.resizeAndPosition(true);
			}, 100);
		};
		
		//###############################//
		/* set final size */
		//###############################//
		_s.resizeAndPosition = function(animate){
			if(!_s.isLoaded_bl || _s.isClosed_bl || !_s.isShowed_bl) return;
	
			var finalY;
			var hasScale_bl = !FWDEVPUtils.isIEAndLessThen9;
			var scale = 1;
		
			scale = Math.min(1, prt.prt.tempVidStageWidth/(_s.originalW));			
		
		
			_s.finalW = parseInt(scale * _s.originalW);
			_s.finalH = parseInt(scale * _s.originalH);
			
			if(_s.finalW == _s.prevFinalW && _s.finalH == _s.prevFinalH) return;
		
			_s.setWidth(_s.finalW);
			_s.setHeight(_s.finalH);
	
			if(_s.type == 'image'){
				_s.image_do.setWidth(_s.finalW);
				_s.image_do.setHeight(_s.finalH);
			}else if(_s.container){
				_s.container.setScale2(scale);
				_s.container.setX((_s.finalW - _s.originalW)/2);
				_s.container.setY((_s.finalH - _s.originalH)/2);
			}
			
			if(prt.prt.controller_do){
				if(prt.prt.controller_do.isShowed_bl){
					finalY = parseInt(prt.prt.tempVidStageHeight - prt.prt.controller_do.h - (_s.originalH * scale) - 10);
				}else{
					finalY = parseInt(prt.prt.tempVidStageHeight - (_s.originalH * scale) - 10);
				}	
			}else{
				finalY = parseInt(prt.prt.tempVidStageHeight - (_s.originalH * scale));
			}
			
			prt.setX(parseInt((prt.prt.tempVidStageWidth - _s.finalW)/2));
			
			FWDAnimation.killTweensOf(prt);
			if(animate){
				FWDAnimation.to(prt, .8, {y:finalY, ease:Expo.easeInOut});
			}else{
				prt.setY(finalY);
			}
			
			if(_s.closeButton_do){
				_s.closeButton_do.setY(2);
				_s.closeButton_do.setX(parseInt(_s.finalW - 21 - 2));
			}
			
			
			_s.prevFinalW = _s.finalW;
			_s.prevFinallH = _s.finalH;
			prt.setWidth(_s.finalW);
			prt.setHeight(_s.finalH);
		};

		_s.init();
	};
	
	/* set prototype */
	FWDEVPPopupAddButton.setPrototype = function(){
		FWDEVPPopupAddButton.prototype = new FWDEVPDO("div", "absolute", "visible");
	};
	
	FWDEVPPopupAddButton.MOUSE_OVER = "onMouseOver";
	FWDEVPPopupAddButton.MOUSE_OUT = "onMouseOut";
	FWDEVPPopupAddButton.CLICK = "onClick";
	
	FWDEVPPopupAddButton.prototype = null;
	window.FWDEVPPopupAddButton = FWDEVPPopupAddButton;
}(window));﻿/**
 * Easy Video Player PACKAGED v9.1
 * Popup advertisement window.
 *
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © 2006 All Rights Reserved.
 */
(function (window){

	var FWDEVPPopupAds = function(prt, _d){

		'use strict';
		
		var _s = this;
		var prototype = FWDEVPPopupAds.prototype;
		
		_s.prt = prt;		
		_s.totalAds = 0;
		_s.isMobile_bl = FWDEVPUtils.isMobile;
		_s.hasPointerEvent_bl = FWDEVPUtils.hasPointerEvent;
		_s.showSubtitleByDefault_bl = _d.showSubtitleByDefault_bl;
		_s.setSizeOnce_bl = false;
		

		//##########################################//
		/* initialize _s */
		//##########################################//
		_s.init = function(){
			_s.setOverflow("visible");
			_s.style().cursor = "default";
			_s.setVisible(false);
		};
	

		//##########################################//
		/* Reset popup buttons ads */
		//##########################################//
		_s.resetPopups = function(popupAds_ar){

			if(popupAds_ar === _s.popupAds_ar || !popupAds_ar) return;
			
			_s.hideAllPopupButtons(true);
			_s.popupAds_ar = popupAds_ar;
			_s.totalAds = _s.popupAds_ar.length;

			var popupAdButton;
			_s.popupAdsButtons_ar = [];
		
			for(var i=0; i<_s.totalAds; i++){
				FWDEVPPopupAddButton.setPrototype();
				popupAdButton = new FWDEVPPopupAddButton(
						_s,
						_s.popupAds_ar[i].imagePath,
						_s.popupAds_ar[i].timeStart,
						_s.popupAds_ar[i].timeEnd,
						_s.popupAds_ar[i].link,
						_s.popupAds_ar[i].trget,
						i,
						_s.popupAds_ar[i].google_ad_client,
						_s.popupAds_ar[i].google_ad_slot,
						_s.popupAds_ar[i].google_ad_width,
						_s.popupAds_ar[i].google_ad_height,
						_s.popupAds_ar[i].tracking,
						_d.popupAddCloseNPath_str,
						_d.popupAddCloseSPath_str,
						_d.showPopupAdsCloseButton_bl
				);

				_s.popupAdsButtons_ar[i] = popupAdButton;
				_s.addChild(popupAdButton);
			}
		};
		

		//#####################################//
		/* Update text */
		//#####################################//
		_s.update = function(duration){
			
			if(_s.totalAds == 0 || !duration) return;
			var popupAdButton;
			
			for(var i=0; i<_s.totalAds; i++){
				popupAdButton = _s.popupAdsButtons_ar[i];
				if(duration >= popupAdButton.start && duration <= popupAdButton.end){
					popupAdButton.show();
				}else{
					popupAdButton.hide();
				}
			}	
		};
		
		_s.position = function(animate){
			if(_s.totalAds == 0) return;
			var popupAdButton;
			
			for(var i=0; i<_s.totalAds; i++){
				popupAdButton = _s.popupAdsButtons_ar[i];
				popupAdButton.resizeAndPosition(animate);
			}	
		};
		
		_s.hideAllPopupButtons = function(remove){
			if(_s.totalAds == 0) return;
			var popupAdButton;
			
			for(var i=0; i<_s.totalAds; i++){
				popupAdButton = _s.popupAdsButtons_ar[i];
				popupAdButton.hide(remove);
			}	
			if(remove){
				_s.popupAdsButtons_ar = null;
				_s.totalAds = 0;
			}
		};
		
		_s.init();
	};
	
	
	/* set prototype */
	FWDEVPPopupAds.setPrototype = function(){
		FWDEVPPopupAds.prototype = new FWDEVPDO("div");
	};
	
	FWDEVPPopupAds.LOAD_ERROR = "error";
	FWDEVPPopupAds.LOAD_COMPLETE = "complete";
	
	
	FWDEVPPopupAds.prototype = null;
	window.FWDEVPPopupAds = FWDEVPPopupAds;
}(window));/**
 * Easy Video Player PACKAGED v9.1
 * Poster manager.
 *
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © 2006 All Rights Reserved.
 */
(function (window){

	var FWDEVPPoster = function(
			prt, 
			backgroundColor,
			showPoster,
			fillEntireScreenWithPoster_bl
		){

		'use strict';
		
		var _s  = this;
		var prototype = FWDEVPPoster.prototype;
		
		_s.img_img = new Image();
		_s.imgW = 0;
		_s.imgH = 0;
		_s.finalW = 0;
		_s.finalH = 0;
		_s.finalX = 0;
		_s.finalY = 0;
		
		_s.curPath;
		_s.backgroundColor_str = backgroundColor;
		_s.fillEntireScreenWithPoster_bl = fillEntireScreenWithPoster_bl;
		_s.showPoster_bl = showPoster;
		_s.isShowed_bl = true;
		_s.allowToShow_bl = true;
		_s.isMobile_bl = FWDEVPUtils.isMobile;
	
		_s.init = function(){
			_s.pHld_do =  new FWDEVPDO('div');
			_s.pHld_do.setOverflow('visible');
			_s.addChild(_s.pHld_do);
			_s.hide();
			_s.setBkColor(_s.backgroundColor_str);
		};
		
		_s.positionAndResize = function(){
			if(!prt.sW) return;
			_s.setWidth(prt.sW);
			_s.setHeight(prt.sH);
		
			if(!_s.imgW) return;
			var scX = prt.sW/_s.imgW;
			var scY = prt.sH/_s.imgH;
			var ttSc;
			
			if(_s.fillEntireScreenWithPoster_bl){
				if(scX >= scY){
					ttSc = scX;
				}else{
					ttSc = scY;
				}
			}else{
				if(scX <= scY){
					ttSc = scX;
				}else{
					ttSc = scY;
				}
			}
			
			_s.finalW = Math.round(ttSc * _s.imgW);
			_s.finalH = Math.round(ttSc * _s.imgH);
			_s.finalX = parseInt((prt.sW - _s.finalW)/2);
			_s.finalY = parseInt((prt.sH - _s.finalH)/2);
		
			_s.img_do.setX(_s.finalX);
			_s.img_do.setY(_s.finalY);
			_s.img_do.setWidth(_s.finalW);
			_s.img_do.setHeight(_s.finalH);		
		};
		
		_s.setPoster = function(path, o){
			if(!o && path && (FWDEVPUtils.trim(path) == "") || path =="none"){
				_s.showOrLoadOnMobile_bl = true;
				_s.isTransparent_bl = true;
				_s.show();
				return;
			}else if(!o && path == "youtubemobile"){
				_s.isTransparent_bl = false;
				_s.showOrLoadOnMobile_bl = false;
				_s.img_img.src = null;
				_s.imgW = 0;
				return;
			}else if(!o && path == _s.curPath){
				_s.isTransparent_bl = false;
				_s.showOrLoadOnMobile_bl = true;
				_s.show();
				return;
			}
			
			_s.isTransparent_bl = false;
			_s.showOrLoadOnMobile_bl = true;
			_s.curPath = path;
			if(_s.allowToShow_bl) _s.isShowed_bl = false;
			if(!path) return;

			_s.hide(true);
			try{
				_s.pHld_do.removeChild(_s.img_do);
			}catch(e){}
		
			_s.img_img = new Image();
			_s.img_do = new FWDEVPDO("img");
		
			_s.img_img.onload = _s.posterLoadHandler;
			_s.img_img.onerror = function(){}
			_s.img_img.src = _s.curPath;
		};
		
		_s.posterLoadHandler = function(e){
			_s.imgW = _s.img_img.naturalWidth;
			_s.imgH = _s.img_img.naturalHeight;
		
			_s.img_do.setScreen(_s.img_img);
			_s.pHld_do.addChild(_s.img_do);
			_s.show(true);
			_s.positionAndResize();
		};

		_s.reset = function(){
			_s.img_img.src = '';
		}
		

		//################################//
		/* show / hide */
		//################################//
		_s.show = function(allowToShow_bl, overwrite){
			
			if((!_s.allowToShow_bl || _s.isShowed_bl || !_s.showOrLoadOnMobile_bl || !_s.curPath || prt._d.autoPlay_bl) && !overwrite) return;
		
			_s.isShowed_bl = true;
			
			if(_s.isTransparent_bl){
				if(_s.alpha != 0) _s.setAlpha(0);
			}
			
			_s.setVisible(true);
			if(!_s.isTransparent_bl && !prt.isPlaying_bl){
				var dl = 0;
				if(prt.delayPoster) dl = .4;
				FWDAnimation.killTweensOf(_s);
				FWDAnimation.to(_s, .6, {alpha:1, delay:dl});
			}
			
			_s.positionAndResize();
		};
		
		_s.hide = function(o){
			if(!_s.isShowed_bl && !o) return;
			_s.isShowed_bl = false;
			_s.setAlpha(0);
			_s.setVisible(false);
		};
		
		
		_s.init();
	};
	
	
	/* set prototype */
    FWDEVPPoster.setPrototype = function(){
    	FWDEVPPoster.prototype = new FWDEVPDO("div");
    };
    
    FWDEVPPoster.prototype = null;
	window.FWDEVPPoster = FWDEVPPoster;
}(window));/**
 * Easy Video Player PACKAGED v9.1
 * Preloader.
 *
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © 2006 All Rights Reserved.
 */
(function (window){

	var FWDEVPPreloader = function(prt, preloaderPostion, radius, backgroundColor, fillClr, strokeSize, animDuration){

		'use strict';
		
		var _s  = this;		
		_s.preloaderPostion = preloaderPostion;
		_s.backgroundColor = backgroundColor;
		_s.fillClr = fillClr;
		_s.radius = radius;
		_s.strokeSize = strokeSize;
		_s.animDuration = animDuration || 300;
		_s.strtAngle = 270;
		_s.countAnimation = 0;
		_s.isShowed_bl = true;
		_s.slideshowAngle = {n:0};
		

		//###################################//
		/* init */
		//###################################//
		_s.init = function(){
			_s.style().pointerEvents = 'none';
			_s.main_do = new FWDEVPDO("div");
			_s.main_do.setOverflow("visible");
			_s.main_do.setWidth(_s.radius * 2 + _s.strokeSize);
			_s.main_do.setHeight(_s.radius * 2 + _s.strokeSize);
			_s.addChild(_s.main_do);
			_s.setOverflow('visible');
			_s.setWidth((_s.radius * 2) + _s.strokeSize);
			_s.setHeight((_s.radius * 2) + _s.strokeSize);
			_s.bkCanvas =  new FWDEVPDO("canvas");
			_s.bkCtx = _s.bkCanvas.screen.getContext('2d');
			_s.fillCircleCanvas = new FWDEVPDO("canvas");
			_s.fillCtx = _s.fillCircleCanvas.screen.getContext('2d');
			_s.main_do.screen.style.transformOrigin = "50% 50%";
		
			_s.main_do.addChild(_s.bkCanvas);
			_s.main_do.addChild(_s.fillCircleCanvas);
			_s.drawBackground();
			_s.drawFill();
			_s.hide();
		};

		/*
			Postion
		*/
		_s.positionAndResize = function(){

			if(_s.preloaderPostion == 'bottomleft'){
				_s.setX(prt.offsetPreloader);
				_s.setY(prt.sH - _s.h - prt.offsetPreloader);
			}else if(_s.preloaderPostion == 'bottomright'){
				_s.setX(prt.sW - _s.w - prt.offsetPreloader);
				_s.setY(prt.sH - _s.h - prt.offsetPreloader);
			}else if(_s.preloaderPostion == 'topright'){
				_s.setX(prt.sW - _s.w - prt.offsetPreloader);
				_s.setY(prt.offsetPreloader);
			}else if(_s.preloaderPostion == 'topleft'){
				_s.setX(prt.offsetPreloader);
				_s.setY(prt.offsetPreloader);
			}else if(_s.preloaderPostion == 'center'){
				_s.setX(Math.round(prt.sW - _s.w)/2);
				_s.setY(Math.round(Math.min(prt.sH, prt.viewportSize.h) - _s.h)/2);
			}
		}	


		/* draw background */
		_s.drawBackground = function(){
			_s.bkCanvas.screen.width = (_s.radius * 2) + _s.strokeSize * 2;
			_s.bkCanvas.screen.height = (_s.radius * 2) + _s.strokeSize * 2;
			_s.bkCtx.lineWidth = _s.thicknessSize;
			_s.bkCtx.translate(_s.strokeSize/2, _s.strokeSize/2);
			_s.bkCtx.shadowColor = '#333333';
		    _s.bkCtx.shadowBlur = 1;
		   
			_s.bkCtx.lineWidth=_s.strokeSize;
			_s.bkCtx.strokeStyle = _s.backgroundColor;
			_s.bkCtx.beginPath();
			_s.bkCtx.arc(_s.radius, _s.radius,  _s.radius, (Math.PI/180) * 0, (Math.PI/180) * 360, false);
			_s.bkCtx.stroke();
			_s.bkCtx.closePath();
		};
		

		/* draw fill */
		_s.drawFill = function(){	
			_s.fillCircleCanvas.screen.width = (_s.radius * 2) + _s.strokeSize * 2;
			_s.fillCircleCanvas.screen.height = (_s.radius * 2) + _s.strokeSize * 2;
			_s.fillCtx.lineWidth = _s.thicknessSize;
			_s.fillCtx.translate(_s.strokeSize/2, _s.strokeSize/2);
			_s.fillCtx.lineWidth=_s.strokeSize;
			_s.fillCtx.strokeStyle = _s.fillClr;
			_s.fillCtx.beginPath();
			_s.fillCtx.arc(_s.radius, _s.radius,  _s.radius, (Math.PI/180) * _s.strtAngle, (Math.PI/180) * (_s.strtAngle +  _s.slideshowAngle.n), false);
			_s.fillCtx.stroke();
			_s.fillCtx.closePath()
		};
		

		//###################################//
		/* start / stop preloader animation */
		//###################################//
		_s.startSlideshow = function(){
			if(_s == null) return;
			FWDAnimation.killTweensOf(_s.slideshowAngle);
			FWDAnimation.to(_s.slideshowAngle, _s.animDuration, {n:360, onUpdate:_s.drawFill, onComplete:_s.stopSlideshow});
		};
		
		_s.stopSlideshow = function(){
			FWDAnimation.killTweensOf(_s.slideshowAngle);
			FWDAnimation.to(_s.slideshowAngle, .8, {n:0, onupdate:_s.drawFill, onUpdate:_s.drawFill, ease:Expo.easiInOut});
		};

		
		_s.startPreloader = function(){
			_s.stopPreloader();
			_s.slideshowAngle = {n:0};
			FWDAnimation.to(_s.slideshowAngle, _s.animDuration, {n:360, onUpdate:_s.drawFill, repeat:100, yoyo:true, ease:Expo.easInOut});
			FWDAnimation.to(_s.main_do.screen, _s.animDuration, {rotation:360,  repeat:100});
		}

		_s.stopPreloader = function(){
			FWDAnimation.killTweensOf(_s.slideshowAngle);
			FWDAnimation.killTweensOf(_s.main_do.screen);
			FWDAnimation.to(_s.main_do.screen, 0.00001, {rotation:0});
		}
		
		
		//###################################//
		/* show / hide preloader animation */
		//###################################//
		_s.show = function(){
			if(_s.isShowed_bl) return;
			_s.setVisible(true);
			FWDAnimation.killTweensOf(_s);
			FWDAnimation.to(_s, 1, {alpha:1, delay:.2});
			_s.stopPreloader();
			_s.startPreloader();
			_s.isShowed_bl = true;
		};
		
		_s.hide = function(animate){
			if(!_s.isShowed_bl) return;
			FWDAnimation.killTweensOf(this);
			if(animate){
				FWDAnimation.to(this, .2, {alpha:0, onComplete:_s.onHideComplete});
			}else{
				_s.setVisible(false);
				_s.setAlpha(0);
			}
			_s.isShowed_bl = false;
		};
		
		_s.onHideComplete = function(){
			_s.setVisible(false);
			_s.stopPreloader();
			_s.dispatchEvent(FWDEVPPreloader.HIDE_COMPLETE);
		};


		/**
		 * Update colors.
		 * @param {String} backgroundColor
		 * @param {String} fillClr
		 */
		_s.updateColors = function(backgroundColor, fillClr){
			_s.backgroundColor = backgroundColor;
			_s.fillClr = fillClr;
			_s.bkCtx.strokeStyle = _s.backgroundColor;
			_s.fillCtx.strokeStyle = _s.fillClr;
			_s.drawBackground();
		}
		
		_s.init();
	};
	
	
	/* set prototype */
    FWDEVPPreloader.setPrototype = function(){
    	FWDEVPPreloader.prototype = new FWDEVPDO("div");
    };
    
    FWDEVPPreloader.HIDE_COMPLETE = "hideComplete";
    
    FWDEVPPreloader.prototype = null;
	window.FWDEVPPreloader = FWDEVPPreloader;
}(window));/**
 * Easy Video Player PACKAGED v9.1
 * Preloader 2.
 *
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © 2006 All Rights Reserved.
 */
(function (window){

	var FWDEVPPreloader2 = function(imageSource_img, segmentWidth, segmentHeight, totalSegments, animDelay){

		'use strict';
		
		var _s  = this;		
		_s.imageSource_img = imageSource_img;		
		_s.segmentWidth = segmentWidth;
		_s.segmentHeight = segmentHeight;
		_s.totalSegments = totalSegments;
		_s.animDelay = animDelay || 300;
		_s.count = 0;
		
		
		//###################################//
		/* init */
		//###################################//
		_s.init = function(){
			_s.setWidth(_s.segmentWidth);
			_s.setHeight(_s.segmentHeight);
		
			_s.image_sdo = new FWDEVPDO("img");
			_s.image_sdo.setScreen(_s.imageSource_img);
			_s.addChild(_s.image_sdo);
			
			_s.hide(false);
		};
		
		
		//###################################//
		/* start / stop preloader animation */
		//###################################//
		_s.start = function(){
			if(_s == null) return;
			clearInterval(_s.delayTimerId_int);
			_s.delayTimerId_int = setInterval(_s.updatePreloader, _s.animDelay);
		};
		
		_s.stop = function(){
			clearInterval(_s.delayTimerId_int);
		};
		
		_s.updatePreloader = function(){
			if(_s == null) return;
			_s.count++;
			if(_s.count > _s.totalSegments - 1) _s.count = 0;
			var posX = _s.count * _s.segmentWidth;
			_s.image_sdo.setX(-posX);
		};
		
		
		//###################################//
		/* show / hide preloader animation */
		//###################################//
		_s.show = function(){
			if(_s.isShowed_bl) return;
			_s.setVisible(true);
			_s.start();
			FWDAnimation.killTweensOf(_s);
			FWDAnimation.to(_s, 1, {alpha:1, delay:.2});
			_s.isShowed_bl = true;
		};
		
		_s.hide = function(animate){
			if(!_s.isShowed_bl) return;
			FWDAnimation.killTweensOf(this);
			if(animate){
				FWDAnimation.to(this, 1, {alpha:0, onComplete:_s.onHideComplete});
			}else{
				_s.setVisible(false);
				_s.setAlpha(0);
			}
			_s.isShowed_bl = false;
		};
		
		_s.onHideComplete = function(){
			_s.setVisible(false);
			_s.stop();
			_s.dispatchEvent(FWDEVPPreloader2.HIDE_COMPLETE);
		};
		
		_s.init();
	};
	
	/* set prototype */
    FWDEVPPreloader2.setPrototype = function(){
    	FWDEVPPreloader2.prototype = new FWDEVPDO("div");
    };
    
    FWDEVPPreloader2.HIDE_COMPLETE = "hideComplete";
    
    FWDEVPPreloader2.prototype = null;
	window.FWDEVPPreloader2 = FWDEVPPreloader2;
}(window));/**
 * Easy Video Player PACKAGED v9.1
 * Scrubber tooltip.
 *
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © 2006 All Rights Reserved.
 */
(function (window){

	var FWDEVPScrubberToolip = function(
			buttonRef_do,
			bkColor,
			fontColor_str,
			toolTipLabel_str,
			toolTipsButtonsHideDelay
		){

		'use strict';
		
		var _s = this;
		
		_s.buttonRef_do = buttonRef_do;
		_s.bkColor = bkColor;
		_s.fontColor_str = fontColor_str;
		_s.toolTipLabel_str = toolTipLabel_str;
		_s.toolTipsButtonsHideDelay = toolTipsButtonsHideDelay * 1000;
		_s.pointerWidth = 7;
		_s.pointerHeight = 4;		
		_s.isMobile_bl = FWDEVPUtils.isMobile;
		_s.isShowed_bl = true;
	

		//##########################################//
		/* initialize */
		//##########################################//
		_s.init = function(){
			_s.setOverflow("visible");
			_s.screen.className = 'EVP-tooltip-bk';
			_s.setupMainContainers();
			_s.setLabel(toolTipLabel_str);
			_s.hide();
			_s.setVisible(false);
			_s.style().backgroundColor = _s.bkColor;
			_s.style().zIndex = 9999999999999;
			_s.style().pointerEvents = "none";

		};
		

		//##########################################//
		/* setup main containers */
		//##########################################//
		_s.setupMainContainers = function(){
			_s.pointerHolder_do = new FWDEVPDO("div");
			_s.pointerHolder_do.setOverflow('visible');
			_s.addChild(_s.pointerHolder_do);

			_s.text_do = new FWDEVPDO("div");
			_s.text_do.screen.className = 'EVP-tooltip-text';
			_s.text_do.hasT3D = false;
			_s.text_do.hasT2D = false;
			_s.text_do.setBackfaceVisibility();
			_s.text_do.setDisplay("inline-block");
			_s.text_do.style().fontFamily = "Arial";
			_s.text_do.style().fontSize= "12px";
			_s.text_do.style().color = _s.fontColor_str;

			_s.text_do.style().whiteSpace= "nowrap";
			_s.text_do.style().fontSmoothing = "antialiased";
			_s.text_do.style().webkitFontSmoothing = "antialiased";
			_s.text_do.style().textRendering = "optimizeLegibility";
			_s.text_do.style().padding = "6px";
			_s.text_do.style().paddingTop = "4px";
			_s.text_do.style().paddingBottom = "4px";
		
			_s.addChild(_s.text_do);
			
			 _s.pointer_do = new FWDEVPDO("div");
			_s.pointer_do.screen.className = 'EVP-scrubber-pointer';
			_s.pointer_do.style().border = "4px solid transparent"
			_s.pointer_do.style().borderTopColor = _s.bkColor ;
			_s.pointerHolder_do.addChild(_s.pointer_do);
		}
		

		//##########################################//
		/* set label */
		//##########################################//
		_s.setLabel = function(label){
			
			if(label === undefined ) return;
			_s.text_do.setInnerHTML(label);
		
			if(_s == null) return;
			_s.setWidth(_s.text_do.getWidth());
			_s.setHeight(_s.text_do.getHeight());
			_s.positionPointer();
				
		};
		
		_s.positionPointer = function(offsetX){
			var finalX;
			var finalY;
			
			if(!offsetX) offsetX = 0;
			
			finalX = parseInt((_s.w - 8)/2) + offsetX;
			finalY = _s.h;
			_s.pointerHolder_do.setX(finalX);
			_s.pointerHolder_do.setY(finalY);
			
		};
		

		//##########################################//
		/* show / hide*/
		//##########################################//
		_s.show = function(){
			_s.isShowed_bl = true;
			clearTimeout(_s.hideWithDelayId_to);

			FWDAnimation.killTweensOf(_s);
			clearTimeout(_s.showWithDelayId_to);
			_s.showWithDelayId_to = setTimeout(_s.showFinal, _s.toolTipsButtonsHideDelay);
		};
		
		_s.showFinal = function(){
			_s.setVisible(true);
			FWDAnimation.to(_s, .4, {alpha:1, onComplete:function(){_s.setVisible(true);}, ease:Quart.easeOut});
		};
		
		_s.hide = function(){
			
			if(!_s.isShowed_bl) return;
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
	FWDEVPScrubberToolip.setPrototype = function(){
		FWDEVPScrubberToolip.prototype = null;
		FWDEVPScrubberToolip.prototype = new FWDEVPDO("div");
	};
	
	FWDEVPScrubberToolip.CLICK = "onClick";
	FWDEVPScrubberToolip.MOUSE_DOWN = "onMouseDown";
	
	FWDEVPScrubberToolip.prototype = null;
	window.FWDEVPScrubberToolip = FWDEVPScrubberToolip;
}(window));/**
 * Easy Video Player PACKAGED v9.1
 * Share window.
 *
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © 2006 All Rights Reserved.
 */
(function (window){
	
	var FWDEVPShareWindow = function(_d, prt){

		'use strict';
		
		var _s = this;		
		_s.embedColoseN_img = _d.embedColoseN_img;
		_s.btns_ar = [];
		_s.embedWindowBackground_str = _d.embedWindowBackground_str;
		_s.embedWindowCloseButtonMargins = _d.embedWindowCloseButtonMargins;
			
		_s.totalWidth = 0;
		_s.sW = 0;
		_s.sH = 0;
		_s.minMrgXSpc = 20;
		_s.hSpace = 20;
		_s.minHSpace = 10;
		_s.vSpace = 15;
		_s.isMbl = FWDEVPUtils.isMobile;
		_s.useVectorIcons_bl = _d.useVectorIcons_bl;
	

		//#################################//
		/* init */
		//#################################//
		_s.init = function(){
			_s.setupButtons();
		};

		_s.stpInit =  function(){
			if(_s.clsBtn) return;
			try{
				prt.main_do.removeChild(_s);
			}catch(e){}
			prt.main_do.addChild(_s);

			var sBC = _d.sBC;
			if(window['isWhite']){
				sBC = '#000000';
			}

			_s.setBackfaceVisibility();
			_s.mainHld = new FWDEVPDO("div");
			_s.mainHld.hasT3D = false;
			_s.mainHld.hasT2D = false;
			_s.mainHld.setBackfaceVisibility();
			
			_s.bk_do = new FWDEVPDO("div");
			_s.bk_do.style().width = "100%";
			_s.bk_do.style().height = "100%";
			_s.bk_do.setAlpha(.9);
			var pth = _s.embedWindowBackground_str;

			if(window['isWhite']){
				pth = 'content/hex_white/embed-window-background.png';
			}
			_s.bk_do.style().background = "url('" + pth + "')";

		
			//setup close button
			if(_s.useVectorIcons_bl){
				FWDEVPSimpleButton.setPrototype();
				FWDEVPUtils.smpBtnNPos();
				var ic = prt.fontIcon +' ' + prt.fontIcon + '-close';
				_s.clsBtn = new FWDEVPSimpleButton(
						0, 0, 0, true, 0, 0, 0,
						"<div class='table-fwdevp-button'><span class='table-cell-fwdevp-button " + ic + "'></span></div>",
						undefined,
						"EVPCloseButtonNormalState",
						"EVPCloseButtonSelectedState"
				);
			}else{
				
				FWDEVPSimpleButton.setPrototype();
				_s.clsBtn = new FWDEVPSimpleButton(_d.shareClooseN_img, _d.embedWindowClosePathS_str, undefined,
						true,
						_d.useHEX,
						_d.nBC,
						sBC,
						false, false, false, false, true);
			}

			_s.clsBtn.addListener(FWDEVPSimpleButton.MOUSE_UP, _s.closeButtonOnMouseUpHandler);
			
			_s.addChild(_s.mainHld);
			_s.mainHld.addChild(_s.bk_do);
			_s.mainHld.addChild(_s.clsBtn); 
		}
	
		_s.closeButtonOnMouseUpHandler = function(){
			if(!_s.isShowed_bl) return;
			_s.hide();
		};
		
	
		_s.positionAndResize = function(){
			_s.sW = prt.sW;
			_s.sH = prt.sH;
				
			_s.clsBtn.setX(_s.sW - _s.clsBtn.w - _s.embedWindowCloseButtonMargins);
			_s.clsBtn.setY(_s.embedWindowCloseButtonMargins);
			
			_s.setWidth(_s.sW);
			_s.setHeight(_s.sH);
			_s.mainHld.setWidth(_s.sW);
			_s.mainHld.setHeight(_s.sH);
			setTimeout(function(){
				_s.positionButtons();
			}, 100);
		};
		
		
		//###########################################//
		/* Setup buttons */
		//###########################################//
		_s.setupButtons = function(){
			if(_s.btsCrted){
				return;
			}

			_s.stpInit();	
			
			_s.btsCrted = true;
			var sBC = _d.sBC;
			if(window['isWhite']){
				sBC = '#000000';
			}
		
			if(_s.useVectorIcons_bl){
				FWDEVPSimpleButton.setPrototype();
				FWDEVPUtils.smpBtnNPos();
				var ic = prt.fontIcon +' ' + prt.fontIcon + '-facebook';
				_s.facebookButton_do = new FWDEVPSimpleButton(
						undefined, undefined, undefined, true, undefined, undefined, undefined,
						"<span class='" + ic + "'></span>",
						undefined,
						"EVPSocialMediaButtonsNormalState",
						"EVPSocialMediaButtonsSelectedState"
				);
			}else{
				FWDEVPSimpleButton.setPrototype();
				_s.facebookButton_do = new FWDEVPSimpleButton(_d.facebookN_img, _d.facebookSPath_str, undefined,
						true,
						_d.useHEX,
						_d.nBC,
						sBC);
			}
			_s.facebookButton_do.screen.className = 'fwdevp-facebook-share-button';
			_s.facebookButton_do.addListener(FWDEVPSimpleButton.MOUSE_UP, _s.facebookOnMouseUpHandler);
			_s.addBtnToArray(_s.facebookButton_do);
			
			
			if(_s.useVectorIcons_bl){
				FWDEVPSimpleButton.setPrototype();
				FWDEVPUtils.smpBtnNPos();
				var ic = prt.fontIcon +' ' + prt.fontIcon + '-twitter';
				_s.twitterButton_do = new FWDEVPSimpleButton(
						undefined, undefined, undefined, true, undefined, undefined, undefined,
						"<span class='" + ic + "'></span>",
						undefined,
						"EVPSocialMediaButtonsNormalState",
						"EVPSocialMediaButtonsSelectedState"
				);
			}else{
				FWDEVPSimpleButton.setPrototype();
				_s.twitterButton_do = new FWDEVPSimpleButton(_d.twitterN_img, _d.twitterSPath_str, undefined,
						true,
						_d.useHEX,
						_d.nBC,
						sBC);
			}
			_s.twitterButton_do.screen.className = 'fwdevp-twitter-share-button';
			_s.twitterButton_do.addListener(FWDEVPSimpleButton.MOUSE_UP, _s.twitterOnMouseUpHandler);
			_s.addBtnToArray(_s.twitterButton_do);
			
			
			if(_s.useVectorIcons_bl){
				FWDEVPSimpleButton.setPrototype();
				FWDEVPUtils.smpBtnNPos();
				var ic = prt.fontIcon +' ' + prt.fontIcon + '-linkedin';
				_s.likedinButton_do = new FWDEVPSimpleButton(
						undefined, undefined, undefined, true, undefined, undefined, undefined,
						"<span class='" + ic + "'></span>",
						undefined,
						"EVPSocialMediaButtonsNormalState",
						"EVPSocialMediaButtonsSelectedState"
				);
			}else{
				FWDEVPSimpleButton.setPrototype();
				FWDEVPUtils.smpBtnNPos();
				_s.likedinButton_do = new FWDEVPSimpleButton(_d.likedInkN_img, _d.likedInSPath_str, undefined,
						true,
						_d.useHEX,
						_d.nBC,
						sBC);
			}
			_s.likedinButton_do.screen.className = 'fwdevp-likedin-share-button';
			_s.likedinButton_do.addListener(FWDEVPSimpleButton.MOUSE_UP, _s.likedinOnMouseUpHandler);
			_s.addBtnToArray(_s.likedinButton_do);
			
			
			if(_s.useVectorIcons_bl){
				FWDEVPSimpleButton.setPrototype();
				FWDEVPUtils.smpBtnNPos();
				var ic = prt.fontIcon +' ' + prt.fontIcon + '-comments';
				_s.bufferButton_do = new FWDEVPSimpleButton(
						undefined, undefined, undefined, true, undefined, undefined, undefined,
						"<span class='" + ic + "'></span>",
						undefined,
						"EVPSocialMediaButtonsNormalState",
						"EVPSocialMediaButtonsSelectedState"
				);
			}else{
				FWDEVPSimpleButton.setPrototype();
				_s.bufferButton_do = new FWDEVPSimpleButton(_d.bufferkN_img, _d.bufferSPath_str, undefined,
						true,
						_d.useHEX,
						_d.nBC,
						sBC);
			}
			_s.bufferButton_do.screen.className = 'fwdevp-buffer-share-button';
			_s.bufferButton_do.addListener(FWDEVPSimpleButton.MOUSE_UP, _s.bufferOnMouseUpHandler);
			_s.addBtnToArray(_s.bufferButton_do);
			
			
			if(_s.useVectorIcons_bl){
				FWDEVPSimpleButton.setPrototype();
				FWDEVPUtils.smpBtnNPos();
				var ic = prt.fontIcon +' ' + prt.fontIcon + '-digg';
				_s.diggButton_do = new FWDEVPSimpleButton(
						undefined, undefined, undefined, true, undefined, undefined, undefined,
						"<span class='" + ic + "'></span>",
						undefined,
						"EVPSocialMediaButtonsNormalState",
						"EVPSocialMediaButtonsSelectedState"
				);
			}else{
				FWDEVPSimpleButton.setPrototype();
				_s.diggButton_do = new FWDEVPSimpleButton(_d.diggN_img, _d.diggSPath_str, undefined,
						true,
						_d.useHEX,
						_d.nBC,
						sBC);
			}
			_s.diggButton_do.screen.className = 'fwdevp-digg-share-button';
			_s.diggButton_do.addListener(FWDEVPSimpleButton.MOUSE_UP, _s.diggOnMouseUpHandler);
			_s.addBtnToArray(_s.diggButton_do);
			

			if(_s.useVectorIcons_bl){
				FWDEVPSimpleButton.setPrototype();
				FWDEVPUtils.smpBtnNPos();
				var ic = prt.fontIcon +' ' + prt.fontIcon + '-reddit';
				_s.redditButton_do = new FWDEVPSimpleButton(
						undefined, undefined, undefined, true, undefined, undefined, undefined,
						"<span class='" + ic + "'></span>",
						undefined,
						"EVPSocialMediaButtonsNormalState",
						"EVPSocialMediaButtonsSelectedState"
				);
			}else{
				FWDEVPSimpleButton.setPrototype();
				_s.redditButton_do = new FWDEVPSimpleButton(_d.redditN_img, _d.redditSPath_str, undefined,
						true,
						_d.useHEX,
						_d.nBC,
						sBC);	
			}
			_s.redditButton_do.screen.className = 'fwdevp-reddit-share-button';
			_s.redditButton_do.addListener(FWDEVPSimpleButton.MOUSE_UP, _s.redditOnMouseUpHandler);
			_s.addBtnToArray(_s.redditButton_do);

			
			if(_s.useVectorIcons_bl){
				FWDEVPSimpleButton.setPrototype();
				FWDEVPUtils.smpBtnNPos();
				var ic = prt.fontIcon +' ' + prt.fontIcon + '-tumblr';
				_s.thumbrlButton_do = new FWDEVPSimpleButton(
						undefined, undefined, undefined, true, undefined, undefined, undefined,
						"<span class='" + ic + "'></span>",
						undefined,
						"EVPSocialMediaButtonsNormalState",
						"EVPSocialMediaButtonsSelectedState"
				);
			}else{
				FWDEVPSimpleButton.setPrototype();
				_s.thumbrlButton_do = new FWDEVPSimpleButton(_d.thumbrlN_img, _d.thumbrlSPath_str, undefined,
						true,
						_d.useHEX,
						_d.nBC,
						sBC);
			}
			_s.thumbrlButton_do.screen.className = 'fwdevp-thumbrl-share-button';
			_s.thumbrlButton_do.addListener(FWDEVPSimpleButton.MOUSE_UP, _s.thumbrlOnMouseUpHandler);
			_s.addBtnToArray(_s.thumbrlButton_do);
			
			_s.mainHld.addChild(_s.facebookButton_do);
			_s.mainHld.addChild(_s.twitterButton_do);
			_s.mainHld.addChild(_s.likedinButton_do);
			_s.mainHld.addChild(_s.bufferButton_do);
			_s.mainHld.addChild(_s.diggButton_do);
			_s.mainHld.addChild(_s.redditButton_do);
			_s.mainHld.addChild(_s.thumbrlButton_do);
		}
		
		_s.facebookOnMouseUpHandler = function(){
			var url = "http://www.facebook.com/share.php?u=" + encodeURIComponent(location.href);
			window.open(url,'', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=400,width=600');
		};
		
		_s.googleOnMouseUpHandler = function(){
			var url = "https://plus.google.com/share?url=" + encodeURIComponent(location.href)
			window.open(url,'', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=400,width=600');
		};
		
		_s.twitterOnMouseUpHandler = function(){
			var url = "http://twitter.com/home?status=" + encodeURIComponent(location.href)
			window.open(url,'', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=400,width=600');
		};
		
		_s.likedinOnMouseUpHandler = function(){
			var url = "https://www.linkedin.com/cws/share?url=" + location.href;
			window.open(url,'', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=400,width=600');
		};
		
		_s.bufferOnMouseUpHandler = function(){
			var url = "https://buffer.com/add?url=" + location.href;
			window.open(url,'', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=400,width=600');
		};
		
		_s.diggOnMouseUpHandler = function(){
			var url = "http://digg.com/submit?url=" + location.href;
			window.open(url,'', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=400,width=600');
		};
		
		_s.redditOnMouseUpHandler = function(){
			var url = "https://www.reddit.com/?submit=" + location.href;
			window.open(url,'', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=400,width=600');
		};
		
		_s.thumbrlOnMouseUpHandler = function(){
			var url = "http://www.tumblr.com/share/link?url=" + location.href;
			window.open(url,'', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=400,width=600');
		};

		//########################################//
		/* Add buttons to array */
		//########################################//
		_s.addBtnToArray = function(btn){
			setTimeout(function(){
				if(window.getComputedStyle(btn.screen).display != 'none'){
					_s.btns_ar.push(btn);
				}
			}, 50);
		}
	
		
		//########################################//
		/* Position buttons */
		//########################################//
		_s.positionButtons = function(){
			var button;
			var prevButton;
			var rowsAr = [];
			var rowsWidthAr = [];
			var rowsThumbsWidthAr = [];
			var tempX;
			var tempY = 0;
			var maxY = 0;
			var totalRowWidth = 0;
			var rowsNr = 0;

			if(!_s.btns_ar.length) return;

			if(_s.btns_ar.length == 1){
				button = _s.btns_ar[0];
			
				button.setX(Math.round((_s.sW - button.getWidth())/2))
				button.setY(parseInt((_s.sH - ((rowsNr + 1) * (button.totalHeight + _s.vSpace) - _s.vSpace))/2));

				return;
			}
			
			rowsAr[rowsNr] = [0];
			rowsWidthAr[rowsNr] = _s.btns_ar[0].totalWidth;
			rowsThumbsWidthAr[rowsNr] = _s.btns_ar[0].totalWidth;
			_s.totalButtons = _s.btns_ar.length;
			
			for (var i=1; i<_s.totalButtons; i++){
				button = _s.btns_ar[i];
				
				if (rowsWidthAr[rowsNr] + button.totalWidth + _s.minHSpace > _s.sW - _s.minMrgXSpc){	
					rowsNr++;
					rowsAr[rowsNr] = [];
					rowsAr[rowsNr].push(i);
					rowsWidthAr[rowsNr] = button.totalWidth;
					rowsThumbsWidthAr[rowsNr] = button.totalWidth;
				}else{
					rowsAr[rowsNr].push(i);
					rowsWidthAr[rowsNr] += button.totalWidth + _s.minHSpace;
					rowsThumbsWidthAr[rowsNr] += button.totalWidth;
				}
			}
		
			tempY = parseInt((_s.sH - ((rowsNr + 1) * (button.totalHeight + _s.vSpace) - _s.vSpace))/2);
			
			for (var i=0; i<rowsNr + 1; i++){
				var rowMarginXSpace = 0;
				
				var rowHSpace;
				
				if (rowsAr[i].length > 1){
					rowHSpace = Math.min((_s.sW - _s.minMrgXSpc - rowsThumbsWidthAr[i]) / (rowsAr[i].length - 1), _s.hSpace);
					
					var rowWidth = rowsThumbsWidthAr[i] + rowHSpace * (rowsAr[i].length - 1);
					
					rowMarginXSpace = parseInt((_s.sW - rowWidth)/2);
				}else{
					rowMarginXSpace = parseInt((_s.sW - rowsWidthAr[i])/2);
				}
				
				if (i > 0) tempY += button.h + _s.vSpace;
				
				for (var j=0; j<rowsAr[i].length; j++){
					button = _s.btns_ar[rowsAr[i][j]];
				
					if (j == 0){
						tempX = rowMarginXSpace;
					}else{
						prevButton = _s.btns_ar[rowsAr[i][j] - 1];
						tempX = prevButton.finalX + prevButton.totalWidth + rowHSpace;
					}
					

					button.finalX = tempX;
					button.finalY = tempY;
						
					if (maxY < button.finalY) maxY = button.finalY;
					
					_s.buttonsBarTotalHeight = maxY + button.totalHeight + _s.startY ;
					button.setX(button.finalX);
					button.setY(button.finalY);
				}
			}
		}

		
		//###########################################//
		/* show / hide */
		//###########################################//
		_s.show = function(id){
			if(_s.isShowed_bl) return;
			_s.isShowed_bl = true;
			prt.main_do.addChild(_s);
			_s.init();
	
			if(_s.useVectorIcons_bl){
				_s.checkButtonsId_to = setInterval(function(){
					if(_s.clsBtn.w != 0){
				
						_s.positionAndResize();
						
						clearInterval(_s.checkButtonsId_to);
						clearTimeout(_s.hideCompleteId_to);
						clearTimeout(_s.showCompleteId_to);
						_s.mainHld.setY(- _s.sH);
						
						_s.showCompleteId_to = setTimeout(_s.showCompleteHandler, 900);
						
						FWDAnimation.to(_s.mainHld, .8, {y:0, delay:.1, ease:Expo.easeInOut});
					}
				
				}, 50);
			}else{
				_s.positionAndResize();
			
				clearTimeout(_s.hideCompleteId_to);
				clearTimeout(_s.showCompleteId_to);
				_s.mainHld.setY(- _s.sH);
				
				_s.showCompleteId_to = setTimeout(_s.showCompleteHandler, 900);
				setTimeout(function(){
					FWDAnimation.to(_s.mainHld, .8, {y:0, delay:.1, ease:Expo.easeInOut});
				}, 100);
			}
		};
		
		
		_s.showCompleteHandler = function(){};
		
		_s.hide = function(){
			if(!_s.isShowed_bl) return;
			_s.isShowed_bl = false;
			
			if(!FWDEVPUtils.isMobile || (FWDEVPUtils.isMobile && FWDEVPUtils.hasPointerEvent)) prt.main_do.setSelectable(false);
			
			if(prt.customContextMenu_do) prt.customContextMenu_do.enable();
			_s.positionAndResize();
			
			clearTimeout(_s.hideCompleteId_to);
			clearTimeout(_s.showCompleteId_to);
			
			_s.hideCompleteId_to = setTimeout(_s.hideCompleteHandler, 800);
			FWDAnimation.killTweensOf(_s.mainHld);
			FWDAnimation.to(_s.mainHld, .8, {y:-_s.sH, ease:Expo.easeInOut});
		};
		
		_s.hideCompleteHandler = function(){
			prt.main_do.removeChild(_s);
			_s.dispatchEvent(FWDEVPShareWindow.HIDE_COMPLETE);
		};
		
		if(_d.useHEX){
			_s.init();
		}
	};


	/* set prototype */
	FWDEVPShareWindow.setPrototype = function(){
		FWDEVPShareWindow.prototype = new FWDEVPDO("div");
	};
	
	FWDEVPShareWindow.HIDE_COMPLETE = "hideComplete";
	
	FWDEVPShareWindow.prototype = null;
	window.FWDEVPShareWindow = FWDEVPShareWindow;
}(window));﻿(function (window){

	var FWDEVPSimpleButton = function(nImg, 
								  sPath, 
								  dPath, 
								  alwaysShowSelectedPath, 
								  useHEX,
								  nBC,
								  sBC,
								  iconCSSString, 
								  showHDIcon, 
								  normalCalssName,
								  selectedCalssName,
								  showOver
								 ){
		'use strict';
		
		var _s = this;
		
		_s.iconCSSString = iconCSSString;
		_s.showHDIcon = showHDIcon;
	
		_s.nImg = nImg;
		_s.sPath_str = sPath;
		_s.dPath_str = dPath;
		
		_s.testButton = Boolean(String(_s.iconCSSString).indexOf("download") != -1);
	
		_s.n_do;
		_s.s_sdo;
		_s.d_sdo;

		_s.showOver = showOver;
		if(!useHEX){
			_s.showOver = false;
		}

		_s.toolTipLabel_str;
		
		if(_s.nImg){
			_s.totalWidth = _s.nImg.width;
			_s.totalHeight = _s.nImg.height;
			_s.buttonWidth = _s.totalWidth;
			_s.buttonHeight = _s.totalHeight;
		}
	
		_s.normalCalssName = normalCalssName;
		_s.selectedCalssName = selectedCalssName;
		
		_s.useHEX = useHEX;
		_s.nBC = nBC;
		_s.sBC = sBC;
		
		_s.isShowed_bl = true;
		_s.isMbl = FWDEVPUtils.isMobile;
		_s.hasPointerEvent_bl = FWDEVPUtils.hasPointerEvent;
		_s.allowToCreateSecondButton_bl = !_s.isMbl || _s.hasPointerEvent_bl || alwaysShowSelectedPath;
		_s.useFontAwesome_bl = Boolean(_s.iconCSSString);
		

		//##########################################//
		/* initialize _s */
		//##########################################//
		_s.init = function(){
			if(_s.iconCSSString) _s.setOverflow('visible');
			_s.setupMainContainers();
			_s.setNormalState();
		};

		
		//##########################################//
		/* setup main containers */
		//##########################################//
		_s.setupMainContainers = function(){
			if(_s.useFontAwesome_bl){
				_s.main_do = new FWDEVPDO("div", 0,0, true);
				_s.main_do.setOverflow('visible');
				_s.main_do.hasT2D = true;
				_s.setOverflow('visible');
				_s.n_do = new FWDEVPDO("div");	
				_s.n_do.hasT3D = false;
				_s.n_do.hasT2D = false;
				_s.n_do.setInnerHTML(_s.iconCSSString);
				_s.addChild(_s.main_do);
				_s.main_do.addChild(_s.n_do);

				if(_s.showHDIcon){
					var hdImage = new Image();
					hdImage.src = showHDIcon;
					_s.hd_do = new FWDEVPDO("img");
					_s.hd_do.setScreen(hdImage);
					_s.hd_do.setWidth(7);
					_s.hd_do.setHeight(5);

					_s.setOverflow("visible");
					_s.addChild(_s.hd_do);
				};
			
				_s.setFinalSize();
			}else{
				if(_s.useHEX && !_s.showOver){
					_s.n_do = new FWDEVPDO("div");
					_s.n_do.setWidth(_s.totalWidth);
					_s.n_do.setHeight(_s.totalHeight);

					_s.n_do_canvas = FWDEVPUtils.getCanvasWithModifiedColor(_s.nImg, _s.nBC).canvas;
					_s.n_do.screen.appendChild(_s.n_do_canvas);
					_s.addChild(_s.n_do);
				}else{
					_s.n_do = new FWDEVPDO("img");	
					_s.n_do.setScreen(_s.nImg);
					_s.addChild(_s.n_do);
				}
				_s.n_do.setAlpha(1);
				
				if(_s.allowToCreateSecondButton_bl){
					
					_s.img1 = new Image();
					_s.img1.src = _s.sPath_str;
					var img2 = new Image();
					_s.sImg = img2;
					
					if(_s.useHEX){
						_s.s_sdo = new FWDEVPDO("div");
						_s.s_sdo.setWidth(_s.totalWidth);
						_s.s_sdo.setHeight(_s.totalHeight);
						var clr = _s.sBC;
						if(_s.showOver){
							clr = _s.nBC
						}

						_s.img1.onload = function(){
							_s.s_sdo_canvas = FWDEVPUtils.getCanvasWithModifiedColor(_s.img1, clr).canvas;
							_s.s_sdo.screen.appendChild(_s.s_sdo_canvas);
						}
						if(!_s.showOver){
							_s.s_sdo.setAlpha(0);
						}
						_s.addChild(_s.s_sdo);
					}else{
						_s.s_sdo = new FWDEVPDO("img");
						_s.s_sdo.setScreen(_s.img1);
						_s.s_sdo.setWidth(_s.totalWidth);
						_s.s_sdo.setHeight(_s.totalHeight);
						if(!_s.useHEX){
							_s.s_sdo.setAlpha(0);
						}
						_s.addChild(_s.s_sdo);
					}
					
					if(_s.dPath_str){
						img2.src = _s.dPath_str;
						_s.d_sdo = new FWDEVPDO("img");
						_s.d_sdo.setScreen(img2);
						_s.d_sdo.setWidth(_s.totalWidth);
						_s.d_sdo.setHeight(_s.totalHeight);
						_s.d_sdo.setX(-100);
						_s.addChild(_s.d_sdo);
					};
					_s.setWidth(_s.totalWidth);
					_s.setHeight(_s.totalHeight);
				}
			}

			_s.setButtonMode(true);
			_s.screen.style.yellowOverlayPointerEvents = "none";
			
			if(_s.hasPointerEvent_bl){
				_s.screen.addEventListener("pointerup", _s.onMouseUp);
				_s.screen.addEventListener("pointerover", _s.onMouseOver);
				_s.screen.addEventListener("pointerout", _s.onMouseOut);
			}else if(_s.screen.addEventListener){	
				if(!_s.isMbl){
					_s.screen.addEventListener("mouseover", _s.onMouseOver);
					_s.screen.addEventListener("mouseout", _s.onMouseOut);
					_s.screen.addEventListener("mouseup", _s.onMouseUp);
				}
				_s.screen.addEventListener("touchend", _s.onMouseUp);
			}
		};
		
		_s.onMouseOver = function(e){
			_s.dispatchEvent(FWDEVPSimpleButton.SHOW_TOOLTIP, {e:e});
			if(_s.isDisabledForGood_bl) return;
			if(!e.pointerType || e.pointerType == e.MSPOINTER_TYPE_MOUSE || e.pointerType == "mouse"){
				if(_s.isDisabled_bl || _s.isSelectedFinal_bl) return;
				_s.dispatchEvent(FWDEVPSimpleButton.MOUSE_OVER, {e:e});
				_s.setSelectedState(true);
			}
		};
			
		_s.onMouseOut = function(e){
			if(_s.isDisabledForGood_bl) return;
			if(!e.pointerType || e.pointerType == e.MSPOINTER_TYPE_MOUSE || e.pointerType == "mouse"){
				if(_s.isDisabled_bl || _s.isSelectedFinal_bl) return;
				_s.dispatchEvent(FWDEVPSimpleButton.MOUSE_OUT, {e:e});
				_s.setNormalState(true);
			}
		};
		
		_s.onMouseUp = function(e){
			
			if(_s.isDisabledForGood_bl) return;
			if(e.preventDefault) e.preventDefault();
			if(_s.isDisabled_bl || e.button == 2) return;
		
			_s.dispatchEvent(FWDEVPSimpleButton.MOUSE_UP, {e:e});
		};
		
		_s.checkCount = 0;
		_s.setFinalSize = function(reset){
			if(reset){
				_s.checkCount = 0;
			}
			
			clearInterval(_s.checkId_int);
			if(_s.checkCount > 6) return;
			_s.lastWidth = _s.n_do.screen.firstChild.offsetWidth;
			_s.lastHeight = _s.n_do.screen.firstChild.offsetHeight;
			_s.checkCount +=1;
		
			_s.checkId_int = setInterval(function(){
				_s.setFinalSize();
			},100);
			
			if(_s.prevWidth == _s.lastWidth || _s.lastWidth == 0) return;
			_s.setWidth(_s.n_do.screen.firstChild.offsetWidth);
			_s.setHeight(_s.n_do.screen.firstChild.offsetHeight);

			if(_s.main_do){
				_s.main_do.setWidth(_s.w);
				_s.main_do.setHeight(_s.h);
			}
			_s.n_do.setWidth(_s.w);
			_s.n_do.setHeight(_s.h);
			_s.n_do.setWidth(_s.w);
			_s.n_do.setHeight(_s.h);
			_s.buttonWidth = _s.w;
			_s.buttonHeight = _s.h;
			_s.totalWidth = _s.w;
			_s.totalHeight = _s.h;
		
			if(_s.hd_do){
				_s.hd_do.setX(_s.w - _s.hd_do.w + 2);
				_s.hd_do.setY( -2);	
			}
			
			_s.prevWidth = _s.lastWidth;
			_s.prevHeight = _s.lastHeight;
			_s.lastHeight = _s
		}
		

		//##############################//
		// set select / deselect final.
		//##############################//
		_s.setSelected = function(){
			_s.isSelectedFinal_bl = true;
			if(!_s.s_sdo) return;
			FWDAnimation.killTweensOf(_s.s_sdo);
			FWDAnimation.to(_s.s_sdo, .8, {alpha:1, ease:Expo.easeOut});
		};
		
		_s.setUnselected = function(){
			_s.isSelectedFinal_bl = false;
			if(!_s.s_sdo) return;
			FWDAnimation.to(_s.s_sdo, .8, {alpha:0, delay:.1, ease:Expo.easeOut});
		};
		

		//####################################//
		/* Set normal / selected state */
		//####################################//
		_s.setNormalState = function(animate){
			if(_s.doNotallowToSetNormal) return;
			if(_s.useFontAwesome_bl){
				FWDAnimation.killTweensOf(_s.n_do.screen);
				if(animate){
					FWDAnimation.to(_s.n_do.screen, .6, {className:_s.normalCalssName, ease:Quart.easeOut});	
				}else{
					_s.n_do.screen.className = _s.normalCalssName;
				}
			}else{

				if(_s.showOver){
					FWDAnimation.killTweensOf(_s.s_sdo);
					FWDAnimation.to(_s.s_sdo, .6, {alpha:1, ease:Quart.easeOut});	
				}else{
					FWDAnimation.killTweensOf(_s.s_sdo);
					FWDAnimation.to(_s.s_sdo, .6, {alpha:0, ease:Quart.easeOut});	
				}
			}
		};
		
		_s.setSelectedState = function(animate){
			if(_s.useFontAwesome_bl){
				FWDAnimation.killTweensOf(_s.n_do.screen);
				if(animate){
					FWDAnimation.to(_s.n_do.screen, .6, {className:_s.selectedCalssName, ease:Quart.easeOut});	
				}else{
					_s.n_do.screen.className = _s.selectedCalssName;
				}
			}else{
				if(_s.showOver){
					FWDAnimation.killTweensOf(_s.s_sdo);
					FWDAnimation.to(_s.s_sdo, .6, {alpha:0, ease:Quart.easeOut});	
				}else{
					FWDAnimation.killTweensOf(_s.s_sdo);
					FWDAnimation.to(_s.s_sdo, .6, {alpha:1, delay:.1, ease:Quart.easeOut});
				}
				
			}
		};
		

		//####################################//
		/* Disable / enable */
		//####################################//
		_s.setDisabledState = function(){
			if(_s.isSetToDisabledState_bl) return;
			_s.isSetToDisabledState_bl = true;
			if(_s.d_sdo) _s.d_sdo.setX(0);
			if(_s.hd_do) _s.hd_do.setX(_s.w - _s.hd_do.w);
		};
		
		_s.setEnabledState = function(){
			if(!_s.isSetToDisabledState_bl) return;
			_s.isSetToDisabledState_bl = false;
			if(_s.d_sdo) _s.d_sdo.setX(-100);
			if(_s.hd_do) _s.hd_do.setX(-100000);
		};
		
		_s.disable = function(){
			if(_s.isDisabledForGood_bl || _s.isDisabled_bl) return;

			_s.isDisabled_bl = true;
			_s.setButtonMode(false);
			FWDAnimation.killTweensOf(_s);
			FWDAnimation.to(_s, .6, {alpha:.4});
			_s.setNormalState(true);
		};
		
		_s.enable = function(){
			if(_s.isDisabledForGood_bl || !_s.isDisabled_bl) return;
			_s.isDisabled_bl = false;
			_s.setButtonMode(true);
			FWDAnimation.killTweensOf(_s);
			FWDAnimation.to(_s, .6, {alpha:1});
		};
		
		_s.disableForGood = function(){
			_s.isDisabledForGood_bl = true;
			_s.setButtonMode(false);
		};
		
		_s.showDisabledState = function(){
			if(_s.d_sdo) if(_s.d_sdo.x != 0) _s.d_sdo.setX(0);
			if(_s.hd_do) _s.hd_do.setX(_s.w - _s.hd_do.w + 2);
		};
		
		_s.hideDisabledState = function(){
			if(_s.d_sdo) if(_s.d_sdo.x != -100) _s.d_sdo.setX(-100);
			if(_s.hd_do) _s.hd_do.setX(-10000);
		};
	
		
		//#####################################//
		/* show / hide */
		//#####################################//
		_s.show = function(dl){
			if(_s.isShowed_bl) return;
			_s.isShowed_bl = true;
			
			if(dl === 0){
				if(_s.main_do){
					_s.setVisible(true);
					_s.main_do.setScale2(1);
				}else{
					_s.setVisible(true);
					_s.setScale2(1);
				}
				
			}else{
				if(_s.main_do){
					FWDAnimation.killTweensOf(_s.main_do);
					FWDAnimation.to(_s.main_do, .8, {scale:1, delay:.4, onStart:function(){_s.setVisible(true);}, ease:Elastic.easeOut});
				}else{
					FWDAnimation.killTweensOf(_s);
					FWDAnimation.to(_s, .8, {scale:1, delay:.4, onStart:function(){_s.setVisible(true);}, ease:Elastic.easeOut});
				}
			}
			_s.screen.style.pointerEvents = "auto";
		};	

		_s.show2 = function(){
			if(_s.isShowed_bl) return;
			_s.isShowed_bl = true;
			
			if(dl === 0){
				if(_s.main_do){
					_s.setVisible(true);
					_s.main_do.setScale2(1);
				}else{
					_s.setVisible(true);
					_s.setScale2(1);
				}
				
			}else{
				if(_s.main_do){
					FWDAnimation.killTweensOf(_s.main_do);
					FWDAnimation.to(_s.main_do, .8, {scale:1,  onStart:function(){_s.setVisible(true);}, ease:Elastic.easeOut});
				}else{
					FWDAnimation.killTweensOf(_s);
					FWDAnimation.to(_s, .8, {scale:1, onStart:function(){_s.setVisible(true);}, ease:Elastic.easeOut});
				}
			}
			_s.screen.style.pointerEvents = "auto";
		};	
			
		_s.hide = function(anim){
			if(!_s.isShowed_bl) return;
			_s.isShowed_bl = false;

			if(_s.main_do){	
				if(anim){
					FWDAnimation.killTweensOf(_s.main_do);
					FWDAnimation.to(_s.main_do, .8, {scale:0, delay:.4, ease:Elastic.easeOut});
				}else{
					_s.setVisible(false);
					FWDAnimation.killTweensOf(_s.main_do);
					_s.main_do.setScale2(0);
				}
			}else{
				_s.setVisible(false);
				FWDAnimation.killTweensOf(_s);
				_s.setScale2(0);
			}
			_s.screen.style.pointerEvents = "none";
		};
		

		//##########################################//
		/* Update HEX color of a canvaas */
		//##########################################//
		_s.updateHEXColors = function(nBC, sBC){
			if(_s.n_do_canvas){
				FWDEVPUtils.changeCanvasHEXColor(_s.nImg, _s.n_do_canvas, nBC);
			}
			
			if(_s.s_sdo_canvas){
				FWDEVPUtils.changeCanvasHEXColor(_s.img1, _s.s_sdo_canvas, sBC);
			}
		}
		
		_s.init();
	};
	
	
	/* set prototype */
	FWDEVPSimpleButton.setPrototype = function(){
		FWDEVPSimpleButton.prototype = null;
		FWDEVPSimpleButton.prototype = new FWDEVPDO("div");
	};

	FWDEVPSimpleButton.setTransformPrototype = function(){
		FWDEVPSimpleButton.prototype = null;
		FWDEVPSimpleButton.prototype = new FWDEVPDO("div", 0,0, true);
	};
	
	FWDEVPSimpleButton.CLICK = "onClick";
	FWDEVPSimpleButton.MOUSE_OVER = "onMouseOver";
	FWDEVPSimpleButton.SHOW_TOOLTIP = "showTooltip";
	FWDEVPSimpleButton.MOUSE_OUT = "onMouseOut";
	FWDEVPSimpleButton.MOUSE_UP = "onMouseDown";
	
	FWDEVPSimpleButton.prototype = null;
	window.FWDEVPSimpleButton = FWDEVPSimpleButton;
}(window));﻿/**
 * Easy Video Player PACKAGED v9.1
 * Simple size button.
 *
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © 2006 All Rights Reserved.
 */
(function (window){

	var FWDEVPSimpleSizeButton = function(
		nImgPath, 
		sImgPath,
		buttonWidth,
		buttonHeight, 
	    useHEX,
	    nBC,
	    sBC,
	    showOver){

		'use strict';
		
		var _s = this;
		
		_s.n_do;
		_s.s_do;
		
		_s.useHEX = useHEX;
		_s.nBC = nBC;
		_s.sBC = sBC;
		
		_s.nImgPath_str = nImgPath;
		_s.sImgPath_str = sImgPath;
		
		_s.buttonWidth = buttonWidth;
		_s.buttonHeight = buttonHeight;

		_s.showOver = showOver;
		if(!useHEX){
			_s.showOver = false;
		}

		_s.isMbl = FWDEVPUtils.isMobile;
		_s.hasPointerEvent_bl = FWDEVPUtils.hasPointerEvent;
		_s.isDisabled_bl = false;
		
		
		//##########################################//
		/* initialize this */
		//##########################################//
		_s.init = function(){
			_s.setupMainContainers();
			_s.setWidth(_s.buttonWidth);
			_s.setHeight(_s.buttonHeight);
			_s.setButtonMode(true);
		};
		

		//##########################################//
		/* setup main containers */
		//##########################################//
		_s.setupMainContainers = function(){
			
			_s.nImg = new Image();
			_s.nImg.src = _s.nImgPath_str;
			
			if(_s.useHEX && !_s.showOver){
				_s.n_do = new FWDEVPDO("div", 0, 0, true);
				_s.n_do.setWidth(_s.buttonWidth);
				_s.n_do.setHeight(_s.buttonHeight);
				_s.nImg.onload = function(){	
					_s.n_do_canvas = FWDEVPUtils.getCanvasWithModifiedColor(_s.nImg, _s.nBC).canvas;
					_s.n_do.screen.appendChild(_s.n_do_canvas);
				}
				_s.addChild(_s.n_do);
			}else{
				_s.n_do = new FWDEVPDO("img");
				_s.n_do.setScreen(_s.nImg);
				_s.n_do.setWidth(_s.buttonWidth);
				_s.n_do.setHeight(_s.buttonHeight);
				_s.addChild(_s.n_do);
			}
			_s.n_do.setAlpha(1);

			_s.sImg = new Image();
			_s.sImg.src = _s.sImgPath_str;
			
			if(_s.useHEX){
				_s.s_do = new FWDEVPDO("div", 0, 0, true);
				_s.s_do.setWidth(_s.buttonWidth);
				_s.s_do.setHeight(_s.buttonHeight);
				_s.sImg.onload = function(){
					_s.s_do_canvas = FWDEVPUtils.getCanvasWithModifiedColor(_s.sImg, _s.nBC).canvas;
					_s.s_do.screen.appendChild(_s.s_do_canvas);
				}
				if(!_s.showOver){
					_s.s_do.setAlpha(0);
				}
				_s.addChild(_s.s_do);
			}else{
				_s.s_do = new FWDEVPDO("img");
				_s.s_do.setScreen(_s.sImg);
				_s.s_do.setWidth(_s.buttonWidth);
				_s.s_do.setHeight(_s.buttonHeight);
				_s.addChild(_s.s_do);

				if(!_s.useHEX){
					_s.s_do.setAlpha(0);
				}
			}
			
			if(_s.showOver){
				_s.addChild(_s.s_do);
			}
			
			if(_s.hasPointerEvent_bl){
				_s.screen.addEventListener("pointerup", _s.onMouseUp);
				_s.screen.addEventListener("pointerover", _s.setSelectedState);
				_s.screen.addEventListener("pointerout", _s.setNormalState);
			}else if(_s.screen.addEventListener){	
				if(!_s.isMbl){
					_s.screen.addEventListener("mouseover", _s.setSelectedState);
					_s.screen.addEventListener("mouseout", _s.setNormalState);
					_s.screen.addEventListener("mouseup", _s.onMouseUp);
				}
				_s.screen.addEventListener("touchend", _s.onMouseUp);
			}
			
		};
		
		//####################################//
		/* Set normal / selected state */
		//####################################//
		_s.setNormalState = function(e){
			if(_s.showOver){
				FWDAnimation.killTweensOf(_s.s_do);
				FWDAnimation.to(_s.s_do, .6, {alpha:1, ease:Quart.easeOut});
			}else{
				FWDAnimation.killTweensOf(_s.s_do);
				FWDAnimation.to(_s.s_do, .6, {alpha:0, ease:Quart.easeOut});
			}
		};
		
		_s.setSelectedState = function(e){
			if(_s.showOver){
				FWDAnimation.killTweensOf(_s.s_do);
				FWDAnimation.to(_s.s_do, .6, {alpha:0, ease:Quart.easeOut});
			}else{
				FWDAnimation.killTweensOf(_s.s_do);
				FWDAnimation.to(_s.s_do, .6, {alpha:1, ease:Quart.easeOut});
			}	
		};
		
		_s.onMouseUp = function(e){
			_s.dispatchEvent(FWDEVPSimpleSizeButton.MOUSE_UP);
			_s.dispatchEvent(FWDEVPSimpleSizeButton.CLICK);
		};
		

		//##########################################//
		/* Update HEX color of a canvaas */
		//##########################################//
		_s.updateHEXColors = function(nBC, sBC){
			if(_s.n_do_canvas){
				FWDEVPUtils.changeCanvasHEXColor(_s.nImg, _s.n_do_canvas, nBC);
			}
			var clr = sBC;
			if(_s.showOver){
				clr = nBC;
			}
			FWDEVPUtils.changeCanvasHEXColor(_s.sImg, _s.s_do_canvas, clr);
		}
			
		_s.init();
	};
	
	
	/* set prototype */
	FWDEVPSimpleSizeButton.setPrototype = function(){
		FWDEVPSimpleSizeButton.prototype = null;
		FWDEVPSimpleSizeButton.prototype = new FWDEVPDO("div", "relative");
	};
	
	FWDEVPSimpleSizeButton.MOUSE_UP = "onMouseUp";
	FWDEVPSimpleSizeButton.CLICK = "onClick";
	
	FWDEVPSimpleSizeButton.prototype = null;
	window.FWDEVPSimpleSizeButton = FWDEVPSimpleSizeButton;
}(window));﻿/**
 * Easy Video Player PACKAGED v9.1
 * Subtitle.
 *
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © 2006 All Rights Reserved.
 */
(function (window){

	var FWDEVPSubtitle = function(prt, _d){

		'use strict';
		
		var _s = this;
		_s.isMobile_bl = FWDEVPUtils.isMobile;
		_s.hasPointerEvent_bl = FWDEVPUtils.hasPointerEvent;
		_s.showSubtitileByDefault_bl = _d.showSubtitileByDefault_bl;
		
	
		//##########################################//
		/* initialize _s */
		//##########################################//
		_s.init = function(){
			_s.setOverflow("visible");
			_s.style().cursor = "default";
			_s.setupTextContainer();
			_s.setWidth(prt.maxWidth);
			_s.style().margin = "auto";			
			_s.hide();
		};
		

		//##########################################//
		/* setup text containers */
		//##########################################//
		_s.setupTextContainer = function(){
			_s.text_do = new FWDEVPDO("div", 0, 0, true);
			_s.text_do.style().pointerEvents = "none";
			_s.text_do.hasT3D = false;
			_s.text_do.setBackfaceVisibility();
			_s.text_do.style().transformOrigin = "50% 0%";
			_s.text_do.setWidth(prt.maxWidth);
			_s.text_do.style().textAlign = "center";
			
			_s.text_do.style().fontSmoothing = "antialiased";
			_s.text_do.style().webkitFontSmoothing = "antialiased";
			_s.text_do.style().textRendering = "optimizeLegibility";
			_s.addChild(_s.text_do);
		};
		

		//##########################################//
		/* Load subtitle */
		//##########################################//
		_s.loadSubtitle = function(path){
			_s.text_do.setX(-5000);
			if(location.protocol.indexOf("file:") != -1) return;
			_s.subtitiles_ar = [];
			_s.stopToLoadSubtitle();
			_s.sourceURL_str = path;
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
		};
		
		_s.onLoad = function(e){
			var response;
			
			if(_s.xhr.readyState == 4){
				if(_s.xhr.status == 404){
					_s.dispatchEvent(FWDEVPData.LOAD_ERROR, {text:"Subtitle file path is not found: <font color='#FF0000'>" + _s.sourceURL_str + "</font>"});
				}else if(_s.xhr.status == 408){
					_s.dispatchEvent(FWDEVPData.LOAD_ERROR, {text:"Loadiong subtitle file file request load timeout!"});
				}else if(_s.xhr.status == 200){
					
					_s.subtitle_txt = _s.xhr.responseText;
					
					if(_s.isShowed_bl) _s.show();
					
					_s.parseSubtitle(_s.subtitle_txt)
					_s.prevText = "none";
					if(_s.showSubtitileByDefault_bl){
						_s.showId_to = setTimeout(function(){
							_s.show();
							_s.text_do.setX(0);
							_s.updateSubtitle(prt.currentSecconds);
						}, 400);
					}
				}
			}
			
			_s.dispatchEvent(FWDEVPSubtitle.LOAD_COMPLETE);
		};
		
		_s.onError = function(e){
			try{
				if(window.console) console.log(e);
				if(window.console) console.log(e.message);
			}catch(e){};
			_s.dispatchEvent(FWDEVPSubtitle.LOAD_ERROR, {text:"Error loading subtitle file : <font color='#FF0000'>" + _s.sourceURL_str + "</font>."});
		};
		

		//####################################################//
		/* Stop to load subtitile */
		//####################################################//
		_s.stopToLoadSubtitle = function(){
			clearTimeout(_s.showId_to);
			if(_s.xhr != null){
				_s.xhr.onreadystatechange = null;
				_s.xhr.onerror = null;
				try{_s.xhr.abort();}catch(e){}
				_s.xhr = null;
			}
			
			_s.hide();
			_s.isLoaded_bl = false;
		};
		

		//##########################################//
		/* parse subtitle */
		//##########################################//
		_s.parseSubtitle = function(file_str){
			
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
		            var n = st[0];

		            var i = strip(st[1].split(' --> ')[0]);
		            var o = strip(st[1].split(' --> ')[1]);
		            var t = st[2];
					

		            if(st.length > 2) {
		                for(var j=3; j<st.length;j++)
		                  t += '<br>'+st[j];
		            }
		            
		            //define variable type as Object
		            _s.subtitiles_ar[cont] = {};
		            _s.subtitiles_ar[cont].number = n;
		            _s.subtitiles_ar[cont].start = i;
		            _s.subtitiles_ar[cont].end = o;
		            _s.subtitiles_ar[cont].startDuration =  FWDEVPUtils.formatTimeWithMiliseconds(i);
		            _s.subtitiles_ar[cont].endDuration = FWDEVPUtils.formatTimeWithMiliseconds(o);
		            _s.subtitiles_ar[cont].text = "<p class='EVPSubtitle'>" + t + "</p>";
		        }
		        cont++;
		    }
			for(var i=0; i<_s.subtitiles_ar.length; i++){
				if(!_s.subtitiles_ar[i]){
					_s.subtitiles_ar.splice(i,1);
					i--;
				}
			}
		};
		

		//#####################################//
		/* Update text */
		//#####################################//
		_s.updateSubtitle = function(duration){
			if(!_s.isLoaded_bl) return;
		
			var start;
			var end;
			var text = "";
			for(var i=0; i<_s.subtitiles_ar.length; i++){
				start = _s.subtitiles_ar[i].startDuration;
				end = _s.subtitiles_ar[i].endDuration;
				if(start < duration  && end > duration ){
					text = _s.subtitiles_ar[i].text
					break;
				};
			}

			if(prt.sW < 260){
				_s.setVisible(false);
			}else{
				_s.setVisible(true);
			}

			if(prt.sW <= 600){
				text = text.replace('EVPSubtitle', 'EVPSubtitle phone');
			}else if(prt.sW <= 1000){
				text = text.replace('EVPSubtitle', 'EVPSubtitle tablet');
			}else if(prt.sW <= 1800){
				text = text.replace('EVPSubtitle', 'EVPSubtitle normal');
			}else{
				text = text.replace('EVPSubtitle', 'EVPSubtitle large');
			}

			if(_s.prevText != text){
				var totalWidth;
				if(prt.sW)
				var sW = prt.tempVidStageWidth;

				_s.text_do.setInnerHTML(text);
				_s.setAlpha(0);
				setTimeout(function(){
					_s.setAlpha(1);
					_s.position();
				}, 300);
				_s.hasText_bl = true;
			}
			_s.prevText = text;
		};
		
		_s.position = function(animate){
			if(!_s.isLoaded_bl) return;
			
			var finalY;
			_s.text_do.setWidth(prt.tempVidStageWidth);
		
			var textHeight = _s.text_do.getHeight();
			
			if(prt.controller_do){
				if(prt.controller_do.isShowed_bl){
					finalY = parseInt(prt.sH - prt.controller_do.h - textHeight);
				}else{
					finalY = parseInt(prt.sH - textHeight - 10);
				}	
			}else{
				finalY = parseInt(prt.sH - textHeight);
			}
			
			FWDAnimation.killTweensOf(_s.text_do)
			if(animate){
				FWDAnimation.to(_s.text_do, .8, {y:finalY, ease:Expo.easeInOut});
			}else{
				_s.text_do.setY(finalY)
			}
		};
		
		_s.show = function(){
			_s.setVisible(true);
		};
		
		_s.hide = function(){
			_s.setVisible(false);
		}
		
		_s.init();
	};
	
	FWDEVPSubtitle.getDuration = function(str){
		var hours = 0;
		var minutes = 0;
		var seconds = 0;
		var duration = 0;
		
		str = str.split(":");
		
		hours = str[0];
		if(hours[0] == "0" && hours[1] != "0"){
			hours = parseInt(hours[1]);
		}
		if(hours == "00") hours = 0;
		
		minutes = str[1];
		if(minutes[0] == "0" && minutes[1] != "0"){
			minutes = parseInt(minutes[1]);
		}
		if(minutes == "00") minutes = 0;
		
		secs = parseInt(str[2].replace(/,.*/ig, ""));
		if(secs[0] == "0" && secs[1] != "0"){
			secs = parseInt(secs[1]);
		}
		if(secs == "00") secs = 0;
		
		if(hours != 0){
			duration += (hours * 60 * 60)
		}
		
		if(minutes != 0){
			duration += (minutes * 60)
		}
		
		duration += secs;
		
		return duration;
	 }
	
	
	/* set prototype */
	FWDEVPSubtitle.setPrototype = function(){
		FWDEVPSubtitle.prototype = null;
		FWDEVPSubtitle.prototype = new FWDEVPDO("div");
	};
	
	FWDEVPSubtitle.LOAD_ERROR = "error";
	FWDEVPSubtitle.LOAD_COMPLETE = "complete";
	
	
	FWDEVPSubtitle.prototype = null;
	window.FWDEVPSubtitle = FWDEVPSubtitle;
}(window));﻿/**
 * Easy Video Player PACKAGED v9.1
 * Utils.
 *
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © 2006 All Rights Reserved.
 */
(function (window){

	var FWDEVPUtils = function(){
		'use strict';
	};
	
	FWDEVPUtils.dumy = document.createElement("div");
	

	//###################################//
	/* String */
	//###################################//
	FWDEVPUtils.trim = function(str){
		return str.replace(/\s/gi, "");
	};
	
	FWDEVPUtils.storArrayBasedOnObjectValue = function(array, property){
		
		array.sort(dynamicSort(property));
		function dynamicSort(property) {
			var sortOrder = 1;
			if(property[0] === "-") {
				sortOrder = -1;
				property = property.substr(1);
			}
			return function (a,b) {
				var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
				return result * sortOrder;
			}
		}
	};
	
	FWDEVPUtils.trimAndFormatUrl = function(str){
		str = str.toLocaleLowerCase();
		str = str.replace(/ /g, "-");
		return str;
	};
	
	FWDEVPUtils.splitAndTrim = function(str, trim_bl){
		var array = str.split(",");
		var length = array.length;
		for(var i=0; i<length; i++){
			if(trim_bl) array[i] = FWDEVPUtils.trim(array[i]);
		};
		return array;
	};
	
	FWDEVPUtils.checkTime = function(time){
		var timeRegExp = /^(?:2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9]$/;
		if(!timeRegExp.test(time)) return false;
		return true;
	};

	FWDEVPUtils.formatTime = function(secs){
		secs = Math.round(secs);
		var hours = Math.floor(secs / (60 * 60));
		
	    var divisor_for_minutes = secs % (60 * 60);
	    var minutes = Math.floor(divisor_for_minutes / 60);

	    var divisor_for_seconds = divisor_for_minutes % 60;
	    var seconds = Math.ceil(divisor_for_seconds);
	    
	    minutes = (minutes >= 10) ? minutes : "0" + minutes;
	    seconds = (seconds >= 10) ? seconds : "0" + seconds;
	    
	    if(isNaN(seconds)) return "00:00";
	  
		if(hours){
			
			if(hours >= 10) return hours + ":" + minutes + ":" + seconds;
			return "0" + hours + ":" + minutes + ":" + seconds;
		}else{
			 return minutes + ":" + seconds;
		}
	};
	
	FWDEVPUtils.formatTimeWithMiliseconds = function(str){
		var	hours = parseInt(str.split(':')[0]);  
		var	minutes = parseInt(str.split(':')[1]);  
		var	seconds = parseInt(str.split(':')[2]);  
		var	millisesconds = parseInt(str.split(',')[1] || str.split('.')[1]);
		var t = (hours*60*60) + (minutes*60) + seconds + (millisesconds/1000);  
		t = Math.round(t*100)/100;  
		return t;  
	};
	
	FWDEVPUtils.isLocal = (function (){
		return location.protocol.indexOf("file:") != -1;
	}());
	
	FWDEVPUtils.xmlToJson = function(xml) {
	
		// Create the return object
		var obj = {};

		// console.log(xml.nodeType, xml.nodeName );
		if (xml.nodeType == 1) { // element
			// do attributes
			if (xml.attributes.length > 0) {
			obj["@attributes"] = {};
				for (var j = 0; j < xml.attributes.length; j++) {
					var attribute = xml.attributes.item(j);
					obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
				}
			}
		} else if (xml.nodeType == 3) { // text
			obj = xml.nodeValue.trim(); // add trim here
		}
		else if (xml.nodeType == 4) { // cdata section
			obj = xml.nodeValue
		}

		// do children
		if (xml.hasChildNodes()) {
			for(var i = 0; i < xml.childNodes.length; i++) {
				var item = xml.childNodes.item(i);
				var nodeName = item.nodeName;
				if (typeof(obj[nodeName]) == "undefined") {
					obj[nodeName] = FWDEVPUtils.xmlToJson(item);
				} else {
					if (typeof(obj[nodeName].length) == "undefined") {
						var old = obj[nodeName];
						obj[nodeName] = [];
						obj[nodeName].push(old);
					}
					if (typeof(obj[nodeName]) === 'object') {
						obj[nodeName].push(FWDEVPUtils.xmlToJson(item));
					}
				}
			}
		}
		return obj;
	};
	
	FWDEVPUtils.isIMA = function(src){
		if(src.match(/doubleclick.net/ig)) return true;
		if(src.match(/ad_type=/ig) && src.match(/client=/ig)) return true;
		return;
	}

	FWDEVPUtils.isURLEncoded = function(url){
		try{
			var decodedURL = decodeURIComponent(url);
			if(decodedURL != url && url.indexOf('%') != -1) return true;
		}catch(e){}
		return false;
	}

	FWDEVPUtils.getValidSource =  function(source){
		if(!source) return;
		
		var path1 = (location.origin == 'null') ? '' : location.origin;
		var path2 = location.pathname;
		
		if(path2.indexOf(".") != -1){
			path2 = path2.substr(0, path2.lastIndexOf("/") + 1);
		}

		var hasHTTPorHTTPS_bl = !(source.indexOf("http:") == -1 && source.indexOf("https:") == -1 && !FWDEVPUtils.isLocal);
		
		if(!hasHTTPorHTTPS_bl){
			source = path1 + path2 + source;
		}
		
		var firstUrlPath = source.substr(0,source.lastIndexOf("/") + 1);
		if(!FWDEVPUtils.isURLEncoded(firstUrlPath)){
			firstUrlPath = encodeURI(firstUrlPath);
		}
		var secondUrlPath = source.substr(source.lastIndexOf("/") + 1);
		
		if(source.match(/\.mp3|\.mp4|\.m3u8|\.txt|\.srt|\.vtt|\.jpg|\.jpeg|\.png/ig)
			&& !source.match(/\.s3|\drive.|filedn.|cloudfront.|\?/ig)
		    ){
			if(FWDEVPUtils.isURLEncoded(secondUrlPath)){
				secondUrlPath = source.substr(source.lastIndexOf("/") + 1);
			}else{
				secondUrlPath = encodeURI(source.substr(source.lastIndexOf("/") + 1));
			}
		}else{
			secondUrlPath = source.substr(source.lastIndexOf("/") + 1);
		}
	
		source = firstUrlPath + secondUrlPath;	
	
		return source;
	}
	
	FWDEVPUtils.getSecondsFromString = function(str){
		var hours = 0;
		var minutes = 0;
		var seconds = 0;
		var duration = 0;
		
		if(!str) return undefined;
		
		str = str.split(":");
		
		hours = str[0];
		if(hours[0] == "0" && hours[1] != "0"){
			hours = parseInt(hours[1]);
		}
		if(hours == "00") hours = 0;
		
		minutes = str[1];
		if(minutes[0] == "0" && minutes[1] != "0"){
			minutes = parseInt(minutes[1]);
		}
		if(minutes == "00") minutes = 0;
		
		secs = parseInt(str[2].replace(/,.*/ig, ""));
		if(secs[0] == "0" && secs[1] != "0"){
			secs = parseInt(secs[1]);
		}
		if(secs == "00") secs = 0;
		
		if(hours != 0){
			duration += (hours * 60 * 60)
		}
		
		if(minutes != 0){
			duration += (minutes * 60)
		}
	
		duration += secs;
		
		return duration;
	 };
	
	FWDEVPUtils.MD5 = function (string) {

    function RotateLeft(lValue, iShiftBits) {
        return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
    }

    function AddUnsigned(lX,lY) {
        var lX4,lY4,lX8,lY8,lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
        if (lX4 & lY4) {
            return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        }
        if (lX4 | lY4) {
            if (lResult & 0x40000000) {
                return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            } else {
                return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            }
        } else {
            return (lResult ^ lX8 ^ lY8);
        }
    }

    function F(x,y,z) { return (x & y) | ((~x) & z); }
    function G(x,y,z) { return (x & z) | (y & (~z)); }
    function H(x,y,z) { return (x ^ y ^ z); }
    function I(x,y,z) { return (y ^ (x | (~z))); }

    function FF(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };

    function GG(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };

    function HH(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };

    function II(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };

    function ConvertToWordArray(string) {
        var lWordCount;
        var lMessageLength = string.length;
        var lNumberOfWords_temp1=lMessageLength + 8;
        var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
        var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
        var lWordArray=Array(lNumberOfWords-1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while ( lByteCount < lMessageLength ) {
            lWordCount = (lByteCount-(lByteCount % 4))/4;
            lBytePosition = (lByteCount % 4)*8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount-(lByteCount % 4))/4;
        lBytePosition = (lByteCount % 4)*8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
        lWordArray[lNumberOfWords-2] = lMessageLength<<3;
        lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
        return lWordArray;
    };

    function WordToHex(lValue) {
        var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
        for (lCount = 0;lCount<=3;lCount++) {
            lByte = (lValue>>>(lCount*8)) & 255;
            WordToHexValue_temp = "0" + lByte.toString(16);
            WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
        }
        return WordToHexValue;
    };

    function Utf8Encode(string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    };

    var x=Array();
    var k,AA,BB,CC,DD,a,b,c,d;
    var S11=7, S12=12, S13=17, S14=22;
    var S21=5, S22=9 , S23=14, S24=20;
    var S31=4, S32=11, S33=16, S34=23;
    var S41=6, S42=10, S43=15, S44=21;

    string = Utf8Encode(string);

    x = ConvertToWordArray(string);

    a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;

    for (k=0;k<x.length;k+=16) {
        AA=a; BB=b; CC=c; DD=d;
        a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
        d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
        c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
        b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
        a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
        d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
        c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
        b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
        a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
        d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
        c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
        b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
        a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
        d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
        c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
        b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
        a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
        d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
        c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
        b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
        a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
        d=GG(d,a,b,c,x[k+10],S22,0x2441453);
        c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
        b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
        a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
        d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
        c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
        b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
        a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
        d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
        c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
        b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
        a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
        d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
        c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
        b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
        a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
        d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
        c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
        b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
        a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
        d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
        c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
        b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
        a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
        d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
        c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
        b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
        a=II(a,b,c,d,x[k+0], S41,0xF4292244);
        d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
        c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
        b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
        a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
        d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
        c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
        b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
        a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
        d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
        c=II(c,d,a,b,x[k+6], S43,0xA3014314);
        b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
        a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
        d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
        c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
        b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
        a=AddUnsigned(a,AA);
        b=AddUnsigned(b,BB);
        c=AddUnsigned(c,CC);
        d=AddUnsigned(d,DD);
    }

    var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);

    return temp.toLowerCase();
}
	

	//#############################################//
	//Array //
	//#############################################//
	FWDEVPUtils.indexOfArray = function(array, prop){
		var length = array.length;
		for(var i=0; i<length; i++){
			if(array[i] === prop) return i;
		};
		return -1;
	};
	
	FWDEVPUtils.randomizeArray = function(aArray) {
		var randomizedArray = [];
		var copyArray = aArray.concat();
			
		var length = copyArray.length;
		for(var i=0; i< length; i++) {
				var index = Math.floor(Math.random() * copyArray.length);
				randomizedArray.push(copyArray[index]);
				copyArray.splice(index,1);
			}
		return randomizedArray;
	};
	
	FWDEVPUtils.getCookie = function(name){
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
		}
		return null;
	}
	

	//#############################################//
	/*DOM manipulation */
	//#############################################//
	FWDEVPUtils.prt = function (e, n){
		if(n === undefined) n = 1;
		while(n-- && e) e = e.parentNode;
		if(!e || e.nodeType !== 1) return null;
		return e;
	};
	
	FWDEVPUtils.sibling = function(e, n){
		while (e && n !== 0){
			if(n > 0){
				if(e.nextElementSibling){
					 e = e.nextElementSibling;	 
				}else{
					for(var e = e.nextSibling; e && e.nodeType !== 1; e = e.nextSibling);
				}
				n--;
			}else{
				if(e.previousElementSibling){
					 e = e.previousElementSibling;	 
				}else{
					for(var e = e.previousSibling; e && e.nodeType !== 1; e = e.previousSibling);
				}
				n++;
			}
		}
		return e;
	};
	
	FWDEVPUtils.getChildAt = function (e, n){
		var kids = FWDEVPUtils.getChildren(e);
		if(n < 0) n += kids.length;
		if(n < 0) return null;
		return kids[n];
	};
	
	FWDEVPUtils.getChildById = function(id){
		return document.getElementById(id) || undefined;
	};
	
	FWDEVPUtils.getChildren = function(e, allNodesTypes){
		var kids = [];
		for(var c = e.firstChild; c != null; c = c.nextSibling){
			if(allNodesTypes){
				kids.push(c);
			}else if(c.nodeType === 1){
				kids.push(c);
			}
		}
		return kids;
	};
	
	FWDEVPUtils.getChildrenFromAttribute = function(e, attr, allNodesTypes){
		var kids = [];
		for(var c = e.firstChild; c != null; c = c.nextSibling){
			if(allNodesTypes && FWDEVPUtils.hasAttribute(c, attr)){
				kids.push(c);
			}else if(c.nodeType === 1 && FWDEVPUtils.hasAttribute(c, attr)){
				kids.push(c);
			}
		}
		return kids.length == 0 ? undefined : kids;
	};
	
	FWDEVPUtils.getChildFromNodeListFromAttribute = function(e, attr, allNodesTypes){
		for(var c = e.firstChild; c != null; c = c.nextSibling){
			if(allNodesTypes && FWDEVPUtils.hasAttribute(c, attr)){
				return c;
			}else if(c.nodeType === 1 && FWDEVPUtils.hasAttribute(c, attr)){
				return c;
			}
		}
		return undefined;
	};
	
	FWDEVPUtils.getAttributeValue = function(e, attr){
		if(!FWDEVPUtils.hasAttribute(e, attr)) return undefined;
		return e.getAttribute(attr);	
	};
	
	FWDEVPUtils.hasAttribute = function(e, attr){
		if(e.hasAttribute){
			return e.hasAttribute(attr); 
		}else {
			var test = e.attributes[attr];
			return  test ? true : false;
		}
	};
	
	FWDEVPUtils.insertNodeAt = function(prt, child, n){
		var children = FWDEVPUtils.children(prt);
		if(n < 0 || n > children.length){
			throw new Error("invalid index!");
		}else {
			prt.insertBefore(child, children[n]);
		};
	};
	
	FWDEVPUtils.hasCanvas = function(){
		return Boolean(document.createElement("canvas"));
	};
	
	FWDEVPUtils.getCanvasWithModifiedColor = function(img, hexColor, returnImage){
		if(!img) return;
		var newImage;
		var canvas = document.createElement("canvas");
		var ctx = canvas.getContext("2d");
		var originalPixels = null;
		var currentPixels = null;
		var long = parseInt(hexColor.replace(/^#/, ""), 16);
		var hexColorRGB = {
			R: (long >>> 16) & 0xff,
			G: (long >>> 8) & 0xff,
			B: long & 0xff
		};
		
		canvas.style.position = "absolute";
		canvas.style.left = "0px";
		canvas.style.top = "0px";
		canvas.style.margin = "0px";
		canvas.style.padding = "0px";
		canvas.style.maxWidth = "none";
		canvas.style.maxHeight = "none";
		canvas.style.border = "none";
		canvas.style.lineHeight = "1";
		canvas.style.backgroundColor = "transparent";
		canvas.style.backfaceVisibility = "hidden";
		canvas.style.webkitBackfaceVisibility = "hidden";
		canvas.style.MozBackfaceVisibility = "hidden";	
		canvas.style.MozImageRendering = "optimizeSpeed";	
		canvas.style.WebkitImageRendering = "optimizeSpeed";
		canvas.width = img.width;
		canvas.height = img.height;
		
		ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, img.width, img.height);
		originalPixels = ctx.getImageData(0, 0, img.width, img.height);
		currentPixels = ctx.getImageData(0, 0, img.width, img.height);

        for(var I = 0, L = originalPixels.data.length; I < L; I += 4){
            if(currentPixels.data[I + 3] > 0) // If it's not a transparent pixel
            {
                currentPixels.data[I] = originalPixels.data[I] / 255 * hexColorRGB.R;
                currentPixels.data[I + 1] = originalPixels.data[I + 1] / 255 * hexColorRGB.G;
                currentPixels.data[I + 2] = originalPixels.data[I + 2] / 255 * hexColorRGB.B;
            }
        }
		
		ctx.globalAlpha = .5;
        ctx.putImageData(currentPixels, 0, 0);
		ctx.drawImage(canvas, 0, 0);
        
		if(returnImage){
			newImage = new Image();
			newImage.src = canvas.toDataURL();
		}
		return {canvas:canvas, image:newImage};
	};
	
	FWDEVPUtils.changeCanvasHEXColor = function(img, canvas, hexColor, returnNewImage){
		if(!img) return;
		var canvas = canvas;
		var ctx = canvas.getContext("2d");
		var originalPixels = null;
		var currentPixels = null;
		var long = parseInt(hexColor.replace(/^#/, ""), 16);
		var hexColorRGB = {
			R: (long >>> 16) & 0xff,
			G: (long >>> 8) & 0xff,
			B: long & 0xff
		};
		
		canvas.width = img.width;
		canvas.height = img.height;
		ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, img.width, img.height);
		originalPixels = ctx.getImageData(0, 0, img.width, img.height);
		currentPixels = ctx.getImageData(0, 0, img.width, img.height);

        for(var I = 0, L = originalPixels.data.length; I < L; I += 4){
            if(currentPixels.data[I + 3] > 0) // If it's not a transparent pixel
            {
                currentPixels.data[I] = originalPixels.data[I] / 255 * hexColorRGB.R;
                currentPixels.data[I + 1] = originalPixels.data[I + 1] / 255 * hexColorRGB.G;
                currentPixels.data[I + 2] = originalPixels.data[I + 2] / 255 * hexColorRGB.B;
            }
        }
		
		ctx.globalAlpha = .5;
        ctx.putImageData(currentPixels, 0, 0);
		ctx.drawImage(canvas, 0, 0);
		
		if(returnNewImage){
			var newImage = new Image();
			newImage.src = canvas.toDataURL();
			return newImage;
		}
    }
	

	//###################################//
	/* DOM geometry */
	//##################################//
	FWDEVPUtils.hitTest = function(target, x, y){
		var hit = false;
		if(!target) throw Error("Hit test target is null!");
		var rect = target.getBoundingClientRect();
		
		if(x >= rect.left && x <= rect.left +(rect.right - rect.left) && y >= rect.top && y <= rect.top + (rect.bottom - rect.top)) return true;
		return false;
	};
	
	FWDEVPUtils.getScrollOffsets = function(){
		//all browsers
		if(window.pageXOffset != null) return{x:window.pageXOffset, y:window.pageYOffset};
		
		//ie7/ie8
		if(document.compatMode == "CSS1Compat"){
			return({x:document.documentElement.scrollLeft, y:document.documentElement.scrollTop});
		}
	};
	
	FWDEVPUtils.getViewportSize = function(){
		if(FWDEVPUtils.hasPointerEvent && navigator.msMaxTouchPoints > 1){
			return {w:document.documentElement.clientWidth || window.innerWidth, h:document.documentElement.clientHeight || window.innerHeight};
		}
		
		if(FWDEVPUtils.isMobile) return {w:window.innerWidth, h:window.innerHeight};
		return {w:document.documentElement.clientWidth || window.innerWidth, h:document.documentElement.clientHeight || window.innerHeight};
	};
	
	FWDEVPUtils.getViewportMouseCoordinates = function(e){
		var offsets = FWDEVPUtils.getScrollOffsets();
		
		if(e.touches){
			return{
				screenX:e.touches[0] == undefined ? e.touches.pageX - offsets.x :e.touches[0].pageX - offsets.x,
				screenY:e.touches[0] == undefined ? e.touches.pageY - offsets.y :e.touches[0].pageY - offsets.y
			};
		}
		
		return{
			screenX: e.clientX == undefined ? e.pageX - offsets.x : e.clientX,
			screenY: e.clientY == undefined ? e.pageY - offsets.y : e.clientY
		};
	};
	
	FWDEVPUtils.hexToRgb = function(hex){
		 // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
		var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
		hex = hex.replace(shorthandRegex, function(m, r, g, b) {
			return r + r + g + g + b + b;
		});

		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		result = result ? {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16)
		} : null;
		
		return "rgb(" + result.r  + "," + result.g + "," + result.b + ")";
	};
	

	//###################################//
	/* Browsers test */
	//##################################//
	FWDEVPUtils.hasPointerEvent = (function(){
		return Boolean(window.navigator.msPointerEnabled) || Boolean(window.navigator.pointerEnabled);
	}());
	
	FWDEVPUtils.isMobile = (function (){
		if((FWDEVPUtils.hasPointerEvent && navigator.msMaxTouchPoints > 1) || (FWDEVPUtils.hasPointerEvent && navigator.maxTouchPoints > 1)) return true;
		var agents = ['android', 'webos', 'iphone', 'ipad', 'blackberry', 'kfsowi'];
	    for(i in agents) {
	    	 if(navigator.userAgent.toLowerCase().indexOf(agents[i]) != -1) {
	            return true;
	        }
	    }
	    if(navigator.platform.toLowerCase() === 'macintel' && navigator.maxTouchPoints > 1 && !window.MSStream) return true;
	    return false;
	}());
	
	FWDEVPUtils.isAndroid = (function(){
		 return (navigator.userAgent.toLowerCase().indexOf("android".toLowerCase()) != -1);
	}());
	
	FWDEVPUtils.hasWEBGL = (function(){
		try{
			var canvas = document.createElement( 'canvas' ); 
			return !! window.WebGLRenderingContext && ( 
				 canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' ) );
		   }catch( e ) { return false; } 
	}());
	
	FWDEVPUtils.isLocal = (function(){
		if(document.location.protocol == "file:"){
			return true;
		}else{
			return false;
		}
	}());
	
	FWDEVPUtils.isIOS = (function(){
		return navigator.userAgent.match(/(iPad|iPhone|iPod)/g);
	}());
	
	FWDEVPUtils.isSafari = (function(){
		return navigator.userAgent.toLowerCase().indexOf('safari') != -1 && navigator.userAgent.toLowerCase().indexOf('chrome') == -1;
	}());
	
	FWDEVPUtils.isOpera = (function(){
		return navigator.userAgent.toLowerCase().indexOf('opr') != -1;
	}());
	
	FWDEVPUtils.isFirefox = (function(){
		return navigator.userAgent.toLowerCase().indexOf('firefox') != -1;
	}());
	
	FWDEVPUtils.isIEWebKit = (function(){
		return Boolean(document.documentElement.msRequestFullscreen);
	}());
	
	FWDEVPUtils.isIE = (function(){
		var isIE = Boolean(navigator.userAgent.toLowerCase().indexOf('msie') != -1) || Boolean(navigator.userAgent.toLowerCase().indexOf('edge') != -1);
		return isIE || Boolean(document.documentElement.msRequestFullscreen);
	}());
	
	FWDEVPUtils.isIEAndLessThen9 = (function(){
		return Boolean(navigator.userAgent.toLowerCase().indexOf("msie 7") != -1) || Boolean(navigator.userAgent.toLowerCase().indexOf("msie 8") != -1);
	}());

	FWDEVPUtils.isChrome = (function(){
		if(FWDEVPUtils.isIE) return false;
		var t = navigator.userAgent.toLowerCase();
		if(t.match(/browser/ig)) return;
		return t.match(/chrome/ig);
	}());
	
	FWDEVPUtils.isIE7 = (function(){
		return Boolean(navigator.userAgent.toLowerCase().indexOf("msie 7") != -1);
	}());
	
	FWDEVPUtils.isApple = (function(){
		return Boolean(navigator.appVersion.toLowerCase().indexOf('mac') != -1);
	}());
	
	FWDEVPUtils.IOS = (function(){
		return /iPad|iPhone|iPod/.test(navigator.platform)|| (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
	}());
	
	FWDEVPUtils.isIphone = (function(){
		return navigator.userAgent.match(/(iPhone|iPod)/g);
	}());


	FWDEVPUtils.hasFullScreen = (function(){
		return FWDEVPUtils.dumy.requestFullScreen || FWDEVPUtils.dumy.mozRequestFullScreen || FWDEVPUtils.dumy.webkitRequestFullScreen || FWDEVPUtils.dumy.msieRequestFullScreen;
	}());
	
	function get3d(){
	    var properties = ['transform', 'msTransform', 'WebkitTransform', 'MozTransform', 'OTransform', 'KhtmlTransform'];
	    var p;
	    var position;
	    while (p = properties.shift()) {
	       if (typeof FWDEVPUtils.dumy.style[p] !== 'undefined') {
	    	   FWDEVPUtils.dumy.style.position = "absolute";
	    	   position = FWDEVPUtils.dumy.getBoundingClientRect().left;
	    	   FWDEVPUtils.dumy.style[p] = 'translate3d(500px, 0px, 0px)';
	    	   position = Math.abs(FWDEVPUtils.dumy.getBoundingClientRect().left - position);
	    	   
	           if(position > 100 && position < 900){
	        	   try{document.documentElement.removeChild(FWDEVPUtils.dumy);}catch(e){}
	        	   return true;
	           }
	       }
	    }
	    try{document.documentElement.removeChild(FWDEVPUtils.dumy);}catch(e){}
	    return false;
	};
	
	function get2d(){
	    var properties = ['transform', 'msTransform', 'WebkitTransform', 'MozTransform', 'OTransform', 'KhtmlTransform'];
	    var p;
	    while (p = properties.shift()) {
	       if (typeof FWDEVPUtils.dumy.style[p] !== 'undefined') {
	    	   return true;
	       }
	    }
	    try{document.documentElement.removeChild(FWDEVPUtils.dumy);}catch(e){}
	    return false;
	};
	

	//###############################################//
	/* Media. */
	//###############################################//
	FWDEVPUtils.volumeCanBeSet = (function(){
		var soundTest_el = document.createElement("audio");
		if(!soundTest_el) return;
		soundTest_el.volume = 0;
		return soundTest_el.volume == 0 ? true : false;
	}());
	
	
	FWDEVPUtils.getVideoFormat = (function(){
		var video  =  document.createElement("video");
		if(!video.canPlayType) return;
		var extention_str;
		if(video.canPlayType("video/mp4") == "probably" || video.canPlayType("video/mp4") == "maybe"){
			extention_str = ".mp4";
		}else if(video.canPlayType("video/ogg") == "probably" || video.canPlayType("video/ogg") == "maybe"){
			extention_str = ".ogg";
		}else if(video.canPlayType("video/webm") == "probably" || video.canPlayType("video/webm") == "maybe"){
			extention_str = ".webm";
		}
		video = null;
		return extention_str;
	})();
	
	
	//###############################################//
	/* Various utils */
	//###############################################//
	FWDEVPUtils.onReady =  function(callbalk){
		if (document.addEventListener) {
			window.addEventListener("DOMContentLoaded", function(){
				FWDEVPUtils.checkIfHasTransofrms();
				FWDEVPUtils.hasFullScreen = FWDEVPUtils.checkIfHasFullscreen();
				setTimeout(callbalk, 100);
			});
		}else{
			document.onreadystatechange = function () {
				FWDEVPUtils.checkIfHasTransofrms();
				FWDEVPUtils.hasFullScreen = FWDEVPUtils.checkIfHasFullscreen();
				if (document.readyState == "complete") setTimeout(callbalk, 100);
			};
		 }
	};
	
	FWDEVPUtils.checkIfHasTransofrms = function(){
		document.documentElement.appendChild(FWDEVPUtils.dumy);
		FWDEVPUtils.hasTransform3d = get3d();
		FWDEVPUtils.hasTransform2d = get2d();
		FWDEVPUtils.isReadyMethodCalled_bl = true;
	};
	
	FWDEVPUtils.checkIfHasFullscreen = function(){
		return Boolean(document.documentElement.requestFullScreen
		|| document.documentElement.mozRequestFullScreen
		|| document.documentElement.webkitRequestFullScreen
		|| document.documentElement.msRequestFullscreen);
	};

	FWDEVPUtils.smpBtnNPos = function(){
		FWDEVPSimpleButton.prototype.hasT3D = false;
		FWDEVPSimpleButton.prototype.hasT2D = false;
	}

	FWDEVPUtils.cmpBtnNPos = function(){
		FWDEVPComplexButton.prototype.hasT3D = false;
		FWDEVPComplexButton.prototype.hasT2D = false;
	}
	
	FWDEVPUtils.disableElementSelection = function(e){
		try{e.style.userSelect = "none";}catch(e){};
		try{e.style.MozUserSelect = "none";}catch(e){};
		try{e.style.webkitUserSelect = "none";}catch(e){};
		try{e.style.khtmlUserSelect = "none";}catch(e){};
		try{e.style.oUserSelect = "none";}catch(e){};
		try{e.style.msUserSelect = "none";}catch(e){};
		try{e.msUserSelect = "none";}catch(e){};
		e.onselectstart = function(){return false;};
	};
	
	FWDEVPUtils.getUrlArgs = function urlArgs(string){
		var args = {};
		var query = string.substr(string.indexOf("?") + 1) || location.search.substring(1);
		query = query.replace(/(\?*)(\/*)/g, "");
		var pairs = query.split("&");
		for(var i=0; i< pairs.length; i++){
			var pos = pairs[i].indexOf("=");
			var name = pairs[i].substring(0,pos);
			var value = pairs[i].substring(pos + 1);
			value = decodeURIComponent(value);
			args[name] = value;
		}
		return args;
	};
	
	FWDEVPUtils.getHashUrlArgs = function urlArgs(string){
		var args = {};
		var query = string.substr(string.indexOf("#") + 1) || location.search.substring(1);
		query = query.replace(/(\?*)(\/*)/g, "");
		var pairs = query.split("&");
		for(var i=0; i< pairs.length; i++){
			var pos = pairs[i].indexOf("=");
			var name = pairs[i].substring(0,pos);
			var value = pairs[i].substring(pos + 1);
			value = decodeURIComponent(value);
			args[name] = value;
		}
		return args;
	};

	
	FWDEVPUtils.validateEmail = function(mail){  
		if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)){  
			return true;  
		}  
		return false;  
    }; 
    
	
	FWDEVPUtils.isReadyMethodCalled_bl = false;
	
	window.FWDEVPUtils = FWDEVPUtils;
}(window));/**
 * Easy Video Player PACKAGED v9.1
 * Video screen/video element.
 *
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © 2006 All Rights Reserved.
 */
(function(window){

	var FWDEVPVideoScreen = function(prt, backgroundColor_str, volume){

		'use strict';
		
		var _s = this;
		var prototype = FWDEVPVideoScreen.prototype;
	
		_s.backgroundColor_str = backgroundColor_str;
		_s.controllerHeight = prt._d.controllerHeight;
		_s.sW = 0;
		_s.sH = 0;
		_s.lastPercentPlayed = 0;
		_s.volume = volume;
		_s.curDuration = 0;
		_s.countNormalMp3Errors = 0;
		_s.countShoutCastErrors = 0;
		_s.maxShoutCastCountErrors = 5;
		_s.maxNormalCountErrors = 1;
		_s.disableClickForAWhileId_to;
		_s.greenScreenTolerance = prt._d.greenScreenTolerance;
		_s.hasError_bl = true;
		_s.isStopped_bl = true;
		_s.currentSession = null;
		_s.isMobile_bl = FWDEVPUtils.isMobile;
		

		//###############################################//
		/* init */
		//###############################################//
		_s.init = function(){
			_s.setupVideo();
			_s.setBkColor(_s.backgroundColor_str);
			_s.testVr();
		};
	

		//###############################################//
		/* Setup audio element */
		//##############################################//
		_s.setupVideo = function(){
			if(_s.video_el == null){
				_s.video_el = document.createElement("video");
				_s.screen.className = 'video-screen-holder';
				_s.screen.appendChild(_s.video_el);
				_s.video_el.controls = false;
				_s.video_el.style.position = "absolute";
				_s.video_el.style.left = "0px";
				_s.video_el.style.top = "0px";
				_s.video_el.style.width = "100%";
				_s.video_el.style.height = "100%";
				_s.video_el.style.margin = "0px";
				_s.video_el.style.padding = "0px";
				_s.video_el.style.maxWidth = "none";
				_s.video_el.style.maxHeight = "none";
				_s.video_el.style.border = "none";
				_s.video_el.style.lineHeight = "0";
				_s.video_el.style.msTouchAction = "none";

				if(prt.isAdd_bl){
					_s.setPlaybackRate(1);
				}else{
					_s.setPlaybackRate(prt._d.defaultPlaybackRate_ar[prt._d.startAtPlaybackIndex]);
				}
				_s.screen.appendChild(_s.video_el);

				if(!prt._d.playsinline && FWDEVPUtils.isIOS){
					prt._d.subtitles_ar.forEach(function(el, index){
						if(el.source != 'none'){
							const track = document.createElement('track');
							var curTrackIndex = Math.abs((prt._d.startAtSubtitle - prt._d.subtitles_ar.length)) - 1;

							track.kind = 'subtitles';
							track.label = el.label;
							
							track.src = el.source; // Path to the VTT subtitle file
						
							
							if(index == curTrackIndex){
								track.default = true;
								track.mode = "showing";
								
							}else{
								track.mode = "disabled";
							}

							// Add the track to the video element
							_s.video_el.appendChild(track);
						}
					});
				
				}
				
			}

			_s.video_el.volume = _s.volume;
			if(prt.displayType == FWDEVPlayer.BACKGROUND_VIDEO || prt._d.autoPlay_bl){
				_s.video_el.muted = true;
			}

			if(prt.is360 || prt._d.playsinline){
				_s.video_el.setAttribute("playsinline", "");
			}else{
				try{
					_s.video_el.removeAttribute('playsinline');
				}catch(e){

				}
			}
			
			_s.video_el.addEventListener("error", _s.errorHandler);
			_s.video_el.addEventListener("progress", _s.updateProgress);
			_s.video_el.addEventListener("timeupdate", _s.updateVideo);
			_s.video_el.addEventListener("pause", _s.pauseHandler);
			_s.video_el.addEventListener("play", _s.playHandler);
			if(!FWDEVPUtils.isIE){
				_s.video_el.addEventListener("waiting", _s.startToBuffer);
			}
			_s.video_el.addEventListener("playing", _s.stopToBuffer);
			_s.video_el.addEventListener("canplaythrough", _s.stopToBuffer);
			_s.video_el.addEventListener("canplay", _s.canPlayStart);
			_s.video_el.addEventListener("ended", _s.endedHandler);
			_s.video_el.addEventListener("loadedmetadata", _s.metaDataHandler);
			_s.video_el.removeEventListener("canplay", _s.canPlayLoop);
			
		};	

		_s.destroyVideo = function(){
			if(_s.video_el ){
			
				_s.video_el.removeEventListener("error", _s.errorHandler);		
				_s.video_el.removeEventListener("progress", _s.updateProgress);
				_s.video_el.removeEventListener("timeupdate", _s.updateVideo);
				_s.stopToUpdateSubtitles();
				_s.video_el.removeEventListener("pause", _s.pauseHandler);
				_s.video_el.removeEventListener("play", _s.playHandler);
				if(!FWDEVPUtils.isIE){
					_s.video_el.removeEventListener("waiting", _s.startToBuffer);
				}
				_s.video_el.removeEventListener("playing", _s.stopToBuffer);
				_s.video_el.removeEventListener("canplaythrough", _s.stopToBuffer);
				_s.video_el.removeEventListener("canplay", _s.canPlayStart);
				_s.video_el.removeEventListener("ended", _s.endedHandler);
				_s.video_el.removeEventListener("loadedmetadata", _s.metaDataHandler);
				_s.video_el.src = _s.sourcePath_str;
				_s.video_el.addEventListener("canplay", _s.canPlayLoop);
				FWDAnimation.killTweensOf(_s);
				_s.setAlpha(0);
				FWDAnimation.to(_s, .6, {alpha:1, delay:.4});		
			}
		};
		
		_s.startToBuffer = function(overwrite){
			_s.dispatchEvent(FWDEVPVideoScreen.START_TO_BUFFER);
		};
		
		_s.stopToBuffer = function(){
			_s.dispatchEvent(FWDEVPVideoScreen.STOP_TO_BUFFER);
		};

		_s.metaDataHandler = function(){
			if(prt.fillEntireVideoScreen_bl) prt.resizeHandler();
		}

		_s.canPlayStart = function(){
			_s.addAudioTracks();
			if(prt.is360){
				_s.add360Vid();
				setTimeout(function(){
					_s.render();
				}, 200);
			}
		}

		_s.canPlayLoop = function(){
			if(prt.is360 && _s.isStopped_bl){
				_s.add360Vid();
				setTimeout(function(){
					_s.render();
				}, 200);
			}
		}

		_s.addAudioTracks = function(){
			if(_s.audioTracks) return;
			if(_s.video_el.audioTracks){
				_s.audioTracks = _s.video_el.audioTracks;
				var audioTracks = Array.from(_s.audioTracks);
				prt.setAudioTracks(audioTracks);
			}
		}
		

		//##########################################//
		/* Video error handler. */
		//##########################################//
		_s.errorHandler = function(e){
			if(prt.videoType_str != FWDEVPlayer.VIDEO) return
			var error_str;
			_s.hasError_bl = true;
			
			if(_s.video_el.networkState == 0){
				error_str = "Error - networkState = 0";
			}else if(_s.video_el.networkState == 1){
				error_str = "Error networkState = 1";
			}else if(_s.video_el.networkState == 3){
				error_str = "Source not found";
			}else{
				error_str = e;
			}
			
			if(window.console) window.console.log(_s.video_el.networkState);
			_s.dispatchEvent(FWDEVPVideoScreen.ERROR, {text:error_str });
		};
		

		//##############################################//
		/* Resize and position */
		//##############################################//
		_s.resizeAndPosition = function(width, height, x, y){
			if(width){
				_s.sW = width;
				_s.sH = height;
			}
			_s.setWidth(_s.sW);
			_s.setHeight(_s.sH);
			if(x){
				_s.setX(x);
				_s.setY(y);
			}
			
			_s.resizeRenderer();
			_s.resizeGR();
		};
		

		//##############################################//
		/* Set path */
		//##############################################//
		_s.setSource = function(sourcePath){
			
			_s.stopToUpdateSubtitles();

			if(prt.is360 || prt.isGR && _s.video_el){
				_s.video_el.style.visibility = "hidden";
			}
			_s.sourcePath_str = sourcePath;
			
			if(_s.video_el) _s.stop();
			if(!prt.isGR) _s.initVideo();
		};
	

		//##########################################//
		/* Play / pause / stop methods */
		//##########################################//
		_s.play = function(overwrite, reHLS){
			FWDEVPlayer.curInstance = prt;
			if(_s.isStopped_bl && prt.videoType_str != FWDEVPlayer.HLS_JS || reHLS){
				_s.initVideo();
				_s.play();
				_s.isPlaying_bl = true;
				_s.hastStaredToPlayHLS_bl = true;
				_s.startToBuffer(true);
			}else if(!_s.video_el.ended || overwrite){
				try{
					_s.hasError_bl = false;
					_s.isStopped_bl = false;
					_s.isPlaying_bl = true;
					_s.hasPlayedOnce_bl = true;
					_s.hastStaredToPlayHLS_bl = true;
					_s.video_el.play();
					_s.setVolume();
					if(FWDEVPUtils.isIE) _s.dispatchEvent(FWDEVPVideoScreen.PLAY);
				}catch(e){};
			}
			
			if(prt.is360){
				_s.add360Vid();	
				if(prt._d.videosSource_ar[prt._d.startAtVideoSource]["startWhenPlayButtonClick360DegreeVideo"]){
					_s.startVR();
				}
			}else if(prt.isGR){
				_s.addGreenScreen();
			}
		};
		
		_s.initVideo = function(){
			
			_s.isPlaying_bl = false;
			_s.hasError_bl = false;
			_s.allowScrubing_bl = false;
			_s.isStopped_bl = false;
			_s.setupVideo();
			if(!prt.is360 && !prt.isGR) _s.video_el.style.visibility = "visible";
			_s.setVolume();
			_s.video_el.src = _s.sourcePath_str;

			FWDAnimation.killTweensOf(_s);
			_s.setAlpha(0);
			FWDAnimation.to(_s, .6, {alpha:1, delay:.4});		
		}

		_s.pause = function(){
			if(_s == null || _s.isStopped_bl || _s.hasError_bl) return;
			if(!_s.video_el.ended){
				try{
					_s.video_el.pause();
					_s.isPlaying_bl = false;
					if(FWDEVPUtils.isIE) _s.dispatchEvent(FWDEVPVideoScreen.PAUSE);
				}catch(e){};
			}
		};
		
		_s.togglePlayPause = function(){
			if(_s == null) return;
			if(!_s.isSafeToBeControlled_bl) return;
			if(_s.isPlaying_bl){
				_s.pause();
			}else{
				_s.play();
			}
		};
		
		_s.pauseHandler = function(){
			if(_s.allowScrubing_bl) return;
			_s.stopGRRender();
			_s.dispatchEvent(FWDEVPVideoScreen.PAUSE);
		};
		
		_s.playHandler = function(){
			if(_s.allowScrubing_bl) return;
			_s.hastStaredToPlayHLS_bl = true;
			_s.startToUpdateSubtitles();
			if(!_s.isStartEventDispatched_bl){
				_s.dispatchEvent(FWDEVPVideoScreen.START);
				_s.isStartEventDispatched_bl = true;
			}
			if(prt.is360){
				_s.start360Render();
			}else if(prt.isGR){
				_s.startGRRender();
			}
			_s.stopToBuffer();
			_s.dispatchEvent(FWDEVPVideoScreen.PLAY);
		};
		
		_s.endedHandler = function(){
			_s.stopToUpdateSubtitles();
			_s.dispatchEvent(FWDEVPVideoScreen.PLAY_COMPLETE);
		};
		
		_s.resume = function(){
			if(_s.isStopped_bl) return;
			_s.play();
		};
		
		_s.stop = function(overwrite){
			if((_s == null || _s.video_el == null || _s.isStopped_bl) && !overwrite) return;
			_s.isPlaying_bl = false;
			_s.isStopped_bl = true;
			_s.hastStaredToPlayHLS_bl = false;
			_s.hasPlayedOnce_bl = true;
			_s.isSafeToBeControlled_bl = false;
			_s.isStartEventDispatched_bl = false;
			_s.showdVRMessage = false;
			_s.endVRSesion();
			_s.stopToUpdateSubtitles();
			_s.stop360Render();
			_s.stopGRRender();
			
			if(_s.contextGR2){
				_s.contextGR2.save();
				_s.contextGR2.globalCompositeOperation = 'copy';
				_s.contextGR2.fillStyle = 'rgba(0,0,0,0)';

				// Draw shape to cover up stuff underneath
				_s.contextGR2.fill();
				_s.contextGR2.restore();
			}
			if(_s.contains(_s.canvasGR2)) _s.removeChild(_s.canvasGR2);
			_s.destroyVideo();
			_s.dispatchEvent(FWDEVPVideoScreen.LOAD_PROGRESS, {percent:0});
			_s.dispatchEvent(FWDEVPVideoScreen.UPDATE_TIME, {curTime:"00:00" , totalTime:"00:00"});
			_s.dispatchEvent(FWDEVPVideoScreen.STOP);
			_s.stopToBuffer();
		};


		//###########################################//
		/* Check if audio is safe to be controlled */
		//###########################################//
		_s.safeToBeControlled = function(){
			
			if(prt.videoType_str == FWDEVPlayer.HLS_JS && !_s.hastStaredToPlayHLS_bl) return;
			if(!_s.isSafeToBeControlled_bl){
				prt.resizeHandler();
				_s.stopToScrub();
				_s.hasHours_bl = Math.floor(_s.video_el.duration / (60 * 60)) > 0;
				_s.isPlaying_bl = true;
				_s.isSafeToBeControlled_bl = true;
				if(!prt.is360 && !prt.isGR) _s.video_el.style.visibility = "visible";
				_s.dispatchEvent(FWDEVPVideoScreen.SAFE_TO_SCRUBB);
			}
		};

	
		//###########################################//
		/* Update progress */
		//##########################################//
		_s.updateProgress = function(){
			if(prt.videoType_str == FWDEVPlayer.HLS_JS && !_s.hastStaredToPlayHLS_bl) return;
			var buffered;
			var percentLoaded = 0;
			
			if(_s.video_el.buffered.length > 0){
				buffered = _s.video_el.buffered.end(_s.video_el.buffered.length - 1);
				percentLoaded = buffered.toFixed(1)/_s.video_el.duration.toFixed(1);
				if(isNaN(percentLoaded) || !percentLoaded) percentLoaded = 0;
			}
			
			if(percentLoaded == 1) _s.video_el.removeEventListener("progress", _s.updateProgress);
			
			_s.dispatchEvent(FWDEVPVideoScreen.LOAD_PROGRESS, {percent:percentLoaded});
		};
		

		//##############################################//
		/* Update audio */
		//#############################################//
		_s.updateVideo = function(){
			var percentPlayed; 
			if (!_s.allowScrubing_bl) {
				percentPlayed = _s.video_el.currentTime /_s.video_el.duration;
				_s.dispatchEvent(FWDEVPVideoScreen.UPDATE, {percent:percentPlayed});
			}
			
			if(_s.video_el.currentTime && _s.video_el.currentTime >= 0.1) _s.safeToBeControlled();
		
			var totalTime = FWDEVPUtils.formatTime(_s.video_el.duration);
			var curTime = FWDEVPUtils.formatTime(_s.video_el.currentTime);
			
			if(!isNaN(_s.video_el.duration)){
				_s.dispatchEvent(FWDEVPVideoScreen.UPDATE_TIME, {curTime: curTime, totalTime:totalTime, seconds:Math.round(_s.video_el.currentTime), totalTimeInSeconds:Math.round(_s.video_el.duration)});
			}else{
				_s.dispatchEvent(FWDEVPVideoScreen.UPDATE_TIME, {curTime:"00:00" , totalTime:"00:00", seconds:0});
			}
			
			_s.lastPercentPlayed = percentPlayed;
			_s.curDuration = curTime;
		};
		

		//###############################################//
		/* Scrub */
		//###############################################//
		_s.startToScrub = function(){
			_s.allowScrubing_bl = true;
		};
		
		_s.stopToScrub = function(){
			_s.allowScrubing_bl = false;
		};
		
		_s.scrubbAtTime = function(duration){
			_s.video_el.currentTime = duration;
			var totalTime = FWDEVPUtils.formatTime(_s.video_el.duration);
			var curTime = FWDEVPUtils.formatTime(_s.video_el.currentTime);
			_s.dispatchEvent(FWDEVPVideoScreen.UPDATE_TIME, {curTime: curTime, totalTime:totalTime});
		}
		
		_s.scrub = function(percent, e){
			if(e) _s.startToScrub();
			try{
				_s.video_el.currentTime = _s.video_el.duration * percent;
				var totalTime = FWDEVPUtils.formatTime(Math.round(_s.video_el.duration));
				var curTime = FWDEVPUtils.formatTime(Math.round(_s.video_el.currentTime));
				_s.dispatchEvent(FWDEVPVideoScreen.UPDATE_TIME, {curTime: curTime, totalTime:totalTime});
			}catch(e){}
		};
		

		//###############################################//
		/* replay */
		//###############################################//
		_s.replay = function(){
			_s.scrub(0);
			_s.play();
		};
		
		
		_s.setPlaybackRate = function(rate){
			if(!_s.video_el) return;
			_s.video_el.defaultPlaybackRate = rate;
			_s.video_el.playbackRate = rate;
		}
		

		//###############################################//
		/* Volume */
		//###############################################//
		_s.setVolume = function(vol){
			if(vol !=  undefined) _s.volume = vol;
			if(_s.video_el){
				_s.video_el.volume = _s.volume;
				if(vol) _s.video_el.muted = false;
			}
		};
		

		// Set audio track.
		_s.setAudioTrack = function(id){
			var curAudioTrack = _s.audioTracks[id];
			for (var i = 0; i < _s.audioTracks.length; i++) {
				var el = _s.audioTracks[i];
				if(i == id){
					el.enabled = true;
				}else{
					el.enabled = false;
				}
			}
		}
		
		
		//##################################################//
		/* Subtitles */
		//##################################################//
		_s.stopToUpdateSubtitles = function(){
			clearInterval(_s.startToUpdateSubtitleId_int);	
		}
		
		_s.startToUpdateSubtitles = function(){
			clearInterval(_s.startToUpdateSubtitleId_int);
			_s.startToUpdateSubtitleId_int = setInterval(_s.updateSubtitleHandler, 10);
		}
		
		_s.updateSubtitleHandler = function(){
			_s.dispatchEvent(FWDEVPVideoScreen.UPDATE_SUBTITLE, {curTime:_s.video_el.currentTime});
		}
		

		//###############################################//
		/* Setup green screen */
		//###############################################//
		_s.addGreenScreen = function(){
			if(!_s.canvasGR2){
				_s.canvasGR1 = new FWDEVPDO('canvas');
				_s.contextGR1 = _s.canvasGR1.screen.getContext('2d');
				_s.canvasGR2 = new FWDEVPDO('canvas');
				_s.contextGR2 = _s.canvasGR2.screen.getContext('2d');
			}
			_s.video_el.style.visibility = "hidden";
			_s.renderFR();
		}
		
		_s.startGRRender = function(){
			_s.isGRRendering_bl = true;
			if(FWDEVPUtils.isLocal) return;
			if(!_s.contains(_s.canvasGR2)) _s.addChild(_s.canvasGR2);
			cancelAnimationFrame(_s.requestId);
			_s.requestId = requestAnimationFrame(_s.renderFR);
		}
		
		_s.stopGRRender = function(){
			_s.isGRRendering_bl = false;
			cancelAnimationFrame(_s.requestId);
		}
		
		_s.renderFR = function(){
			if(FWDEVPUtils.isLocal) return;
			if(_s.isGRRendering_bl) cancelAnimationFrame(_s.requestId);
			
			if(_s.contextGR1){
				if(_s.video_el.videoWidth != 0 && _s.prevCurCavasGRWidth != _s.video_el.videoWidth){
					_s.canvasGR1.screen.width = _s.video_el.videoWidth;
					_s.canvasGR1.screen.height = _s.video_el.videoHeight;
					_s.canvasGR2.screen.width = _s.video_el.videoWidth;
					_s.canvasGR2.screen.height = _s.video_el.videoHeight;
				}
				_s.prevCurCavasGRWidth = _s.video_el.videoWidth;
				
				_s.contextGR1.drawImage(_s.video_el, 0, 0, _s.canvasGR1.screen.width, _s.canvasGR1.screen.height);
				var imageData = _s.contextGR1.getImageData(0, 0,  _s.canvasGR1.screen.width, _s.canvasGR1.screen.height);
				var _d = imageData.data;
				
				// iterate over all pixels
				for(var i = 0, n = _d.length; i < n; i += 4) {
				var diff = Math.abs(_d[i] - _d[0]) + Math.abs(_d[i+1] - _d[1]) + Math.abs(_d[i+2] - _d[2]);
					if(diff < _s.greenScreenTolerance) {
						_d[i + 3] = 0;
					}
				}
				_s.contextGR2.putImageData(imageData, 0, 0);
			}
			
			_s.resizeGR();
			
			_s.requestId = requestAnimationFrame(_s.renderFR);
		}
		
		_s.resizeGR =  function(){
			if(prt.isGR && _s.canvasGR2){
				_s.canvasGR2.setWidth(_s.sW);
				_s.canvasGR2.setX(Math.round((prt.sW - _s.sW)/2));
				_s.canvasGR2.setY(Math.round((prt.sH - _s.canvasGR2.getHeight())/2));
			}
		}
			
		
		//###############################################//
		/* Setup 360 vid */
		//###############################################//
		_s.start360Render = function(){
			if(!_s.renderer) return;
			_s.is360Rendering_bl = true;
			_s.video_el.style.visibility = 'hidden';
			_s.renderer.setAnimationLoop( _s.render );
		}
		
		_s.stop360Render = function(){
			if(!_s.renderer) return;
			_s.is360Rendering_bl = false;

			try{
				_s.screen.removeChild(_s.renderer.domElement);
			}catch(e){};

			_s.pause360Render();

			_s.videoTexture.dispose();			
			_s.renderer.dispose();
			_s.renderer = null;
			_s.cameraL = null;
			_s.scene = null
		}

		_s.pause360Render = function(){
			_s.renderer.setAnimationLoop(null); 
		}

		_s.add360Vid = function(){
			if(!window['THREE'] || !THREE.OrbitControls) return;
			if(prt.controller_do.vrButton_do){
				prt.controller_do.enableVrButton();
			}

			if(_s.cameraL) return;
		
			try{
				_s.screen.removeChild(_s.renderer.domElement);
			}catch(e){};
			
			// Camera.
			_s.cameraL = new THREE.PerspectiveCamera(45, _s.sW / _s.sH, 0.1, 10000);
			_s.cameraL.aspect = _s.sW / _s.sH;
			_s.cameraL.position.set(0,0,500)
		

			// Video texture.
			if(!_s.videoTexture){
				_s.video_el.setAttribute('crossorigin', 'anonymous');
				_s.videoTexture = new THREE.VideoTexture(_s.video_el);	
			}

			// Geometry.
			_s.sphereGeopmetry = new THREE.SphereGeometry(500, 60, 40);
			_s.sphereMat = new THREE.MeshBasicMaterial({map: _s.videoTexture});
			_s.sphereMat.side = THREE.BackSide;
			_s.sphere = new THREE.Mesh(_s.sphereGeopmetry, _s.sphereMat);
			_s.sphere.scale.x = -1;
			_s.sphere.rotateY(prt._d.videosSource_ar[prt._d.startAtVideoSource]["rotationY360DegreeVideo"] * Math.PI/180);

			// Renderer
			_s.renderer = new THREE.WebGLRenderer({antialias:true});
			_s.renderer.setPixelRatio(window.devicePixelRatio);
			_s.renderer.xr.enabled = true;
			_s.renderer.xr.setReferenceSpaceType('local');
		
			_s.screen.appendChild(_s.renderer.domElement);

			// Scene.
			_s.scene = new THREE.Scene();
			_s.scene.background = new THREE.Color(0x000000);
			_s.scene.add(_s.cameraL);
			_s.scene.add(_s.sphere);

			// Controls.
			_s.controls = new THREE.OrbitControls(_s.cameraL, prt.dClk_do.screen);
			_s.controls.enableDamping = true;
			_s.controls.enableZoom = true; 
			_s.controls.dampingFactor = 0.25;
			_s.controls.maxDistance = 500;
			_s.controls.minDistance = 500;
			_s.controls.maxAzimuthAngle = Infinity;
			_s.controls.enabled = true;
			
			_s.render();
		}

		
		_s.render = function(){
			if(!_s.cameraL) return;
			
			_s.resizeRenderer();
			_s.renderer.render(_s.scene, _s.cameraL);
			_s.controls.update();
		}

		_s.resizeRenderer = function(){
			if(!_s.cameraL) return;
			var w = _s.sW;
			var h = _s.sH;

			if(_s.currentSession){
				w = window.innerWidth;
				h = window.innerHeight;
			}

			// Vr camera.
			_s.renderer.setSize(w, h);
			_s.renderer.domElement.style.width = '100%';
			_s.renderer.domElement.style.height = '100%';
			_s.cameraL.aspect = w / h;
			_s.cameraL.updateProjectionMatrix();
		}


		// VR.
		_s.showVrMessage = function(){
			var msg = _s.vrMessage + ' - <a href="https://immersiveweb.dev/" target="_blank">read more about WebXR</a>';
			if(prt.main_do) prt.main_do.addChild(prt.info_do);
			if(prt.info_do) prt.info_do.showText(msg);
			prt.dispatchEvent(FWDEVPlayer.ERROR, {error:msg});
		}

		_s.startVR = function(){

			if(!_s.vrSupport_bl && !_s.showdVRMessage){
				_s.showVrMessage();
				_s.showdVRMessage = true;
				return;
			}
			
			
			if(window['FWDRL'] && FWDRL.isFullScreen){
				FWDRL.fullScreenInstance.goNormalScreen();
				return;
			}

			if(prt.isFullScreen_bl){
				prt.goNormalScreen();
				return;
			}
		
			if(_s.currentSession) return;
			if( 'xr' in navigator ) {
				if( _s.currentSession === null) {

					// WebXR's requestReferenceSpace only works if the corresponding feature
					// was requested at session creation time. For simplicity, just ask for
					// the interesting ones as optional features, but be aware that the
					// requestReferenceSpace call will fail if it turns out to be unavailable.
					// ('local' is always available for immersive sessions and doesn't need to
					// be requested separately.)

					var sessionInit = { optionalFeatures: [ 'local-floor', 'bounded-floor', 'hand-tracking', 'layers' ] };
					navigator.xr.requestSession( 'immersive-vr', sessionInit ).then( onSessionStarted );
				
				}else{
					_s.currentSession.end();
				}
			}

			async function onSessionStarted(session) {
				_s.resizeRenderer();
				session.addEventListener('end', onSessionEnded);
				session.isImmersive = true;
				await _s.renderer.xr.setSession(session);
				_s.currentSession  = session;
				prt.dispatchEvent(FWDEVPlayer.VR_START);
				window.scrollTo(0,0);
			}

			function onSessionEnded( /*event*/ ) {
				_s.currentSession.removeEventListener('end', onSessionEnded );
				prt.dispatchEvent(FWDEVPlayer.VR_STOP);
				_s.currentSession = null;
			}
		}	


		_s.endVRSesion =  async function(){
			if(_s.currentSession){
				await _s.currentSession.end();
			}
		}

		_s.testVr = function(){
			if(navigator.xr){

				navigator.xr.isSessionSupported('immersive-vr').then(function(supported){
					if(supported){
						 _s.vrSupport_bl = true;
						 _s.vrMessage = undefined;
					}else{
						 _s.vrSupport_bl = false;
						 _s.vrMessage = 'VR not supported';
					}
				}).catch(function(){
					_s.vrSupport_bl = false;
					_s.vrMessage = 'VR not allowed';
				});

			}else{
				 _s.vrSupport_bl = false;
				 _s.vrMessage = 'VR not supported';
			}
		}
	
		_s.init();
	};


	/* set prototype */
	FWDEVPVideoScreen.setPrototype = function(){
		FWDEVPVideoScreen.prototype = new FWDEVPDO("div");
	};
	
	FWDEVPVideoScreen.UPDATE_SUBTITLE = "updateSubtitle";
	FWDEVPVideoScreen.ERROR = "error";
	FWDEVPVideoScreen.UPDATE = "update";
	FWDEVPVideoScreen.UPDATE_TIME = "updateTime";
	FWDEVPVideoScreen.SAFE_TO_SCRUBB = "safeToControll";
	FWDEVPVideoScreen.LOAD_PROGRESS = "loadProgress";
	FWDEVPVideoScreen.START = "start";
	FWDEVPVideoScreen.PLAY = "play";
	FWDEVPVideoScreen.PAUSE = "pause";
	FWDEVPVideoScreen.STOP = "stop";
	FWDEVPVideoScreen.PLAY_COMPLETE = "playCompvare";
	FWDEVPVideoScreen.START_TO_BUFFER = "startToBuffer";
	FWDEVPVideoScreen.STOP_TO_BUFFER = "stopToBuffer";


	window.FWDEVPVideoScreen = FWDEVPVideoScreen;

}(window));
/**
 * Easy Video Player PACKAGED v9.1
 * Vimeo screen.
 *
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © 2006 All Rights Reserved.
 */
(function(window){

	var FWDEVPVimeoScreen = function(prt, volume){

		'use strict';
		
		var _s = this;	
		_s.lastQuality_str = "auto";
		_s.volume = volume;
		_s.controllerHeight = prt._d.controllerHeight;
		_s.hasBeenCreatedOnce_bl = true;
		_s.isStopped_bl = true;
		_s.isPausedInEvent_bl = true;
		_s.isShowed_bl = true;
		_s.isReady_bl = false;
		_s.isMobile_bl = FWDEVPUtils.isMobile;
		
		
		//###############################################//
		/* init */
		//###############################################//
		_s.init = function(){
			_s.hasT3D = false;
			_s.hasT2D = false;
		
			_s.setBackfaceVisibility();
			prt.main_do.addChildAt(_s, 1);
			_s.resizeAndPosition();
			_s.setupVideo();
			_s.setupDisableClick();
			_s.setBkColor("#000000");
		};
	
		
		//#####################################//
		/* Setup disable click */
		//#####################################//
		_s.setupDisableClick = function(){
			_s.disableClick_do = new FWDEVPDO("div");
			//_s.disableClick_do.setBkColor('rgba(255,0,0,.4');
			_s.addChild(_s.disableClick_do);
		};
		
		_s.showDisable = function(){
			if(!prt.tempVidStageWidth || _s.disableClick_do.w == _s.sW) return;
			_s.disableClick_do.setWidth(prt.tempVidStageWidth);
			if(FWDEVPUtils.isIphone){	
				_s.disableClick_do.setHeight(prt.tempVidStageHeight - _s.controllerHeight);
			}else{
				_s.disableClick_do.setHeight(prt.tempVidStageHeight);
			}
		};
		
		_s.hideDisable = function(){
			if(_s.disableClick_do.w == 0) return;
			_s.disableClick_do.setWidth(0);
			_s.disableClick_do.setHeight(0);
		};
	
		//###############################################//
		/* Setup youtube video */
		//##############################################//
		_s.setupVideo = function(){
			if(_s.vimeoPlayer) return;
			_s.iframe_do = new FWDEVPDO("iframe");
			_s.iframe_do.hasT3D = false;
			_s.iframe_do.hasT2D = false;
			
			var bk = 0;
			if(prt._d.showDefaultControllerForVimeo_bl) bk = 1;

			var inl = 0;
			if(prt._d.playsinline) inl = 1;
			
			_s.iframe_do.screen.setAttribute("src", "https://player.vimeo.com/video/76979871" + "?player_id=" + prt.instanceName_str + "vimeo&playsinline=" + inl + "&muted=0&autoplay=0&background=" + bk +"");
			_s.iframe_do.screen.setAttribute("id", prt.instanceName_str + "vimeo");		
			_s.iframe_do.screen.setAttribute("frameborder", "0");
			_s.iframe_do.screen.setAttribute("allow", "fullscreen; autoplay;");
			_s.iframe_do.screen.dataset.ready = 'true';
			
			if(prt._d.autoPlay_bl){
				_s.iframe_do.screen.setAttribute("muted", "1");
			}
			_s.iframe_do.style().width = "100%";
			_s.iframe_do.style().height = "100%";
			_s.iframe_do.setBackfaceVisibility();
			_s.addChild(_s.iframe_do);

			_s.vimeoPlayer = new Vimeo.Player(_s.iframe_do.screen); 
			_s.vimeoPlayer.on('play', function(e){
				_s.playHandler();
			});
			
			_s.vimeoPlayer.on('pause', function(e){
				_s.pauseHandler();
			});
			
			_s.vimeoPlayer.on('loadProgress', function(e){
				_s.loadProgressHandler();
			});
			
			_s.vimeoPlayer.on('ended', function(e){
				_s.finishHandler();
			});
			
			_s.vimeoPlayer.on('loaded', function(e){
				_s.loadedHandler();
			});
			
			_s.vimeoPlayer.ready().then(function(){
				_s.readyHandler();
			});
			
			_s.blackOverlay_do = new FWDEVPDO("div");
			_s.blackOverlay_do.style().backgroundColor = "#000000";
			_s.blackOverlay_do.style().width = "100%";
			_s.blackOverlay_do.style().height = "100%";
			_s.addChild(_s.blackOverlay_do);
			
			//_s.setX(-5000);
		};
			
		
		//##############################################//
		/* Resize and position */
		//##############################################//
		_s.resizeAndPosition = function(){
			if(!prt.tempVidStageWidth) return;
			_s.setWidth(prt.tempVidStageWidth);
			_s.setHeight(prt.tempVidStageHeight);
		};

		
		//##############################################//
		/* Set source and initialize player */
		//##############################################//
		_s.setSource = function(sourcePath){
			if(sourcePath) _s.sourcePath_str = sourcePath;
			_s.hasError = false;
			_s.isStopped_bl = false;
			_s.stopToUpdateSubtitles();
			var wasAdd_bl = prt.wasAdd_bl;
			
			var videoId = _s.sourcePath_str.match(/[^\/]+$/i);	
			_s.vimeoPlayer.loadVideo(videoId).then(function(id){
				_s.setVolume(prt.volume);		
				if(prt._d.autoPlay_bl || prt.isAdd_bl || wasAdd_bl || prt.wasAdd_bl || (prt.lightBox_do && prt.lightBox_do.showComplete_bl)){	
					prt.play();
				}

				FWDAnimation.killTweensOf(_s);
				_s.setAlpha(0);
				FWDAnimation.to(_s, .6, {alpha:1, delay:.4});

			}).catch(function(error){
				_s.hasError = true;
				if(console) console.log(error);
				clearTimeout(_s.displayErrorId_to);
				_s.displayErrorId_to = setTimeout(function(){
					_s.dispatchEvent(FWDEVPVimeoScreen.ERROR, {text:error});
				} , 500);
			});
		};
		
		//########################################//
		/* Ready handler */
		//########################################//
		_s.readyHandler = function(){
			
			clearTimeout(_s.intitErrorId_to);
			if(_s.contains(_s.blackOverlay_do)){
				clearTimeout(_s.removeChildWithDelayId_to);
				_s.removeChildWithDelayId_to = setTimeout(function(){
					_s.removeChild(_s.blackOverlay_do);
				}, 1500);
			}
			_s.resizeAndPosition();
			
			
			if(_s.isReady_bl){
				try{
					_s.vimeoPlayer.api("setColor", '#FFFFFF');
				}catch(e){}
				if(prt.videoType_str == FWDEVPlayer.VIMEO) _s.setX(0);
				if(prt._d.autoPlay_bl) prt.play();
			
				return;
			}
			_s.isReady_bl = true;
		
			_s.dispatchEvent(FWDEVPVimeoScreen.READY);
		};
		
		_s.loadedHandler = function(){
			_s.isVideoLoaded_bl = true;
		};
		
		_s.playHandler = function(){
			
			if(_s.isStopped_bl || _s.sourcePath_str != prt.videoSource_str){
				_s.stop(true, true);
				return;
			}
			
			clearInterval(_s.startToPlayWithDelayId_to);
			clearTimeout(_s.displayErrorId_to);
			_s.isStopped_bl = false;
			_s.isSafeToBeControlled_bl = true;
			_s.startToUpdateSubtitles();
			_s.startToUpdate();
		
			_s.dispatchEvent(FWDEVPVimeoScreen.SAFE_TO_SCRUBB);
			_s.dispatchEvent(FWDEVPVimeoScreen.PLAY);
			_s.hasHours_bl = Math.floor(_s.getDuration() / (60 * 60)) > 0;
		};
		
		_s.loadProgressHandler = function(e){
			if(_s.isShowed_bl) return;
			_s.dispatchEvent(FWDEVPVimeoScreen.LOAD_PROGRESS, {percent:e.percent});
		};
		
		_s.pauseHandler = function(){
			if(!_s.isPlaying_bl ) return;
		
			_s.isPlaying_bl = false;
			clearInterval(_s.startToPlayWithDelayId_to);
			_s.dispatchEvent(FWDEVPVimeoScreen.PAUSE);
			_s.stopToUpdate();
		};
		
		_s.finishHandler = function(){
			if(prt._d.loop_bl){
				_s.stop();
				setTimeout(_s.play, 200);
			}
			_s.dispatchEvent(FWDEVPVimeoScreen.PLAY_COMPLETE);
		};
	
		//##########################################//
		/* Play / pause / stop methods */
		//##########################################//
		_s.play = function(overwrite){
			if(_s.hasError) return;
			
			_s.vimeoPlayer.play();
			
			FWDEVPlayer.curInstance = prt;
			_s.isPlaying_bl = true;
			_s.isStopped_bl = false;
			_s.hasError_bl = false;
		};

		_s.pause = function(){
			if(_s.isStopped_bl || _s.hasError_bl) return;
			//_s.isPlaying_bl = false;
			clearInterval(_s.startToPlayWithDelayId_to);
			_s.vimeoPlayer.pause();
			_s.stopToUpdate();
		};
		
		_s.togglePlayPause = function(){
			if(_s.isPlaying_bl){
				_s.pause();
			}else{
				_s.play();
			}
		};
		
		_s.resume = function(){
			if(_s.isStopped_bl) return;
			_s.play();
		};
		
		//###########################################//
		/* Updates ... */
		//###########################################//
		_s.startToUpdate = function(){
			clearInterval(_s.updateVideoId_int);
			_s.updateVideoId_int = setInterval(_s.updateVideo, 50);
		};
		
		_s.stopToUpdate = function(){
			clearInterval(_s.updateVideoId_int);
		};
		
		_s.updateVideo = function(){
		
			var percentPlayed; 
			if(!_s.vimeoPlayer){
				stopToUpdate();
				return;
			}
			
			var totalTime = FWDEVPUtils.formatTime(_s.getDuration());
			var curTime = FWDEVPUtils.formatTime(_s.getCurrentTime());
			
			percentPlayed = _s.getCurrentTime()/_s.getDuration();
			if(isNaN(percentPlayed)) percentPlayed = 0;

			if(_s.getCurrentTime() == _s.getDuration()){
				_s.finishHandler();
				return;
			} 
			
			_s.dispatchEvent(FWDEVPYoutubeScreen.UPDATE, {percent:percentPlayed});
			_s.dispatchEvent(FWDEVPVimeoScreen.UPDATE_TIME, {curTime:curTime , totalTime:totalTime, seconds:_s.getCurrentTime(), totalTimeInSeconds:_s.getCurrentTime()});
		};	
		
		//###########################################//
		/* Event handlers */
		//###########################################//	
		_s.stop = function(addEvents, o){
			clearTimeout(_s.displayErrorId_to);
			_s.isVideoLoaded_bl = false;
		
			if(_s.isStopped_bl && !o) return;
			clearInterval(_s.startToPlayWithDelayId_to);
			_s.showDisable();
			_s.stopVideo();
			_s.stopToUpdateSubtitles();
			FWDAnimation.killTweensOf(_s);
			_s.setAlpha(0);
			FWDAnimation.to(_s, .6, {alpha:1, delay:.4});
			
			_s.isPlaying_bl = false;
			_s.isStopped_bl = true;
			_s.isCued_bl = false;
			_s.allowScrubing_bl = false;
			_s.isSafeToBeControlled_bl = false;
			_s.isPausedInEvent_bl = true;
			
			_s.stopToUpdate();
			if(!addEvents){
				_s.stopVideo();
				_s.dispatchEvent(FWDEVPVimeoScreen.STOP);
				_s.dispatchEvent(FWDEVPVimeoScreen.LOAD_PROGRESS, {percent:0});
				_s.dispatchEvent(FWDEVPVimeoScreen.UPDATE_TIME, {curTime:"00:00" , totalTime:"00:00"});
			}
		};
		
		_s.destroy = function(){
			if(_s.iframe_do){
				_s.iframe_do.screen.removeAttribute("id", prt.instanceName_str + "vimeo");
				_s.removeChild(_s.iframe_do);
				_s.iframe_do.destroy();
				_s.iframe_do = null;
			}
			_s.vimeoPlayer = null;
		};
		
		_s.stopVideo = function(){
			_s.vimeoPlayer.unload().then(function() {
				// the video was unloaded
			}).catch(function(error) {
				// an error occurred
			});
			//_s.setSource(_s.sourcePath_str);
		};
		

		//########################################//
		/* Various Vimeo API methods */
		//########################################//
		_s.startToScrub = function(){
			if(!_s.isSafeToBeControlled_bl) return;
			_s.allowScrubing_bl = true;
		};
		
		_s.stopToScrub = function(){
			if(!_s.isSafeToBeControlled_bl) return;
			_s.allowScrubing_bl = false;
		};
		
		_s.scrubbAtTime = function(duration){
			//if(!_s.isSafeToBeControlled_bl) return;
		
			_s.vimeoPlayer.setCurrentTime(duration).then(function(seconds) {
				// seconds = the actual time that the player seeked to
			})
		}
		
		_s.scrub = function(percent){
			
			if(!_s.isSafeToBeControlled_bl) return;
		
			_s.vimeoPlayer.setCurrentTime(percent * _s.getDuration()).then(function(seconds) {
				// seconds = the actual time that the player seeked to
			})
		};
	
		_s.setVolume = function(vol){
			if(vol != undefined) _s.volume = vol;
			if(_s.vimeoPlayer){
				_s.vimeoPlayer.setVolume(vol);
				if(vol) _s.iframe_do.screen.removeAttribute("muted");
			} 
		};
		
		
		_s.getDuration = function(){
			if(!_s.isSafeToBeControlled_bl) return;
				_s.vimeoPlayer.getDuration().then(function(duration) {
				_s.duration = Math.round(duration);
            });
			return _s.duration;
		};
		
		_s.getCurrentTime = function(){
			if(!_s.isSafeToBeControlled_bl) return;
			_s.vimeoPlayer.getCurrentTime().then(function(time) {
               _s.currentTime = Math.round(time);
            });
			
			return _s.currentTime;
		};

	
		//##################################################//
		/* Suntitles */
		//##################################################//
		_s.stopToUpdateSubtitles = function(){
			clearInterval(_s.startToUpdateSubtitleId_int);	
		}
		
		_s.startToUpdateSubtitles = function(){
			clearInterval(_s.startToUpdateSubtitleId_int);
			_s.startToUpdateSubtitleId_int = setInterval(_s.updateSubtitleHandler, 10);
		}
		
		_s.updateSubtitleHandler = function(){
			if(!_s.getCurrentTime()) return;
			_s.dispatchEvent(FWDEVPVimeoScreen.UPDATE_SUBTITLE, {curTime:_s.getCurrentTime()});
		}
		
	
		_s.init();
	};

	/* set prototype */
	FWDEVPVimeoScreen.setPrototype = function(){
		FWDEVPVimeoScreen.prototype = new FWDEVPDO("div");
	};
	
	FWDEVPVimeoScreen.UPDATE_SUBTITLE = "updateSubtitle";
	FWDEVPVimeoScreen.SAFE_TO_SCRUBB = "safeToScrub";
	FWDEVPVimeoScreen.READY = "ready";
	FWDEVPVimeoScreen.ERROR = "initError";
	FWDEVPVimeoScreen.UPDATE = "update";
	FWDEVPVimeoScreen.UPDATE_TIME = "updateTime";
	FWDEVPVimeoScreen.LOAD_PROGRESS = "loadProgress";
	FWDEVPVimeoScreen.PLAY = "play";
	FWDEVPVimeoScreen.PAUSE = "pause";
	FWDEVPVimeoScreen.STOP = "stop";
	FWDEVPVimeoScreen.PLAY_COMPLETE = "playComplete";
	FWDEVPVimeoScreen.CUED = "cued";
	FWDEVPVimeoScreen.QUALITY_CHANGE = "qualityChange";


	window.FWDEVPVimeoScreen = FWDEVPVimeoScreen;

}(window));/**
 * Easy Video Player PACKAGED v9.1
 * Volume button.
 *
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © 2006 All Rights Reserved.
 */
(function (window){

	var FWDEVPVolumeButton = function(
			nImg,
			sPath,
			dPath,
			useHEX,
			nBC,
			sBC,
			iconCSSString1, 
			iconCSSString2, 
			normalCalssName,
			selectedCalssName
		){

		'use strict';
		
		var _s = this;
		
		_s.iconCSSString1 = iconCSSString1;
		_s.iconCSSString2 = iconCSSString2;
		_s.nImg = nImg;
		_s.sPath_str = sPath;
		_s.dPath_str = dPath;
	
		_s.toolTipLabel_str;
		
		if(_s.nImg){
			_s.totalWidth = _s.nImg.width;
			_s.totalHeight = _s.nImg.height;
		}
		
		_s.normalCalssName = normalCalssName;
		_s.selectedCalssName = selectedCalssName;
		
		_s.useHEX = useHEX;
		_s.nBC = nBC;
		_s.sBC = sBC;
		
		_s.isSetToDisabledState_bl = true;
		_s.isMobile_bl = FWDEVPUtils.isMobile;
		_s.hasPointerEvent_bl = FWDEVPUtils.hasPointerEvent;
		_s.allowToCreateSecondButton_bl = true;
		_s.useFontAwesome_bl = Boolean(_s.iconCSSString1);
	

		//##########################################//
		/* initialize _s */
		//##########################################//
		_s.init = function(){
			_s.setupMainContainers();
			_s.setNormalState(false);
			_s.setEnabledState();
		};
		

		//##########################################//
		/* setup main containers */
		//##########################################//
		_s.setupMainContainers = function(){
	
			if(_s.useFontAwesome_bl){
				_s.setOverflow('visible');
				_s.n_sdo = new FWDEVPDO("div");	
				_s.n_sdo.hasT3D = false;
				_s.n_sdo.hasT2D = false;
				_s.n_sdo.setInnerHTML(_s.iconCSSString1);
				_s.addChild(_s.n_sdo);
				
				_s.d_sdo = new FWDEVPDO("div");
				_s.d_sdo.hasT3D = false;
				_s.d_sdo.hasT2D = false;
				_s.d_sdo.setInnerHTML(_s.iconCSSString2);
				_s.addChild(_s.d_sdo);
				
				_s.setFinalSize();
			}else{
				if(_s.useHEX){
					_s.n_sdo = new FWDEVPDO("div");
					_s.n_sdo.setWidth(_s.totalWidth);
					_s.n_sdo.setHeight(_s.totalHeight);
					_s.n_sdo_canvas = FWDEVPUtils.getCanvasWithModifiedColor(_s.nImg, _s.nBC).canvas;
					_s.n_sdo.screen.appendChild(_s.n_sdo_canvas);
					_s.addChild(_s.n_sdo);
				}else{
					_s.n_sdo = new FWDEVPDO("img");	
					_s.n_sdo.setScreen(_s.nImg);
					_s.addChild(_s.n_sdo);
				}
				
				if(_s.allowToCreateSecondButton_bl){
					
					_s.img1 = new Image();
					_s.img1.src = _s.sPath_str;
					var img2 = new Image();
					_s.sImg = img2;
					
					if(_s.useHEX){
						_s.s_sdo = new FWDEVPDO("div");
						_s.s_sdo.setWidth(_s.totalWidth);
						_s.s_sdo.setHeight(_s.totalHeight);
						_s.img1.onload = function(){
							_s.s_sdo_canvas = FWDEVPUtils.getCanvasWithModifiedColor(_s.img1, _s.sBC).canvas;
							_s.s_sdo.screen.appendChild(_s.s_sdo_canvas);
						}
						_s.s_sdo.setAlpha(0);
						_s.addChild(_s.s_sdo);
					}else{
						_s.s_sdo = new FWDEVPDO("img");
						_s.s_sdo.setScreen(_s.img1);
						_s.s_sdo.setWidth(_s.totalWidth);
						_s.s_sdo.setHeight(_s.totalHeight);
						_s.s_sdo.setAlpha(0);
						_s.addChild(_s.s_sdo);
					}
					
					if(_s.dPath_str){
						img2.src = _s.dPath_str;
						_s.d_sdo = new FWDEVPDO("img");
						_s.d_sdo.setScreen(img2);
						_s.d_sdo.setWidth(_s.totalWidth);
						_s.d_sdo.setHeight(_s.totalHeight);
						_s.d_sdo.setX(-100);
						_s.addChild(_s.d_sdo);
					};
				}
			}
			
			_s.setWidth(_s.totalWidth);
			_s.setHeight(_s.totalHeight);
			_s.setButtonMode(true);
			
			if(_s.hasPointerEvent_bl){
				_s.screen.addEventListener("pointerup", _s.onMouseUp);
				_s.screen.addEventListener("pointerover", _s.onMouseOver);
				_s.screen.addEventListener("pointerout", _s.onMouseOut);
			}else if(_s.screen.addEventListener){	
				_s.screen.addEventListener("mouseover", _s.onMouseOver);
				_s.screen.addEventListener("mouseout", _s.onMouseOut);
				_s.screen.addEventListener("mouseup", _s.onMouseUp);
				_s.screen.addEventListener("touchend", _s.onMouseUp);
			}
		};
		
		_s.setFinalSize = function(){
			
			_s.setWidth(_s.n_sdo.getWidth());
			_s.setHeight(_s.n_sdo.getHeight());
			
			if(_s.w == 0){
				setTimeout(function(){
					_s.setFinalSize();
				},200);
			}
		}
		

		//####################################//
		/* Set normal / selected state */
		//####################################//
		_s.setNormalState = function(animate){
			if(_s.useFontAwesome_bl){
				FWDAnimation.killTweensOf(_s.n_sdo.screen);
				FWDAnimation.killTweensOf(_s.d_sdo.screen);
				if(animate){
					FWDAnimation.to(_s.n_sdo.screen, .8, {className:_s.normalCalssName, ease:Expo.easeOut});
					FWDAnimation.to(_s.d_sdo.screen, .8, {className:_s.normalCalssName, ease:Expo.easeOut});
				}else{
					_s.n_sdo.screen.className = _s.normalCalssName;
					_s.d_sdo.screen.className = _s.normalCalssName;
				}
			}else{
				FWDAnimation.killTweensOf(_s.s_sdo);
				FWDAnimation.to(_s.s_sdo, .5, {alpha:0, ease:Expo.easeOut});	
			}
		};
		
		_s.setSelectedState = function(animate){
			if(_s.useFontAwesome_bl){
				FWDAnimation.killTweensOf(_s.n_sdo.screen);
				FWDAnimation.killTweensOf(_s.d_sdo.screen);
				if(animate){
					FWDAnimation.to(_s.n_sdo.screen, .8, {className:_s.selectedCalssName, ease:Expo.easeOut});	
					FWDAnimation.to(_s.d_sdo.screen, .8, {className:_s.selectedCalssName, ease:Expo.easeOut});
				}else{
					_s.n_sdo.screen.className = _s.selectedCalssName;
					_s.d_sdo.screen.className = _s.selectedCalssName
				}
			}else{
				FWDAnimation.killTweensOf(_s.s_sdo);
				FWDAnimation.to(_s.s_sdo, .5, {alpha:1, delay:.1, ease:Expo.easeOut});
			}
		};
		
		_s.onMouseOver = function(e){
			if(!e.pointerType || e.pointerType == e.MSPOINTER_TYPE_MOUSE){
				if(_s.isDisabled_bl || _s.isSelectedFinal_bl) return;
				_s.dispatchEvent(FWDEVPVolumeButton.MOUSE_OVER, {e:e});
				_s.setSelectedState(true);
			}
		};
			
		_s.onMouseOut = function(e){
			if(!e.pointerType || e.pointerType == e.MSPOINTER_TYPE_MOUSE){
				if(_s.isDisabled_bl || _s.isSelectedFinal_bl) return;
				_s.dispatchEvent(FWDEVPVolumeButton.MOUSE_OUT, {e:e});
				_s.setNormalState(true);
			}
		};
		
		_s.onMouseUp = function(e){
			if(e.preventDefault) e.preventDefault();
			if(_s.isDisabled_bl || e.button == 2 || _s.isSelectedFinal_bl) return;
			_s.dispatchEvent(FWDEVPVolumeButton.MOUSE_UP, {e:e});
		};
		

		//##############################//
		// set select / deselect final.
		//##############################//
		_s.setSelctedFinal = function(){
			_s.isSelectedFinal_bl = true;
			FWDAnimation.killTweensOf(_s.s_sdo);
			FWDAnimation.to(_s.s_sdo, .8, {alpha:1, ease:Expo.easeOut});
			_s.setButtonMode(false);
		};
		
		_s.setUnselctedFinal = function(){
			_s.isSelectedFinal_bl = false;
			FWDAnimation.to(_s.s_sdo, .8, {alpha:0, delay:.1, ease:Expo.easeOut});
			_s.setButtonMode(true);
		};
		

		//####################################//
		/* Disable / enable */
		//####################################//
		_s.setDisabledState = function(){
			if(_s.isSetToDisabledState_bl) return;
			
			_s.isSetToDisabledState_bl = true;
			if(_s.useFontAwesome_bl){
				_s.n_sdo.setX(-10000);
				_s.d_sdo.setX(0);
			}else{_s.d_sdo.setX(0);
				FWDAnimation.killTweensOf(_s.d_sdo);
				FWDAnimation.to(_s.d_sdo, .8, {alpha:1, ease:Expo.easeOut});
			}
		};
		
		_s.setEnabledState = function(){
			if(!_s.isSetToDisabledState_bl) return;
			
			_s.isSetToDisabledState_bl = false;
			if(_s.useFontAwesome_bl){
				_s.n_sdo.setX(0);
				_s.d_sdo.setX(-10000);
			}else{
				_s.d_sdo.setX(-10000);
				FWDAnimation.killTweensOf(_s.d_sdo);
				FWDAnimation.to(_s.d_sdo, .8, {alpha:0, delay:.1, ease:Expo.easeOut});
			}
		};
		
		_s.disable = function(){
			_s.isDisabled_bl = true;
			_s.setButtonMode(false);
		};
		
		_s.enable = function(){
			_s.isDisabled_bl = false;
			_s.setButtonMode(true);
		};
		

		//##########################################//
		/* Update HEX color of a canvaas */
		//##########################################//
		_s.updateHEXColors = function(nBC, sBC){
			FWDEVPUtils.changeCanvasHEXColor(_s.nImg, _s.n_sdo_canvas, nBC);
			FWDEVPUtils.changeCanvasHEXColor(_s.img1, _s.s_sdo_canvas, sBC);
		}
		
		_s.init();
	};
	
	/* set prototype */
	FWDEVPVolumeButton.setPrototype = function(){
		FWDEVPVolumeButton.prototype = null;
		FWDEVPVolumeButton.prototype = new FWDEVPDO("div");
	};
	
	FWDEVPVolumeButton.CLICK = "onClick";
	FWDEVPVolumeButton.MOUSE_OVER = "onMouseOver";
	FWDEVPVolumeButton.MOUSE_OUT = "onMouseOut";
	FWDEVPVolumeButton.MOUSE_UP = "onMouseDown";
	
	FWDEVPVolumeButton.prototype = null;
	window.FWDEVPVolumeButton = FWDEVPVolumeButton;
}(window));/**
 * Easy Video Player PACKAGED v9.1
 * Youtube screen.
 *
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © 2006 All Rights Reserved.
 */
(function(window){

	var FWDEVPYoutubeScreen = function(prt, volume){

		'use strict';
		
		var _s = this;
		_s.lastQuality_str = "auto";
		_s.volume = volume;
		_s.controllerHeight = prt._d.controllerHeight;
		_s.isStopped_bl = true;
		_s.isPausedInEvent_bl = true;
		_s.isShowed_bl = true;
		_s.playsinline = prt._d.playsinline ? 1 : 0;
		_s.isQualityArrayDisapatched_bl = false;
		_s.isMobile_bl = FWDEVPUtils.isMobile;
		

		//###############################################//
		/* init */
		//###############################################//
		_s.init = function(){
			_s.hasT3D = false;
			_s.hasT2D = false;
			_s.setBackfaceVisibility();
			prt.main_do.addChildAt(_s, 0);
			_s.resizeAndPosition();
			_s.setupVideo();
			_s.setupDisableClick();
			_s.setWidth(1);
			_s.setHeight(1);
		};
		

		//#####################################//
		/* Setup disable click */
		//#####################################//
		_s.setupDisableClick = function(){
			_s.disableClick_do = new FWDEVPDO("div");
			_s.disableClick_do.className = 'fwdevp-disable'
			_s.addChild(_s.disableClick_do);
		};
		
		_s.showDisable = function(){
			if(!prt.tempVidStageWidth || _s.disableClick_do.w == _s.sW){
				return;
			}
			
			_s.disableClick_do.setWidth(prt.tempVidStageWidth);
			if(FWDEVPUtils.isIphone){	
				_s.disableClick_do.setHeight(prt.tempVidStageHeight - _s.controllerHeight);
			}else{
				_s.disableClick_do.setHeight(prt.tempVidStageHeight);
			}
		};
		
		_s.hideDisable = function(){
			if(_s.disableClick_do.w == 0) return;
			_s.disableClick_do.setWidth(0);
			_s.disableClick_do.setHeight(0);
		};
	

		//###############################################//
		/* Setup youtube video */
		//##############################################//
		_s.setupVideo = function(){
			if(_s.ytb) return;
			
			_s.main_do = new FWDEVPDO("div");
			_s.main_do.hasT3D = false;
			_s.main_do.hasT2D = false;
			_s.main_do.screen.setAttribute("id", prt.instanceName_str + "youtube");
			_s.main_do.style().width = "100%";
			_s.main_do.style().height = "100%";
			_s.main_do.setBackfaceVisibility();
			_s.addChild(_s.main_do);
			_s.ytb = new YT.Player(prt.instanceName_str + "youtube", {
				width:"100%",
				height:"100%",
				playerVars:{
					rel:0,
					playsinline:_s.playsinline,
					wmode: 'transparent',
					controls: 0,
					enablejsapi:1,
					iv_load_policy:3,
					modestbranding: 0,
	                showinfo:0,
	                autohide: 1,
			  	},
			  	events: {
			  		"onReady":_s.playerReadyHandler,
			  		"onError":_s.playerErrorHandler,
			  		"onStateChange":_s.stateChangeHandler,
			  		"onPlaybackQualityChange":_s.qualityChangeHandler
			  	}
		    });


		};
		
		_s.playerReadyHandler = function(){
			if(_s.ytb && !_s.ytb.playVideo && !_s.ytb.cueVideoById){
				_s.updateReadyId_int = setInterval(function(){
					_s.playerReadyHandler();
				}, 50);
				return;
			}else{
				clearInterval(_s.updateReadyId_int);
			}

			_s.resizeAndPosition();

			_s.dispatchEvent(FWDEVPYoutubeScreen.READY);
			_s.hasBeenCreatedOnce_bl = true;
			
		};
		
		_s.stateChangeHandler = function(e){
		
			if(e.data == YT.PlayerState.PLAYING){
				if(!_s.isSafeToBeControlled_bl){
					_s.isStopped_bl = false;
					
					_s.isSafeToBeControlled_bl = true;
					
					_s.isPlaying_bl = true;
					_s.hasHours_bl = Math.floor(_s.ytb.getDuration() / (60 * 60)) > 0;
					_s.startToUpdate();
					_s.startToPreload();
					if(!_s.isMobile_bl && !prt.isLive) _s.ytb.seekTo(0.000001);
					if(!_s.isMobile_bl) _s.setQuality(_s.lastQuality_str);
					
					if(_s.ytb.getAvailableQualityLevels() && _s.ytb.getAvailableQualityLevels().length != 0){
						_s.dispatchEvent(FWDEVPYoutubeScreen.QUALITY_CHANGE, {qualityLevel:_s.ytb.getPlaybackQuality(), levels:_s.ytb.getAvailableQualityLevels()});
					}
					_s.setPlaybackRate();
				    _s.dispatchEvent(FWDEVPYoutubeScreen.SAFE_TO_SCRUBB);
				}
				
				_s.resizeAndPosition();
				_s.startToUpdateSubtitles();
				if(_s.isPausedInEvent_bl) _s.dispatchEvent(FWDEVPYoutubeScreen.PLAY);
				_s.isPausedInEvent_bl = false;
				_s.hasError_bl = false;
			}else if(e.data == YT.PlayerState.PAUSED){
				if(!_s.isSafeToBeControlled_bl) return;
				if(!_s.isPausedInEvent_bl) _s.dispatchEvent(FWDEVPYoutubeScreen.PAUSE);
				_s.isPausedInEvent_bl = true;
			}else if(e.data == YT.PlayerState.ENDED){

				if(_s.ytb.getCurrentTime() && _s.ytb.getCurrentTime() > 0 && _s.isSafeToBeControlled_bl){
					_s.stopToUpdateSubtitles();
					setTimeout(function(){_s.dispatchEvent(FWDEVPYoutubeScreen.PLAY_COMPLETE);}, 100);
				}
			}else if(e.data == YT.PlayerState.CUED){
				if(!_s.isStopped_bl){
					_s.setVolume(prt.volume);
					if(prt._d.autoPlay_bl){
						_s.ytb.mute();
					}

					if(prt._d.autoPlay_bl){
						if(prt.controller_do) prt.controller_do.updateVolume(0);
						if(prt.displayType != FWDEVPlayer.LIGHTBOX  || prt.lightBox_do.showComplete_bl){
							prt.play();
						}
					} 

					clearTimeout(_s.cued_to);

					_s.cued_to = setTimeout(function(){
						if(prt.allowToPlay){
							prt.play();
						}
						prt.allowToPlay = false;
					}, 60);
					
			
				if(!prt.isMobile_bl && (prt.wasAdd_bl || prt.playSecondSource)) _s.play();
					_s.dispatchEvent(FWDEVPYoutubeScreen.CUED);
				}

				_s.resizeAndPosition();
				
				_s.isCued_bl = true;
			}
			
		};
		
		_s.qualityChangeHandler = function(e){
			if(_s.ytb.getAvailableQualityLevels() && _s.ytb.getAvailableQualityLevels().length != 0){
				_s.dispatchEvent(FWDEVPYoutubeScreen.QUALITY_CHANGE, {qualityLevel:_s.ytb.getPlaybackQuality()});
			}
		};
		
		_s.playerErrorHandler = function(e){
			_s.isPausedInEvent_bl = true;
			
			if(_s.isStopped_bl || _s.hasError_bl || !_s.sourcePath_str) return;
			
			var error_str = e.data;
			_s.hasError_bl = true;
			if(e.data == 2){
				error_str = "The youtube id is not well formatted, make sure it has exactly 11 characters and that it dosn't contain invalid characters such as exclamation points or asterisks.";
			}else if(e.data == 5){
				error_str = "The requested content cannot be played in an HTML5 player or another error related to the HTML5 player has occurred.";
			}else if(e.data == 100){
				error_str = "The youtube video request was not found, probably the video ID is incorrect.";
			}else if(e.data == 101 || e.data == 150){
				error_str = "The owner of the requested video does not allow it to be played in embedded players.";
			}
			
			_s.dispatchEvent(FWDEVPYoutubeScreen.ERROR, {text:error_str});
		};
		

		//##############################################//
		/* Resize and position */
		//##############################################//
		_s.resizeAndPosition = function(){
			if(!prt.tempVidStageWidth) return;
			_s.setX(-1);
			
			_s.setWidth(prt.tempVidStageWidth + 2);
		
			if(prt._d.showYoutubeRelAndInfo_bl){
				_s.setHeight(prt.tempVidStageHeight + 2);
				_s.setY(-1);
			}else{
				if(!_s.isSafeToBeControlled_bl){
					_s.setHeight(prt.tempVidStageHeight + 110);
					_s.setY(-55);
				}else{
					_s.setHeight(1.776 * prt.tempVidStageHeight);
					_s.setY((prt.tempVidStageHeight - (1.776 * prt.tempVidStageHeight))/2);
				}
			}
			
		};
		

		//##############################################//
		/* Set path */
		//##############################################//
		_s.setSource = function(sourcePath){
			
			if(sourcePath) _s.sourcePath_str = sourcePath;
			_s.isStopped_bl = false;
			
			_s.ytb.cueVideoById(_s.sourcePath_str);

			clearInterval(_s.setSourceId_int);
			_s.setSourceId_int = setInterval(function(){
				if(_s.ytb.cueVideoById && _s.ytb.setPlaybackRate){
					_s.ytb.cueVideoById(_s.sourcePath_str);
					clearInterval(_s.setSourceId_int);
				}
			},50);

			FWDAnimation.killTweensOf(_s);
			_s.setAlpha(0);
			FWDAnimation.to(_s, .6, {alpha:1, delay:.4});		
		};
	

		//##########################################//
		/* Play / pause / stop methods */
		//##########################################//
		_s.play = function(overwrite){
			FWDEVPlayer.curInstance = prt;
			_s.isPlaying_bl = true;
			_s.hasError_bl = false;
			
			_s.ytb.playVideo();
			_s.startToUpdate();
			if(!_s.isMobile_bl || prt._d.autoPlay_bl) _s.isStopped_bl = false;
		};

		_s.pause = function(){
			if(_s.isStopped_bl || _s.hasError_bl) return;
			_s.isPlaying_bl = false;
			try{
				_s.ytb.pauseVideo();
			}catch(e){}
			_s.stopToUpdate();
		};
		
		_s.togglePlayPause = function(){
			if(_s.isPlaying_bl){
				_s.pause();
			}else{
				_s.play();
			}
		};
		
		_s.resume = function(){
			if(_s.isStopped_bl) return;
			_s.play();
		};
		

		//###########################################//
		/* Updates ... */
		//###########################################//
		_s.startToUpdate = function(){
			clearInterval(_s.updateVideoId_int);
			_s.updateVideoId_int = setInterval(_s.updateVideo, 500);
		};
		
		_s.stopToUpdate = function(){
			clearInterval(_s.updateVideoId_int);
		};
		
		_s.updateVideo = function(){
			var percentPlayed; 
			if(!_s.ytb){
				stopToUpdate();
				return;
			}
			if (!_s.allowScrubing_bl) {
				percentPlayed = _s.ytb.getCurrentTime() /_s.ytb.getDuration();
				_s.dispatchEvent(FWDEVPYoutubeScreen.UPDATE, {percent:percentPlayed});
			}
			
			var totalTime = FWDEVPUtils.formatTime(_s.ytb.getDuration());
			var curTime = FWDEVPUtils.formatTime(_s.ytb.getCurrentTime());
			
			_s.dispatchEvent(FWDEVPYoutubeScreen.UPDATE_TIME, {curTime:curTime , totalTime:totalTime, seconds:_s.ytb.getCurrentTime(), totalTimeInSeconds:_s.ytb.getDuration()});
		};
		
		_s.startToPreload = function(){
			clearInterval(_s.preloadVideoId_int);
			_s.updatePreloadId_int = setInterval(_s.updateProgress, 500);
		};
		
		_s.stopToPreload = function(){
			clearInterval(_s.updatePreloadId_int);
		};
		
		_s.updateProgress = function(){
			if(!_s.ytb){
				stopToPreload();
				return;
			}
			var buffered;
			var percentLoaded = _s.ytb.getVideoLoadedFraction();
			
			_s.dispatchEvent(FWDEVPYoutubeScreen.LOAD_PROGRESS, {percent:percentLoaded});
		};
		

		//###########################################//
		/* Event handlers */
		//###########################################//	
		_s.stop = function(){
			if(_s.isStopped_bl) return;
			_s.isPlaying_bl = false;
			_s.isStopped_bl = true;
			_s.isCued_bl = false;
			_s.allowScrubing_bl = false;
			_s.isSafeToBeControlled_bl = false;
			_s.isQualityArrayDisapatched_bl = false;
			_s.isPausedInEvent_bl = true;
			prt.allowToPlay = false;
			clearTimeout(_s.cued_to);
			clearInterval(_s.updateReadyId_int);
			clearInterval(_s.setSourceId_int);
			_s.stopToUpdateSubtitles();
			_s.stopToUpdate();
			_s.stopToPreload();
			_s.stopVideo();
			_s.dispatchEvent(FWDEVPYoutubeScreen.STOP);
			_s.dispatchEvent(FWDEVPYoutubeScreen.LOAD_PROGRESS, {percent:0});
			_s.dispatchEvent(FWDEVPYoutubeScreen.UPDATE_TIME, {curTime:"00:00" , totalTime:"00:00"});
		};
		
		_s.destroyYoutube = function(){
			
			if(_s.main_do){
				_s.main_do.screen.removeAttribute("id", prt.instanceName_str + "youtube");
				_s.main_do.destroy();
				_s.main_do = null;
			}
			if(_s.ytb) _s.ytb.destroy();
			_s.ytb = null;
		};
		
		_s.stopVideo = function(){
			if(_s.ytb && _s.ytb.cueVideoById) _s.ytb.cueVideoById(_s.sourcePath_str);
			FWDAnimation.killTweensOf(_s);
			_s.setAlpha(0);
			FWDAnimation.to(_s, .6, {alpha:1, delay:.4});		
		};


		//###############################################//
		/* Scrub */
		//###############################################//
		_s.startToScrub = function(){
			if(!_s.isSafeToBeControlled_bl) return;
			_s.allowScrubing_bl = true;
		};
		
		_s.scrubbAtTime = function(duration){
			if(!_s.isSafeToBeControlled_bl) return;
			
			_s.ytb.seekTo(duration);
		}
		
		_s.stopToScrub = function(){
			if(!_s.isSafeToBeControlled_bl) return;
			_s.allowScrubing_bl = false;
		};
		
		_s.scrub = function(percent){
			if(!_s.isSafeToBeControlled_bl) return;
			_s.ytb.seekTo(percent * _s.ytb.getDuration());
		};
		
		_s.setPlaybackRate = function(rate){
			if(!_s.ytb || _s.isMobile_bl) return;
			if(rate) _s.rate = rate;
			if(_s.ytb && _s.ytb.setPlaybackRate) _s.ytb.setPlaybackRate(Number(_s.rate));
		};
	

		//###############################################//
		/* Volume */
		//###############################################//
		_s.setVolume = function(vol){
			if(vol != undefined) _s.volume = vol;
			if(_s.ytb && _s.ytb.setVolume){
				_s.ytb.setVolume(vol * 100);
				if(vol) _s.ytb.unMute();
			}	
		};
		

		//##################################################//
		/* Suntitles */
		//##################################################//
		_s.stopToUpdateSubtitles = function(){
			clearInterval(_s.startToUpdateSubtitleId_int);	
		}
		
		_s.startToUpdateSubtitles = function(){
			clearInterval(_s.startToUpdateSubtitleId_int);
			_s.startToUpdateSubtitleId_int = setInterval(_s.updateSubtitleHandler, 10);
		}
		
		_s.updateSubtitleHandler = function(){
			
			_s.dispatchEvent(FWDEVPYoutubeScreen.UPDATE_SUBTITLE, {curTime:_s.ytb.getCurrentTime()});
		}
		

		//###############################################//
		/* set quality */
		//###############################################//
		_s.setQuality = function(quality){
			_s.lastQuality_str = quality;
			_s.ytb.setPlaybackQuality(quality);
		};
		
	
		_s.init();
	};


	/* set prototype */
	FWDEVPYoutubeScreen.setPrototype = function(){
		FWDEVPYoutubeScreen.prototype = new FWDEVPDO("div");
	};
	
	FWDEVPYoutubeScreen.UPDATE_SUBTITLE = "updateSubtitle";
	FWDEVPYoutubeScreen.READY = "ready";
	FWDEVPYoutubeScreen.ERROR = "error";
	FWDEVPYoutubeScreen.UPDATE = "update";
	FWDEVPYoutubeScreen.UPDATE_TIME = "updateTime";
	FWDEVPYoutubeScreen.SAFE_TO_SCRUBB = "safeToControll";
	FWDEVPYoutubeScreen.LOAD_PROGRESS = "loadProgress";
	FWDEVPYoutubeScreen.PLAY = "play";
	FWDEVPYoutubeScreen.PAUSE = "pause";
	FWDEVPYoutubeScreen.STOP = "stop";
	FWDEVPYoutubeScreen.PLAY_COMPLETE = "playComplete";
	FWDEVPYoutubeScreen.CUED = "cued";
	FWDEVPYoutubeScreen.QUALITY_CHANGE = "qualityChange";


	window.FWDEVPYoutubeScreen = FWDEVPYoutubeScreen;

}(window));/**
 * Easy Video Player PACKAGED v9.1
 * Quality button.
 *
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © 2006 All Rights Reserved.
 */
(function (){

	var FWDEVPYTBQButton = function(
			label,
			normalColor,
			selectedColor,
			hdPath,
			id
		){

		'use strict';
		
		var _s = this;

		_s.label_str = label;
		_s.nBC = normalColor;
		_s.sBC = selectedColor;
		_s.hdPath_str = hdPath;
		_s.id = id;
		_s.totalWidth = 0;
		_s.totalHeight = 23;
		_s.hdWidth = 7;
		_s.hdHeight = 5;
		_s.hasHd_bl = _s.hdPath_str
		_s.isMobile_bl = FWDEVPUtils.isMobile;
		_s.isDisabled_bl = false;

		
		//##########################################//
		/* initialize _s */
		//##########################################//
		_s.init = function(){
			_s.setBackfaceVisibility();
			_s.setupMainContainers();
			_s.setHeight(_s.totalHeight);
		};
		

		//##########################################//
		/* setup main containers */
		//##########################################//
		_s.setupMainContainers = function(){
			_s.text_do = new FWDEVPDO("div");
			_s.text_do.setBackfaceVisibility();
			_s.text_do.hasT3D = false;
			_s.text_do.hasT2D = false;
			_s.text_do.screen.className = 'fwdevp-qaulity-button';
			_s.text_do.style().display = "inline-block";
			_s.text_do.style().whiteSpace = "nowrap";
			_s.text_do.style().fontFamily = "Arial";
			_s.text_do.style().fontSize= "12px";
			_s.text_do.style().color = _s.nBC;
			_s.text_do.style().fontSmoothing = "antialiased";
			_s.text_do.style().webkitFontSmoothing = "antialiased";
			_s.text_do.style().textRendering = "optimizeLegibility";	
			_s.text_do.setInnerHTML(_s.label_str);
			_s.addChild(_s.text_do);
			
			if(_s.hasHd_bl){
				var img = new Image();
				
				img.src = _s.hdPath_str;
				_s.hd_do = new FWDEVPDO("img");
				_s.hd_do.setScreen(img);
				_s.hd_do.setWidth(_s.hdWidth);
				_s.hd_do.setHeight(_s.hdHeight);
				_s.addChild(_s.hd_do);
			}
				
			_s.dumy_do = new FWDEVPDO("div");
			if(FWDEVPUtils.isIE){
				_s.dumy_do.setBkColor("#FF0000");
				_s.dumy_do.setAlpha(0.0001);
			};
			
			_s.dumy_do.setButtonMode(true);
			_s.dumy_do.setHeight(_s.totalHeight);
			_s.addChild(_s.dumy_do);
			
			if(_s.hasPointerEvent_bl){
				_s.screen.addEventListener("pointerup", _s.onMouseUp);
				_s.screen.addEventListener("pointerover", _s.onMouseOver);
				_s.screen.addEventListener("pointerout", _s.onMouseOut);
			}else if(_s.screen.addEventListener){	
				if(!_s.isMobile_bl){
					_s.screen.addEventListener("mouseover", _s.onMouseOver);
					_s.screen.addEventListener("mouseout", _s.onMouseOut);
					_s.screen.addEventListener("mouseup", _s.onMouseUp);
				}
				_s.screen.addEventListener("touchend", _s.onMouseUp);
			}
		};
		
		_s.onMouseOver = function(e){
			if(_s.isDisabled_bl) return;
			_s.setSelectedState(true);
			_s.dispatchEvent(FWDEVPYTBQButton.MOUSE_OVER, {e:e, id:_s.id});
		};
			
		_s.onMouseOut = function(e){
			if(_s.isDisabled_bl) return;
			_s.setNormalState(true);
			_s.dispatchEvent(FWDEVPYTBQButton.MOUSE_OUT, {e:e, id:_s.id});
		};
		
		_s.onMouseUp = function(e){
			if(_s.isDisabled_bl || e.button == 2) return;
			if(e.preventDefault) e.preventDefault();
			_s.dispatchEvent(FWDEVPYTBQButton.CLICK, {e:e, id:_s.id});
		};
	

		//###############################//
		/* set final size */
		//###############################//
		_s.setFinalSize = function(){
			var width = _s.text_do.getWidth() + 34;
			var height = _s.text_do.getHeight();
		
			_s.text_do.setX(18);
			_s.text_do.setY(parseInt((_s.totalHeight - height)/2));
			
			if(_s.hd_do){
				_s.hd_do.setX(width - 12);
				_s.hd_do.setY(_s.text_do.y + 1);
			}
			
			_s.dumy_do.setWidth(width);
			_s.setWidth(width);
		}
		
		_s.updateText = function(label){
			_s.label_str = label;
			_s.text_do.setInnerHTML(_s.label_str);
			
			if(_s.hd_do){
				if(_s.label_str == "highres"
					|| _s.label_str == "hd720"
				    || _s.label_str == "hd1080"
				    || _s.label_str == "hd1440"
				    || _s.label_str == "hd2160"
				    || _s.label_str == "hd2880"
				 ){
					_s.hd_do.setVisible(true);
				}else{
					_s.hd_do.setVisible(false);
				}
			}
		};
		

		//################################//
		/* Set states */
		//###############################//
		_s.setSelectedState = function(animate){
			_s.isSelected_bl = true;
			FWDAnimation.killTweensOf(_s.text_do);
			if(animate){
				FWDAnimation.to(_s.text_do.screen, .5, {css:{color:_s.sBC}, ease:Expo.easeOut});
			}else{
				_s.text_do.style().color = _s.sBC;
			}
		};
		
		_s.setNormalState = function(animate){
			_s.isSelected_bl = false;
			FWDAnimation.killTweensOf(_s.text_do);
			if(animate){
				FWDAnimation.to(_s.text_do.screen, .5, {css:{color:_s.nBC}, ease:Expo.easeOut});
			}else{
				_s.text_do.style().color = _s.nBC;
			}
		};
		

		//##############################//
		/* disable /enable button */
		//##############################//
		_s.disable = function(){
			_s.isDisabled_bl = true;
			FWDAnimation.killTweensOf(_s.text_do);
			_s.setSelectedState(true);
			_s.dumy_do.setButtonMode(false);
		};
		
		_s.enable = function(){
			_s.isDisabled_bl = false;
			FWDAnimation.killTweensOf(_s.text_do);
			_s.setNormalState(true);
			_s.dumy_do.setButtonMode(true);
		};
		

		_s.init();
	};
	
	
	/* set prototype */
	FWDEVPYTBQButton.setPrototype = function(){
		FWDEVPYTBQButton.prototype = new FWDEVPDO("div");
	};
	
	FWDEVPYTBQButton.MOUSE_OVER = "onMouseOver";
	FWDEVPYTBQButton.MOUSE_OUT = "onMouseOut";
	FWDEVPYTBQButton.CLICK = "onClick";
	
	FWDEVPYTBQButton.prototype = null;
	window.FWDEVPYTBQButton = FWDEVPYTBQButton;
}(window));// FWDAnimation classs for tweeningn not allowed to modify or use outside this plugin!
var _fwd_fwdScope;window.FWDAnimation||(((_fwd_fwdScope="undefined"!=typeof fwd_module&&fwd_module.exports&&"undefined"!=typeof fwd_global?fwd_global:this||window)._fwd_fwdQueue||(_fwd_fwdScope._fwd_fwdQueue=[])).push(function(){"use strict";function y(t,e,i,r){i===r&&(i=r-(r-e)/1e6),t===e&&(e=t+(i-t)/1e6),this.a=t,this.b=e,this.c=i,this.d=r,this.da=r-t,this.ca=i-t,this.ba=e-t}function w(t,e,i,r){var s={a:t},n={},a={},o={c:r},l=(t+e)/2,h=(e+i)/2,f=(i+r)/2,u=(l+h)/2,p=(h+f)/2,_=(p-u)/8;return s.b=l+(t-l)/4,n.b=u+_,s.c=n.a=(s.b+n.b)/2,n.c=a.a=(u+p)/2,a.b=p-_,o.b=f+(r-f)/4,a.c=o.a=(a.b+o.b)/2,[s,n,a,o]}function _(t,e,i,r,s,n){var a,o,l,h,f,u,p,_,c={},d=[],m=n||t[0];for(o in s="string"==typeof s?","+s+",":",x,y,z,left,top,right,bottom,marginTop,marginLeft,marginRight,marginBottom,paddingLeft,paddingTop,paddingRight,paddingBottom,backgroundPosition,backgroundPosition_y,",null==e&&(e=1),t[0])d.push(o);if(1<t.length){for(_=t[t.length-1],p=!0,a=d.length;-1<--a;)if(o=d[a],.05<Math.abs(m[o]-_[o])){p=!1;break}p&&(t=t.concat(),n&&t.unshift(n),t.push(t[1]),n=t[t.length-3])}for(T.length=P.length=O.length=0,a=d.length;-1<--a;)o=d[a],g[o]=-1!==s.indexOf(","+o+","),c[o]=function(t,e,i,r){var s,n,a,o,l,h,f=[];if(r)for(n=(t=[r].concat(t)).length;-1<--n;)"string"==typeof(h=t[n][e])&&"="===h.charAt(1)&&(t[n][e]=r[e]+Number(h.charAt(0)+h.substr(2)));if((s=t.length-2)<0)return f[0]=new y(t[0][e],0,0,t[s<-1?0:1][e]),f;for(n=0;n<s;n++)a=t[n][e],o=t[n+1][e],f[n]=new y(a,0,0,o),i&&(l=t[n+2][e],T[n]=(T[n]||0)+(o-a)*(o-a),P[n]=(P[n]||0)+(l-o)*(l-o));return f[n]=new y(t[n][e],0,0,t[n+1][e]),f}(t,o,g[o],n);for(a=T.length;-1<--a;)T[a]=Math.sqrt(T[a]),P[a]=Math.sqrt(P[a]);if(!r){for(a=d.length;-1<--a;)if(g[o])for(u=(l=c[d[a]]).length-1,h=0;h<u;h++)f=l[h+1].da/P[h]+l[h].da/T[h]||0,O[h]=(O[h]||0)+f*f;for(a=O.length;-1<--a;)O[a]=Math.sqrt(O[a])}for(a=d.length,h=i?4:1;-1<--a;)(function(t,e,i,r,s){for(var n,a,o,l,h,f,u,p,_,c,d,m,g=t.length-1,y=0,v=t[0].a,x=0;x<g;x++)n=(l=t[y]).a,a=l.d,o=t[y+1].d,u=s?(c=T[x],m=((d=P[x])+c)*e*.25/(!r&&O[x]||.5),a-((h=a-(a-n)*(r?.5*e:0!==c?m/c:0))+(((f=a+(o-a)*(r?.5*e:0!==d?m/d:0))-h)*(3*c/(c+d)+.5)/4||0))):a-((h=a-(a-n)*e*.5)+(f=a+(o-a)*e*.5))/2,h+=u,f+=u,l.c=p=h,l.b=0!==x?v:v=l.a+.6*(l.c-l.a),l.da=a-n,l.ca=p-n,l.ba=v-n,i?(_=w(n,v,p,a),t.splice(y,1,_[0],_[1],_[2],_[3]),y+=4):y++,v=f;(l=t[y]).b=v,l.c=v+.4*(l.d-v),l.da=l.d-l.a,l.ca=l.c-l.a,l.ba=v-l.a,i&&(_=w(l.a,v,l.c,l.d),t.splice(y,1,_[0],_[1],_[2],_[3]))})(l=c[o=d[a]],e,i,r,g[o]),p&&(l.splice(0,h),l.splice(l.length-h,h));return c}var b,T,P,O,g,i,m,t;_fwd_fwdScope.FWDFWD_fwdDefine("FWDAnimation",["core.FWDAnimation","core.FWDSimpleTimeline","FWDTweenLite"],function(m,f,g){function y(t){for(var e=[],i=t.length,r=0;r!==i;e.push(t[r++]));return e}function v(t,e,i){var r,s,n=t.cycle;for(r in n)s=n[r],t[r]="function"==typeof s?s(i,e[i]):s[i%s.length];delete t.cycle}var m=function(t,e,i){g.call(this,t,e,i),this._cycle=0,this._yoyo=!0===this.vars.yoyo,this._repeat=this.vars.repeat||0,this._repeatDelay=this.vars.repeatDelay||0,this._dirty=!0,this.render=m.prototype.render},x=1e-10,w=g._internals,T=w.isSelector,b=w.isArray,t=m.prototype=g.to({},.1,{}),P=[];m.version="1.19.0",t.constructor=m,t.kill()._gc=!1,m.killTweensOf=m.killDelayedCallsTo=g.killTweensOf,m.getTweensOf=g.getTweensOf,m.lagSmoothing=g.lagSmoothing,m.ticker=g.ticker,m.render=g.render,t.invalidate=function(){return this._yoyo=!0===this.vars.yoyo,this._repeat=this.vars.repeat||0,this._repeatDelay=this.vars.repeatDelay||0,this._uncache(!0),g.prototype.invalidate.call(this)},t.updateTo=function(t,e){var i,r=this.ratio,s=this.vars.immediateRender||t.immediateRender;for(i in e&&this._startTime<this._timeline._time&&(this._startTime=this._timeline._time,this._uncache(!1),this._gc?this._enabled(!0,!1):this._timeline.insert(this,this._startTime-this._delay)),t)this.vars[i]=t[i];if(this._initted||s)if(e)this._initted=!1,s&&this.render(0,!0,!0);else if(this._gc&&this._enabled(!0,!1),this._notifyPluginsOfEnabled&&this._firstPT&&g._onPluginEvent("_onDisable",this),.998<this._time/this._duration){var n=this._totalTime;this.render(0,!0,!1),this._initted=!1,this.render(n,!0,!1)}else if(this._initted=!1,this._init(),0<this._time||s)for(var a,o=1/(1-r),l=this._firstPT;l;)a=l.s+l.c,l.c*=o,l.s=a-l.c,l=l._next;return this},t.render=function(t,e,i){this._initted||0===this._duration&&this.vars.repeat&&this.invalidate();var r,s,n,a,o,l,h,f,u,p=this._dirty?this.totalDuration():this._totalDuration,_=this._time,c=this._totalTime,d=this._cycle,m=this._duration,g=this._rawPrevTime;if(p-1e-7<=t?(this._totalTime=p,this._cycle=this._repeat,this._yoyo&&0!=(1&this._cycle)?(this._time=0,this.ratio=this._ease._calcEnd?this._ease.getRatio(0):0):(this._time=m,this.ratio=this._ease._calcEnd?this._ease.getRatio(1):1),this._reversed||(r=!0,s="onComplete",i=i||this._timeline.autoRemoveChildren),0===m&&(!this._initted&&this.vars.lazy&&!i||(this._startTime===this._timeline._duration&&(t=0),(g<0||t<=0&&-1e-7<=t||g===x&&"isPause"!==this.data)&&g!==t&&(i=!0,x<g&&(s="onReverseComplete")),this._rawPrevTime=f=!e||t||g===t?t:x))):t<1e-7?(this._totalTime=this._time=this._cycle=0,this.ratio=this._ease._calcEnd?this._ease.getRatio(0):0,(0!==c||0===m&&0<g)&&(s="onReverseComplete",r=this._reversed),t<0&&(this._active=!1,0===m&&(!this._initted&&this.vars.lazy&&!i||(0<=g&&(i=!0),this._rawPrevTime=f=!e||t||g===t?t:x))),this._initted||(i=!0)):(this._totalTime=this._time=t,0!==this._repeat&&(a=m+this._repeatDelay,this._cycle=this._totalTime/a>>0,0!==this._cycle&&this._cycle===this._totalTime/a&&c<=t&&this._cycle--,this._time=this._totalTime-this._cycle*a,this._yoyo&&0!=(1&this._cycle)&&(this._time=m-this._time),this._time>m?this._time=m:this._time<0&&(this._time=0)),this._easeType?(o=this._time/m,(1===(l=this._easeType)||3===l&&.5<=o)&&(o=1-o),3===l&&(o*=2),1===(h=this._easePower)?o*=o:2===h?o*=o*o:3===h?o*=o*o*o:4===h&&(o*=o*o*o*o),1===l?this.ratio=1-o:2===l?this.ratio=o:this._time/m<.5?this.ratio=o/2:this.ratio=1-o/2):this.ratio=this._ease.getRatio(this._time/m)),_!==this._time||i||d!==this._cycle){if(!this._initted){if(this._init(),!this._initted||this._gc)return;if(!i&&this._firstPT&&(!1!==this.vars.lazy&&this._duration||this.vars.lazy&&!this._duration))return this._time=_,this._totalTime=c,this._rawPrevTime=g,this._cycle=d,w.lazyTweens.push(this),void(this._lazy=[t,e]);this._time&&!r?this.ratio=this._ease.getRatio(this._time/m):r&&this._ease._calcEnd&&(this.ratio=this._ease.getRatio(0===this._time?0:1))}for(!1!==this._lazy&&(this._lazy=!1),this._active||!this._paused&&this._time!==_&&0<=t&&(this._active=!0),0===c&&(2===this._initted&&0<t&&this._init(),this._startAt&&(0<=t?this._startAt.render(t,e,i):s=s||"_dummyGS"),this.vars.onStart&&(0===this._totalTime&&0!==m||e||this._callback("onStart"))),n=this._firstPT;n;){n.f?n.t[n.p](n.c*this.ratio+n.s):(u=n.c*this.ratio+n.s,"x"==n.p?n.t.setX(u):"y"==n.p?n.t.setY(u):"z"==n.p?n.t.setZ(u):"angleX"==n.p?n.t.setAngleX(u):"angleY"==n.p?n.t.setAngleY(u):"angleZ"==n.p?n.t.setAngleZ(u):"w"==n.p?n.t.setWidth(u):"h"==n.p?n.t.setHeight(u):"alpha"==n.p?n.t.setAlpha(u):"scale"==n.p?n.t.setScale2(u):n.t[n.p]=u),n=n._next}this._onUpdate&&(t<0&&this._startAt&&this._startTime&&this._startAt.render(t,e,i),e||this._totalTime===c&&!s||this._callback("onUpdate")),this._cycle!==d&&(e||this._gc||this.vars.onRepeat&&this._callback("onRepeat")),s&&(this._gc&&!i||(t<0&&this._startAt&&!this._onUpdate&&this._startTime&&this._startAt.render(t,e,i),r&&(this._timeline.autoRemoveChildren&&this._enabled(!1,!1),this._active=!1),!e&&this.vars[s]&&this._callback(s),0===m&&this._rawPrevTime===x&&f!==x&&(this._rawPrevTime=0)))}else c!==this._totalTime&&this._onUpdate&&(e||this._callback("onUpdate"))},m.to=function(t,e,i){return new m(t,e,i)},m.from=function(t,e,i){return i.runBackwards=!0,i.immediateRender=0!=i.immediateRender,new m(t,e,i)},m.fromTo=function(t,e,i,r){return r.startAt=i,r.immediateRender=0!=r.immediateRender&&0!=i.immediateRender,new m(t,e,r)},m.staggerTo=m.allTo=function(t,e,i,r,s,n,a){r=r||0;function o(){i.onComplete&&i.onComplete.apply(i.onCompleteScope||this,arguments),s.apply(a||i.callbackScope||this,n||P)}var l,h,f,u,p=0,_=[],c=i.cycle,d=i.startAt&&i.startAt.cycle;for(b(t)||("string"==typeof t&&(t=g.selector(t)||t),T(t)&&(t=y(t))),t=t||[],r<0&&((t=y(t)).reverse(),r*=-1),l=t.length-1,f=0;f<=l;f++){for(u in h={},i)h[u]=i[u];if(c&&(v(h,t,f),null!=h.duration&&(e=h.duration,delete h.duration)),d){for(u in d=h.startAt={},i.startAt)d[u]=i.startAt[u];v(h.startAt,t,f)}h.delay=p+(h.delay||0),f===l&&s&&(h.onComplete=o),_[f]=new m(t[f],e,h),p+=r}return _},m.staggerFrom=m.allFrom=function(t,e,i,r,s,n,a){return i.runBackwards=!0,i.immediateRender=0!=i.immediateRender,m.staggerTo(t,e,i,r,s,n,a)},m.staggerFromTo=m.allFromTo=function(t,e,i,r,s,n,a,o){return r.startAt=i,r.immediateRender=0!=r.immediateRender&&0!=i.immediateRender,m.staggerTo(t,e,r,s,n,a,o)},m.delayedCall=function(t,e,i,r,s){return new m(e,0,{delay:t,onComplete:e,onCompleteParams:i,callbackScope:r,onReverseComplete:e,onReverseCompleteParams:i,immediateRender:!1,useFrames:s,overwrite:0})},m.set=function(t,e){return new m(t,0,e)},m.isTweening=function(t){return 0<g.getTweensOf(t,!0).length};var n=function(t,e){for(var i=[],r=0,s=t._first;s;)s instanceof g?i[r++]=s:(e&&(i[r++]=s),r=(i=i.concat(n(s,e))).length),s=s._next;return i},u=m.getAllTweens=function(t){return n(m._rootTimeline,t).concat(n(m._rootFramesTimeline,t))};m.killAll=function(t,e,i,r){null==e&&(e=!0),null==i&&(i=!0);for(var s,n,a=u(0!=r),o=a.length,l=e&&i&&r,h=0;h<o;h++)n=a[h],(l||n instanceof f||(s=n.target===n.vars.onComplete)&&i||e&&!s)&&(t?n.totalTime(n._reversed?0:n.totalDuration()):n._enabled(!1,!1))},m.killChildTweensOf=function(t,e){if(null!=t){var i,r,s,n,a,o=w.tweenLookup;if("string"==typeof t&&(t=g.selector(t)||t),T(t)&&(t=y(t)),b(t))for(n=t.length;-1<--n;)m.killChildTweensOf(t[n],e);else{for(s in i=[],o)for(r=o[s].target.parentNode;r;)r===t&&(i=i.concat(o[s].tweens)),r=r.parentNode;for(a=i.length,n=0;n<a;n++)e&&i[n].totalTime(i[n].totalDuration()),i[n]._enabled(!1,!1)}}};function r(t,e,i,r){e=!1!==e,i=!1!==i;for(var s,n,a=u(r=!1!==r),o=e&&i&&r,l=a.length;-1<--l;)n=a[l],(o||n instanceof f||(s=n.target===n.vars.onComplete)&&i||e&&!s)&&n.paused(t)}return m.pauseAll=function(t,e,i){r(!0,t,e,i)},m.resumeAll=function(t,e,i){r(!1,t,e,i)},m.globalTimeScale=function(t){var e=m._rootTimeline,i=g.ticker.time;return arguments.length?(t=t||x,e._startTime=i-(i-e._startTime)*e._timeScale/t,e=m._rootFramesTimeline,i=g.ticker.frame,e._startTime=i-(i-e._startTime)*e._timeScale/t,e._timeScale=m._rootTimeline._timeScale=t):e._timeScale},t.progress=function(t,e){return arguments.length?this.totalTime(this.duration()*(this._yoyo&&0!=(1&this._cycle)?1-t:t)+this._cycle*(this._duration+this._repeatDelay),e):this._time/this.duration()},t.totalProgress=function(t,e){return arguments.length?this.totalTime(this.totalDuration()*t,e):this._totalTime/this.totalDuration()},t.time=function(t,e){return arguments.length?(this._dirty&&this.totalDuration(),t>this._duration&&(t=this._duration),this._yoyo&&0!=(1&this._cycle)?t=this._duration-t+this._cycle*(this._duration+this._repeatDelay):0!==this._repeat&&(t+=this._cycle*(this._duration+this._repeatDelay)),this.totalTime(t,e)):this._time},t.duration=function(t){return arguments.length?m.prototype.duration.call(this,t):this._duration},t.totalDuration=function(t){return arguments.length?-1===this._repeat?this:this.duration((t-this._repeat*this._repeatDelay)/(this._repeat+1)):(this._dirty&&(this._totalDuration=-1===this._repeat?999999999999:this._duration*(this._repeat+1)+this._repeatDelay*this._repeat,this._dirty=!1),this._totalDuration)},t.repeat=function(t){return arguments.length?(this._repeat=t,this._uncache(!0)):this._repeat},t.repeatDelay=function(t){return arguments.length?(this._repeatDelay=t,this._uncache(!0)):this._repeatDelay},t.yoyo=function(t){return arguments.length?(this._yoyo=t,this):this._yoyo},m},!0),b=180/Math.PI,T=[],P=[],O=[],g={},i=_fwd_fwdScope.FWDFWD_fwdDefine.globals,m=_fwd_fwdScope.FWDFWD_fwdDefine.plugin({propName:"bezier",priority:-1,version:"1.3.7",API:2,fwd_global:!0,init:function(t,e,i){this._target=t,e instanceof Array&&(e={values:e}),this._func={},this._mod={},this._props=[],this._timeRes=null==e.timeResolution?6:parseInt(e.timeResolution,10);var r,s,n,a,o,l,h=e.values||[],f={},u=h[0],p=e.autoRotate||i.vars.orientToBezier;for(r in this._autoRotate=p?p instanceof Array?p:[["x","y","rotation",!0!==p&&Number(p)||0]]:null,u)this._props.push(r);for(n=this._props.length;-1<--n;)r=this._props[n],this._overwriteProps.push(r),s=this._func[r]="function"==typeof t[r],f[r]=s?t[r.indexOf("set")||"function"!=typeof t["get"+r.substr(3)]?r:"get"+r.substr(3)]():parseFloat(t[r]),o||f[r]!==h[0][r]&&(o=f);if(this._beziers="cubic"!==e.type&&"quadratic"!==e.type&&"soft"!==e.type?_(h,isNaN(e.curviness)?1:e.curviness,!1,"thruBasic"===e.type,e.correlate,o):function(t,e,i){var r,s,n,a,o,l,h,f,u,p,_,c={},d="cubic"===(e=e||"soft")?3:2,m="soft"===e,g=[];if(m&&i&&(t=[i].concat(t)),null==t||t.length<1+d)throw"invalid Bezier data";for(u in t[0])g.push(u);for(l=g.length;-1<--l;){for(c[u=g[l]]=o=[],p=0,f=t.length,h=0;h<f;h++)r=null==i?t[h][u]:"string"==typeof(_=t[h][u])&&"="===_.charAt(1)?i[u]+Number(_.charAt(0)+_.substr(2)):Number(_),m&&1<h&&h<f-1&&(o[p++]=(r+o[p-2])/2),o[p++]=r;for(f=p-d+1,h=p=0;h<f;h+=d)r=o[h],s=o[h+1],n=o[h+2],a=2==d?0:o[h+3],o[p++]=_=3==d?new y(r,s,n,a):new y(r,(2*s+r)/3,(2*s+n)/3,n);o.length=p}return c}(h,e.type,f),this._segCount=this._beziers[r].length,this._timeRes&&(l=function(t,e){var i,r,s,n,a=[],o=[],l=0,h=0,f=(e=e>>0||6)-1,u=[],p=[];for(i in t)!function(t,e,i){for(var r,s,n,a,o,l,h,f,u,p,_,c=1/i,d=t.length;-1<--d;)for(n=(p=t[d]).a,a=p.d-n,o=p.c-n,l=p.b-n,r=s=0,f=1;f<=i;f++)r=s-(s=((h=c*f)*h*a+3*(u=1-h)*(h*o+u*l))*h),e[_=d*i+f-1]=(e[_]||0)+r*r}(t[i],a,e);for(s=a.length,r=0;r<s;r++)l+=Math.sqrt(a[r]),p[n=r%e]=l,n===f&&(h+=l,u[n=r/e>>0]=p,o[n]=h,l=0,p=[]);return{length:h,lengths:o,segments:u}}(this._beziers,this._timeRes),this._length=l.length,this._lengths=l.lengths,this._segments=l.segments,this._l1=this._li=this._s1=this._si=0,this._l2=this._lengths[0],this._curSeg=this._segments[0],this._s2=this._curSeg[0],this._prec=1/this._curSeg.length),p=this._autoRotate)for(this._initialRotations=[],p[0]instanceof Array||(this._autoRotate=p=[p]),n=p.length;-1<--n;){for(a=0;a<3;a++)r=p[n][a],this._func[r]="function"==typeof t[r]&&t[r.indexOf("set")||"function"!=typeof t["get"+r.substr(3)]?r:"get"+r.substr(3)];r=p[n][2],this._initialRotations[n]=(this._func[r]?this._func[r].call(this._target):this._target[r])||0,this._overwriteProps.push(r)}return this._startRatio=i.vars.runBackwards?1:0,!0},set:function(t){var e,i,r,s,n,a,o,l,h,f=this._segCount,u=this._func,p=this._target,_=t!==this._startRatio;if(this._timeRes){if(l=this._lengths,h=this._curSeg,t*=this._length,T=this._li,t>this._l2&&T<f-1){for(o=f-1;T<o&&(this._l2=l[++T])<=t;);this._l1=l[T-1],this._li=T,this._curSeg=h=this._segments[T],this._s2=h[this._s1=this._si=0]}else if(t<this._l1&&0<T){for(;0<T&&(this._l1=l[--T])>=t;);0===T&&t<this._l1?this._l1=0:T++,this._l2=l[T],this._li=T,this._curSeg=h=this._segments[T],this._s1=h[(this._si=h.length-1)-1]||0,this._s2=h[this._si]}if(e=T,t-=this._l1,T=this._si,t>this._s2&&T<h.length-1){for(o=h.length-1;T<o&&(this._s2=h[++T])<=t;);this._s1=h[T-1],this._si=T}else if(t<this._s1&&0<T){for(;0<T&&(this._s1=h[--T])>=t;);0===T&&t<this._s1?this._s1=0:T++,this._s2=h[T],this._si=T}n=(T+(t-this._s1)/(this._s2-this._s1))*this._prec||0}else n=(t-(e=t<0?0:1<=t?f-1:f*t>>0)*(1/f))*f;for(i=1-n,T=this._props.length;-1<--T;)r=this._props[T],a=(n*n*(s=this._beziers[r][e]).da+3*i*(n*s.ca+i*s.ba))*n+s.a,this._mod[r]&&(a=this._mod[r](a,p)),u[r]?p[r](a):"x"==r?p.setX(a):"y"==r?p.setY(a):"z"==r?p.setZ(a):"angleX"==r?p.setAngleX(a):"angleY"==r?p.setAngleY(a):"angleZ"==r?p.setAngleZ(a):"w"==r?p.setWidth(a):"h"==r?p.setHeight(a):"alpha"==r?p.setAlpha(a):"scale"==r?p.setScale2(a):p[r]=a;if(this._autoRotate)for(var c,d,m,g,y,v,x,w=this._autoRotate,T=w.length;-1<--T;)r=w[T][2],v=w[T][3]||0,x=!0===w[T][4]?1:b,s=this._beziers[w[T][0]],c=this._beziers[w[T][1]],s&&c&&(s=s[e],c=c[e],d=s.a+(s.b-s.a)*n,d+=((g=s.b+(s.c-s.b)*n)-d)*n,g+=(s.c+(s.d-s.c)*n-g)*n,m=c.a+(c.b-c.a)*n,m+=((y=c.b+(c.c-c.b)*n)-m)*n,y+=(c.c+(c.d-c.c)*n-y)*n,a=_?Math.atan2(y-m,g-d)*x+v:this._initialRotations[T],this._mod[r]&&(a=this._mod[r](a,p)),u[r]?p[r](a):p[r]=a)}}),t=m.prototype,m.bezierThrough=_,m.cubicToQuadratic=w,m._autoCSS=!0,m.quadraticToCubic=function(t,e,i){return new y(t,(2*e+t)/3,(2*e+i)/3,i)},m._cssRegister=function(){var t,_,c,d,e=i.CSSPlugin;e&&(t=e._internals,_=t._parseToProxy,c=t._setPluginRatio,d=t.CSSPropTween,t._registerComplexSpecialProp("bezier",{parser:function(t,e,i,r,s,n){e instanceof Array&&(e={values:e}),n=new m;var a,o,l,h=e.values,f=h.length-1,u=[],p={};if(f<0)return s;for(a=0;a<=f;a++)l=_(t,h[a],r,s,n,f!==a),u[a]=l.end;for(o in e)p[o]=e[o];return p.values=u,(s=new d(t,"bezier",0,0,l.pt,2)).data=l,s.plugin=n,s.setRatio=c,0===p.autoRotate&&(p.autoRotate=!0),!p.autoRotate||p.autoRotate instanceof Array||(a=!0===p.autoRotate?0:Number(p.autoRotate),p.autoRotate=null!=l.end.left?[["left","top","rotation",a,!1]]:null!=l.end.x&&[["x","y","rotation",a,!1]]),p.autoRotate&&(r._transform||r._enableTransforms(!1),l.autoRotate=r._target._fwdTransform,l.proxy.rotation=l.autoRotate.rotation||0,r._overwriteProps.push("rotation")),n._onInitTween(l.proxy,p,r._tween),s}}))},t._mod=function(t){for(var e,i=this._overwriteProps,r=i.length;-1<--r;)(e=t[i[r]])&&"function"==typeof e&&(this._mod[i[r]]=e)},t._kill=function(t){var e,i,r=this._props;for(e in this._beziers)if(e in t)for(delete this._beziers[e],delete this._func[e],i=r.length;-1<--i;)r[i]===e&&r.splice(i,1);if(r=this._autoRotate)for(i=r.length;-1<--i;)t[r[i][2]]&&r.splice(i,1);return this._super._kill.call(this,t)},_fwd_fwdScope.FWDFWD_fwdDefine("plugins.CSSPlugin",["plugins.TweenPlugin","FWDTweenLite"],function(n,B){var c,P,O,d,W=function(){n.call(this,"css"),this._overwriteProps.length=0,this.setRatio=W.prototype.setRatio},h=_fwd_fwdScope.FWDFWD_fwdDefine.globals,m={},t=W.prototype=new n("css");(t.constructor=W).version="1.19.0",W.API=2,W.defaultTransformPerspective=0,W.defaultSkewType="compensated",W.defaultSmoothOrigin=!0,t="px",W.suffixMap={top:t,right:t,bottom:t,left:t,width:t,height:t,fontSize:t,padding:t,margin:t,perspective:t,lineHeight:""};function a(t,e){return e.toUpperCase()}function e(t){return K.createElementNS?K.createElementNS("http://www.w3.org/1999/xhtml",t):K.createElement(t)}function o(t){return N.test("string"==typeof t?t:(t.currentStyle?t.currentStyle.filter:t.style.filter)||"")?parseFloat(RegExp.$1)/100:1}function g(t){window.console&&console.log(t)}function k(t,e){var i,r,s=(e=e||J).style;if(void 0!==s[t])return t;for(t=t.charAt(0).toUpperCase()+t.substr(1),i=["O","Moz","ms","Ms","Webkit"],r=5;-1<--r&&void 0===s[i[r]+t];);return 0<=r?(st="-"+(nt=3===r?"ms":i[r]).toLowerCase()+"-",nt+t):null}function y(t,e){var i,r,s,n={};if(e=e||at(t,null))if(i=e.length)for(;-1<--i;)-1!==(s=e[i]).indexOf("-transform")&&It!==s||(n[s.replace(p,a)]=e.getPropertyValue(s));else for(i in e)-1!==i.indexOf("Transform")&&Xt!==i||(n[i]=e[i]);else if(e=t.currentStyle||t.style)for(i in e)"string"==typeof i&&void 0===n[i]&&(n[i.replace(p,a)]=e[i]);return rt||(n.opacity=o(t)),r=Zt(t,e,!1),n.rotation=r.rotation,n.skewX=r.skewX,n.scaleX=r.scaleX,n.scaleY=r.scaleY,n.x=r.x,n.y=r.y,Yt&&(n.z=r.z,n.rotationX=r.rotationX,n.rotationY=r.rotationY,n.scaleZ=r.scaleZ),n.filters&&delete n.filters,n}function v(t,e,i,r,s){var n,a,o,l={},h=t.style;for(a in i)"cssText"!==a&&"length"!==a&&isNaN(a)&&(e[a]!==(n=i[a])||s&&s[a])&&-1===a.indexOf("Origin")&&("number"!=typeof n&&"string"!=typeof n||(l[a]="auto"!==n||"left"!==a&&"top"!==a?""!==n&&"auto"!==n&&"none"!==n||"string"!=typeof e[a]||""===e[a].replace(f,"")?n:0:ht(t,a),void 0!==h[a]&&(o=new vt(h,a,h[a],o))));if(r)for(a in r)"className"!==a&&(l[a]=r[a]);return{difs:l,firstMPT:o}}function R(t,e){return"function"==typeof t&&(t=t(D,F)),"string"==typeof t&&"="===t.charAt(1)?parseInt(t.charAt(0)+"1",10)*parseFloat(t.substr(2)):parseFloat(t)-parseFloat(e)||0}function S(t,e){return"function"==typeof t&&(t=t(D,F)),null==t?e:"string"==typeof t&&"="===t.charAt(1)?parseInt(t.charAt(0)+"1",10)*parseFloat(t.substr(2))+e:parseFloat(t)||0}function A(t,e,i,r){var s,n,a,o,l;return"function"==typeof t&&(t=t(D,F)),(o=null==t?e:"number"==typeof t?t:(s=360,n=t.split("_"),a=((l="="===t.charAt(1))?parseInt(t.charAt(0)+"1",10)*parseFloat(n[0].substr(2)):parseFloat(n[0]))*(-1===t.indexOf("rad")?1:G)-(l?0:e),n.length&&(r&&(r[i]=e+a),-1!==t.indexOf("short")&&(a%=s)!==a%180&&(a=a<0?a+s:a-s),-1!==t.indexOf("_cw")&&a<0?a=(a+3599999999640)%s-(a/s|0)*s:-1!==t.indexOf("ccw")&&0<a&&(a=(a-3599999999640)%s-(a/s|0)*s)),e+a))<1e-6&&-1e-6<o&&(o=0),o}function _(t,e,i){return 255*(6*(t=t<0?t+1:1<t?t-1:t)<1?e+(i-e)*t*6:t<.5?i:3*t<2?e+(i-e)*(2/3-t)*6:e)+.5|0}function r(t,e){for(var i,r,s=t.match(dt)||[],n=0,a=s.length?"":t,o=0;o<s.length;o++)i=s[o],n+=(r=t.substr(n,t.indexOf(i,n)-n)).length+i.length,3===(i=ct(i,e)).length&&i.push(1),a+=r+(e?"hsla("+i[0]+","+i[1]+"%,"+i[2]+"%,"+i[3]:"rgba("+i.join(","))+")";return a+t.substr(n)}var M,x,w,Y,T,C,F,D,i,s,z=/(?:\-|\.|\b)(\d|\.|e\-)+/g,X=/(?:\d|\-\d|\.\d|\-\.\d|\+=\d|\-=\d|\+=.\d|\-=\.\d)+/g,b=/(?:\+=|\-=|\-|\b)[\d\-\.]+[a-zA-Z0-9]*(?:%|\b)/gi,f=/(?![+-]?\d*\.?\d+|[+-]|e[+-]\d+)[^0-9]/g,I=/(?:\d|\-|\+|=|#|\.)*/g,N=/opacity *= *([^)]*)/i,E=/opacity:([^;]*)/i,l=/alpha\(opacity *=.+?\)/i,L=/^(rgb|hsl)/,u=/([A-Z])/g,p=/-([a-z])/gi,j=/(^(?:url\(\"|url\())|(?:(\"\))$|\)$)/gi,V=/(?:Left|Right|Width)/i,q=/(M11|M12|M21|M22)=[\d\-\.e]+/gi,Z=/progid\:DXImageTransform\.Microsoft\.Matrix\(.+?\)/i,U=/,(?=[^\)]*(?:\(|$))/gi,$=/[\s,\(]/i,Q=Math.PI/180,G=180/Math.PI,H={},K=document,J=e("div"),tt=e("img"),et=W._internals={_specialProps:m},it=navigator.userAgent,rt=(i=it.indexOf("Android"),s=e("a"),w=-1!==it.indexOf("Safari")&&-1===it.indexOf("Chrome")&&(-1===i||3<Number(it.substr(i+8,1))),T=w&&Number(it.substr(it.indexOf("Version/")+8,1))<6,Y=-1!==it.indexOf("Firefox"),(/MSIE ([0-9]{1,}[\.0-9]{0,})/.exec(it)||/Trident\/.*rv:([0-9]{1,}[\.0-9]{0,})/.exec(it))&&(C=parseFloat(RegExp.$1)),!!s&&(s.style.cssText="top:1px;opacity:.55;",/^0.55/.test(s.style.opacity))),st="",nt="",at=K.defaultView?K.defaultView.getComputedStyle:function(){},ot=W.getStyle=function(t,e,i,r,s){var n;return rt||"opacity"!==e?(!r&&t.style[e]?n=t.style[e]:(i=i||at(t))?n=i[e]||i.getPropertyValue(e)||i.getPropertyValue(e.replace(u,"-$1").toLowerCase()):t.currentStyle&&(n=t.currentStyle[e]),null==s||n&&"none"!==n&&"auto"!==n&&"auto auto"!==n?n:s):o(t)},lt=et.convertToPixels=function(t,e,i,r,s){if("px"===r||!r)return i;if("auto"===r||!i)return 0;var n,a,o,l=V.test(e),h=t,f=J.style,u=i<0,p=1===i;if(u&&(i=-i),p&&(i*=100),"%"===r&&-1!==e.indexOf("border"))n=i/100*(l?t.clientWidth:t.clientHeight);else{if(f.cssText="border:0 solid red;position:"+ot(t,"position")+";line-height:0;","%"!==r&&h.appendChild&&"v"!==r.charAt(0)&&"rem"!==r)f[l?"borderLeftWidth":"borderTopWidth"]=i+r;else{if(a=(h=t.parentNode||K.body)._fwdCache,o=B.ticker.frame,a&&l&&a.time===o)return a.width*i/100;f[l?"width":"height"]=i+r}h.appendChild(J),n=parseFloat(J[l?"offsetWidth":"offsetHeight"]),h.removeChild(J),l&&"%"===r&&!1!==W.cacheWidths&&((a=h._fwdCache=h._fwdCache||{}).time=o,a.width=n/i*100),0!==n||s||(n=lt(t,e,i,r,!0))}return p&&(n/=100),u?-n:n},ht=et.calculateOffset=function(t,e,i){if("absolute"!==ot(t,"position",i))return 0;var r="left"===e?"Left":"Top",s=ot(t,"margin"+r,i);return t["offset"+r]-(lt(t,e,parseFloat(s),s.replace(I,""))||0)},ft={width:["Left","Right"],height:["Top","Bottom"]},ut=["marginLeft","marginRight","marginTop","marginBottom"],pt=function(t,e){if("contain"===t||"auto"===t||"auto auto"===t)return t+" ";null!=t&&""!==t||(t="0 0");var i,r=t.split(" "),s=-1!==t.indexOf("left")?"0%":-1!==t.indexOf("right")?"100%":r[0],n=-1!==t.indexOf("top")?"0%":-1!==t.indexOf("bottom")?"100%":r[1];if(3<r.length&&!e){for(r=t.split(", ").join(",").split(","),t=[],i=0;i<r.length;i++)t.push(pt(r[i]));return t.join(",")}return null==n?n="center"===s?"50%":"0":"center"===n&&(n="50%"),("center"===s||isNaN(parseFloat(s))&&-1===(s+"").indexOf("="))&&(s="50%"),t=s+" "+n+(2<r.length?" "+r[2]:""),e&&(e.oxp=-1!==s.indexOf("%"),e.oyp=-1!==n.indexOf("%"),e.oxr="="===s.charAt(1),e.oyr="="===n.charAt(1),e.ox=parseFloat(s.replace(f,"")),e.oy=parseFloat(n.replace(f,"")),e.v=t),e||t},_t={aqua:[0,255,255],lime:[0,255,0],silver:[192,192,192],black:[0,0,0],maroon:[128,0,0],teal:[0,128,128],blue:[0,0,255],navy:[0,0,128],white:[255,255,255],fuchsia:[255,0,255],olive:[128,128,0],yellow:[255,255,0],orange:[255,165,0],gray:[128,128,128],purple:[128,0,128],green:[0,128,0],red:[255,0,0],pink:[255,192,203],cyan:[0,255,255],transparent:[255,255,255,0]},ct=W.parseColor=function(t,e){var i,r,s,n,a,o,l,h,f,u,p;if(t)if("number"==typeof t)i=[t>>16,t>>8&255,255&t];else{if(","===t.charAt(t.length-1)&&(t=t.substr(0,t.length-1)),_t[t])i=_t[t];else if("#"===t.charAt(0))4===t.length&&(t="#"+(r=t.charAt(1))+r+(s=t.charAt(2))+s+(n=t.charAt(3))+n),i=[(t=parseInt(t.substr(1),16))>>16,t>>8&255,255&t];else if("hsl"===t.substr(0,3))if(i=p=t.match(z),e){if(-1!==t.indexOf("="))return t.match(X)}else a=Number(i[0])%360/360,o=Number(i[1])/100,r=2*(l=Number(i[2])/100)-(s=l<=.5?l*(o+1):l+o-l*o),3<i.length&&(i[3]=Number(t[3])),i[0]=_(a+1/3,r,s),i[1]=_(a,r,s),i[2]=_(a-1/3,r,s);else i=t.match(z)||_t.transparent;i[0]=Number(i[0]),i[1]=Number(i[1]),i[2]=Number(i[2]),3<i.length&&(i[3]=Number(i[3]))}else i=_t.black;return e&&!p&&(r=i[0]/255,s=i[1]/255,n=i[2]/255,l=((h=Math.max(r,s,n))+(f=Math.min(r,s,n)))/2,h===f?a=o=0:(u=h-f,o=.5<l?u/(2-h-f):u/(h+f),a=h===r?(s-n)/u+(s<n?6:0):h===s?(n-r)/u+2:(r-s)/u+4,a*=60),i[0]=a+.5|0,i[1]=100*o+.5|0,i[2]=100*l+.5|0),i},dt="(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3}){1,2}\\b";for(t in _t)dt+="|"+t+"\\b";dt=new RegExp(dt+")","gi"),W.colorStringFilter=function(t){var e,i=t[0]+t[1];dt.test(i)&&(e=-1!==i.indexOf("hsl(")||-1!==i.indexOf("hsla("),t[0]=r(t[0],e),t[1]=r(t[1],e)),dt.lastIndex=0},B.defaultStringFilter||(B.defaultStringFilter=W.colorStringFilter);function mt(t,e,n,a){if(null==t)return function(t){return t};var o,l=e?(t.match(dt)||[""])[0]:"",h=t.split(l).join("").match(b)||[],f=t.substr(0,t.indexOf(h[0])),u=")"===t.charAt(t.length-1)?")":"",p=-1!==t.indexOf(" ")?" ":",",_=h.length,c=0<_?h[0].replace(z,""):"";return _?o=e?function(t){var e,i,r,s;if("number"==typeof t)t+=c;else if(a&&U.test(t)){for(s=t.replace(U,"|").split("|"),r=0;r<s.length;r++)s[r]=o(s[r]);return s.join(",")}if(e=(t.match(dt)||[l])[0],r=(i=t.split(e).join("").match(b)||[]).length,_>r--)for(;++r<_;)i[r]=n?i[(r-1)/2|0]:h[r];return f+i.join(p)+p+e+u+(-1!==t.indexOf("inset")?" inset":"")}:function(t){var e,i,r;if("number"==typeof t)t+=c;else if(a&&U.test(t)){for(i=t.replace(U,"|").split("|"),r=0;r<i.length;r++)i[r]=o(i[r]);return i.join(",")}if(r=(e=t.match(b)||[]).length,_>r--)for(;++r<_;)e[r]=n?e[(r-1)/2|0]:h[r];return f+e.join(p)+u}:function(t){return t}}function gt(h){return h=h.split(","),function(t,e,i,r,s,n,a){var o,l=(e+"").split(" ");for(a={},o=0;o<4;o++)a[h[o]]=l[o]=l[o]||l[(o-1)/2>>0];return r.parse(t,a,s,n)}}et._setPluginRatio=function(t){this.plugin.setRatio(t);for(var e,i,r,s,n,a=this.data,o=a.proxy,l=a.firstMPT;l;)e=o[l.v],l.r?e=Math.round(e):e<1e-6&&-1e-6<e&&(e=0),l.t[l.p]=e,l=l._next;if(a.autoRotate&&(a.autoRotate.rotation=a.mod?a.mod(o.rotation,this.t):o.rotation),1===t||0===t)for(l=a.firstMPT,n=1===t?"e":"b";l;){if((i=l.t).type){if(1===i.type){for(s=i.xs0+i.s+i.xs1,r=1;r<i.l;r++)s+=i["xn"+r]+i["xs"+(r+1)];i[n]=s}}else i[n]=i.s+i.xs0;l=l._next}};function yt(t,e,i,r,s,n){var a=new xt(t,e,i,r-i,s,-1,n);return a.b=i,a.e=a.xs0=r,a}var vt=function(t,e,i,r,s){this.t=t,this.p=e,this.v=i,this.r=s,r&&((r._prev=this)._next=r)},xt=(et._parseToProxy=function(t,e,i,r,s,n){var a,o,l,h,f,u=r,p={},_={},c=i._transform,d=H;for(i._transform=null,H=e,r=f=i.parse(t,e,r,s),H=d,n&&(i._transform=c,u&&(u._prev=null,u._prev&&(u._prev._next=null)));r&&r!==u;){if(r.type<=1&&(_[o=r.p]=r.s+r.c,p[o]=r.s,n||(h=new vt(r,"s",o,h,r.r),r.c=0),1===r.type))for(a=r.l;0<--a;)l="xn"+a,_[o=r.p+"_"+l]=r.data[l],p[o]=r[l],n||(h=new vt(r,l,o,h,r.rxp[l]));r=r._next}return{proxy:p,end:_,firstMPT:h,pt:f}},et.CSSPropTween=function(t,e,i,r,s,n,a,o,l,h,f){this.t=t,this.p=e,this.s=i,this.c=r,this.n=a||e,t instanceof xt||d.push(this.n),this.r=o,this.type=n||0,l&&(this.pr=l,c=!0),this.b=void 0===h?i:h,this.e=void 0===f?i+r:f,s&&((this._next=s)._prev=this)}),wt=W.parseComplex=function(t,e,i,r,s,n,a,o,l,h){i=i||n||"","function"==typeof r&&(r=r(D,F)),a=new xt(t,e,0,0,a,h?2:1,null,!1,o,i,r),r+="",s&&dt.test(r+i)&&(r=[i,r],W.colorStringFilter(r),i=r[0],r=r[1]);var f,u,p,_,c,d,m,g,y,v,x,w,T,b=i.split(", ").join(",").split(" "),P=r.split(", ").join(",").split(" "),O=b.length,k=!1!==M;for(-1===r.indexOf(",")&&-1===i.indexOf(",")||(b=b.join(" ").replace(U,", ").split(" "),P=P.join(" ").replace(U,", ").split(" "),O=b.length),O!==P.length&&(O=(b=(n||"").split(" ")).length),a.plugin=l,a.setRatio=h,f=dt.lastIndex=0;f<O;f++)if(_=b[f],c=P[f],(g=parseFloat(_))||0===g)a.appendXtra("",g,R(c,g),c.replace(X,""),k&&-1!==c.indexOf("px"),!0);else if(s&&dt.test(_))w=")"+((w=c.indexOf(")")+1)?c.substr(w):""),T=-1!==c.indexOf("hsl")&&rt,_=ct(_,T),c=ct(c,T),(y=6<_.length+c.length)&&!rt&&0===c[3]?(a["xs"+a.l]+=a.l?" transparent":"transparent",a.e=a.e.split(P[f]).join("transparent")):(rt||(y=!1),T?a.appendXtra(y?"hsla(":"hsl(",_[0],R(c[0],_[0]),",",!1,!0).appendXtra("",_[1],R(c[1],_[1]),"%,",!1).appendXtra("",_[2],R(c[2],_[2]),y?"%,":"%"+w,!1):a.appendXtra(y?"rgba(":"rgb(",_[0],c[0]-_[0],",",!0,!0).appendXtra("",_[1],c[1]-_[1],",",!0).appendXtra("",_[2],c[2]-_[2],y?",":w,!0),y&&(_=_.length<4?1:_[3],a.appendXtra("",_,(c.length<4?1:c[3])-_,w,!1))),dt.lastIndex=0;else if(d=_.match(z)){if(!(m=c.match(X))||m.length!==d.length)return a;for(u=p=0;u<d.length;u++)x=d[u],v=_.indexOf(x,p),a.appendXtra(_.substr(p,v-p),Number(x),R(m[u],x),"",k&&"px"===_.substr(v+x.length,2),0===u),p=v+x.length;a["xs"+a.l]+=_.substr(p)}else a["xs"+a.l]+=a.l||a["xs"+a.l]?" "+c:c;if(-1!==r.indexOf("=")&&a.data){for(w=a.xs0+a.data.s,f=1;f<a.l;f++)w+=a["xs"+f]+a.data["xn"+f];a.e=w+a["xs"+f]}return a.l||(a.type=-1,a.xs0=a.e),a.xfirst||a},Tt=9;for((t=xt.prototype).l=t.pr=0;0<--Tt;)t["xn"+Tt]=0,t["xs"+Tt]="";t.xs0="",t._next=t._prev=t.xfirst=t.data=t.plugin=t.setRatio=t.rxp=null,t.appendXtra=function(t,e,i,r,s,n){var a=this,o=a.l;return a["xs"+o]+=n&&(o||a["xs"+o])?" "+t:t||"",i||0===o||a.plugin?(a.l++,a.type=a.setRatio?2:1,a["xs"+a.l]=r||"",0<o?(a.data["xn"+o]=e+i,a.rxp["xn"+o]=s,a["xn"+o]=e,a.plugin||(a.xfirst=new xt(a,"xn"+o,e,i,a.xfirst||a,0,a.n,s,a.pr),a.xfirst.xs0=0)):(a.data={s:e+i},a.rxp={},a.s=e,a.c=i,a.r=s),a):(a["xs"+o]+=e+(r||""),a)};function bt(t,e){e=e||{},this.p=e.prefix&&k(t)||t,(m[t]=m[this.p]=this).format=e.formatter||mt(e.defaultValue,e.color,e.collapsible,e.multi),e.parser&&(this.parse=e.parser),this.clrs=e.color,this.multi=e.multi,this.keyword=e.keyword,this.dflt=e.defaultValue,this.pr=e.priority||0}var Pt=et._registerComplexSpecialProp=function(t,e,i){"object"!=typeof e&&(e={parser:i});var r,s=t.split(","),n=e.defaultValue;for(i=i||[n],r=0;r<s.length;r++)e.prefix=0===r&&e.prefix,e.defaultValue=i[r]||n,new bt(s[r],e)},Ot=et._registerPluginProp=function(t){var l;m[t]||(l=t.charAt(0).toUpperCase()+t.substr(1)+"Plugin",Pt(t,{parser:function(t,e,i,r,s,n,a){var o=h.com.fwd.plugins[l];return o?(o._cssRegister(),m[i].parse(t,e,i,r,s,n,a)):(g("Error: "+l+" js file not loaded."),s)}}))};(t=bt.prototype).parseComplex=function(t,e,i,r,s,n){var a,o,l,h,f,u,p=this.keyword;if(this.multi&&(U.test(i)||U.test(e)?(o=e.replace(U,"|").split("|"),l=i.replace(U,"|").split("|")):p&&(o=[e],l=[i])),l){for(h=l.length>o.length?l.length:o.length,a=0;a<h;a++)e=o[a]=o[a]||this.dflt,i=l[a]=l[a]||this.dflt,p&&(f=e.indexOf(p))!==(u=i.indexOf(p))&&(-1===u?o[a]=o[a].split(p).join(""):-1===f&&(o[a]+=" "+p));e=o.join(", "),i=l.join(", ")}return wt(t,this.p,e,i,this.clrs,this.dflt,r,this.pr,s,n)},t.parse=function(t,e,i,r,s,n,a){return this.parseComplex(t.style,this.format(ot(t,this.p,O,!1,this.dflt)),this.format(e),s,n)},W.registerSpecialProp=function(t,l,h){Pt(t,{parser:function(t,e,i,r,s,n,a){var o=new xt(t,i,0,0,s,2,i,!1,h);return o.plugin=n,o.setRatio=l(t,e,r._tween,i),o},priority:h})},W.useSVGTransformAttr=w||Y;function kt(t,e,i){var r,s=K.createElementNS("http://www.w3.org/2000/svg",t),n=/([a-z])([A-Z])/g;for(r in i)s.setAttributeNS(null,r.replace(n,"$1-$2").toLowerCase(),i[r]);return e.appendChild(s),s}function Rt(t,e,i,r,s,n){var a,o,l,h,f,u,p,_,c,d,m,g,y,v,x=t._fwdTransform,w=qt(t,!0);x&&(y=x.xOrigin,v=x.yOrigin),(!r||(a=r.split(" ")).length<2)&&(p=t.getBBox(),a=[(-1!==(e=pt(e).split(" "))[0].indexOf("%")?parseFloat(e[0])/100*p.width:parseFloat(e[0]))+p.x,(-1!==e[1].indexOf("%")?parseFloat(e[1])/100*p.height:parseFloat(e[1]))+p.y]),i.xOrigin=h=parseFloat(a[0]),i.yOrigin=f=parseFloat(a[1]),r&&w!==Vt&&(u=w[0],p=w[1],_=w[2],c=w[3],d=w[4],o=h*(c/(g=u*c-p*_))+f*(-_/g)+(_*(m=w[5])-c*d)/g,l=h*(-p/g)+f*(u/g)-(u*m-p*d)/g,h=i.xOrigin=a[0]=o,f=i.yOrigin=a[1]=l),x&&(n&&(i.xOffset=x.xOffset,i.yOffset=x.yOffset,x=i),s||!1!==s&&!1!==W.defaultSmoothOrigin?(o=h-y,l=f-v,x.xOffset+=o*w[0]+l*w[2]-o,x.yOffset+=o*w[1]+l*w[3]-l):x.xOffset=x.yOffset=0),n||t.setAttribute("data-svg-origin",a.join(" "))}function St(t){var e,i,r=this.data,s=-r.rotation*Q,n=s+r.skewX*Q,a=1e5,o=(Math.cos(s)*r.scaleX*a|0)/a,l=(Math.sin(s)*r.scaleX*a|0)/a,h=(Math.sin(n)*-r.scaleY*a|0)/a,f=(Math.cos(n)*r.scaleY*a|0)/a,u=this.t.style,p=this.t.currentStyle;if(p){i=l,l=-h,h=-i,e=p.filter,u.filter="";var _=this.t.offsetWidth,c=this.t.offsetHeight,d="absolute"!==p.position,m="progid:DXImageTransform.Microsoft.Matrix(M11="+o+", M12="+l+", M21="+h+", M22="+f,g=r.x+_*r.xPercent/100,y=r.y+c*r.yPercent/100;if(null!=r.ox&&(g+=(b=(r.oxp?_*r.ox*.01:r.ox)-_/2)-(b*o+(P=(r.oyp?c*r.oy*.01:r.oy)-c/2)*l),y+=P-(b*h+P*f)),m+=d?", Dx="+((b=_/2)-(b*o+(P=c/2)*l)+g)+", Dy="+(P-(b*h+P*f)+y)+")":", sizingMethod='auto expand')",-1!==e.indexOf("DXImageTransform.Microsoft.Matrix(")?u.filter=e.replace(Z,m):u.filter=m+" "+e,0!==t&&1!==t||1==o&&0===l&&0===h&&1==f&&(d&&-1===m.indexOf("Dx=0, Dy=0")||N.test(e)&&100!==parseFloat(RegExp.$1)||-1===e.indexOf(e.indexOf("Alpha"))&&u.removeAttribute("filter")),!d){var v,x,w,T=C<8?1:-1,b=r.ieOffsetX||0,P=r.ieOffsetY||0;for(r.ieOffsetX=Math.round((_-((o<0?-o:o)*_+(l<0?-l:l)*c))/2+g),r.ieOffsetY=Math.round((c-((f<0?-f:f)*c+(h<0?-h:h)*_))/2+y),Tt=0;Tt<4;Tt++)w=(i=-1!==(v=p[x=ut[Tt]]).indexOf("px")?parseFloat(v):lt(this.t,x,parseFloat(v),v.replace(I,""))||0)!==r[x]?Tt<2?-r.ieOffsetX:-r.ieOffsetY:Tt<2?b-r.ieOffsetX:P-r.ieOffsetY,u[x]=(r[x]=Math.round(i-w*(0===Tt||2===Tt?1:T)))+"px"}}}var At,Mt,Ct,Ft,Dt,zt="scaleX,scaleY,scaleZ,x,y,z,skewX,skewY,rotation,rotationX,rotationY,perspective,xPercent,yPercent".split(","),Xt=k("transform"),It=st+"transform",Nt=k("transformOrigin"),Yt=null!==k("perspective"),Et=et.Transform=function(){this.perspective=parseFloat(W.defaultTransformPerspective)||0,this.force3D=!(!1===W.defaultForce3D||!Yt)&&(W.defaultForce3D||"auto")},Bt=window.SVGElement,Wt=K.documentElement,Lt=(Dt=C||/Android/i.test(it)&&!window.chrome,K.createElementNS&&!Dt&&(Mt=kt("svg",Wt),Ft=(Ct=kt("rect",Mt,{width:100,height:50,x:100})).getBoundingClientRect().width,Ct.style[Nt]="50% 50%",Ct.style[Xt]="scaleX(0.5)",Dt=Ft===Ct.getBoundingClientRect().width&&!(Y&&Yt),Wt.removeChild(Mt)),Dt),jt=function(t){return!!(Bt&&t.getBBox&&t.getCTM&&function(t){try{return t.getBBox()}catch(t){}}(t)&&(!t.parentNode||t.parentNode.getBBox&&t.parentNode.getCTM))},Vt=[1,0,0,1,0,0],qt=function(t,e){var i,r,s,n,a,o,l=t._fwdTransform||new Et,h=t.style;if(Xt?r=ot(t,It,null,!0):t.currentStyle&&(r=(r=t.currentStyle.filter.match(q))&&4===r.length?[r[0].substr(4),Number(r[2].substr(4)),Number(r[1].substr(4)),r[3].substr(4),l.x||0,l.y||0].join(","):""),(i=!r||"none"===r||"matrix(1, 0, 0, 1, 0, 0)"===r)&&Xt&&((o="none"===at(t).display)||!t.parentNode)&&(o&&(n=h.display,h.display="block"),t.parentNode||(a=1,Wt.appendChild(t)),i=!(r=ot(t,It,null,!0))||"none"===r||"matrix(1, 0, 0, 1, 0, 0)"===r,n?h.display=n:o&&Gt(h,"display"),a&&Wt.removeChild(t)),(l.svg||t.getBBox&&jt(t))&&(i&&-1!==(h[Xt]+"").indexOf("matrix")&&(r=h[Xt],i=0),s=t.getAttribute("transform"),i&&s&&(-1!==s.indexOf("matrix")?(r=s,i=0):-1!==s.indexOf("translate")&&(r="matrix(1,0,0,1,"+s.match(/(?:\-|\b)[\d\-\.e]+\b/gi).join(",")+")",i=0))),i)return Vt;for(s=(r||"").match(z)||[],Tt=s.length;-1<--Tt;)n=Number(s[Tt]),s[Tt]=(a=n-(n|=0))?(1e5*a+(a<0?-.5:.5)|0)/1e5+n:n;return e&&6<s.length?[s[0],s[1],s[4],s[5],s[12],s[13]]:s},Zt=et.getTransform=function(t,e,i,r){if(t._fwdTransform&&i&&!r)return t._fwdTransform;var s,n,a,o,l,h,f,u,p,_,c,d,m,g,y,v,x,w,T,b,P,O,k,R,S,A,M,C,F,D,z,X,I=i&&t._fwdTransform||new Et,N=I.scaleX<0,Y=Yt&&(parseFloat(ot(t,Nt,e,!1,"0 0 0").split(" ")[2])||I.zOrigin)||0,E=parseFloat(W.defaultTransformPerspective)||0;if(I.svg=!(!t.getBBox||!jt(t)),I.svg&&(Rt(t,ot(t,Nt,e,!1,"50% 50%")+"",I,t.getAttribute("data-svg-origin")),At=W.useSVGTransformAttr||Lt),(s=qt(t))!==Vt)for(n in 16===s.length?(f=s[0],u=s[1],p=s[2],_=s[3],c=s[4],d=s[5],m=s[6],g=s[7],y=s[8],v=s[9],x=s[10],w=s[12],T=s[13],b=s[14],P=s[11],O=Math.atan2(m,x),I.zOrigin&&(w=y*(b=-I.zOrigin)-s[12],T=v*b-s[13],b=x*b+I.zOrigin-s[14]),I.rotationX=O*G,O&&(k=c*(A=Math.cos(-O))+y*(M=Math.sin(-O)),R=d*A+v*M,S=m*A+x*M,y=c*-M+y*A,v=d*-M+v*A,x=m*-M+x*A,P=g*-M+P*A,c=k,d=R,m=S),O=Math.atan2(-p,x),I.rotationY=O*G,O&&(R=u*(A=Math.cos(-O))-v*(M=Math.sin(-O)),S=p*A-x*M,v=u*M+v*A,x=p*M+x*A,P=_*M+P*A,f=k=f*A-y*M,u=R,p=S),O=Math.atan2(u,f),I.rotation=O*G,O&&(f=f*(A=Math.cos(-O))+c*(M=Math.sin(-O)),R=u*A+d*M,d=u*-M+d*A,m=p*-M+m*A,u=R),I.rotationX&&359.9<Math.abs(I.rotationX)+Math.abs(I.rotation)&&(I.rotationX=I.rotation=0,I.rotationY=180-I.rotationY),I.scaleX=(1e5*Math.sqrt(f*f+u*u)+.5|0)/1e5,I.scaleY=(1e5*Math.sqrt(d*d+v*v)+.5|0)/1e5,I.scaleZ=(1e5*Math.sqrt(m*m+x*x)+.5|0)/1e5,I.rotationX||I.rotationY?I.skewX=0:(I.skewX=c||d?Math.atan2(c,d)*G+I.rotation:I.skewX||0,90<Math.abs(I.skewX)&&Math.abs(I.skewX)<270&&(N?(I.scaleX*=-1,I.skewX+=I.rotation<=0?180:-180,I.rotation+=I.rotation<=0?180:-180):(I.scaleY*=-1,I.skewX+=I.skewX<=0?180:-180))),I.perspective=P?1/(P<0?-P:P):0,I.x=w,I.y=T,I.z=b,I.svg&&(I.x-=I.xOrigin-(I.xOrigin*f-I.yOrigin*c),I.y-=I.yOrigin-(I.yOrigin*u-I.xOrigin*d))):Yt&&!r&&s.length&&I.x===s[4]&&I.y===s[5]&&(I.rotationX||I.rotationY)||(F=(C=6<=s.length)?s[0]:1,D=s[1]||0,z=s[2]||0,X=C?s[3]:1,I.x=s[4]||0,I.y=s[5]||0,a=Math.sqrt(F*F+D*D),o=Math.sqrt(X*X+z*z),l=F||D?Math.atan2(D,F)*G:I.rotation||0,h=z||X?Math.atan2(z,X)*G+l:I.skewX||0,90<Math.abs(h)&&Math.abs(h)<270&&(N?(a*=-1,h+=l<=0?180:-180,l+=l<=0?180:-180):(o*=-1,h+=h<=0?180:-180)),I.scaleX=a,I.scaleY=o,I.rotation=l,I.skewX=h,Yt&&(I.rotationX=I.rotationY=I.z=0,I.perspective=E,I.scaleZ=1),I.svg&&(I.x-=I.xOrigin-(I.xOrigin*F+I.yOrigin*z),I.y-=I.yOrigin-(I.xOrigin*D+I.yOrigin*X))),I.zOrigin=Y,I)I[n]<2e-5&&-2e-5<I[n]&&(I[n]=0);return i&&(t._fwdTransform=I).svg&&(At&&t.style[Xt]?B.delayedCall(.001,function(){Gt(t.style,Xt)}):!At&&t.getAttribute("transform")&&B.delayedCall(.001,function(){t.removeAttribute("transform")})),I},Ut=et.set3DTransformRatio=et.setTransformRatio=function(t){var e,i,r,s,n,a,o,l,h,f,u,p,_,c,d,m,g,y,v,x,w,T,b,P=this.data,O=this.t.style,k=P.rotation,R=P.rotationX,S=P.rotationY,A=P.scaleX,M=P.scaleY,C=P.scaleZ,F=P.x,D=P.y,z=P.z,X=P.svg,I=P.perspective,N=P.force3D;if(!((1!==t&&0!==t||"auto"!==N||this.tween._totalTime!==this.tween._totalDuration&&this.tween._totalTime)&&N||z||I||S||R||1!==C)||At&&X||!Yt)k||P.skewX||X?(k*=Q,T=P.skewX*Q,b=1e5,e=Math.cos(k)*A,s=Math.sin(k)*A,i=Math.sin(k-T)*-M,n=Math.cos(k-T)*M,T&&"simple"===P.skewType&&(g=Math.tan(T-P.skewY*Q),i*=g=Math.sqrt(1+g*g),n*=g,P.skewY&&(g=Math.tan(P.skewY*Q),e*=g=Math.sqrt(1+g*g),s*=g)),X&&(F+=P.xOrigin-(P.xOrigin*e+P.yOrigin*i)+P.xOffset,D+=P.yOrigin-(P.xOrigin*s+P.yOrigin*n)+P.yOffset,At&&(P.xPercent||P.yPercent)&&(c=this.t.getBBox(),F+=.01*P.xPercent*c.width,D+=.01*P.yPercent*c.height),F<(c=1e-6)&&-c<F&&(F=0),D<c&&-c<D&&(D=0)),v=(e*b|0)/b+","+(s*b|0)/b+","+(i*b|0)/b+","+(n*b|0)/b+","+F+","+D+")",X&&At?this.t.setAttribute("transform","matrix("+v):O[Xt]=(P.xPercent||P.yPercent?"translate("+P.xPercent+"%,"+P.yPercent+"%) matrix(":"matrix(")+v):O[Xt]=(P.xPercent||P.yPercent?"translate("+P.xPercent+"%,"+P.yPercent+"%) matrix(":"matrix(")+A+",0,0,"+M+","+F+","+D+")";else{if(Y&&(A<(c=1e-4)&&-c<A&&(A=C=2e-5),M<c&&-c<M&&(M=C=2e-5),!I||P.z||P.rotationX||P.rotationY||(I=0)),k||P.skewX)k*=Q,d=e=Math.cos(k),m=s=Math.sin(k),P.skewX&&(k-=P.skewX*Q,d=Math.cos(k),m=Math.sin(k),"simple"===P.skewType&&(g=Math.tan((P.skewX-P.skewY)*Q),d*=g=Math.sqrt(1+g*g),m*=g,P.skewY&&(g=Math.tan(P.skewY*Q),e*=g=Math.sqrt(1+g*g),s*=g))),i=-m,n=d;else{if(!(S||R||1!==C||I||X))return void(O[Xt]=(P.xPercent||P.yPercent?"translate("+P.xPercent+"%,"+P.yPercent+"%) translate3d(":"translate3d(")+F+"px,"+D+"px,"+z+"px)"+(1!==A||1!==M?" scale("+A+","+M+")":""));e=n=1,i=s=0}h=1,r=a=o=l=f=u=0,p=I?-1/I:0,_=P.zOrigin,c=1e-6,x=",",w="0",(k=S*Q)&&(d=Math.cos(k),f=p*(o=-(m=Math.sin(k))),r=e*m,a=s*m,p*=h=d,e*=d,s*=d),(k=R*Q)&&(g=i*(d=Math.cos(k))+r*(m=Math.sin(k)),y=n*d+a*m,l=h*m,u=p*m,r=i*-m+r*d,a=n*-m+a*d,h*=d,p*=d,i=g,n=y),1!==C&&(r*=C,a*=C,h*=C,p*=C),1!==M&&(i*=M,n*=M,l*=M,u*=M),1!==A&&(e*=A,s*=A,o*=A,f*=A),(_||X)&&(_&&(F+=r*-_,D+=a*-_,z+=h*-_+_),X&&(F+=P.xOrigin-(P.xOrigin*e+P.yOrigin*i)+P.xOffset,D+=P.yOrigin-(P.xOrigin*s+P.yOrigin*n)+P.yOffset),F<c&&-c<F&&(F=w),D<c&&-c<D&&(D=w),z<c&&-c<z&&(z=0)),v=P.xPercent||P.yPercent?"translate("+P.xPercent+"%,"+P.yPercent+"%) matrix3d(":"matrix3d(",v+=(e<c&&-c<e?w:e)+x+(s<c&&-c<s?w:s)+x+(o<c&&-c<o?w:o),v+=x+(f<c&&-c<f?w:f)+x+(i<c&&-c<i?w:i)+x+(n<c&&-c<n?w:n),R||S||1!==C?(v+=x+(l<c&&-c<l?w:l)+x+(u<c&&-c<u?w:u)+x+(r<c&&-c<r?w:r),v+=x+(a<c&&-c<a?w:a)+x+(h<c&&-c<h?w:h)+x+(p<c&&-c<p?w:p)+x):v+=",0,0,0,0,1,0,",v+=F+x+D+x+z+x+(I?1+-z/I:1)+")",O[Xt]=v}};(t=Et.prototype).x=t.y=t.z=t.skewX=t.skewY=t.rotation=t.rotationX=t.rotationY=t.zOrigin=t.xPercent=t.yPercent=t.xOffset=t.yOffset=0,t.scaleX=t.scaleY=t.scaleZ=1,Pt("transform,scale,scaleX,scaleY,scaleZ,x,y,z,rotation,rotationX,rotationY,rotationZ,skewX,skewY,shortRotation,shortRotationX,shortRotationY,shortRotationZ,transformOrigin,svgOrigin,transformPerspective,directionalRotation,parseTransform,force3D,skewType,xPercent,yPercent,smoothOrigin",{parser:function(t,e,i,r,s,n,a){if(r._lastParsedTransform===a)return s;var o;"function"==typeof(r._lastParsedTransform=a)[i]&&(o=a[i],a[i]=e);var l,h,f,u,p,_,c,d,m,g=t._fwdTransform,y=t.style,v=zt.length,x=a,w={},T="transformOrigin",b=Zt(t,O,!0,x.parseTransform),P=x.transform&&("function"==typeof x.transform?x.transform(D,F):x.transform);if(r._transform=b,P&&"string"==typeof P&&Xt)(h=J.style)[Xt]=P,h.display="block",h.position="absolute",K.body.appendChild(J),l=Zt(J,null,!1),b.svg&&(_=b.xOrigin,c=b.yOrigin,l.x-=b.xOffset,l.y-=b.yOffset,(x.transformOrigin||x.svgOrigin)&&(P={},Rt(t,pt(x.transformOrigin),P,x.svgOrigin,x.smoothOrigin,!0),_=P.xOrigin,c=P.yOrigin,l.x-=P.xOffset-b.xOffset,l.y-=P.yOffset-b.yOffset),(_||c)&&(d=qt(J,!0),l.x-=_-(_*d[0]+c*d[2]),l.y-=c-(_*d[1]+c*d[3]))),K.body.removeChild(J),l.perspective||(l.perspective=b.perspective),null!=x.xPercent&&(l.xPercent=S(x.xPercent,b.xPercent)),null!=x.yPercent&&(l.yPercent=S(x.yPercent,b.yPercent));else if("object"==typeof x){if(l={scaleX:S(null!=x.scaleX?x.scaleX:x.scale,b.scaleX),scaleY:S(null!=x.scaleY?x.scaleY:x.scale,b.scaleY),scaleZ:S(x.scaleZ,b.scaleZ),x:S(x.x,b.x),y:S(x.y,b.y),z:S(x.z,b.z),xPercent:S(x.xPercent,b.xPercent),yPercent:S(x.yPercent,b.yPercent),perspective:S(x.transformPerspective,b.perspective)},null!=(p=x.directionalRotation))if("object"==typeof p)for(h in p)x[h]=p[h];else x.rotation=p;"string"==typeof x.x&&-1!==x.x.indexOf("%")&&(l.x=0,l.xPercent=S(x.x,b.xPercent)),"string"==typeof x.y&&-1!==x.y.indexOf("%")&&(l.y=0,l.yPercent=S(x.y,b.yPercent)),l.rotation=A("rotation"in x?x.rotation:"shortRotation"in x?x.shortRotation+"_short":"rotationZ"in x?x.rotationZ:b.rotation-b.skewY,b.rotation-b.skewY,"rotation",w),Yt&&(l.rotationX=A("rotationX"in x?x.rotationX:"shortRotationX"in x?x.shortRotationX+"_short":b.rotationX||0,b.rotationX,"rotationX",w),l.rotationY=A("rotationY"in x?x.rotationY:"shortRotationY"in x?x.shortRotationY+"_short":b.rotationY||0,b.rotationY,"rotationY",w)),l.skewX=A(x.skewX,b.skewX-b.skewY),(l.skewY=A(x.skewY,b.skewY))&&(l.skewX+=l.skewY,l.rotation+=l.skewY)}for(Yt&&null!=x.force3D&&(b.force3D=x.force3D,u=!0),b.skewType=x.skewType||b.skewType||W.defaultSkewType,(f=b.force3D||b.z||b.rotationX||b.rotationY||l.z||l.rotationX||l.rotationY||l.perspective)||null==x.scale||(l.scaleZ=1);-1<--v;)(1e-6<(P=l[m=zt[v]]-b[m])||P<-1e-6||null!=x[m]||null!=H[m])&&(u=!0,s=new xt(b,m,b[m],P,s),m in w&&(s.e=w[m]),s.xs0=0,s.plugin=n,r._overwriteProps.push(s.n));return P=x.transformOrigin,b.svg&&(P||x.svgOrigin)&&(_=b.xOffset,c=b.yOffset,Rt(t,pt(P),l,x.svgOrigin,x.smoothOrigin),s=yt(b,"xOrigin",(g?b:l).xOrigin,l.xOrigin,s,T),s=yt(b,"yOrigin",(g?b:l).yOrigin,l.yOrigin,s,T),_===b.xOffset&&c===b.yOffset||(s=yt(b,"xOffset",g?_:b.xOffset,b.xOffset,s,T),s=yt(b,"yOffset",g?c:b.yOffset,b.yOffset,s,T)),P=At?null:"0px 0px"),(P||Yt&&f&&b.zOrigin)&&(Xt?(u=!0,m=Nt,P=(P||ot(t,m,O,!1,"50% 50%"))+"",(s=new xt(y,m,0,0,s,-1,T)).b=y[m],s.plugin=n,Yt?(h=b.zOrigin,P=P.split(" "),b.zOrigin=(2<P.length&&(0===h||"0px"!==P[2])?parseFloat(P[2]):h)||0,s.xs0=s.e=P[0]+" "+(P[1]||"50%")+" 0px",(s=new xt(b,"zOrigin",0,0,s,-1,s.n)).b=h,s.xs0=s.e=b.zOrigin):s.xs0=s.e=P):pt(P+"",b)),u&&(r._transformType=b.svg&&At||!f&&3!==this._transformType?2:3),o&&(a[i]=o),s},prefix:!0}),Pt("boxShadow",{defaultValue:"0px 0px 0px 0px #999",prefix:!0,color:!0,multi:!0,keyword:"inset"}),Pt("borderRadius",{defaultValue:"0px",parser:function(t,e,i,r,s,n){e=this.format(e);for(var a,o,l,h,f,u,p,_,c,d,m,g,y=["borderTopLeftRadius","borderTopRightRadius","borderBottomRightRadius","borderBottomLeftRadius"],v=t.style,x=parseFloat(t.offsetWidth),w=parseFloat(t.offsetHeight),T=e.split(" "),b=0;b<y.length;b++)this.p.indexOf("border")&&(y[b]=k(y[b])),-1!==(l=o=ot(t,y[b],O,!1,"0px")).indexOf(" ")&&(l=(o=l.split(" "))[0],o=o[1]),h=a=T[b],f=parseFloat(l),_=l.substr((f+"").length),""===(p=(c="="===h.charAt(1))?(u=parseInt(h.charAt(0)+"1",10),h=h.substr(2),u*=parseFloat(h),h.substr((u+"").length-(u<0?1:0))||""):(u=parseFloat(h),h.substr((u+"").length)))&&(p=P[i]||_),p!==_&&(d=lt(t,"borderLeft",f,_),m=lt(t,"borderTop",f,_),o="%"===p?(l=d/x*100+"%",m/w*100+"%"):"em"===p?(l=d/(g=lt(t,"borderLeft",1,"em"))+"em",m/g+"em"):(l=d+"px",m+"px"),c&&(h=parseFloat(l)+u+p,a=parseFloat(o)+u+p)),s=wt(v,y[b],l+" "+o,h+" "+a,!1,"0px",s);return s},prefix:!0,formatter:mt("0px 0px 0px 0px",!1,!0)}),Pt("borderBottomLeftRadius,borderBottomRightRadius,borderTopLeftRadius,borderTopRightRadius",{defaultValue:"0px",parser:function(t,e,i,r,s,n){return wt(t.style,i,this.format(ot(t,i,O,!1,"0px 0px")),this.format(e),!1,"0px",s)},prefix:!0,formatter:mt("0px 0px",!1,!0)}),Pt("backgroundPosition",{defaultValue:"0 0",parser:function(t,e,i,r,s,n){var a,o,l,h,f,u,p="background-position",_=O||at(t,null),c=this.format((_?C?_.getPropertyValue(p+"-x")+" "+_.getPropertyValue(p+"-y"):_.getPropertyValue(p):t.currentStyle.backgroundPositionX+" "+t.currentStyle.backgroundPositionY)||"0 0"),d=this.format(e);if(-1!==c.indexOf("%")!=(-1!==d.indexOf("%"))&&d.split(",").length<2&&(u=ot(t,"backgroundImage").replace(j,""))&&"none"!==u){for(a=c.split(" "),o=d.split(" "),tt.setAttribute("src",u),l=2;-1<--l;)(h=-1!==(c=a[l]).indexOf("%"))!=(-1!==o[l].indexOf("%"))&&(f=0===l?t.offsetWidth-tt.width:t.offsetHeight-tt.height,a[l]=h?parseFloat(c)/100*f+"px":parseFloat(c)/f*100+"%");c=a.join(" ")}return this.parseComplex(t.style,c,d,s,n)},formatter:pt}),Pt("backgroundSize",{defaultValue:"0 0",formatter:function(t){return pt(-1===(t+="").indexOf(" ")?t+" "+t:t)}}),Pt("perspective",{defaultValue:"0px",prefix:!0}),Pt("perspectiveOrigin",{defaultValue:"50% 50%",prefix:!0}),Pt("transformStyle",{prefix:!0}),Pt("backfaceVisibility",{prefix:!0}),Pt("userSelect",{prefix:!0}),Pt("margin",{parser:gt("marginTop,marginRight,marginBottom,marginLeft")}),Pt("padding",{parser:gt("paddingTop,paddingRight,paddingBottom,paddingLeft")}),Pt("clip",{defaultValue:"rect(0px,0px,0px,0px)",parser:function(t,e,i,r,s,n){var a,o,l;return e=C<9?(o=t.currentStyle,l=C<8?" ":",",a="rect("+o.clipTop+l+o.clipRight+l+o.clipBottom+l+o.clipLeft+")",this.format(e).split(",").join(l)):(a=this.format(ot(t,this.p,O,!1,this.dflt)),this.format(e)),this.parseComplex(t.style,a,e,s,n)}}),Pt("textShadow",{defaultValue:"0px 0px 0px #999",color:!0,multi:!0}),Pt("autoRound,strictUnits",{parser:function(t,e,i,r,s){return s}}),Pt("border",{defaultValue:"0px solid #000",parser:function(t,e,i,r,s,n){var a=ot(t,"borderTopWidth",O,!1,"0px"),o=this.format(e).split(" "),l=o[0].replace(I,"");return"px"!==l&&(a=parseFloat(a)/lt(t,"borderTopWidth",1,l)+l),this.parseComplex(t.style,this.format(a+" "+ot(t,"borderTopStyle",O,!1,"solid")+" "+ot(t,"borderTopColor",O,!1,"#000")),o.join(" "),s,n)},color:!0,formatter:function(t){var e=t.split(" ");return e[0]+" "+(e[1]||"solid")+" "+(t.match(dt)||["#000"])[0]}}),Pt("borderWidth",{parser:gt("borderTopWidth,borderRightWidth,borderBottomWidth,borderLeftWidth")}),Pt("float,cssFloat,styleFloat",{parser:function(t,e,i,r,s,n){var a=t.style,o="cssFloat"in a?"cssFloat":"styleFloat";return new xt(a,o,0,0,s,-1,i,!1,0,a[o],e)}});function $t(t){var e,i=this.t,r=i.filter||ot(this.data,"filter")||"",s=this.s+this.c*t|0;100==s&&(e=-1===r.indexOf("atrix(")&&-1===r.indexOf("radient(")&&-1===r.indexOf("oader(")?(i.removeAttribute("filter"),!ot(this.data,"filter")):(i.filter=r.replace(l,""),!0)),e||(this.xn1&&(i.filter=r=r||"alpha(opacity="+s+")"),-1===r.indexOf("pacity")?0==s&&this.xn1||(i.filter=r+" alpha(opacity="+s+")"):i.filter=r.replace(N,"opacity="+s))}Pt("opacity,alpha,autoAlpha",{defaultValue:"1",parser:function(t,e,i,r,s,n){var a=parseFloat(ot(t,"opacity",O,!1,"1")),o=t.style,l="autoAlpha"===i;return"string"==typeof e&&"="===e.charAt(1)&&(e=("-"===e.charAt(0)?-1:1)*parseFloat(e.substr(2))+a),l&&1===a&&"hidden"===ot(t,"visibility",O)&&0!==e&&(a=0),rt?s=new xt(o,"opacity",a,e-a,s):((s=new xt(o,"opacity",100*a,100*(e-a),s)).xn1=l?1:0,o.zoom=1,s.type=2,s.b="alpha(opacity="+s.s+")",s.e="alpha(opacity="+(s.s+s.c)+")",s.data=t,s.plugin=n,s.setRatio=$t),l&&((s=new xt(o,"visibility",0,0,s,-1,null,!1,0,0!==a?"inherit":"hidden",0===e?"hidden":"inherit")).xs0="inherit",r._overwriteProps.push(s.n),r._overwriteProps.push(i)),s}});function Qt(t){if(this.t._fwdClassPT=this,1===t||0===t){this.t.setAttribute("class",0===t?this.b:this.e);for(var e=this.data,i=this.t.style;e;)e.v?i[e.p]=e.v:Gt(i,e.p),e=e._next;1===t&&this.t._fwdClassPT===this&&(this.t._fwdClassPT=null)}else this.t.getAttribute("class")!==this.e&&this.t.setAttribute("class",this.e)}var Gt=function(t,e){e&&(t.removeProperty?("ms"!==e.substr(0,2)&&"webkit"!==e.substr(0,6)||(e="-"+e),t.removeProperty(e.replace(u,"-$1").toLowerCase())):t.removeAttribute(e))};Pt("className",{parser:function(t,e,i,r,s,n,a){var o,l,h,f,u,p=t.getAttribute("class")||"",_=t.style.cssText;if((s=r._classNamePT=new xt(t,i,0,0,s,2)).setRatio=Qt,s.pr=-11,c=!0,s.b=p,l=y(t,O),h=t._fwdClassPT){for(f={},u=h.data;u;)f[u.p]=1,u=u._next;h.setRatio(1)}return(t._fwdClassPT=s).e="="!==e.charAt(1)?e:p.replace(new RegExp("(?:\\s|^)"+e.substr(2)+"(?![\\w-])"),"")+("+"===e.charAt(0)?" "+e.substr(2):""),t.setAttribute("class",s.e),o=v(t,l,y(t),a,f),t.setAttribute("class",p),s.data=o.firstMPT,t.style.cssText=_,s=s.xfirst=r.parse(t,o.difs,s,n)}});function Ht(t){if((1===t||0===t)&&this.data._totalTime===this.data._totalDuration&&"isFromStart"!==this.data.data){var e,i,r,s,n,a=this.t.style,o=m.transform.parse;if("all"===this.e)s=!(a.cssText="");else for(r=(e=this.e.split(" ").join("").split(",")).length;-1<--r;)i=e[r],m[i]&&(m[i].parse===o?s=!0:i="transformOrigin"===i?Nt:m[i].p),Gt(a,i);s&&(Gt(a,Xt),(n=this.t._fwdTransform)&&(n.svg&&(this.t.removeAttribute("data-svg-origin"),this.t.removeAttribute("transform")),delete this.t._fwdTransform))}}for(Pt("clearProps",{parser:function(t,e,i,r,s){return(s=new xt(t,i,0,0,s,2)).setRatio=Ht,s.e=e,s.pr=-10,s.data=r._tween,c=!0,s}}),t="bezier,throwProps,physicsProps,physics2D".split(","),Tt=t.length;Tt--;)Ot(t[Tt]);(t=W.prototype)._firstPT=t._lastParsedTransform=t._transform=null,t._onInitTween=function(t,e,i,r){if(!t.nodeType)return!1;this._target=F=t,this._tween=i,this._vars=e,D=r,M=e.autoRound,c=!1,P=e.suffixMap||W.suffixMap,O=at(t,""),d=this._overwriteProps;var s,n,a,o,l,h,f,u,p,_=t.style;if(x&&""===_.zIndex&&("auto"!==(s=ot(t,"zIndex",O))&&""!==s||this._addLazySet(_,"zIndex",0)),"string"==typeof e&&(o=_.cssText,s=y(t,O),_.cssText=o+";"+e,s=v(t,s,y(t)).difs,!rt&&E.test(e)&&(s.opacity=parseFloat(RegExp.$1)),e=s,_.cssText=o),e.className?this._firstPT=n=m.className.parse(t,e.className,"className",this,null,null,e):this._firstPT=n=this.parse(t,e,null),this._transformType){for(p=3===this._transformType,Xt?w&&(x=!0,""===_.zIndex&&("auto"!==(f=ot(t,"zIndex",O))&&""!==f||this._addLazySet(_,"zIndex",0)),T&&this._addLazySet(_,"WebkitBackfaceVisibility",this._vars.WebkitBackfaceVisibility||(p?"visible":"hidden"))):_.zoom=1,a=n;a&&a._next;)a=a._next;u=new xt(t,"transform",0,0,null,2),this._linkCSSP(u,null,a),u.setRatio=Xt?Ut:St,u.data=this._transform||Zt(t,O,!0),u.tween=i,u.pr=-1,d.pop()}if(c){for(;n;){for(h=n._next,a=o;a&&a.pr>n.pr;)a=a._next;(n._prev=a?a._prev:l)?n._prev._next=n:o=n,(n._next=a)?a._prev=n:l=n,n=h}this._firstPT=o}return!0},t.parse=function(t,e,i,r){var s,n,a,o,l,h,f,u,p,_,c=t.style;for(s in e)"function"==typeof(h=e[s])&&(h=h(D,F)),(n=m[s])?i=n.parse(t,h,s,this,i,r,e):(l=ot(t,s,O)+"",p="string"==typeof h,"color"===s||"fill"===s||"stroke"===s||-1!==s.indexOf("Color")||p&&L.test(h)?(p||(h=(3<(h=ct(h)).length?"rgba(":"rgb(")+h.join(",")+")"),i=wt(c,s,l,h,!0,"transparent",i,0,r)):p&&$.test(h)?i=wt(c,s,l,h,!0,null,i,0,r):(f=(a=parseFloat(l))||0===a?l.substr((a+"").length):"",""!==l&&"auto"!==l||(f="width"===s||"height"===s?(a=function(t,e,i){if("svg"===(t.nodeName+"").toLowerCase())return(i||at(t))[e]||0;if(t.getBBox&&jt(t))return t.getBBox()[e]||0;var r=parseFloat("width"===e?t.offsetWidth:t.offsetHeight),s=ft[e],n=s.length;for(i=i||at(t,null);-1<--n;)r-=parseFloat(ot(t,"padding"+s[n],i,!0))||0,r-=parseFloat(ot(t,"border"+s[n]+"Width",i,!0))||0;return r}(t,s,O),"px"):"left"===s||"top"===s?(a=ht(t,s,O),"px"):(a="opacity"!==s?0:1,"")),""===(u=(_=p&&"="===h.charAt(1))?(o=parseInt(h.charAt(0)+"1",10),h=h.substr(2),o*=parseFloat(h),h.replace(I,"")):(o=parseFloat(h),p?h.replace(I,""):""))&&(u=s in P?P[s]:f),h=o||0===o?(_?o+a:o)+u:e[s],f!==u&&""!==u&&(o||0===o)&&a&&(a=lt(t,s,a,f),"%"===u?(a/=lt(t,s,100,"%")/100,!0!==e.strictUnits&&(l=a+"%")):"em"===u||"rem"===u||"vw"===u||"vh"===u?a/=lt(t,s,1,u):"px"!==u&&(o=lt(t,s,o,u),u="px"),_&&(!o&&0!==o||(h=o+a+u))),_&&(o+=a),!a&&0!==a||!o&&0!==o?void 0!==c[s]&&(h||h+""!="NaN"&&null!=h)?(i=new xt(c,s,o||a||0,0,i,-1,s,!1,0,l,h)).xs0="none"!==h||"display"!==s&&-1===s.indexOf("Style")?h:l:g("invalid "+s+" tween value: "+e[s]):(i=new xt(c,s,a,o-a,i,0,s,!1!==M&&("px"===u||"zIndex"===s),0,l,h)).xs0=u)),r&&i&&!i.plugin&&(i.plugin=r);return i},t.setRatio=function(t){var e,i,r,s=this._firstPT;if(1!==t||this._tween._time!==this._tween._duration&&0!==this._tween._time)if(t||this._tween._time!==this._tween._duration&&0!==this._tween._time||-1e-6===this._tween._rawPrevTime)for(;s;){if(e=s.c*t+s.s,s.r?e=Math.round(e):e<1e-6&&-1e-6<e&&(e=0),s.type)if(1===s.type)if(2===(r=s.l))s.t[s.p]=s.xs0+e+s.xs1+s.xn1+s.xs2;else if(3===r)s.t[s.p]=s.xs0+e+s.xs1+s.xn1+s.xs2+s.xn2+s.xs3;else if(4===r)s.t[s.p]=s.xs0+e+s.xs1+s.xn1+s.xs2+s.xn2+s.xs3+s.xn3+s.xs4;else if(5===r)s.t[s.p]=s.xs0+e+s.xs1+s.xn1+s.xs2+s.xn2+s.xs3+s.xn3+s.xs4+s.xn4+s.xs5;else{for(i=s.xs0+e+s.xs1,r=1;r<s.l;r++)i+=s["xn"+r]+s["xs"+(r+1)];s.t[s.p]=i}else-1===s.type?s.t[s.p]=s.xs0:s.setRatio&&s.setRatio(t);else s.t[s.p]=e+s.xs0;s=s._next}else for(;s;)2!==s.type?s.t[s.p]=s.b:s.setRatio(t),s=s._next;else for(;s;){if(2!==s.type)if(s.r&&-1!==s.type)if(e=Math.round(s.s+s.c),s.type){if(1===s.type){for(r=s.l,i=s.xs0+e+s.xs1,r=1;r<s.l;r++)i+=s["xn"+r]+s["xs"+(r+1)];s.t[s.p]=i}}else s.t[s.p]=e+s.xs0;else s.t[s.p]=s.e;else s.setRatio(t);s=s._next}},t._enableTransforms=function(t){this._transform=this._transform||Zt(this._target,O,!0),this._transformType=this._transform.svg&&At||!t&&3!==this._transformType?2:3};function Kt(t){this.t[this.p]=this.e,this.data._linkCSSP(this,this._next,null,!0)}t._addLazySet=function(t,e,i){var r=this._firstPT=new xt(t,e,0,0,this._firstPT,2);r.e=i,r.setRatio=Kt,r.data=this},t._linkCSSP=function(t,e,i,r){return t&&(e&&(e._prev=t),t._next&&(t._next._prev=t._prev),t._prev?t._prev._next=t._next:this._firstPT===t&&(this._firstPT=t._next,r=!0),i?i._next=t:r||null!==this._firstPT||(this._firstPT=t),t._next=e,t._prev=i),t},t._mod=function(t){for(var e=this._firstPT;e;)"function"==typeof t[e.p]&&t[e.p]===Math.round&&(e.r=1),e=e._next},t._kill=function(t){var e,i,r,s=t;if(t.autoAlpha||t.alpha){for(i in s={},t)s[i]=t[i];s.opacity=1,s.autoAlpha&&(s.visibility=1)}for(t.className&&(e=this._classNamePT)&&((r=e.xfirst)&&r._prev?this._linkCSSP(r._prev,e._next,r._prev._prev):r===this._firstPT&&(this._firstPT=e._next),e._next&&this._linkCSSP(e._next,e._next._next,r._prev),this._classNamePT=null),e=this._firstPT;e;)e.plugin&&e.plugin!==i&&e.plugin._kill&&(e.plugin._kill(t),i=e.plugin),e=e._next;return n.prototype._kill.call(this,s)};var Jt=function(t,e,i){var r,s,n,a;if(t.slice)for(s=t.length;-1<--s;)Jt(t[s],e,i);else for(s=(r=t.childNodes).length;-1<--s;)a=(n=r[s]).type,n.style&&(e.push(y(n)),i&&i.push(n)),1!==a&&9!==a&&11!==a||!n.childNodes.length||Jt(n,e,i)};return W.cascadeTo=function(t,e,i){var r,s,n,a,o=B.to(t,e,i),l=[o],h=[],f=[],u=[],p=B._internals.reservedProps;for(t=o._targets||o.target,Jt(t,h,u),o.render(e,!0,!0),Jt(t,f),o.render(0,!0,!0),o._enabled(!0),r=u.length;-1<--r;)if((s=v(u[r],h[r],f[r])).firstMPT){for(n in s=s.difs,i)p[n]&&(s[n]=i[n]);for(n in a={},s)a[n]=h[r][n];l.push(B.fromTo(u[r],e,a,s))}return l},n.activate([W]),W},!0),_fwd_fwdScope.FWDFWD_fwdDefine("easing.Back",["easing.Ease"],function(m){function t(t,e){var i=f("easing."+t,function(){},!0),r=i.prototype=new m;return r.constructor=i,r.getRatio=e,i}function e(t,e,i,r,s){var n=f("easing."+t,{easeOut:new e,easeIn:new i,easeInOut:new r},!0);return u(n,t),n}function g(t,e,i){this.t=t,this.v=e,i&&(((this.next=i).prev=this).c=i.v-e,this.gap=i.t-t)}function i(t,e){var i=f("easing."+t,function(t){this._p1=t||0===t?t:1.70158,this._p2=1.525*this._p1},!0),r=i.prototype=new m;return r.constructor=i,r.getRatio=e,r.config=function(t){return new i(t)},i}var r,s,n,a=_fwd_fwdScope.FWDGlobals||_fwd_fwdScope,o=a.com.fwd,l=2*Math.PI,h=Math.PI/2,f=o._class,u=m.register||function(){},p=e("Back",i("BackOut",function(t){return--t*t*((this._p1+1)*t+this._p1)+1}),i("BackIn",function(t){return t*t*((this._p1+1)*t-this._p1)}),i("BackInOut",function(t){return(t*=2)<1?.5*t*t*((this._p2+1)*t-this._p2):.5*((t-=2)*t*((this._p2+1)*t+this._p2)+2)})),_=f("easing.SlowMo",function(t,e,i){e=e||0===e?e:.7,null==t?t=.7:1<t&&(t=1),this._p=1!==t?e:0,this._p1=(1-t)/2,this._p2=t,this._p3=this._p1+this._p2,this._calcEnd=!0===i},!0),c=_.prototype=new m;return c.constructor=_,c.getRatio=function(t){var e=t+(.5-t)*this._p;return t<this._p1?this._calcEnd?1-(t=1-t/this._p1)*t:e-(t=1-t/this._p1)*t*t*t*e:t>this._p3?this._calcEnd?1-(t=(t-this._p3)/this._p1)*t:e+(t-e)*(t=(t-this._p3)/this._p1)*t*t*t:this._calcEnd?1:e},_.ease=new _(.7,.7),c.config=_.config=function(t,e,i){return new _(t,e,i)},(c=(r=f("easing.SteppedEase",function(t){t=t||1,this._p1=1/t,this._p2=t+1},!0)).prototype=new m).constructor=r,c.getRatio=function(t){return t<0?t=0:1<=t&&(t=.999999999),(this._p2*t>>0)*this._p1},c.config=r.config=function(t){return new r(t)},(c=(s=f("easing.RoughEase",function(t){for(var e,i,r,s,n,a,o=(t=t||{}).taper||"none",l=[],h=0,f=0|(t.points||20),u=f,p=!1!==t.randomize,_=!0===t.clamp,c=t.template instanceof m?t.template:null,d="number"==typeof t.strength?.4*t.strength:.4;-1<--u;)e=p?Math.random():1/f*u,i=c?c.getRatio(e):e,r="none"===o?d:"out"===o?(s=1-e)*s*d:"in"===o?e*e*d:e<.5?(s=2*e)*s*.5*d:(s=2*(1-e))*s*.5*d,p?i+=Math.random()*r-.5*r:u%2?i+=.5*r:i-=.5*r,_&&(1<i?i=1:i<0&&(i=0)),l[h++]={x:e,y:i};for(l.sort(function(t,e){return t.x-e.x}),a=new g(1,1,null),u=f;-1<--u;)n=l[u],a=new g(n.x,n.y,a);this._prev=new g(0,0,0!==a.t?a:a.next)},!0)).prototype=new m).constructor=s,c.getRatio=function(t){var e=this._prev;if(t>e.t){for(;e.next&&t>=e.t;)e=e.next;e=e.prev}else for(;e.prev&&t<=e.t;)e=e.prev;return(this._prev=e).v+(t-e.t)/e.gap*e.c},c.config=function(t){return new s(t)},s.ease=new s,e("Bounce",t("BounceOut",function(t){return t<1/2.75?7.5625*t*t:t<2/2.75?7.5625*(t-=1.5/2.75)*t+.75:t<2.5/2.75?7.5625*(t-=2.25/2.75)*t+.9375:7.5625*(t-=2.625/2.75)*t+.984375}),t("BounceIn",function(t){return(t=1-t)<1/2.75?1-7.5625*t*t:t<2/2.75?1-(7.5625*(t-=1.5/2.75)*t+.75):t<2.5/2.75?1-(7.5625*(t-=2.25/2.75)*t+.9375):1-(7.5625*(t-=2.625/2.75)*t+.984375)}),t("BounceInOut",function(t){var e=t<.5;return(t=e?1-2*t:2*t-1)<1/2.75?t*=7.5625*t:t=t<2/2.75?7.5625*(t-=1.5/2.75)*t+.75:t<2.5/2.75?7.5625*(t-=2.25/2.75)*t+.9375:7.5625*(t-=2.625/2.75)*t+.984375,e?.5*(1-t):.5*t+.5})),e("Circ",t("CircOut",function(t){return Math.sqrt(1- --t*t)}),t("CircIn",function(t){return-(Math.sqrt(1-t*t)-1)}),t("CircInOut",function(t){return(t*=2)<1?-.5*(Math.sqrt(1-t*t)-1):.5*(Math.sqrt(1-(t-=2)*t)+1)})),e("Elastic",(n=function(t,e,i){var r=f("easing."+t,function(t,e){this._p1=1<=t?t:1,this._p2=(e||i)/(t<1?t:1),this._p3=this._p2/l*(Math.asin(1/this._p1)||0),this._p2=l/this._p2},!0),s=r.prototype=new m;return s.constructor=r,s.getRatio=e,s.config=function(t,e){return new r(t,e)},r})("ElasticOut",function(t){return this._p1*Math.pow(2,-10*t)*Math.sin((t-this._p3)*this._p2)+1},.3),n("ElasticIn",function(t){return-(this._p1*Math.pow(2,10*--t)*Math.sin((t-this._p3)*this._p2))},.3),n("ElasticInOut",function(t){return(t*=2)<1?this._p1*Math.pow(2,10*--t)*Math.sin((t-this._p3)*this._p2)*-.5:this._p1*Math.pow(2,-10*--t)*Math.sin((t-this._p3)*this._p2)*.5+1},.45)),e("Expo",t("ExpoOut",function(t){return 1-Math.pow(2,-10*t)}),t("ExpoIn",function(t){return Math.pow(2,10*(t-1))-.001}),t("ExpoInOut",function(t){return(t*=2)<1?.5*Math.pow(2,10*(t-1)):.5*(2-Math.pow(2,-10*(t-1)))})),e("Sine",t("SineOut",function(t){return Math.sin(t*h)}),t("SineIn",function(t){return 1-Math.cos(t*h)}),t("SineInOut",function(t){return-.5*(Math.cos(Math.PI*t)-1)})),f("easing.EaseLookup",{find:function(t){return m.map[t]}},!0),u(a.SlowMo,"SlowMo","ease,"),u(s,"RoughEase","ease,"),u(r,"SteppedEase","ease,"),p},!0)}),_fwd_fwdScope.FWDFWD_fwdDefine&&_fwd_fwdScope._fwd_fwdQueue.pop()(),function(_,c){"use strict";var d={},m=_.FWDGlobals=_.FWDGlobals||_;if(!m.FWDTweenLite){var g,e,i,y=function(t){for(var e=t.split("."),i=m,r=0;r<e.length;r++)i[e[r]]=i=i[e[r]]||{};return i},u=y("com.fwd"),v=1e-10,l=function(t){for(var e=[],i=t.length,r=0;r!==i;e.push(t[r++]));return e},r=function(){},x=(e=Object.prototype.toString,i=e.call([]),function(t){return null!=t&&(t instanceof Array||"object"==typeof t&&!!t.push&&e.call(t)===i)}),w={},T=function(l,h,f,u){this.sc=w[l]?w[l].sc:[],(w[l]=this).gsClass=null,this.func=f;var p=[];this.check=function(t){for(var e,i,r,s,n,a=h.length,o=a;-1<--a;)(e=w[h[a]]||new T(h[a],[])).gsClass?(p[a]=e.gsClass,o--):t&&e.sc.push(this);if(0===o&&f){if(r=(i=("com.fwd."+l).split(".")).pop(),s=y(i.join("."))[r]=this.gsClass=f.apply(f,p),u)if(m[r]=d[r]=s,!(n="undefined"!=typeof fwd_module&&fwd_module.exports)&&"function"==typeof define&&define.amd)define((_.FWDAMDPath?_.FWDAMDPath+"/":"")+l.split(".").pop(),[],function(){return s});else if(n)if(l===c)for(a in fwd_module.exports=d[c]=s,d)s[a]=d[a];else d[c]&&(d[c][r]=s);for(a=0;a<this.sc.length;a++)this.sc[a].check()}},this.check(!0)},s=_.FWDFWD_fwdDefine=function(t,e,i,r){return new T(t,e,i,r)},p=u._class=function(t,e,i){return e=e||function(){},s(t,[],function(){return e},i),e};s.globals=m;var t,n=[0,0,1,1],b=p("easing.Ease",function(t,e,i,r){this._func=t,this._type=i||0,this._power=r||0,this._params=e?n.concat(e):n},!0),P=b.map={},a=b.register=function(t,e,i,r){for(var s,n,a,o,l=e.split(","),h=l.length,f=(i||"easeIn,easeOut,easeInOut").split(",");-1<--h;)for(n=l[h],s=r?p("easing."+n,null,!0):u.easing[n]||{},a=f.length;-1<--a;)o=f[a],P[n+"."+o]=P[o+n]=s[o]=t.getRatio?t:t[o]||new t};for((t=b.prototype)._calcEnd=!1,t.getRatio=function(t){if(this._func)return this._params[0]=t,this._func.apply(null,this._params);var e=this._type,i=this._power,r=1===e?1-t:2===e?t:t<.5?2*t:2*(1-t);return 1===i?r*=r:2===i?r*=r*r:3===i?r*=r*r*r:4===i&&(r*=r*r*r*r),1===e?1-r:2===e?r:t<.5?r/2:1-r/2},h=(o=["Linear","Quad","Cubic","Quart","Quint,Strong"]).length;-1<--h;)t=o[h]+",Power"+h,a(new b(null,null,1,h),t,"easeOut",!0),a(new b(null,null,2,h),t,"easeIn"+(0===h?",easeNone":"")),a(new b(null,null,3,h),t,"easeInOut");P.linear=u.easing.Linear.easeIn,P.swing=u.easing.Quad.easeInOut;var O=p("events.EventDispatcher",function(t){this._listeners={},this._eventTarget=t||this});(t=O.prototype).addEventListener=function(t,e,i,r,s){s=s||0;var n,a,o=this._listeners[t],l=0;for(this!==M||g||M.wake(),null==o&&(this._listeners[t]=o=[]),a=o.length;-1<--a;)(n=o[a]).c===e&&n.s===i?o.splice(a,1):0===l&&n.pr<s&&(l=a+1);o.splice(l,0,{c:e,s:i,up:r,pr:s})},t.removeEventListener=function(t,e){var i,r=this._listeners[t];if(r)for(i=r.length;-1<--i;)if(r[i].c===e)return void r.splice(i,1)},t.dispatchEvent=function(t){var e,i,r,s=this._listeners[t];if(s)for(1<(e=s.length)&&(s=s.slice(0)),i=this._eventTarget;-1<--e;)(r=s[e])&&(r.up?r.c.call(r.s||i,{type:t,target:i}):r.c.call(r.s||i))};for(var o,k=_.requestAnimationFrame,R=_.cancelAnimationFrame,S=Date.now||function(){return(new Date).getTime()},A=S(),h=(o=["ms","moz","webkit","o"]).length;-1<--h&&!k;)k=_[o[h]+"RequestAnimationFrame"],R=_[o[h]+"CancelAnimationFrame"]||_[o[h]+"CancelRequestAnimationFrame"];p("Ticker",function(t,e){var s,n,a,o,l,h=this,f=S(),i=!(!1===e||!k)&&"auto",u=500,p=33,_=function(t){var e,i,r=S()-A;u<r&&(f+=r-p),A+=r,h.time=(A-f)/1e3,e=h.time-l,(!s||0<e||!0===t)&&(h.frame++,l+=e+(o<=e?.004:o-e),i=!0),!0!==t&&(a=n(_)),i&&h.dispatchEvent("tick")};O.call(h),h.time=h.frame=0,h.tick=function(){_(!0)},h.lagSmoothing=function(t,e){u=t||1e10,p=Math.min(e,u,0)},h.sleep=function(){null!=a&&((i&&R?R:clearTimeout)(a),n=r,a=null,h===M&&(g=!1))},h.wake=function(t){null!==a?h.sleep():t?f+=-A+(A=S()):10<h.frame&&(A=S()-u+5),n=0===s?r:i&&k?k:function(t){return setTimeout(t,1e3*(l-h.time)+1|0)},h===M&&(g=!0),_(2)},h.fps=function(t){if(!arguments.length)return s;o=1/((s=t)||60),l=this.time+o,h.wake()},h.useRAF=function(t){if(!arguments.length)return i;h.sleep(),i=t,h.fps(s)},h.fps(t),setTimeout(function(){"auto"===i&&h.frame<5&&"hidden"!==document.visibilityState&&h.useRAF(!1)},1500)}),(t=u.Ticker.prototype=new u.events.EventDispatcher).constructor=u.Ticker;var f=p("core.FWDAnimation",function(t,e){var i;this.vars=e=e||{},this._duration=this._totalDuration=t||0,this._delay=Number(e.delay)||0,this._timeScale=1,this._active=!0===e.immediateRender,this.data=e.data,this._reversed=!0===e.reversed,$&&(g||M.wake(),(i=this.vars.useFrames?U:$).add(this,i._time),this.vars.paused&&this.paused(!0))}),M=f.ticker=new u.Ticker;(t=f.prototype)._dirty=t._gc=t._initted=t._paused=!1,t._totalTime=t._time=0,t._rawPrevTime=-1,t._next=t._last=t._onUpdate=t._timeline=t.timeline=null,t._paused=!1;var C=function(){g&&2e3<S()-A&&M.wake(),setTimeout(C,2e3)};C(),t.play=function(t,e){return null!=t&&this.seek(t,e),this.reversed(!1).paused(!1)},t.pause=function(t,e){return null!=t&&this.seek(t,e),this.paused(!0)},t.resume=function(t,e){return null!=t&&this.seek(t,e),this.paused(!1)},t.seek=function(t,e){return this.totalTime(Number(t),!1!==e)},t.restart=function(t,e){return this.reversed(!1).paused(!1).totalTime(t?-this._delay:0,!1!==e,!0)},t.reverse=function(t,e){return null!=t&&this.seek(t||this.totalDuration(),e),this.reversed(!0).paused(!1)},t.render=function(t,e,i){},t.invalidate=function(){return this._time=this._totalTime=0,this._initted=this._gc=!1,this._rawPrevTime=-1,!this._gc&&this.timeline||this._enabled(!0),this},t.isActive=function(){var t,e=this._timeline,i=this._startTime;return!e||!this._gc&&!this._paused&&e.isActive()&&(t=e.rawTime())>=i&&t<i+this.totalDuration()/this._timeScale},t._enabled=function(t,e){return g||M.wake(),this._gc=!t,this._active=this.isActive(),!0!==e&&(t&&!this.timeline?this._timeline.add(this,this._startTime-this._delay):!t&&this.timeline&&this._timeline._remove(this,!0)),!1},t._kill=function(t,e){return this._enabled(!1,!1)},t.kill=function(t,e){return this._kill(t,e),this},t._uncache=function(t){for(var e=t?this:this.timeline;e;)e._dirty=!0,e=e.timeline;return this},t._swapSelfInParams=function(t){for(var e=t.length,i=t.concat();-1<--e;)"{self}"===t[e]&&(i[e]=this);return i},t._callback=function(t){var e=this.vars,i=e[t],r=e[t+"Params"],s=e[t+"Scope"]||e.callbackScope||this;switch(r?r.length:0){case 0:i.call(s);break;case 1:i.call(s,r[0]);break;case 2:i.call(s,r[0],r[1]);break;default:i.apply(s,r)}},t.eventCallback=function(t,e,i,r){if("on"===(t||"").substr(0,2)){var s=this.vars;if(1===arguments.length)return s[t];null==e?delete s[t]:(s[t]=e,s[t+"Params"]=x(i)&&-1!==i.join("").indexOf("{self}")?this._swapSelfInParams(i):i,s[t+"Scope"]=r),"onUpdate"===t&&(this._onUpdate=e)}return this},t.delay=function(t){return arguments.length?(this._timeline.smoothChildTiming&&this.startTime(this._startTime+t-this._delay),this._delay=t,this):this._delay},t.duration=function(t){return arguments.length?(this._duration=this._totalDuration=t,this._uncache(!0),this._timeline.smoothChildTiming&&0<this._time&&this._time<this._duration&&0!==t&&this.totalTime(this._totalTime*(t/this._duration),!0),this):(this._dirty=!1,this._duration)},t.totalDuration=function(t){return this._dirty=!1,arguments.length?this.duration(t):this._totalDuration},t.time=function(t,e){return arguments.length?(this._dirty&&this.totalDuration(),this.totalTime(t>this._duration?this._duration:t,e)):this._time},t.totalTime=function(t,e,i){if(g||M.wake(),!arguments.length)return this._totalTime;if(this._timeline){if(t<0&&!i&&(t+=this.totalDuration()),this._timeline.smoothChildTiming){this._dirty&&this.totalDuration();var r=this._totalDuration,s=this._timeline;if(r<t&&!i&&(t=r),this._startTime=(this._paused?this._pauseTime:s._time)-(this._reversed?r-t:t)/this._timeScale,s._dirty||this._uncache(!1),s._timeline)for(;s._timeline;)s._timeline._time!==(s._startTime+s._totalTime)/s._timeScale&&s.totalTime(s._totalTime,!0),s=s._timeline}this._gc&&this._enabled(!0,!1),this._totalTime===t&&0!==this._duration||(X.length&&G(),this.render(t,e,!1),X.length&&G())}return this},t.progress=t.totalProgress=function(t,e){var i=this.duration();return arguments.length?this.totalTime(i*t,e):i?this._time/i:this.ratio},t.startTime=function(t){return arguments.length?(t!==this._startTime&&(this._startTime=t,this.timeline&&this.timeline._sortChildren&&this.timeline.add(this,t-this._delay)),this):this._startTime},t.endTime=function(t){return this._startTime+(0!=t?this.totalDuration():this.duration())/this._timeScale},t.timeScale=function(t){return arguments.length?(t=t||v,this._timeline&&this._timeline.smoothChildTiming&&(i=(e=this._pauseTime)||0===e?e:this._timeline.totalTime(),this._startTime=i-(i-this._startTime)*this._timeScale/t),this._timeScale=t,this._uncache(!1)):this._timeScale;var e,i},t.reversed=function(t){return arguments.length?(t!=this._reversed&&(this._reversed=t,this.totalTime(this._timeline&&!this._timeline.smoothChildTiming?this.totalDuration()-this._totalTime:this._totalTime,!0)),this):this._reversed},t.paused=function(t){if(!arguments.length)return this._paused;var e,i,r=this._timeline;return t!=this._paused&&r&&(g||t||M.wake(),i=(e=r.rawTime())-this._pauseTime,!t&&r.smoothChildTiming&&(this._startTime+=i,this._uncache(!1)),this._pauseTime=t?e:null,this._paused=t,this._active=this.isActive(),!t&&0!=i&&this._initted&&this.duration()&&(e=r.smoothChildTiming?this._totalTime:(e-this._startTime)/this._timeScale,this.render(e,e===this._totalTime,!0))),this._gc&&!t&&this._enabled(!0,!1),this};var F=p("core.FWDSimpleTimeline",function(t){f.call(this,0,t),this.autoRemoveChildren=this.smoothChildTiming=!0});(t=F.prototype=new f).constructor=F,t.kill()._gc=!1,t._first=t._last=t._recent=null,t._sortChildren=!1,t.add=t.insert=function(t,e,i,r){var s,n;if(t._startTime=Number(e||0)+t._delay,t._paused&&this!==t._timeline&&(t._pauseTime=t._startTime+(this.rawTime()-t._startTime)/t._timeScale),t.timeline&&t.timeline._remove(t,!0),t.timeline=t._timeline=this,t._gc&&t._enabled(!0,!0),s=this._last,this._sortChildren)for(n=t._startTime;s&&s._startTime>n;)s=s._prev;return s?(t._next=s._next,s._next=t):(t._next=this._first,this._first=t),t._next?t._next._prev=t:this._last=t,t._prev=s,this._recent=t,this._timeline&&this._uncache(!0),this},t._remove=function(t,e){return t.timeline===this&&(e||t._enabled(!1,!0),t._prev?t._prev._next=t._next:this._first===t&&(this._first=t._next),t._next?t._next._prev=t._prev:this._last===t&&(this._last=t._prev),t._next=t._prev=t.timeline=null,t===this._recent&&(this._recent=this._last),this._timeline&&this._uncache(!0)),this},t.render=function(t,e,i){var r,s=this._first;for(this._totalTime=this._time=this._rawPrevTime=t;s;)r=s._next,(s._active||t>=s._startTime&&!s._paused)&&(s._reversed?s.render((s._dirty?s.totalDuration():s._totalDuration)-(t-s._startTime)*s._timeScale,e,i):s.render((t-s._startTime)*s._timeScale,e,i)),s=r},t.rawTime=function(){return g||M.wake(),this._totalTime};var D=p("FWDTweenLite",function(t,e,i){if(f.call(this,e,i),this.render=D.prototype.render,null==t)throw"Cannot tween a null target.";this.target=t="string"==typeof t&&D.selector(t)||t;var r,s,n,a=t.jquery||t.length&&t!==_&&t[0]&&(t[0]===_||t[0].nodeType&&t[0].style&&!t.nodeType),o=this.vars.overwrite;if(this._overwrite=o=null==o?Z[D.defaultOverwrite]:"number"==typeof o?o>>0:Z[o],(a||t instanceof Array||t.push&&x(t))&&"number"!=typeof t[0])for(this._targets=n=l(t),this._propLookup=[],this._siblings=[],r=0;r<n.length;r++)(s=n[r])?"string"!=typeof s?s.length&&s!==_&&s[0]&&(s[0]===_||s[0].nodeType&&s[0].style&&!s.nodeType)?(n.splice(r--,1),this._targets=n=n.concat(l(s))):(this._siblings[r]=H(s,this,!1),1===o&&1<this._siblings[r].length&&J(s,this,null,1,this._siblings[r])):"string"==typeof(s=n[r--]=D.selector(s))&&n.splice(r+1,1):n.splice(r--,1);else this._propLookup={},this._siblings=H(t,this,!1),1===o&&1<this._siblings.length&&J(t,this,null,1,this._siblings);(this.vars.immediateRender||0===e&&0===this._delay&&!1!==this.vars.immediateRender)&&(this._time=-v,this.render(Math.min(0,-this._delay)))},!0),z=function(t){return t&&t.length&&t!==_&&t[0]&&(t[0]===_||t[0].nodeType&&t[0].style&&!t.nodeType)};(t=D.prototype=new f).constructor=D,t.kill()._gc=!1,t.ratio=0,t._firstPT=t._targets=t._overwrittenProps=t._startAt=null,t._notifyPluginsOfEnabled=t._lazy=!1,D.version="1.19.0",D.defaultEase=t._ease=new b(null,null,1,1),D.defaultOverwrite="auto",D.ticker=M,D.autoSleep=120,D.lagSmoothing=function(t,e){M.lagSmoothing(t,e)},D.selector=_.$||_.jQuery||function(t){var e=_.$||_.jQuery;return e?(D.selector=e)(t):"undefined"==typeof document?t:document.querySelectorAll?document.querySelectorAll(t):document.getElementById("#"===t.charAt(0)?t.substr(1):t)};var X=[],I={},N=/(?:(-|-=|\+=)?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/gi,Y=function(t){for(var e,i=this._firstPT;i;)e=i.blob?t?this.join(""):this.start:i.c*t+i.s,i.m?e=i.m(e,this._target||i.t):e<1e-6&&-1e-6<e&&(e=0),i.f?i.fp?i.t[i.p](i.fp,e):i.t[i.p](e):i.t[i.p]=e,i=i._next},E=function(t,e,i,r){var s,n,a,o,l,h,f,u=[t,e],p=0,_="",c=0;for(u.start=t,i&&(i(u),t=u[0],e=u[1]),u.length=0,s=t.match(N)||[],n=e.match(N)||[],r&&(r._next=null,r.blob=1,u._firstPT=u._applyPT=r),l=n.length,o=0;o<l;o++)f=n[o],_+=(h=e.substr(p,e.indexOf(f,p)-p))||!o?h:",",p+=h.length,c?c=(c+1)%5:"rgba("===h.substr(-5)&&(c=1),f===s[o]||s.length<=o?_+=f:(_&&(u.push(_),_=""),a=parseFloat(s[o]),u.push(a),u._firstPT={_next:u._firstPT,t:u,p:u.length-1,s:a,c:("="===f.charAt(1)?parseInt(f.charAt(0)+"1",10)*parseFloat(f.substr(2)):parseFloat(f)-a)||0,f:0,m:c&&c<4?Math.round:0}),p+=f.length;return(_+=e.substr(p))&&u.push(_),u.setRatio=Y,u},B=function(t,e,i,r,s,n,a,o,l){"function"==typeof r&&(r=r(l||0,t));var h,f="get"===i?t[e]:i,u=typeof t[e],p="string"==typeof r&&"="===r.charAt(1),_={t:t,p:e,s:f,f:"function"==u,pg:0,n:s||e,m:n?"function"==typeof n?n:Math.round:0,pr:0,c:p?parseInt(r.charAt(0)+"1",10)*parseFloat(r.substr(2)):parseFloat(r)-f||0};if("number"!=u&&("function"==u&&"get"===i&&(h=e.indexOf("set")||"function"!=typeof t["get"+e.substr(3)]?e:"get"+e.substr(3),_.s=f=a?t[h](a):t[h]()),"string"==typeof f&&(a||isNaN(f))?(_.fp=a,_={t:E(f,r,o||D.defaultStringFilter,_),p:"setRatio",s:0,c:1,f:2,pg:0,n:s||e,pr:0,m:0}):p||(_.s=parseFloat(f),_.c=parseFloat(r)-_.s||0)),_.c)return(_._next=this._firstPT)&&(_._next._prev=_),this._firstPT=_},W=D._internals={isArray:x,isSelector:z,lazyTweens:X,blobDif:E},L=D._plugins={},j=W.tweenLookup={},V=0,q=W.reservedProps={ease:1,delay:1,overwrite:1,onComplete:1,onCompleteParams:1,onCompleteScope:1,useFrames:1,runBackwards:1,startAt:1,onUpdate:1,onUpdateParams:1,onUpdateScope:1,onStart:1,onStartParams:1,onStartScope:1,onReverseComplete:1,onReverseCompleteParams:1,onReverseCompleteScope:1,onRepeat:1,onRepeatParams:1,onRepeatScope:1,easeParams:1,yoyo:1,immediateRender:1,repeat:1,repeatDelay:1,data:1,paused:1,reversed:1,autoCSS:1,lazy:1,onOverwrite:1,callbackScope:1,stringFilter:1,id:1},Z={none:0,all:1,auto:2,concurrent:3,allOnStart:4,preexisting:5,true:1,false:0},U=f._rootFramesTimeline=new F,$=f._rootTimeline=new F,Q=30,G=W.lazyRender=function(){var t,e=X.length;for(I={};-1<--e;)(t=X[e])&&!1!==t._lazy&&(t.render(t._lazy[0],t._lazy[1],!0),t._lazy=!1);X.length=0};$._startTime=M.time,U._startTime=M.frame,$._active=U._active=!0,setTimeout(G,1),f._updateRoot=D.render=function(){var t,e,i;if(X.length&&G(),$.render((M.time-$._startTime)*$._timeScale,!1,!1),U.render((M.frame-U._startTime)*U._timeScale,!1,!1),X.length&&G(),M.frame>=Q){for(i in Q=M.frame+(parseInt(D.autoSleep,10)||120),j){for(t=(e=j[i].tweens).length;-1<--t;)e[t]._gc&&e.splice(t,1);0===e.length&&delete j[i]}if((!(i=$._first)||i._paused)&&D.autoSleep&&!U._first&&1===M._listeners.tick.length){for(;i&&i._paused;)i=i._next;i||M.sleep()}}},M.addEventListener("tick",f._updateRoot);var H=function(t,e,i){var r,s,n=t._fwdTweenID;if(j[n||(t._fwdTweenID=n="t"+V++)]||(j[n]={target:t,tweens:[]}),e&&((r=j[n].tweens)[s=r.length]=e,i))for(;-1<--s;)r[s]===e&&r.splice(s,1);return j[n].tweens},K=function(t,e,i,r){var s,n,a=t.vars.onOverwrite;return a&&(s=a(t,e,i,r)),(a=D.onOverwrite)&&(n=a(t,e,i,r)),!1!==s&&!1!==n},J=function(t,e,i,r,s){var n,a,o;if(1===r||4<=r){for(o=s.length,_=0;_<o;_++)if((a=s[_])!==e)a._gc||a._kill(null,t,e)&&(n=!0);else if(5===r)break;return n}for(var l,h=e._startTime+v,f=[],u=0,p=0===e._duration,_=s.length;-1<--_;)(a=s[_])===e||a._gc||a._paused||(a._timeline!==e._timeline?(l=l||tt(e,0,p),0===tt(a,l,p)&&(f[u++]=a)):a._startTime<=h&&a._startTime+a.totalDuration()/a._timeScale>h&&((p||!a._initted)&&h-a._startTime<=2e-10||(f[u++]=a)));for(_=u;-1<--_;)if(a=f[_],2===r&&a._kill(i,t,e)&&(n=!0),2!==r||!a._firstPT&&a._initted){if(2!==r&&!K(a,e))continue;a._enabled(!1,!1)&&(n=!0)}return n},tt=function(t,e,i){for(var r=t._timeline,s=r._timeScale,n=t._startTime;r._timeline;){if(n+=r._startTime,s*=r._timeScale,r._paused)return-100;r=r._timeline}return e<(n/=s)?n-e:i&&n===e||!t._initted&&n-e<2*v?v:(n+=t.totalDuration()/t._timeScale/s)>e+v?0:n-e-v};t._init=function(){var t,e,i,r,s,n,a=this.vars,o=this._overwrittenProps,l=this._duration,h=!!a.immediateRender,f=a.ease;if(a.startAt){for(r in this._startAt&&(this._startAt.render(-1,!0),this._startAt.kill()),s={},a.startAt)s[r]=a.startAt[r];if(s.overwrite=!1,s.immediateRender=!0,s.lazy=h&&!1!==a.lazy,s.startAt=s.delay=null,this._startAt=D.to(this.target,0,s),h)if(0<this._time)this._startAt=null;else if(0!==l)return}else if(a.runBackwards&&0!==l)if(this._startAt)this._startAt.render(-1,!0),this._startAt.kill(),this._startAt=null;else{for(r in 0!==this._time&&(h=!1),i={},a)q[r]&&"autoCSS"!==r||(i[r]=a[r]);if(i.overwrite=0,i.data="isFromStart",i.lazy=h&&!1!==a.lazy,i.immediateRender=h,this._startAt=D.to(this.target,0,i),h){if(0===this._time)return}else this._startAt._init(),this._startAt._enabled(!1),this.vars.immediateRender&&(this._startAt=null)}if(this._ease=f=f?f instanceof b?f:"function"==typeof f?new b(f,a.easeParams):P[f]||D.defaultEase:D.defaultEase,a.easeParams instanceof Array&&f.config&&(this._ease=f.config.apply(f,a.easeParams)),this._easeType=this._ease._type,this._easePower=this._ease._power,this._firstPT=null,this._targets)for(n=this._targets.length,t=0;t<n;t++)this._initProps(this._targets[t],this._propLookup[t]={},this._siblings[t],o?o[t]:null,t)&&(e=!0);else e=this._initProps(this.target,this._propLookup,this._siblings,o,0);if(e&&D._onPluginEvent("_onInitAllProps",this),o&&(this._firstPT||"function"!=typeof this.target&&this._enabled(!1,!1)),a.runBackwards)for(i=this._firstPT;i;)i.s+=i.c,i.c=-i.c,i=i._next;this._onUpdate=a.onUpdate,this._initted=!0},t._initProps=function(t,e,i,r,s){var n,a,o,l,h,f;if(null==t)return!1;for(n in I[t._fwdTweenID]&&G(),this.vars.css||t.style&&t!==_&&t.nodeType&&L.css&&!1!==this.vars.autoCSS&&function(t,e){var i,r={};for(i in t)q[i]||i in e&&"transform"!==i&&"x"!==i&&"y"!==i&&"width"!==i&&"height"!==i&&"className"!==i&&"border"!==i||!(!L[i]||L[i]&&L[i]._autoCSS)||(r[i]=t[i],delete t[i]);t.css=r}(this.vars,t),this.vars)if(f=this.vars[n],q[n])f&&(f instanceof Array||f.push&&x(f))&&-1!==f.join("").indexOf("{self}")&&(this.vars[n]=f=this._swapSelfInParams(f,this));else if(L[n]&&(l=new L[n])._onInitTween(t,this.vars[n],this,s)){for(this._firstPT=h={_next:this._firstPT,t:l,p:"setRatio",s:0,c:1,f:1,n:n,pg:1,pr:l._priority,m:0},a=l._overwriteProps.length;-1<--a;)e[l._overwriteProps[a]]=this._firstPT;(l._priority||l._onInitAllProps)&&(o=!0),(l._onDisable||l._onEnable)&&(this._notifyPluginsOfEnabled=!0),h._next&&(h._next._prev=h)}else e[n]=B.call(this,t,n,"get",f,n,0,null,this.vars.stringFilter,s);return r&&this._kill(r,t)?this._initProps(t,e,i,r,s):1<this._overwrite&&this._firstPT&&1<i.length&&J(t,this,e,this._overwrite,i)?(this._kill(e,t),this._initProps(t,e,i,r,s)):(this._firstPT&&(!1!==this.vars.lazy&&this._duration||this.vars.lazy&&!this._duration)&&(I[t._fwdTweenID]=!0),o)},t.render=function(t,e,i){var r,s,n,a,o,l,h,f=this._time,u=this._duration,p=this._rawPrevTime;if(u-1e-7<=t?(this._totalTime=this._time=u,this.ratio=this._ease._calcEnd?this._ease.getRatio(1):1,this._reversed||(r=!0,s="onComplete",i=i||this._timeline.autoRemoveChildren),0===u&&(!this._initted&&this.vars.lazy&&!i||(this._startTime===this._timeline._duration&&(t=0),(p<0||t<=0&&-1e-7<=t||p===v&&"isPause"!==this.data)&&p!==t&&(i=!0,v<p&&(s="onReverseComplete")),this._rawPrevTime=a=!e||t||p===t?t:v))):t<1e-7?(this._totalTime=this._time=0,this.ratio=this._ease._calcEnd?this._ease.getRatio(0):0,(0!==f||0===u&&0<p)&&(s="onReverseComplete",r=this._reversed),t<0&&(this._active=!1,0===u&&(!this._initted&&this.vars.lazy&&!i||(0<=p&&(p!==v||"isPause"!==this.data)&&(i=!0),this._rawPrevTime=a=!e||t||p===t?t:v))),this._initted||(i=!0)):(this._totalTime=this._time=t,this._easeType?(o=t/u,(1===(l=this._easeType)||3===l&&.5<=o)&&(o=1-o),3===l&&(o*=2),1===(h=this._easePower)?o*=o:2===h?o*=o*o:3===h?o*=o*o*o:4===h&&(o*=o*o*o*o),this.ratio=1===l?1-o:2===l?o:t/u<.5?o/2:1-o/2):this.ratio=this._ease.getRatio(t/u)),this._time!==f||i){if(!this._initted){if(this._init(),!this._initted||this._gc)return;if(!i&&this._firstPT&&(!1!==this.vars.lazy&&this._duration||this.vars.lazy&&!this._duration))return this._time=this._totalTime=f,this._rawPrevTime=p,X.push(this),void(this._lazy=[t,e]);this._time&&!r?this.ratio=this._ease.getRatio(this._time/u):r&&this._ease._calcEnd&&(this.ratio=this._ease.getRatio(0===this._time?0:1))}for(!1!==this._lazy&&(this._lazy=!1),this._active||!this._paused&&this._time!==f&&0<=t&&(this._active=!0),0===f&&(this._startAt&&(0<=t?this._startAt.render(t,e,i):s=s||"_dummyGS"),this.vars.onStart&&(0===this._time&&0!==u||e||this._callback("onStart"))),n=this._firstPT;n;)n.f?n.t[n.p](n.c*this.ratio+n.s):n.t[n.p]=n.c*this.ratio+n.s,n=n._next;this._onUpdate&&(t<0&&this._startAt&&-1e-4!==t&&this._startAt.render(t,e,i),e||(this._time!==f||r||i)&&this._callback("onUpdate")),s&&(this._gc&&!i||(t<0&&this._startAt&&!this._onUpdate&&-1e-4!==t&&this._startAt.render(t,e,i),r&&(this._timeline.autoRemoveChildren&&this._enabled(!1,!1),this._active=!1),!e&&this.vars[s]&&this._callback(s),0===u&&this._rawPrevTime===v&&a!==v&&(this._rawPrevTime=0)))}},t._kill=function(t,e,i){if("all"===t&&(t=null),null==t&&(null==e||e===this.target))return this._lazy=!1,this._enabled(!1,!1);e="string"!=typeof e?e||this._targets||this.target:D.selector(e)||e;var r,s,n,a,o,l,h,f,u,p=i&&this._time&&i._startTime===this._startTime&&this._timeline===i._timeline;if((x(e)||z(e))&&"number"!=typeof e[0])for(r=e.length;-1<--r;)this._kill(t,e[r],i)&&(l=!0);else{if(this._targets){for(r=this._targets.length;-1<--r;)if(e===this._targets[r]){o=this._propLookup[r]||{},this._overwrittenProps=this._overwrittenProps||[],s=this._overwrittenProps[r]=t?this._overwrittenProps[r]||{}:"all";break}}else{if(e!==this.target)return!1;o=this._propLookup,s=this._overwrittenProps=t?this._overwrittenProps||{}:"all"}if(o){if(h=t||o,f=t!==s&&"all"!==s&&t!==o&&("object"!=typeof t||!t._tempKill),i&&(D.onOverwrite||this.vars.onOverwrite)){for(n in h)o[n]&&(u=u||[]).push(n);if((u||!t)&&!K(this,i,e,u))return!1}for(n in h)(a=o[n])&&(p&&(a.f?a.t[a.p](a.s):a.t[a.p]=a.s,l=!0),a.pg&&a.t._kill(h)&&(l=!0),a.pg&&0!==a.t._overwriteProps.length||(a._prev?a._prev._next=a._next:a===this._firstPT&&(this._firstPT=a._next),a._next&&(a._next._prev=a._prev),a._next=a._prev=null),delete o[n]),f&&(s[n]=1);!this._firstPT&&this._initted&&this._enabled(!1,!1)}}return l},t.invalidate=function(){return this._notifyPluginsOfEnabled&&D._onPluginEvent("_onDisable",this),this._firstPT=this._overwrittenProps=this._startAt=this._onUpdate=null,this._notifyPluginsOfEnabled=this._active=this._lazy=!1,this._propLookup=this._targets?{}:[],f.prototype.invalidate.call(this),this.vars.immediateRender&&(this._time=-v,this.render(Math.min(0,-this._delay))),this},t._enabled=function(t,e){if(g||M.wake(),t&&this._gc){var i,r=this._targets;if(r)for(i=r.length;-1<--i;)this._siblings[i]=H(r[i],this,!0);else this._siblings=H(this.target,this,!0)}return f.prototype._enabled.call(this,t,e),!(!this._notifyPluginsOfEnabled||!this._firstPT)&&D._onPluginEvent(t?"_onEnable":"_onDisable",this)},D.to=function(t,e,i){return new D(t,e,i)},D.from=function(t,e,i){return i.runBackwards=!0,i.immediateRender=0!=i.immediateRender,new D(t,e,i)},D.fromTo=function(t,e,i,r){return r.startAt=i,r.immediateRender=0!=r.immediateRender&&0!=i.immediateRender,new D(t,e,r)},D.delayedCall=function(t,e,i,r,s){return new D(e,0,{delay:t,onComplete:e,onCompleteParams:i,callbackScope:r,onReverseComplete:e,onReverseCompleteParams:i,immediateRender:!1,lazy:!1,useFrames:s,overwrite:0})},D.set=function(t,e){return new D(t,0,e)},D.getTweensOf=function(t,e){if(null==t)return[];var i,r,s,n;if(t="string"==typeof t&&D.selector(t)||t,(x(t)||z(t))&&"number"!=typeof t[0]){for(i=t.length,r=[];-1<--i;)r=r.concat(D.getTweensOf(t[i],e));for(i=r.length;-1<--i;)for(n=r[i],s=i;-1<--s;)n===r[s]&&r.splice(i,1)}else for(i=(r=H(t).concat()).length;-1<--i;)(r[i]._gc||e&&!r[i].isActive())&&r.splice(i,1);return r},D.killTweensOf=D.killDelayedCallsTo=function(t,e,i){"object"==typeof e&&(i=e,e=!1);for(var r=D.getTweensOf(t,e),s=r.length;-1<--s;)r[s]._kill(i,t)};var et=p("plugins.TweenPlugin",function(t,e){this._overwriteProps=(t||"").split(","),this._propName=this._overwriteProps[0],this._priority=e||0,this._super=et.prototype},!0);if(t=et.prototype,et.version="1.19.0",et.API=2,t._firstPT=null,t._addTween=B,t.setRatio=Y,t._kill=function(t){var e,i=this._overwriteProps,r=this._firstPT;if(null!=t[this._propName])this._overwriteProps=[];else for(e=i.length;-1<--e;)null!=t[i[e]]&&i.splice(e,1);for(;r;)null!=t[r.n]&&(r._next&&(r._next._prev=r._prev),r._prev?(r._prev._next=r._next,r._prev=null):this._firstPT===r&&(this._firstPT=r._next)),r=r._next;return!1},t._mod=t._roundProps=function(t){for(var e,i=this._firstPT;i;)(e=t[this._propName]||null!=i.n&&t[i.n.split(this._propName+"_").join("")])&&"function"==typeof e&&(2===i.f?i.t._applyPT.m=e:i.m=e),i=i._next},D._onPluginEvent=function(t,e){var i,r,s,n,a,o=e._firstPT;if("_onInitAllProps"===t){for(;o;){for(a=o._next,r=s;r&&r.pr>o.pr;)r=r._next;(o._prev=r?r._prev:n)?o._prev._next=o:s=o,(o._next=r)?r._prev=o:n=o,o=a}o=e._firstPT=s}for(;o;)o.pg&&"function"==typeof o.t[t]&&o.t[t]()&&(i=!0),o=o._next;return i},et.activate=function(t){for(var e=t.length;-1<--e;)t[e].API===et.API&&(L[(new t[e])._propName]=t[e]);return!0},s.plugin=function(t){if(!(t&&t.propName&&t.init&&t.API))throw"illegal plugin definition.";var e,i=t.propName,r=t.priority||0,s=t.overwriteProps,n={init:"_onInitTween",set:"setRatio",kill:"_kill",round:"_mod",mod:"_mod",initAll:"_onInitAllProps"},a=p("plugins."+i.charAt(0).toUpperCase()+i.substr(1)+"Plugin",function(){et.call(this,i,r),this._overwriteProps=s||[]},!0===t.fwd_global),o=a.prototype=new et(i);for(e in(o.constructor=a).API=t.API,n)"function"==typeof t[e]&&(o[n[e]]=t[e]);return a.version=t.version,et.activate([a]),a},o=_._fwd_fwdQueue){for(h=0;h<o.length;h++)o[h]();for(t in w)w[t].func||_.console.log("FWDAnimation encountered missing dependency: "+t)}g=!1}}("undefined"!=typeof fwd_module&&fwd_module.exports&&"undefined"!=typeof fwd_global?fwd_global:this||window,"FWDAnimation"));