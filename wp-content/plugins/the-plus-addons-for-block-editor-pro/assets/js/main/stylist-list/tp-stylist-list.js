/** Stylish List */
window.addEventListener('DOMContentLoaded', (event) => {
    tpstlishList(document)
});

function tpstlishList(doc){
    let sList = doc.querySelectorAll('.tpgb-stylist-list');
    if(sList){
        sList.forEach((sl)=>{
            let read_more = sl.querySelector(".read-more-options"),
                ul_listing = sl.querySelectorAll(".tpgb-icon-list-item");

            /** Read More */
            if(read_more){
                var default_load = read_more.getAttribute("data-default-load");
                    ul_listing.forEach((ulist, index)=>{
                        if(index>=default_load){
                            ulist.style.display = "none";
                        }
                    });
                read_more.addEventListener('click', (e)=>{
                    e.preventDefault();
                    let readCurr = e.currentTarget;

                    var less_text = readCurr.getAttribute("data-less-text"),
                        more_text = readCurr.getAttribute("data-more-text");

                    if(readCurr.classList.contains('more')){
                        ul_listing.forEach((ulist)=>{
                            if( window.getComputedStyle(ulist).display == "none"){
                                ulist.style.display = '';
                            }
                        });

                        readCurr.classList.remove('more');
                        readCurr.classList.add('less');
                        readCurr.textContent = less_text;
                    }else if(readCurr.classList.contains('less')){
                        ul_listing.forEach((ulist, index)=>{
                            if(index>=default_load){
                                ulist.style.display = "none";
                            }
                        });

                        readCurr.classList.remove('less');
                        readCurr.classList.add('more');
                        readCurr.textContent = more_text;
                    }
                });
            }

            /** Background Hover Effect */
            let bgEffect = sl.querySelector('.tpgb-bg-hover-effect');
            if(bgEffect){
                let bgContent = sl.querySelectorAll('.hover-item-content');
                ul_listing.forEach((ulist, index)=>{
                    ulist.addEventListener('mouseenter', ()=>{
                        if(!ulist.classList.contains('active')){
                            ul_listing.forEach((ulist1)=>{
                                if(ulist1.classList.contains('active')){
                                    ulist1.classList.remove('active');
                                }
                            });
                            
                            bgContent.forEach((cnt,ind)=>{
                                if(cnt.classList.contains('active')){
                                    cnt.classList.remove('active');
                                }
                                if(index == ind){
                                    cnt.classList.add('active')
                                }
                            });

                        }
                    });
                });
            }

            /** Hover Inverse or Global Hover Inverse */
            let hoverInverse = sl.classList.contains('hover-inverse-effect'),
                hoverGinverse = sl.classList.contains('hover-inverse-effect-global');
            if(hoverInverse || hoverGinverse){
                let mainItems = sl.querySelector('.tpgb-icon-list-items'),
                    hover_class = sl.getAttribute('data-hover-inverse'),
                    gInvClass = '';
                    if(hover_class){
                        gInvClass = document.querySelectorAll('.'+hover_class);
                    }
                ul_listing.forEach((ulist)=>{

                    ulist.addEventListener('mouseenter', ()=>{
                        if(hoverInverse){
                            mainItems.classList.add('on-hover');
                        }else if(hoverGinverse){
                            document.body.classList.add('hover-stylist-global');
                            gInvClass.forEach((gi)=>{
                                var ilI = gi.querySelector('.tpgb-icon-list-items');
                                ilI.classList.add('on-hover')
                            });
                        }
                    });

                    ulist.addEventListener('mouseleave', ()=>{
                        if(hoverInverse){
                            mainItems.classList.remove('on-hover');
                        }else if(hoverGinverse){
                            document.body.classList.remove('hover-stylist-global');
                            gInvClass.forEach((gi)=>{
                                var ilI = gi.querySelector('.tpgb-icon-list-items');
                                ilI.classList.remove('on-hover')
                            });
                        }
                        
                    });

                });
            }

            /** Tooltip */
            ul_listing.forEach((uli)=>{
                let id = uli.getAttribute('id'),
                    settings = uli.getAttribute("data-tooltip-opt");
                settings = JSON.parse(settings);
        
                if( settings && settings.content != '' ){
                    tippy( '#'+id , {
                        allowHTML : true,
                        content: settings.content,
                        trigger : settings.trigger,
                        maxWidth : settings.MaxWidth,
                        appendTo: document.querySelector('#'+id),
                    });
                }
            })

        });
    }
}