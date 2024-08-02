
document.addEventListener('DOMContentLoaded', ()=>{
    tplottieAnim(document)
})

function tplottieAnim(doc){
    let getLotti = doc.querySelectorAll('.tpgb-lottiefiles');
    if(getLotti){
        getLotti.forEach((element)=> {
            let closeParent = element.closest('.tpgb-section:not(.tpgb-section-editor),.tpgb-container-row:not(.tpgb-container-row-editor)');
            let offTop = element.offsetTop;
            if(closeParent){
                offTop = (closeParent.offsetTop > element.offsetTop) ? closeParent.offsetTop + element.offsetTop : element.offsetTop;
            }

            offTop = offTop - window.innerHeight;

            let link = element.querySelector('a.tpgb-bodymovin-link');
            if(link){
                link.addEventListener('click', (e)=> {
                    let crt = e.currentTarget;
                    var delay = parseInt(crt.getAttribute('data-delay'));
                    e.preventDefault();
                    var storeurl = crt.getAttribute('href');
                    setTimeout(function() {
                        window.location = storeurl;
                    }, delay);
                });
            }

            let lottiefilehd = element.querySelector('.tpgb-lottiefile-hd');
            var container = lottiefilehd.querySelector('.tpgb-bodymovin'),
                bm_containerID = container.getAttribute('id');
            var movin = JSON.parse(container.dataset.settings);
            if (movin && movin.animation_data) {
                plus_bodyMovinLoad(bm_containerID, movin, movin.animation_data, 'data', offTop);
            } else if (movin && movin.json_url) {
                plus_bodyMovinLoad(bm_containerID, movin, movin.json_url, 'url', offTop);
            }
        });
    }
}

