document.addEventListener("DOMContentLoaded", (event) => {
    tpcopCode(document);
});

function  tpcopCode(doc){
    let elements = doc.querySelectorAll('.tpgb-coupon-code');
    if(elements){
        elements.forEach( el => {
            var data = JSON.parse(el.getAttribute('data-tpgb_cc_settings')),
                coupen = el.querySelector('.coupon-front-side'),
                fillPercent = data.fillPercent,
                couponType = data.couponType;
            if(couponType=='standard') {
                
                let UniqCls = '.tpgb-block-' + data.id,
                    UniqId = '#tpgb-block-' + data.id,
                    UniqId1 = '\#tpgb-block-' + data.id,
                    Btnlink = '.tpgb-block-'+data.id+' .coupon-btn-link';
                
                if(data.actionType=='popup') {
                    document.querySelector(Btnlink).addEventListener("click", function(e) {
                        if (this.getAttribute('href') === '#' || this.getAttribute('href') === '') {
                            e.preventDefault();
                        }
                        document.querySelector(UniqCls + ' .copy-code-wrappar').classList.add("active");
                    
                        document.querySelector(UniqCls + ' .copy-code-btn').addEventListener("click", function(e) {
                            var copyText = document.querySelector('.full-code-text');
                            tpgbCopyCode(copyText, data, UniqCls, this);
                        });
                    });
                    var closeButtons = el.querySelectorAll(".tpgb-ccd-closebtn, .copy-code-wrappar");
                    closeButtons.forEach(function(button) {
                        button.addEventListener("click", ()=>{ closeModal(el) });
                    });
    
                    if (el.classList.contains("tpgb-tab-cop-rev")) {
                        document.querySelector(UniqCls + ' .copy-code-btn').addEventListener("click", function(event) {
                            var copyText = el.querySelector('.full-code-text');
                            tpgbCopyCode(copyText, data, UniqCls, event.target);
                        });
                    
                        document.querySelector(Btnlink).addEventListener("click", function(e) {
                            if (this.getAttribute('href') === '#' || this.getAttribute('href') === '') {
                                e.preventDefault();
                            }
                            window.open(window.location + UniqId1, "_blank");
                            setTimeout(function() {
                                window.location.href = data.extlink;
                            }, 100);
                        });
                    
                        var hash = window.location.hash;
                        if (hash === UniqId) {
                            document.querySelector(UniqCls + " .copy-code-wrappar").classList.add("active");
                            document.querySelector(UniqCls + " .full-code-text").classList.add("tpgb-code-popup");
                        }
                    }
                }else if(data.actionType=='click'){
                    let copycodeicon = '';
                    if(el.classList.contains('code-click-icon')){
                        copycodeicon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" class="code-copy-svg-icon"><path d="M4.33301 4.14335V2.60335C4.3331 2.35472 4.43192 2.11631 4.60776 1.94053C4.7836 1.76476 5.02205 1.66602 5.27067 1.66602H13.3953C13.644 1.66602 13.8825 1.76481 14.0584 1.94065C14.2342 2.1165 14.333 2.355 14.333 2.60368V10.7287C14.3329 10.9773 14.2341 11.2156 14.0584 11.3914C13.8826 11.5671 13.6442 11.6659 13.3957 11.666H11.8383" stroke="black" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/><path d="M10.6623 4.40039H2.53661C2.28804 4.40057 2.04971 4.49943 1.87401 4.67526C1.69831 4.85109 1.59961 5.08949 1.59961 5.33806V13.4627C1.59961 13.7114 1.6984 13.9499 1.87425 14.1258C2.05009 14.3016 2.28859 14.4004 2.53728 14.4004H10.6623C10.9108 14.4003 11.1492 14.3015 11.325 14.1258C11.5007 13.95 11.5995 13.7116 11.5996 13.4631V5.33739C11.5994 5.08888 11.5006 4.8506 11.3249 4.67491C11.1491 4.49922 10.9108 4.40048 10.6623 4.40039Z" fill="black" stroke="black" stroke-width="1.33333" stroke-linejoin="round"/><path d="M10.0002 7.2002L5.3252 11.6002L3.2002 9.6002" stroke="white" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round" class="check"/></svg>';
                    }
    
                    function copyiconfun(){
                        let getCpIcon = el.querySelector('.code-copy-svg-icon');
                        if(getCpIcon){
                            getCpIcon.addEventListener('click', (eee)=>{
                                eee.currentTarget.classList.add('copied');
    
                                let copyText = el.querySelector('.full-code-text');
                                tpgbCopyCode(copyText, '', '', '');
    
                                setTimeout(()=>{
                                    getCpIcon.classList.remove('copied');
                                }, 2000)
                            })
                        }
                    }
    
                    var replaceCode = '<span class="full-code-text '+data.code_arrow+'">'+data.coupon_code+copycodeicon+'</span>';
                    el.querySelector('.coupon-btn-link').addEventListener("click", function(e) {
                        if (this.getAttribute('href') === '#' || this.getAttribute('href') === '') {
                            e.preventDefault();
                        }
                        let closestCouponCodeInner = e.currentTarget.closest('.tpgb-block-' + data.id);
                        if (closestCouponCodeInner) {
                            closestCouponCodeInner.innerHTML = replaceCode;
                        }
                        copyiconfun();
                        if(el.dataset.saveCookies){
                            window.localStorage.setItem('tpgb_coupon_cookie', true);
                        }
                        if(e.currentTarget.classList.contains('tpgb-hl-links')){
                            e.preventDefault();
                            var hlset = e.currentTarget.getAttribute('data-hlset');	
                            if(hlset){
                                hlset = JSON.parse(hlset);
                                for (var i = 0, length = hlset.length; i < length; ++i) {
                                    var url = hlset[i];								
                                    window.open(url, '_blank');
                                }
                            }				
                        }
                    });
                    if(el.dataset.saveCookies && window.localStorage.getItem('tpgb_coupon_cookie')){
                        el.innerHTML = replaceCode;
                        copyiconfun();
                    }
                }
            }else if(couponType=='scratch') {
                html2canvas( el.querySelector('.coupon-front-side'), {
                    allowTaint: true,
                    backgroundColor: null,
                    windowWidth: window.innerWidth,
                    windowHeight: window.innerHeight,
                    scrollX: 0,
                    scrollY: -window.scrollY,
                } ).then( function( canvas ) {
                    canvas.setAttribute( 'class', 'coupon-front-side-canvas' );
                    el.insertBefore(canvas, el.firstChild);
                    var frontSide = el.querySelector('#front-side-' + data.id);
                    if (frontSide) {
                        frontSide.style.opacity = 0;
                        setTimeout(function() {
                            el.removeChild(frontSide);
                        }, 300);
                    }
                    
                    var canvas       = el.querySelector('canvas'),
                        canvasWidth  = canvas.width,
                        canvasHeight = canvas.height,
                        ctx          = canvas.getContext('2d'),
                        brush        = new Image(),
                        isDrawing	 = false,
                        lastPin;
                        brush.src = 'data:image/png;base64,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';
    
                        canvas.addEventListener( 'mousedown', checkMouseDown, false );
                        canvas.addEventListener( 'mousemove', checkMouseMove, false );
                        canvas.addEventListener( 'mouseup', checkMouseUp, false );
    
                        canvas.addEventListener( 'touchstart', checkMouseDown, false );
                        canvas.addEventListener( 'touchmove', checkMouseMove, false );
                        canvas.addEventListener( 'touchend', checkMouseUp, false );
    
                    function distanceBetween( pin1, pin2 ) {
                        return Math.sqrt( Math.pow( pin2.x - pin1.x, 2 ) + Math.pow( pin2.y - pin1.y, 2 ) );
                    }
    
                    function angleBetween( pin1, pin2 ) {
                        return Math.atan2( pin2.x - pin1.x, pin2.y - pin1.y );
                    }
    
                    function getFillPx( step ) {
                        if ( ! step || step < 1 ) {
                            step = 1;
                        }
                        var pixels   = ctx.getImageData(0, 0, canvasWidth, canvasHeight),
                            pdata    = pixels.data,
                            l        = pdata.length,
                            total    = ( l / step ),
                            count    = 0;
                        for( var i = count = 0; i < l; i += step ) {
                            if ( parseInt( pdata[i] ) === 0 ) {
                                count++;
                            }
                        }
                        return Math.round( ( count / total ) * 100 );
                    }
    
                    function getMouse( e, canvas ) {
                        var offsetX = 0,
                            offsetY = 0,
                            mx,
                            my;
                        mx = ( e.pageX || e.touches[0].clientX ) - offsetX;
                        my = ( e.pageY || e.touches[0].clientY ) - offsetY;
    
                        return { x: mx, y: my };
                    }
    
                    function checkPercentage( filledPx ) {
                        filledPx = filledPx || 0;
    
                        if ( filledPx > fillPercent) {
                            canvas.parentNode.removeChild(canvas);
                        }
                    }
    
                    function checkMouseDown( e ) {
                        isDrawing = true;
                        lastPin = getMouse( e, canvas );
                    }
    
                    function checkMouseMove( e ) {
    
                        if ( ! isDrawing ) {
                            return;
                        }
                        e.preventDefault();
    
                        var currentPin = getMouse( e, canvas ),
                            distance = distanceBetween( lastPin, currentPin ),
                            angle = angleBetween( lastPin, currentPin ),
                            x = 0,
                            y = 0;
    
                        for ( var i = 0; i < distance; i++ ) {
                            x = lastPin.x + ( Math.sin( angle ) * i ) - 40;
                            y = lastPin.y + ( Math.cos( angle ) * i ) - 40;
                            ctx.globalCompositeOperation = 'destination-out';
                            ctx.drawImage( brush, x, y, 80, 80 );
                        }
                        lastPin = currentPin;
                        checkPercentage( getFillPx( 32 ) );
                    }
    
                    function checkMouseUp( e ) {
                        isDrawing = false;
                    }
                    
                } );
            } else if(couponType=='slideOut') {
                var frontSide = el.querySelector('.coupon-front-side'),
                    backSide = el.querySelector('.coupon-back-side'),
                    targetWidth = el.offsetWidth,
                    targetHeight = el.offsetHeight,
                    axis = (data.slideDirection === 'left' || data.slideDirection === 'right') ? 'x' : 'y';
    
                frontSide.style.position = 'absolute';
    
                // Add draggable functionality to the front side
                draggableP(frontSide, {
                    axis: axis,
                    diraction: data.slideDirection,
                    dragP: function(event, ui) {
                        var dragAttr = ui.position;
                        switch(data.slideDirection) {
                            case 'left':
                                if (dragAttr.left >= 0) {
                                    ui.position.left = 0;
                                }
                                break;
                            case 'right':
                                if (dragAttr.left <= 0) {
                                    ui.position.left = 0;
                                }
                                break;
                            case 'top':
                                if (dragAttr.top >= 0) {
                                    ui.position.top = 0;
                                }
                                break;
                            case 'bottom':
                                if (dragAttr.top <= 0) {
                                    ui.position.top = 0;
                                }
                                break;
                        }
                    }
                });
    
                function draggableP(element, options) {
                    var isDragging = false,
                        startX,
                        startY,
                        deltaX = 0,
                        deltaY = 0;
                    element.classList.add('tpgb-draggable-handle');
    
                    element.addEventListener('mousedown', dragStartP);
                    element.addEventListener('touchstart', dragStartP);
    
                    function dragStartP(event) {
                        isDragging = true;
                        element.classList.add('tpgb-draggable-dragging');
                        startX = (event.touches && event.touches[0] && event.touches[0].pageX) ? event.touches[0].pageX : event.pageX;
                        startY = (event.touches && event.touches[0] && event.touches[0].pageY) ? event.touches[0].pageY : event.pageY;
                        document.addEventListener('mousemove', dragP);
                        document.addEventListener('mouseup', dragEndP);
                        document.addEventListener('touchmove', dragP);
                        document.addEventListener('touchend', dragEndP);
                    }
    
                    function dragP(event) {
                        if (!isDragging) return;
                        var newX = (event.touches && event.touches[0] && event.touches[0].pageX) ? event.touches[0].pageX : event.pageX;
                        var newY = (event.touches && event.touches[0] && event.touches[0].pageY) ? event.touches[0].pageY : event.pageY;
    
                        deltaX = newX - startX;
                        deltaY = newY - startY;
                        startX = newX;
                        startY = newY;
    
                        var newPosition = {
                            left: element.offsetLeft + deltaX,
                            top: element.offsetTop + deltaY
                        };
    
                        if (options.axis === 'x') {
                            if(options.diraction == 'left' && newPosition.left < 0){
                                element.style.left = newPosition.left + 'px';
                            }else if(options.diraction == 'right' && newPosition.left > 0){
                                element.style.left = newPosition.left + 'px';
                            }
                        } else if (options.axis === 'y') {
                            if(options.diraction == 'top' && newPosition.top < 0){
                                element.style.top = newPosition.top + 'px';
                            }else if(options.diraction == 'bottom' && newPosition.top > 0){
                                element.style.top = newPosition.top + 'px';
                            }    
                        }
    
                        if (typeof options.drag === 'function') {
                            options.drag.call(null, event, {
                                position: newPosition
                            });
                        }
                    }
    
                    function dragEndP() {
                        isDragging = false;
                        element.classList.remove('tpgb-draggable-dragging');
                        
                        document.removeEventListener('mousemove', dragP);
                        document.removeEventListener('mouseup', dragEndP);
                        document.removeEventListener('touchmove', dragP);
                        document.removeEventListener('touchend', dragEndP);
                    }
                }
    
            } else if(couponType=='peel') {
                el.classList.add('peel-ready');
                var front = coupen;
                var frontClone = front.cloneNode(true);
                front.classList.add('peel-top');
                frontClone.removeAttribute('id');
                frontClone.classList.add('peel-back');
                var frontSide = document.getElementById('front-side-' + data.id);
                if (frontSide.nextSibling) {
                    frontSide.parentNode.insertBefore(frontClone, frontSide.nextSibling);
                } else {
                    frontSide.parentNode.appendChild(frontClone);
                }
                el.querySelector('.coupon-back-side').classList.add('peel-bottom');
    
                var peel = new Peel( ".tpgb-block-"+data.id , {
                    corner: Peel.Corners.TOP_RIGHT
                } );
                var targetWidth = el.clientWidth,
                    targetHeight = el.clientHeight;
                peel.setPeelPosition( targetWidth - 30, 40 );
                peel.setFadeThreshold(.8);
                peel.handleDrag( function( evt, x, y ) {
                    var targetRect = el.getBoundingClientRect(),
                        offsetX      = targetRect.left + window.scrollX,
                        offsetY      = targetRect.top + window.scrollY,
                        deltaX       = x - offsetX,
                        deltaY       = y - offsetY;
    
                    deltaX = deltaX < 0 ? deltaX*=3 : deltaX;
                    deltaY = deltaY < 0 ? deltaY*=3 : deltaY;
                    if (0.98 < this.getAmountClipped()) {
                        this.removeEvents();
                        var elementsToRemove = el.querySelectorAll('.peel-top, .peel-back, .peel-bottom-shadow');
                        elementsToRemove.forEach(function(element) {
                            element.remove();
                        });
                    }
                    peel.setPeelPosition( Math.round( deltaX ), Math.round( deltaY ) );
                });
            }
        });
    }
}
function tpgbCopyCode(copyText, data, UniqCls, el) {
    var text = copyText.innerText;
    var textArea = document.createElement('textarea');
    textArea.style.opacity = "0";
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    if (data) {
        el.textContent = data.after_copy_text;
        setTimeout(function() {
            document.querySelector(UniqCls + ' .copy-code-btn').textContent = data.copy_btn_text;
        }, 2000);
    }
}

function closeModal(el) {
    var wrapper = el.querySelector(".copy-code-wrappar");
    wrapper.classList.remove("active");
}