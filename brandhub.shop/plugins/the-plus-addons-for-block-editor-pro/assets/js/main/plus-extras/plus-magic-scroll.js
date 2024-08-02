
'use strict';
class TpagMagicScroll {
	constructor() {  // Constructor
	  this.scene = [];
	  this.controller = [];
	  this.ms = this.eleScrollEvent(); //onload Init
	  this.getresize() //resize trigger
	}

	getresize(){
		var OldDevice = this.viewDevice();
		var $this = this;
		window.addEventListener('resize', function(event) {
			var device = $this.viewDevice();
			if(device && $this.controller){
				if(OldDevice!==device){
					OldDevice = device;
					var ele = $this.getElements()
					if(ele && ele.length){
						ele.forEach(function(e) {
							if($this.controller[e.className]){
								$this.controller[e.className] = $this.controller[e.className].destroy(true)
								delete $this.controller[e.className];
							}
						})
					}
					//reInit resize
					$this.eleScrollEvent();
				}
			}
		});
	}
	getSelector() {
		return '.tpgb_magic_scroll';
	}
	
	getElements(){
		const selectors = this.getSelector();
		let ele = document.querySelectorAll(selectors);
		if(ele){
			return ele;
		}

		return false;
	}

	viewDevice(){
		var device = 'md';
		var winWidth = window.innerWidth;
		if(winWidth <=1024 && winWidth >=768){
			device = 'sm';
		}else if(winWidth <=767){
			device = 'xs';
		}
		return device;
	}

	eleScrollEvent(){
		var ele = this.getElements()
		if(ele){
			var device = this.viewDevice();
			var $this = this;
			ele.forEach(function(e) {
				var msAttr = {};
				if(e.dataset && e.dataset.tpgbMs){
					msAttr = JSON.parse(e.dataset.tpgbMs)
				}
				var msView = {};
				if(e.dataset && e.dataset.tpgbMsview){
					msView = JSON.parse(e.dataset.tpgbMsview)
				}
				if(msAttr && msAttr.length && msView && msView.length && Object.values(msView).includes(device)){
					// init controller
					$this.controller[e.className] = new ScrollMagic.Controller();
					
					$this.getSceneGenerate(msAttr, msView, e, device);
                    e.classList.add('tpgb-ms-loaded');
				}else{
					e.classList.add('tpgb-ms-loaded');
				}
			});
		}

	}

	checkDevice(value){
		var deVal = null;
		if(value!=undefined){
			if(typeof value == 'object'){
				var fromVal = (value[0]!=='') ? (Number(value[0])) : '';
				var toVal = (value[1]!=='') ? (Number(value[1])) : '';
				if(fromVal!=='' && toVal!==''){
					deVal = [fromVal, toVal];
				}
			}else{
				deVal = (value!=='') ? (Number(value)) : '';
			}
		}
		return deVal
	}

	getDeviceVal(value, device){
		var newVal = null;
		if( device == 'md' && value ){
			newVal = this.checkDevice(value['md']);
		}
		if( device == 'sm' && value ){
			newVal = this.checkDevice(value['sm']);
			if(newVal===null){
				newVal = this.checkDevice(value['md']);
			}
		}else if( device == 'xs' && value ){
			newVal = this.checkDevice(value['xs']);
			if(newVal===null){
				newVal = this.checkDevice(value['sm']);
			}
			if(newVal===null){
				newVal = this.checkDevice(value['md']);
			}
		}
		return newVal;
	}

