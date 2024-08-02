window.addEventListener("load", (event) => {
    tpgbextraInit(document)
})

function tpgbextraInit(doc){
    //Onload
    let animationList = doc.querySelectorAll('.tpgb-view-animation');
    if(animationList.length){
        Animations(animationList)
    }

    //Splide Js Active Slide
    let scope = doc.querySelectorAll('.tpgb-carousel');
    if(scope){
        scope.forEach(function(obj){
            let animate_div = obj.querySelector('.tpgb-view-animation')
            if(animate_div){
                var splideInit = slideStore.get(obj);
                if(splideInit){
                    let activeSlide = splideInit.Controller.Components.getIndex(),
                    getSlide = splideInit.Components.Slides.get()
                    if(getSlide[activeSlide].slide){
                        let eleCheck  = getSlide[activeSlide].slide.querySelectorAll('.tpgb-view-animation');
                        if(eleCheck.length){
                            Animations(eleCheck, true)
                        }
                    }
                    
                    splideInit.on('active', function(activeSlide) {
                        let eleCheck  = activeSlide.slide.querySelectorAll('.tpgb-view-animation');
                        if(eleCheck.length){
                            Animations(eleCheck, true)
                        }
                    });

                    splideInit.on('inactive', function(inActiveSlide) {
                        if(inActiveSlide.slide){
                            let eleCheck  = inActiveSlide.slide.querySelectorAll('.tpgb_animated ');
                            if(eleCheck.length){
                                eleCheck.forEach(function(obj){
                                    for (var i = 0, len = obj.classList.length; i < len; i++) {
                                        if(obj.classList[i] === 'tpgb_animated'){
                                            let nextclass = obj.classList.remove(obj.classList[i+1]);
                                            obj.classList.remove('tpgb_animated');
                                            obj.classList.remove(nextclass);
                                        }
                                    }
                                })
                            }
                        }
                    });
                }
            }
        });
    }
}

var Animations = function(ele, splideEnable = false) {
    if(ele.length){
        ele.forEach(function(obj){
            if(obj.closest('.tpgb-carousel') && splideEnable===false){
                return;
            }
            var $this = obj,
                settings = obj.getAttribute('data-animationsetting');
                settings = JSON.parse(settings);
            var innWidth = window.innerWidth;
            var AnimWidth = 0,AnimTWidth = 0;
            if((settings.anime && settings.anime.sm!=undefined && settings.anime.sm!='') || (settings.anime && settings.anime.xs!=undefined && settings.anime.xs!='') || (settings.animeOut && settings.animeOut.sm!=undefined && settings.animeOut.sm!='') || (settings.animeOut && settings.animeOut.xs!=undefined && settings.animeOut.xs!='')){
                AnimWidth = 1024
            }
            if((settings.anime && settings.anime.xs!=undefined && settings.anime.xs!='') || (settings.animeOut && settings.animeOut.xs!=undefined && settings.animeOut.xs!='')){
                AnimTWidth = 768
            }
            if(((settings.anime!=undefined && settings.anime.md!=undefined && settings.anime.md!='none') || (settings.animeOut!=undefined && settings.animeOut.md!=undefined && settings.animeOut.md!='none')) && innWidth>AnimWidth ){
                var mdAnim = (settings.anime!=undefined && settings.anime.md!=undefined && settings.anime.md!='none') ? settings.anime.md : ''
                var mdAnimOut = (settings.animeOut!=undefined && settings.animeOut.md!=undefined && settings.animeOut.md!='none') ? settings.animeOut.md : ''
                AnimDeviceWayPoint($this, mdAnim, mdAnimOut )
            }
            if(((settings.anime!=undefined && settings.anime.sm!=undefined && settings.anime.sm!='none') || (settings.animeOut!=undefined && settings.animeOut.sm!=undefined && settings.animeOut.sm!='none')) && innWidth<1025 && innWidth>=AnimTWidth ){
                var smAnim = (settings.anime!=undefined && settings.anime.sm!=undefined && settings.anime.sm!='none') ? settings.anime.sm : ''
                var smAnimOut = (settings.animeOut!=undefined && settings.animeOut.sm!=undefined && settings.animeOut.sm!='none') ? settings.animeOut.sm : ''
                AnimDeviceWayPoint($this, smAnim, smAnimOut )
            }
            if(((settings.anime!=undefined && settings.anime.xs!=undefined && settings.anime.xs!='none') || (settings.animeOut!=undefined && settings.animeOut.xs!=undefined && settings.animeOut.xs!='none')) && innWidth<768 ){
                var xsAnim = (settings.anime!=undefined && settings.anime.xs!=undefined && settings.anime.xs!='none') ? settings.anime.xs : ''
                var xsAnimOut = (settings.animeOut!=undefined && settings.animeOut.xs!=undefined && settings.animeOut.xs!='none') ? settings.animeOut.xs : ''
                AnimDeviceWayPoint($this, xsAnim, xsAnimOut )
            }
        });
    }
}
		
var AnimDeviceWayPoint = function (ele,anim,animeOut){
    var waypoint = new Waypoint({
        element: ele,
        handler: function(direction) {
            if (direction === 'down' && anim && !ele.classList.contains("tpgb_animated")) {
                ele.classList.remove("tpgb-view-animation-out", "tpgb_animated_out", "tpgb_" + animeOut);
                ele.classList.add("tpgb_animated", "tpgb_" + anim);
            } else if (direction === 'up' && animeOut && !ele.classList.contains("tpgb_animated_out")) {
                ele.classList.remove("tpgb_animated", "tpgb_" + anim);
                ele.classList.add("tpgb-view-animation-out", "tpgb_animated_out", "tpgb_" + animeOut);
            } else if (direction === 'down' && anim == '' && !ele.classList.contains("tpgb_animated")) {
                ele.classList.remove("tpgb-view-animation-out", "tpgb_animated_out", "tpgb_" + animeOut);
                ele.classList.add("tpgb_animated");
            }
        },
        offset: '80%'
    });

}

document.addEventListener('DOMContentLoaded', function() {
    let getAllAni = document.querySelectorAll('.tpgb-view-animation');
    Animations(getAllAni);
});