/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
jQuery(function($){
    $(document).ready(function(){
        $('.wplp_front_load_element').on('click',function(){
            var loaded_ids = [];
            var count = $(this).data('count');
            var wplp_container = $(this).parents(".wplp_container");
            var widget_id = wplp_container.data('post');
            // var theme_class = $(wplp_container).find(".li-item-id").attr("class").split(' ');
            var theme_class =  wplp_container.data('theme');
            var posts_per_page = $(this).closest('.wplp_container').data('max-elts');
            var per_page = $(this).closest('.wplp_container').data('per-page');
            $(wplp_container).find(".li-item-id").each(function() {
                var $this = $(this);
                loaded_ids.push($this.data('post'));
            });

            if (loaded_ids.length + parseInt(per_page) >= posts_per_page && parseInt(posts_per_page) !== 0) {
                $(this).remove();
            }
            var data = {
                'action' : 'loadMoreElement',
                'loaded_ids' : loaded_ids,
                'widget_id' : widget_id,
                'theme_class' : theme_class,
                'ajaxnonce' : wpsolAddonFrontJS.ajaxnonce
            };
            $.post(ajaxurl,data,function(response){
                response = JSON.parse(response);
                if (response.status === 'success') {
                    if (theme_class === 'material-horizontal') {
                        $(wplp_container).find(".wplp_listposts").append(response.data);
                    } else {
                        $res = $(response.data);
                        $wplp_grids[widget_id].append($res);
                        $res.imagesLoaded(function(){
                            $wplp_grids[widget_id].masonry('appended', $res);
                            $wplp_grids[widget_id].find('li').addClass('shown');
                        });
                    }
                }
                if(response.data === ''){
                    $('#wplp_front_load_element').css('display','none');
                }

                if (typeof count !== "undefined" && parseInt($(wplp_container).find(".li-item-id").length) === parseInt(count)) {
                    $('#wplp_front_load_element').css('display','none');
                }
            });

        });
    });
});