	getSceneGenerate( msAttr, msView , e, device) {
		var eChild = e.firstChild
        
		if(msAttr && msAttr.length){
			
			msAttr.forEach(sceneLoop => {
				
				let dataTween = {};
				let dataFrom = {};

				if(sceneLoop){
					var loop = sceneLoop;

					//Vertical
					if(loop.vertical){
						var verticalOpt = loop.vertical,
							fromVal = 0,
							toVal = 5;
						
						if(verticalOpt.speed){
							var verVal = this.getDeviceVal(verticalOpt.speed, device);
							fromVal = (verVal[0]!=='') ? (Number(verVal[0]) * 50) : 0 
							toVal = (verVal[1]!=='') ? (Number(verVal[1]) * 50) : (5 * 50);
						}
						
						var fromSet = (verticalOpt.reverse) ? Number(toVal) : Number(fromVal);
						var toSet = (verticalOpt.reverse) ? Number(fromVal) : Number(toVal);
						
						dataFrom = Object.assign({ y : fromSet }, dataFrom)
						dataTween = Object.assign({ y : toSet }, dataTween)
					}

					//Horizontal
					if(loop.horizontal){
						var horizontalOpt = loop.horizontal,
						fromVal = 0,
						toVal = 5;
					
						if(horizontalOpt.speed){
							var horVal = this.getDeviceVal(horizontalOpt.speed, device);
							fromVal = (horVal[0]!=='') ? (Number(horVal[0]) * 50) : 0 
							toVal = (horVal[1]!=='') ? (Number(horVal[1]) * 50) : (5 * 50);
						}

						var fromSet = (horizontalOpt.reverse) ? Number(toVal) : Number(fromVal);
						var toSet = (horizontalOpt.reverse) ? Number(fromVal) : Number(toVal);

						dataFrom = Object.assign({ x : fromSet }, dataFrom)
						dataTween = Object.assign({ x : toSet }, dataTween)
					}

					//Opacity
					if(loop.opacity){
						var opacityOpt = loop.opacity,
						fromVal = 0,
						toVal = 0;
					
						if(opacityOpt.speed){
							var opVal = this.getDeviceVal(opacityOpt.speed, device);
							fromVal = (opVal[0]!=='') ? (Number(opVal[0]) / 10) : 0 
							toVal = (opVal[1]!=='') ? (Number(opVal[1]) / 10) : 1;
						}

						var fromSet = (opacityOpt.reverse) ? Number(toVal) : Number(fromVal);
						var toSet = (opacityOpt.reverse) ? Number(fromVal) : Number(toVal);

						dataFrom = Object.assign({ opacity : fromSet }, dataFrom)
						dataTween = Object.assign({ opacity : toSet }, dataTween)
					}

					//Rotate
					if(loop.rotate){
						var rotateOpt = loop.rotate,
						fromXVal = 0, toXVal = 0,
						fromYVal = 0, toYVal = 0,
						fromZVal = 0, toZVal = 0;
					
						if(rotateOpt.rotateX){
							var rotateX = this.getDeviceVal(rotateOpt.rotateX, device);
							fromXVal = (rotateX[0]!=='') ? (Number(rotateX[0]) * 50) : 0 
							toXVal = (rotateX[1]!=='') ? (Number(rotateX[1]) * 50) : (5 * 50);
						}
						if(rotateOpt.rotateY){
							var rotateY = this.getDeviceVal(rotateOpt.rotateY, device);
							fromYVal = (rotateY[0]!=='') ? (Number(rotateY[0]) * 50) : 0 
							toYVal = (rotateY[1]!=='') ? (Number(rotateY[1]) * 50) : (5 * 50);
						}
						if(rotateOpt.rotateZ){
							var rotateZ = this.getDeviceVal(rotateOpt.rotateZ, device);
							fromZVal = (rotateZ[0]!=='') ? (Number(rotateZ[0]) * 50) : 0 
							toZVal = (rotateZ[1]!=='') ? (Number(rotateZ[1]) * 50) : (5 * 50);
						}

						var fromXSet = (rotateOpt.reverse) ? Number(toXVal) : Number(fromXVal);
						var toXSet = (rotateOpt.reverse) ? Number(fromXVal) : Number(toXVal);

						var fromYSet = (rotateOpt.reverse) ? Number(toYVal) : Number(fromYVal);
						var toYSet = (rotateOpt.reverse) ? Number(fromYVal) : Number(toYVal);

						var fromZSet = (rotateOpt.reverse) ? Number(toZVal) : Number(fromZVal);
						var toZSet = (rotateOpt.reverse) ? Number(fromZVal) : Number(toZVal);

						dataFrom = Object.assign({ rotationX: fromXSet, rotationY: fromYSet, rotationZ: fromZSet, transformOrigin: rotateOpt.position }, dataFrom)
						dataTween = Object.assign({ rotationX: toXSet, rotationY: toYSet, rotationZ: toZSet, transformOrigin: rotateOpt.position }, dataTween);
					}

					//Scale
					if(loop.scale){
						var scaleOpt = loop.scale,
						fromXVal = 1, toXVal = 1,
						fromYVal = 1, toYVal = 1,
						fromZVal = 1, toZVal = 1;
					
						if(scaleOpt.scaleX){
							var scaleX = this.getDeviceVal(scaleOpt.scaleX, device);
							fromXVal = (scaleX[0]!=='') ? (Number(scaleX[0])) : 1 
							toXVal = (scaleX[1]!=='') ? (Number(scaleX[1])) : 1;
						}
						if(scaleOpt.scaleY){
							var scaleY = this.getDeviceVal(scaleOpt.scaleY, device);
							fromYVal = (scaleY[0]!=='') ? (Number(scaleY[0])) : 1 
							toYVal = (scaleY[1]!=='') ? (Number(scaleY[1])) : 1;
						}
						if(scaleOpt.scaleZ){
							var scaleZ = this.getDeviceVal(scaleOpt.scaleZ, device);
							fromZVal = (scaleZ[0]!=='') ? (Number(scaleZ[0])) : 1 
							toZVal = (scaleZ[1]!=='') ? (Number(scaleZ[1])) : 1;
						}

						var fromXSet = (scaleOpt.reverse) ? Number(toXVal) : Number(fromXVal);
						var toXSet = (scaleOpt.reverse) ? Number(fromXVal) : Number(toXVal);

						var fromYSet = (scaleOpt.reverse) ? Number(toYVal) : Number(fromYVal);
						var toYSet = (scaleOpt.reverse) ? Number(fromYVal) : Number(toYVal);

						var fromZSet = (scaleOpt.reverse) ? Number(toZVal) : Number(fromZVal);
						var toZSet = (scaleOpt.reverse) ? Number(fromZVal) : Number(toZVal);

						dataFrom = Object.assign({ scaleX: fromXSet, scaleY: fromYSet, scaleZ: fromZSet }, dataFrom);
						dataTween = Object.assign({ scaleX: toXSet, scaleY: toYSet, scaleZ: toZSet }, dataTween);
					}

					//Skew
					if(loop.skew){
						var skewOpt = loop.skew,
						fromXVal = 0, toXVal = 0,
						fromYVal = 0, toYVal = 0;
					
						if(skewOpt.skewX){
							var skewX = this.getDeviceVal(skewOpt.skewX, device);
							fromXVal = (skewX[0]!=='') ? (Number(skewX[0]) * 50) : 0 
							toXVal = (skewX[1]!=='') ? (Number(skewX[1]) * 50) : 0;
						}
						if(skewOpt.skewY){
							var skewY = this.getDeviceVal(skewOpt.skewY, device);
							fromYVal = (skewY[0]!=='') ? (Number(skewY[0]) * 50) : 0 
							toYVal = (skewY[1]!=='') ? (Number(skewY[1]) * 50) : 0;
						}

						var fromXSet = (skewOpt.reverse) ? Number(toXVal) : Number(fromXVal);
						var toXSet = (skewOpt.reverse) ? Number(fromXVal) : Number(toXVal);

						var fromYSet = (skewOpt.reverse) ? Number(toYVal) : Number(fromYVal);
						var toYSet = (skewOpt.reverse) ? Number(fromYVal) : Number(toYVal);

						dataFrom = Object.assign({ skewX: fromXSet, skewY: fromYSet }, dataFrom);
						dataTween = Object.assign({ skewX: toXSet, skewY: toYSet }, dataTween);
					}

					//Border Radius
					if(loop.borderR){
						var bROpt = loop.borderR,
						fromVal = 0, toVal = 0;
						
						if(bROpt.fromBR){
							var frunit = (bROpt.fromBR.unit) ? bROpt.fromBR.unit : 'px';
							var fromDimension = (device=='md' && bROpt.fromBR[device]) ? bROpt.fromBR[device] : '';
								fromDimension = (device=='sm' && bROpt.fromBR[device]) ? bROpt.fromBR[device] : fromDimension;
								fromDimension = (device=='xs' && bROpt.fromBR[device]) ? bROpt.fromBR[device] : fromDimension;
							if(fromDimension!=='' && (fromDimension.top || fromDimension.bottom || fromDimension.left || fromDimension.right)){
								fromVal = fromDimension.top + frunit +' ';
								fromVal += fromDimension.right + frunit +' ';
								fromVal += fromDimension.bottom + frunit +' ';
								fromVal += fromDimension.left + frunit;
							}
						}
						
						if(bROpt.toBR && bROpt.toBR.md){
							var tounit = (bROpt.toBR.unit) ? bROpt.toBR.unit : 'px';
							var toDimension = (device=='md' && bROpt.toBR[device]) ? bROpt.toBR[device] : '';
								toDimension = (device=='sm' && bROpt.toBR[device]) ? bROpt.toBR[device] : toDimension;
								toDimension = (device=='xs' && bROpt.toBR[device]) ? bROpt.toBR[device] : toDimension;
							if(toDimension!=='' && (toDimension.top || toDimension.bottom || toDimension.left || toDimension.right)){
								toVal = toDimension.top + tounit +' ';
								toVal += toDimension.right + tounit +' ';
								toVal += toDimension.bottom + tounit +' ';
								toVal += toDimension.left + tounit;
							}
						}

						dataFrom = Object.assign({ borderRadius: fromVal }, dataFrom, {overflow : 'hidden'});
						dataTween = Object.assign({ borderRadius: toVal }, dataTween, {overflow : 'hidden'});
					}
					
					//Background Color
					if(loop.bgColor){
						var bgOpt = loop.bgColor,
						fromVal = '', toVal = '';
						if(bgOpt.fromColor){
							fromVal = bgOpt.fromColor
							dataFrom = Object.assign({ backgroundColor: fromVal }, dataFrom );	
						}
						if(bgOpt.toColor){
							toVal = bgOpt.toColor
							dataTween = Object.assign({ backgroundColor: toVal }, dataTween );
						}
					}
					
					if( (dataFrom && Object.keys(dataFrom).length) || (dataTween && Object.keys(dataTween).length) || (loop.sticky!=undefined && loop.sticky)){

						// build scene
						var scene = new ScrollMagic.Scene({
							triggerElement: e,
						});
                        
						var tween = new TimelineMax();

						if(loop.repeat!=undefined){
							var repeat = this.getDeviceVal(loop.repeat, device);
							var yoVal = (Number(repeat)===0) ? false : true;
							dataTween = Object.assign({ repeat: Number(repeat), yoyo: yoVal}, dataTween);
						}
						if(loop.delay!=undefined){
							var delay = this.getDeviceVal(loop.delay, device);
							var delVal = (Number(delay)!='') ? Number(delay) : '';
							if(delVal!==''){
								dataTween = Object.assign({ delay: Number(delVal)}, dataTween);
							}
						}
						if(loop.easing!=undefined && loop.easing!=''){
							dataTween = Object.assign({ ease: loop.easing}, dataTween);
						}
						
						dataFrom = Object.assign({ transition: 'none' }, dataFrom);
						var durTime = 1;
						if(loop.timing!=undefined){
							var timing = this.getDeviceVal(loop.timing, device);
							durTime = (Number(timing)!='') ? Number(timing) : 1;
						}
						var selectorDiv = eChild;
						if(loop.selector!=undefined && loop.selector!=''){
							selectorDiv = loop.selector
						}
						tween = TweenMax.fromTo( selectorDiv, durTime, dataFrom, dataTween )
						scene.setTween(tween);

						if(loop.duration){
							var duration = this.getDeviceVal(loop.duration, device);
							scene.duration(duration + loop.duration.unit)
						}
						if(loop.trigger){
							var trigger = this.getDeviceVal(loop.trigger, device);
							scene.triggerHook(trigger)
						}
						if(loop.offset){
							var offset = this.getDeviceVal(loop.offset, device);
							scene.offset(offset + loop.offset.unit)
						}
						if(loop.reverse!=undefined){
							scene.reverse(loop.reverse)
						}
						if(loop.sticky!=undefined && loop.sticky){
							scene.setPin(eChild, {pushFollowers: false,spacerClass : 'tpgb-trans-none'})
						}
						if(loop.develop!=undefined && loop.develop){
							var devName =  {name: ((loop.develop_name && loop.develop_name!='') ? loop.develop_name : '') };
							scene.addIndicators(devName)
						}
						scene.addTo(this.controller[e.className]);
					}
				}
			});
		}
        
		return false;
	}

}
document.addEventListener('DOMContentLoaded',function(){
	let MagicScroll = new TpagMagicScroll();
})