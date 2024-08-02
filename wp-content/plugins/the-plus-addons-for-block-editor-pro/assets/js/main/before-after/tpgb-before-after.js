document.addEventListener("DOMContentLoaded", function() {
    tpbeAfimg(document);
});

function tpbeAfimg(doc){
    var containers = doc.querySelectorAll('.tpgb-before-after'),
    contId = 0,
    configType = '',
    sep_Size = '',
    indSize = '',
    show = '',
    initRatio = '';
    containers.forEach(function(container) {
        container.style.visibility = "hidden";
        contId++;
        container.setAttribute("data-before-after-id", contId);
        configType = container.dataset.type;
        sep_Size = container.dataset.separate_width;
        indSize = container.dataset.bottomSeparatorSize;
        show = container.dataset.show;

        if (!show) return;
        else if (configType == "cursor") {
            initRatio = container.dataset.separate_position;
            var beforeImg = container.querySelector(".tpgb-beforeafter-img");
            var sepIcon = container.querySelector(".tpgb-before-sepicon");
            beforeImg.style.position = "absolute";
            if(sepIcon){ sepIcon.style.left = initRatio + "%"; sepIcon.style.display = "none"; }
            beforeImg.style.position = "absolute";
            container.querySelector(".tpgb-beforeafter-inner").addEventListener("mouseout", function(event) {
                show_separator_image();
                position_changing(event.pageX, event.pageY);
            });
        } else {
            initRatio = container.dataset.separate_position;
            var sepIcon = container.querySelector(".tpgb-before-sepicon");
            if (configType == "horizontal") {
                if(sepIcon){ sepIcon.style.left = initRatio + "%"; }
            } else if (configType == "vertical") {
                if(sepIcon){ sepIcon.style.top = initRatio + "%"; }
            }
            var beforeImg = container.querySelector(".tpgb-beforeafter-img");
            beforeImg.style.position = "absolute";
            if(sepIcon){ sepIcon.style.display = "block"; }
            container.querySelector(".tpgb-beforeafter-inner").addEventListener("mouseout", function(event) {
                show_separator_image();
                position_changing(event.pageX, event.pageY);
            });
        }

        if (container.dataset.separate_switch == 'no') {
            if(container.querySelector(".tpgb-bottom-sep")){ container.querySelector(".tpgb-bottom-sep").style.display = "none"; }
            if(container.querySelector(".tpgb-beforeafter-sep")){ container.querySelector(".tpgb-beforeafter-sep").style.display = "none"; }
            if(container.querySelector(".tpgb-before-sepicon")){ container.querySelector(".tpgb-before-sepicon").style.display = "none"; }
        }

        // Add event listeners for touch events
        if (configType != "show") {
            container.addEventListener("touchstart", function(event) {
                event.preventDefault();
                setba_Container(this);
                TouchDevice = true;
                changing_this = true;
            }, { passive: false });
            container.addEventListener("touchend", function() {
                // var sep = document.querySelector(".tpgb-before-after").querySelector(".tpgb-beforeafter-sep");
                changing_this = false;
                show_separator_image();
            });
            container.addEventListener("touchcancel", function() {
                // var sep = document.querySelector(".tpgb-before-after").querySelector(".tpgb-beforeafter-sep");
                changing_this = false;
                show_separator_image();
            });
        }

        // Add event listeners for click, hover, move
        if (container.dataset.click_hover_move == 'yes') {
            container.querySelectorAll(".tpgb-beforeafter-inner, .tpgb-bottom-sep").forEach(function(item) {
                item.addEventListener("mouseover", function(event) {
                    setba_Container(this);
                    if (Playing_this) return;
                    changing_this = true;
                    // var pos;
                    // if (ba_type == "horizontal") {
                    //     pos = event.pageX - ba_Container.offsetLeft;

                    //     // console.log(ba_Container.offsetLeft);

                    //     // this.querySelector(".tpgb-beforeafter-sep").style.left = (pos - (sep_Size / 2)) + "px";
                    //     this.querySelector(".tpgb-before-img").style.width = pos + "px";
                    //     container.querySelector(".tpgb-beforeafter-inner").style.cursor = "ew-resize";
                    // } else if (ba_type == "vertical") {
                    //     pos = event.pageY - ba_Container.offsetTop - (sep_Size / 2);
                    //     // this.querySelector(".tpgb-beforeafter-sep").style.top = pos + "px";
                    //     this.querySelector(".tpgb-before-img").style.height = pos + "px";
                    //     container.querySelector(".tpgb-beforeafter-inner").style.cursor = "ns-resize";
                    // } else if (ba_type == "cursor") {
                    //     // pos = event.pageX - ba_Container.offsetLeft;
                    //     // this.querySelector(".tpgb-beforeafter-sep").style.left = (pos - (indSize / 2)) + "px";
                    // }
                });
                item.addEventListener("mouseout", function(event) {
                    position_changing(event.pageX, event.pageY);
                    changing_this = false;
                });
            });
        } else {
            container.querySelectorAll(".tpgb-beforeafter-inner, .tpgb-bottom-sep").forEach(function(item) {
                item.addEventListener("mousedown", function(event) {
                    if (TouchDevice) return;
                    if (ba_sep_obj && ba_sep_show) ba_sep_obj.style.display = "block";
                    setba_Container(this);
                    var parent_class = this.closest(".tpgb-before-after");
                    var parent_attr = parent_class.dataset.id;
                    onMouseMove(event.pageX, event.pageY, parent_attr);
                });
                item.addEventListener("mouseenter", function(event) {
                    if (ba_sep_obj && ba_sep_show) ba_sep_obj.style.display = "block";
                    setba_Container(this);
                    if (!event.which) {
                        changing_this = false;
                        return;
                    }
                });
                item.addEventListener("mouseup", function() {
                    changing_this = false;
                });
            });

            container.querySelectorAll(".tpgb-beforeafter-sep, .tpgb-before-sepicon").forEach(function(item) {
                item.addEventListener("mousedown", function(event) {
                    if (TouchDevice) return;
                    setba_Container(this);
                    changing_this = true;
                });
                item.addEventListener("mouseover", function(event) {
                    setba_Container(this);
                });
                item.addEventListener("mouseup", function() {
                    changing_this = false;
                });
            });

            container.querySelectorAll(".tpgb-beforeafter-inner, .tpgb-bottom-sep").forEach(function(item) {
                item.addEventListener("mouseup", function() {
                    changing_this = false;
                });
            });
        }

        container.querySelectorAll(".tpgb-beforeafter-inner").forEach(function(item) {
            item.addEventListener("mousedown", function(event) {
                if (TouchDevice) return;
                setba_Container(this);
                stop_animation();
            });
        });
    });

    size_Elements();

    window.addEventListener('resize', function() {
        size_Elements();
    });
}

