(function($) {
    'use strict';
    $(document).ready(function() {
        $('.wpt_cf__wrap').on('click','.wpt_add_field',function(){
            
            var key,name,value,fields;
            key = $('.wpt_select_key').val();
            name = $('.wpt_select_key option:selected').text();
            value = $('.wpt_field_adding_input').val();
            var items_length = 0;
            var rowItems = $('#wpt_cf__form_field_wrapper .wpt_each_row.wpt_each_row_' + key).html();
            items_length = (typeof rowItems === 'undefined' ? 0 : 1);
            //console.log(items_length);
            //console.log(key,typeof $('#wpt_cf__form_field_wrapper .wpt_each_row.wpt_each_row_' + key).html(),items_length);
            fields = "";
            if(items_length === 0){
                fields += "<div class='wpt_each_row_wrapper'>";
                fields += "<div class='wpt_fld_header'>Label: <b>" + name + "</b> | key: <i>" + key + "</i></div>";
                fields += "<div class='wpt_each_row wpt_each_row_" + key + "'>";
                fields += "<input type='hidden' name='_cf_filter[" + key + "][label]' value='" + name + "' >";
            }
            fields +="<input name='_cf_filter[" + key + "][values][]' type='text' class='wpt_field_value' value='" + value + "'>";
            if(items_length === 0){
                
                fields +="</div>";
                fields +="<i class='wpt_cross_button'>x</i>";
                fields +="</div>";
            }
            //console.log(fields);
            if(items_length === 0){
                $('#wpt_cf__form_field_wrapper').prepend(fields);
            }else{
                $('#wpt_cf__form_field_wrapper .wpt_each_row.wpt_each_row_' + key).append(fields);
            }
            
            $('.wpt_field_adding_input').val("")
            $('.wpt_no_value').hide();
        });
        $('.wpt_key_add').click(function(){
            
            $('.wpt_added_message').show();
            var val = $('.wpt_key_cf').val();
            var name = $('.wpt_key_cf_name').val();
            if(val !== '' &&  name !== '' && val !== ' ' &&  name !== ' '){
                $('.wpt_select_key').prepend("<option value='" + val + "'>" + name + "</option>");
                $('.wpt_key_cf').val("");
                $('.wpt_key_cf_name').val("");
                $('.wpt_added_message').fadeOut(2100);
                $(".wpt_select_key option:first").attr("selected", "selected"); 
                $('.wpt_warning').hide();
            }else{
                alert("Empty Field is not supported.");
            }
            
        });
        
        
        $('body').on('click','.wpt_cross_button',function(){
            //window.confirm("Press a button!");
            var confirm = window.confirm("Are you sure? \nYou want to remove this whole Group.");
            if(confirm){
                $(this).parents('.wpt_each_row_wrapper').fadeOut('slow',function(){
                    $(this).remove();
                });
            }            
        });
        
        
    });
})(jQuery);