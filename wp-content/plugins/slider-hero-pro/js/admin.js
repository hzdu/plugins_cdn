function openCity(evt, cityName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}

function qcheroOffset(elem) {
    function isWindow(obj) {
        return obj != null && obj === obj.window;
    }

    function getWindow(elem) {
        return isWindow(elem) ? elem : elem.nodeType === 9 && elem.defaultView;
    }

    var docElem, win,
        box = {top: 0, left: 0},
        doc = elem && elem.ownerDocument;

    docElem = doc.documentElement;

    if (typeof elem.getBoundingClientRect !== typeof undefined) {
        box = elem.getBoundingClientRect();
    }
    win = getWindow(doc);
    return {
        top: box.top + win.pageYOffset - docElem.clientTop,
        left: box.left + win.pageXOffset - docElem.clientLeft
    };
}
function qcheroDiffer(elem1, elem2) {
    return qcheroOffset(elem1).left - qcheroOffset(elem2).left;
}



/**###POPUPS###**/
function qcheroPopups(overlay, popup) {
    var overlay = overlay;
    var popup = popup;

    this.show = function () {
        document.getElementById(overlay) && (document.getElementById(overlay).style.display = 'block');
        document.getElementById(popup) && (document.getElementById(popup).style.display = 'block');
    }
    this.hide = function () {
        document.getElementById(overlay) && (document.getElementById(overlay).style.display = 'none');
        document.getElementById(popup) && (document.getElementById(popup).style.display = 'none');
    };
}

var qcheroPopupPreview = new qcheroPopups('qchero_slider_preview_popup', 'qchero_slider_preview');
var qcheroPopupTitle = new qcheroPopups('qchero_slider_preview_popup', 'qchero_slider_title_styling');
var qcheroPopupDescription = new qcheroPopups('qchero_slider_preview_popup', 'qchero_slider_description_styling');
var qcheroPopupCustom;

/*** create slidinf custom popups ***/


/**###POPUPS CLOSE###**/
document.onkeydown = function (evt) {
    evt = evt || window.event;
    if (evt.keyCode == 27) {
        qcheroPopupPreview.hide();
        qcheroPopupTitle.hide();
        qcheroPopupDescription.hide();
        if (qcheroPopupCustom) qcheroPopupCustom.hide();
        if (_qchero._('.qchero_slider_container_preview')[0]) {
            _qchero(_qchero._('.qchero_slider_container_preview')[0]).parent().removeChild(_qchero._('.qchero_slider_container_preview')[0]);
        }
    }
};


(function ($) {
    $(function () {
        /***  preview ***/

        jQuery("body").on("click", '.qchero_close,#qchero_slider_preview_popup', function () {
            qcheroPopupPreview.hide();
            qcheroPopupTitle.hide();
            qcheroPopupDescription.hide();
            if (qcheroPopupCustom) qcheroPopupCustom.hide();
            if (_qchero._('.qchero_slider_container_preview')[0]) {
                _qchero(_qchero._('.qchero_slider_container_preview')[0]).parent().removeChild(_qchero._('.qchero_slider_container_preview')[0]);
            }
            return false;
        });

        jQuery("#qchero_slide_edit > .close").click(function () {
            jQuery(this).parent().css('display', 'none');
        });

        /****     menu slider settings ***/

        jQuery('#qchero_slider_edit .settings  .menu ul > li a').click(function () {
            var menu_setting = jQuery(this).parent().attr('rel');
            jQuery('#qchero_slider_edit .settings  .menu ul > li a').removeClass('active');
            jQuery(this).addClass('active');
            jQuery('#qchero_slider_edit .settings .menu-content ul li').removeClass('active');
            jQuery('#qchero_slider_edit .settings .menu-content ul li.' + menu_setting).addClass('active');
            return false;

        });

        /***validation****/
        jQuery('#general-settings input[type="number"],#bullet-settings input[type="number"],.qchero-styling  input[type="number"]').on('keyup change', function () {
            var value = jQuery(this).val();
            value = Math.abs(value);
            jQuery(this).val(value);
        });
        jQuery('#general-settings input[type="checkbox"]').on('change', function () {
            var prop = jQuery(this).prop('checked');
            (prop) ? jQuery(this).val(1) : jQuery(this).val(0);
        });
		jQuery('#display-setting input[type="checkbox"]').on('change', function () {
            var prop = jQuery(this).prop('checked');
            (prop) ? jQuery(this).val(1) : jQuery(this).val(0);
        });

        /*** slider general options ***/
        jQuery('#qchero-autoplay').on('change', function () {
            jQuery(this).attr('checked') ? jQuery(this).val(1) : jQuery(this).val(0);
            qcheroGetSliderParams();
        });
        
        jQuery('#qchero-pauseonhover').on('change', function () {
            jQuery(this).attr('checked') ? jQuery(this).val(1) : jQuery(this).val(0);
            qcheroGetSliderParams();
        });
        
        jQuery('#qchero-right-click-protection').on('change', function () {
            jQuery(this).attr('checked') ? jQuery(this).val(1) : jQuery(this).val(0);
            qcheroGetSliderParams();
        });
        
        jQuery('#qchero-slide-image_link_new_tab').on('change', function () {
            jQuery(this).attr('checked') ? jQuery(this).val(1) : jQuery(this).val(0);
        });

        jQuery('#qchero-behavior').on('change', function () {
            var value = jQuery(this).find(":selected").val();
            jQuery('#qchero-behavior + input').val(value);
        });
        
        _qchero._('#qchero-effect-type').on('change', function () {
            var value = _qchero(this).value;
            _qchero._('#qchero-effect-type + input')[0].value = value;
        });
        _qchero._('#qchero-custom').on('change', function () {
            var value = _qchero(this).value;
            _qchero._('#qchero-custom-type').value = value;
            _qchero(_qchero._('#qchero-custom-add')).addAttr('data', value);
        });

        /*** arrow settings ***/
        jQuery('#qchero-arrows-background input[type="radio"]').on('change', function () {
            if (jQuery(this).attr('checked')) {
                jQuery('#params-arrows-type').val(jQuery(this).attr('rel'));
                qcheroGetSliderParams();
            }
        });

        /*** bullets settings ***/
        jQuery('#qchero-bullets-position input[type="radio"]').on('change', function () {

            if (jQuery(this).attr('checked')) {
                jQuery('#params-bullets-position').val(jQuery(this).attr('rel'));
                qcheroGetSliderParams();
            }
        });


    });
})(jQuery);