var ba_Container;
var ba_ContainerId = 0;
var ba_obj;
var ba_sep_obj;
var ba_sep_Image;
var before_obj;
var after_obj;
var beforeImage;
var afterImage;
var ba_type;
var ba_sep_show;
var ba_show_mode;
var changing_this = false;
var Playing_this = false;
var sep_Size;
var indSize = 10;
var fpsPlay = 60;
var TouchDevice = false;

function setba_Container(objFrom) {
    container = objFrom.closest(".tpgb-before-after");
    containerId = container.dataset.id;
    hide_separator_image(container);
    if (ba_Container && ba_ContainerId == containerId) return;
    if (Playing_this) {
        stop_animation();
        if (ba_sep_show) ba_sep_obj.style.display = "block";
    }
    ba_Container = container;
    ba_ContainerId = containerId;
    ba_sep_obj = ba_Container.querySelector(".tpgb-beforeafter-sep");
    ba_obj = ba_Container.querySelector(".tpgb-beforeafter-inner");
    before_obj = ba_Container.querySelector(".tpgb-before-img");
    after_obj = ba_Container.querySelector(".tpgb-after-img");
    beforeImage = ba_Container.querySelector(".tpgb-before-img > img");
    afterImage = ba_Container.querySelector(".tpgb-after-img > img");
    ba_type = ba_Container.dataset.type;
    ba_sep_show = true;
    if (ba_Container.dataset.separate_switch == 'no'){
        ba_sep_show = false;
        if(ba_sep_obj){
            if (ba_sep_show == true) ba_sep_obj.style.display = "block";
            else ba_sep_obj.style.display = "none";
        }
    }
}

