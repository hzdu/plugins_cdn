window.addEventListener('load', () => {
    tpheading(document);
 });
 
 function tpheading(doc){
 
   let hTitleSp = doc.querySelectorAll('.tpgb-heading-title');
   if(hTitleSp){
       hTitleSp.forEach( el => {
           if(el.classList.contains('heading-style-9')){
               let subStyle = el.querySelector('.sub-style'),
                   animsplitType = subStyle.getAttribute("data-animsplit-type"),
                   spiltAttr = subStyle.getAttribute('data-aniattrht');
               spiltAttr = JSON.parse(spiltAttr);
 
               var animation = Power4.easeOut;
 
               if(spiltAttr && spiltAttr.effect && spiltAttr.effect!= 'default'){                        
                   animation = spiltAttr.effect;
               }
 
               let mySplitText = new SplitText(subStyle, { type: animsplitType });
               let splitTextTimeline = new TimelineLite();        
           
               TweenLite.set(subStyle, { perspective: 4000 });
 
               /*word start*/
               if(subStyle.classList.contains('tpgb-split-words')) {
                   let words = mySplitText.words;
                   words.forEach((element, index) => {
                       splitTextTimeline.from(element, spiltAttr.speed, {
                           opacity: spiltAttr.opacity,
                           x: spiltAttr.x,
                           y: spiltAttr.y,
                           scaleX: spiltAttr.scaleX,
                           scaleY: spiltAttr.scaleY,
                           scaleZ: spiltAttr.scaleZ,
                           rotationX: spiltAttr.rotationX,
                           rotationY: spiltAttr.rotationY,
                           rotationZ: spiltAttr.rotationZ,
                           autoAlpha: 0,
                           ease: animation
                       }, index * spiltAttr.delay);
                   });
               }
               /*word end*/
 
               /*chars start*/
               if (subStyle.classList.contains('tpgb-split-chars')) {
                   splitTextTimeline.staggerFrom(mySplitText.chars, spiltAttr.speed, {
                       opacity: spiltAttr.opacity,
                       x: spiltAttr.x,
                       y: spiltAttr.y,
                       scaleX: spiltAttr.scaleX,
                       scaleY: spiltAttr.scaleY,
                       scaleZ: spiltAttr.scaleZ,
                       rotationX: spiltAttr.rotationX,
                       rotationY: spiltAttr.rotationY,
                       rotationZ: spiltAttr.rotationZ,
                       autoAlpha: 0,
                       ease: animation
                   }, spiltAttr.delay);
               }
               /*chars end*/
 
               /*line start*/
               if (subStyle.classList.contains('tpgb-split-lines')) {
                   splitTextTimeline.staggerFrom(mySplitText.lines, spiltAttr.speed, {
                       opacity: spiltAttr.opacity,
                       x: spiltAttr.x,
                       y: spiltAttr.y,
                       scaleX: spiltAttr.scaleX,
                       scaleY: spiltAttr.scaleY,
                       scaleZ: spiltAttr.scaleZ,
                       rotationX: spiltAttr.rotationX,
                       rotationY: spiltAttr.rotationY,
                       rotationZ: spiltAttr.rotationZ,
                       autoAlpha: 0,
                       ease: animation
                   }, spiltAttr.delay);
               }
               /*line end*/
               if (animsplitType && animsplitType === 'chars') {
                   Array.from(subStyle.querySelectorAll('div')).forEach(function(element) {
                       if (isEmptyCheck(element)) {
                           element.classList.add('tpgb-spl-space');
                       }
                   });
               }
           
               if (animsplitType && animsplitType === 'lines,chars') {
                   Array.from(subStyle.querySelectorAll('div > div')).forEach(function(element) {
                       if (isEmptyCheck(element)) {
                           element.classList.add('tpgb-spl-space');
                       }
                   });
               }
           
               function isEmptyCheck(element) {
                   return !element.innerHTML.trim();
               }
 
               var waypoint = new Waypoint({
                   element: subStyle,
                   handler: function (direction) {
                       if(direction == 'down'){
                           splitTextTimeline.restart();
                           this.element.style.opacity = 1;
                       }else{
                           this.element.style.opacity = 0;
                       }
                   },
                   offset: "90%",
               });
           }
       });
   }
 }
 