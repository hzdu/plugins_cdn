/**
 * Easy Video Player PACKAGED v8.3
 * A to B plugin.
 *
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © 2006 All Rights Reserved.
 */
(function (window){
var FWDEVPATB = function(
		controller
		){

		'use strict';
		
		var _s = this;
		var prototype = FWDEVPATB.prototype;

		_s.useHEXColorsForSkin_bl = controller.useHEXColorsForSkin_bl;
		_s.main = controller.prt;
		_s.timeBackgroundColor = controller._d.atbTimeBackgroundColor;
		_s.timeTextColorNormal = controller._d.atbTimeTextColorNormal;
		_s.timeTextColorSelected = controller._d.atbTimeTextColorSelected;
		_s.buttonTextNormalColor = controller._d.atbButtonTextNormalColor;
		_s.buttonTextSelectedColor = controller._d.atbButtonTextSelectedColor;
		_s.buttonBackgroundNormalColor = controller._d.atbButtonBackgroundNormalColor;
		_s.buttonBackgroundSelectedColor = controller._d.atbButtonBackgroundSelectedColor;
		this.isMobile_bl = FWDEVPUtils.isMobile;
		_s.isShowed_bl = true;
		_s.pa = 0;
		_s.pb = 1;
	

		//##########################################//
		/* initialize self */
		//##########################################//
		_s.init = function(){
			_s.setOverflow("visible");
			_s.mainHolder_do = new FWDEVPDO("div");
			_s.addChild(_s.mainHolder_do);
			if(controller.repeatBackground_bl){
				_s.mainHolder_do.style().background = "url('" + controller.controllerBkPath_str +  "')";
			}else{
				_s.bk_do = new FWDEVPDO("img");
				var img = new Image();
				img.src = controller.controllerBkPath_str;
				_s.bk_do.setScreen(img);
				_s.mainHolder_do.addChild(_s.bk_do);
			}
			
			_s.setupLeftAndRight();
			_s.setupMainScrubber();
			_s.hide(false);
		};

		_s.resize = function(){
			
			_s.setWidth(controller.sW);
			_s.setHeight(controller.sH);
			_s.mainHolder_do.setWidth(controller.sW);
			_s.mainHolder_do.setHeight(controller.sH);

			if(_s.bk_do){
				_s.bk_do.setWidth(controller.sW);
				_s.bk_do.setHeight(controller.sH);
			}
			if(_s.isShowed_bl){
				var offset = 0;
				if(controller.isMainScrubberOnTop_bl) offset += controller.mainScrubber_do.h - controller.mainScrubberOffestTop - 1;
				_s.mainHolder_do.setY(-_s.h - 1 - offset);
			}
			
			_s.positionText();
			_s.positionButtons();
			_s.resizeProgress();
			_s.resizeMainScrubber();
		}

		_s.setupLeftAndRight = function(){

			_s.leftText_do = new FWDEVPDO("div");
			_s.leftText_do.hasT3D = false;
			_s.leftText_do.hasT2D = false;
			_s.leftText_do.setBackfaceVisibility();
			_s.leftText_do.style().fontFamily = "Arial";
			_s.leftText_do.style().fontSize= "12px";
			_s.leftText_do.style().whiteSpace= "nowrap";
			_s.leftText_do.style().textAlign = "center";
			_s.leftText_do.style().padding = "4px";
			_s.leftText_do.style().paddingLeft = "4px";
			_s.leftText_do.style().paddingRIght = "4px";
			_s.leftText_do.style().color = _s.timeTextColorNormal;
			_s.leftText_do.style().backgroundColor = _s.timeBackgroundColor;
			_s.leftText_do.style().fontSmoothing = "antialiased";
			_s.leftText_do.style().webkitFontSmoothing = "antialiased";
			_s.leftText_do.style().textRendering = "optimizeLegibility";
			_s.leftText_do.setInnerHTML("00:00");
			_s.mainHolder_do.addChild(_s.leftText_do);

			_s.rightText_do = new FWDEVPDO("div");
			_s.rightText_do.hasT3D = false;
			_s.rightText_do.hasT2D = false;
			_s.rightText_do.setBackfaceVisibility();
			_s.rightText_do.style().fontFamily = "Arial";
			_s.rightText_do.style().fontSize= "12px";
			_s.rightText_do.style().whiteSpace= "nowrap";
			_s.rightText_do.style().textAlign = "center";
			_s.rightText_do.style().padding = "4px";
			_s.rightText_do.style().paddingLeft = "6px";
			_s.rightText_do.style().paddingRIght = "6px";
			_s.rightText_do.style().color = _s.timeTextColorNormal;
			_s.rightText_do.style().backgroundColor = _s.timeBackgroundColor;
			_s.rightText_do.style().fontSmoothing = "antialiased";
			_s.rightText_do.style().webkitFontSmoothing = "antialiased";
			_s.rightText_do.style().textRendering = "optimizeLegibility";
			_s.rightText_do.setInnerHTML("00:00");
			_s.mainHolder_do.addChild(_s.rightText_do);
		}
		

		_s.setLeftLabel = function(label){
			_s.leftText_do.setInnerHTML(label);
		}

		_s.setRightLabel = function(label){
			_s.rightText_do.setInnerHTML(label);
		}

		_s.setupInitLabels = function(){
			_s.pa = 0;
			_s.pb = 1;
			_s.updateTime();
			_s.positionText();
			setTimeout(_s.positionText, 300);
		}

		_s.updateTime = function(){
			var hasHours = FWDEVPUtils.formatTime(_s.duration).length > 5;
			var totalTime = FWDEVPUtils.formatTime(_s.duration);
			_s.rightTime = FWDEVPUtils.formatTime(_s.duration * _s.pb);
			_s.leftTime = FWDEVPUtils.formatTime(_s.duration * _s.pa);
			if(_s.rightTime.length < 6 && hasHours) _s.rightTime = "00:" + _s.rightTime; 

			if(_s.rightTime.length > 5 && _s.leftTime.length < 6) _s.leftTime = "00:" + _s.leftTime;
			_s.setLeftLabel(_s.leftTime);
			_s.setRightLabel(_s.rightTime);
		}

		_s.positionText = function(){
			_s.leftText_do.setX(controller.startSpaceBetweenButtons);
			_s.leftText_do.setY(Math.round((controller.sH - _s.leftText_do.getHeight())/2));
			_s.rightText_do.setX(controller.sW - controller.startSpaceBetweenButtons - _s.rightText_do.getWidth());
			_s.rightText_do.setY(Math.round((controller.sH - _s.rightText_do.getHeight())/2));
		}


		//################################################//
		/* Setup main scrubber */
		//################################################//
		this.setupMainScrubber = function(){

			//setup background bar
			_s.mainScrubber_do = new FWDEVPDO("div");
			_s.mainScrubber_do.setOverflow('visible');
			_s.mainScrubber_do.setY(parseInt((controller.sH - controller.scrubbersHeight)/2));
			_s.mainScrubber_do.setHeight(controller.scrubbersHeight);
		
			var mainScrubberBkLeft_img = new Image();
			mainScrubberBkLeft_img.src = controller.mainScrubberBkLeft_img.src;

			mainScrubberBkLeft_img.width = controller.mainScrubberBkLeft_img.width;
			mainScrubberBkLeft_img.height = controller.mainScrubberBkLeft_img.height;
			_s.mainScrubberBkLeft_do = new FWDEVPDO("img");
			_s.mainScrubberBkLeft_do.setScreen(mainScrubberBkLeft_img);

			var rightImage = new Image();
			rightImage.src = controller.mainScrubberBkRight_img.src;
			_s.mainScrubberBkRight_do = new FWDEVPDO("img");
			_s.mainScrubberBkRight_do.setScreen(rightImage);
			_s.mainScrubberBkRight_do.setWidth( controller.mainScrubberBkRight_img.width);
			_s.mainScrubberBkRight_do.setHeight( controller.mainScrubberBkRight_img.height);
			
			var middleImage = new Image();
			middleImage.src = controller.mainScrubberBkMiddlePath_str;
			
			_s.mainScrubberBkMiddle_do = new FWDEVPDO("div");	
			_s.mainScrubberBkMiddle_do.style().background = "url('" + controller.mainScrubberBkMiddlePath_str + "') repeat-x";
		
			_s.mainScrubberBkMiddle_do.setHeight(controller.scrubbersHeight);
			_s.mainScrubberBkMiddle_do.setX(controller.scrubbersBkLeftAndRightWidth);

			_s.mainScrubber_do.addChild(_s.mainScrubberBkLeft_do);
			_s.mainScrubber_do.addChild(_s.mainScrubberBkMiddle_do);
			_s.mainScrubber_do.addChild(_s.mainScrubberBkRight_do);
			_s.mainHolder_do.addChild(_s.mainScrubber_do);

			//setup progress bar
			_s.mainScrubberDrag_do = new FWDEVPDO("div");
			_s.mainScrubberDrag_do.setHeight(controller.scrubbersHeight);
			
			_s.mainScrubberMiddleImage = new Image();
			_s.mainScrubberMiddleImage.src = controller.mainScrubberDragMiddlePath_str;
			
			if(_s.useHEXColorsForSkin_bl){
				_s.mainScrubberDragMiddle_do = new FWDEVPDO("div");
				_s.mainScrubberMiddleImage.onload = function(){
					var testCanvas = FWDEVPUtils.getCanvasWithModifiedColor(_s.mainScrubberMiddleImage, controller.nBC, true);
					_s.mainSCrubberMiddleCanvas = testCanvas.canvas;
					_s.mainSCrubberDragMiddleImageBackground = testCanvas.image;
					_s.mainScrubberDragMiddle_do.style().background = "url('" + _s.mainSCrubberDragMiddleImageBackground.src + "') repeat-x";
				}
			}else{
				_s.mainScrubberDragMiddle_do = new FWDEVPDO("div");	
				_s.mainScrubberDragMiddle_do.style().background = "url('" + controller.mainScrubberDragMiddlePath_str + "') repeat-x";
			}
		
			_s.mainScrubberDragMiddle_do.setHeight(controller.scrubbersHeight);
			_s.mainScrubber_do.addChild(_s.mainScrubberDragMiddle_do);
			

			// Setup a to b loop buttons
			FWDEVPTextButton.setPrototype();
			_s.left_do = new FWDEVPTextButton(
				'A',
				 _s.buttonTextNormalColor,
				 _s.buttonTextSelectedColor,
				 _s.buttonBackgroundNormalColor,
				 _s.buttonBackgroundSelectedColor,
				 controller._d.handPath_str,
				 controller._d.grabPath_str
				 );
			_s.mainScrubber_do.addChild(_s.left_do);
			_s.left_do.addListener(FWDEVPTextButton.MOUSE_DOWN, _s.aDown);
			_s.left_do.addListener(FWDEVPTextButton.MOUSE_UP, _s.aUp);

			FWDEVPTextButton.setPrototype();
			_s.right_do = new FWDEVPTextButton(
				'B',
				 _s.buttonTextNormalColor,
				 _s.buttonTextSelectedColor,
				 _s.buttonBackgroundNormalColor,
				 _s.buttonBackgroundSelectedColor,
				 controller._d.handPath_str,
				 controller._d.grabPath_str
				 );
			_s.mainScrubber_do.addChild(_s.right_do);
			_s.right_do.addListener(FWDEVPTextButton.MOUSE_DOWN, _s.bDown);
			_s.right_do.addListener(FWDEVPTextButton.MOUSE_UP, _s.bUp);
		}

		_s.bDown = function(e){
			_s.scrub = true
			var viewportMouseCoordinates = FWDEVPUtils.getViewportMouseCoordinates(e.e);	
			_s.lastPresedX = viewportMouseCoordinates.screenX;
			_s.leftXPositionOnPress = _s.right_do.getX();
			if(_s.isMobile_bl){
				window.addEventListener("touchmove", _s.bMoveHandler);
			}else{
				window.addEventListener("mousemove", _s.bMoveHandler);
			}
			FWDAnimation.to(_s.rightText_do.screen, .8, {css:{color:_s.timeTextColorSelected}, ease:Expo.easeOut});
			_s.dispatchEvent(FWDEVPATB.START_TO_SCRUB);
		}

		_s.bUp = function(e){
			_s.scrub = false;
			if(_s.isMobile_bl){
				window.removeEventListener("touchmove", _s.bMoveHandler);
			}else{
				window.removeEventListener("mousemove", _s.bMoveHandler);
			}
			FWDAnimation.to(_s.rightText_do.screen, .8, {css:{color:_s.timeTextColorNormal}, ease:Expo.easeOut});
			_s.dispatchEvent(FWDEVPATB.STOP_TO_SCRUB);
		}

		_s.bMoveHandler = function(e){
			if(e.preventDefault) e.preventDefault();
			var viewportMouseCoordinates = FWDEVPUtils.getViewportMouseCoordinates(e);	
			_s.finalHandlerX = Math.round(_s.leftXPositionOnPress + viewportMouseCoordinates.screenX - _s.lastPresedX);
			if(_s.finalHandlerX <= Math.round(_s.left_do.x + _s.left_do.getWidth() + 2)){
				_s.finalHandlerX = Math.round(_s.left_do.x + _s.left_do.getWidth() + 2);
			}else if(_s.finalHandlerX > _s.mainScrubber_do.w - _s.right_do.getWidth()){
				_s.finalHandlerX = _s.mainScrubber_do.w - _s.right_do.getWidth();
			}
			_s.right_do.setX(_s.finalHandlerX);
			_s.pb = _s.right_do.x/(_s.mainScrubber_do.w - _s.right_do.getWidth());
			_s.updateTime();
			_s.resizeProgress();
		}

		_s.aDown = function(e){
			_s.scrub = true;
			var viewportMouseCoordinates = FWDEVPUtils.getViewportMouseCoordinates(e.e);	
			_s.lastPresedX = viewportMouseCoordinates.screenX;
			_s.leftXPositionOnPress = _s.left_do.getX();
			if(_s.isMobile_bl){
				window.addEventListener("touchmove", _s.aMoveHandler);
			}else{
				window.addEventListener("mousemove", _s.aMoveHandler);
			}
			FWDAnimation.to(_s.leftText_do.screen, .8, {css:{color:_s.timeTextColorSelected}, ease:Expo.easeOut});
			_s.dispatchEvent(FWDEVPATB.START_TO_SCRUB);
		}

		_s.aUp = function(e){
			_s.scrub = false;
			if(_s.isMobile_bl){
				window.removeEventListener("touchmove", _s.aMoveHandler);
			}else{
				window.removeEventListener("mousemove", _s.aMoveHandler);
			}
			FWDAnimation.to(_s.leftText_do.screen, .8, {css:{color:_s.timeTextColorNormal}, ease:Expo.easeOut});
			_s.dispatchEvent(FWDEVPATB.STOP_TO_SCRUB);
		}

		_s.aMoveHandler = function(e){
			if(e.preventDefault) e.preventDefault();
			var viewportMouseCoordinates = FWDEVPUtils.getViewportMouseCoordinates(e);	
			_s.finalHandlerX = Math.round(_s.leftXPositionOnPress + viewportMouseCoordinates.screenX - _s.lastPresedX);
			if(_s.finalHandlerX <= 0){
				_s.finalHandlerX = 0;
			}else if(_s.finalHandlerX > Math.round(_s.right_do.x - _s.left_do.getWidth() - 2)){
				_s.finalHandlerX = Math.round(_s.right_do.x - _s.left_do.getWidth() - 2);
			}
			_s.left_do.setX(_s.finalHandlerX);
			_s.pa = _s.left_do.x/_s.mainScrubber_do.w;
			_s.updateTime();
			_s.resizeProgress();
		}

		this.resizeMainScrubber = function(){
			_s.mainScrubberWidth = controller.sW - controller.startSpaceBetweenButtons * 6 - _s.leftText_do.getWidth() - _s.rightText_do.getWidth();
			_s.mainScrubber_do.setWidth(_s.mainScrubberWidth);
			_s.mainScrubber_do.setX(_s.leftText_do.getWidth() + controller.startSpaceBetweenButtons * 3);
			_s.mainScrubber_do.setY(parseInt((controller.sH - controller.scrubbersHeight)/2));
			_s.mainScrubberBkMiddle_do.setWidth(_s.mainScrubberWidth - controller.scrubbersBkLeftAndRightWidth * 2);
			_s.mainScrubberBkRight_do.setX(_s.mainScrubberWidth - controller.scrubbersBkLeftAndRightWidth);
		}

		_s.positionButtons = function(){
			_s.left_do.setX(_s.pa * _s.mainScrubber_do.w);
			_s.right_do.setX(_s.pb * (_s.mainScrubber_do.w - _s.right_do.getWidth()));
		}

		_s.resizeProgress = function(){
			_s.mainScrubberDragMiddle_do.setX(_s.left_do.x + _s.left_do.getWidth() + 1);
			_s.mainScrubberDragMiddle_do.setWidth(_s.right_do.x - (_s.left_do.x + _s.left_do.getWidth() + 2));
		}


		//################################################//
		/* Hide and show */
		//################################################//
		this.show = function(animate){
			
			if(_s.isShowed_bl) return;

			_s.duration = _s.main.totalTimeInSeconds;
			_s.scrub = false;
			_s.setupInitLabels();

			_s.positionText();
			_s.positionButtons();
			_s.resizeProgress();
			_s.resizeMainScrubber();
			setTimeout(function(){
				_s.positionText();
				_s.positionButtons();
				_s.resizeProgress();
				_s.resizeMainScrubber();
			}, 300);
			_s.isShowed_bl = true;
			var offset = 0;
			if(controller.isMainScrubberOnTop_bl) offset += controller.mainScrubber_do.h - controller.mainScrubberOffestTop - 1;
			_s.mainHolder_do.setVisible(true);
			if(animate){
				FWDAnimation.to(_s.mainHolder_do, .8, {y:-_s.h - 1 - offset, ease:Expo.easeInOut});
			}else{
				FWDAnimation.killTweensOf(_s.mainHolder_do);
				_s.mainHolder_do.setY(-_s.h - 1);
			}
			setTimeout(_s.positionButtons, 200);
			
		};

		this.hide = function(animate){
			if(!_s.isShowed_bl) return;
			_s.isShowed_bl = false;
			if(animate){
				FWDAnimation.to(_s.mainHolder_do, .8, {y:0, ease:Expo.easeInOut, onComplete:function(){_s.mainHolder_do.setVisible(false)}});
			}else{
				FWDAnimation.killTweensOf(_s.mainHolder_do);
				_s.mainHolder_do.setY(0);
			}
			setTimeout(_s.positionButtons, 200);
		};
	
		
		_s.init();
	};
	
	/* set prototype */
	FWDEVPATB.setPrototype = function(){
		FWDEVPATB.prototype = null;
		FWDEVPATB.prototype = new FWDEVPDO("div");
	};

	FWDEVPATB.START_TO_SCRUB = "startToScrub";
	FWDEVPATB.SCRUB = "scrub";
	FWDEVPATB.STOP_TO_SCRUB = "stopToScrub";

	FWDEVPATB.prototype = null;
	window.FWDEVPATB = FWDEVPATB;
}(window));