function play_animation(curPx, deltaPx, x, y, sizePx, frameDelay) {
    if (!Playing_this) return;
    curPx += deltaPx;
    if (ba_type == "vertical")
        onMouseMove(x, y + curPx);
    else onMouseMove(x + curPx, y);
    if (curPx <= sizePx + 1) setTimeout(play_animation, frameDelay, curPx, deltaPx, x, y, sizePx, frameDelay);
    else stop_animation();
}

function stop_animation() {
    if (!Playing_this) return;
    Playing_this = false;
    changing_this = true;
    if(ba_sep_obj){ ba_sep_obj.style.display = "none" };
}
function onMouseMove(x, y, parent_attr) {
    if (changing_this && ba_sep_show) {
        if(ba_sep_obj){ ba_sep_obj.style.display = "block" };
    }
    if (position_changing(x, y)) {
        return;
    }
    var container_class = document.querySelector("." + parent_attr);
    sep_Size = container_class.dataset.separate_width;
    if (ba_type == "horizontal") {
        var containerRect = ba_Container.getBoundingClientRect();
        var pos = x - containerRect.left;
        if (pos >= ba_obj.offsetWidth) {
            pos = ba_obj.offsetWidth;
        }
        if(ba_sep_obj){ ba_sep_obj.style.left = (pos - (sep_Size / 2)) + "px"; }
        if (ba_show_mode != 0 && ba_sep_Image) {
            ba_sep_Image.style.left = pos + "px";
        }
        before_obj.style.width = pos + "px";
        var before_label = before_obj.querySelector('.tpgb-beforeafter-label.before-label');
        if(before_label){
            if (before_label.offsetWidth + 50 < pos) {
                before_label.style.opacity = '1';
            } else {
                before_label.style.opacity = '0';
            }
        }
    } else if (ba_type == "vertical") {
        var containerRect = ba_Container.getBoundingClientRect();
        var containerTop = containerRect.top + window.pageYOffset;
        var mouseY = y - containerTop;
        // var pos = y - containerRect.top - (sep_Size / 2);
        // if (pos >= ba_obj.offsetHeight) {
        //     pos = ba_obj.offsetHeight;
        // }
        // ba_sep_obj.style.top = pos + "px";
        // if (ba_show_mode != 0) {
        //     ba_sep_Image.style.top = pos + "px";
        // }
        // before_obj.style.height = pos + "px";
        // var before_label = before_obj.querySelector('.tpgb-beforeafter-label.before-label');
        // var rat = ba_obj.offsetHeight / pos;
        // if (rat < 2) {
        //     before_label.style.opacity = '1';
        // } else {
        //     before_label.style.opacity = '0';
        // }


        var pos = mouseY;
        if (pos >= ba_obj.offsetHeight) {
            pos = ba_obj.offsetHeight;
        } else if (pos <= 0) {
            pos = 0;
        }
        if(ba_sep_obj) ba_sep_obj.style.top = (pos - (sep_Size / 2)) + "px";
        if (ba_show_mode != 0) {
            ba_sep_Image.style.top = pos + "px";
        }
        before_obj.style.height = pos + "px";
        var before_label = before_obj.querySelector('.tpgb-beforeafter-label.before-label');
        var rat = ba_obj.offsetHeight / pos;
        if(before_label){
            if (rat < 2) {
                before_label.style.opacity = '1';
            } else {
                before_label.style.opacity = '0';
            }
        }
    } else if (ba_type == "cursor") {
        var pos = x - ba_Container.getBoundingClientRect().left;
        if (pos >= ba_obj.offsetWidth) {
            pos = ba_obj.offsetWidth;
        }
        if(ba_sep_obj) ba_sep_obj.style.left = (pos - (indSize / 2)) + "px";
        var rat = pos / ba_obj.offsetWidth;
        beforeImage.style.opacity = 1 - rat;
        var before_label = before_obj.querySelector('.tpgb-beforeafter-label.before-label');
        if(before_label){
            if ((1 - rat) > 0.3) {
                before_label.style.opacity = '1';
            } else {
                before_label.style.opacity = '0';
            }
        }
    }
}

