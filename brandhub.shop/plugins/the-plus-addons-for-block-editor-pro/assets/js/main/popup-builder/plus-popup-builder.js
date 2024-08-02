let tpPopupData = new Map();

document.addEventListener('DOMContentLoaded', function() {
    if (!document.body.classList.contains('block-editor-page')) {
        tppopup(document);
    }
});

function tppopup(doc){
    var offcanvasWrappers = doc.querySelectorAll('.tpgb-offcanvas-wrapper');
    offcanvasWrappers.forEach(function(offcanvasWrapper) {
        showuserRest(offcanvasWrapper);
        var container = offcanvasWrapper.querySelector('.scroll-view');
        var containerScrollView = offcanvasWrapper.querySelector('.offcanvas-toggle-btn.position-fixed');

        if (offcanvasWrapper.classList.contains('scroll-view') && containerScrollView) {
            window.addEventListener('scroll', function() {
                var scroll = window.pageYOffset || document.documentElement.scrollTop;
                var scrollValue = parseInt(container.getAttribute('data-scroll-view'));
                var uid = container.getAttribute('data-canvas-id');
                var scrollTopElement = doc.querySelector('.' + uid);

                if (scroll > scrollValue) {
                    scrollTopElement.classList.add('show');
                } else {
                    scrollTopElement.classList.remove('show');
                }
            });
        }
    });
}


function PlusOffcanvas(a) {
    "use strict";
    (this.wrap = a),
    (this.content = a.querySelector(".tpgb-canvas-content-wrap")),
    (this.button = a.querySelector(".offcanvas-toggle-btn")),
    (this.settings = JSON.parse(this.wrap.dataset.settings)),
    (this.id = this.settings.content_id),
    (this.transition = this.settings.transition),
    (this.esc_close = this.settings.esc_close),
    (this.body_click_close = this.settings.body_click_close),
    (this.direction = this.settings.direction),
    (this.trigger = this.settings.trigger),
    (this.onpageLoad = this.settings.onpageLoad),
    (this.onpageloadDelay = this.settings.onpageloadDelay),
    (this.onScroll = this.settings.onScroll),
    (this.onpageviews = this.settings.onpageviews),
    (this.exitinlet = this.settings.exitInlet),
    (this.inactivity = this.settings.inactivity),
    (this.extraclick = this.settings.extraclick),
    (this.prevurl = this.settings.prevurl),
    (this.scrollHeight = this.settings.scrollHeight),
    (this.previousUrl = this.settings.previousUrl),
    (this.extraId = this.settings.extraId),
    (this.inactivitySec = this.settings.inactivitySec),
    (this.showuseRes = this.settings.showuseRes),
    (this.noXTimes = this.settings.noXTimes),
    (this.tpgbXdays = this.settings.days),
    (this.duration = 500),
    (this.time = 0),
    (this.flag = true),
    (this.ele = document.querySelector(".tpgb-block-" + this.id +"-canvas")),
    (this.animSetting = ( this.ele && this.ele.dataset && this.ele.dataset.animationsetting ) ? JSON.parse(this.ele.dataset.animationsetting) : '') ,
    this.destroy(),
    this.init(),
    tpPopupData.set( this.id , this.settings);
}