/* FWDEVPTextButton */
(function (window){
var FWDEVPTextButton = function(
		label,
		colorN,
		colorS,
		bkColorN,
		bkColorS,
		cursor,
		cursor2
		){
		
		var _s = this;
		var prototype = FWDEVPTextButton.prototype;
		
		this.nImg_img = null;
		this.sImg_img = null;
		
		this.dumy_do = null;
		this.cursor = cursor;
		this.cursor2 = cursor2;
	
		this.label_str = label;
		this.colorN_str = colorN;	
		this.colorS_str = colorS;
		this.bkColorN_str = bkColorN;
		this.bkColorS_str = bkColorS;
	
		this.isDisabled_bl = false;
		this.isMobile_bl = FWDEVPUtils.isMobile;
		

		//##########################################//
		/* initialize this */
		//##########################################//
		this.init = function(){
			_s.setupMainContainers();
			
		};
		

		//##########################################//
		/* setup main containers */
		//##########################################//
		this.setupMainContainers = function(){
			
			_s.hasT3D = false;
			_s.hasT2D = false;
			_s.setBackfaceVisibility();
			_s.style().display = "inline-block";
			_s.style().clear = "both";
			_s.style().fontFamily = "Arial";
			_s.style().fontSize= "12px";
			_s.style().whiteSpace= "nowrap";
			_s.style().padding = "3px 4px";
			_s.style().color = _s.colorN_str;
			_s.style().backgroundColor = _s.bkColorN_str;
			_s.style().fontSmoothing = "antialiased";
			_s.style().webkitFontSmoothing = "antialiased";
			_s.style().textRendering = "optimizeLegibility";	
			_s.setInnerHTML(_s.label_str);
			
			_s.dumy_do = new FWDEVPDO("div");
			if(FWDEVPUtils.isIE){
				_s.dumy_do.setBkColor("#00FF00");
				_s.dumy_do.setAlpha(0.0001);
			}
			_s.dumy_do.style().cursor = 'grab';
			_s.dumy_do.style().width = "100%";
			_s.dumy_do.style().height = "50px";
			_s.addChild(_s.dumy_do);
			
			if(_s.hasPointerEvent_bl){
				_s.screen.addEventListener("pointerup", _s.onMouseUp);
				_s.screen.addEventListener("pointerover", _s.onMouseOver);
				_s.screen.addEventListener("pointerout", _s.onMouseOut);
			}else if(_s.screen.addEventListener){	
				if(!_s.isMobile_bl){
					_s.screen.addEventListener("mouseover", _s.onMouseOver);
					_s.screen.addEventListener("mouseout", _s.onMouseOut);
					_s.screen.addEventListener("mousedown", _s.onMouseDown);
				}
				_s.screen.addEventListener("touchstart", _s.onMouseDown);
			}
		};
		
		this.onMouseOver = function(e){
			if(_s.isDisabled_bl) return;
			_s.setSelectedState();
		};
			
		this.onMouseOut = function(e){
			if(_s.isDisabled_bl || _s.grabed) return;
			_s.setNormalState();
		};


		this.onMouseDown = function(e){
			if(_s.isDisabled_bl) return;
		
			_s.grabed = true;
			if(!_s.isMobile_bl){
				window.addEventListener('mouseup', _s.checkUp)
			}else{
				window.addEventListener('touchend', _s.checkUp)
			}
			_s.dumy_do.style().cursor = 'grabbing';
			document.getElementsByTagName("body")[0].style.cursor = 'grabbing';

			_s.dispatchEvent(FWDEVPTextButton.MOUSE_DOWN, {e:e});
		};

		this.checkUp = function(e){
			var vc = FWDEVPUtils.getViewportMouseCoordinates(e);	
			if(!FWDEVPUtils.hitTest(_s.screen, vc.screenX, vc.screenY)){
				_s.setNormalState();	
				if(!_s.isMobile_bl){
					window.removeEventListener('mouseup', _s.checkUp);
				}else{
					window.addEventListener('touchend', _s.checkUp);
				}
			}
			_s.grabed = false;
			_s.dumy_do.style().cursor = 'grab';
			document.getElementsByTagName("body")[0].style.cursor = 'auto';
			_s.dispatchEvent(FWDEVPTextButton.MOUSE_UP);
		}


		//####################################//
		/* Set normal / selected state */
		//####################################//
		this.setNormalState = function(animate){
			FWDAnimation.to(_s.screen, .8, {css:{color:_s.colorN_str, backgroundColor:_s.bkColorN_str}, ease:Expo.easeOut});
		};
		
		this.setSelectedState = function(animate){
			FWDAnimation.to(_s.screen, .8, {css:{color:_s.colorS_str, backgroundColor:_s.bkColorS_str}, ease:Expo.easeOut});
		};

		this.disable = function(){
			this.onMouseOver();
			this.dumy_do.setButtonMode(false);
			FWDAnimation.to(_s, .8, {alpha:.4, ease:Expo.easeOut});
			this.isDisabled_bl = true;
		}
		
		this.enable = function(){
			this.isDisabled_bl = false;
			this.onMouseOut();
			this.dumy_do.setButtonMode(true);
			FWDAnimation.to(_s, .8, {alpha:1, ease:Expo.easeOut});
			
		}
	
		_s.init();
	};
	
	/* set prototype */
	FWDEVPTextButton.setPrototype = function(){
		FWDEVPTextButton.prototype = null;
		FWDEVPTextButton.prototype = new FWDEVPDO("div");
	};
	
	FWDEVPTextButton.MOUSE_UP = 'mouseUp';
	FWDEVPTextButton.MOUSE_DOWN = 'mouseDown';
	
	FWDEVPTextButton.prototype = null;
	window.FWDEVPTextButton = FWDEVPTextButton;
}(window));