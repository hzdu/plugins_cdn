jQuery(document).ready(function($) {
if (typeof shapeanimation_mainId === 'undefined' || shapeanimation_mainId === null) {
    shapeanimation_mainId = mainId;
}
var html = '';
for (var i = 1; i <= 50; i ++) {
    html += '<div class="hero-shape-container--'+i+' hero-shape-animation"><div class="hero-random-shape"></div></div>';
}

document.querySelector('#'+shapeanimation_mainId).innerHTML += html;

var $allShapes = $("[class*='hero-shape-container--']");
/*$('.button').click(function (event) {
    $allShapes.toggleClass("stop-shape");
    var $this = $(this);
    $this.toggleClass('.button');
    if($this.hasClass('.button')){
        $this.text('Unfreeze shapes');         
    } else {
        $this.text('Freeze shapes');
    }
    event.preventDefault();
});*/

});