function plus_bodyMovinLoad(a, b, c, dataType='data', offTop) {
    var d = {
            container: document.getElementById(b.container_id),
            renderer: "undefined" == typeof b.renderer ? "svg" : b.renderer,
            loop: b.loop,
            prerender: !0,
            assetsPath: "undefined" == typeof b.assets_path ? null : b.assets_path,
            autoplay: !b.autoplay_viewport && b.autoplay_onload && "autoplay" === b.play_action,
            rendererSettings: {
                progressiveLoad: !1
            },
        };
        if(dataType=='data'){
            d = Object.assign({}, d, {animationData: JSON.parse(c)})
        }else if(dataType=='url'){
            d = Object.assign({}, d, {path: c})
        }
        
        let e = document.getElementById(b.container_id),
        f = document.getElementById(b.container_id);
    b.instance = bodymovin.loadAnimation(d);

    let sec_offset = 0;
    
    function handleViewportChange() {
        if (b.autoplay_viewport && typeof isOnScreen === "function") {
            if(window.scrollY > offTop && window.scrollY < offTop+window.innerHeight*2){
                if (!e.classList.contains("playing")) {
                    b.instance.play();
                    e.classList.add("playing");
                    e.classList.remove("paused");
                }
            } else {
                if (e.classList.contains("paused")) return !0;
                b.instance.pause();
                e.classList.add("paused");
                e.classList.remove("playing");
            }
        }
        if (b.play_action === 'mousescroll' && b.play_action !== '') {
            while (e) {
                sec_offset += e.offsetTop;
                e = e.offsetParent;
            }

            var sec_duration = b.bm_section_duration;
            var offset_top = b.bm_section_offset;
            var total_duration = sec_duration + sec_offset - offset_top;
            var scrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    
            if (scrollPos >= (sec_offset - offset_top) && scrollPos <= total_duration && b.bm_scrollbased === 'bm_custom') {
                var scrollPercent = 100 * (scrollPos - (sec_offset - offset_top)) / sec_duration;
                var scrollPercentRounded = Math.round(scrollPercent);
                // console.log(scrollPos + '--' + sec_offset + '--' + total_duration + '--' + (scrollPercentRounded / 100));
            } else if (b.bm_scrollbased === 'bm_document') {
                var scrollPercent = 100 * scrollPos / (document.documentElement.scrollHeight - window.innerHeight);
                var scrollPercentRounded = Math.round(scrollPercent);
                // console.log(stop_time + '--' + scrollPercentRounded + '---' + currframe);
            }
    
            var start_time = 0;
            var stop_time = b.instance.totalFrames;
            if (b.bm_start_time !== '' && typeof b.bm_start_time !== 'undefined') {
                start_time = b.bm_start_time;
            }
            if (b.bm_end_time !== '' && typeof b.bm_end_time !== 'undefined') {
                stop_time = b.bm_end_time;
            }
    
            var currframe = ((scrollPercentRounded) / 100) * (stop_time - start_time);
            if (currframe >= stop_time) {
                b.instance.goToAndStop(stop_time, true);
            } else if (isNaN(currframe)) {
                if (window.pageYOffset <= sec_offset) {
                    b.instance.goToAndStop(start_time, true);
                } else {
                    b.instance.goToAndStop(stop_time, true);
                }
            } else {
                b.instance.goToAndStop(currframe + start_time, true);
            }
        }
    }
    
    window.addEventListener("wpbodymovin_anim_load", handleViewportChange);
    window.addEventListener("load", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange);
    window.addEventListener("resize", handleViewportChange);
    
    var start_time = 0;
    if (b.bm_start_time !== '' && typeof b.bm_start_time !== 'undefined') {
        if ("autoplay" === b.play_action || "column" === b.play_action || "section" === b.play_action || "viewport" === b.play_action || "" === b.play_action) {
            var start_time = b.bm_start_time;
        }
    }
    var end_time = b.instance.totalFrames;
    b.instance.setSpeed(b.playSpeed);
    if (b.bm_start_time !== '' && typeof b.bm_start_time !== 'undefined') {
        start_time = b.bm_start_time;
    }
    if (b.bm_end_time !== '' && typeof b.bm_end_time !== 'undefined') {
        end_time = b.bm_end_time;
    }
    b.instance.playSegments([start_time, end_time], true);
    
    if (b.play_action) {
        if ("column" === b.play_action) {
            f = e.closest(".tpgb-column-wrap,.tpgb-container-col");
        }
        if ("section" === b.play_action) {
            f = e.closest(".tpgb-section,.tpgb-container-row");
        }
    
        // Mouse In Out
        if ("mouseinout" === b.play_action) {
            if (b.bm_start_time !== '' && typeof b.bm_start_time !== 'undefined') {
                start_time = b.bm_start_time;
            }
            if (b.bm_end_time !== '' && typeof b.bm_end_time !== 'undefined') {
                end_time = b.bm_end_time;
            }
    
            b.instance.playSegments([0, start_time], true);
    
            f.addEventListener("mouseenter", function() {
                b.instance.playSegments([start_time, end_time], true);
                e.classList.add("playing");
                e.classList.remove("paused");
            });
    
            f.closest('.tpgb-lottiefile-hd').addEventListener("mouseenter", function() {
                b.instance.playSegments([start_time, end_time], true);
                e.classList.add("playing");
                e.classList.remove("paused");
            });
    
            f.addEventListener("mouseleave", function() {
                var ba = b.instance.currentRawFrame;
                b.instance.setDirection(-1);
                b.instance.goToAndPlay(ba, true);
                e.classList.add("paused");
                e.classList.remove("playing");
            });
    
            f.closest('.tpgb-lottiefile-hd').addEventListener("mouseleave", function() {
                var ba = b.instance.currentRawFrame;
                b.instance.setDirection(-1);
                b.instance.goToAndPlay(ba, true);
                e.classList.add("paused");
                e.classList.remove("playing");
            });
        }
    
        // Click
        if ("click" === b.play_action) {
            if (b.bm_start_time !== '' && typeof b.bm_start_time !== 'undefined') {
                start_time = b.bm_start_time;
            }
            if (b.bm_end_time !== '' && typeof b.bm_end_time !== 'undefined') {
                end_time = b.bm_end_time;
            }
            b.instance.goToAndStop(start_time, true);
            e.classList.add("playing");
            e.classList.remove("paused");
            f.closest('.tpgb-lottiefile-hd').addEventListener("click", function() {
                b.instance.playSegments([start_time, end_time], true);
            });
        }
    
        // Hover
        if ("hover" === b.play_action) {
            if (b.bm_start_time !== '' && typeof b.bm_start_time !== 'undefined') {
                start_time = b.bm_start_time;
            }
            if (b.bm_end_time !== '' && typeof b.bm_end_time !== 'undefined') {
                end_time = b.bm_end_time;
            }
            b.instance.goToAndStop(start_time, true);
            f.addEventListener("mouseenter", function() {
                b.instance.playSegments([start_time, end_time], true);
                e.classList.add("playing");
                e.classList.remove("paused");
            });
        }
    
        // Viewport
        if ("viewport" === b.play_action) {
            if (b.bm_start_time !== '' && typeof b.bm_start_time !== 'undefined') {
                start_time = b.bm_start_time;
            }
            if (b.bm_end_time !== '' && typeof b.bm_end_time !== 'undefined') {
                end_time = b.bm_end_time;
            }
            b.instance.goToAndStop(start_time, true);
            b.instance.playSegments([start_time, end_time], true);
            e.classList.add("playing");
            e.classList.remove("paused");
        }
    }
    
    if (b.play_action !== "viewport" && b.play_action !== "click" && b.play_action !== "hover" && b.play_action !== "autoplay" && b.play_action !== "mousescroll") {
        f.addEventListener("mouseenter", function() {
            b.instance.goToAndPlay(0);
            e.classList.add("playing");
            e.classList.remove("paused");
        });
    }
}