function size_Elements() {
    var imgs = document.querySelectorAll(".tpgb-beforeafter-img > img");
    imgs.forEach(function(img) {
        // img.onload = function() {
            var container = img.closest(".tpgb-before-after");
            var style = container.dataset.type;
            if (style == "show") return;
            img.style.minWidth = "none";
            img.style.maxWidth = "none";
            var sbsShrinked = false;
            if (container.dataset.responsive == "yes") {
                var p = container.parentElement;
                var parentWidth = p.offsetWidth;
                while (!p || parentWidth == 0) {
                    p = p.parentElement;
                    parentWidth = p.offsetWidth;
                }
                if (!img.style.maxWidth || img.style.maxWidth == "none" && container.dataset.full_width == "yes") {
                    img.style.maxWidth = parentWidth + "px";
                } else if (!img.style.maxWidth || img.style.maxWidth == "none") {
                    img.style.maxWidth = (img.naturalWidth ? img.naturalWidth : 100) + "px";
                }
                if (container.dataset.full_width == "yes") {
                    img.style.width = parentWidth + "px";
                } else {
                    img.style.width = (img.naturalWidth ? img.naturalWidth : 100) + "px";
                }
            }
            if (container.dataset.width && container.dataset.width!=0) {
                img.style.width = container.dataset.width;
            }
            if (container.dataset.max_width && container.dataset.max_width!=0) {
                img.style.maxWidth = container.dataset.max_width;
            }
            initRatio = container.dataset.separate_position / 100;
            if ((img.classList.contains('tpgb-beforeimg-wrap') && style != "vertical") || img.classList.contains('tpgb-afterimg-wrap')) {
                img.style.height = "100%";
            }
            if (img.classList.contains('tpgb-beforeimg-wrap')) {
                container.style.visibility = "visible";
                // var width = img.offsetWidth;
                // var height = img.offsetHeight;
                    var width = (img.offsetWidth !=0 ) ? img.offsetWidth : img.naturalWidth;
            var height = (img.offsetHeight !=0 ) ? img.offsetHeight : img.naturalHeight;
                container.querySelector(".tpgb-beforeafter-img").style.width = "auto";
                container.querySelector(".tpgb-beforeafter-img").style.height = "100%";
                container.querySelector(".tpgb-beforeafter-inner").style.width = width + "px";
                container.querySelector(".tpgb-beforeafter-inner").style.height = height + "px";
                // container.querySelector(".tpgb-bottom-sep").style.width = width + "px";
                container.style.width = width + "px";
                if (style == "horizontal") {
                    container.querySelector(".tpgb-before-img").style.width = (img.offsetWidth * initRatio) + "px";
                } else if (style == "vertical") {
                    container.querySelector(".tpgb-before-img").style.height = (img.offsetHeight * initRatio) + "px";
                }
                var separator = container.querySelector(".tpgb-beforeafter-sep");
                if (style == "horizontal") {
                    if (container.dataset.separator_style == 'middle') {
                        sep_Size = container.dataset.separate_width;
                        separator.style.width = sep_Size + "px";
                        separator.style.height = img.offsetHeight + "px";
                        var sp = container.querySelector(".tpgb-before-img").offsetWidth - sep_Size / 2;
                        separator.style.left = sp + "px";
                        separator.style.cursor = "ew-resize";
                    } else {
                        sep_Size = container.dataset.separate_width;
                        separator.style.height = sep_Size + "px";
                        separator.style.width = "15px";
                        separator.style.left = (img.offsetWidth * initRatio) + 'px';
                        var h = container.querySelector(".tpgb-before-img").offsetHeight;
                        separator.style.top = h + "px";
                        separator.style.cursor = "ew-resize";
                        if( container.querySelector(".tpgb-bottom-sep") ){
                            container.querySelector(".tpgb-bottom-sep").style.height = sep_Size + "px";
                            container.querySelector(".tpgb-bottom-sep").style.display = "block";
                        }
                        
                    }
                } else if (style == "vertical") {
                    if (container.dataset.separator_style == 'middle') {
                        sep_Size = container.dataset.separate_width;
                        separator.style.height = sep_Size + "px";
                        separator.style.width = img.offsetWidth + "px";
                        var sp = container.querySelector(".tpgb-before-img").offsetHeight - sep_Size / 2;
                        separator.style.top = sp + "px";
                        separator.style.cursor = "ns-resize";
                    }
                } else if (style == "cursor") {
                    if (container.dataset.separate_switch == 'yes') {
                        sep_Size = container.dataset.separate_width;
                        var h = container.querySelector(".tpgb-before-img").offsetHeight;
                        if( container.querySelector(".tpgb-bottom-sep") ){
                            container.querySelector(".tpgb-bottom-sep").style.display = "block";
                        }
                    }
                }
            }
        // }
    });
}

