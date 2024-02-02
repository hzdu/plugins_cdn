/* French initialisation for the jQuery UI date picker plugin. */
/* Written by Keith Wood (kbwood{at}iinet.com.au),
			  Stéphane Nahmani (sholby@sholby.net),
			  Stéphane Raimbault <stephane.raimbault@gmail.com> */
jQuery(function($){
	$(document).ready(function(){
        var postType= $("#custom_post_select").val();

		$('body').on('change',"#custom_post_select", function(){
			var data = {
			'action': 'getTaxonomyWPLP',
			'postType': $(this).val()
			};
			postType = $(this).val();
			$.post(ajaxurl, data, function(response) {
				$parent=$("#postSelector");
				$("#taxonomySelector").remove();
				$("#termSelector").remove();
				$parent.after(response);
				// $('select').material_select();
			});
		});
		/*
		Get taxonomy when change language selection
		 */
        $('body').on('change',"#content_language", function(){
            var TaxChoose = $("#custom_post_select_tax").val();
            var language = $(this).val();
            var loading = '<div style="content-language-loading"><img src="' + content_language_param.plugin_dir + '/css/images/loading.gif"</div>';
            $("#termSelector").html(loading);

            get_taxonomy_ajax(postType,TaxChoose,language);
		});
		/*
		 Get taxonomy when change tax selection
		 */
		$('body').on('change',"#custom_post_select_tax", function(){
            var language = $('#custom_posttype_language').val();
			var	TaxChoose= $(this).val();
            get_taxonomy_ajax(postType,TaxChoose,language);
		});
		$("select.mutilsite_select_custompost").change(function(){
			var val_blog = $(this).val();
			$.ajax({
				url : ajaxurl,
				dataType : 'json',
				method : 'POST',
				data : {
					action : 'change_custompost_multisite',
					val_blog : val_blog,
                    ajaxnonce : wpsolAddonAdminJS.ajaxnonce
				},
				success : function(res){
					$("#postSelector").find('ul').remove();
					$("#postSelector").append(res);
					$("#taxonomySelector").remove();
					$("#termSelector").remove();
					// $('select').material_select();
				}
			});

		});

		var get_taxonomy_ajax = function(postType,TaxChoose,language){
            var data = {
                'action': 'getTaxonomyWPLP',
                'postType': postType,
                'TaxChoose': TaxChoose,
                'language' : language
            };
            $.post(ajaxurl, data, function(response) {
                $parent=$("#postSelector");
                $("#taxonomySelector").remove();
                $("#termSelector").remove();
                $parent.after(response);
                // $('select').material_select();
            });
		}
	});
});