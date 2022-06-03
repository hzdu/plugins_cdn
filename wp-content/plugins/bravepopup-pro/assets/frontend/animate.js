

function brave_animate_popup(animData, popupID, currentStep=0, animationType='load'){
   var animDevice = brave_currentDevice;
   if(brave_currentDevice === 'mobile' && document.querySelector('#brave_popup_'+popupID+'__step__'+currentStep+'.brave_popup__step--mobile-noContent')){
      animDevice = 'desktop';
   }
   var reverseAnim = animationType && animationType.includes('reverse') ? true : false
   var animType = animationType ? animationType.replace('_reverse','') : 'load';
   var animationData = animData ? animData : brave_popup_data[popupID].animationData;
   if(!animationData){ return }

   
   var currentElements = animationData[currentStep][animDevice].elements;
   var totalDuration = animationData[currentStep][animDevice].totalDuration[animType] || 500;
   // console.log(totalDuration, currentElements);
   
   //Intiate Animation Object
   var timeline = anime.timeline({
      direction: 'alternate',
      autoplay:false,
      loop: false,
      duration: totalDuration,
      easing: 'easeInOutSine',
      update: function(anim) {

      },
      begin: function(anim) {
         console.log('Animation Started!!', anim.began, timeline);
      },
      complete: function(anim) {
         console.log('Animation Completed!!', anim.completed);
      }
   });

   //Create the Timeline
   var t0 = performance.now();
   currentElements.forEach(function(element) {
      if(element.id && element.animation && element.animation[animType]){
         var animProps = element.animation[animType].props || {};
         var animStart = animProps.start;
         var animEnd = animProps.end;
         var duration = element.animation[animType].duration || 0;
         var delay = element.animation[animType].delay || 0;
         var easing = element.animation[animType].easing || 'easeInOutSine';

         var startLeft = animStart && animStart.posx !== undefined ? animStart.posx : element.left;
         var endLeft = animEnd && animEnd.posx !== undefined ? animEnd.posx : element.left;
         var startTop = animStart && animStart.posy !== undefined ? animStart.posy : element.top;
         var endTop = animEnd && animEnd.posy !== undefined ? animEnd.posy : element.top;
         var startScale = animStart && animStart.scale !== undefined ? animStart.scale : 1;
         var endScale = animEnd && animEnd.scale !== undefined ? animEnd.scale : 1;
         var startOpacity = animStart && animStart.opacity !== undefined ? animStart.opacity/100 : 1;
         var endOpacity = animEnd && animEnd.opacity !== undefined ? animEnd.opacity/100 : 1;
         var startRotate = 0;
         var endRotate = 0
         var leftVals = [];  var topVals = [];   var scaleVals = [];  var rotateVals = [];  var opacityVals = [];

         var customMarkers  = [];
         var markersArray = [];
         Object.keys(animProps).forEach(function(markrID) {
            if((markrID !== 'start' && markrID !== 'end')){
               markersArray.push({...animProps[markrID], id: markrID }); 
            }
         });
         markersArray.forEach(function(marker, index){
            if(!marker.delay){  return  }
            var markerID = marker.id;
            var prevmarkerDealy = markersArray[index - 1];
            var markerDelay = prevmarkerDealy && prevmarkerDealy.delay ? marker.delay -  prevmarkerDealy.delay: marker.delay;
            var leftVal = marker.posx !== undefined && marker.posx;
            var topVal = marker.posy !== undefined && marker.posy;
            var scaleVale = marker.scale !== undefined && marker.scale;
            var opacityVal = marker.opacity !== undefined && marker.opacity/100;
            var rotateVal = marker.rotate !== undefined && marker.rotate;
            
            //console.log(markerID, markerDelay, marker.opacity, opacityVal);
            
            if(leftVal !== false){   leftVals.push({value: leftVal,           duration: markerDelay, id: markerID, orderBy: marker.delay });  }
            if(topVal !== false){   topVals.push({value: topVal,              duration: markerDelay, id: markerID, orderBy: marker.delay });  }
            if(scaleVale !== false){   scaleVals.push({value: scaleVale,      duration: markerDelay, id: markerID, orderBy: marker.delay });  }
            if(opacityVal !== false){   opacityVals.push({value: opacityVal,  duration: markerDelay, id: markerID, orderBy: marker.delay });  }
            if(rotateVal !== false){   rotateVals.push({value: rotateVal,     duration: markerDelay, id: markerID, orderBy: marker.delay });  }
            
            customMarkers.push({ id: markerID, delay: markerDelay });
         })

         leftVals.sort(function(a,b){ return a.orderBy - b.orderBy});
         topVals.sort(function(a,b){ return a.orderBy - b.orderBy});
         scaleVals.sort(function(a,b){ return a.orderBy - b.orderBy});
         rotateVals.sort(function(a,b){ return a.orderBy - b.orderBy});
         opacityVals.sort(function(a,b){ return a.orderBy - b.orderBy});

         var lastItemDelay = markersArray.length > 0 && markersArray[markersArray.length -1] && markersArray[markersArray.length -1].delay || 0;
         var endDuration = markersArray.length > 0 ? duration - lastItemDelay  : duration;
         
         leftVals.unshift({value: startLeft, duration: 0, id: 'start'}); leftVals.push({value: endLeft, duration: endDuration, id: 'end'});
         topVals.unshift({value: startTop, duration: 0, id: 'start'}); topVals.push({value: endTop, duration: endDuration, id: 'end'});
         opacityVals.unshift({value: startOpacity, duration: 0, id: 'start'}); opacityVals.push({value: endOpacity, duration: endDuration, id: 'end'});
         scaleVals.unshift({value: startScale, duration: 0, id: 'start'}); scaleVals.push({value: endScale, duration: endDuration, id: 'end'});
         rotateVals.unshift({value: startRotate, duration: 0, id: 'start'}); rotateVals.push({value: endRotate, duration: endDuration, id: 'end'});

         var firstSelectorVals = {}; var secondSelectorVals = {}
         
         
         if(element.id === 'popup'){
            secondSelectorVals = {
               targets: `#brave_popup_${popupID}__step__${currentStep} .brave_popup__step__${animDevice} .brave_popupSections__wrap`,
               duration:duration,
               easing: easing,
               scale: scaleVals,
               rotate: rotateVals,
               opacity: opacityVals,
               left: leftVals,
               top: topVals,
            }
         }else{
            firstSelectorVals = {
               targets: `#brave_popup_${popupID}__step__${currentStep} .brave_popup__step__${animDevice} #brave_element-${element.id}`,
               duration:duration,
               easing: easing,
               scale: scaleVals,
               rotate: rotateVals,
               left: leftVals,
               top: topVals,
            }
            secondSelectorVals = {
               targets: `#brave_popup_${popupID}__step__${currentStep} .brave_popup__step__${animDevice} #brave_element-${element.id} .brave_element__inner`,
               duration:duration,
               easing: easing,
               opacity: opacityVals,
            }

         }
         // console.log(secondSelectorVals);
         
         timeline.add(firstSelectorVals, delay);
         timeline.add(secondSelectorVals, delay);

         //console.log(delay, timeline);
      }
   });
   
   var t1 = performance.now();
   console.log("Animation function took " + (t1 - t0) + " milliseconds.");

   
   //PLAY the Animation
   setTimeout(function(){
      document.getElementById(`brave_popup_${popupID}__step__${currentStep}`).style.display ='none';
      document.getElementById(`brave_popup_${popupID}__step__${currentStep}`).style.display ='block';

      if(reverseAnim){
         //Reverse Currently Doesnt work
         timeline.completed = false;
         timeline.reverse();
      }else{
         timeline.play(); 
      }

   }, 30);

}