var timer = 6000;

jQuery(document).ready(function($){

    var total = sentences.length - 1;

    for (var i = 0; i <= total; i++) {

        $('.hero_text_box').append('<p class="hero_title_list" id="hero_title_list'+i+'"></p>');
         
        var max = sentences[i].length - 1;

        for (var j = 0; j <= max; j++) {
            $('#hero_title_list'+i).append('<span style="transition: ' + Math.random()*3 + 's; transition-delay: ' + Math.random() + 's;">' + sentences[i].charAt(j) + '</span>'); 
        };

    }; 

    var maxBox = $('.hero_text_box > p').length;
    var r = 0;

    //$('#hero_title_list' + r).addClass('active');

var i=0;
function myLoop () {
   setTimeout(function () {
		
		//$('.hero_text_box #hero_title_list' + (i-1)).removeClass('active');
		
		$('.hero_text_box #hero_title_list' + i).addClass('active');   
		i++;                     
		if (i < maxBox) {            
		 myLoop();             
		}         
   }, 2000)
}

myLoop();  

});