function hide_separator_image(container) {
    ba_sep_Image = container.querySelector(".tpgb-before-sepicon");
    ba_show_mode = 0;
    if (container.dataset.separate_image)
        ba_show_mode = container.dataset.separate_image;
}

function show_separator_image() {
    if (ba_show_mode == 1 && ba_sep_Image) {
        ba_sep_Image.style.display = "block";
    }
}

function full_After() {
    w = ba_obj.offsetWidth - indSize;
    if(ba_sep_obj) ba_sep_obj.style.left = w + "px";
    beforeImage.style.opacity = "0";
}

function zero_After() {
    if(ba_sep_obj) ba_sep_obj.style.left = "0px";
    beforeImage.style.opacity = "1";
}

function position_changing(pageX, pageY) {
    if (!(changing_this || Playing_this)) return false;
    if (Playing_this) return false;
    aligned = false;
    if (ba_type == "horizontal") {
        var Id = document.querySelector("." + containerId).getBoundingClientRect();
        var abc = Id.left;
        if (pageX >= ba_obj.offsetWidth + abc) {
            sep_Right();
            aligned = true;
        } else if (pageX <= abc) {
            sep_Left();
            aligned = true;
        }
    } else if (ba_type == "vertical") {
        var containerRect = document.querySelector("." + containerId).getBoundingClientRect();
        var abc = containerRect.top + window.pageYOffset;
        if (pageY >= ba_obj.offsetHeight + abc) {
            sep_Bottom();
            aligned = true;
        } else if (pageY <= abc) {
            sep_Top();
            aligned = true;
        }
    } else if (ba_type == "cursor") {
        if (pageX + indSize / 2 >= ba_obj.offsetWidth + ba_Container.getBoundingClientRect().left) {
            full_After();
            aligned = true;
        } else if (pageX - indSize / 2 <= ba_Container.getBoundingClientRect().left) {
            zero_After();
            aligned = true;
        }
    }
    if (aligned && ba_type != "cursor") {
        if (!Playing_this)
            if(ba_sep_obj)  ba_sep_obj.style.display = "none";
    }
    return aligned;
}

function sep_Right() {
    var w = ba_obj.offsetWidth;
    if(ba_sep_obj) ba_sep_obj.style.left = (w - (sep_Size / 2)) + "px";
    if (ba_show_mode != 0 && ba_sep_Image) {
        ba_sep_Image.style.left = w + "px";
    }
    before_obj.style.width = w + "px";
}

function sep_Left() {
    if(ba_sep_obj)  ba_sep_obj.style.left = "0px";
    if (ba_show_mode != 0 && ba_sep_Image) {
        ba_sep_Image.style.left = "0px";
    }
    before_obj.style.width = "0px";
}

function sep_Top() {
    if(ba_sep_obj) ba_sep_obj.style.top = (-sep_Size / 2) + "px";
    if (ba_show_mode != 0 && ba_sep_Image) {
        ba_sep_Image.style.top = "0px";
    }
    before_obj.style.height = "0px";
}

function sep_Bottom() {
    var h = ba_obj.offsetHeight;
    if(ba_sep_obj) ba_sep_obj.style.top = (h - (sep_Size / 2)) + "px";
    if (ba_show_mode != 0 && ba_sep_Image) {
        ba_sep_Image.style.top = h + "px";
    }
    before_obj.style.height = h + "px";
}

document.addEventListener('mousemove', function(event) {
    var container = event.target.closest(".tpgb-before-after");
    if (!container) return;
    var containerId = container.dataset.id;
    var parent_attr = containerId;
    if (changing_this && !Playing_this) {
        onMouseMove(event.pageX, event.pageY, parent_attr);
    }
});

document.addEventListener('touchmove', function(event) {
    event.preventDefault();
    var touch = event.touches[0] || event.changedTouches[0];
    var container = touch.target.closest(".tpgb-before-after");
    if (!container) return;
    var containerId = container.dataset.id;
    var parent_attr = containerId;
    if (changing_this && !Playing_this) {
        onMouseMove(touch.pageX, touch.pageY, parent_attr);
    }
});