(PlusOffcanvas.prototype = {
    id: "",
    wrap: "",
    content: "",
    button: "",
    settings: {},
    transition: "",
    delaytimeout: "",
    ele : "",
    duration: 400,
    initialized: !1,
    animSetting : {},
    animations: ["slide", "slide-along", "reveal", "push", "popup"],

    init: function () {
        var outerClose = (this.body_click_close === 'yes') ? '' : 'tpgb-pop-outer-none';

        // Add classes and insert content
        if (this.wrap != null) {
            document.documentElement.classList.add("tpgb-offcanvas-content-widget");
            
            if (document.querySelectorAll(".tpgb-offcanvas-container").length === 0) {
                var tpgbOffcanvasContainer = document.createElement("div");
                tpgbOffcanvasContainer.className = "tpgb-offcanvas-container " + outerClose;

                while (document.body.firstChild) {
                    tpgbOffcanvasContainer.appendChild(document.body.firstChild);
                }
                document.body.appendChild(tpgbOffcanvasContainer);
            }

            var tpgbCanvasContentWrap = this.wrap.querySelector(".tpgb-canvas-content-wrap");
            if (tpgbCanvasContentWrap) {

                var offcanvasContainers = document.querySelectorAll(".tpgb-offcanvas-container > .tpgb-block-" + this.id + "-canvas");
                offcanvasContainers.forEach(function(element) {
                    element.parentNode.removeChild(element);
                });
                var bodyCanvases = document.querySelectorAll("body > .tpgb-block-" + this.id + "-canvas");
                bodyCanvases.forEach(function(element) {
                    element.parentNode.removeChild(element);
                });

                document.body.insertBefore(tpgbCanvasContentWrap, document.body.firstChild);
            }

            this.bindEvents();
        }
    
        // Destroy instance when Contact Form 7 form is sent
        var current = this;
        document.addEventListener('wpcf7mailsent', function (event) {
            current.destroy();
        }, false);
    },

    destroy: function () {
        this.close();
        this.animations.forEach(function (b) {
            if (document.documentElement.classList.contains("tpgb-" + b)) {
                document.documentElement.classList.remove("tpgb-" + b);
            }
        });
        var bodyCanvas = document.querySelectorAll(".tpgb-block-" + this.id + "-canvas").length;
    },
    

    bindEvents: function () {
        if ( this.button && this.trigger && this.trigger === 'yes') {
            this.button.addEventListener("click", this.toggleContent.bind(this));
        }
    
        if (this.extraclick == "yes" && this.extraId && this.extraId !== '') {
            document.querySelectorAll("." + this.extraId).forEach(function(element) {
                element.addEventListener("click", this.toggleContent.bind(this));
            }.bind(this));
        }
    
        if (this.onpageLoad === "yes" || this.inactivity === "yes" || this.prevurl === "yes" || this.onpageviews === 'yes') {
            this.loadShow();
        }
        window.addEventListener("scroll", this.scrollShow.bind(this));
        document.addEventListener("mouseleave", this.exitInlet.bind(this));
    
        document.body.addEventListener("click", function(event) {
            let getCanvas = document.querySelector('.tpgb-offcanvas-close-'+this.id);

            if (getCanvas && event.target!=this.button && event.target!=this.content && event.target == getCanvas ) {
                this.close();
            }
        }.bind(this));
    
        if (this.esc_close === "yes") {
           this.closeESC();
        }
    
        if (this.body_click_close === "yes") {
           this.closeClick();
        }
    },
    
    triggerClick: function () {
        if (this.extraclick == "yes" && this.extraId && this.extraId !== '' && this.flag) {
            var extersele = document.querySelectorAll("." + this.extraId);
            extersele.forEach(function (element) {
                element.addEventListener("click", this.toggleContent.bind(this));
            }, this);
        }
    },
    toggleContent: function (e) {
        var currtClick = this;
        if (currtClick.extraclick == "yes" && currtClick.extraId && currtClick.extraId !== '') {
            e.preventDefault();
        }
        var htmlElement = document.documentElement;
        if (htmlElement.classList.contains("tpgb-open")) {
            currtClick.close();
        } else {
            if (currtClick.flag) {
                currtClick.show();
            }
        }
      
    },
    exitInlet: function () {
        (this.exitinlet == "yes" && this.flag) ? (this.show(), this.flag = false) : "";
    },
    loadShow: function () {
        if((this.onpageLoad == "yes" || this.onpageviews == 'yes') && this.flag) {
            setTimeout(() => {
                this.show(), this.flag = false
            }, ( this.onpageLoad == "yes" ? this.onpageloadDelay : 500 ) );
        }
        if(this.inactivity == "yes" && this.flag && this.inactivitySec && this.inactivitySec != '') {
            var timeout;
            if(this.flag) {
                function resetTimer(el) {
                    clearTimeout(timeout);
                    timeout = setTimeout(function() {
                        el.show(); el.flag = false;
                    }, el.inactivitySec * 1000);
                }
            }
            document.onmousemove = resetTimer(this);
            document.onkeypress = resetTimer(this);
        }
        if( (this.prevurl == "yes" && this.previousUrl && document.referrer) && this.previousUrl == document.referrer && this.flag) {
            setTimeout(() => {
                this.show();
            }, 500);
        }
    },
    scrollShow: function () {
        var scrollHeight = this.scrollHeight;
        var scroll = window.pageYOffset;

        if (this.onScroll === "yes" && this.flag && scroll >= scrollHeight) {
            this.show();
            this.flag = false;
        }
    },
    AnimIn : function(){
        if (!this.ele.classList.contains("tpgb_animated") && this.animSetting && this.animSetting.anime !== undefined) {
            this.ele.classList.remove("tpgb-view-animation-out", "tpgb_animated_out", "tpgb_" + this.animSetting.animeOut);
            this.ele.classList.add("tpgb_animated", "tpgb_" + this.animSetting.anime);
        }
    },
    AnimOut : function(){
        var canvasElement = document.querySelector(".tpgb-block-" + this.id + "-canvas");

        if (canvasElement.classList.contains("tpgb-visible") && !this.ele.classList.contains("tpgb_animated_out") && this.animSetting && this.animSetting.animeOut !== undefined) {
            this.ele.classList.remove("tpgb_animated", "tpgb_" + this.animSetting.anime);
            this.ele.classList.add("tpgb_" + this.animSetting.animeOut, "tpgb-view-animation-out", "tpgb_animated_out");
        }
    },
    show: function () {
        var canvasElement = document.querySelector(".tpgb-block-" + this.id + "-canvas"),
            htmlElement = document.documentElement;

        canvasElement.classList.add("tpgb-visible");
        htmlElement.classList.add("tpgb-" + this.transition);
        htmlElement.classList.add("tpgb-" + this.direction);
        htmlElement.classList.add("tpgb-open");
        htmlElement.classList.add("tpgb-block-" + this.id + "-canvas" + "-open");
        htmlElement.classList.add("tpgb-reset");
        if(this.button) { this.button.classList.add("tpgb-is-active"); }
        this.AnimIn();
    },
    close: function () {
        var canvasElement = document.querySelector(".tpgb-block-" + this.id + "-canvas"),
            htmlElement = document.documentElement,
            buttonElement = (this.button) ? this.button : '';

        if (canvasElement.classList.contains("tpgb-slide-along")) {
            this.delaytimeout = 0;
            canvasElement.classList.remove("tpgb-visible");
        } else {
            this.delaytimeout = (this.animSetting && this.animSetting.custoutDur) ? this.animSetting.custoutDur : 500;
        }

        setTimeout(function () {
            htmlElement.classList.remove("tpgb-block-" + this.id + "-canvas" + "-open");
            htmlElement.classList.remove("tpgb-open");
            htmlElement.classList.remove("tpgb-reset");
            htmlElement.classList.remove("tpgb-" + this.transition);
            htmlElement.classList.remove("tpgb-" + this.direction);
            if (!canvasElement.classList.contains("tpgb-slide-along")) {
                canvasElement.classList.remove("tpgb-visible");
            }
        }.bind(this), this.delaytimeout);

        if(this.button) { buttonElement.classList.remove("tpgb-is-active"); }
      
        this.AnimOut();
    },
    closeESC: function () {
        var _this = this;
        if (_this.settings.esc_close !== "") {
            document.addEventListener("keydown", function (event) {
                if (event.keyCode === 27) {
                    _this.close();
                }
            });
        }
    },
    closeClick: function () {

        var c = this;
        document.addEventListener("click", function (event) {
            var tpPOclass = [];
            
            tpPopupData.forEach(function (setting) {
                if (setting.extraclick && setting.extraclick == 'yes' && setting.extraId && setting.extraId !== '' && c.flag) {
                    tpPOclass.push('.' + setting.extraId);
                }
            });

            var target = event.target;
            var isInCanvasContentWrap = target.matches(".tpgb-canvas-content-wrap") || target.closest(".tpgb-canvas-content-wrap");
            var istglImage = target.matches('.off-can-img-svg')
            var ispopTglImage = target.matches(".close-custom_img");
            var isOffcanvasToggleBtn = target.matches(".offcanvas-toggle-btn");
            var isInExtraId = tpPOclass.some(function (selector) {
                return target.matches(selector) || target.closest(selector);
            });

            if ((!isInCanvasContentWrap && !istglImage && !isOffcanvasToggleBtn && !isInExtraId) || ispopTglImage) {
                c.close();
            }
        });
        
    },
});

