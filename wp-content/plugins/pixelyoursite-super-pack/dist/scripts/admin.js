jQuery(document).ready(function ($) {

    $(document).on('click', '.remove-row', function () {
        $(this).closest('.plate').remove();
    });

    $body = $('body');
    $body.on('change','.pixel_info .is_enable',function () {
        updatePixelData($(this).parents('.pixel_info'),'is_enable',this.checked)
    })
    $body.on('input','.pixel_info .pixel_id'  ,function () {
        updatePixelData($(this).parents('.pixel_info'),'pixel_id',$(this).val())
    })
    $body.on('input','.pixel_info .pixel_ext'  ,function () {

        updatePixelData($(this).parents('.pixel_info'),'ext_'+$(this).data('ext'),$(this).val())
    })
    $body.on('change','.pixel_info .pixel_ext_chekbox'  ,function () {

        updatePixelData($(this).parents('.pixel_info'),'ext_'+$(this).data('ext'),this.checked)
    })
    $body.on('change','.pixel_info .is_fire_signal'  ,function () {
        updatePixelData($(this).parents('.pixel_info'),'is_fire_signal',this.checked)
    })
    $body.on('change','.pixel_info .is_fire_woo'  ,function () {
        updatePixelData($(this).parents('.pixel_info'),'is_fire_woo',this.checked)
    })
    $body.on('change','.pixel_info .is_fire_edd'  ,function () {
        updatePixelData($(this).parents('.pixel_info'),'is_fire_edd',this.checked)
    })

    $body.on('change','.pixel_info .is_fire_edd'  ,function () {
        updatePixelData($(this).parents('.pixel_info'),'is_fire_edd',this.checked)
    })

    $body.on('condition_update','.pixel_conditions'  ,function () {
        let items = new Array();
        let data = {};

        $(this).find(".condition").each(function () {

            let name = $( this ).data('name');
            data[name] = $( this ).val()
            if(name == "sub_id") {
                data['sub_id_name'] = $( this ).parent().find('.view_input').text()
            }

        })
        items.push(data)
        updatePixelData($(this).parents('.pixel_info'),'condition',items)
    })

    $body.on('change','.pixel_lang_check_box input'  ,function () {
        let items = new Array();
        $parent = $(this).parents('.wpml_lags')
        $parent.find("input:checked").each(function () {
            items.push($(this).attr('value'))
        })
        $parentInfo = $(this).parents('.pixel_info');

        if($parentInfo.length > 0) {
            updatePixelData($parentInfo,'wpml_active_lang',items);// multi pixel
        } else {
            updateMainPixelLang($(this).parents('.wpml_lags').find(".pixel_lang"),items); // main pixel
        }

    })

    function updatePixelData($parent,key,value){

        $input = $parent.find('> input')

        $data = $input.val()
        $data = $data ? JSON.parse($data) : {};
        if(key.lastIndexOf("ext_", 0) === 0) {
            let _key = key.substring(4);
            $data['extensions'] = $data['extensions'] ? $data['extensions'] : {}
            $data['extensions'][_key] = value;
        } else {
            $data[key] = value;
        }

        $input.val(JSON.stringify($data));
    }

    $('#pys_superpack_add_facebook_pixel_id').click(function (e) {
        e.preventDefault();
        let count = $(this).parents('.settings_content').find('.pixel_info').length -1
        var $row = $('#pys_superpack_facebook_pixel_id').clone()
            .insertBefore('#pys_superpack_facebook_pixel_id')
            .attr('id', '')
            .css('display', 'block');
        $row.find('#pixel_facebook_is_enable').attr('id','pixel_facebook_is_enable_'+count)
        $row.find("label[for='pixel_facebook_is_enable']").attr('for','pixel_facebook_is_enable_'+count)
        updatePixelInputValue($row)
    });

    $('#pys_superpack_add_ga_tracking_id').click(function (e) {

        e.preventDefault();

        var $row = $('#pys_superpack_ga_tracking_id').clone()
            .insertBefore('#pys_superpack_ga_tracking_id')
            .attr('id', '')
            .css('display', 'block');
        updatePixelInputValue($row)
    });

    $('#pys_superpack_add_google_ads_id').click(function (e) {

        e.preventDefault();

        var $row = $('#pys_superpack_google_ads_id').clone()
            .insertBefore('#pys_superpack_google_ads_id')
            .attr('id', '')
            .css('display', 'block');
        updatePixelInputValue($row)

    });

    function updatePixelInputValue($pixel) {
        updatePixelData($pixel,'is_enable',$pixel.find('.is_enable')[0].checked)
        updatePixelData($pixel,'pixel_id',$pixel.find('.pixel_id').val())
        $pixel.find('.pixel_ext').each(function () {
            updatePixelData($pixel,'ext_'+$(this).data('ext'),$(this).val())
        })
        $pixel.find('.pixel_ext_chekbox').each(function () {
            updatePixelData($pixel,'ext_'+$(this).data('ext'),this.checked)
        })

        updatePixelData($pixel,'is_fire_signal',$pixel.find('.is_fire_signal')[0].checked)
        let $isFireWoo = $pixel.find('.is_fire_woo')
        if($isFireWoo.length > 0) {
            updatePixelData($pixel,'is_fire_woo',$isFireWoo[0].checked)
        }
        let $isFireEdd = $pixel.find('.is_fire_edd')
        if($isFireEdd.length > 0) {
            updatePixelData($pixel,'is_fire_edd',$isFireEdd[0].checked)
        }

        let items = new Array();
        let data = {};

        $pixel.find(".pixel_conditions .condition").each(function () {

            let name = $( this ).data('name');
            data[name] = $( this ).val()
            if(name == "sub_id") {
                data['sub_id_name'] = $( this ).parent().find('.view_input').text()
            }

        })
        items.push(data)
        updatePixelData($pixel,'condition',items)


        $parent = $pixel.find('.wpml_lags')
        if($parent.length > 0) {
            let langs = new Array();
            $parent.find("input:checked").each(function () {
                langs.push($(this).attr('value'))
            })
            updatePixelData($pixel,'wpml_active_lang',langs)
        }



    }



    function updateMainPixelLang(langBox,langs) {

        var langval = "";
        if(langs.length === 0) {
            langval = "empty";
        } else {
            langs.forEach(function (item,index) {
                if(index !== 0) {
                    langval += "_";
                }
                langval += item;
            });
        }
        langBox.val(langval);
    }


    // pixel conditions

    $(document).on('change','.pixel_conditions .condition_select',function() {
        console.log("change", $(this).val())
        let value = $(this).val()
        let parent = $(this).parents('.pixel_conditions');
        $(this).nextAll('select,div').remove()
        addCondition(parent,value)


    });
    $(document).on('click','.pixel_conditions .condition_search .view_input',function () {
        $(this).toggleClass('open')
    });
    $(document).on('input','.pixel_conditions .condition_search_input',function () {
        let $parent = $(this).parents('.condition_search');
        let condition = conditions[$parent.data('conditional')];
        let ul = $parent.find("ul")
        let data = {
            "action":"pys_filter_condition_autocomplete",
            "query":condition.controls.query,
            "q":$(this).val()
        }
        jQuery.ajax( {
            type: 'POST',
            url: ajaxurl,
            data: data,
            success: function(data){
                if(data.success) {
                    ul.find('.item').remove();
                    data.data.results.forEach(function (item) {
                        ul.append('<li class="item" data-id="'+item.id+'">'+item.text+'</li');
                    });
                }

                console.log("data",data)
            },
        });
    });
    $(document).on('click','.pixel_conditions ul .item',function () {
        let $parent = $(this).parents('.condition_search');
        let input = $parent.find('.input_value');
        let text = $parent.find('.view_input');
        let inputSearch = $parent.find('.condition_search_input');
        text.text($(this).text())
        input.val($(this).data("id"))
        $(this).parents('.pixel_conditions').trigger('condition_update')
        // clear search and close menu
        $('.pixel_conditions .condition_search .view_input').removeClass('open')
        $('.pixel_conditions ul .item').remove()
        inputSearch.val("")
    })


    function addCondition(parent,value,defaultValue = false) {
        let nextCondition = conditions[value];

        if(nextCondition && nextCondition.controls.type == "select_titled") {
            var select = '<select  class="condition_select condition" data-name="'+nextCondition.controls.name +'" >';

            if(value != 'woocommerce' && value != "edd") {
                select +=' <option value="all">'  +nextCondition.all_label + '</option>';
            }
              
            nextCondition.controls.options.forEach(function (option){
                if(option.items.length > 1) {
                    select += '<optgroup label="' + option.title + '">';
                }
                option.items.forEach(function (sub) {
                    select += '<option value="' + sub + '" '+ (defaultValue == sub ? "selected":"") +'>' + conditions[sub].label + '</option>';
                });
                if(option.items.length > 1) {
                    select += '</optgroup>';
                }
            });
            parent.append(select)

        }
        if(nextCondition && nextCondition.controls.type == "search") {
            var search = '<div class="condition_search" data-conditional='+value+'>' +
                '<input class="input_value condition" type="hidden" data-name="'+nextCondition.controls.name +'"'+ (defaultValue ? 'value="'+defaultValue.value+'"' : '') +' >' +
                '<div class="view_input">'+(defaultValue ? defaultValue.label : nextCondition.all_label)+'</div>' +
                '<ul><li><input type="text" class="condition_search_input " /></li></ul></div>';

            parent.append(search)

        }
        parent.trigger('condition_update')
    }

    function initConditional() {
        $('.pixel_conditions').each(function () {
            let $parent = $(this);
            let params =  $parent.data('params');
            params.forEach(function (item) {
                $parent.find(".condition[data-name='name'] option[value='"+item.name+"']").prop('selected', true);
                if(item.sub_name) {
                    addCondition($parent,item.name,item.sub_name)
                    if(item.sub_name != 'all') {
                        addCondition($parent,item.sub_name,{label:item.sub_id_name,value:item.sub_id})
                    }
                }


            });

        })
    }

    // load
    initConditional();
});