/***  get slider styles ***/
function qcheroGetSliderStyles() {
    jQuery('#general-settings li input[name^="style"]').each(function () {
        var param = jQuery(this).attr('name');
        param = param.replace('style[', '');
        param = param.replace(']', '');
        qcheror["style"][param] = jQuery(this).val();
    });
    qcheroGetSliderMainOptions();
    qcheroGetSliderParams();
    //jQuery('#qchero-slider-construct').width(qcheror['style']['width']);
    //jQuery('#qchero-slider-construct').height(qcheror['style']['height']);
    //jQuery('#qchero-slider-construct .qchero_construct').css('max-width', qcheror['style']['width'] + 'px');
    //jQuery('#qchero-slider-construct .qchero_construct').css('max-height', qcheror['style']['height'] + 'px');
	//console.log(qcheror);
}
function qcheroGetSliderMainOptions() {
    jQuery('#general-settings li input[name^="cs["]').each(function () {
        var param = jQuery(this).attr('name');
        param = param.replace('cs[', '');
        param = param.replace(']', '');
        qcheror[param] = jQuery(this).val();
    });
	
    jQuery('.othersetting input[name^="cs["]').each(function () {
        var param = jQuery(this).attr('name');
        param = param.replace('cs[', '');
        param = param.replace(']', '');
        qcheror[param] = jQuery(this).val();
    });
    jQuery('.othersetting textarea[name^="cs["]').each(function () {
        var param = jQuery(this).attr('name');
		
        param = param.replace('cs[', '');
        param = param.replace(']', '');
        qcheror[param] = jQuery(this).val();
    });
	
}
function qcheroGetSliderParams(custom) {

    var params = custom || 'params';
	
    _qchero.each('.main-content .' + params + ' input[name^="' + params + '"]', function () {
        $this = _qchero(this);
        if (($this.getAttr('type') == 'radio') && (!$this.checked))
            return;
        var param = $this.getAttr('name');

        	
        var currentvalue = jQuery($this).val();
        	//console.log(param,currentvalue);
        param = param.replace(params + '[', '');
        param = param.replace(']', '');
        param = param.replace(']', '');
        param = param.replace(']', '');
        param = param.replace(']', '');
        param = param.replace(']', '');
        param = param.split('[');

        //param = param.split(target).join(replacement);

        currentvalue = (IsJsonString(currentvalue)) ? JSON.parse(currentvalue) : currentvalue;
		
        
        
		if (param.length == 1)
            qcheror[params][param] = currentvalue;
        else if (param.length == 2) {
            qcheror[params][param[0]][param[1]] = currentvalue;
        }
        else if (param.length == 3) {
            	//console.log(param);
            qcheror[params][param[0]][param[1]][param[2]] = currentvalue;
        }
        else if (param.length == 4) {
            //console.log(param);
            qcheror[params][param[0]][param[1]][param[2]][param[3]] = currentvalue;
        }
        else if (param.length == 5) {
            //	console.log(param);
            qcheror[params][param[0]][param[1]][param[2]][param[3]][param[4]] = currentvalue;
        }
    });
	    _qchero.each('.main-content .' + params + ' select[name^="' + params + '"]', function () {
        $this = _qchero(this);
        if (($this.getAttr('type') == 'radio') && (!$this.checked))
            return;
        var param = $this.getAttr('name');

        	//console.log('param',param);
        var currentvalue = jQuery($this).val();
        //	console.log(param,currentvalue);
        param = param.replace(params + '[', '');
        param = param.replace(']', '');
        param = param.replace(']', '');
        param = param.replace(']', '');
        param = param.replace(']', '');
        param = param.replace(']', '');
        param = param.split('[');

        //param = param.split(target).join(replacement);

        currentvalue = (IsJsonString(currentvalue)) ? JSON.parse(currentvalue) : currentvalue;
        //console.log(param);
        if (param.length == 1)
            qcheror[params][param] = currentvalue;
        else if (param.length == 2) {
            qcheror[params][param[0]][param[1]] = currentvalue;
        }
        else if (param.length == 3) {
            //	console.log(param);
            qcheror[params][param[0]][param[1]][param[2]] = currentvalue;
        }
        else if (param.length == 4) {
            //console.log(param);
            qcheror[params][param[0]][param[1]][param[2]][param[3]] = currentvalue;
        }
        else if (param.length == 5) {
            //	console.log(param);
            qcheror[params][param[0]][param[1]][param[2]][param[3]][param[4]] = currentvalue;
        }
    });
	 _qchero.each('.main-content .' + params + ' textarea[name^="' + params + '"]', function () {
        $this = _qchero(this);
        if (($this.getAttr('type') == 'radio') && (!$this.checked))
            return;
        var param = $this.getAttr('name');

        	//console.log('param',param);
        var currentvalue = jQuery($this).val();
        //	console.log(param,currentvalue);
        param = param.replace(params + '[', '');
        param = param.replace(']', '');
        param = param.replace(']', '');
        param = param.replace(']', '');
        param = param.replace(']', '');
        param = param.replace(']', '');
        param = param.split('[');

        //param = param.split(target).join(replacement);

        currentvalue = (IsJsonString(currentvalue)) ? JSON.parse(currentvalue) : currentvalue;
        //console.log(param);
        if (param.length == 1)
            qcheror[params][param] = currentvalue.replace(/'/g, "#");
        else if (param.length == 2) {
            qcheror[params][param[0]][param[1]] = currentvalue.replace(/'/g, "#");
        }
        else if (param.length == 3) {
            //	console.log(param);
            qcheror[params][param[0]][param[1]][param[2]] = currentvalue.replace(/'/g, "#");
        }
        else if (param.length == 4) {
            //console.log(param);
            qcheror[params][param[0]][param[1]][param[2]][param[3]] = currentvalue.replace(/'/g, "#");
        }
        else if (param.length == 5) {
            //	console.log(param);
            qcheror[params][param[0]][param[1]][param[2]][param[3]][param[4]] = currentvalue.replace(/'/g, "#");
        }
    });
	
	var screenoption = jQuery('input[name="style[fullwidth]"]:checked').val();
	qcheror['style']['screenoption'] = screenoption;
	//console.log(qcheror);
}

function qcheroGetSlideParams(slide) {
    var params = 'custom';// || 'params';
    //	alert(0);
    _qchero.each('.main-content .' + params + ' input[name^="' + params + '"]', function () {//alert(1);
        $this = _qchero(this);
        if (($this.getAttr('type') == 'radio') && (!$this.checked))
            return;
        var param = $this.getAttr('name');
        var currentvalue = jQuery($this).val();
        param = param.replace(params + '[', '');
        param = param.replace(']', '');
        param = param.replace(']', '');
        param = param.replace(']', '');
        param = param.replace(']', '');
        param = param.replace(']', '');
        param = param.split('[');


        currentvalue = (IsJsonString(currentvalue)) ? JSON.parse(currentvalue) : currentvalue;
        //console.log(param);
        if (param.length == 1)
            qcheror['slides'][slide][params][param] = currentvalue;
        else if (param.length == 2) {
            qcheror['slides'][slide][params][param[0]][param[1]] = currentvalue;
        }
        else if (param.length == 3) {
            //	console.log(param);
            qcheror['slides'][slide][params][param[0]][param[1]][param[2]] = currentvalue;
        }
        else if (param.length == 4) {
            //console.log(param);
            qcheror['slides'][slide][params][param[0]][param[1]][param[2]][param[3]] = currentvalue;
        }
        else if (param.length == 5) {
            //	console.log(param);
            qcheror['slides'][slide][params][param[0]][param[1]][param[2]][param[3]][param[4]] = currentvalue;
        }
    });
    var slidetitle = _qchero(_qchero._('#qchero-slide-title')).val();
    var slidedescription = _qchero(_qchero._('#qchero-slide-description')).val();
    var slideimage_link = _qchero(_qchero._('#qchero-slide-image_link')).val();
    var slideimage_link_new_tab = _qchero(_qchero._('#qchero-slide-image_link_new_tab')).val();
    qcheror['slides'][slide]['title'] = slidetitle;
    qcheror['slides'][slide]['description'] = slidedescription;
    qcheror['slides'][slide]['image_link'] = slideimage_link;
    qcheror['slides'][slide]['image_link_new_tab'] = slideimage_link_new_tab;

}


/****    styling   ***/


function qcheroSetCustomFieldStyles(field, element) {
    if (arguments.length < 2) {
        var params = 'params';
    }
    else params = 'custom';

    if (!getparamsFromUrl('slideid', location.href)) {
        var styleFor = qcheror[params][field];
    }
    else {
        var styleFor = qcheror['slides']['slide' + getparamsFromUrl('slideid', location.href)][params][field];
    }

    jQuery('#qchero_slider_' + field + '_styling').find('.qchero_' + (element || field)).outerWidth(parseFloat(styleFor['style']['width']));
    jQuery('#qchero_slider_' + field + '_styling').find('.qchero_' + (element || field)).outerHeight(parseFloat(styleFor['style']['height']));


}
function qcheroDrawCustomFieldStyles(field) {
    var field = field;

    function createCssJson(name, value, direction) {
        var name = name.split('[style]');
        var style;
        var direction = (direction == "0") ? "" : direction;
        style = (direction == "#") ? ('"' + direction + value + '"') : ('"' + value + direction + '"');
        name = name[1];
        param = name;
        param = param.ReslideReplaceAll('][', '-');
        param = param.replace('][', '-');
        param = param.replace(']', '');
        param = param.replace(']', '');
        param = param.replace('[', '');
        param = param.replace('[', '');
        param = param.replace('[', '');
        param = param.split('[');
        param = '"' + param.toString() + '"';
        direction = "";
        param = "{" + param + ":" + style + "}";
        return param;
    }

    if (arguments.length < 2) {
        jQuery('#qchero_slider_' + field + '_styling .params input[name^="params"]').on('change', function () {

            var css = createCssJson(jQuery(this).attr('name'), jQuery(this).val(), jQuery(this).attr('rel'));

            jQuery('#qchero_slider_' + field + '_styling ' + '.qchero_' + field).css(JSON.parse(css));
            jQuery('#qchero_slider_' + field + '_styling ' + '.qchero_' + field + '_child').css(JSON.parse(css));
            var opacity = jQuery('#qchero_slider_' + field + '_styling ' + '#params-' + field + '-background-opacity').val();
            var borderRadius = jQuery('#qchero_slider_' + field + '_styling ' + '#params-' + field + '-background-opacity').val();
            opacity = opacity / 100;
            jQuery('#qchero_slider_' + field + '_styling ' + '.qchero_' + field).css('opacity', '1');
            jQuery('#qchero_slider_' + field + '_styling ' + '.qchero_' + field).css('background', 'none');
            jQuery('#qchero_slider_' + field + '_styling ' + '.qchero_' + field + '_child').css('opacity', opacity);

        })
    }
    else {
        _qchero._('#qchero_slider_' + field + '_styling .custom input[name^="custom"]').on('change', function () {
            var css = createCssJson(jQuery(this).attr('name'), jQuery(this).val(), jQuery(this).attr('rel'));

            jQuery('#qchero_slider_' + field + '_styling ' + '.qchero_custom').css(JSON.parse(css));
            jQuery('#qchero_slider_' + field + '_styling ' + '.qchero_custom').css('overflow', 'hidden');
            jQuery('#qchero_slider_' + field + '_styling ' + '.qchero_custom_child').css(JSON.parse(css));
            jQuery('#qchero_slider_' + field + '_styling ' + '.qchero_custom_child').css('border-radius', '0');
            jQuery('#qchero_slider_' + field + '_styling ' + '.qchero_custom_child').css('border-width', '0');
            var opacity = jQuery('#qchero_slider_' + field + '_styling ' + '#custom-background-opacity').val();
            var borderRadius = jQuery('#qchero_slider_' + field + '_styling ' + '#custom-background-opacity').val();
            opacity = opacity / 100;
            jQuery('#qchero_slider_' + field + '_styling ' + '.qchero_custom').css('opacity', '1');
            jQuery('#qchero_slider_' + field + '_styling ' + '.qchero_custom').css('background', 'none');
            jQuery('#qchero_slider_' + field + '_styling ' + '.qchero_custom_child').css('opacity', opacity);
            jQuery('#qchero_slider_' + field + '_styling ' + '.img').css('opacity', opacity);

        })
    }
}


var initDifferX, initDifferY, moveCondition = {type: ''};


(function ($) {
    $(function () {
        /***title styling ***/
        if (document.getElementById('qchero-title-stylings')) {
            document.getElementById('qchero-title-stylings').addEventListener('click', function () {
                qcheroGetSliderParams();
                qcheroSetCustomFieldStyles('title');
                qcheroDrawCustomFieldStyles('title');
                qcheroPopupTitle.show();
                _qcherorjscolor();
            });
        }
        /***title styling ***/
        /***description styling ***/
        if (document.getElementById('qchero-description-stylings')) {

            document.getElementById('qchero-description-stylings').addEventListener('click', function () {
                qcheroGetSliderParams();
                qcheroSetCustomFieldStyles('description')
                qcheroDrawCustomFieldStyles('description');
                qcheroPopupDescription.show();
                _qcherorjscolor();
            })
        }
        if (document.getElementById('qchero-custom-stylings')) {
            document.getElementById('qchero-custom-stylings').addEventListener('click', function (e) {
                var type = _qchero(_qchero._('#qchero-custom-type')).val();
                var arr = {'image': 'img', 'text': 'h3', 'youtube': 'iframe', 'button': 'button'};
                type = arr[type];

                var idstyle = _qchero(e.currentTarget).getAttr('data');
                if (idstyle == 'title' || idstyle == 'description')
                    return;

                qcheroPopupCustom = new qcheroPopups('qchero_slider_preview_popup', 'qchero_slider_' + idstyle + '_styling');
                if (!getparamsFromUrl('slideid', location.href))
                    qcheroGetSliderParams('custom');
                else
                    qcheroGetSlideParams('slide' + getparamsFromUrl('slideid', location.href));
                qcheroSetCustomFieldStyles(idstyle, type)
                qcheroDrawCustomFieldStyles(idstyle, true);
                qcheroPopupCustom.show();

            });
        }


        /*** for define current move + resize element ***/

        var csconstruct = document.getElementsByClassName('qchero_construct');
        for (var i = 0; i < csconstruct.length; i++) {
            qcheroDrag(csconstruct[i], 'qchero-slider-construct');
            csconstruct[i].onclick = function (e) {

                e = e || window.event;
                bl = e.currentTarget;
                var typeid = bl.getAttribute('data');

                if (typeid != 'description' && typeid != 'title' && typeid != 'button1')
                    remove.style.display = 'none';
                else {
                    remove.style.display = 'none';
                    //custum_styling.style.display = 'none';
                }
                _qchero(_qchero._('#qchero-custom-stylings')).addAttr('data', typeid);
                zoom.style.display = 'block';
                //if (typeid != 'description' && typeid != 'title')
                    //custum_styling.style.display = 'inline-block';
            }
        }
        /***<default construct >***/

        if (_qchero._('.qchero_construct_texter').length)
            _qchero._('.qchero_construct_texter').on('dblclick', function (e) {
                moveCondition.type = 'standing';
                e = e || window.event;
                var text = e.currentTarget.innerHTML;
                _qchero(e.currentTarget).addStyle('display:none;');
                var inputElement = _qchero('textarea');
                inputElement.addClass('qchero_construct_textarea').addStyle('width: 100%;height:100%;display:block;');
                inputElement.innerHTML = text;
                _qchero(e.currentTarget.parentNode).append(inputElement);
            })


        /***<default construct >***/

        var zoom = document.getElementById('zoom');
        var remove = document.getElementById('qchero_remove');
        var custum_styling = document.getElementById('qchero-custom-stylings');
        var bl, type;

        _qchero._('#qchero_remove').on('click', function () {
            var deletel = _qchero(bl).getAttr('data');
            delete qcheror['custom'][deletel];
            if (getparamsFromUrl('slideid', location.href))
                delete qcheror['slides']['slide' + getparamsFromUrl('slideid', location.href)]['custom'][deletel];
            jQuery('#qchero_' + deletel).remove();
            jQuery('#qchero_slider_' + deletel + '_styling').remove();
            zoom.style.display = 'none';
            remove.style.display = 'none';
            _qchero._('#qchero-custom-stylings').style.display = 'none';
        })
        _qchero._('#qchero-custom-add').on('click', function () {
            if(jQuery(this).hasClass('free')) return false;
            var type = event.currentTarget.getAttribute('data');
            if (type == 'button') {
                type = "button";
                var id = _qchero._('.qchero_' + type + '.qchero_construct').length;

            }
            else if (type == "image") {
                type = "img";
                var id = _qchero._('.qchero_' + type + '.qchero_construct').length;

                var d = this;
                open_media_window.apply(d, ['image', type + id]);
            }
            else if (type == "text") {
                type = "h3";
                var id = _qchero._('.qchero_' + type + '.qchero_construct').length;

            }
            else if (type == "vimeo" || type == "youtube") {
                type = "iframe";
                var id = _qchero._('.qchero_' + type + '.qchero_construct').length;
            }

            var clas = event.currentTarget.getAttribute('rel');
            qcheroCreateStylingPopup(type, type + id);
            _qchero(_qchero._('#qchero-custom-stylings')).addAttr('data', type + id);
            qcheroCreateDragElement(clas, type, 'qchero-slider-construct');
        })


        function setWrittenText() {
            var allWrittenTexts = _qchero._('.qchero_construct_textarea');
            for (var i = 0; i < allWrittenTexts.length; i++) {
                var textContent = allWrittenTexts[i].value;
                _qchero(allWrittenTexts[i]).addStyle('display:none;');
                _qchero.find(allWrittenTexts[i].parentNode, '.qchero_construct_texter')[0].innerHTML = textContent;
                var id = _qchero(allWrittenTexts[i].parentNode).getAttr('data');
                _qchero(allWrittenTexts[i]).parent().removeChild(_qchero.find(allWrittenTexts[i].parentNode, '.qchero_construct_textarea')[0]);
                textContent = textContent.ReslideReplaceAll('"', '&#34;');
                textContent = textContent.ReslideReplaceAll("'", '&#39;');
                textContent = textContent.ReslideReplaceAll("\\", '');
                jQuery('#qchero_slider_' + id + '_styling .text').val(textContent);
                jQuery('#qchero_slider_' + id + '_styling .btn').text(allWrittenTexts[i].value);
                jQuery('#qchero_slider_' + id + '_styling .h3').text(allWrittenTexts[i].value);
                jQuery('.qchero_construct_texter').css('display', 'block');
                moveCondition.type = '';
            }
        }

        function qcheroCreateDragElement(elementName, type, container) {
            var id, elements, type, newElement, newtextNode;
            remove.style.display = 'none';
            zoom.style.display = 'none';
            type = type.toLowerCase();
            newElement = document.createElement(type);
            elements = document.querySelectorAll('.qchero_' + type + ".qchero_construct");
            id = (elements.length) ? id = elements.length : 0;
            if (type == 'img') _qchero(newElement).addAttr('src', _IMAGES + '/noimage.png');
            newElement.id = 'qchero_' + type + id;
            newElement.classList.add('qchero_' + type);
            newElement.classList.add('qchero_construct');
            newElement.setAttribute("data", type + id);
            newElement.style.position = "absolute";
            newElement.style.left = "0px";
            newElement.style.top = "0px";
            if (type == 'h3' || type == "button") {
                var innerInput = _qchero('span');
                innerInput.addClass('qchero_construct_texter', 'qchero_input' + type).addStyle('width: 100%;height:100%;display:block;');
                (type == 'h3') && (newElementTEXT = document.createTextNode("Text " + id));
                (type == 'button') && (newElementTEXT = document.createTextNode("Button " + id));
                innerInput.append(newElementTEXT);
                newElement.appendChild(innerInput);
            }
            qcheroDrag(newElement, container);
            document.getElementById(container).appendChild(newElement);
            var allDrawenElements = document.querySelectorAll("#" + container + " .qchero_construct");
            for (var i = 0; i < allDrawenElements.length; i++) {
                allDrawenElements[i].onclick = function () {

                    bl = event.currentTarget;
                    typeid = bl.getAttribute('data');
                    if (typeid != 'description' && typeid != 'title' && typeid != 'button1')
                        remove.style.display = 'none';
                    else
                        remove.style.display = 'none';
                    _qchero(_qchero._('#qchero-custom-stylings')).addAttr('data', typeid);
                    //alert(styling);
                    //		console.log(event.currentTarget);
                    zoom.style.display = 'block';

                    custum_styling.style.display = 'inline-block';
                }
            }
            _qchero._('.qchero_construct_texter').length &&
            _qchero._('.qchero_construct_texter').on('dblclick', function (e) {
                e = e || window.event;
                var text = e.currentTarget.innerHTML;
                _qchero(e.currentTarget).addStyle('display:none;');
                var inputElement = _qchero('textarea');
                inputElement.addClass('qchero_construct_textarea').addStyle('width: 100%;height:100%;display:block;');
                inputElement.innerHTML = text;
                if (!_qchero.find(e.currentTarget.parentNode, '.qchero_construct_textarea').length)
                    _qchero(e.currentTarget.parentNode).append(inputElement);
            })
        }


        function qcheroDrag(dragElement, dragIn) {
            var gv = document.getElementById('general-view');
            var gvc = document.getElementById('qchero-slider-construct');
			var mainWid = document.getElementById("qchero-slider-construct").offsetWidth;
			var mainHid = document.getElementById("qchero-slider-construct").offsetHeight;
            var c = document.getElementById(dragIn) || document.getElementById('qchero-slider-construct');

            var dragElement = dragElement;
            bl = dragElement;

            dragElement.ondragstart = function () {
                return false;
            };
            qcheroDrag.getCoords = function (elem) {
                var box = elem.getBoundingClientRect();

                return {
                    top: box.top + pageYOffset,
                    left: box.left + pageXOffset
                };

            }

            function getOffsetTop(elem) {
                var offsetTop = 0;
                do {
                    if (!isNaN(elem.offsetTop)) {
                        offsetTop += elem.offsetTop;
                    }
                } while (elem = elem.offsetParent);
                return offsetTop;
            }

            function getOffsetLeft(elem) {
                var offsetLeft = 0;
                do {
                    if (!isNaN(elem.offsetLeft)) {
                        offsetLeft += elem.offsetLeft;
                    }
                } while (elem = elem.offsetParent);
                return offsetLeft;
            }

            function moveAt(evnt, mover, shiftX, shiftY) {
                $this = this.type;
                type = mover.getAttribute('data');
                var RH = parseFloat(dragElement.style.left) + jQuery(dragElement).width() / 2;
				
                var RV = parseFloat(dragElement.style.top) + jQuery(dragElement).height() / 2;
                var CH = jQuery(c).width() / 2;
                var CV = jQuery(c).height() / 2;
				
				//vertical//
                
				//end vertical//
				
				//horizontal//
                if (Math.abs(RV - CV) < 3) {
                    var coords = qcheroDrag.getCoords(dragElement);
                    jQuery('#qchero-construct-horizontal').show();
                    if (typeof initDifferY == 'undefined')
                        initDifferY = evnt.pageY - coords.top;
                    var newDiffer = evnt.pageY - coords.top;
                    if (Math.abs(newDiffer - initDifferY) > 20) {
                        if ($this !== 'standing') {
							var extop = evnt.pageY - shiftY;
							var topper = (extop*100)/mainHid;
							mover.style.top = topper + '%';
                            
                        }
                        jQuery('#qchero-construct-horizontal').hide();
                    }
                    else
                        jQuery('#qchero-construct-horizontal').show();
                } else {
                    if ($this !== 'standing') {
						var extop = evnt.pageY - shiftY;
						var topper = (extop*100)/mainHid;
						mover.style.top = topper + '%';						
                        
                        zoom.style.top = evnt.pageY - shiftY + mover.offsetHeight + 'px';
                        
                    }
                }
				
				//end horizontal//
                if (type.substring(0, 3) != 'img') {
                    if (parseFloat(mover.style.left) < 0) {
                        if ($this !== 'standing') {
                            mover.style.left = '0px';
                            zoom.style.top = evnt.pageY - shiftY + mover.offsetHeight + 'px';
                            zoom.style.left = mover.offsetWidth + 'px';
                            remove.style.left = mover.offsetWidth - 14 + 'px';
                        }
                    }
                    if (parseFloat(mover.style.top) < 0) {
                        if ($this !== 'standing') {
                            mover.style.top = '0px';
                            zoom.style.top = mover.offsetHeight + 'px';
                            remove.style.top = 0 + 'px';
                        }
                    }
                    if (parseFloat(mover.style.left) > (jQuery('#qchero-slider-construct').width() - jQuery(mover).outerWidth())) {
                        if (this !== 'standing') {
                            mover.style.left = jQuery('#qchero-slider-construct').width() - jQuery(mover).outerWidth() + 'px';
                            //remove.style.left = jQuery('#qchero-slider-construct').width() - 14 + 'px';
                        }
                    }
                    if (parseFloat(mover.style.top) > (jQuery('#qchero-slider-construct').height() - jQuery(mover).outerHeight())) {
                        if ($this !== 'standing') {
                            mover.style.top = jQuery('#qchero-slider-construct').height() - jQuery(mover).outerHeight() + 'px';
                            //remove.style.top = jQuery('#qchero-slider-construct').height() - jQuery(mover).outerHeight() + 'px';
                        }
                    }
                }
				
                jQuery('#qchero_slider_' + type + '_styling').find('.top').val(mover.style.top);
                jQuery('#qchero_slider_' + type + '_styling').find('.left').val(mover.style.left);
            }

            dragElement.onmousedown = function (e) {
                moveCondition.type = 'standing';
                type = dragElement.getAttribute('data');
                differ = qcheroDiffer(gv, gvc);
                if (differ < 15) differ = 0;
                // console.log('DF',differ);
                var coords = qcheroDrag.getCoords(dragElement);
                var shiftX = e.pageX - coords.left + getOffsetLeft(c) - differ;
                var shiftY = e.pageY - coords.top + getOffsetTop(c);
                zoom.style.left = parseFloat(qcheroDrag.getCoords(dragElement).left) - parseFloat(qcheroDrag.getCoords((_qchero._('#qchero-slider-construct'))).left) + dragElement.offsetWidth + 'px';
                if (type != 'title' && type != 'description') {
                    remove.style.display = 'none';
                    remove.style.left = parseFloat(qcheroDrag.getCoords(dragElement).left) - parseFloat(qcheroDrag.getCoords((_qchero._('#qchero-slider-construct'))).left) + dragElement.offsetWidth - 14 + 'px';
                }
                else
                    remove.style.display = 'none';
                dragElement.style.position = 'absolute';

                (function () {  /*init remove and zoom button's position */
                    zoom.style.top = e.pageY - shiftY + dragElement.offsetHeight + 'px';
                    remove.style.top = e.pageY - shiftY + 'px';
                })();


                dragElement.style.zIndex = 1000;
                moveAt.call(moveCondition, e, dragElement, shiftX, shiftY);

                document.onmousemove = function (e) {
                    if (_qchero.find('#qchero-slider-construct', '.qchero_construct_textarea').length)
                        moveCondition.type = 'standing';
                    else moveCondition.type = '';
                    moveAt.call(moveCondition, e, dragElement, shiftX, shiftY);
                }

                dragElement.onmouseup = function () {
                    initDifferX = undefined;
                    initDifferY = undefined;
                    document.onmousemove = null;
                    dragElement.onmouseup = null;
                };

                document.onclick = function () {
                    document.onmousemove = null;
                    if (_qchero._('.qchero_construct_textarea').length) {
                        _qchero._('.qchero_construct_textarea').on('blur', function () {
                            setWrittenText();
                        });
                    }
                };

            }
            return dragElement;
        }

        /*** resize ***/
        if (zoom) zoom.addEventListener('mousedown', qcheroInitDrag, false);

        var startX, startY, startWidth, startHeight, shiftX, shiftY;

        function qcheroInitDrag(e) {
            moveCondition.type = '';
            jQuery('#qchero-construct-vertical').hide();
            jQuery('#qchero-construct-horizontal').hide();
            startX = e.clientX;
            startY = e.clientY;
            startWidth = parseInt(document.defaultView.getComputedStyle(bl).width, 10);
            startHeight = parseInt(document.defaultView.getComputedStyle(bl).height, 10);
            document.documentElement.addEventListener('mousemove', qcheroDoDrag, false);
            document.documentElement.addEventListener('mouseup', qcheroStopDrag, false);
        }

        function qcheroDoDrag(e) {

            bl.style.width = (startWidth + e.clientX - startX) + 'px';
            bl.style.height = (startHeight + e.clientY - startY) + 'px';
            zoom.style.top = bl.offsetTop + bl.offsetHeight + 'px';
            zoom.style.left = bl.offsetLeft + bl.offsetWidth + 'px';
            jQuery('#qchero_slider_' + type + '_styling').find('.width').val(parseFloat(bl.style.width));
            jQuery('#qchero_slider_' + type + '_styling').find('.qchero_content .qchero_custom').width(bl.style.width);
            jQuery('#qchero_slider_' + type + '_styling').find('.height').val(parseFloat(bl.style.height));
            jQuery('#qchero_slider_' + type + '_styling').find('.qchero_content .qchero_custom').height(bl.style.height);
            zoom.style.top = parseInt(bl.style.top) + bl.offsetHeight + 'px';
            zoom.style.left = parseInt(bl.style.left) + bl.offsetWidth + 'px';
            remove.style.top = parseInt(bl.style.top) + 'px';
            remove.style.left = parseInt(bl.style.left) + bl.offsetWidth - 14 + 'px';

        }

        function qcheroStopDrag(e) {
            document.documentElement.removeEventListener('mousemove', qcheroDoDrag, false);
            document.documentElement.removeEventListener('mouseup', qcheroStopDrag, false);
            zoom.style.top = parseInt(bl.style.top) + bl.offsetHeight + 'px';
            zoom.style.left = parseInt(bl.style.left) + bl.offsetWidth + 'px';
            remove.style.top = parseInt(bl.style.top) + 'px';
            remove.style.left = parseInt(bl.style.left) + bl.offsetWidth - 14 + 'px';
            moveCondition.type = '';
        }
        
    });



    /* Cookies */
    function qcheroSetCookie(name, value, options) {
        options = options || {};

        var expires = options.expires;

        if (typeof expires == "number" && expires) {
            var d = new Date();
            d.setTime(d.getTime() + expires * 1000);
            expires = options.expires = d;
        }
        if (expires && expires.toUTCString) {
            options.expires = expires.toUTCString();
        }


        if(typeof value == "object"){
            value = JSON.stringify(value);
        }
        value = encodeURIComponent(value);
        var updatedCookie = name + "=" + value;

        for (var propName in options) {
            updatedCookie += "; " + propName;
            var propValue = options[propName];
            if (propValue !== true) {
                updatedCookie += "=" + propValue;
            }
        }

        document.cookie = updatedCookie;
    }
    
    function qcheroGetCookie(name) {
        var matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    function qcheroDeleteCookie(name) {
        setCookie(name, "", {
            expires: -1
        })
    }
})
(jQuery);