function showuserRest(ele) {
    var setting = JSON.parse( ele.getAttribute("data-settings") ),
        tpgbXTimeView = 'tpgbXTimeView-'+setting.content_id,
        sFlag = true;
      
        if( setting.showuseRes && setting.showuseRes == 'yes' && setting.noXTimes !='' && setting.days!='' ){

            var tpgbiageView = JSON.parse( localStorage.getItem(tpgbXTimeView) );

           
            if (tpgbiageView!=undefined && tpgbiageView.xtimeView!=undefined){
                var value = Number(tpgbiageView.xtimeView) + 1;
                localStorage.setItem(tpgbXTimeView,  JSON.stringify(Object.assign({}, tpgbiageView, {"xtimeView" : value })));
            }else{
                localStorage.setItem(tpgbXTimeView, '{ "xtimeView": 1 }');
            }
            
            if(Number(JSON.parse(localStorage.getItem(tpgbXTimeView)).xtimeView) <= Number(setting.noXTimes)){
                sFlag = true;
            }else{
                var cdate = new Date();
                var endDate = new Date();
                var expired_date = endDate.setDate(cdate.getDate()+ Number(setting.days));						
                var tpgbiageView = localStorage.getItem(tpgbXTimeView);
                tpgbiageView =JSON.parse(tpgbiageView);
                
                var store_date = Object.assign({}, tpgbiageView, {"Xdate" : expired_date});
                if(tpgbiageView!=undefined && tpgbiageView.Xdate==undefined){
                    localStorage.setItem(tpgbXTimeView, JSON.stringify(store_date));
                }
                
                sFlag = false
                
                var getData = localStorage.getItem(tpgbXTimeView);
                getData =JSON.parse(getData);
                
                if(getData!=undefined && getData.Xdate!=undefined && ( new Date(Number(cdate)) > new Date(Number(getData.Xdate)))){
                    localStorage.removeItem(tpgbXTimeView);
                    sFlag = true;
                }
            }
        }else{
            if(localStorage.getItem(tpgbXTimeView)){
                localStorage.removeItem(tpgbXTimeView);
            }
        }
        
    if( sFlag ){
        new PlusOffcanvas(ele)
    }else{
        return false;
    }
}