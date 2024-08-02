/* Animated services box */
window.addEventListener('DOMContentLoaded', (event) => {
    tpaniBox(document)
});

function tpaniBox(doc){
    let aniSerBox = doc.querySelectorAll('.tpgb-animated-service-boxes');
    if(aniSerBox){
        aniSerBox.forEach((asb)=>{
            let loopItem = asb.querySelectorAll('.service-item-loop');
            if(loopItem){
                loopItem.forEach((lpi, index)=>{
                    
                    /* Image Accordion */
                    if(asb.classList.contains('image-accordion')){
                        var activeClass = 'active_accrodian';
                        lpi.addEventListener('mouseenter', (ia)=>{
                            if(asb.querySelector('.active_accrodian')){
                                asb.querySelector('.active_accrodian').classList.remove(activeClass);
                            }
                            ia.currentTarget.classList.add(activeClass);
                        })

                        lpi.addEventListener('mouseleave', (ia)=>{
                            if(ia.currentTarget.classList.contains(activeClass) && ia.currentTarget.closest('.image-accordion').getAttribute('data-accordion-hover')=='yes'){
                                ia.currentTarget.classList.remove(activeClass);
                            }
                        })
                    }

                    /* Article Box */
                    if(asb.classList.contains('article-box-style-1')){
                        var article_hover = ".article-hover-content";

                        let artBC = lpi.querySelector('.article-box-inner-content');
                        if(artBC){
                            artBC.addEventListener('mouseenter', (abc)=>{
                                let artHvr = abc.currentTarget.querySelector(article_hover);
                                slideDownP(artHvr, 300)
                            })

                            artBC.addEventListener('mouseleave', (abc)=>{
                                let artHvr = abc.currentTarget.querySelector(article_hover);
                                slideUpP(artHvr, 300)
                            })
                        }
                    }

                    /* Portfolio */
                    if (asb.classList.contains('portfolio')) {
                        lpi.addEventListener('mouseenter', (ia)=>{
                            var imageurl = ia.currentTarget.getAttribute('data-url');
                            if(asb.querySelector('.active-port')){
                                asb.querySelector('.active-port').classList.remove("active-port");
                            }
                            ia.currentTarget.classList.add("active-port");

                            var portHoverImage = '';
                            if (asb.classList.contains('portfolio-style-1')) {
                                portHoverImage = '.portfolio-hover-image';
                            }else if(asb.classList.contains('portfolio-style-2')){
                                portHoverImage = '.portfolio-wrapper';
                            }
                            let portHimg = ia.currentTarget.closest('.asb_wrap_list').querySelector(portHoverImage);
                            if(portHimg){
                                portHimg.style.background = "url("+imageurl+")";
                            }
                        })
                    }

                    /* Hover Section */
                    if(asb.classList.contains('hover-section')){
                        var hover_sec_boc = lpi.getAttribute('data-hsboc');
                        if(index==0){
                            var total_hover_section = lpi.querySelector('.hover-section-content-wrapper').getAttribute('data-image'),
                                sectionSelector = lpi.closest('.tpgb-section'),
                                containerSelector = lpi.closest('.tpgb-container-row');
                            if(sectionSelector){
                                sectionSelector.style.cssText = 'background: url('+ total_hover_section +') center/cover; transition: background 0.5s linear; box-shadow: '+hover_sec_boc + ' 0px 0px 0px 2000px inset';
                            }else if(containerSelector){
                                containerSelector.style.cssText = 'background: url('+ total_hover_section +') center/cover; transition: background 0.5s linear; box-shadow: '+hover_sec_boc + ' 0px 0px 0px 2000px inset';
                            }else{
                                let hsecn= lpi.closest('.hover-section');
                                hsecn.style.cssText = 'background: url('+ total_hover_section +') center/cover; transition: background 0.5s linear; box-shadow: '+hover_sec_boc + ' 0px 0px 0px 2000px inset';
                            }
                        }

                        lpi.addEventListener('mouseenter',(ia)=>{
                            var image = ia.currentTarget.querySelector('.hover-section-content-wrapper').getAttribute('data-image'),
                                sectionSelector = ia.currentTarget.closest('.tpgb-section'),
                                containerSelector = ia.currentTarget.closest('.tpgb-container-row');
                            ia.currentTarget.closest('.asb_wrap_list').querySelector(".service-item-loop").classList.remove("active-hover");
                            ia.currentTarget.classList.add("active-hover");
                            if(sectionSelector){
                                sectionSelector.style.background = 'url('+ image +') center/cover';
                            }else if(containerSelector){
                                containerSelector.style.background = 'url('+ image +') center/cover';
                            }else{
                                ia.currentTarget.closest('.hover-section').style.background = 'url('+ image +') center/cover';
                            }
                        })
                    }

                })

                /* Fancy Box */
                if(asb.classList.contains('fancy-box-style-1')){				
                    var fb_height = asb.querySelector('.fancybox-inner-content').clientHeight;
                    
                    loopItem.forEach((lpi)=>{
                        let fImgBg = lpi.querySelector('.fancybox-image-background');
                        if(fImgBg){
                            fImgBg.style.minHeight = fb_height+"px";
                            fImgBg.style.height = fb_height+"px";
                        }

                        let fInCon = lpi.querySelector('.fancybox-inner-content');
                        if(fInCon){
                            fInCon.style.position = "absolute";
                            fInCon.style.top = 0;
                            fInCon.style.height = "max-content";
                        }
                    });
                }

                /* Services Element */
                if (asb.classList.contains('services-element-style-1')) {
                    function secElement(){
                        let secW = asb.querySelectorAll('.se-wrapper');
                        secW.forEach((sw)=>{
                            setTimeout(()=>{
                                sec_height = sw.offsetHeight;
                        
                                let secListSec = sw.querySelector('.se-listing-section');
                                    secListSec.style.paddingTop = sec_height+"px";
                            }, 10);
                        })
                    }
                    secElement();
                    window.addEventListener('resize', secElement);
                }

                /* Slide Box */
                if(asb.classList.contains('sliding-boxes')){
                    var w = document.body.clientWidth;

                    function asbSlideBox(event){
                        var w = document.body.clientWidth;
                        if(w>=1024){
                            var total_item = loopItem.length;
                            var new_total_item = total_item + 1; 
                            var margin = (total_item - 1) * 15;
                            var divWidth = asb.querySelector(".asb_wrap_list").clientWidth;
                            divWidth = divWidth -  margin;
                            new_total_item = (divWidth / new_total_item);	
                            
                            loopItem.forEach((lpi)=>{
                                lpi.setAttribute('data-width', new_total_item);
                                lpi.style.width = new_total_item+"px";
                                if(lpi.querySelector('img')){
                                    lpi.querySelector('img').style.width = new_total_item+"px";
                                }
                                if(lpi.querySelector('.tp-sb-image')){
                                    lpi.querySelector('.tp-sb-image').style.width = new_total_item+"px";
                                }
                                if(lpi.querySelector('.asb-content')){
                                    lpi.querySelector('.asb-content').style.width = new_total_item+"px";
                                    lpi.querySelector('.asb-content').style.left = new_total_item+"px";
                                }
                                if(lpi.classList.contains("active-slide")){
                                    lpi.style.width = new_total_item*2+"px";
                                }
                            })
                        }else if(event.type == 'resize'){
                            loopItem.forEach((lpi)=>{
                                lpi.style.width = "";
                                if(lpi.querySelector('img')){
                                    lpi.querySelector('img').style.width = "";
                                }
                                if(lpi.querySelector('.tp-sb-image')){
                                    lpi.querySelector('.tp-sb-image').style.width = "";
                                }
                                if(lpi.querySelector('.asb-content')){
                                    lpi.querySelector('.asb-content').style.width = "";
                                    lpi.querySelector('.asb-content').style.left = "";
                                }
                                if(lpi.classList.contains("active-slide")){
                                    lpi.style.width = "";
                                }
                            })
                        }
                    }

                    window.addEventListener('load', asbSlideBox);
                    window.addEventListener('resize', asbSlideBox);
                    loopItem.forEach((lpi)=>{
                        lpi.addEventListener("mouseenter", (ia)=>{
                            if(!ia.currentTarget.classList.contains('active-slide')){
                                var width = ia.currentTarget.getAttribute('data-width');
                                if(w>=1024){
                                    if(asb.querySelector('.active-slide')){
                                        asb.querySelector('.active-slide').style.width = width+"px";
                                        asb.querySelector('.active-slide').classList.remove("active-slide");
                                    }
                                    ia.currentTarget.classList.add('active-slide');
                                    ia.currentTarget.style.width = width * 2+"px";
                                    let innCont = ia.currentTarget.querySelector('.asb-content');
                                    if(innCont){
                                        innCont.style.left = width+"px";
                                    }
                                }else{
                                    if(asb.querySelector('.active-slide')){
                                        asb.querySelector('.active-slide').classList.remove("active-slide");
                                    }
                                    ia.currentTarget.classList.add('active-slide');
                                }
                            }
                        })
                        
                    })
                }
            }
            
            /*Animated services box*/
            function aniSerExtra(){
                var width_in = document.body.clientWidth;
                if(width_in <= 1024){
                    if(asb.classList.contains('portfolio')){
                        
                        let mainTlink = asb.querySelectorAll(".asb-title-link")
                        if(mainTlink){
                            mainTlink.forEach((mLink)=>{
                                mLink.addEventListener("click", (event)=>{
                                    event.stopPropagation();
                                    event.currentTarget.removeAttribute('href');

                                    if(!event.currentTarget.querySelector('.mobile-click-port')){
                                        var portfolio_click = event.currentTarget.closest('.service-item-loop.active-port').getAttribute('data-clickurl');
                                        var portfolio_clicktext = event.currentTarget.closest('.service-item-loop.active-port').getAttribute('data-clicktext');

                                        const mobileNode = document.createElement("div");
                                        mobileNode.className = "mobile-click-port tpgb-relative-block";
                                        mobileNode.innerHTML ='<a class="pf_a_click tpgb-rel-flex" href="' + portfolio_click + '">' + portfolio_clicktext + '</a>';
                                        event.currentTarget.appendChild(mobileNode);
                                    }
                                });
                            });
                        }
                    }
                }
                if(width_in <= 767){
                    if(asb.classList.contains('hover-section') || asb.classList.contains('sliding-boxes') || asb.classList.contains('image-accordion')){
                        let mainTlink = asb.querySelectorAll(".asb-title-link")
                        if(mainTlink){
                            mainTlink.forEach((mLink)=>{
                                mLink.addEventListener("click", (event)=>{
                                    event.stopPropagation();
                                    event.currentTarget.removeAttribute('href');
                                });
                            });
                        }
                    }
                }
            }

            window.addEventListener("load", aniSerExtra);
            window.addEventListener("resize", aniSerExtra);
        });
    }
}