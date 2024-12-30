
(function ($) {
    'use strict';

    function generate_placeholders() {
        var datas = {
            'action': 'generate_placeholders',
            'rc_nonce': pcacg.nonce,
        };

        $.ajax({
            url: pcacg.ajax_url,
            data: datas,
            type: 'post',
            dataType: 'json',

            beforeSend: function () {

            },
            success: function (r) {
                if (r.success) {
                    console.log(r);

                } else {
                    console.log('Something went wrong, please try again!');
                }

            }, error: function () {

            }
        });
    }

    jQuery(document).on("click", ".variation-image-item .penciai-image-download", function () {
        jQuery('.theSingleImage img').attr("src", "");
        var imgSrc = $(this).closest('.variation-image-item').children('img').attr('src');
        var prompt = $('#prompt-input').val();

        if ( imgSrc === "" ){
            alert("Image is empty"); //todo
            return;
        }
        const words = prompt.split(" "); // split the string into an array of words
        const firstFiveWords = words.slice(0, 5); // extract the first 5 elements of the array

        var fileName = penciai_cleanFilename(firstFiveWords.join('-'))+'.png';

        var title_element = $('.image-form-container #title');
        var alternative_text_element = $('.image-form-container #alternative_text');
        var caption_element = $('.image-form-container #caption');
        var description_element = $('.image-form-container #description');
        var file_name_element = $('.image-form-container #file_name');

        title_element.val(prompt);
        alternative_text_element.val(prompt);
        caption_element.val(prompt);
        description_element.val(prompt);
        file_name_element.val(fileName.toLowerCase());

        jQuery('.theSingleImage img').attr("src", imgSrc);
        jQuery.tinyModal({
            title: 'Save image to media library', //todo
            html: '#save-image-to-gallery',
            OkButton: "<span class='modal_label'>Save to media</span> <span class=\"penciai_spinner hide_spin\"></span>", //todo
            successBtnToClose: false,
            OkButtonClass: "saveGeneratedImageToMedia",
            badge: '<span style="font-size: 13px; font-weight: normal;" class="image-saved-to-media-library badge badge-success penciai-hidden">Image has been saved to media library!</span>' //todo
        });

        if (window.outerHeight > 790){
            $('.tinymodal-content').css({'max-height': '100%'});
        }
        else{
            $('.theSingleImage img').css({'max-width': '300px', 'max-height': '300px'});
        }


        jQuery('.tinymodal-buttons .inner .saveGeneratedImageToMedia').click(function () {
            var title = title_element.val();
            var alternative_text = alternative_text_element.val();
            var caption = caption_element.val();
            var description = description_element.val();
            var file_name = file_name_element.val();
            var img_url = imgSrc;

            $(this).addClass('running');
            $('.saveGeneratedImageToMedia .penciai_spinner').css({'display': 'inline'});
            $('.saveGeneratedImageToMedia .modal_label').text("Saving to gallery");

            penciai_ajax_("penciai_save_image_to_media_library", {"title": title,"alternative_text": alternative_text,"caption": caption,"description": description,"file_name": file_name,"img_url": img_url}).then(function (resposne) {
                $('.saveGeneratedImageToMedia .penciai_spinner').hide();
                $('.saveGeneratedImageToMedia').removeClass('running');
                $('.image-saved-to-media-library').css({"display": "inline"});
                $('.saveGeneratedImageToMedia .modal_label').text("Saved to media");

                setTimeout(function(){
                    $('.tinymodal-close').click();
                }, 3000);

            }, function () {
                alert("Something went wrong, please try again later.");
            })
        });

    });

    jQuery(document).on("click", ".suggest_titles", function (e) {
        e.preventDefault();

        jQuery('.penciai_suggested_titles').html('<span class="suggest_titles penciai_spinner"></span>');
        var title = jQuery(this).closest('.title').find('strong a').text();

        var titles_array = [];
        if (title !== "" && title !== "(no title)"){
            var id = jQuery(this).closest('tr').attr('id');
            var theId = id.split("-")[1];
            jQuery('.title_for_suggestion').text(title);
            penciai_ajax_("penciai_suggest_post_titles", {main_title: title}).then(function (response) {
                if (response.success){
                    if ("data" in response){
                        var titles = penciai_replace_double_quo(penciai_removeNumbers2(response.data));
                        titles = titles.split("\n");
                        titles_array = titles;
                        var html = "";
                        for (let i = 0; i < titles.length; i++) {
                            var title = titles[i].trim();
                            html += '<div class="penciai_suggested_title_item"><input id="su_'+i+'" type="radio" name="penciai_suggest_title" value="'+i+'"><label for="su_'+i+'">'+title+'</div>';
                        }
                        jQuery('.penciai_suggested_titles').html(html)
                    }

                }

            }, function () {
                jQuery('.tinymodal-close').click();
            })

            jQuery.tinyModal({
                title: 'Suggest titles', //todo
                html: '#suggestion_title_modal',
                OkButton: "Replace", //todo
            });

            jQuery('.tinymodal-buttons .inner button:nth-child(1)').click(function () {
                var selected_title = jQuery('[name="penciai_suggest_title"]:checked').val();
                var title = titles_array[selected_title];
                var tr_id = 'tr#post-'+theId;

                penciai_ajax_("penciai_replace_with_suggested_title", {'id': theId, title: titles_array[selected_title]}).then(function () {
                    jQuery(tr_id).find('.row-title').text(title);
                    jQuery(tr_id).find('.row-title').addClass("penciai_title_replaced");

                    setTimeout(function(){
                        jQuery(tr_id).find('.row-title').removeClass("penciai_title_replaced");
                    }, 3000);

                })
            });
        }

    });


})(jQuery);

function penciai_cleanFilename(filename) {
    // remove all non-alphanumeric characters (except dots and dashes)
    let cleanedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '');

    // remove any commas
    cleanedFilename = cleanedFilename.replace(/,/g, '');

    // return the cleaned filename
    return cleanedFilename;
}