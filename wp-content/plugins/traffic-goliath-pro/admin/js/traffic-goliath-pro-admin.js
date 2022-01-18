var tg_new_search = 0;
jQuery(document).ready(function () {
	
	//Hide/show Post Tag functionality
    jQuery('.tg_post_check').on('click', function () {
		var isChecked = jQuery('.tg_post_check:checked').val();
		if(isChecked == null) {
			jQuery('.tg-metatag-search').addClass('tg-hidden');
		} else {
			jQuery('.tg-metatag-search').removeClass('tg-hidden');
		}
    });
	
	//Find Tag functionality
    jQuery('.tg-search-tags').on('click', function () {
        var tagSearchValue = jQuery('.tg-keyword-input').val();
        if (tagSearchValue == '') {
            jQuery('.tg-keyword-input').addClass('tg-error');
			return false;
        }
		jQuery('.tg-keyword-input').removeClass('tg-error');
		jQuery.ajax({
			type: 'post',
			data: {action: 'scrap_it', keyword: tagSearchValue},
			url: ajaxurl,
			beforeSend: function () {
				jQuery('.tg-search-tags').attr('disabled', 'disabled').html('<i class="fa fa-refresh fa-spin fa-fw"></i>'+tg_object.tg_load_txt);
				//jQuery('.tg-search-tags').text(tg_object.tg_load_txt);
				jQuery('.tg-tag-datalisting').html('<p>'+tg_object.tg_load_txt+'</p>');
				jQuery('.tg-listing-header').removeClass('addClass');
			},
			success: function (res) {

				jQuery('.tg-listing-header').removeClass('tg-hidden');
				// var d = JSON.parse(res);
				if(res){
						try {
					        d = JSON.parse(res);
					    }
					    catch (e) {
					        jQuery('.tg-tag-datalisting').html('<span style="color:red">Something went wrong please Try Again</span>');
					    }

			    jQuery('.tg-search-tags').html('<i class="fa fa-search"></i> ' + tg_object.tg_btn_txt);
				var is_empty = 1;
				if (d.data.length > 0) {
					var w = '';
					jQuery('.tg-tag-datalisting').html('');
					for (var word in d.data) {
						w = '';
						if (d.data[word].indexOf('fieldset') < 0) {
							w = toTitleCase(d.data[word].replace('"', "").replace('"', ""));
							jQuery('.tg-tag-datalisting').append(
									'<div class="data-list"><label><input class="tg-key-list" type="checkbox" name="tg_keys[]" value="' + w + '">' + w + '</label></div>');
							is_empty = 0;
							var totaldatacount = jQuery('.data-list').length;
							jQuery('.tg-counter').html('(' + totaldatacount + ' Keywords)');
						}
					}
					if (is_empty) {
						jQuery('.tg-tag-datalisting').html('<p>'+tg_object.tg_res_txt+'</p>');
			    	}
				}
				// var Allcheckboxes = jQuery(".tg-allselection");
				// var Singlecheckboxes = jQuery(".tg-key-list");

				// Allcheckboxes.on('change', function() {
				//     jQuery('#tg-savetags-list').val(
				//         Singlecheckboxes.filter(':checked').map(function(item) {
				//             return this.value;
				//         }).get().join('|')
				//      );
				// });

				// Singlecheckboxes.on('change', function() {
				//     jQuery('#tg-savetags-list').val(
				//         Singlecheckboxes.filter(':checked').map(function(item) {
				//             return this.value;
				//         }).get().join('|')
				//      );
				// });
			 }
		   }	
		})
    });

	// Download Tags Functionality
	jQuery('.tg-download-tags').on('click', function () {
		var filename = "Post-"+tg_object_post.tg_post+"-Tags.txt";
		var text = "";
		jQuery(".tg-key-list").each(function() {
			if (jQuery(this).is(":checked")){
				text += jQuery(this).attr("value") + "\n";
			}
		});
		if(text.length < 1){
			alert("No tag selected");
			return;
		}
		var element = document.createElement('a');
		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
		element.setAttribute('download', filename);
		element.style.display = 'none';
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	});

    //confirm inactive themes delete ;
	jQuery('#publish').click(function () {
		var val = jQuery('#tg-savetags-list').val();
		var isChecked = jQuery(".tg-key-list").prop("checked");
		val = [];
		var text = '';
		var i = 0;
		jQuery('.tg-key-list:checked').each(function() {
			text += jQuery(this).val() + '|';
			i++;
		});
		
		if( i > 20 && isChecked == true ) {
			if (!confirm('Are you sure you want to add all ' + i + ' Keywords' )) 
				return false;
		}
	});	

    //Add multiple select/unselect functionality
    jQuery(".tg-allselection").on("click", function () {
	    jQuery(".tg-key-list").prop("checked", this.checked);
    });
	
    function toTitleCase(str) {
        return str.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }
});

function tgaddToDb(id){

	var Allcheckboxes = jQuery(".tg-allselection");
	var Singlecheckboxes = jQuery(".tg-key-list");

	Allcheckboxes.on('change', function() {
	    jQuery('#tg-savetags-list').val(
	        Singlecheckboxes.filter(':checked').map(function(item) {
	            return this.value;
	        }).get().join('|')
	     );
	});

	Singlecheckboxes.on('change', function() {
	    jQuery('#tg-savetags-list').val(
	        Singlecheckboxes.filter(':checked').map(function(item) {
	            return this.value;
	        }).get().join('|')
	     );
	});

	var val = jQuery('#tg-savetags-list').val();
	var isChecked = jQuery('.tg-key-list:checked');
	val = [];
	var text = '';
	var i = 0;
	jQuery('.tg-key-list:checked').each(function() {
		text += jQuery(this).val() + '|';
		i++;
	});
	if (text == '') {
		alert('Please select at least one tag.');
		return false;
	}
	text = text.substring( 0, text.length - 1 );
	if ( isChecked == true && val != '') {
		var uniquelist = jQuery.unique(val);
		jQuery('#tg-savetags-list').val(uniquelist + '|' + text);
	}
	else {
		jQuery('#tg-savetags-list').val(text);
	}
	var ale = i > 1 ? i+' tags are ' : i+' tag is ';
	ale += 'added. Please save this post.';
	alert(ale);		

}

(function( $ ) {
});