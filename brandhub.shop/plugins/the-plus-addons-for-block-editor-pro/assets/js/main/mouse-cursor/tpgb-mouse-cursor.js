/*Mouse Cursor*/ 
tpmouserCur(document)

function tpmouserCur(doc){
    const elements = doc.querySelectorAll(('.tpgb-mouse-cursor'));

    elements.forEach( el => {
        var data = JSON.parse(el.getAttribute('data-tpgb_mc_settings')),
            leftoffset =  data.mc_cursor_adjust_left,
            topoffset = data.mc_cursor_adjust_top;

        if(data.effect!='' && data.effect!=undefined){
            if(data.effect=='mc-column'){
                var effectclass = el.closest(".tpgb-column,.tpgb-container-col"),
                    ClassId = effectclass.getAttribute('data-id');
            }else if(data.effect == 'mc-row'){
                var effectclass = el.closest('.tpgb-section,.tpgb-container-row'),
                    ClassId = effectclass.getAttribute('data-id');
            }else if(data.effect == 'mc-block'){
                let bl_id = data.block_id;
                var blockSel = el.previousElementSibling,
                    effectclass = blockSel;
                effectclass.setAttribute("data-id",'tpgb-mc-eff-'+bl_id);
                effectclass.classList.add('tpgb-mc-eff-'+bl_id);
                ClassId = effectclass.getAttribute('data-id');
                
                if(data.type != undefined && data.type == 'mouse-follow-text'){
                    if(data.mc_cursor_text !=undefined && data.mc_cursor_text !=''){
                        let textClass = document.createElement('div');
                        textClass.classList.add('tpgb-cursor-pointer-follow-text');
                        textClass.innerHTML = data.mc_cursor_text;
                        effectclass.appendChild(textClass);
                        if(data.mc_cursor_text_size!=undefined && data.mc_cursor_text_size!=''){
                            effectclass.querySelector('.tpgb-cursor-pointer-follow-text').style.fontSize = data.mc_cursor_text_size+"px";
                        }
                        if(data.mc_cursor_text_color!=undefined && data.mc_cursor_text_color!=''){
                            effectclass.querySelector('.tpgb-cursor-pointer-follow-text').style.color = data.mc_cursor_text_color;
                        }
                        if(data.mc_cursor_text_width!=undefined && data.mc_cursor_text_width!=''){
                            effectclass.querySelector('.tpgb-cursor-pointer-follow-text').style.maxWidth = data.mc_cursor_text_width+"px";
                        }
                    }
                }
                if(data.type != undefined && data.type == 'mouse-follow-image'){
                    if(data.mc_cursor_icon !=undefined && data.mc_cursor_icon !=''){
                        let imgClass = document.createElement('img');
                        imgClass.setAttribute('src',data.mc_cursor_icon);
                        imgClass.setAttribute('alt','Cursor Icon');
                        imgClass.classList.add('tpgb-cursor-pointer-follow');
                        effectclass.appendChild(imgClass);
                        if(data.mc_cursor_adjust_width && data.mc_cursor_adjust_width!=undefined){
                            effectclass.querySelector('.tpgb-cursor-pointer-follow').style.maxWidth = data.mc_cursor_adjust_width;
                        }
                    }
                }
                if(data.type != undefined && data.type == 'mouse-follow-circle'){
                    if(data.circle_type != undefined && data.circle_type == 'cursor-predefine' || data.circle_type == 'cursor-custom' ){
                        let circleClass = document.createElement('div');
                        circleClass.classList.add('tpgb-cursor-follow-circle');
                        effectclass.appendChild(circleClass);
                        let circlemainCss = "cursor:"+data.mc_cursor_adjust_symbol+"; z-index:"+data.mc_circle_zindex+"; width:"+data.mc_cursor_adjust_width+"; max-width:"+data.mc_cursor_adjust_width+"; height:"+data.mc_cursor_adjust_height+"; max-height:"+data.mc_cursor_adjust_height+";";
                        effectclass.querySelector('.tpgb-cursor-follow-circle').style.cssText = circlemainCss;
                        
                        if (data.mc_cursor_adjust_style != undefined && data.mc_cursor_adjust_style == 'mc-cs3') {
                            effectclass.querySelector('.tpgb-cursor-follow-circle').style.mixBlendMode = data.style_two_blend_mode;
                        }
                        if (data.mc_cursor_adjust_style != undefined) {
                            var cursor = effectclass.querySelector('.tpgb-cursor-follow-circle');
                            var selctcircletag = data.circle_tag_selector;
                            var crcltransferNml = data.mc_circle_transformNml;						
                            var crcltransferHvr = data.mc_circle_transformHvr;
                            var crcltransitionNml = data.mc_circle_transitionNml;			
                            var crcltransitionHvr = data.mc_circle_transitionHvr;	
                            var stlcustmbgall = data.style_two_bg,
                                stlcustmbgallh = data.style_two_bgh;
                            let tagName = document.querySelectorAll(selctcircletag);
                            tagName.forEach((self) => {
                                self.addEventListener('mouseenter', function(){
                                    cursor.style.cssText = circlemainCss+" transform:"+crcltransferHvr+"; transition: transform; "+crcltransitionHvr+"s ease; background-color: "+stlcustmbgallh+"; ";
                                });
                                self.addEventListener('mouseleave', function(){
                                    cursor.style.cssText = circlemainCss+" transform:"+crcltransferNml+"; transition: transform; "+crcltransitionNml+"s ease; background-color: "+stlcustmbgall+"; ";
                                });
                            });
                        }
                    }
                }
            }
            else if(data.effect=='mc-body'){
                var aaa = document.querySelector('body');
                aaa.setAttribute("data-id","tpmcbody");
                aaa.classList.add('tpgb-block-tpmcbody');
                var effectclass = el.closest('.tpgb-block-tpmcbody');
                var ClassId = effectclass.getAttribute('data-id');
            }
            if(screen.width > 991){
                if(data.type=='mouse-cursor-icon' && data.mc_cursor_icon!=''){
                    var cssClassId = '';
                    cssClassId = 'tpgb-block-'+ClassId;
                    if(data.effect=='mc-block'){
                        cssClassId = ClassId;
                    }
                    var is_hover = '';
                    if(data.icon_type !=undefined && data.icon_type =='icon-predefine'){
                        if(data.mc_cursor_icon !=undefined && data.mc_cursor_icon !=''){
                            let css = '.'+cssClassId+',.'+cssClassId+' *,.'+cssClassId+' *:hover{cursor: '+data.mc_cursor_icon+';}',
                                head = document.head || document.getElementsByTagName('head')[0],
                                style = document.createElement('style');
                            head.appendChild(style);
                            style.type = 'text/css';
                            if (style.styleSheet){
                                style.styleSheet.cssText = css;
                            } else {
                                style.appendChild(document.createTextNode(css));
                            }
                        }
                    }
                    if(data.icon_type !=undefined && data.icon_type =='icon-custom'){
                        if(data.mc_cursor_see_more!=undefined && data.mc_cursor_see_more=='yes' && data.mc_cursor_see_icon!=''){
                            is_hover = '.'+cssClassId+' a,.'+cssClassId+' a *,.'+cssClassId+' a *:hover{cursor: -webkit-image-set(url('+data.mc_cursor_see_icon+') 2x) 0 0,pointer !important;cursor: url('+data.mc_cursor_see_icon+'),auto !important;}';
                        }
                        if(data.mc_cursor_icon !=undefined && data.mc_cursor_icon !=''){
                            let css = '.'+cssClassId+',.'+cssClassId+' *,.'+cssClassId+' *:hover{cursor: -webkit-image-set(url('+data.mc_cursor_icon+') 2x) 0 0,pointer;cursor: url('+data.mc_cursor_icon+'),auto ;}'+is_hover,
                                head = document.head || document.getElementsByTagName('head')[0],
                                style = document.createElement('style');
                            head.appendChild(style);
                            style.type = 'text/css';
                            if (style.styleSheet){
                                style.styleSheet.cssText = css;
                            } else {
                                style.appendChild(document.createTextNode(css));
                            }
                        }
                    }
                }
                else if(data.type=='mouse-follow-text' && data.mc_cursor_text!='' && effectclass && effectclass!=undefined){
                    effectclass.addEventListener("mouseenter", function(){
                        effectclass.style.cursor = 'auto';
                        effectclass.classList.add('cursor-active');
                        var wdhVal = effectclass.querySelector('.tpgb-cursor-pointer-follow-text').offsetWidth/2;
                        var hgtVal = effectclass.querySelector('.tpgb-cursor-pointer-follow-text').offsetHeight/2;
                        doc.addEventListener('mousemove', function(e) {
                            leftt = e.clientX + Number(leftoffset) - Number(wdhVal);
                            topp = e.clientY + Number(topoffset) - Number(hgtVal);
                            effectclass.querySelector('.tpgb-cursor-pointer-follow-text').style.left = leftt+"px";
                            effectclass.querySelector('.tpgb-cursor-pointer-follow-text').style.top = topp+"px";
                        });
                        if(data.mc_cursor_see_more=='yes' && data.mc_cursor_see_text!=''){
                            let alla = effectclass.querySelectorAll('a');
                            if(alla && alla!=undefined){
                                alla.forEach( a => {
                                    a.addEventListener("mouseenter", function(){
                                        effectclass.querySelector('.tpgb-cursor-pointer-follow-text').textContent = data.mc_cursor_see_text;
                                    })
                                    a.addEventListener("mouseleave", function(){
                                        effectclass.querySelector('.tpgb-cursor-pointer-follow-text').textContent = data.mc_cursor_text;
                                    })
                                })
                            }
                        }
                    });
                    effectclass.addEventListener("mouseleave", function(){
                        effectclass.classList.remove('cursor-active');
                    });
                }
                else if(data.type=='mouse-follow-image' && data.mc_cursor_icon !=undefined && data.mc_cursor_icon !='' && effectclass && effectclass!=undefined){
                    effectclass.addEventListener("mouseenter", function(){
                        effectclass.style.cursor = 'auto';
                        effectclass.classList.add('cursor-active');
                        doc.addEventListener('mousemove', function(e) { 
                            leftt = e.clientX + Number(leftoffset);
                            topp = e.clientY + Number(topoffset);
                            effectclass.querySelector('.tpgb-cursor-pointer-follow').style.left = leftt+"px";
                            effectclass.querySelector('.tpgb-cursor-pointer-follow').style.top = topp+"px";
                        });
                        if(data.mc_cursor_see_more=='yes' && data.mc_cursor_see_icon!=''){
                            let alla = effectclass.querySelectorAll('a');
                            if(alla && alla!=undefined){
                                alla.forEach( a => {
                                    a.addEventListener("mouseenter", function(){
                                        effectclass.querySelector('.tpgb-cursor-pointer-follow').src = data.mc_cursor_see_icon;
                                    })
                                    a.addEventListener("mouseleave", function(){
                                        effectclass.querySelector('.tpgb-cursor-pointer-follow').src = data.mc_cursor_icon;
                                    })
                                });
                            }
                        }
                    });
                    effectclass.addEventListener("mouseleave", function(){
                        effectclass.classList.remove('cursor-active');
                    });
                }
                if(data.type=='mouse-follow-circle' && effectclass && effectclass!=undefined){
                    if (data.mc_cursor_adjust_style != undefined && data.mc_cursor_adjust_style == 'mc-cs1' || data.mc_cursor_adjust_style == 'mc-cs2' || data.mc_cursor_adjust_style == 'mc-cs3') {
                        let tagName = document.querySelectorAll(data.circle_tag_selector);
                            tagName.forEach((self) => {
                                self.addEventListener('mouseenter', function(){
                                    effectclass.classList.add('tpgb-mouse-hover-active');
                                });
                                self.addEventListener('mouseleave', function(){
                                    effectclass.classList.remove('tpgb-mouse-hover-active');
                                });
                            });
                    }
                    if(data.effect=='mc-body'){		     
                        if (data.mc_cursor_adjust_style != undefined && (data.mc_cursor_adjust_style == 'mc-cs2' || data.mc_cursor_adjust_style == 'mc-cs2' || data.mc_cursor_adjust_style == 'mc-cs2')) { 
                            window.onload = function() {  
                                const crclcursor = document.querySelector('.tpgb-cursor-follow-circle');
                                const svg = document.querySelector('.tpgb-mc-svg-circle'); //svg
                                const progressBar = document.querySelector('.tpgb-mc-circle-progress-bar');
                                const totalLength = progressBar.getTotalLength();
                                setTopValue(svg);  
                                progressBar.style.strokeDasharray = totalLength;
                                progressBar.style.strokeDashoffset = totalLength;
                                window.addEventListener('scroll', () => {
                                    setProgress(crclcursor, progressBar, totalLength);
                                }); 
                                window.addEventListener('resize', () => {
                                    setTopValue(svg);
                                });
                            }
                            function setTopValue(svg) {
                                svg.style.top = document.documentElement.clientHeight * 0.5 - (svg.getBoundingClientRect().height * 0.5) + 'px';
                            }
                            function setProgress(crclcursor, progressBar, totalLength) {
                                const clientHeight = document.documentElement.clientHeight;
                                const scrollHeight = document.documentElement.scrollHeight;
                                const scrollTop = document.documentElement.scrollTop;
                                let percentage = scrollTop / (scrollHeight - clientHeight);
                                percentage = percentage.toFixed(2)
                                if(percentage == 1 || percentage == 1.00) {
                                    crclcursor.classList.add('mc-circle-process-done');
                                } else {
                                    crclcursor.classList.remove('mc-circle-process-done');
                                }
                                progressBar.style.strokeDashoffset = totalLength - totalLength * percentage;
                            }
                        }
                    }
                    effectclass.addEventListener("mouseenter", function(){
                        if(data.circle_type=='cursor-custom' && data.mc_cursor_icon!=''){
                            effectclass.querySelector('.tpgb-cursor-follow-circle').style.cursor = "url('"+data.mc_cursor_icon+"'), auto";
                        }
                        if(data.circle_type=='cursor-custom'){
                            var cssClassId = '';
                            cssClassId = 'tpgb-block-'+ClassId;
                            if(data.effect=='mc-block'){
                                cssClassId = ClassId;
                            }
                            effectclass.querySelector('.tpgb-cursor-follow-circle').style.pointerEvents = 'none';
                            if(data.mc_cursor_icon !=undefined && data.mc_cursor_icon !=''){
                                var is_circle = '';
                                if(data.mc_cursor_see_more!=undefined && data.mc_cursor_see_more =='yes' && data.mc_cursor_see_icon!=''){
                                    var is_circle = '.'+cssClassId+' a,.'+cssClassId+' a *,.'+cssClassId+' a *:hover{cursor: -webkit-image-set(url('+data.mc_cursor_see_icon+') 2x) 0 0,pointer !important;cursor: url('+data.mc_cursor_see_icon+'),auto !important;}';
                                }
                                let css = '.'+cssClassId+',.'+cssClassId+' *,.'+cssClassId+' *:hover{cursor: -webkit-image-set(url('+data.mc_cursor_icon+') 2x) 0 0,pointer ;cursor: url('+data.mc_cursor_icon+'),auto;}'+is_circle,
                                    head = document.head || document.getElementsByTagName('head')[0],
                                    style = document.createElement('style');
                                head.appendChild(style);
                                style.type = 'text/css';
                                if (style.styleSheet){
                                    style.styleSheet.cssText = css;
                                } else {
                                    style.appendChild(document.createTextNode(css));
                                }
                            }       
                        }	
                        effectclass.style.cursor = 'auto';
                        effectclass.classList.add('cursor-active');
                        var wdhVal = effectclass.querySelector('.tpgb-cursor-follow-circle').offsetWidth/2;
                        var hgtVal = effectclass.querySelector('.tpgb-cursor-follow-circle').offsetHeight/2;
                        
                        doc.addEventListener('mousemove', function(e) {
                            leftt = e.clientX + Number(leftoffset) - Number(wdhVal);
                            topp = e.clientY + Number(topoffset) - Number(hgtVal);
                            effectclass.querySelector('.tpgb-cursor-follow-circle').style.left = leftt+"px";
                            effectclass.querySelector('.tpgb-cursor-follow-circle').style.top = topp+"px";
                        });
                        if(data.mc_cursor_see_more=='yes' && data.mc_cursor_see_icon!='' && data.circle_type=='cursor-custom'){
                            let alla = effectclass.querySelectorAll('a');
                            if(alla && alla!=undefined){
                                alla.forEach( a => {
                                    a.addEventListener("mouseenter", function(){
                                        effectclass.querySelector('.tpgb-cursor-follow-circle').style.cursor = "url('"+data.mc_cursor_see_icon+"'), auto";
                                    });
                                    a.addEventListener("mouseleave", function(){
                                        effectclass.querySelector('.tpgb-cursor-follow-circle').style.cursor = "url('"+data.mc_cursor_icon+"'), auto";
                                    });
                                });
                            }
                        }
                        effectclass.addEventListener("mouseleave", function(){
                            effectclass.classList.remove('cursor-active');
                        });
                    });
                }
            }
        }
    });
}


