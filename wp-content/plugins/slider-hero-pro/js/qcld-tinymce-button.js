;(function( $ ) {
    tinymce.PluginManager.add('slider_short_btn', function( editor,url )
    {
        var shortcodeValues = [];

        editor.addButton('slider_short_btn', {
            //type: 'listbox',
			title : 'Add Slider Shortcode',
            text: '',
            icon: 'icon qc_slider_hero',
            //image : url + '/16_pixel.png',
            onclick : function(e){
                $.post(
                    ajaxurl,
                    {
                        action : 'show_shortcodes_slider'
                        
                    },
                    function(data){
                        $('#wpwrap').append(data);
                    }
                )
            },
            values: shortcodeValues
        });
    });

    var selector = '';

    $(document).on( 'click', '.modal-content .close', function(){
        $(this).parent().parent().remove();
    }).on( 'click', '#slider_hero_add_shortcode',function(){
      var post = $('#slidergenerate').val();
      
	  
	  
	  
		var shortcodedata = '[qcld_hero';
	  if(post!==''){
		  shortcodedata +=' id="'+post+'"';

		shortcodedata +=']';
		tinyMCE.activeEditor.selection.setContent(shortcodedata);
		 $('#sm-modal').remove();
	  }else{
		  alert('Please Select Post!');return;
	  }

    });

}(jQuery));