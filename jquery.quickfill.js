/**
 * Created by cshen on 2018/10/10.----2018/10/11
 */

(function ($) {

    $.fn.quickfill = function (data) {
        var _w = $(this).outerWidth();
        var _h = $(this).outerHeight();
        var curObject = this;
        //alert('width:' + _w);
        $(curObject).focus(function () {

            $("curObject").remove();//娓呮搴曢儴鍐呭
            var htmladd = "";
            htmladd += '<div style=" height:auto ;max-height: 300px;overflow-y: auto;background: white;display: none;border: 1px solid darkgray;position: fixed;">';
            if (data != '' || a != undefined) {
                for (i = 0; i < data.length; i++) {
                    htmladd += '<div class="x-l-1" style="text-indent: 0.5em;z-index:999999px;">' + data[i] + '</div>';
                }
            }
            htmladd += '</div>';
            var htmladdObject = $(htmladd);
            htmladdObject.css({left:$(curObject).offset().left,top:$(curObject).offset().top+_h});//wei zhi

            $(curObject).after(htmladdObject);//pin jie
            $(htmladdObject).slideDown(300);
            $(".x-l-1").mouseover(function () {
                $(this).css("background-color", "#E9E9E4");
            });
            $(".x-l-1").mouseout(function () {
                $(this).css("background-color", "white");
            });
            var cc = _w - 2;
            //$(htmladdObject).css("width", cc + "px");

            $(".x-l-1").css("width", cc + "px");
            $(".x-l-1").css("height", _h + "px");
            htmladdObject.children().click(function(){
                $(curObject).val($(this).text());
                $(htmladdObject).hide();
            });
            $(document).on("click",function(event){//鐐瑰嚮绌虹櫧澶勶紝璁剧疆鐨勫脊妗嗘秷澶�
                event.stopPropagation();
               if ($(event.target).find(htmladdObject).length !== 0 ){
                            $(htmladdObject).hide();
                        }
            });


        });

       /* $(document).on('click', ".x-l-1", function () {

        });*/


    };

})(jQuery);
